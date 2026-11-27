import { useState } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { AuthPage } from "../components/AuthPage/AuthPage";
import { ForgotPasswordPage, ResetPasswordPage } from "../components/PasswordReset/PasswordResetPage";
import { AthleteOnboardingModal } from "../components/AthleteOnboardingModal/AthleteOnboardingModal";
import { Dashboard } from "../components/Dashboard/Dashboard";
import { ConfirmEmailPage } from "../components/ConfirmEmail/ConfirmEmailPage";
import { getSavedProfile, saveProfile } from "../services/mockAuth";
import { getSignedInEmail, logout } from "../services/authService";
import type { AthleteProfile } from "../types";
import { useAppStyles, useGlobalStyles } from "./App.styles";

export default function App() {
  useGlobalStyles();
  const styles = useAppStyles();
  const [profile, setProfile] = useState<AthleteProfile | null>(getSavedProfile);
  const [onboardingEmail, setOnboardingEmail] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleAuthenticated = (email: string) => {
    const savedProfile = getSavedProfile();
    if (savedProfile?.email.toLowerCase() === email.toLowerCase()) {
      setProfile(savedProfile);
      navigate("/dashboard");
      return;
    }

    setProfile(null);
    setOnboardingEmail(email);
  };

  const handleOnboardingComplete = (newProfile: AthleteProfile) => {
    saveProfile(newProfile);
    setProfile(newProfile);
    setOnboardingEmail(null);
    navigate("/dashboard");
  };

  const handleSignOut = () => {
    void logout().catch(() => {
      console.error("The API could not confirm sign-out; local credentials were cleared.");
    }).finally(() => navigate("/sign-in"));
  };

  return (
    <div className={styles.root}>
      <Routes>
        <Route
          path="/"
          element={<Navigate to={getSignedInEmail() ? "/dashboard" : "/sign-in"} replace />}
        />
        <Route
          path="/sign-in"
          element={<AuthPage mode="sign-in" onAuthenticated={handleAuthenticated} />}
        />
        <Route
          path="/sign-up"
          element={<AuthPage mode="sign-up" onAuthenticated={handleAuthenticated} />}
        />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/confirm-email" element={<ConfirmEmailPage />} />
        <Route
          path="/dashboard"
          element={
            getSignedInEmail() === profile?.email.toLowerCase() && profile ? (
              <Dashboard profile={profile} onSignOut={handleSignOut} />
            ) : (
              <Navigate to="/sign-in" replace />
            )
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {onboardingEmail && (
        <AthleteOnboardingModal
          email={onboardingEmail}
          onComplete={handleOnboardingComplete}
          onDismiss={() => {
            setOnboardingEmail(null);
            navigate("/sign-in");
          }}
        />
      )}
    </div>
  );
}
