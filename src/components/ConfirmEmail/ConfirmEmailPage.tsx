import { useEffect, useRef, useState } from "react";
import { ArrowRight, CircleCheck } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { AuthApiError, confirmEmail, getPendingConfirmationEmail, resendConfirmation } from "../../services/authService";
import { AuthLayout } from "../AuthPage/AuthPage";
import { usePasswordResetPageStyles } from "../PasswordReset/PasswordResetPage.styles";

type ConfirmationStatus = "confirming" | "success" | "failed";

export function ConfirmEmailPage() {
  const styles = usePasswordResetPageStyles();
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("userId");
  const code = searchParams.get("code");
  const [status, setStatus] = useState<ConfirmationStatus>("confirming");
  const [pendingEmail] = useState(getPendingConfirmationEmail);
  const [resendCountdown, setResendCountdown] = useState(0);
  const [resending, setResending] = useState(false);
  const [message, setMessage] = useState("");
  const requestKey = useRef<string | null>(null);

  useEffect(() => {
    if (resendCountdown <= 0) return undefined;
    const timer = window.setTimeout(
      () => setResendCountdown((remaining) => Math.max(remaining - 1, 0)),
      1000,
    );
    return () => window.clearTimeout(timer);
  }, [resendCountdown]);

  useEffect(() => {
    if (requestKey.current === `${userId ?? ""}:${code ?? ""}`) return;
    requestKey.current = `${userId ?? ""}:${code ?? ""}`;

    if (!userId || !code) {
      setStatus("failed");
      return;
    }

    const currentRequestKey = requestKey.current;
    void confirmEmail(userId, code)
      .then(() => {
        if (requestKey.current === currentRequestKey) {
          setStatus("success");
        }
      })
      .catch((error: unknown) => {
        if (requestKey.current !== currentRequestKey) return;
        if (!(error instanceof AuthApiError)) {
          setMessage("We couldn't reach the service. Check your connection and try again.");
        }
        setStatus("failed");
      });
  }, [code, userId]);

  const resendConfirmationEmail = async () => {
    if (!pendingEmail) return;

    setResending(true);
    setMessage("");
    try {
      await resendConfirmation(pendingEmail);
      setResendCountdown(60);
    } catch {
      setMessage("We couldn't reach the service. Check your connection and try again.");
    } finally {
      setResending(false);
    }
  };

  return (
    <AuthLayout>
      <div className={styles.formWrap}>
        <div className={styles.statusContent}>
          {status === "confirming" ? (
            <>
              <span className={styles.spinnerDark} aria-hidden="true" />
              <h2>Confirming your email…</h2>
              <p>Please wait while we verify your confirmation link.</p>
            </>
          ) : status === "success" ? (
            <>
              <div className={styles.successIcon} aria-hidden="true"><CircleCheck size={48} strokeWidth={1.8} /></div>
              <h2>Email confirmed.</h2>
              <p>Your email address is confirmed. You can now sign in to TransitionZero.</p>
              <Link className={styles.primaryButtonLink} to="/sign-in" state={{ email: pendingEmail }}>
                Sign in<ArrowRight size={17} aria-hidden="true" />
              </Link>
            </>
          ) : (
            <>
              <h2>This link couldn't be confirmed.</h2>
              <p>
                The link may be invalid, expired, or already used. Confirmation links are valid for 60 minutes.
              </p>
              {pendingEmail && (
                <button
                  className={styles.secondaryButton}
                  type="button"
                  onClick={resendConfirmationEmail}
                  disabled={resending || resendCountdown > 0}
                >
                  {resending ? <><span className={styles.spinnerDark} />Sending…</> : resendCountdown > 0
                    ? `Resend in ${Math.floor(resendCountdown / 60)}:${String(resendCountdown % 60).padStart(2, "0")}`
                    : "Resend confirmation email"}
                </button>
              )}
              {message && <p className={styles.errorMessage} role="alert">{message}</p>}
              <Link className={styles.primaryButtonLink} to="/sign-in" state={{ email: pendingEmail }}>
                Back to sign in<ArrowRight size={17} aria-hidden="true" />
              </Link>
            </>
          )}
        </div>
      </div>
    </AuthLayout>
  );
}
