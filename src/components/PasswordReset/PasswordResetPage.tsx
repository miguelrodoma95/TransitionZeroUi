import { useEffect, useRef, useState } from "react";
import { ArrowRight, Check, Circle, CircleCheck, Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import type { FormEvent } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import { requestPasswordReset, resetPassword } from "../../services/passwordReset";
import { AuthLayout } from "../AuthPage/AuthPage";
import { usePasswordResetPageStyles } from "./PasswordResetPage.styles";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const RESET_EMAIL_KEY = "transitionzero.password-reset.email";

function readEmailFromState(state: unknown): string {
  if (typeof state !== "object" || state === null || !("email" in state)) return "";
  return typeof state.email === "string" ? state.email : "";
}

function SuccessIcon() {
  const styles = usePasswordResetPageStyles();

  return (
    <div className={styles.successIcon} aria-hidden="true">
      <CircleCheck size={48} strokeWidth={1.8} />
    </div>
  );
}

export function ForgotPasswordPage() {
  const styles = usePasswordResetPageStyles();
  const location = useLocation();
  const [email, setEmail] = useState(() => readEmailFromState(location.state));
  const [phase, setPhase] = useState<"request" | "sent">("request");
  const [emailError, setEmailError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headingRef.current?.focus();
  }, [phase]);

  useEffect(() => {
    if (phase !== "sent" || countdown <= 0) return undefined;

    const timer = window.setTimeout(() => {
      setCountdown((remaining) => Math.max(remaining - 1, 0));
    }, 1000);
    return () => window.clearTimeout(timer);
  }, [countdown, phase]);

  const submitRequest = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setEmailError("");

    const normalizedEmail = email.trim();
    if (!EMAIL_PATTERN.test(normalizedEmail)) {
      setEmailError("Enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      await requestPasswordReset(normalizedEmail);
      window.sessionStorage.setItem(RESET_EMAIL_KEY, normalizedEmail);
      setEmail(normalizedEmail);
      setCountdown(60);
      setPhase("sent");
    } finally {
      setLoading(false);
    }
  };

  const resendLink = async () => {
    setResending(true);
    try {
      await requestPasswordReset(email);
      setCountdown(60);
    } finally {
      setResending(false);
    }
  };

  const useDifferentEmail = () => {
    setEmail("");
    setEmailError("");
    setCountdown(0);
    setPhase("request");
  };

  return (
    <AuthLayout>
      <div className={styles.formWrap}>
        {phase === "request" ? (
          <>
            <div className={styles.heading}>
              <h2 ref={headingRef} tabIndex={-1}>Reset your password.</h2>
              <p>Enter the email you signed up with and we'll send you a reset link.</p>
            </div>
            <form className={styles.form} onSubmit={submitRequest} noValidate>
              <div className={styles.field}>
                <label htmlFor="reset-email">Email address</label>
                <div className={styles.inputWrap}>
                  <Mail size={17} aria-hidden="true" />
                  <input
                    id="reset-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    inputMode="email"
                    value={email}
                    onChange={(event) => {
                      setEmail(event.target.value);
                      setEmailError("");
                    }}
                    aria-invalid={Boolean(emailError)}
                    aria-describedby={emailError ? "reset-email-error" : undefined}
                  />
                </div>
                <div className={styles.errorLiveRegion} aria-live="polite">
                  {emailError && <p className={styles.errorMessage} id="reset-email-error">{emailError}</p>}
                </div>
              </div>
              <button className={styles.primaryButton} type="submit" disabled={loading}>
                {loading ? <><span className={styles.spinner} />Sending…</> : <>Send reset link<ArrowRight size={17} aria-hidden="true" /></>}
              </button>
            </form>
            <Link className={styles.textLink} to="/sign-in">← Back to sign in</Link>
          </>
        ) : (
          <div className={styles.statusContent}>
            <SuccessIcon />
            <h2 ref={headingRef} tabIndex={-1}>Check your email.</h2>
            <p>If an account exists for {email}, we've sent a reset link. It expires in 60 minutes.</p>
            <p>Didn't get it? Check your spam or junk folder.</p>
            <button
              className={styles.secondaryButton}
              type="button"
              onClick={resendLink}
              disabled={countdown > 0 || resending}
            >
              {resending ? <><span className={styles.spinnerDark} />Sending…</> : countdown > 0
                ? `Resend in 0:${String(Math.max(countdown - 1, 0)).padStart(2, "0")}`
                : "Resend link"}
            </button>
            <div className={styles.linkRow}>
              <button className={styles.textLink} type="button" onClick={useDifferentEmail}>Use a different email</button>
              <Link className={styles.textLink} to="/sign-in" state={{ email }}>Back to sign in</Link>
            </div>
          </div>
        )}
      </div>
    </AuthLayout>
  );
}

