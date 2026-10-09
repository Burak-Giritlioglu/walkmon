import type { LifeStage } from "./gameTypes";

const STAGE_ORDER: LifeStage[] = [
  "BABY",
  "TODDLER",
  "CHILD",
  "TEEN",
  "YOUNG_ADULT",
  "ADULT",
];

export function getCurrentLifeStage(
  unlockedStages: LifeStage[]
): LifeStage {
  for (let i = STAGE_ORDER.length - 1; i >= 1; i--) {
    const stage = STAGE_ORDER[i];

    if (unlockedStages.includes(stage)) {
      return stage;
    }
  }

  return "BABY";
}