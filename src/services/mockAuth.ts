import { DISCIPLINES } from "../types";
import type { AthleteProfile, Discipline, FirstRace } from "../types";

const PROFILE_KEY = "transitionzero.profile";
const SESSION_KEY = "transitionzero.session";
const registeredEmails = new Set<string>();

const legacyDisciplines: Record<string, Discipline> = {
  "Marathon / Half": "run",
  Marathon: "run",
  "Ironman 70.3": "triathlon",
  "Ironman 140.6": "triathlon",
  Hyrox: "hyrox",
  Cycling: "cycling",
  "Cycling / Gran Fondo": "cycling",
  "Open-Water Swim": "open-water-swim",
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function normalizeDiscipline(value: unknown): Discipline | null {
  if (typeof value !== "string") return null;

  const currentDiscipline = DISCIPLINES.find((discipline) => discipline.value === value);
  return currentDiscipline?.value ?? legacyDisciplines[value] ?? null;
}

function isIsoDate(value: unknown): value is string {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(value);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

function normalizeFirstRace(value: unknown): FirstRace | undefined {
  if (!isRecord(value) || typeof value.name !== "string" || !value.name.trim() || !isIsoDate(value.date)) {
    return undefined;
  }

  return {
    name: value.name.trim(),
    date: value.date,
    ...(typeof value.city === "string" && value.city.trim() ? { city: value.city.trim() } : {}),
  };
}

function normalizeProfile(value: unknown): AthleteProfile | null {
  if (!isRecord(value) || typeof value.email !== "string") return null;

  const savedDisciplines = Array.isArray(value.disciplines)
    ? value.disciplines
    : Array.isArray(value.sports)
      ? value.sports
      : [];
  const disciplines: Discipline[] = [];
  for (const savedDiscipline of savedDisciplines) {
    const discipline = normalizeDiscipline(savedDiscipline);
    if (!discipline) return null;
    if (!disciplines.includes(discipline)) disciplines.push(discipline);
  }

  const displayName = typeof value.displayName === "string" ? value.displayName.trim() : "";
  const firstRace = normalizeFirstRace(value.firstRace);

  return {
    email: value.email,
    ...(displayName ? { displayName } : {}),
    disciplines,
    ...(firstRace ? { firstRace } : {}),
  };
}

const wait = (milliseconds: number) =>
  new Promise<void>((resolve) => window.setTimeout(resolve, milliseconds));

export function getSavedProfile(): AthleteProfile | null {
  const saved = window.localStorage.getItem(PROFILE_KEY);
  if (!saved) return null;

  try {
    const profile = normalizeProfile(JSON.parse(saved));
    if (profile) return profile;
    window.localStorage.removeItem(PROFILE_KEY);
    return null;
  } catch {
    window.localStorage.removeItem(PROFILE_KEY);
    return null;
  }
}

export function getSignedInEmail(): string | null {
  return window.localStorage.getItem(SESSION_KEY);
}

export async function signUp(email: string): Promise<void> {
  await wait(650);
  const normalizedEmail = email.trim().toLowerCase();
  const savedProfile = getSavedProfile();

  if (
    registeredEmails.has(normalizedEmail) ||
    savedProfile?.email.toLowerCase() === normalizedEmail
  ) {
    throw new Error("An account with this email already exists. Try signing in instead.");
  }

  registeredEmails.add(normalizedEmail);
  window.localStorage.setItem(SESSION_KEY, normalizedEmail);
}

export async function signIn(email: string): Promise<void> {
  await wait(650);
  const normalizedEmail = email.trim().toLowerCase();
  const savedProfile = getSavedProfile();

  if (
    !registeredEmails.has(normalizedEmail) &&
    savedProfile?.email.toLowerCase() !== normalizedEmail
  ) {
    throw new Error("We couldn't find a demo account with that email. Create an account to get started.");
  }

  window.localStorage.setItem(SESSION_KEY, normalizedEmail);
}

export function saveProfile(profile: AthleteProfile): void {
  window.localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  window.localStorage.setItem(SESSION_KEY, profile.email.trim().toLowerCase());
}

export function signOut(): void {
  window.localStorage.removeItem(SESSION_KEY);
}
