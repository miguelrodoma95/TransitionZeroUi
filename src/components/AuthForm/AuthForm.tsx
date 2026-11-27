import { useState } from "react";
import { mergeClasses } from "@fluentui/react-components";
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { signIn, signUp } from "../../services/mockAuth";
import type { AuthMode } from "../../types";
import type { FormEvent } from "react";
import { useAuthFormStyles } from "./AuthForm.styles";

interface AuthFormProps {
  mode: AuthMode;
  onAuthenticated: (email: string) => void;
}

export function AuthForm({ mode, onAuthenticated }: AuthFormProps) {
  const styles = useAuthFormStyles();
  const location = useLocation();
  const isSignUp = mode === "sign-up";
  const [email, setEmail] = useState(() => {
    const state = location.state;
    return typeof state === "object" && state !== null && "email" in state && typeof state.email === "string"
      ? state.email
      : "";
  });
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [invalidField, setInvalidField] = useState<"email" | "password" | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setInvalidField(null);

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Enter a valid email address.");
      setInvalidField("email");
      return;
    }
    if (password.length < 8) {
      setError("Your password must be at least 8 characters.");
      setInvalidField("password");
      return;
    }

    setLoading(true);
    try {
      if (isSignUp) await signUp(email);
      else await signIn(email);
      onAuthenticated(email.trim().toLowerCase());
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Something went wrong. Please try again.");
      setInvalidField("email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.formWrap}>
      <div className={styles.formHeading}>
        <h2>{isSignUp ? "Start planning your race weekend." : "Welcome back."}</h2>
        <p>
          {isSignUp
            ? "One place for travel, itinerary, gear, and spectators."
            : "Sign in to your race weekends, travel, and gear lists."}
        </p>
      </div>

      <nav className={styles.tabs} aria-label="Account access">
        <Link aria-current={!isSignUp ? "page" : undefined} className={mergeClasses(styles.tab, !isSignUp && styles.tabActive)} to="/sign-in">Sign in</Link>
        <Link aria-current={isSignUp ? "page" : undefined} className={mergeClasses(styles.tab, isSignUp && styles.tabActive)} to="/sign-up">Create account</Link>
      </nav>

      <form className={styles.authForm} onSubmit={submit} noValidate>
        <label htmlFor="email">Email address</label>
        <div className={styles.inputWrap}>
          <Mail size={17} aria-hidden="true" />
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            aria-invalid={invalidField === "email"}
            aria-describedby={error ? "auth-error" : undefined}
          />
        </div>

        <div className={styles.labelRow}>
          <label htmlFor="password">Password</label>
          {isSignUp
            ? <span className={styles.passwordHint}>At least 8 characters</span>
            : <Link className={styles.passwordLink} to="/forgot-password" state={{ email: email.trim() }}>Forgot password?</Link>}
        </div>
        <div className={styles.inputWrap}>
          <LockKeyhole size={17} aria-hidden="true" />
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete={isSignUp ? "new-password" : "current-password"}
            placeholder="Enter password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            aria-invalid={invalidField === "password"}
            aria-describedby={error ? "auth-error" : undefined}
          />
          <button
            className={styles.passwordVisibility}
            type="button"
            aria-label={showPassword ? "Hide password" : "Show password"}
            aria-pressed={showPassword}
            onClick={() => setShowPassword((visible) => !visible)}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {error && <p className={styles.formError} id="auth-error" role="alert">{error}</p>}

        <button className={styles.submitButton} type="submit" disabled={loading}>
          {loading ? <><span className={styles.spinner} /> {isSignUp ? "Creating your account…" : "Signing you in…"}</> : <>{isSignUp ? "Create your account" : "Sign in"} <ArrowRight size={17} /></>}
        </button>
      </form>

      <p className={styles.authLegal}>
        By continuing, you agree to our <a href="#terms">Terms</a> and <a href="#privacy">Privacy Policy</a>.
      </p>
    </div>
  );
}
