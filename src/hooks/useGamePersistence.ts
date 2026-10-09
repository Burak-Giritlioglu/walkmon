
import { useEffect } from "react";

import type { CharacterNeeds } from "../character/needs";
import type { CharacterStats } from "../character/stats";

import type {
  GameLocation,
  LifeStage,
} from "../game/gameTypes";

import { saveGame } from "../storage/gameStorage";
import type { GameSaveData } from "../storage/gameStorage";

type Props = {
  lifetimeSteps: number;
  revealedMilestoneIds: string[];

  needs: CharacterNeeds;
  stats: CharacterStats;

  stage: LifeStage;
  location: GameLocation;

  journeyStartDate: string | null;
};

export function useGamePersistence({
  lifetimeSteps,
  revealedMilestoneIds,
  needs,
  stats,
  stage,
  location,
  journeyStartDate,
}: Props) {
  useEffect(() => {
    const saveData: GameSaveData = {
      version: 1,

      lifetimeSteps,

      revealedMilestoneIds,

      needs,

      stats,

      stage,
      location,

      journeyStartDate:
        journeyStartDate ?? undefined,
    };

    saveGame(saveData);
  }, [
    lifetimeSteps,
    revealedMilestoneIds,
    needs,
    stats,
    stage,
    location,
    journeyStartDate,
  ]);
}
