
import React, { useEffect } from "react";
import { Pressable, StyleSheet, View } from "react-native";

import type { CharacterNeeds, NeedType } from "../character/needs";
import type { CharacterStats } from "../character/stats";
import { babyRoomObjects } from "../world/worldObjects";
import { useNeeds } from "../hooks/useNeeds";
import { useCharacterStats } from "../hooks/useCharacterStats";
import { useCharacterMovement } from "../hooks/useCharacterMovement";
import { useCharacterAutonomy } from "../hooks/useCharacterAutonomy";

import BabyRoomScene from "../scenes/BabyRoomScene";
import BabyCharacter from "./BabyCharacter";
import NeedsHUD from "./NeedsHUD";
import StatsHUD from "./StatsHUD";

type Props = {
  unlockedObjectIds: string[];
  roomUpgradeIds: string[];
  initialNeeds: CharacterNeeds;
  initialStats: CharacterStats;
  onNeedsChange: (needs: CharacterNeeds) => void;
  onStatsChange: (stats: CharacterStats) => void;
};

export default function BabyRoom({
  unlockedObjectIds,
  roomUpgradeIds,
  initialNeeds,
  initialStats,
  onNeedsChange,
  onStatsChange,
}: Props) {
  // AVAILABLE OBJECTS
  const availableObjects = babyRoomObjects.filter(
    (object) => unlockedObjectIds.includes(object.id)
  );

  // ACTIVE NEEDS
  const activeNeeds: NeedType[] = Array.from(
    new Set(
      availableObjects.flatMap((object) =>
        object.effect ? [object.effect.need] : []
      )
    )
  );

  // NEEDS
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
  }, [needs, onNeedsChange]);

  // STATS
  const { stats, changeStat } = useCharacterStats({
    initialStats,
  });

  useEffect(() => {
    onStatsChange(stats);
  }, [stats, onStatsChange]);

  // MOVEMENT
  const {
    babyX,
    babyY,
    moveToObject,
    moveHome,
  } = useCharacterMovement();

  // BEHAVIOR
  const {
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

  return (
    <View style={styles.container}>
      {/* ROOM */}
      <BabyRoomScene
        unlockedObjectIds={unlockedObjectIds}
        roomUpgradeIds={roomUpgradeIds}
      />

      {/* NEEDS */}
      <NeedsHUD
        needs={needs}
        activeNeeds={activeNeeds}
      />

      {/* STATS */}
      <StatsHUD stats={stats} />

      {/* EMPTY ROOM TAP */}
      <Pressable
        style={styles.centerTouchArea}
        onPress={handleCenterPress}
      />

      {/* BABY */}
      <BabyCharacter
        babyX={babyX}
        babyY={babyY}
        onPress={() => {}}
      />

      {/* OBJECT INTERACTIONS */}
      {availableObjects.map((object) => (
        <Pressable
          key={object.id}
          style={[
            styles.objectTouchArea,
            {
              left: object.x,
              top: object.y,
              width: object.width,
              height: object.height,
            },
          ]}
          onPress={() => handleObjectPress(object)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: "hidden",
    backgroundColor: "transparent",
  },

  centerTouchArea: {
    position: "absolute",
    left: 155,
    top: 330,
    width: 90,
    height: 70,
    zIndex: 4,
  },

  objectTouchArea: {
    position: "absolute",
    zIndex: 10,
  },
});
