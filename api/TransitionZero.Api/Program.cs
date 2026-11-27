using Azure.Communication.Email;
using Azure.Extensions.AspNetCore.DataProtection.Blobs;
using Azure.Extensions.AspNetCore.DataProtection.Keys;
using Azure.Identity;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using TransitionZero.Api.Data;
using TransitionZero.Api.Services;

var builder = WebApplication.CreateBuilder(args);

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
if (string.IsNullOrWhiteSpace(connectionString))
{
    throw new InvalidOperationException("ConnectionStrings:DefaultConnection must be configured.");
}

var blobUri = builder.Configuration["DataProtection:BlobUri"];
var keyVaultKeyUri = builder.Configuration["DataProtection:KeyVaultKeyUri"];
if (!Uri.TryCreate(blobUri, UriKind.Absolute, out var dataProtectionBlobUri) ||
    !Uri.TryCreate(keyVaultKeyUri, UriKind.Absolute, out var dataProtectionKeyUri))
{
    throw new InvalidOperationException("DataProtection:BlobUri and DataProtection:KeyVaultKeyUri must be configured.");
}

var acsEndpoint = builder.Configuration["AcsEmail:Endpoint"];
if (!Uri.TryCreate(acsEndpoint, UriKind.Absolute, out var acsEndpointUri))
{
    throw new InvalidOperationException("AcsEmail:Endpoint must be configured with an absolute URL.");
}

var credential = new DefaultAzureCredential();

builder.Services.AddDbContext<AppDbContext>(options => options.UseSqlServer(connectionString));
builder.Services
    .AddIdentityApiEndpoints<ApplicationUser>(options =>
    {
        options.User.RequireUniqueEmail = true;
        options.SignIn.RequireConfirmedEmail = true;
        options.Password.RequiredLength = 8;
        options.Password.RequireDigit = false;
        options.Password.RequireLowercase = false;
        options.Password.RequireNonAlphanumeric = false;
        options.Password.RequireUppercase = false;
        options.Password.RequiredUniqueChars = 0;
    })
    .AddEntityFrameworkStores<AppDbContext>();

builder.Services.Configure<DataProtectionTokenProviderOptions>(options =>
    options.TokenLifespan = TimeSpan.FromMinutes(60));

builder.Services
    .AddDataProtection()
    .PersistKeysToAzureBlobStorage(dataProtectionBlobUri, credential)
    .ProtectKeysWithAzureKeyVault(dataProtectionKeyUri, credential);

var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() ?? [];
builder.Services.AddCors(options => options.AddPolicy("Frontend", policy =>
    policy.WithOrigins(allowedOrigins).AllowAnyHeader().AllowAnyMethod()));

builder.Services.AddSingleton(new EmailClient(acsEndpointUri, credential));
builder.Services.AddTransient<IEmailSender<ApplicationUser>, AcsEmailSender>();
builder.Services.AddControllers();

var app = builder.Build();

app.UseHttpsRedirection();
app.UseCors();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

var authEndpoints = app.MapGroup("/api/auth").RequireCors("Frontend");
authEndpoints.MapIdentityApi<ApplicationUser>();
authEndpoints.MapPost(
    "/logout",
    async (System.Security.Claims.ClaimsPrincipal principal, UserManager<ApplicationUser> userManager) =>
    {
        var user = await userManager.GetUserAsync(principal);
        if (user is not null)
        {
            await userManager.UpdateSecurityStampAsync(user);
        }

        return Results.NoContent();
    })
    .RequireAuthorization();

app.Run();
