
import React from "react";

import {
  Alert,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import GameWorld from "../game/GameWorld";
import { useGameController } from "../game/useGameController";

import GameHeader from "../components/GameHeader";
import MilestoneCard from "../components/MilestoneCard";
import StepsDebugPanel from "../components/StepsDebugPanel";
import UnlockReveal from "../components/UnlockReveal";

import type { GameSaveData } from "../storage/gameStorage";

import { colors } from "../theme/theme";

type Props = {
  initialSave: GameSaveData | null;
  onResetGame: () => void;
};

export default function GameScreen({
  initialSave,
  onResetGame,
}: Props) {
  const {
    lifetimeSteps,
    addSteps,

    stage,
    location,
    unlockedObjectIds,
    roomUpgradeIds,

    currentNeeds,
    currentStats,
    handleNeedsChange,
    handleStatsChange,

    currentMilestone,
    milestoneProgress,
    isReady,
    revealingMilestone,
    revealTitle,
    handleMilestonePress,
    handlePlaceUnlockedItem,
  } = useGameController({
    initialSave,
  });

  const handleResetPress = () => {
    Alert.alert(
      "Reset Walkmon?",
      "This will delete the current debug save and restart the game from the beginning.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Reset",
          style: "destructive",
          onPress: onResetGame,
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* GAME WORLD */}

      <View style={styles.gameScene}>
        <GameWorld
          stage={stage}
          location={location}
          unlockedObjectIds={unlockedObjectIds}
          roomUpgradeIds={roomUpgradeIds}
          initialNeeds={currentNeeds}
          initialStats={currentStats}
          onNeedsChange={handleNeedsChange}
          onStatsChange={handleStatsChange}
        />
      </View>

      {/* HEADER */}

      <View
        pointerEvents="box-none"
        style={styles.headerLayer}
      >
        <GameHeader lifetimeSteps={lifetimeSteps} />
      </View>

      {/* DEBUG CONTROLS */}

      <View style={styles.debugControls}>
        <StepsDebugPanel
          lifetimeSteps={lifetimeSteps}
          addSteps={addSteps}
        />

        <Pressable
          onPress={handleResetPress}
          style={styles.resetButton}
        >
          <Text style={styles.debugButtonText}>
            RESET
          </Text>
        </Pressable>
      </View>

      {/* MILESTONE */}

      <View
        pointerEvents="box-none"
        style={styles.milestoneLayer}
      >
        {currentMilestone && milestoneProgress && (
          <MilestoneCard
            milestone={currentMilestone}
            progress={milestoneProgress}
            isReady={isReady}
            onPress={handleMilestonePress}
          />
        )}

        {!currentMilestone && (
          <View style={styles.completeCard}>
            <Text style={styles.completeLabel}>
              BABY JOURNEY COMPLETE
            </Text>

            <Text style={styles.completeTitle}>
              🌱 Growing Up
            </Text>

            <Text style={styles.completeText}>
              Your little companion is ready for the next chapter.
            </Text>
          </View>
        )}
      </View>

      {/* UNLOCK REVEAL */}

      <UnlockReveal
        visible={revealingMilestone !== null}
        title={revealTitle}
        objectId={
          revealingMilestone?.unlock.type === "OBJECT"
            ? revealingMilestone.unlock.objectId
            : undefined
        }
        onPlace={handlePlaceUnlockedItem}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
    backgroundColor: colors.background,
  },

  gameScene: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },

  headerLayer: {
    position: "absolute",
    top: 55,
    left: 0,
    right: 0,
    zIndex: 60,
  },

  debugControls: {
    position: "absolute",
    top: 120,
    right: 10,
    zIndex: 100,
    alignItems: "flex-end",
  },

  resetButton: {
    marginTop: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: "rgba(160, 55, 55, 0.82)",
  },

  debugButtonText: {
    color: "#FFFFFF",
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 0.5,
  },

  milestoneLayer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 60,
  },

  completeCard: {
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 12,
    paddingHorizontal: 18,
    paddingVertical: 20,
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    shadowColor: "#000000",
    shadowOpacity: 0.16,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    elevation: 2,
  },

  completeLabel: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.8,
    color: colors.green,
    marginBottom: 5,
  },

  completeTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: colors.textPrimary,
  },

  completeText: {
    marginTop: 5,
    fontSize: 12,
    lineHeight: 17,
    color: colors.textSecondary,
    textAlign: "center",
  },
});
