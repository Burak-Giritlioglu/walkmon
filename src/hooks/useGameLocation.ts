
import { useCallback, useEffect, useState } from "react";

import type {
  GameLocation,
  LifeStage,
} from "../game/gameTypes";

import {
  canAccessLocation,
  getValidLocation,
} from "../game/locationRules";

type Props = {
  stage: LifeStage;
  initialLocation?: GameLocation;
};

export function useGameLocation({
  stage,
  initialLocation = "HOME",
}: Props) {
  // =========================
  // LOCATION STATE
  // =========================

  const [requestedLocation, setRequestedLocation] =
    useState<GameLocation>(() =>
      getValidLocation(stage, initialLocation)
    );

  // =========================
  // VALID LOCATION
  // =========================

  const location = getValidLocation(
    stage,
    requestedLocation
  );

  // =========================
  // STAGE VALIDATION
  // =========================

  useEffect(() => {
    setRequestedLocation((currentLocation) =>
      getValidLocation(stage, currentLocation)
    );
  }, [stage]);

  // =========================
  // CHANGE LOCATION
  // =========================

  const changeLocation = useCallback(
    (nextLocation: GameLocation): boolean => {
      if (!canAccessLocation(stage, nextLocation)) {
        return false;
      }

      setRequestedLocation(nextLocation);
      return true;
    },
    [stage]
  );

  return {
    location,
    changeLocation,
  };
}
