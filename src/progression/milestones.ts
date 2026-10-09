import type { LifeStage } from "../game/gameTypes";

// =========================
// UNLOCK TYPES
// =========================

export type ObjectUnlock = {
  type: "OBJECT";
  objectId: string;
};

export type StageUnlock = {
  type: "STAGE";
  stage: LifeStage;
};

export type RoomUpgradeUnlock = {
  type: "ROOM_UPGRADE";
  upgradeId: string;
};

export type Unlock =
  | ObjectUnlock
  | StageUnlock
  | RoomUpgradeUnlock;

// =========================
// MILESTONE
// =========================

export type Milestone = {
  id: string;
  title: string;
  requiredSteps: number;
  unlock: Unlock;
};

export type MilestoneStatus =
  | "IN_PROGRESS"
  | "READY";

// =========================
// STATUS
// =========================

export function getMilestoneStatus(
  lifetimeSteps: number,
  milestone: Milestone
): MilestoneStatus {
  if (lifetimeSteps >= milestone.requiredSteps) {
    return "READY";
  }

  return "IN_PROGRESS";
}

// =========================
// PROGRESS
// =========================

export function getMilestoneProgress(
  lifetimeSteps: number,
  milestone: Milestone,
  milestones: readonly Milestone[]
) {
  const milestoneIndex = milestones.findIndex(
    (item) => item.id === milestone.id
  );

  const startSteps =
    milestoneIndex > 0
      ? milestones[milestoneIndex - 1].requiredSteps
      : 0;

  const milestoneGoal =
    milestone.requiredSteps - startSteps;

  const progressSteps = Math.max(
    0,
    Math.min(
      lifetimeSteps - startSteps,
      milestoneGoal
    )
  );

  const progress =
    milestoneGoal > 0
      ? progressSteps / milestoneGoal
      : 1;

  return {
    startSteps,
    progressSteps,
    milestoneGoal,
    progress,
    progressPercent:
      `${progress * 100}%` as `${number}%`,
  };
}