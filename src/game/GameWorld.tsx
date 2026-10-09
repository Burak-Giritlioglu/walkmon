
import React from "react";

import BabyRoom from "../stages/baby/BabyRoom";
import ToddlerWorld from "../stages/toddler/ToddlerWorld";

import { isToddlerLocation } from "../stages/toddler/toddlerLocations";

import type {
  GameLocation,
  LifeStage,
} from "./gameTypes";

import type { CharacterNeeds } from "../character/needs";
import type { CharacterStats } from "../character/stats";

type Props = {
  stage: LifeStage;
  location: GameLocation;

  unlockedObjectIds: string[];
  roomUpgradeIds: string[];

  initialNeeds: CharacterNeeds;
  initialStats: CharacterStats;

  onNeedsChange: (needs: CharacterNeeds) => void;
  onStatsChange: (stats: CharacterStats) => void;
};

export default function GameWorld({
  stage,
  location,
  unlockedObjectIds,
  roomUpgradeIds,
  initialNeeds,
  initialStats,
  onNeedsChange,
  onStatsChange,
}: Props) {
  switch (stage) {
    // =========================
    // BABY
    // =========================

    case "BABY":
      return (
        <BabyRoom
          unlockedObjectIds={unlockedObjectIds}
          roomUpgradeIds={roomUpgradeIds}
          initialNeeds={initialNeeds}
          initialStats={initialStats}
          onNeedsChange={onNeedsChange}
          onStatsChange={onStatsChange}
        />
      );

    // =========================
    // TODDLER
    // =========================

    case "TODDLER":
      return (
        <ToddlerWorld
          location={
            isToddlerLocation(location)
              ? location
              : "HOME"
          }
        />
      );

    // =========================
    // FUTURE STAGES
    // =========================

    default:
      // Diğer yaşam aşamaları henüz uygulanmadı.
      return (
        <BabyRoom
          unlockedObjectIds={unlockedObjectIds}
          roomUpgradeIds={roomUpgradeIds}
          initialNeeds={initialNeeds}
          initialStats={initialStats}
          onNeedsChange={onNeedsChange}
          onStatsChange={onStatsChange}
        />
      );
  }
}
