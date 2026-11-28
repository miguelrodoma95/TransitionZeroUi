using System.Net;
using Azure.Communication.Email;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.WebUtilities;
using TransitionZero.Api.Data;

namespace TransitionZero.Api.Services;

public sealed class AcsEmailSender(
    EmailClient emailClient,
    IConfiguration configuration) : IEmailSender<ApplicationUser>
{
    private const int LinkLifetimeMinutes = 60;

    public Task SendConfirmationLinkAsync(ApplicationUser user, string email, string confirmationLink)
    {
        var link = WebUtility.HtmlDecode(confirmationLink);
        var query = QueryHelpers.ParseQuery(new Uri(link).Query);
        var userId = query["userId"].ToString();
        var code = query["code"].ToString();

        if (string.IsNullOrWhiteSpace(userId) || string.IsNullOrWhiteSpace(code))
        {
            throw new InvalidOperationException("The identity confirmation link was missing required values.");
        }

        var frontendLink = BuildFrontendLink(
            "/confirm-email",
            new Dictionary<string, string?> { ["userId"] = userId, ["code"] = code });

        return SendAsync(
            email,
            "Confirm your TransitionZero email",
            $"Use the link below to confirm your email address. It expires in {LinkLifetimeMinutes} minutes.\n\n{frontendLink}");
    }

    public Task SendPasswordResetLinkAsync(ApplicationUser user, string email, string resetLink)
    {
        var link = WebUtility.HtmlDecode(resetLink);
        var query = QueryHelpers.ParseQuery(new Uri(link).Query);
        var code = query["code"].ToString();

        if (string.IsNullOrWhiteSpace(code))
        {
            throw new InvalidOperationException("The identity password reset link was missing its code.");
        }

        return SendPasswordResetCodeAsync(user, email, code);
    }

    public Task SendPasswordResetCodeAsync(ApplicationUser user, string email, string resetCode)
    {
        var code = WebUtility.HtmlDecode(resetCode);
        var frontendLink = BuildFrontendLink(
            "/reset-password",
            new Dictionary<string, string?> { ["code"] = code, ["email"] = email });

        return SendAsync(
            email,
            "Reset your TransitionZero password",
            $"Use the link below to choose a new password. It expires in {LinkLifetimeMinutes} minutes. If you did not request this, you can ignore this email.\n\n{frontendLink}");
    }

    private string BuildFrontendLink(string path, IDictionary<string, string?> query)
    {
        var baseUrl = configuration["Frontend:BaseUrl"];
        if (!Uri.TryCreate(baseUrl, UriKind.Absolute, out var frontendUri))
        {
            throw new InvalidOperationException("Frontend:BaseUrl must be configured with an absolute URL.");
        }

        var linkBase = new Uri(frontendUri, path).ToString();
        return QueryHelpers.AddQueryString(linkBase, query);
    }

    private async Task SendAsync(string recipient, string subject, string plainText)
    {
        var senderAddress = configuration["AcsEmail:SenderAddress"];
        if (string.IsNullOrWhiteSpace(senderAddress))
        {
            throw new InvalidOperationException("AcsEmail:SenderAddress must be configured.");
        }

        var message = new EmailMessage(
            senderAddress,
            recipient,
            new EmailContent(subject) { PlainText = plainText });

        await emailClient.SendAsync(Azure.WaitUntil.Completed, message);
    }
}
