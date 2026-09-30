import {
  useRef,
  useState,
} from "react";

import {
  CharacterStat,
  CharacterStats,
  INITIAL_STATS,
  clampStat,
} from "../character/stats";

type Props = {
  initialStats?: CharacterStats;
};

export function useCharacterStats({
  initialStats = INITIAL_STATS,
}: Props = {}) {
  const [stats, setStats] =
    useState<CharacterStats>(
      () => ({
        ...initialStats,
      })
    );

  const statsRef =
    useRef<CharacterStats>({
      ...initialStats,
    });

  const changeStat = (
    stat: CharacterStat,
    amount: number
  ) => {
    setStats((current) => {
      const updated = {
        ...current,

        [stat]: clampStat(
          current[stat] +
            amount
        ),
      };

      statsRef.current =
        updated;

      return updated;
    });
  };

  return {
    stats,
    statsRef,

    changeStat,
  };
}