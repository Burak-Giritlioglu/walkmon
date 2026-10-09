
import { useSteps } from "../hooks/useSteps";
import { useHealthKitSync } from "../hooks/useHealthKitSync";
import { useMilestoneController } from "../hooks/useMilestoneController";
import { useCharacterState } from "../hooks/useCharacterState";
import { useGamePersistence } from "../hooks/useGamePersistence";
import { useGameLocation } from "../hooks/useGameLocation";

import type { GameSaveData } from "../storage/gameStorage";

type Props = {
  initialSave: GameSaveData | null;
};

export function useGameController({
  initialSave,
}: Props) {
  // =========================
  // STEPS
  // =========================

  const {
    lifetimeSteps,
    addSteps,
    setSteps,
  } = useSteps({
    initialLifetimeSteps:
      initialSave?.lifetimeSteps ?? 0,
  });

  // =========================
  // HEALTHKIT
  // =========================

  const { journeyStartDate } = useHealthKitSync({
    initialJourneyStartDate:
      initialSave?.journeyStartDate ?? null,
    setSteps,
  });

  // =========================
  // PROGRESSION
  // =========================

  const {
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
  } = useMilestoneController({
    lifetimeSteps,
    initialRevealedMilestoneIds:
      initialSave?.revealedMilestoneIds ?? [],
  });

  // =========================
  // LOCATION
  // =========================

  const {
    location,
    changeLocation,
  } = useGameLocation({
    stage,
    initialLocation:
      initialSave?.location ?? "HOME",
  });

  // =========================
  // CHARACTER
  // =========================

  const {
    currentNeeds,
    currentStats,
    handleNeedsChange,
    handleStatsChange,
  } = useCharacterState({
    initialNeeds: initialSave?.needs,
    initialStats: initialSave?.stats,
  });

  // =========================
  // PERSISTENCE
  // =========================

  useGamePersistence({
    lifetimeSteps,
    revealedMilestoneIds,
    needs: currentNeeds,
    stats: currentStats,
    stage,
    location,
    journeyStartDate,
  });

  // =========================
  // PUBLIC CONTROLLER
  // =========================

  return {
    lifetimeSteps,
    addSteps,

    stage,
    location,
    changeLocation,
    unlockedObjectIds,
    roomUpgradeIds,

    currentNeeds,
    currentStats,
    handleNeedsChange,
    handleStatsChange,

    currentMilestone,
    milestoneProgress,
    isReady,
    revealingMilestone,
    revealTitle,
    handleMilestonePress,
    handlePlaceUnlockedItem,
  };
}
