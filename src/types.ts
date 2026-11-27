export const DISCIPLINES = [
  { value: "run", label: "Run — Marathon / Half" },
  { value: "triathlon", label: "Triathlon / Ironman" },
  { value: "hyrox", label: "Hyrox" },
  { value: "cycling", label: "Cycling / Gran Fondo" },
  { value: "open-water-swim", label: "Open-Water Swim" },
] as const;

export type Discipline = (typeof DISCIPLINES)[number]["value"];

export interface FirstRace {
  name: string;
  date: string;
  city?: string;
}

export interface OnboardingPayload {
  displayName?: string;
  disciplines: Discipline[];
  firstRace?: FirstRace;
}

export interface AthleteProfile extends OnboardingPayload {
  email: string;
}

export type AuthMode = "sign-in" | "sign-up";
