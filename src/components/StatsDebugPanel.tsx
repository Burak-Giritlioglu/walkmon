import React from "react";

import {
  StyleSheet,
  Text,
  View,
} from "react-native";

import type {
  CharacterStats,
} from "../character/stats";

type Props = {
  stats: CharacterStats;
};

export default function StatsDebugPanel({
  stats,
}: Props) {
  return (
    <View
      pointerEvents="none"
      style={styles.panel}
    >
      <Text style={styles.title}>
        DEBUG STATS
      </Text>

      <Text style={styles.text}>
        Intelligence:{" "}
        {stats.INTELLIGENCE}
      </Text>

      <Text style={styles.text}>
        Creativity:{" "}
        {stats.CREATIVITY}
      </Text>

      <Text style={styles.text}>
        Curiosity:{" "}
        {stats.CURIOSITY}
      </Text>

      <Text style={styles.text}>
        Strength:{" "}
        {stats.STRENGTH}
      </Text>

      <Text style={styles.text}>
        Social:{" "}
        {stats.SOCIAL}
      </Text>
    </View>
  );
}

const styles =
  StyleSheet.create({
    panel: {
      position: "absolute",

      left: 12,
      top: 135,

      paddingHorizontal: 12,
      paddingVertical: 9,

      borderRadius: 10,

      backgroundColor:
        "rgba(0,0,0,0.78)",

      zIndex: 30,
    },

    title: {
      color: "#FFFFFF",

      fontSize: 10,
      fontWeight: "800",

      marginBottom: 4,
    },

    text: {
      color: "#FFFFFF",

      fontSize: 10,
      lineHeight: 15,
    },
  });