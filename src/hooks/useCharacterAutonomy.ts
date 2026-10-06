import {
  useEffect,
  useRef,
  useState,
} from "react";

import type {
  MutableRefObject,
} from "react";

import {
  CharacterNeeds,
  NeedType,
  NEED_TRIGGER_THRESHOLD,
  MAX_NEED_VALUE,
} from "../character/needs";

import type {
  CharacterStat,
} from "../character/stats";

import {
  getActivity,
} from "../character/activities";

import {
  WorldObject,
} from "../world/worldObjects";

import {
  findAutonomousTarget,
} from "../character/autonomy";

type ControlMode =
  | "IDLE"
  | "USER"
  | "AUTO";

type UseCharacterAutonomyProps = {
  needsRef: MutableRefObject<CharacterNeeds>;

  activeNeeds: NeedType[];

  availableObjects: WorldObject[];

  changeNeed: (
    need: NeedType,
    amount: number
  ) => void;

  protectNeed: (
    need: NeedType | null
  ) => void;

  changeStat: (
    stat: CharacterStat,
    amount: number
  ) => void;

  moveToObject: (
    object: WorldObject,
    onArrival: (
      object: WorldObject
    ) => void
  ) => void;

  moveHome: (
    onArrival?: () => void
  ) => void;
};