export function ResetPasswordPage() {
  const styles = usePasswordResetPageStyles();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  // TODO(backend): Validate this token server-side; this UI check is only for review.
  const invalidToken = !token || token === "expired";
  const [outcome, setOutcome] = useState<"form" | "success">("form");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showConfirmError, setShowConfirmError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const phase = invalidToken ? "expired" : outcome;
  const knownEmail = readEmailFromState(location.state) || window.sessionStorage.getItem(RESET_EMAIL_KEY) || "";

  useEffect(() => {
    headingRef.current?.focus();
  }, [phase]);

  const submitNewPassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const isPasswordTooShort = newPassword.length < 8;
    const passwordsMismatch = newPassword !== confirmPassword;
    setPasswordError(isPasswordTooShort ? "Password must be at least 8 characters." : "");
    setShowConfirmError(passwordsMismatch);
    if (isPasswordTooShort || passwordsMismatch || !token) return;

    setLoading(true);
    try {
      await resetPassword(token, newPassword);
      setOutcome("success");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className={styles.formWrap}>
        {phase === "expired" ? (
          <div className={styles.statusContent}>
            <h2 ref={headingRef} tabIndex={-1}>This link has expired.</h2>
            <p>Reset links are valid for 60 minutes and can only be used once. Request a new one to continue.</p>
            <Link className={styles.primaryButtonLink} to="/forgot-password">Request a new link<ArrowRight size={17} aria-hidden="true" /></Link>
            <Link className={styles.textLink} to="/sign-in">Back to sign in</Link>
          </div>
        ) : phase === "success" ? (
          <div className={styles.statusContent}>
            <SuccessIcon />
            <h2 ref={headingRef} tabIndex={-1}>Password updated.</h2>
            <p>You can now sign in with your new password.</p>
            <Link
              className={styles.primaryButtonLink}
              to="/sign-in"
              state={knownEmail ? { email: knownEmail } : undefined}
            >
              Sign in<ArrowRight size={17} aria-hidden="true" />
            </Link>
          </div>
        ) : (
          <>
            <div className={styles.heading}>
              <h2 ref={headingRef} tabIndex={-1}>Set a new password.</h2>
              <p>Choose a new password for your TransitionZero account.</p>
            </div>
            <form className={styles.form} onSubmit={submitNewPassword} noValidate>
              <div className={styles.field}>
                <label htmlFor="new-password">New password</label>
                <div className={styles.inputWrap}>
                  <LockKeyhole size={17} aria-hidden="true" />
                  <input
                    id="new-password"
                    name="new-password"
                    type={showNewPassword ? "text" : "password"}
                    autoComplete="new-password"
                    value={newPassword}
                    onChange={(event) => {
                      setNewPassword(event.target.value);
                      setPasswordError("");
                    }}
                    aria-invalid={Boolean(passwordError)}
                    aria-describedby={passwordError ? "new-password-error password-rule" : "password-rule"}
                  />
                  <button
                    className={styles.passwordVisibility}
                    type="button"
                    aria-label={showNewPassword ? "Hide new password" : "Show new password"}
                    aria-pressed={showNewPassword}
                    onClick={() => setShowNewPassword((visible) => !visible)}
                  >
                    {showNewPassword ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
                  </button>
                </div>
                {passwordError && <p className={styles.errorMessage} id="new-password-error" aria-live="polite">{passwordError}</p>}
                <ul className={styles.passwordChecklist} id="password-rule" aria-live="polite">
                  <li>
                    {newPassword.length >= 8
                      ? <span className={styles.checklistSatisfiedIcon}><Check size={12} aria-hidden="true" /></span>
                      : <Circle className={styles.checklistNeutralIcon} size={16} aria-hidden="true" />}
                    <span>At least 8 characters</span>
                  </li>
                </ul>
              </div>

              <div className={styles.field}>
                <label htmlFor="confirm-password">Confirm password</label>
                <div className={styles.inputWrap}>
                  <LockKeyhole size={17} aria-hidden="true" />
                  <input
                    id="confirm-password"
                    name="confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(event) => {
                      setConfirmPassword(event.target.value);
                      setShowConfirmError(false);
                    }}
                    onBlur={(event) => setShowConfirmError(event.currentTarget.value !== newPassword)}
                    onFocus={() => setShowConfirmError(false)}
                    aria-invalid={showConfirmError && confirmPassword !== newPassword}
                    aria-describedby={showConfirmError && confirmPassword !== newPassword ? "confirm-password-error" : undefined}
                  />
                  <button
                    className={styles.passwordVisibility}
                    type="button"
                    aria-label={showConfirmPassword ? "Hide confirmation password" : "Show confirmation password"}
                    aria-pressed={showConfirmPassword}
                    onClick={() => setShowConfirmPassword((visible) => !visible)}
                  >
                    {showConfirmPassword ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
                  </button>
                </div>
                <div className={styles.errorLiveRegion} aria-live="polite">
                  {showConfirmError && confirmPassword !== newPassword && (
                    <p className={styles.errorMessage} id="confirm-password-error">Passwords don't match</p>
                  )}
                </div>
              </div>

              <button className={styles.primaryButton} type="submit" disabled={loading}>
                {loading ? <><span className={styles.spinner} />Updating…</> : <>Update password<ArrowRight size={17} aria-hidden="true" /></>}
              </button>
            </form>
          </>
        )}
      </div>
    </AuthLayout>
  );
}
