
import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  AppState,
  ImageBackground,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import BabyRoom from "../components/BabyRoom";
import GameHeader from "../components/GameHeader";
import MilestoneCard from "../components/MilestoneCard";
import StepsDebugPanel from "../components/StepsDebugPanel";

import { INITIAL_NEEDS } from "../character/needs";
import type { CharacterNeeds } from "../character/needs";
import { INITIAL_STATS } from "../character/stats";
import type { CharacterStats } from "../character/stats";

import { useSteps } from "../hooks/useSteps";
import { useProgression } from "../hooks/useProgression";

import {
  BABY_MILESTONES,
  getMilestoneProgress,
  getMilestoneStatus,
} from "../progression/milestones";

import {
  getStepsSince,
  requestStepPermission,
} from "../health/healthKit";

import { saveGame } from "../storage/gameStorage";
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
  // STEPS
  const {
    lifetimeSteps,
    addSteps,
    setSteps,
  } = useSteps({
    initialLifetimeSteps: initialSave?.lifetimeSteps ?? 0,
  });

  // JOURNEY
  const [journeyStartDate, setJourneyStartDate] =
    useState<string | null>(
      initialSave?.journeyStartDate ?? null
    );

  const [healthKitReady, setHealthKitReady] = useState(false);

  // PROGRESSION
  const {
    revealedMilestoneIds,
    unlockedObjectIds,
    roomUpgradeIds,
    unlockedStages,
    revealMilestone,
    isMilestoneRevealed,
  } = useProgression({
    initialRevealedMilestoneIds:
      initialSave?.revealedMilestoneIds ?? [],
  });

  // NEEDS
  const [currentNeeds, setCurrentNeeds] =
    useState<CharacterNeeds>(() => ({
      ...(initialSave?.needs ?? INITIAL_NEEDS),
    }));

  const handleNeedsChange = useCallback(
    (needs: CharacterNeeds) => {
      setCurrentNeeds(needs);
    },
    []
  );

  // STATS
  const [currentStats, setCurrentStats] =
    useState<CharacterStats>(() => ({
      ...(initialSave?.stats ?? INITIAL_STATS),
    }));

  const handleStatsChange = useCallback(
    (stats: CharacterStats) => {
      setCurrentStats(stats);
    },
    []
  );

  // CURRENT MILESTONE
  const currentMilestone =
    BABY_MILESTONES.find(
      (milestone) => !isMilestoneRevealed(milestone.id)
    ) ?? null;

  const milestoneProgress = currentMilestone
    ? getMilestoneProgress(lifetimeSteps, currentMilestone)
    : null;

  const milestoneStatus = currentMilestone
    ? getMilestoneStatus(lifetimeSteps, currentMilestone)
    : null;

  const isReady = milestoneStatus === "READY";

  // CURRENT STAGE
  const stage = unlockedStages.includes("CHILD")
    ? "CHILD"
    : "BABY";

  // HEALTHKIT SYNC
  const syncHealthKitSteps = useCallback(
    async (startDateString: string) => {
      const startDate = new Date(startDateString);
      const steps = await getStepsSince(startDate);

      if (steps === null) {
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

  // INITIAL HEALTHKIT SETUP
  useEffect(() => {
    let cancelled = false;

    async function initializeHealthKit() {
      const authorized = await requestStepPermission();

      if (!authorized || cancelled) {
        return;
      }

      if (journeyStartDate) {
        await syncHealthKitSteps(journeyStartDate);

        if (!cancelled) {
          setHealthKitReady(true);
        }

        return;
      }

      const newJourneyStartDate = new Date().toISOString();

      console.log(
        "[HealthKit] Walkmon journey started:",
        newJourneyStartDate
      );

      setJourneyStartDate(newJourneyStartDate);
      setSteps(0);

      if (!cancelled) {
        setHealthKitReady(true);
      }
    }

    initializeHealthKit();

    return () => {
      cancelled = true;
    };
  }, []);

  // FOREGROUND SYNC
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

  // AUTO SAVE
  useEffect(() => {
    const saveData: GameSaveData = {
      version: 1,
      lifetimeSteps,
      revealedMilestoneIds,
      needs: currentNeeds,
      stats: currentStats,
      stage,
      journeyStartDate: journeyStartDate ?? undefined,
    };

    saveGame(saveData);
  }, [
    lifetimeSteps,
    revealedMilestoneIds,
    currentNeeds,
    currentStats,
    stage,
    journeyStartDate,
  ]);

  // REVEAL
  const handleMilestonePress = () => {
    if (!currentMilestone || !isReady) {
      return;
    }

    revealMilestone(currentMilestone.id);
  };

  // RESET
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
          onPress: () => {
            onResetGame();
          },
        },
      ]
    );
  };

  return (
    <ImageBackground
      source={require("../../assets/backgrounds/elf-room.png")}
      style={styles.background}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.container}>
        {/* HEADER */}
        <GameHeader
          stage={stage}
          lifetimeSteps={lifetimeSteps}
        />

        {/* ROOM */}
        <View style={styles.roomContainer}>
          <BabyRoom
            unlockedObjectIds={unlockedObjectIds}
            roomUpgradeIds={roomUpgradeIds}
            initialNeeds={currentNeeds}
            initialStats={currentStats}
            onNeedsChange={handleNeedsChange}
            onStatsChange={handleStatsChange}
          />

          {/* DEVELOPMENT CONTROLS */}
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
        </View>

        {/* MILESTONE */}
        {currentMilestone && milestoneProgress && (
          <MilestoneCard
            milestone={currentMilestone}
            progress={milestoneProgress}
            isReady={isReady}
            onPress={handleMilestonePress}
          />
        )}

        {/* BABY COMPLETE */}
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
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },

  container: {
    flex: 1,
    backgroundColor: "transparent",
  },

  roomContainer: {
    flex: 1,
    position: "relative",
    overflow: "hidden",
  },

  debugControls: {
    position: "absolute",
    top: 10,
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
