import type { NeedType } from "../character/needs";
import { Dimensions } from "react-native";

export type BabyAction =
  | "PLAYING"
  | "SLEEPING"
  | "WARMING"
  | "EATING"
  | "READING"
  | "LOOKING_OUTSIDE";

export type NeedEffect = {
  need: NeedType;
  amount: number;
  interval: number;
};

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

  action: BabyAction;

  effect?: NeedEffect;
};

const SCREEN_WIDTH =
  Dimensions.get("window").width;

export const babyRoomObjects: WorldObject[] = [
  // =========================
  // PLAY RUG
  // Decorative floor object only
  // No interaction / no need effect
  // =========================

  {
    id: "play-rug",
    name: "Play Rug",

    x: 50,
    y: 500,

    width: 300,
    height: 200,

    interactionPoint: {
      x: 200,
      y: 590,
    },

    action: "PLAYING",
  },

  // =========================
  // BOOKSHELF
  // =========================

  {
    id: "bookshelf",
    name: "Bookshelf",

    x: 65,
    y: 350,

    width: 120,
    height: 155,

    interactionPoint: {
      x: 145,
      y: 495,
    },

    action: "READING",
  },

  // =========================
  // CRIB
  // =========================

  {
    id: "crib",
    name: "Crib",

    x: -35,
    y: 440,

    width: 180,
    height: 130,

    interactionPoint: {
      x: 50,
      y: 550,
    },

    action: "SLEEPING",

    effect: {
      need: "ENERGY",
      amount: 1,
      interval: 1000,
    },
  },

  // =========================
  // FIREPLACE
  // =========================

  {
    id: "fireplace",
    name: "Fireplace",

    x: SCREEN_WIDTH - 120,
    y: 350,

    width: 180,
    height: 200,

    interactionPoint: {
      x: SCREEN_WIDTH - 110,
      y: 560,
    },

    action: "WARMING",

    effect: {
      need: "HAPPINESS",
      amount: 1,
      interval: 1000,
    },
  },

  // =========================
  // PLUSH TOY
  // =========================

  {
    id: "toy",
    name: "Plush Toy",

    x: 110,
    y: 520,

    width: 50,
    height: 80,

    interactionPoint: {
      x: 180,
      y: 600,
    },

    action: "PLAYING",

    effect: {
      need: "FUN",
      amount: 1,
      interval: 1000,
    },
  },

  // =========================
  // HIGH CHAIR
  // =========================

  {
    id: "high-chair",
    name: "High Chair",

    x: 230,
    y: 440,

    width: 105,
    height: 100,

    interactionPoint: {
      x: 250,
      y: 540,
    },

    action: "EATING",

    effect: {
      need: "SATIETY",
      amount: 1,
      interval: 1000,
    },
  },

  // =========================
  // ACTIVITY TABLE
  // =========================

  {
    id: "activity-table",
    name: "Activity Table",

    x: 205,
    y: 545,

    width: 255,
    height: 125,

    interactionPoint: {
      x: 350,
      y: 615,
    },

    action: "PLAYING",

    effect: {
      need: "FUN",
      amount: 1,
      interval: 1000,
    },
  },

  // =========================
  // GARDEN DOOR
  // =========================

  {
    id: "garden-door",
    name: "Garden Door",

    x: 275,
    y: 75,

    width: 105,
    height: 160,

    interactionPoint: {
      x: 260,
      y: 285,
    },

    action: "LOOKING_OUTSIDE",
  },
];