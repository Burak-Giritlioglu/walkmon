import {
  NeedType,
} from "../character/needs";

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

export const babyRoomObjects: WorldObject[] = [
  // =========================
  // STARTING OBJECTS
  // =========================

  {
    id: "crib",

    name: "Crib",

    x: 25,
    y: 260,

    width: 130,
    height: 105,

    interactionPoint: {
      x: 175,
      y: 390,
    },

    action: "SLEEPING",

    effect: {
      need: "ENERGY",
      amount: 1,
      interval: 1000,
    },
  },

  {
    id: "fireplace",

    name: "Fireplace",

    x: 280,
    y: 235,

    width: 95,
    height: 130,

    interactionPoint: {
      x: 255,
      y: 370,
    },

    action: "WARMING",

    effect: {
      need: "HAPPINESS",
      amount: 1,
      interval: 1000,
    },
  },

  // =========================
  // MILESTONE OBJECTS
  // =========================

  {
    id: "toy",

    name: "Plush Toy",

    x: 245,
    y: 360,

    width: 60,
    height: 60,

    interactionPoint: {
      x: 235,
      y: 415,
    },

    action: "PLAYING",

    effect: {
      need: "FUN",
      amount: 1,
      interval: 1000,
    },
  },

  {
    id: "high-chair",

    name: "High Chair",

    x: 165,
    y: 245,

    width: 70,
    height: 80,

    interactionPoint: {
      x: 200,
      y: 350,
    },

    action: "EATING",

    effect: {
      need: "SATIETY",
      amount: 1,
      interval: 1000,
    },
  },

  {
    id: "bookshelf",

    name: "Bookshelf",

    x: 15,
    y: 120,

    width: 90,
    height: 125,

    interactionPoint: {
      x: 125,
      y: 285,
    },

    action: "READING",
  },

  {
    id: "toy-basket",

    name: "Toy Basket",

    x: 105,
    y: 360,

    width: 65,
    height: 55,

    interactionPoint: {
      x: 180,
      y: 410,
    },

    action: "PLAYING",

    effect: {
      need: "FUN",
      amount: 1,
      interval: 1000,
    },
  },

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