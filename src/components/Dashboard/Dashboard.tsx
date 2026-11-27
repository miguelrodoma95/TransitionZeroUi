import { ArrowDownRight, ArrowRight, Bike, CalendarDays, CircleHelp, Compass, Footprints, LogOut, MapPin, Menu, Plus, Settings2, Sparkles, Waves } from "lucide-react";
import { useState } from "react";
import { mergeClasses } from "@fluentui/react-components";
import type { AthleteProfile } from "../../types";
import { DISCIPLINES } from "../../types";
import { Brand } from "../Brand/Brand";
import { DashboardEmptyState } from "../DashboardEmptyState/DashboardEmptyState";
import { useDashboardStyles } from "./Dashboard.styles";

interface DashboardProps {
  profile: AthleteProfile;
  onSignOut: () => void;
}

export function Dashboard({ profile, onSignOut }: DashboardProps) {
  if (!profile.firstRace) {
    return <DashboardEmptyState profile={profile} onSignOut={onSignOut} />;
  }

  return <ExistingDashboard profile={profile} onSignOut={onSignOut} />;
}

function ExistingDashboard({ profile, onSignOut }: DashboardProps) {
  const styles = useDashboardStyles();
  const [menuOpen, setMenuOpen] = useState(false);
  const sportIcons = [Footprints, Waves, Bike];
  const greetingName = profile.displayName || profile.email.split("@")[0].split(/[._-]/)[0];
  const avatarInitial = greetingName.charAt(0).toUpperCase();
  const firstRaceDate = profile.firstRace
    ? new Intl.DateTimeFormat(undefined, { dateStyle: "medium" })
      .format(new Date(`${profile.firstRace.date}T00:00:00`))
    : "";
  const firstRaceLocation = profile.firstRace?.city || firstRaceDate || "Still deciding";

  return (
    <div className={styles.shell}>
      <aside className={mergeClasses(styles.sidebar, menuOpen && styles.sidebarOpen)}>
        <div className={styles.sidebarBrand}><Brand /></div>
        <p className={styles.sidebarLabel}>WORKSPACE</p>
        <nav className={styles.sideNav} aria-label="Main navigation">
          <a href="/dashboard" className={mergeClasses(styles.sideNavItem, styles.sideNavItemActive)}><span className={mergeClasses(styles.navSymbol, styles.navSymbolActive)}><Compass size={17} /></span> Overview <span className={styles.navActiveDot} /></a>
          <button type="button" className={styles.sideNavItem} disabled><span className={styles.navSymbol}><MapPin size={17} /></span> My trips <span className={styles.navComing}>SOON</span></button>
          <button type="button" className={styles.sideNavItem} disabled><span className={styles.navSymbol}><CalendarDays size={17} /></span> Race calendar <span className={styles.navComing}>SOON</span></button>
        </nav>
        <div className={styles.sidebarSpacer} />
        <div className={styles.sidebarUpgrade}>
          <div className={styles.upgradeIcon}><Sparkles size={17} /></div>
          <strong>Your next start line<br />is waiting.</strong>
          <p>We’re getting your race travel tools ready.</p>
          <span>MORE COMING SOON <ArrowRight size={12} /></span>
          <div className={styles.upgradeOrbit} aria-hidden="true" />
        </div>
        <a className={mergeClasses(styles.sideNavItem, styles.sidebarHelp)} href="mailto:hello@transitionzero.app"><span className={styles.navSymbol}><CircleHelp size={17} /></span> Help & support</a>
        <div className={styles.sidebarProfile}>
          <span className={styles.avatar}>{avatarInitial}</span>
          <span className={styles.profileIdentity}><strong>{greetingName}</strong><small>{profile.email}</small></span>
          <button type="button" className={styles.profileMenuButton} aria-label="Sign out" onClick={onSignOut}><LogOut size={16} /></button>
        </div>
      </aside>

      <main className={styles.main}>
        <header className={styles.topbar}>
          <button className={styles.mobileMenu} type="button" aria-label="Toggle navigation" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}><Menu size={20} /></button>
          <div className={styles.breadcrumbs}><span>WORKSPACE</span><span>/</span><strong>OVERVIEW</strong></div>
          <div className={styles.topbarActions}>
            <span className={styles.topbarDate}><CalendarDays size={15} /> YOUR RACE PLANS</span>
            <button type="button" className={styles.topbarAvatar} aria-label="Sign out" onClick={onSignOut}>{avatarInitial}<LogOut size={12} /></button>
          </div>
        </header>

        <div className={styles.content}>
          <div className={styles.welcomeRow}>
            <div>
              <p className={styles.eyebrow}><span className={styles.eyebrowMark} /> YOUR RACE TRAVEL, IN RHYTHM</p>
              <h1 className={styles.welcomeTitle}>Good to have you, <em>{greetingName}.</em></h1>
              <p className={styles.welcomeSubtitle}>A little less logistics. A lot more looking forward.</p>
            </div>
            <div className={styles.seasonChip}><span className={styles.greenDot} /> YOUR ATHLETE PROFILE <ArrowDownRight size={14} /></div>
          </div>

          <section className={styles.hero}>
            <div className={styles.heroText}>
              <span className={styles.heroKicker}><span /> YOUR FIRST RACE</span>
              <h2 className={styles.heroTitle}>{profile.firstRace?.name ?? <>Your next race<br />starts <em>when you’re ready.</em></>}</h2>
              <p className={styles.heroDescription}>
                {profile.firstRace
                  ? `${firstRaceDate}${profile.firstRace.city ? ` · ${profile.firstRace.city}` : ""}`
                  : "No race added yet. You can decide when you’re ready."}
              </p>
              <div className={styles.heroLocation}>
                <MapPin size={15} />
                <span>{profile.firstRace?.city ? "RACE CITY" : profile.firstRace ? "RACE DATE" : "RACE STATUS"}</span>
                <strong>{firstRaceLocation}</strong>
              </div>
            </div>
            <div className={styles.heroVisual} aria-hidden="true">
              <div className={styles.sunDisc} />
              <div className={mergeClasses(styles.ridge, styles.ridgeBack)} />
              <div className={mergeClasses(styles.ridge, styles.ridgeFront)} />
              <div className={styles.heroRoute}><span /><i /><span /></div>
              <span className={mergeClasses(styles.visualText, styles.visualCaption)}>THE JOURNEY BEGINS</span>
            </div>
            <div className={styles.heroIndex}>TZ / 001</div>
          </section>

          <section className={styles.dashboardSection}>
            <div className={styles.sectionHeading}>
              <div><p className={styles.eyebrow}><span className={styles.eyebrowMark} /> YOUR STARTING POINT</p><h2>A few things about you.</h2></div>
              <button type="button" className={styles.editProfile} disabled title="Profile editing is coming soon"><Settings2 size={15} /> EDIT PROFILE</button>
            </div>
            <div className={styles.profileCards}>
              <article className={styles.infoCard}>
                <div className={styles.infoCardHeading}><span className={styles.infoIcon}><Footprints size={17} /></span><span>PRIMARY DISCIPLINES</span><span className={styles.cardCount}>{String(profile.disciplines.length).padStart(2, "0")}</span></div>
                <div className={styles.sportTags}>{profile.disciplines.map((discipline, index) => {
                  const SportIcon = sportIcons[index % sportIcons.length];
                  const label = DISCIPLINES.find((item) => item.value === discipline)?.label ?? discipline;
                  return <span className={styles.sportTag} key={discipline}><SportIcon size={14} />{label}</span>;
                })}</div>
              </article>
              <article className={styles.infoCard}>
                <div className={styles.infoCardHeading}><span className={styles.infoIcon}><CalendarDays size={17} /></span><span>FIRST RACE</span></div>
                <strong className={styles.locationValue}>{profile.firstRace?.name ?? "Still deciding"}</strong>
                <span className={styles.cardCaption}>
                  {profile.firstRace
                    ? `${firstRaceDate}${profile.firstRace.city ? ` · ${profile.firstRace.city}` : ""}`
                    : "ADD A RACE WHEN YOU’RE READY"}
                </span>
              </article>
            </div>
          </section>

          <section className={styles.nextStepCard}>
            <div className={styles.nextStepIcon}><Plus size={19} /></div>
            <div>
              <span className={styles.nextStepLabel}>{profile.firstRace ? "RACE ADDED" : "YOUR NEXT STEP"}</span>
              <h2>{profile.firstRace ? "Your first race is on the calendar." : "Still deciding?"}</h2>
              <p>
                {profile.firstRace
                  ? "Your race details are saved. Trip planning will be available when it’s ready."
                  : "No rush. You can add your first race whenever you’re ready."}
              </p>
            </div>
            <span className={styles.nextStepStatus}><span /> {profile.firstRace ? "RACE DETAILS SAVED" : "READY WHEN YOU ARE"}</span>
          </section>
          <footer className={styles.dashboardFooter}><Brand /><span>Built for the journey to your next start line.</span><button type="button" onClick={onSignOut}>SIGN OUT</button></footer>
        </div>
      </main>
    </div>
  );
}
