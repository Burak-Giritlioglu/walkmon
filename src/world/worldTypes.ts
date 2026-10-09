
import type { NeedType } from "../character/needs";

// =========================
// CHARACTER ACTIONS
// =========================

export type CharacterAction =
  | "PLAYING"
  | "SLEEPING"
  | "WARMING"
  | "EATING"
  | "READING"
  | "LOOKING_OUTSIDE";

// Backward compatibility:
// Existing Baby components can continue
// using BabyAction without changes.

export type BabyAction = CharacterAction;

// =========================
// NEED EFFECT
// =========================

export type NeedEffect = {
  need: NeedType;
  amount: number;
  interval: number;
};

// =========================
// WORLD OBJECT
// =========================

export type WorldObject = {
  id: string;
  name: string;

  x: number;
  y: number;

  width: number;
  height: number;

  interactionPoint: {
    x: number;
    y: number;
  };

  action: CharacterAction;

  effect?: NeedEffect;
};
