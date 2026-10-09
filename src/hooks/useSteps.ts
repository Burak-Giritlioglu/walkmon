import { useCallback, useRef, useState } from "react";

import { INITIAL_LIFETIME_STEPS } from "../steps/steps";

type Props = {
  initialLifetimeSteps?: number;
};

export function useSteps({
  initialLifetimeSteps = INITIAL_LIFETIME_STEPS,
}: Props = {}) {
  const [lifetimeSteps, setLifetimeSteps] = useState<number>(
    initialLifetimeSteps
  );

  const lifetimeStepsRef = useRef<number>(
    initialLifetimeSteps
  );

  // HealthKit updates must never reduce saved progress.
  const setSteps = useCallback((amount: number) => {
    if (!Number.isFinite(amount)) {
      return;
    }

    const incomingSteps = Math.max(0, Math.round(amount));

    setLifetimeSteps((current) => {
      const updated = Math.max(current, incomingSteps);

      lifetimeStepsRef.current = updated;

      return updated;
    });
  }, []);

  // Debug-only step additions.
  const addSteps = useCallback((amount: number) => {
    if (!Number.isFinite(amount)) {
      return;
    }

    setLifetimeSteps((current) => {
      const updated = Math.max(
        0,
        Math.round(current + amount)
      );

      lifetimeStepsRef.current = updated;

      return updated;
    });
  }, []);

  return {
    lifetimeSteps,
    lifetimeStepsRef,
    setSteps,
    addSteps,
  };
}