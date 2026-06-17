export type Role = "tank" | "damage" | "support" | "open";

// Actual API structure: division is lowercase string
export interface RoleRank {
  division: string;
  tier: number;
  role_icon: string;
  rank_icon: string;
  tier_icon: string;
}

// competitive.pc / competitive.console have per-role ranks
export interface PlatformRanks {
  season: number;
  tank: RoleRank | null;
  damage: RoleRank | null;
  support: RoleRank | null;
  open: RoleRank | null;
}

export interface PlayerSummary {
  username: string;
  avatar: string | null;
  namecard: string | null;
  title: string | null;
  endorsement: {
    level: number;
    frame: string;
  } | null;
  competitive: {
    pc: PlatformRanks | null;
    console: PlatformRanks | null;
  } | null;
  privacy: "public" | "private";
}

export interface StatTotals {
  eliminations: number;
  assists: number;
  deaths: number;
  damage: number;
  healing: number;
}

export interface RoleStats {
  games_played: number;
  games_won: number;
  games_lost: number;
  time_played: number;
  winrate: number;
  kda: number;
  total: StatTotals;
  average: StatTotals;
}

export interface PlayerStatsSummary {
  general: RoleStats;
  roles: {
    tank: RoleStats | null;
    damage: RoleStats | null;
    support: RoleStats | null;
  };
  heroes: Record<string, RoleStats>;
}

export interface PlayerData {
  summary: PlayerSummary;
  stats: PlayerStatsSummary | null;
}

export interface SearchResult {
  player_id: string;
  name: string;
  avatar: string | null;
  namecard: string | null;
  title: string | null;
  is_public: boolean;
}

// ── Hero types ──────────────────────────────────────────────────────────
export interface HeroListItem {
  key: string;
  name: string;
  portrait: string;
  role: "tank" | "damage" | "support";
  subrole: string | null;
  gamemodes: string[];
}

export interface HeroAbility {
  name: string;
  description: string;
  icon: string;
  video: {
    thumbnail: string;
    link: { mp4: string; webm: string };
  } | null;
}

export interface HeroPerk {
  name: string;
  description: string;
  icon: string;
}

export interface HeroBackground {
  url: string;
  sizes: string[];
}

export interface HeroHitpoints {
  health: number;
  armor: number;
  shields: number;
  total: number;
}

export interface HeroStoryChapter {
  title: string;
  content: string;
  picture: string | null;
}

export interface HeroStory {
  summary: string;
  media: { type: string; link: string } | null;
  chapters: HeroStoryChapter[];
}

export interface HeroDetail {
  name: string;
  description: string | null;
  portrait: string;
  role: "tank" | "damage" | "support";
  subrole: string | null;
  location: string | null;
  birthday: string | null;
  age: number | null;
  hitpoints: HeroHitpoints | null;
  abilities: HeroAbility[];
  backgrounds: HeroBackground[];
  perks: { minor: HeroPerk[]; major: HeroPerk[] } | null;
  story: HeroStory | null;
  stadium_powers: HeroPerk[] | null;
}
