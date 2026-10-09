
import { useEffect } from "react";

import type {
  CharacterNeeds,
  NeedType,
} from "../../character/needs";

import type {
  CharacterStats,
} from "../../character/stats";

import { useNeeds } from "../../hooks/useNeeds";
import { useCharacterStats } from "../../hooks/useCharacterStats";
import { useCharacterMovement } from "../../hooks/useCharacterMovement";
import { useCharacterAutonomy } from "../../hooks/useCharacterAutonomy";

import { babyRoomObjects } from "./babyWorldObjects";
import { BABY_ACTIVITIES } from "./babyActivities";

import {
  BABY_HOME_POSITION,
  BABY_MOVEMENT_SPEED,
} from "./babyMovementConfig";

import { getBabyVisualStates } from "./babyVisualStates";

type Props = {
  unlockedObjectIds: string[];
  initialNeeds: CharacterNeeds;
  initialStats: CharacterStats;
  onNeedsChange: (needs: CharacterNeeds) => void;
  onStatsChange: (stats: CharacterStats) => void;
};

export function useBabyRoomController({
  unlockedObjectIds,
  initialNeeds,
  initialStats,
  onNeedsChange,
  onStatsChange,
}: Props) {
  const availableObjects = babyRoomObjects.filter(
    (object) => unlockedObjectIds.includes(object.id)
  );

  const activeNeeds: NeedType[] = Array.from(
    new Set(
      availableObjects.flatMap((object) =>
        object.effect ? [object.effect.need] : []
      )
    )
  );

  const {
    needs,
    needsRef,
    changeNeed,
    protectNeed,
  } = useNeeds({
    activeNeeds,
    initialNeeds,
  });

  useEffect(() => {
    onNeedsChange(needs);
  }, [needs, onNeedsChange]);

  const { stats, changeStat } = useCharacterStats({
    initialStats,
  });

  useEffect(() => {
    onStatsChange(stats);
  }, [stats, onStatsChange]);

  const {
    characterX: babyX,
    characterY: babyY,
    movementDirection,
    moveToObject,
    moveHome,
  } = useCharacterMovement({
    homePosition: BABY_HOME_POSITION,
    speed: BABY_MOVEMENT_SPEED,
  });

  const {
    activeObject,
    handleObjectPress,
    handleCenterPress,
  } = useCharacterAutonomy({
    needsRef,
    activeNeeds,
    availableObjects,
    activities: BABY_ACTIVITIES,
    changeNeed,
    protectNeed,
    changeStat,
    moveToObject,
    moveHome,
  });

  const visualStates = getBabyVisualStates(activeObject);

  const interactiveObjects = availableObjects
    .filter((object) => object.id !== "play-rug")
    .sort((a, b) => {
      if (a.id === "bookshelf" && b.id !== "bookshelf") {
        return 1;
      }

      if (b.id === "bookshelf" && a.id !== "bookshelf") {
        return -1;
      }

      return 0;
    });

  return {
    needs,
    stats,
    activeNeeds,
    babyX,
    babyY,
    movementDirection,
    interactiveObjects,
    handleObjectPress,
    handleCenterPress,
    ...visualStates,
  };
}