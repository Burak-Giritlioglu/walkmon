import type {
  BabyAction,
} from "../world/worldObjects";

import type {
  CharacterStat,
} from "./stats";

export type StatReward = {
  stat: CharacterStat;
  amount: number;
};

export type ActivityDefinition = {
  action: BabyAction;

  duration: number;

  statRewards: StatReward[];
};

export const ACTIVITIES: Partial<
  Record<
    BabyAction,
    ActivityDefinition
  >
> = {
  READING: {
    action: "READING",

    duration: 5000,

    statRewards: [
      {
        stat: "INTELLIGENCE",
        amount: 1,
      },

      {
        stat: "CURIOSITY",
        amount: 1,
      },
    ],
  },

  PLAYING: {
    action: "PLAYING",

    duration: 5000,

    statRewards: [
      {
        stat: "CREATIVITY",
        amount: 1,
      },

      {
        stat: "STRENGTH",
        amount: 1,
      },
    ],
  },

  LOOKING_OUTSIDE: {
    action: "LOOKING_OUTSIDE",

    duration: 5000,

    statRewards: [
      {
        stat: "CURIOSITY",
        amount: 1,
      },
    ],
  },
};

export function getActivity(
  action: BabyAction
): ActivityDefinition | null {
  return ACTIVITIES[action] ?? null;
}