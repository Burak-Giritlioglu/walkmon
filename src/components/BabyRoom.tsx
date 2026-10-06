import React, { useEffect } from "react";

import {
  Pressable,
  StyleSheet,
  View,
} from "react-native";

import type {
  CharacterNeeds,
  NeedType,
} from "../character/needs";

import type {
  CharacterStats,
} from "../character/stats";

import {
  babyRoomObjects,
} from "../world/worldObjects";

import {
  useNeeds,
} from "../hooks/useNeeds";

import {
  useCharacterStats,
} from "../hooks/useCharacterStats";

import {
  useCharacterMovement,
} from "../hooks/useCharacterMovement";

import {
  useCharacterAutonomy,
} from "../hooks/useCharacterAutonomy";

import BabyRoomScene from "../scenes/BabyRoomScene";

import BabyCharacter from "./BabyCharacter";
import TeddyPlayAnimation from "./TeddyPlayAnimation";
import NeedsHUD from "./NeedsHUD";
import StatsHUD from "./StatsHUD";

type Props = {
  unlockedObjectIds: string[];
  roomUpgradeIds: string[];

  initialNeeds: CharacterNeeds;
  initialStats: CharacterStats;

  onNeedsChange: (
    needs: CharacterNeeds
  ) => void;

  onStatsChange: (
    stats: CharacterStats
  ) => void;
};

export default function BabyRoom({
  unlockedObjectIds,
  roomUpgradeIds,

  initialNeeds,
  initialStats,

  onNeedsChange,
  onStatsChange,
}: Props) {
  // =========================
  // AVAILABLE OBJECTS
  // =========================

  const availableObjects =
    babyRoomObjects.filter(
      (object) =>
        unlockedObjectIds.includes(
          object.id
        )
    );

  // =========================
  // ACTIVE NEEDS
  // =========================

  const activeNeeds: NeedType[] =
    Array.from(
      new Set(
        availableObjects.flatMap(
          (object) =>
            object.effect
              ? [object.effect.need]
              : []
        )
      )
    );

  // =========================
  // NEEDS
  // =========================

  const {
    needs,
    needsRef,
    changeNeed,
    protectNeed,
  } = useNeeds({
    activeNeeds,
    initialNeeds,
  });

  useEffect(() => {
    onNeedsChange(needs);
  }, [
    needs,
    onNeedsChange,
  ]);

  // =========================
  // STATS
  // =========================

  const {
    stats,
    changeStat,
  } = useCharacterStats({
    initialStats,
  });

  useEffect(() => {
    onStatsChange(stats);
  }, [
    stats,
    onStatsChange,
  ]);

  // =========================
  // CHARACTER MOVEMENT
  // =========================

  const {
    babyX,
    babyY,
    movementDirection,
    moveToObject,
    moveHome,
  } = useCharacterMovement();

  // =========================
  // AUTONOMY
  // =========================

  const {
    isBabySleeping,
    isBabyPlayingWithTeddy,
    isBabyEating,
    isBabyReading,
    isBabyUsingActivityTable,

    handleObjectPress,
    handleCenterPress,
  } = useCharacterAutonomy({
    needsRef,

    activeNeeds,
    availableObjects,

    changeNeed,
    protectNeed,
    changeStat,

    moveToObject,
    moveHome,
  });

  // =========================
  // INTERACTIVE OBJECTS
  // =========================

  const interactiveObjects =
    availableObjects
      .filter(
        (object) =>
          object.id !== "play-rug"
      )
      .sort((a, b) => {
        if (
          a.id === "bookshelf" &&
          b.id !== "bookshelf"
        ) {
          return 1;
        }

        if (
          b.id === "bookshelf" &&
          a.id !== "bookshelf"
        ) {
          return -1;
        }

        return 0;
      });

  return (
    <View style={styles.container}>
      <View style={styles.scene}>
        {/* =====================
            ROOM OBJECTS
           ===================== */}

        <BabyRoomScene
          unlockedObjectIds={
            unlockedObjectIds
          }
          roomUpgradeIds={
            roomUpgradeIds
          }
          isBabySleeping={
            isBabySleeping
          }
          isBabyPlayingWithTeddy={
            isBabyPlayingWithTeddy
          }
          isBabyEating={
            isBabyEating
          }
          isBabyReading={
            isBabyReading
          }
          isBabyUsingActivityTable={
            isBabyUsingActivityTable
          }
        />

        {/* =====================
            FLOOR
           ===================== */}

        <Pressable
          style={
            styles.floorTouchArea
          }
          onPress={
            handleCenterPress
          }
        />

        {/* =====================
            BABY
           ===================== */}

        {isBabyPlayingWithTeddy ? (
          <TeddyPlayAnimation
            babyX={babyX}
            babyY={babyY}
          />
        ) : !isBabySleeping &&
          !isBabyEating &&
          !isBabyReading &&
          !isBabyUsingActivityTable ? (
          <BabyCharacter
            babyX={babyX}
            babyY={babyY}
            movementDirection={
              movementDirection
            }
            onPress={
              handleCenterPress
            }
          />
        ) : null}

        {/* =====================
            OBJECT TOUCH AREAS
           ===================== */}

        {interactiveObjects.map(
  (object) => {
    const isActivityTable =
      object.id ===
      "activity-table";

    return (
      <Pressable
        key={object.id}
        style={[
          styles.objectTouchArea,
          {
            left: isActivityTable
              ? object.x + 50
              : object.x,

            top: isActivityTable
              ? object.y + 15
              : object.y,

            width: isActivityTable
              ? object.width - 30
              : object.width,

            height: isActivityTable
              ? object.height - 30
              : object.height,
          },
        ]}
        onPress={() =>
          handleObjectPress(
            object
          )
        }
      />
    );
  }
)}
      </View>

      {/* =====================
          NEEDS HUD
         ===================== */}

      <View
        pointerEvents="box-none"
        style={
          styles.needsLayer
        }
      >
        <NeedsHUD
          needs={needs}
          activeNeeds={
            activeNeeds
          }
        />
      </View>

      {/* =====================
          STATS HUD
         ===================== */}

      <View
        pointerEvents="box-none"
        style={
          styles.statsLayer
        }
      >
        <StatsHUD
          stats={stats}
        />
      </View>
    </View>
  );
}

const styles =
  StyleSheet.create({
    container: {
      flex: 1,

      position: "relative",

      overflow: "hidden",

      backgroundColor:
        "transparent",
    },

    scene: {
      position: "absolute",

      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },

    floorTouchArea: {
      position: "absolute",

      top: 0,
      left: 0,
      right: 0,
      bottom: 0,

      zIndex: 1,
    },

    objectTouchArea: {
      position: "absolute",

      zIndex: 40,
    },

    needsLayer: {
      position: "absolute",

      top: 125,
      left: 0,
      right: 0,

      height: 180,

      zIndex: 50,
    },

    statsLayer: {
      position: "absolute",

      left: 0,
      right: 0,
      bottom: 120,

      height: 170,

      zIndex: 50,
    },
  });