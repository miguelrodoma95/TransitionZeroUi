const ACCESS_TOKEN_KEY = "transitionzero.auth.access-token";
const REFRESH_TOKEN_KEY = "transitionzero.auth.refresh-token";
const EMAIL_KEY = "transitionzero.auth.email";
const PENDING_CONFIRMATION_EMAIL_KEY = "transitionzero.auth.pending-confirmation-email";
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? "").replace(/\/$/, "");

interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: string;
}

export interface AuthInfo {
  email: string;
  isEmailConfirmed: boolean;
}

interface ApiProblem {
  title?: string;
  detail?: string;
  errors?: Record<string, string[]>;
}

export class AuthApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly detail?: string,
  ) {
    super(message);
    this.name = "AuthApiError";
  }
}

export class EmailNotConfirmedError extends AuthApiError {
  constructor() {
    super("Confirm your email address before signing in.", 401, "NotAllowed");
    this.name = "EmailNotConfirmedError";
  }
}

function getApiUrl(path: string): string {
  if (!API_BASE_URL) {
    throw new Error("VITE_API_BASE_URL is not configured.");
  }
  return `${API_BASE_URL}${path}`;
}

async function readProblem(response: Response): Promise<ApiProblem> {
  try {
    return await response.json() as ApiProblem;
  } catch {
    return {};
  }
}

async function request<T>(
  path: string,
  options: RequestInit = {},
  authenticated = false,
): Promise<T> {
  const headers = new Headers(options.headers);
  if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  if (authenticated) {
    const token = window.localStorage.getItem(ACCESS_TOKEN_KEY);
    if (token) headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(getApiUrl(path), {
    ...options,
    headers,
    credentials: "omit",
  });

  if (!response.ok) {
    const problem = await readProblem(response);
    const detail = problem.detail ?? Object.values(problem.errors ?? {}).flat().join(" ");
    throw new AuthApiError(detail || problem.title || "The request could not be completed.", response.status, problem.detail);
  }

  if (response.status === 204) return undefined as T;
  if (!response.headers.get("content-type")?.includes("application/json")) {
    await response.body?.cancel();
    return undefined as T;
  }
  const body = await response.text();
  return body ? JSON.parse(body) as T : undefined as T;
}

function storeTokens(tokens: TokenResponse, email: string): void {
  window.localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);
  window.localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
  window.localStorage.setItem(EMAIL_KEY, email.trim().toLowerCase());
}

export function getSignedInEmail(): string | null {
  return window.localStorage.getItem(EMAIL_KEY);
}

export function getPendingConfirmationEmail(): string {
  return window.localStorage.getItem(PENDING_CONFIRMATION_EMAIL_KEY) ?? "";
}

export async function register(email: string, password: string): Promise<void> {
  const normalizedEmail = email.trim().toLowerCase();
  window.localStorage.setItem(PENDING_CONFIRMATION_EMAIL_KEY, normalizedEmail);

  try {
    await request<void>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ email: normalizedEmail, password }),
    });
  } catch (error) {
    if (error instanceof AuthApiError) return;
    throw error;
  }
}

export async function login(email: string, password: string): Promise<void> {
  const normalizedEmail = email.trim().toLowerCase();
  try {
    const tokens = await request<TokenResponse>("/api/auth/login?useCookies=false", {
      method: "POST",
      body: JSON.stringify({ email: normalizedEmail, password }),
    });
    storeTokens(tokens, normalizedEmail);
  } catch (error) {
    if (error instanceof AuthApiError && error.status === 401 && error.detail === "NotAllowed") {
      window.localStorage.setItem(PENDING_CONFIRMATION_EMAIL_KEY, normalizedEmail);
      throw new EmailNotConfirmedError();
    }
    throw error;
  }
}

export async function refresh(): Promise<void> {
  const refreshToken = window.localStorage.getItem(REFRESH_TOKEN_KEY);
  const email = getSignedInEmail();
  if (!refreshToken || !email) {
    clearSession();
    throw new Error("There is no active session to refresh.");
  }

  try {
    const tokens = await request<TokenResponse>("/api/auth/refresh", {
      method: "POST",
      body: JSON.stringify({ refreshToken }),
    });
    storeTokens(tokens, email);
  } catch (error) {
    clearSession();
    throw error;
  }
}

export async function logout(): Promise<void> {
  try {
    if (window.localStorage.getItem(ACCESS_TOKEN_KEY)) {
      await request<void>("/api/auth/logout", { method: "POST" }, true);
    }
  } finally {
    clearSession();
  }
}

function clearSession(): void {
  window.localStorage.removeItem(ACCESS_TOKEN_KEY);
  window.localStorage.removeItem(REFRESH_TOKEN_KEY);
  window.localStorage.removeItem(EMAIL_KEY);
}

export async function resendConfirmation(email: string): Promise<void> {
  await request<void>("/api/auth/resendConfirmationEmail", {
    method: "POST",
    body: JSON.stringify({ email: email.trim().toLowerCase() }),
  });
}

export async function forgotPassword(email: string): Promise<void> {
  const response = await fetch(getApiUrl("/api/auth/forgotPassword"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: email.trim().toLowerCase() }),
    credentials: "omit",
  });

  if (!response.ok) {
    await response.body?.cancel();
  }
}

export async function resetPassword(email: string, code: string, newPassword: string): Promise<void> {
  await request<void>("/api/auth/resetPassword", {
    method: "POST",
    body: JSON.stringify({ email: email.trim().toLowerCase(), resetCode: code, newPassword }),
  });
}

export async function confirmEmail(userId: string, code: string): Promise<void> {
  const query = new URLSearchParams({ userId, code });
  await request<void>(`/api/auth/confirmEmail?${query.toString()}`);
  window.localStorage.removeItem(PENDING_CONFIRMATION_EMAIL_KEY);
}

export async function getInfo(): Promise<AuthInfo> {
  return request<AuthInfo>("/api/auth/manage/info", {}, true);
}
