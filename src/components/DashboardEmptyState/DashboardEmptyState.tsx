import { useEffect, useState } from "react";
import {
  ArrowRight,
  Bike,
  CalendarDays,
  CircleHelp,
  Compass,
  Dumbbell,
  Footprints,
  LogOut,
  MapPin,
  Menu,
  Waves,
  X,
  UserRound,
} from "lucide-react";
import { mergeClasses } from "@fluentui/react-components";
import type { AthleteProfile, Discipline } from "../../types";
import { DISCIPLINES } from "../../types";
import { Brand } from "../Brand/Brand";
import { useDashboardEmptyStateStyles } from "./DashboardEmptyState.styles";
import {
  defaultRaceSuggestionIds,
  mockRaceSuggestions,
  type RaceSuggestion,
} from "../../utils/mockData/raceSuggestions";

interface DashboardEmptyStateProps {
  profile: AthleteProfile;
  onSignOut: () => void;
}

interface DialogContent {
  heading: string;
  description: string;
  details?: string[];
}

const disciplineIcons = {
  run: Footprints,
  triathlon: Bike,
  hyrox: Dumbbell,
  cycling: Bike,
  "open-water-swim": Waves,
} satisfies Record<Discipline, typeof Footprints>;

function getRaceSuggestions(disciplines: Discipline[]): RaceSuggestion[] {
  if (disciplines.length === 0) {
    return defaultRaceSuggestionIds.flatMap((id) => {
      const suggestion = mockRaceSuggestions.find((race) => race.id === id);
      return suggestion ? [suggestion] : [];
    });
  }

  const groupedSuggestions = disciplines.map((discipline) =>
    mockRaceSuggestions.filter((race) => race.discipline === discipline),
  );
  const selectedSuggestions: typeof mockRaceSuggestions = [];

  for (let index = 0; selectedSuggestions.length < 6; index += 1) {
    for (const suggestions of groupedSuggestions) {
      const suggestion = suggestions[index];
      if (suggestion && selectedSuggestions.length < 6) {
        selectedSuggestions.push(suggestion);
      }
    }
  }

  return selectedSuggestions;
}

function getDisciplineLabel(discipline: Discipline): string {
  return DISCIPLINES.find((item) => item.value === discipline)?.label ?? discipline;
}

function RaceCard({
  race,
  onPlan,
  onTrack,
}: {
  race: RaceSuggestion;
  onPlan: () => void;
  onTrack: () => void;
}) {
  const styles = useDashboardEmptyStateStyles();
  const SportIcon = disciplineIcons[race.discipline];

  return (
    <article className={styles.raceCard}>
      <div className={styles.raceDiscipline}>
        <SportIcon size={15} aria-hidden="true" />
        <span>{getDisciplineLabel(race.discipline)}</span>
      </div>
      <h3 className={styles.raceName}>{race.name}</h3>
      <p className={styles.raceLocation}><MapPin size={14} aria-hidden="true" />{race.location}</p>
      <p className={styles.raceDate}><CalendarDays size={14} aria-hidden="true" />{race.typicalDate}</p>
      <span className={styles.raceDistance}>{race.distance}</span>
      {race.entry !== "Open entry" && (
        <span className={styles.raceEntry}>{race.entryLabel ?? race.entry}</span>
      )}
      <div className={styles.raceActions}>
        {race.entry === "Open entry" ? (
          <button className={styles.racePrimaryAction} type="button" onClick={onPlan}>Plan this race</button>
        ) : (
          <button className={styles.racePrimaryAction} type="button" onClick={onTrack}>Track it</button>
        )}
      </div>
    </article>
  );
}

