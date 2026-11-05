/** BattleTag形式 (Name-12345) → Name#12345 */
export function formatPlayerId(battleTag: string): string {
  return battleTag.replace("#", "-");
}

/** プレイヤーIDの表示名を返す。内部IDの場合はnullを返す（summaryのusernameを使う） */
export function formatBattleTag(playerId: string): string | null {
  // 内部Blizzard ID (| が含まれる or 英数字のみの長いID)
  if (playerId.includes("|") || playerId.includes("%7C")) return null;
  // BattleTag形式: Name-12345
  const m = playerId.match(/^(.+)-(\d+)$/);
  if (m) return `${m[1]}#${m[2]}`;
  return null;
}

export function formatTimePlayed(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}
