import React from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { colors, typography } from "../theme/theme";

type Props = {
  lifetimeSteps: number;
  onOpenSettings?: () => void;
};

export default function GameHeader({
  lifetimeSteps,
  onOpenSettings,
}: Props) {
  return (
    <View style={styles.container}>
      <Pressable
        style={styles.settingsButton}
        onPress={onOpenSettings}
        accessibilityRole="button"
        accessibilityLabel="Open settings"
        disabled={!onOpenSettings}
      >
        <Text style={styles.settingsIcon}>⚙️</Text>
      </Pressable>

      <View style={styles.steps}>
        <View style={styles.stepsTopRow}>
          <Text style={styles.footsteps}>👣</Text>

          <Text style={styles.stepsValue}>
            {lifetimeSteps.toLocaleString()}
          </Text>
        </View>

        <Text style={styles.stepsLabel}>
          steps together
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  settingsButton: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  settingsIcon: {
    fontSize: 25,
  },
  steps: {
    flexShrink: 0,
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
    fontFamily: typography.display.fontFamily,
    fontWeight: "700",
    fontSize: 21,
    color: colors.textPrimary,
  },
  stepsLabel: {
    marginTop: -1,
    fontSize: 10,
    fontWeight: "500",
    letterSpacing: 0.2,
    color: colors.textSecondary,
  },
});