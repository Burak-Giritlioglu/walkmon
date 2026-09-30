import React from "react";

import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import type {
  Milestone,
} from "../progression/milestones";

import {
  colors,
  radius,
  spacing,
  typography,
} from "../theme/theme";

type MilestoneProgress = {
  startSteps: number;
  progressSteps: number;
  milestoneGoal: number;
  progress: number;
  progressPercent: `${number}%`;
};

type Props = {
  milestone: Milestone;
  progress: MilestoneProgress;
  isReady: boolean;
  onPress: () => void;
};

export default function MilestoneCard({
  milestone,
  progress,
  isReady,
  onPress,
}: Props) {
  const remainingSteps =
    progress.milestoneGoal -
    progress.progressSteps;

  return (
    <Pressable
      disabled={!isReady}
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,

        isReady &&
          styles.cardReady,

        pressed &&
          isReady &&
          styles.cardPressed,
      ]}
    >
      <View style={styles.topRow}>
        <Text style={styles.eyebrow}>
          {isReady
            ? "MILESTONE READY"
            : "CURRENT JOURNEY"}
        </Text>

        {!isReady && (
          <Text
            style={
              styles.remaining
            }
          >
            {remainingSteps.toLocaleString()}{" "}
            steps left
          </Text>
        )}
      </View>

      <Text style={styles.title}>
        {milestone.title}
      </Text>

      <View
        style={
          styles.progressBackground
        }
      >
        <View
          style={[
            styles.progressFill,
            {
              width:
                progress.progressPercent,
            },
          ]}
        />
      </View>

      <View
        style={styles.bottomRow}
      >
        <Text
          style={
            styles.progressText
          }
        >
          {progress.progressSteps.toLocaleString()}
          {" / "}
          {progress.milestoneGoal.toLocaleString()}
          {" steps"}
        </Text>

        <Text
          style={[
            styles.percent,
            isReady &&
              styles.readyText,
          ]}
        >
          {isReady
            ? "Reveal ›"
            : `${Math.round(
                progress.progress *
                  100
              )}%`}
        </Text>
      </View>
    </Pressable>
  );
}

const styles =
  StyleSheet.create({
    card: {
      marginHorizontal:
        spacing.lg,

      marginTop: spacing.md,
      marginBottom: spacing.md,

      paddingHorizontal:
        spacing.lg,

      paddingTop: 15,
      paddingBottom: 14,

      borderRadius: radius.lg,

      backgroundColor:
        colors.surface,

      borderWidth: 1,

      borderColor:
        colors.glassBorder,

      shadowColor: "#000000",

      shadowOpacity: 0.16,

      shadowRadius: 14,

      shadowOffset: {
        width: 0,
        height: 6,
      },

      elevation: 4,
    },

    cardReady: {
      borderColor:
        colors.green,

      borderWidth: 1.5,
    },

    cardPressed: {
      opacity: 0.86,
    },

    topRow: {
      flexDirection: "row",

      alignItems: "center",

      justifyContent:
        "space-between",

      marginBottom: 7,
    },

    eyebrow: {
      fontSize: 9,

      fontWeight: "800",

      letterSpacing: 1.2,

      color:
        colors.textSecondary,
    },

    remaining: {
      fontSize: 10,

      fontWeight: "500",

      color:
        colors.textSecondary,
    },

    title: {
      fontFamily:
        typography.display
          .fontFamily,

      fontSize: 21,

      fontWeight: "700",

      color:
        colors.textPrimary,

      marginBottom: 12,
    },

    progressBackground: {
      height: 6,

      borderRadius:
        radius.round,

      overflow: "hidden",

      backgroundColor:
        "rgba(241, 231, 214, 0.14)",
    },

    progressFill: {
      height: "100%",

      borderRadius:
        radius.round,

      backgroundColor:
        colors.green,
    },

    bottomRow: {
      flexDirection: "row",

      justifyContent:
        "space-between",

      alignItems: "center",

      marginTop: 8,
    },

    progressText: {
      fontSize: 10,

      fontWeight: "500",

      color:
        colors.textSecondary,
    },

    percent: {
      fontSize: 10,

      fontWeight: "800",

      color:
        colors.textPrimary,
    },

    readyText: {
      color: colors.green,
    },
  });