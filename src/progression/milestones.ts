// =========================
// UNLOCK TYPES
// =========================

export type ObjectUnlock = {
  type: "OBJECT";
  objectId: string;
};

export type StageUnlock = {
  type: "STAGE";
  stage: "CHILD";
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

  // Lifetime step threshold.
  requiredSteps: number;

  // Reveal edildiğinde ne açılacak?
  unlock: Unlock;
};

export type MilestoneStatus =
  | "IN_PROGRESS"
  | "READY";

// =========================
// BABY PROGRESSION
// =========================

export const BABY_MILESTONES: Milestone[] = [
  {
    id: "plush-toy",
    title: "🧸 Plush Toy",
    requiredSteps: 6000,

    unlock: {
      type: "OBJECT",
      objectId: "toy",
    },
  },

  {
    id: "high-chair",
    title: "🪑 High Chair",
    requiredSteps: 16000,

    unlock: {
      type: "OBJECT",
      objectId: "high-chair",
    },
  },

  {
    id: "play-rug",
    title: "🧶 Play Rug",
    requiredSteps: 28000,

    unlock: {
      type: "OBJECT",
      objectId: "play-rug",
    },
  },

  {
    id: "bookshelf",
    title: "📚 Bookshelf",
    requiredSteps: 43000,

    unlock: {
      type: "OBJECT",
      objectId: "bookshelf",
    },
  },

  {
    id: "activity-table",
    title: "🧩 Activity Table",
    requiredSteps: 61000,

    unlock: {
      type: "OBJECT",
      objectId: "activity-table",
    },
  },

  {
    id: "room-upgrade",
    title: "🪟 Cozy Room",
    requiredSteps: 81000,

    unlock: {
      type: "ROOM_UPGRADE",
      upgradeId: "cozy-room",
    },
  },

  {
    id: "garden-door",
    title: "🚪 Garden Door",
    requiredSteps: 100000,

    unlock: {
      type: "OBJECT",
      objectId: "garden-door",
    },
  },

  {
    id: "child-stage",
    title: "🌱 Growing Up",
    requiredSteps: 120000,

    unlock: {
      type: "STAGE",
      stage: "CHILD",
    },
  },
];

// =========================
// STATUS
// =========================

export function getMilestoneStatus(
  lifetimeSteps: number,
  milestone: Milestone
): MilestoneStatus {
  if (
    lifetimeSteps >=
    milestone.requiredSteps
  ) {
    return "READY";
  }

  return "IN_PROGRESS";
}

// =========================
// PROGRESS
// =========================

export function getMilestoneProgress(
  lifetimeSteps: number,
  milestone: Milestone
) {
  const milestoneIndex =
    BABY_MILESTONES.findIndex(
      (item) =>
        item.id === milestone.id
    );

  // İlk milestone 0'dan başlar.
  // Sonrakiler önceki milestone'un
  // threshold'undan başlar.

  const startSteps =
    milestoneIndex > 0
      ? BABY_MILESTONES[
          milestoneIndex - 1
        ].requiredSteps
      : 0;

  const milestoneGoal =
    milestone.requiredSteps -
    startSteps;

  const progressSteps = Math.max(
    0,
    Math.min(
      lifetimeSteps - startSteps,
      milestoneGoal
    )
  );

  const progress =
    milestoneGoal > 0
      ? progressSteps /
        milestoneGoal
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