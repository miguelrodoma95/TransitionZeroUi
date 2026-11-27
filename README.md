# TransitionZero UI

The TransitionZero MVP helps athletes plan travel around race day. This repository currently contains the responsive app shell, demo sign-in/sign-up flows, athlete onboarding, and a profile-based dashboard. Styling uses Fluent UI React with Griffel `makeStyles`; each component has its own folder and keeps its styles in a colocated `.styles.ts` file. The app root is in `src/App`, and reusable UI components are in individual folders under `src/components`. The sign-in landing page uses the four race photos in `public/images` as its stacked background gallery.

## Run locally

```sh
npm install
npm run dev
```

Use the **Create account** tab and any valid email/password (8+ characters) to try onboarding. Step 1 collects a display name and disciplines; Step 2 lets the athlete add a first race or continue while still deciding. The demo app saves the completed profile in browser storage through its existing mock-auth flow. The marked `completeOnboarding` stub is the single future API wiring point; it currently resolves without making a network request. No live authentication or trip-creation service is connected.

## Checks

```sh
npm run typecheck
npm run build
```