import { useCallback, useState } from "react";

import {
  INITIAL_NEEDS,
} from "../character/needs";
import type {
  CharacterNeeds,
} from "../character/needs";

import {
  INITIAL_STATS,
} from "../character/stats";
import type {
  CharacterStats,
} from "../character/stats";

type Props = {
  initialNeeds?: CharacterNeeds;
  initialStats?: CharacterStats;
};

export function useCharacterState({
  initialNeeds,
  initialStats,
}: Props) {
  const [currentNeeds, setCurrentNeeds] =
    useState<CharacterNeeds>(() => ({
      ...(initialNeeds ?? INITIAL_NEEDS),
    }));

  const [currentStats, setCurrentStats] =
    useState<CharacterStats>(() => ({
      ...(initialStats ?? INITIAL_STATS),
    }));

  const handleNeedsChange = useCallback(
    (needs: CharacterNeeds) => {
      setCurrentNeeds(needs);
    },
    []
  );

  const handleStatsChange = useCallback(
    (stats: CharacterStats) => {
      setCurrentStats(stats);
    },
    []
  );

  return {
    currentNeeds,
    currentStats,
    handleNeedsChange,
    handleStatsChange,
  };
}