export function DashboardEmptyState({ profile, onSignOut }: DashboardEmptyStateProps) {
  const styles = useDashboardEmptyStateStyles();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dialog, setDialog] = useState<DialogContent | null>(null);
  const [activeDiscipline, setActiveDiscipline] = useState<Discipline | null>(null);
  const greetingName = profile.displayName || profile.email.split("@")[0].split(/[._-]/)[0];
  const avatarInitial = greetingName.charAt(0).toUpperCase();
  const suggestions = getRaceSuggestions(profile.disciplines);
  const visibleSuggestions = activeDiscipline
    ? mockRaceSuggestions.filter((race) => race.discipline === activeDiscipline)
    : suggestions;

  useEffect(() => {
    if (!dialog) return undefined;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setDialog(null);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [dialog]);

  return (
    <div className={styles.shell}>
      {menuOpen && (
        <button
          aria-label="Close navigation"
          className={styles.sidebarBackdrop}
          onClick={() => setMenuOpen(false)}
          type="button"
        />
      )}
      <aside className={mergeClasses(styles.sidebar, menuOpen && styles.sidebarOpen)}>
        <div className={styles.sidebarBrand}><div className={styles.brandLockup}><Brand /></div></div>
        <p className={styles.sidebarLabel}>WORKSPACE</p>
        <nav className={styles.sideNav} aria-label="Main navigation">
          <a href="/dashboard" aria-current="page" className={mergeClasses(styles.sideNavItem, styles.sideNavItemActive)}>
            <Compass size={17} aria-hidden="true" />Overview
          </a>
        </nav>
        <div className={styles.sidebarSpacer} />
        <a className={styles.sideNavItem} href="mailto:hello@transitionzero.app">
          <CircleHelp size={17} aria-hidden="true" />Help &amp; support
        </a>
        <div className={styles.sidebarProfile}>
          <span className={styles.avatar}>{avatarInitial}</span>
          <span className={styles.profileIdentity}><strong>{greetingName}</strong><small>{profile.email}</small></span>
          <button type="button" className={styles.profileMenuButton} aria-label="Sign out" onClick={onSignOut}><LogOut size={16} /></button>
        </div>
      </aside>

      <main className={styles.main}>
        <div className={styles.topbar}>
          <button
            className={styles.mobileMenu}
            type="button"
            aria-label="Toggle navigation"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((isOpen) => !isOpen)}
          >
            <Menu size={20} />
          </button>
          <div className={styles.breadcrumbs}><span>WORKSPACE</span><span>/</span><strong>OVERVIEW</strong></div>
          <button type="button" className={styles.topbarSignOut} onClick={onSignOut} aria-label="Sign out">
            <LogOut size={16} />
          </button>
        </div>

        <div className={styles.content}>
          <header className={styles.welcomeRow}>
            <div>
              <p className={styles.eyebrow}><span className={styles.eyebrowMark} />YOUR RACE TRAVEL, IN RHYTHM</p>
              <h1 className={styles.welcomeTitle}>Good to have you, <em>{greetingName}</em>.</h1>
              <p className={styles.welcomeSubtitle}>A little less logistics. A lot more looking forward.</p>
            </div>
            <button
              type="button"
              className={styles.profileAccess}
              onClick={() => setDialog({
                heading: "Athlete profile",
                description: `${greetingName} · ${profile.email}`,
                details: profile.disciplines.map(getDisciplineLabel),
              })}
            >
              <UserRound size={16} aria-hidden="true" />Athlete profile<ArrowRight size={14} aria-hidden="true" />
            </button>
          </header>

          <section className={styles.hero} aria-labelledby="first-race-heading">
            <div className={styles.heroText}>
              <p className={styles.heroKicker}><span />YOUR FIRST RACE</p>
              <h2 className={styles.heroTitle} id="first-race-heading">
                Your next race starts<br /><em>when you’re ready.</em>
              </h2>
              <p className={styles.heroDescription}>No race added yet. You can decide when you’re ready.</p>
              <div className={styles.heroActions}>
                <button
                  type="button"
                  className={styles.heroPrimary}
                  onClick={() => setDialog({
                    heading: "Add your first race",
                    description: "Start with the race name and date.",
                  })}
                >
                  <span aria-hidden="true">+</span>Add your first race
                </button>
                <a className={styles.heroSecondary} href="#popular-races">Browse popular races ↓</a>
              </div>
            </div>
            <div className={styles.heroArtwork} aria-hidden="true">
              <div className={styles.heroGrid} />
              <svg className={styles.routeDrawing} viewBox="0 0 440 250" fill="none">
                <path d="M22 192C89 192 76 82 150 82s58 107 125 107 53-126 143-126" />
                <circle cx="22" cy="192" r="7" />
                <circle cx="150" cy="82" r="7" />
                <circle cx="275" cy="189" r="7" />
                <circle cx="418" cy="63" r="9" />
              </svg>
              <span className={styles.routeLabel}><MapPin size={13} />THE JOURNEY BEGINS</span>
            </div>
          </section>

          <section className={styles.raceSection} id="popular-races" aria-labelledby="popular-races-heading">
            <div className={styles.sectionHeading}>
              <div>
                <p className={styles.eyebrow}><span className={styles.eyebrowMark} />{profile.disciplines.length ? "FOR YOUR DISCIPLINES" : "RACE IDEAS TO EXPLORE"}</p>
                <h2 id="popular-races-heading">{profile.disciplines.length ? "Popular in your sports." : "Popular races."}</h2>
              </div>
            </div>
            {profile.disciplines.length > 0 && (
              <div className={styles.disciplineChips} aria-label="Filter races by discipline">
                {activeDiscipline && (
                  <button
                    className={styles.disciplineChip}
                    type="button"
                    aria-label="Show all race suggestions"
                    onClick={() => setActiveDiscipline(null)}
                  >
                    All
                  </button>
                )}
                {profile.disciplines.map((discipline) => {
                  const SportIcon = disciplineIcons[discipline];
                  return (
                    <button
                      className={mergeClasses(
                        styles.disciplineChip,
                        activeDiscipline === discipline && styles.disciplineChipActive,
                      )}
                      key={discipline}
                      type="button"
                      aria-pressed={activeDiscipline === discipline}
                      onClick={() => setActiveDiscipline((active) => active === discipline ? null : discipline)}
                    >
                      <SportIcon size={14} aria-hidden="true" />{getDisciplineLabel(discipline)}
                    </button>
                  );
                })}
              </div>
            )}
            <div className={styles.raceGrid}>
              {visibleSuggestions.map((race) => (
                <RaceCard
                  key={race.id}
                  race={race}
                  onPlan={() => setDialog({
                    heading: `Plan ${race.name}`,
                    description: "Add this race to start planning your weekend.",
                  })}
                  onTrack={() => setDialog({
                    heading: `Track ${race.name}`,
                    description: "Keep an eye on its next registration window.",
                  })}
                />
              ))}
            </div>
          </section>

          <footer className={styles.dashboardFooter}>
            <div className={styles.brandLockup}><Brand /></div>
            <span>Built for the journey to your next start line.</span>
            <button type="button" onClick={onSignOut}>Sign out</button>
          </footer>
        </div>
      </main>

      {dialog && (
        <div className={styles.dialogBackdrop} onMouseDown={(event) => {
          if (event.target === event.currentTarget) setDialog(null);
        }}>
          <section className={styles.dialog} role="dialog" aria-modal="true" aria-labelledby="overview-dialog-heading">
            <button className={styles.dialogClose} type="button" aria-label="Close dialog" autoFocus onClick={() => setDialog(null)}>
              <X size={18} />
            </button>
            <p className={styles.eyebrow}><span className={styles.eyebrowMark} />TRANSITIONZERO</p>
            <h2 id="overview-dialog-heading">{dialog.heading}</h2>
            <p className={styles.dialogDescription}>{dialog.description}</p>
            {dialog.details && dialog.details.length > 0 && (
              <div className={styles.dialogDetails}>
                {dialog.details.map((detail) => <span key={detail}>{detail}</span>)}
              </div>
            )}
            <button className={styles.dialogDone} type="button" onClick={() => setDialog(null)}>Close</button>
          </section>
        </div>
      )}
    </div>
  );
}
