import type { CharacterStat } from "./stats";
import type { BabyAction } from "../world/worldTypes";

export type StatReward = {
  stat: CharacterStat;
  amount: number;
};

export type ActivityDefinition = {
  action: BabyAction;
  duration: number;
  statRewards: StatReward[];
};