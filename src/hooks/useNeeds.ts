import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  CharacterNeeds,
  INITIAL_NEEDS,
  NeedType,
  NEED_DECAY_AMOUNT,
  NEED_DECAY_INTERVAL,
  clampNeed,
} from "../character/needs";

type Props = {
  activeNeeds: NeedType[];

  initialNeeds?: CharacterNeeds;
};

export function useNeeds({
  activeNeeds,
  initialNeeds = INITIAL_NEEDS,
}: Props) {
  const [needs, setNeeds] =
    useState<CharacterNeeds>(
      () => ({
        ...initialNeeds,
      })
    );

  const needsRef =
    useRef<CharacterNeeds>({
      ...initialNeeds,
    });

  const activeNeedsRef =
    useRef<NeedType[]>(
      activeNeeds
    );

  const protectedNeedRef =
    useRef<NeedType | null>(
      null
    );

  // =========================
  // ACTIVE NEEDS
  // =========================

  useEffect(() => {
    activeNeedsRef.current =
      activeNeeds;
  }, [activeNeeds]);

  // =========================
  // UPDATE NEEDS
  // =========================

  const updateNeeds = (
    updater: (
      current: CharacterNeeds
    ) => CharacterNeeds
  ) => {
    setNeeds((current) => {
      const updated =
        updater(current);

      needsRef.current =
        updated;

      return updated;
    });
  };

  // =========================
  // CHANGE NEED
  // =========================

  const changeNeed = (
    need: NeedType,
    amount: number
  ) => {
    if (
      !activeNeedsRef.current.includes(
        need
      )
    ) {
      return;
    }

    updateNeeds(
      (current) => ({
        ...current,

        [need]: clampNeed(
          current[need] +
            amount
        ),
      })
    );
  };

  // =========================
  // PROTECT NEED
  // =========================

  const protectNeed = (
    need: NeedType | null
  ) => {
    protectedNeedRef.current =
      need;
  };

  // =========================
  // PASSIVE DECAY
  // =========================

  useEffect(() => {
    const interval =
      setInterval(() => {
        updateNeeds(
          (current) => {
            const protectedNeed =
              protectedNeedRef.current;

            const currentlyActive =
              activeNeedsRef.current;

            return {
              SATIETY:
                !currentlyActive.includes(
                  "SATIETY"
                ) ||
                protectedNeed ===
                  "SATIETY"
                  ? current.SATIETY
                  : clampNeed(
                      current.SATIETY -
                        NEED_DECAY_AMOUNT
                    ),

              HAPPINESS:
                !currentlyActive.includes(
                  "HAPPINESS"
                ) ||
                protectedNeed ===
                  "HAPPINESS"
                  ? current.HAPPINESS
                  : clampNeed(
                      current.HAPPINESS -
                        NEED_DECAY_AMOUNT
                    ),

              FUN:
                !currentlyActive.includes(
                  "FUN"
                ) ||
                protectedNeed ===
                  "FUN"
                  ? current.FUN
                  : clampNeed(
                      current.FUN -
                        NEED_DECAY_AMOUNT
                    ),

              ENERGY:
                !currentlyActive.includes(
                  "ENERGY"
                ) ||
                protectedNeed ===
                  "ENERGY"
                  ? current.ENERGY
                  : clampNeed(
                      current.ENERGY -
                        NEED_DECAY_AMOUNT
                    ),
            };
          }
        );
      }, NEED_DECAY_INTERVAL);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return {
    needs,
    needsRef,

    changeNeed,
    protectNeed,
  };
}