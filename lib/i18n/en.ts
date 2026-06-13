export const en = {
  header: { title: "OW TRACKER" },
  footer: { credit: "Data provided by OverFast API — Unofficial Blizzard Entertainment API" },
  home: {
    subtitle: "Overwatch 2 Stats Tracker",
    tagline: "Check player ranks, stats, and hero statistics",
    notice: {
      pre: "Players who have set their career profile to ",
      highlight: "Private",
      post: " in-game will not appear in search results and their stats cannot be viewed. To check stats, ask them to change it via ",
      path: "Options → Social → Career Profile → Public",
    },
    features: [
      { icon: "◎", label: "Rank Check", desc: "View competitive ranks for all roles" },
      { icon: "◈", label: "Stats Analysis", desc: "KDA, winrate, playtime and more" },
      { icon: "◆", label: "Hero Stats", desc: "Top 10 heroes by playtime" },
    ],
  },
  search: {
    placeholder: "Name or BattleTag (e.g. Name / Name#12345)",
    button: "Search",
    no_results: "Player not found. Try a full BattleTag (e.g. Name#12345).",
    not_public: "Private",
  },
  player: {
    not_found: "Player Not Found",
    causes_title: "Possible causes",
    causes: [
      { head: "Career profile is private", body: "Ask them to go to Options → Social → Career Profile and set it to Public." },
      { head: "Wrong BattleTag", body: "Enter the exact BattleTag (e.g. Name#12345)." },
      { head: "First-time timeout", body: "Please try again in a few minutes." },
    ],
    private_label: "Private Profile",
    stats_failed: "Could not retrieve stats.",
    stats_failed_sub: "The profile may be set to private.",
    overall_stats: "Overall Stats",
    role_stats: "Role Stats",
    hero_stats: "Hero Stats",
    hero_stats_sub: "Top 10 by playtime",
    no_data: {
      competitive: "No competitive data available.",
      quickplay: "No quick play data available.",
      general: "No data available.",
    },
    roles: { tank: "Tank", damage: "Damage", support: "Support" },
  },
  gamemode: { all: "All", quickplay: "Quick Play", competitive: "Competitive" },
  stats: {
    games_played: "Games",
    winrate: "Winrate",
    time_played: "Time Played",
    kda: "KDA",
    elim_per_10: "Elim / 10m",
    deaths_per_10: "Deaths / 10m",
    won_suffix: "W",
    lost_suffix: "L",
  },
  hero_table: {
    headers: ["Hero", "Time", "Games", "Winrate", "KDA", "Elim/10m", "Deaths/10m"],
  },
};

export type Dictionary = typeof en;
