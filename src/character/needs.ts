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
  SATIETY: 39,
  HAPPINESS: 80,
  FUN: 39,
  ENERGY: 80,
};

export const MIN_NEED_VALUE = 0;
export const MAX_NEED_VALUE = 100;

// Need'ler her 60 saniyede 1 puan azalır.
export const NEED_DECAY_INTERVAL = 60_000;
export const NEED_DECAY_AMOUNT = 1;

// Karakter ancak bir need 40'ın
// altına düştüğünde harekete geçer.
export const NEED_TRIGGER_THRESHOLD = 40;

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