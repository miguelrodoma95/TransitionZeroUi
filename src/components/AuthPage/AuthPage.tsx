import { CircleHelp, ListChecks, Map, Plane } from "lucide-react";
import type { ReactNode } from "react";
import type { AuthMode } from "../../types";
import { Brand } from "../Brand/Brand";
import { useAuthPageStyles } from "./AuthPage.styles";
import { AuthForm } from "../AuthForm/AuthForm";

interface AuthPageProps {
  mode: AuthMode;
  onAuthenticated: (email: string) => void;
}

export function AuthPage({ mode, onAuthenticated }: AuthPageProps) {
  return (
    <AuthLayout>
      <AuthForm mode={mode} onAuthenticated={onAuthenticated} />
    </AuthLayout>
  );
}

export function AuthLayout({ children }: { children: ReactNode }) {
  const styles = useAuthPageStyles();

  return (
    <main className={styles.layout}>
      <section className={styles.story} aria-label="About TransitionZero">
        <div className={styles.gallery} aria-hidden="true">
          <img className={styles.galleryImage} src="/images/landing_swim.jpg" alt="" />
          <img className={styles.galleryImage} src="/images/landing_bike.jpg" alt="" />
          <img className={styles.galleryImage} src="/images/landing_run.jpg" alt="" />
          <img className={styles.galleryImage} src="/images/landing_hyrox.jpg" alt="" />
          <div className={styles.galleryTreatment} />
          <div className={styles.runTreatment} />
        </div>
        <div className={styles.storyTop}>
          <Brand inverse />
        </div>

        <div className={styles.storyCopy}>
          <div className={styles.storyIntro}>
            <p className={styles.eyebrow}>YOUR RACE. YOUR WAY</p>
            <h1 className={styles.storyHeading}>Make the miles<br />before the <em>start line</em><br />feel effortless.</h1>
            <p className={styles.storyDescription}>
              Your complete race weekend planner.
            </p>
          </div>
          <div className={styles.storyBenefits}>
            <div className={styles.storyBenefit}><span className={styles.benefitIcon}><Plane size={15} /></span><span>Your travel plans, all in one timeline</span></div>
            <div className={styles.storyBenefit}><span className={styles.benefitIcon}><ListChecks size={15} /></span><span>Built-in gear checklists for every discipline</span></div>
            <div className={styles.storyBenefit}><span className={styles.benefitIcon}><Map size={15} /></span><span>Spectator viewing plans and course maps</span></div>
          </div>
          <span className={styles.storyCopyright}>© TransitionZero</span>
        </div>
      </section>

      <section className={styles.panel}>
        <div className={styles.panelTop}>
          <a className={styles.helpLink} href="mailto:hello@transitionzero.app"><CircleHelp size={15} /> Need help?</a>
        </div>
        <div className={styles.panelContent}>
          {children}
        </div>
      </section>
    </main>
  );
}
