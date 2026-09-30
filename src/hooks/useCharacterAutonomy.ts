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
  NEED_SATISFIED_THRESHOLD,
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
        // Kullanıcı bu sırada başka
        // objeye gittiyse eski activity
        // ödül vermesin.
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

        // Need-based AUTO activity'yi
        // satisfaction sistemi yönetiyor.
        //
        // User activity veya effect'siz
        // activity tamamlandıysa eve dön.
        if (
          controlModeRef.current ===
            "USER" ||
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
  // AUTO NEED SATISFIED
  // =========================

  useEffect(() => {
    const interval =
      setInterval(() => {
        if (
          controlModeRef.current !==
          "AUTO"
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

        const need =
          object.effect.need;

        const value =
          needsRef.current[
            need
          ];

        if (
          value <
          NEED_SATISFIED_THRESHOLD
        ) {
          return;
        }

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

  return {
    activeObject,
    controlMode,

    handleObjectPress,
    handleCenterPress,
  };
}