import React from "react";

import {
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  colors,
  spacing,
  typography,
} from "../theme/theme";

type Props = {
  stage: "BABY" | "CHILD";
  lifetimeSteps: number;
};

export default function GameHeader({
  stage,
  lifetimeSteps,
}: Props) {
  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.title}>
          Walkmon
        </Text>

        <Text style={styles.stage}>
          {stage === "BABY"
            ? "Baby Journey"
            : "Child Journey"}
        </Text>
      </View>

      <View style={styles.steps}>
        <View
          style={
            styles.stepsTopRow
          }
        >
          <Text
            style={styles.footsteps}
          >
            👣
          </Text>

          <Text
            style={
              styles.stepsValue
            }
          >
            {lifetimeSteps.toLocaleString()}
          </Text>
        </View>

        <Text
          style={styles.stepsLabel}
        >
          steps together
        </Text>
      </View>
    </View>
  );
}

const styles =
  StyleSheet.create({
    container: {
      paddingHorizontal:
        spacing.xl,

      paddingTop: spacing.md,

      paddingBottom:
        spacing.md,

      flexDirection: "row",

      justifyContent:
        "space-between",

      alignItems: "center",

      backgroundColor:
        "transparent",
    },

    title: {
      fontFamily:
        typography.display
          .fontFamily,

      fontWeight:
        typography.display
          .fontWeight,

      fontSize: 27,

      letterSpacing: -0.6,

      color:
        colors.textPrimary,
    },

    stage: {
      marginTop: 2,

      fontSize: 11,

      fontWeight: "600",

      letterSpacing: 0.5,

      color:
        colors.textSecondary,
    },

    steps: {
      alignItems: "flex-end",
    },

    stepsTopRow: {
      flexDirection: "row",

      alignItems: "center",
    },

    footsteps: {
      marginRight: 5,

      fontSize: 14,
    },

    stepsValue: {
      fontFamily:
        typography.display
          .fontFamily,

      fontWeight: "700",

      fontSize: 21,

      color:
        colors.textPrimary,
    },

    stepsLabel: {
      marginTop: -1,

      fontSize: 10,

      fontWeight: "500",

      letterSpacing: 0.2,

      color:
        colors.textSecondary,
    },
  });