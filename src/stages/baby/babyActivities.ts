import type { BabyAction } from "../../world/worldTypes";
import type { ActivityDefinition } from "../../character/activityTypes";

export const BABY_ACTIVITIES: Partial<
  Record<BabyAction, ActivityDefinition>
> = {
  READING: {
    action: "READING",
    duration: 20000,
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