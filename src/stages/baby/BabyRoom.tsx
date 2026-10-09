
import React from "react";
import {
  ImageBackground,
  StyleSheet,
  View,
} from "react-native";

import type { CharacterNeeds } from "../../character/needs";
import type { CharacterStats } from "../../character/stats";

import ScaledGameContainer from "../../world/ScaledGameContainer";

import BabyRoomScene from "./BabyRoomScene";
import BabyCharacterLayer from "./BabyCharacterLayer";
import BabyInteractionLayer from "./BabyInteractionLayer";

import NeedsHUD from "../../components/NeedsHUD";
import StatsHUD from "../../components/StatsHUD";

import { useBabyRoomController } from "./useBabyRoomController";

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
  const game = useBabyRoomController({
    unlockedObjectIds,
    initialNeeds,
    initialStats,
    onNeedsChange,
    onStatsChange,
  });

  return (
    <View style={styles.container}>
      <ScaledGameContainer>
        <ImageBackground
          source={require("../../../assets/backgrounds/elf-room.png")}
          style={styles.scene}
          resizeMode="stretch"
        >
          <BabyRoomScene
            unlockedObjectIds={unlockedObjectIds}
            roomUpgradeIds={roomUpgradeIds}
            isBabySleeping={game.isBabySleeping}
            isBabyPlayingWithTeddy={game.isBabyPlayingWithTeddy}
            isBabyEating={game.isBabyEating}
            isBabyReading={game.isBabyReading}
            isBabyUsingActivityTable={
              game.isBabyUsingActivityTable
            }
          />

          <BabyCharacterLayer
            babyX={game.babyX}
            babyY={game.babyY}
            movementDirection={game.movementDirection}
            isBabySleeping={game.isBabySleeping}
            isBabyPlayingWithTeddy={game.isBabyPlayingWithTeddy}
            isBabyEating={game.isBabyEating}
            isBabyReading={game.isBabyReading}
            isBabyUsingActivityTable={
              game.isBabyUsingActivityTable
            }
            onPress={game.handleCenterPress}
          />

          <BabyInteractionLayer
            objects={game.interactiveObjects}
            onObjectPress={game.handleObjectPress}
            onFloorPress={game.handleCenterPress}
          />
        </ImageBackground>
      </ScaledGameContainer>

      <View
        pointerEvents="box-none"
        style={styles.needsLayer}
      >
        <NeedsHUD
          needs={game.needs}
          activeNeeds={game.activeNeeds}
        />
      </View>

      <View
        pointerEvents="box-none"
        style={styles.statsLayer}
      >
        <StatsHUD stats={game.stats} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
    overflow: "hidden",
    backgroundColor: "transparent",
  },

  scene: {
    width: "100%",
    height: "100%",
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
