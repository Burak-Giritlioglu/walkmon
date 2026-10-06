
import React, { useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import type { CharacterStats } from "../character/stats";
import { colors, radius, typography } from "../theme/theme";

type Props = {
  stats: CharacterStats;
};

const STAT_ROWS = [
  { key: "INTELLIGENCE", label: "Intelligence" },
  { key: "CREATIVITY", label: "Creativity" },
  { key: "CURIOSITY", label: "Curiosity" },
  { key: "STRENGTH", label: "Strength" },
  { key: "SOCIAL", label: "Social" },
] as const;

export default function StatsHUD({ stats }: Props) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <View style={styles.container}>
      <Pressable
        onPress={() => setIsExpanded((current) => !current)}
        style={styles.header}
        accessibilityRole="button"
        accessibilityLabel="Character stats"
        accessibilityState={{ expanded: isExpanded }}
      >
        <Text style={styles.title}>CHARACTER</Text>
        <Text style={styles.chevron}>
          {isExpanded ? "⌄" : "⌃"}
        </Text>
      </Pressable>

      {isExpanded && (
        <View style={styles.content}>
          {STAT_ROWS.map((stat) => (
            <View key={stat.key} style={styles.row}>
              <Text style={styles.label}>
                {stat.label}
              </Text>
              <Text style={styles.value}>
                {stats[stat.key]}
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 14,
    bottom: 14,
    width: 150,
    paddingHorizontal: 12,
    paddingTop: 11,
    paddingBottom: 9,
    borderRadius: radius.md,
    backgroundColor: colors.glass,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    zIndex: 40,
    shadowColor: "#000000",
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 4,
    },
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: 18,
  },
  title: {
    fontFamily: typography.display.fontFamily,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1.4,
    color: colors.creamSoft,
  },
  chevron: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.creamSoft,
  },
  content: {
    marginTop: 7,
  },
  row: {
    minHeight: 21,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    fontSize: 11,
    fontWeight: "500",
    color: colors.textSecondary,
  },
  value: {
    minWidth: 18,
    fontFamily: typography.display.fontFamily,
    fontSize: 12,
    fontWeight: "700",
    textAlign: "right",
    color: colors.textPrimary,
  },
});
