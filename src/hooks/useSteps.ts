import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  INITIAL_LIFETIME_STEPS,
} from "../steps/steps";

type Props = {
  initialLifetimeSteps?: number;
};

export function useSteps({
  initialLifetimeSteps =
    INITIAL_LIFETIME_STEPS,
}: Props = {}) {
  const [
    lifetimeSteps,
    setLifetimeSteps,
  ] =
    useState<number>(
      initialLifetimeSteps
    );

  const lifetimeStepsRef =
    useRef<number>(
      initialLifetimeSteps
    );

  // =========================
  // LOAD / EXTERNAL UPDATE
  // =========================

  useEffect(() => {
    setLifetimeSteps(
      initialLifetimeSteps
    );

    lifetimeStepsRef.current =
      initialLifetimeSteps;
  }, [initialLifetimeSteps]);

  // =========================
  // SET STEPS
  // =========================

  const setSteps = (
    amount: number
  ) => {
    const updated =
      Math.max(
        0,
        Math.round(amount)
      );

    lifetimeStepsRef.current =
      updated;

    setLifetimeSteps(updated);
  };

  // =========================
  // ADD STEPS
  // =========================

  const addSteps = (
    amount: number
  ) => {
    setLifetimeSteps(
      (current) => {
        const updated =
          Math.max(
            0,
            current + amount
          );

        lifetimeStepsRef.current =
          updated;

        return updated;
      }
    );
  };

  return {
    lifetimeSteps,
    lifetimeStepsRef,

    setSteps,
    addSteps,
  };
}