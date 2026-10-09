import type { LifeStage } from "../game/gameTypes";
import type { Milestone } from "./milestones";

import { BABY_MILESTONES } from "../stages/baby/babyMilestones";

const STAGE_MILESTONES: Partial<
  Record<LifeStage, readonly Milestone[]>
> = {
  BABY: BABY_MILESTONES,
};

export function getStageMilestones(
  stage: LifeStage
): readonly Milestone[] {
  return STAGE_MILESTONES[stage] ?? [];
}

export function getAllMilestones(): Milestone[] {
  return Object.values(STAGE_MILESTONES).flatMap(
    (milestones) => [...(milestones ?? [])]
  );
}