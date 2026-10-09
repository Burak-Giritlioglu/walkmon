import { useState } from "react";

import { useProgression } from "./useProgression";

import {
  getStageMilestones,
} from "../progression/stageMilestones";

import {
  getMilestoneProgress,
  getMilestoneStatus,
} from "../progression/milestones";

import { getCurrentLifeStage } from "../game/gameSelectors";

type Props = {
  lifetimeSteps: number;
  initialRevealedMilestoneIds: string[];
};

export function useMilestoneController({
  lifetimeSteps,
  initialRevealedMilestoneIds,
}: Props) {
  const [
    revealingMilestoneId,
    setRevealingMilestoneId,
  ] = useState<string | null>(null);

  const {
    revealedMilestoneIds,
    unlockedObjectIds,
    roomUpgradeIds,
    unlockedStages,
    revealMilestone,
    isMilestoneRevealed,
  } = useProgression({
    initialRevealedMilestoneIds,
  });

  // =========================
  // CURRENT STAGE
  // =========================

  const stage = getCurrentLifeStage(unlockedStages);

  const stageMilestones = getStageMilestones(stage);

  // =========================
  // CURRENT MILESTONE
  // =========================

  const currentMilestone =
    stageMilestones.find(
      (milestone) =>
        !isMilestoneRevealed(milestone.id)
    ) ?? null;

  const milestoneProgress = currentMilestone
    ? getMilestoneProgress(
        lifetimeSteps,
        currentMilestone,
        stageMilestones
      )
    : null;

  const milestoneStatus = currentMilestone
    ? getMilestoneStatus(
        lifetimeSteps,
        currentMilestone
      )
    : null;

  const isReady = milestoneStatus === "READY";

  // =========================
  // REVEAL
  // =========================

  const revealingMilestone =
    stageMilestones.find(
      (milestone) =>
        milestone.id === revealingMilestoneId
    ) ?? null;

  const handleMilestonePress = () => {
    if (!currentMilestone || !isReady) {
      return;
    }

    setRevealingMilestoneId(currentMilestone.id);
  };

  const handlePlaceUnlockedItem = () => {
    if (!revealingMilestoneId) {
      return;
    }

    revealMilestone(revealingMilestoneId);
    setRevealingMilestoneId(null);
  };

  const revealTitle =
    revealingMilestone?.title.replace(
      /^[^\w]+/,
      ""
    ) ?? "";

  return {
    revealedMilestoneIds,
    unlockedObjectIds,
    roomUpgradeIds,
    stage,
    currentMilestone,
    milestoneProgress,
    isReady,
    revealingMilestone,
    revealTitle,
    handleMilestonePress,
    handlePlaceUnlockedItem,
  };
}