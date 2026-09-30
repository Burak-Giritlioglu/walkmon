export type NeedType =
  | "SATIETY"
  | "HAPPINESS"
  | "FUN"
  | "ENERGY";

export type CharacterNeeds = {
  SATIETY: number;
  HAPPINESS: number;
  FUN: number;
  ENERGY: number;
};

export const INITIAL_NEEDS: CharacterNeeds = {
  SATIETY: 80,
  HAPPINESS: 80,
  FUN: 50,
  ENERGY: 80,
};

export const MIN_NEED_VALUE = 0;
export const MAX_NEED_VALUE = 100;

// DEBUG değerleri.
// Gerçek oyunda çok daha yavaş olacak.
export const NEED_DECAY_INTERVAL = 1000;
export const NEED_DECAY_AMOUNT = 1;

// Autonomous davranış eşikleri.
export const NEED_TRIGGER_THRESHOLD = 40;
export const NEED_SATISFIED_THRESHOLD = 80;

export function clampNeed(
  value: number
): number {
  return Math.max(
    MIN_NEED_VALUE,
    Math.min(
      MAX_NEED_VALUE,
      value
    )
  );
}