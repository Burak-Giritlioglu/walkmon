export type CharacterStat =
  | "INTELLIGENCE"
  | "CREATIVITY"
  | "CURIOSITY"
  | "STRENGTH"
  | "SOCIAL";

export type CharacterStats = {
  INTELLIGENCE: number;
  CREATIVITY: number;
  CURIOSITY: number;
  STRENGTH: number;
  SOCIAL: number;
};

export const INITIAL_STATS: CharacterStats = {
  INTELLIGENCE: 0,
  CREATIVITY: 0,
  CURIOSITY: 0,
  STRENGTH: 0,
  SOCIAL: 0,
};

export function clampStat(
  value: number
) {
  return Math.max(
    0,
    Math.min(100, value)
  );
}