export function useCharacterAutonomy({
  needsRef,

  activeNeeds,
  availableObjects,

  changeNeed,
  protectNeed,
  changeStat,

  moveToObject,
  moveHome,
}: UseCharacterAutonomyProps) {
  const [
    activeObject,
    setActiveObject,
  ] =
    useState<WorldObject | null>(
      null
    );

  const [
    controlMode,
    setControlMode,
  ] =
    useState<ControlMode>(
      "IDLE"
    );

  const activeObjectRef =
    useRef<WorldObject | null>(
      null
    );

  const controlModeRef =
    useRef<ControlMode>(
      "IDLE"
    );

  const activeNeedsRef =
    useRef<NeedType[]>(
      activeNeeds
    );

  const availableObjectsRef =
    useRef<WorldObject[]>(
      availableObjects
    );

  useEffect(() => {
    activeNeedsRef.current =
      activeNeeds;
  }, [activeNeeds]);

  useEffect(() => {
    availableObjectsRef.current =
      availableObjects;
  }, [availableObjects]);

  // =========================
  // HELPERS
  // =========================

  const updateActiveObject = (
    object: WorldObject | null
  ) => {
    activeObjectRef.current =
      object;

    setActiveObject(object);

    protectNeed(
      object?.effect?.need ??
        null
    );
  };

  const updateControlMode = (
    mode: ControlMode
  ) => {
    controlModeRef.current =
      mode;

    setControlMode(mode);
  };

  // =========================
  // INTERACTION
  // =========================

  const startInteraction = (
    object: WorldObject
  ) => {
    const stillAvailable =
      availableObjectsRef.current.some(
        (availableObject) =>
          availableObject.id ===
          object.id
      );

    if (!stillAvailable) {
      updateActiveObject(null);

      updateControlMode(
        "IDLE"
      );

      return;
    }

    updateActiveObject(object);
  };

  const goToObject = (
    object: WorldObject,
    mode: ControlMode
  ) => {
    updateActiveObject(null);

    updateControlMode(mode);

    moveToObject(
      object,
      startInteraction
    );
  };

  const goHome = (
    mode: ControlMode
  ) => {
    updateActiveObject(null);

    updateControlMode(mode);

    moveHome(() => {
      updateControlMode(
        "IDLE"
      );
    });
  };

  // =========================
  // NEED EFFECT
  // =========================

  useEffect(() => {
    if (
      !activeObject?.effect
    ) {
      return;
    }

    const effect =
      activeObject.effect;

    const interval =
      setInterval(() => {
        changeNeed(
          effect.need,
          effect.amount
        );
      }, effect.interval);

    return () => {
      clearInterval(interval);
    };
  }, [activeObject]);

  // =========================
  // ACTIVITY COMPLETION
  // =========================

  useEffect(() => {
    if (!activeObject) {
      return;
    }

    const activity =
      getActivity(
        activeObject.action
      );

    if (!activity) {
      return;
    }

    const activityObjectId =
      activeObject.id;

    const timeout =
      setTimeout(() => {
        if (
          activeObjectRef.current
            ?.id !==
          activityObjectId
        ) {
          return;
        }

        activity.statRewards.forEach(
          (reward) => {
            changeStat(
              reward.stat,
              reward.amount
            );
          }
        );

        // Need effect'i olmayan
        // aktiviteler duration sonunda
        // eve döner.
        //
        // Need effect'i olan aktiviteler
        // need 100 olana kadar devam eder.
        if (
          !activeObjectRef.current
            ?.effect
        ) {
          goHome(
            controlModeRef.current
          );
        }
      }, activity.duration);

    return () => {
      clearTimeout(timeout);
    };
  }, [activeObject]);

  // =========================
  // AUTONOMY
  // =========================

  useEffect(() => {
    const interval =
      setInterval(() => {
        if (
          controlModeRef.current !==
          "IDLE"
        ) {
          return;
        }

        const target =
          findAutonomousTarget(
            needsRef.current,

            activeNeedsRef.current,

            availableObjectsRef.current
          );

        if (!target) {
          return;
        }

        goToObject(
          target.object,
          "AUTO"
        );
      }, 500);

    return () => {
      clearInterval(interval);
    };
  }, []);

  // =========================
  // NEED INTERACTION MANAGEMENT
  // =========================

  useEffect(() => {
    const interval =
      setInterval(() => {
        const mode =
          controlModeRef.current;

        if (
          mode !== "AUTO" &&
          mode !== "USER"
        ) {
          return;
        }

        const object =
          activeObjectRef.current;

        if (
          !object?.effect
        ) {
          return;
        }

        const currentNeed =
          object.effect.need;

        const currentValue =
          needsRef.current[
            currentNeed
          ];

        // =========================
        // USER INTERACTION
        // =========================

        // Kullanıcı bebeği bir need
        // objesine gönderdiyse,
        // need 100 olduğunda aktivite
        // biter ve bebek eve döner.
        if (mode === "USER") {
          if (
            currentValue >=
            MAX_NEED_VALUE
          ) {
            goHome("USER");
          }

          return;
        }

        // =========================
        // AUTO INTERACTION
        // =========================

        // AUTO modunda başka 40 altı
        // need var mı kontrol et.
        const otherLowNeeds =
          activeNeedsRef.current
            .filter(
              (need) =>
                need !== currentNeed
            )
            .filter(
              (need) =>
                needsRef.current[
                  need
                ] <
                NEED_TRIGGER_THRESHOLD
            )
            .sort(
              (a, b) =>
                needsRef.current[a] -
                needsRef.current[b]
            );

        // Başka 40 altı need varsa
        // en düşük olanına geç.
        if (
          otherLowNeeds.length > 0
        ) {
          const target =
            findAutonomousTarget(
              needsRef.current,

              otherLowNeeds,

              availableObjectsRef.current
            );

          if (
            target &&
            target.object.id !==
              object.id
          ) {
            goToObject(
              target.object,
              "AUTO"
            );

            return;
          }
        }

        // Başka düşük need yoksa
        // mevcut need'i 100'e kadar
        // doldurmaya devam et.
        if (
          currentValue <
          MAX_NEED_VALUE
        ) {
          return;
        }

        // Need 100 oldu ve başka
        // 40 altı need yok.
        goHome("AUTO");
      }, 500);

    return () => {
      clearInterval(interval);
    };
  }, []);

  // =========================
  // USER COMMANDS
  // =========================

  const handleObjectPress = (
    object: WorldObject
  ) => {
    goToObject(
      object,
      "USER"
    );
  };

  const handleCenterPress =
    () => {
      goHome("USER");
    };

  // =========================
  // SPECIAL VISUAL STATES
  // =========================

  const isBabySleeping =
    activeObject?.id === "crib";

  const isBabyPlayingWithTeddy =
    activeObject?.id === "toy";

  const isBabyEating =
    activeObject?.id ===
    "high-chair";

  const isBabyReading =
    activeObject?.id ===
    "bookshelf";

  const isBabyUsingActivityTable =
    activeObject?.id ===
    "activity-table";

  return {
    activeObject,
    controlMode,

    isBabySleeping,
    isBabyPlayingWithTeddy,
    isBabyEating,
    isBabyReading,
    isBabyUsingActivityTable,

    handleObjectPress,
    handleCenterPress,
  };
}