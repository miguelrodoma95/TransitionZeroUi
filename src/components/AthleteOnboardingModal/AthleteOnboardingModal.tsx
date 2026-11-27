import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { mergeClasses } from "@fluentui/react-components";
import type { FormEvent } from "react";
import type { AthleteProfile, Discipline, FirstRace, OnboardingPayload } from "../../types";
import { DISCIPLINES } from "../../types";
import { Brand } from "../Brand/Brand";
import { useAthleteOnboardingStyles } from "./AthleteOnboardingModal.styles";

interface AthleteOnboardingModalProps {
  email: string;
  onComplete: (profile: AthleteProfile) => void;
  onDismiss: () => void;
}

// TODO: Wire to API when backend exists — currently a no-op that resolves immediately.
async function completeOnboarding(payload: OnboardingPayload): Promise<void> {
  void payload;
}

export function AthleteOnboardingModal({ email, onComplete, onDismiss }: AthleteOnboardingModalProps) {
  const styles = useAthleteOnboardingStyles();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const suppressCloseRef = useRef(false);
  const [step, setStep] = useState<1 | 2>(1);
  const [displayName, setDisplayName] = useState("");
  const [disciplines, setDisciplines] = useState<Discipline[]>([]);
  const [raceName, setRaceName] = useState("");
  const [raceDate, setRaceDate] = useState("");
  const [raceCity, setRaceCity] = useState("");
  const [error, setError] = useState("");
  const [completing, setCompleting] = useState(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    suppressCloseRef.current = false;
    if (dialog && !dialog.open) dialog.showModal();
    return () => {
      if (dialog?.open) {
        suppressCloseRef.current = true;
        dialog.close();
      }
    };
  }, []);

  const toggleDiscipline = (discipline: Discipline) => {
    setDisciplines((selected) =>
      selected.includes(discipline)
        ? selected.filter((item) => item !== discipline)
        : [...selected, discipline],
    );
    setError("");
  };

  const createPayload = (firstRace?: FirstRace): OnboardingPayload => ({
    ...(displayName.trim() ? { displayName: displayName.trim() } : {}),
    disciplines,
    ...(firstRace ? { firstRace } : {}),
  });

  const finish = async (payload: OnboardingPayload) => {
    setCompleting(true);
    setError("");
    try {
      await completeOnboarding(payload);
      suppressCloseRef.current = true;
      onComplete({ email, ...payload });
    } catch (completionError: unknown) {
      setError(completionError instanceof Error ? completionError.message : "We couldn't finish onboarding. Please try again.");
    } finally {
      setCompleting(false);
    }
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (step === 1) {
      if (disciplines.length === 0) {
        setError("Choose at least one discipline to continue.");
        return;
      }
      setError("");
      setStep(2);
      return;
    }

    const trimmedRaceName = raceName.trim();
    if (!trimmedRaceName || !raceDate) {
      setError("Enter a race name and date, or choose the option to keep deciding.");
      return;
    }

    const firstRace: FirstRace = {
      name: trimmedRaceName,
      date: raceDate,
      ...(raceCity.trim() ? { city: raceCity.trim() } : {}),
    };
    void finish(createPayload(firstRace));
  };

  return (
    <dialog
      className={styles.dialog}
      ref={dialogRef}
      aria-labelledby="onboarding-title"
      aria-describedby="onboarding-description"
      onClose={() => {
        if (!suppressCloseRef.current && !dialogRef.current?.open) onDismiss();
      }}
    >
      <div className={styles.card}>
        <div className={styles.top}>
          <Brand />
          <span className={styles.stepCount}>STEP <strong>0{step}</strong> / 02</span>
        </div>
        <div className={styles.progress}>
          <span className={mergeClasses(step === 2 && styles.progressComplete)} />
        </div>
        <div className={styles.heading}>
          <p className={styles.eyebrow}><span className={styles.eyebrowMark} /> {step === 1 ? "ATHLETE PROFILE" : "FIRST RACE"}</p>
          <h2 id="onboarding-title">
            {step === 1 ? <>Let’s make it <em>personal.</em></> : <>Let’s plan your <em>first race.</em></>}
          </h2>
          <p id="onboarding-description">
            {step === 1
              ? "Tell us what you race."
              : "Add a race and we'll build your trip, itinerary, and gear list around it."}
          </p>
        </div>

        <form className={styles.form} onSubmit={submit} noValidate>
          {step === 1 ? (
            <>
              <div className={styles.field}>
                <label htmlFor="display-name">Display name <span>OPTIONAL</span></label>
                <input
                  autoFocus
                  id="display-name"
                  name="display-name"
                  type="text"
                  autoComplete="name"
                  placeholder="e.g. Alex Morgan"
                  value={displayName}
                  onChange={(event) => {
                    setDisplayName(event.target.value);
                    setError("");
                  }}
                />
              </div>

              <fieldset>
                <legend>Primary disciplines <span>SELECT ALL THAT APPLY</span></legend>
                <div className={styles.disciplineGrid}>
                  {DISCIPLINES.map(({ value, label }) => {
                    const selected = disciplines.includes(value);
                    return (
                      <label key={value} className={mergeClasses(styles.disciplineOption, selected && styles.disciplineOptionSelected)}>
                        <input
                          type="checkbox"
                          value={value}
                          checked={selected}
                          onChange={() => toggleDiscipline(value)}
                        />
                        <span className={mergeClasses(styles.disciplineCheck, selected && styles.disciplineCheckSelected)} aria-hidden="true" />
                        <span>{label}</span>
                      </label>
                    );
                  })}
                </div>
              </fieldset>
            </>
          ) : (
            <div className={styles.raceFields}>
              <div className={mergeClasses(styles.field, styles.raceNameField)}>
                <label htmlFor="race-name">Race name</label>
                <input
                  autoFocus
                  id="race-name"
                  name="race-name"
                  type="text"
                  required
                  placeholder="e.g. Chicago Marathon"
                  value={raceName}
                  onChange={(event) => {
                    setRaceName(event.target.value);
                    setError("");
                  }}
                />
              </div>
              <div className={styles.field}>
                <label htmlFor="race-date">Race date</label>
                <input
                  id="race-date"
                  name="race-date"
                  type="date"
                  required
                  value={raceDate}
                  onChange={(event) => {
                    setRaceDate(event.target.value);
                    setError("");
                  }}
                />
              </div>
              <div className={styles.field}>
                <label htmlFor="race-city">Race city <span>OPTIONAL</span></label>
                <input
                  id="race-city"
                  name="race-city"
                  type="text"
                  autoComplete="off"
                  placeholder="e.g. Chicago, IL"
                  value={raceCity}
                  onChange={(event) => setRaceCity(event.target.value)}
                />
              </div>
            </div>
          )}

          {error && <p className={styles.error} role="alert">{error}</p>}

          <div className={styles.actions}>
            {step === 2 && (
              <button
                className={styles.backButton}
                type="button"
                disabled={completing}
                onClick={() => {
                  setError("");
                  setStep(1);
                }}
              >
                <ArrowLeft size={16} /> Back
              </button>
            )}
            <button
              className={styles.submit}
              type="submit"
              disabled={completing || (step === 1 && disciplines.length === 0)}
            >
              {completing ? "Saving…" : step === 1 ? "Continue" : "Create my first trip"}
              <ArrowRight size={17} />
            </button>
          </div>
          {step === 2 && (
            <button
              className={styles.secondaryAction}
              type="button"
              disabled={completing}
              onClick={() => { void finish(createPayload()); }}
            >
              I’m still deciding / tracking lotteries
            </button>
          )}
          <p className={styles.footnote}>You can always update these details later.</p>
        </form>

        <button
          className={styles.close}
          type="button"
          aria-label="Close onboarding"
          onClick={() => {
            suppressCloseRef.current = true;
            dialogRef.current?.close();
            onDismiss();
          }}
        >
          <span aria-hidden="true">×</span>
        </button>
      </div>
    </dialog>
  );
}
