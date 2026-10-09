import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { AppState } from "react-native";

import {
  getStepsSince,
  requestStepPermission,
} from "../health/healthKit";

type Props = {
  initialJourneyStartDate?: string | null;
  setSteps: (steps: number) => void;
};

export function useHealthKitSync({
  initialJourneyStartDate,
  setSteps,
}: Props) {
  const [journeyStartDate, setJourneyStartDate] =
    useState<string | null>(
      initialJourneyStartDate ?? null
    );

  const [healthKitReady, setHealthKitReady] =
    useState(false);

  const mountedRef = useRef(true);
  const syncRequestRef = useRef(0);

  const syncHealthKitSteps = useCallback(
    async (startDateString: string) => {
      const requestId = ++syncRequestRef.current;

      const steps = await getStepsSince(
        new Date(startDateString)
      );

      if (
        !mountedRef.current ||
        requestId !== syncRequestRef.current ||
        steps === null ||
        !Number.isFinite(steps) ||
        steps < 0
      ) {
        return;
      }

      console.log(
        "[HealthKit] Walkmon Steps Together:",
        steps
      );

      setSteps(steps);
    },
    [setSteps]
  );

  useEffect(() => {
    mountedRef.current = true;

    let cancelled = false;

    async function initializeHealthKit() {
      const authorized = await requestStepPermission();

      if (cancelled) {
        return;
      }

      if (!authorized) {
        console.log(
          "[HealthKit] Step synchronization unavailable."
        );
        return;
      }

      if (journeyStartDate) {
        await syncHealthKitSteps(journeyStartDate);

        if (!cancelled) {
          setHealthKitReady(true);
        }

        return;
      }

      const newJourneyStartDate =
        new Date().toISOString();

      console.log(
        "[HealthKit] Walkmon journey started:",
        newJourneyStartDate
      );

      setJourneyStartDate(newJourneyStartDate);

      // Never reset previously saved steps here.

      if (!cancelled) {
        setHealthKitReady(true);
      }
    }

    initializeHealthKit();

    return () => {
      cancelled = true;
      mountedRef.current = false;
      syncRequestRef.current += 1;
    };
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener(
      "change",
      (nextState) => {
        if (
          nextState !== "active" ||
          !journeyStartDate ||
          !healthKitReady
        ) {
          return;
        }

        syncHealthKitSteps(journeyStartDate);
      }
    );

    return () => {
      subscription.remove();
    };
  }, [
    journeyStartDate,
    healthKitReady,
    syncHealthKitSteps,
  ]);

  return {
    journeyStartDate,
    healthKitReady,
    syncHealthKitSteps,
  };
}