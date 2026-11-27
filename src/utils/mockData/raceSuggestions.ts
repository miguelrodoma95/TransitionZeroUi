import type { Discipline } from "../../types";

export type RaceEntry =
  | "Ballot"
  | "Qualifying time"
  | "Open entry"
  | "Qualification only";

export interface RaceSuggestion {
  id: string;
  name: string;
  location: string;
  typicalDate: string;
  distance: string;
  discipline: Discipline;
  entry: RaceEntry;
  entryLabel?: string;
}

export const mockRaceSuggestions: RaceSuggestion[] = [
  { id: "berlin-marathon", name: "Berlin Marathon", location: "Berlin, Germany", typicalDate: "Typically September", distance: "42.2 km · Marathon", discipline: "run", entry: "Ballot" },
  { id: "london-marathon", name: "London Marathon", location: "London, United Kingdom", typicalDate: "Typically April", distance: "42.2 km · Marathon", discipline: "run", entry: "Ballot", entryLabel: "Ballot opens April" },
  { id: "chicago-marathon", name: "Chicago Marathon", location: "Chicago, United States", typicalDate: "Typically October", distance: "42.2 km · Marathon", discipline: "run", entry: "Ballot" },
  { id: "boston-marathon", name: "Boston Marathon", location: "Boston, United States", typicalDate: "Typically April", distance: "42.2 km · Marathon", discipline: "run", entry: "Qualifying time" },
  { id: "tokyo-marathon", name: "Tokyo Marathon", location: "Tokyo, Japan", typicalDate: "Typically March", distance: "42.2 km · Marathon", discipline: "run", entry: "Ballot" },
  { id: "new-york-marathon", name: "New York City Marathon", location: "New York, United States", typicalDate: "Typically November", distance: "42.2 km · Marathon", discipline: "run", entry: "Ballot" },
  { id: "oceanside-703", name: "IRONMAN 70.3 Oceanside", location: "Oceanside, United States", typicalDate: "Typically April", distance: "70.3 mi · Triathlon", discipline: "triathlon", entry: "Open entry" },
  { id: "nice-703", name: "IRONMAN 70.3 Nice", location: "Nice, France", typicalDate: "Typically June", distance: "70.3 mi · Triathlon", discipline: "triathlon", entry: "Open entry" },
  { id: "swansea-703", name: "IRONMAN 70.3 Swansea", location: "Swansea, United Kingdom", typicalDate: "Typically August", distance: "70.3 mi · Triathlon", discipline: "triathlon", entry: "Open entry" },
  { id: "zell-am-see-703", name: "IRONMAN 70.3 Zell am See-Kaprun", location: "Zell am See, Austria", typicalDate: "Typically September", distance: "70.3 mi · Triathlon", discipline: "triathlon", entry: "Open entry" },
  { id: "marbella-703", name: "IRONMAN 70.3 Marbella", location: "Marbella, Spain", typicalDate: "Typically October", distance: "70.3 mi · Triathlon", discipline: "triathlon", entry: "Open entry" },
  { id: "703-world-championship", name: "IRONMAN 70.3 World Championship", location: "Location varies", typicalDate: "Typically September", distance: "70.3 mi · Triathlon", discipline: "triathlon", entry: "Qualification only" },
  { id: "hyrox-london", name: "HYROX London", location: "London, United Kingdom", typicalDate: "Typically January", distance: "8 × 1 km · Fitness race", discipline: "hyrox", entry: "Open entry" },
  { id: "hyrox-berlin", name: "HYROX Berlin", location: "Berlin, Germany", typicalDate: "Typically February", distance: "8 × 1 km · Fitness race", discipline: "hyrox", entry: "Open entry" },
  { id: "hyrox-new-york", name: "HYROX New York", location: "New York, United States", typicalDate: "Typically March", distance: "8 × 1 km · Fitness race", discipline: "hyrox", entry: "Open entry" },
  { id: "hyrox-chicago", name: "HYROX Chicago", location: "Chicago, United States", typicalDate: "Typically April", distance: "8 × 1 km · Fitness race", discipline: "hyrox", entry: "Open entry" },
  { id: "hyrox-amsterdam", name: "HYROX Amsterdam", location: "Amsterdam, Netherlands", typicalDate: "Typically May", distance: "8 × 1 km · Fitness race", discipline: "hyrox", entry: "Open entry" },
  { id: "hyrox-copenhagen", name: "HYROX Copenhagen", location: "Copenhagen, Denmark", typicalDate: "Typically October", distance: "8 × 1 km · Fitness race", discipline: "hyrox", entry: "Open entry" },
  { id: "mallorca-312", name: "Mallorca 312", location: "Mallorca, Spain", typicalDate: "Typically April", distance: "312 km · Gran Fondo", discipline: "cycling", entry: "Open entry" },
  { id: "gran-fondo-new-york", name: "Gran Fondo New York", location: "New York, United States", typicalDate: "Typically May", distance: "100 mi · Gran Fondo", discipline: "cycling", entry: "Open entry" },
  { id: "etape-du-tour", name: "L'Étape du Tour", location: "France · route varies", typicalDate: "Typically July", distance: "135 km · Gran Fondo", discipline: "cycling", entry: "Open entry" },
  { id: "maratona-dolomites", name: "Maratona dles Dolomites", location: "Alta Badia, Italy", typicalDate: "Typically July", distance: "138 km · Gran Fondo", discipline: "cycling", entry: "Ballot" },
  { id: "unbound-gravel", name: "Unbound Gravel 100", location: "Emporia, United States", typicalDate: "Typically June", distance: "100 mi · Gravel", discipline: "cycling", entry: "Ballot" },
  { id: "uci-gran-fondo", name: "UCI Gran Fondo World Championships", location: "Location varies", typicalDate: "Typically August", distance: "Gran Fondo · Road", discipline: "cycling", entry: "Qualification only" },
  { id: "swim-serpentine", name: "Swim Serpentine", location: "London, United Kingdom", typicalDate: "Typically September", distance: "2 mi · Open water", discipline: "open-water-swim", entry: "Open entry" },
  { id: "great-north-swim", name: "Great North Swim", location: "Windermere, United Kingdom", typicalDate: "Typically June", distance: "5 km · Open water", discipline: "open-water-swim", entry: "Open entry" },
  { id: "bosphorus-swim", name: "Bosphorus Cross-Continental Swim", location: "Istanbul, Türkiye", typicalDate: "Typically August", distance: "6.5 km · Open water", discipline: "open-water-swim", entry: "Ballot" },
  { id: "rottnest-channel", name: "Rottnest Channel Swim", location: "Perth, Australia", typicalDate: "Typically February", distance: "19.7 km · Open water", discipline: "open-water-swim", entry: "Ballot" },
  { id: "maui-channel-swim", name: "Maui Channel Swim", location: "Maui, United States", typicalDate: "Typically September", distance: "9.9 mi · Open water", discipline: "open-water-swim", entry: "Open entry" },
  { id: "lake-zurich-swim", name: "Lake Zurich Swim", location: "Zurich, Switzerland", typicalDate: "Typically August", distance: "1.5 km · Open water", discipline: "open-water-swim", entry: "Open entry" },
];

export const defaultRaceSuggestionIds = [
  "berlin-marathon",
  "oceanside-703",
  "hyrox-london",
  "mallorca-312",
  "swim-serpentine",
  "london-marathon",
];
