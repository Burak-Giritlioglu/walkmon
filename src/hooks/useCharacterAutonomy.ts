
import { useEffect, useRef, useState } from "react";

import type { MutableRefObject } from "react";

import {
  NEED_TRIGGER_THRESHOLD,
  MAX_NEED_VALUE,
} from "../character/needs";

import type {
  CharacterNeeds,
  NeedType,
} from "../character/needs";

import type { CharacterStat } from "../character/stats";

import type { ActivityDefinition } from "../character/activityTypes";

import type {
  CharacterAction,
  WorldObject,
} from "../world/worldTypes";

import { findAutonomousTarget } from "../character/autonomy";

type ControlMode = "IDLE" | "USER" | "AUTO";

const NEED_SWITCH_THRESHOLD = 80;

type UseCharacterAutonomyProps = {
  needsRef: MutableRefObject<CharacterNeeds>;

  activeNeeds: NeedType[];

  availableObjects: WorldObject[];

  activities: Partial<
    Record<CharacterAction, ActivityDefinition>
  >;

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
    onArrival: (object: WorldObject) => void
  ) => void;

  moveHome: (
    onArrival?: () => void
  ) => void;
};

export function useCharacterAutonomy({
  needsRef,
  activeNeeds,
  availableObjects,
  activities,
  changeNeed,
  protectNeed,
  changeStat,
  moveToObject,
  moveHome,
}: UseCharacterAutonomyProps) {
  const [activeObject, setActiveObject] =
    useState<WorldObject | null>(null);

  const [controlMode, setControlMode] =
    useState<ControlMode>("IDLE");

  const activeObjectRef =
    useRef<WorldObject | null>(null);

  const controlModeRef =
    useRef<ControlMode>("IDLE");

  const activeNeedsRef =
    useRef<NeedType[]>(activeNeeds);

  const availableObjectsRef =
    useRef<WorldObject[]>(availableObjects);

  useEffect(() => {
    activeNeedsRef.current = activeNeeds;
  }, [activeNeeds]);

  useEffect(() => {
    availableObjectsRef.current = availableObjects;
  }, [availableObjects]);

  // =========================
  // HELPERS
  // =========================

  const updateActiveObject = (
    object: WorldObject | null
  ) => {
    activeObjectRef.current = object;
    setActiveObject(object);

    protectNeed(
      object?.effect?.need ?? null
    );
  };

  const updateControlMode = (
    mode: ControlMode
  ) => {
    controlModeRef.current = mode;
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
          availableObject.id === object.id
      );

    if (!stillAvailable) {
      updateActiveObject(null);
      updateControlMode("IDLE");
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
      updateControlMode("IDLE");
    });
  };

  // =========================
  // NEED EFFECT
  // =========================

  useEffect(() => {
    if (!activeObject?.effect) {
      return;
    }

    const effect = activeObject.effect;

    const interval = setInterval(() => {
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
      activities[activeObject.action] ?? null;

    if (!activity) {
      return;
    }

    const activityObjectId = activeObject.id;

    const timeout = setTimeout(() => {
      if (
        activeObjectRef.current?.id !==
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

      // Need effect'i olmayan aktiviteler
      // süre sonunda eve döner.
      // Need effect'i olanlar ihtiyaç
      // yönetimi tarafından sonlandırılır.

      if (
        !activeObjectRef.current?.effect
      ) {
        goHome(
          controlModeRef.current
        );
      }
    }, activity.duration);

    return () => {
      clearTimeout(timeout);
    };
  }, [activeObject, activities]);

  // =========================
  // AUTONOMY
  // =========================

  useEffect(() => {
    const interval = setInterval(() => {
      if (
        controlModeRef.current !== "IDLE"
      ) {
        return;
      }

      const target = findAutonomousTarget(
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
    const interval = setInterval(() => {
      const mode = controlModeRef.current;

      if (
        mode !== "AUTO" &&
        mode !== "USER"
      ) {
        return;
      }

      const object =
        activeObjectRef.current;

      if (!object?.effect) {
        return;
      }

      const currentNeed =
        object.effect.need;

      const currentValue =
        needsRef.current[currentNeed];

      // =========================
      // USER INTERACTION
      // =========================

      // Manuel aktivite, ilgili ihtiyaç
      // 100 olunca tamamlanır.

      if (mode === "USER") {
        if (
          currentValue >= MAX_NEED_VALUE
        ) {
          goHome("USER");
        }

        return;
      }

      // =========================
      // AUTO INTERACTION
      // =========================

      // 80'in altındayken mevcut
      // aktiviteyi kesinlikle bırakma.

      if (
        currentValue < NEED_SWITCH_THRESHOLD
      ) {
        return;
      }

      // 80'e ulaştıktan sonra başka
      // 40 altı ihtiyaç varsa ona geç.

      const remainingNeeds =
        activeNeedsRef.current.filter(
          (need) =>
            need !== currentNeed &&
            needsRef.current[need] <
              NEED_TRIGGER_THRESHOLD
        );

      const target = findAutonomousTarget(
        needsRef.current,
        remainingNeeds,
        availableObjectsRef.current
      );

      if (
        target &&
        target.object.id !== object.id
      ) {
        goToObject(
          target.object,
          "AUTO"
        );

        return;
      }

      // Başka acil ihtiyaç yoksa
      // mevcut ihtiyacı 100'e tamamla.

      if (
        currentValue < MAX_NEED_VALUE
      ) {
        return;
      }

      // İhtiyaç 100 ve başka acil
      // ihtiyaç yok: eve dön.

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

  const handleCenterPress = () => {
    goHome("USER");
  };

  return {
    activeObject,
    controlMode,
    handleObjectPress,
    handleCenterPress,
  };
}
