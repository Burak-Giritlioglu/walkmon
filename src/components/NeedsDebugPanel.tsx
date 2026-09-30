import React from "react";

import {
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  CharacterNeeds,
  NeedType,
} from "../character/needs";

type Props = {
  needs: CharacterNeeds;

  activeNeeds: NeedType[];

  action: string;

  controlMode: string;
};

export default function NeedsDebugPanel({
  needs,
  activeNeeds,
  action,
  controlMode,
}: Props) {
  return (
    <View
      pointerEvents="none"
      style={styles.panel}
    >
      <Text style={styles.title}>
        DEBUG NEEDS
      </Text>

      {activeNeeds.includes(
        "SATIETY"
      ) && (
        <Text style={styles.text}>
          Satiety:{" "}
          {needs.SATIETY}
        </Text>
      )}

      {activeNeeds.includes(
        "HAPPINESS"
      ) && (
        <Text style={styles.text}>
          Happiness:{" "}
          {needs.HAPPINESS}
        </Text>
      )}

      {activeNeeds.includes(
        "FUN"
      ) && (
        <Text style={styles.text}>
          Fun: {needs.FUN}
        </Text>
      )}

      {activeNeeds.includes(
        "ENERGY"
      ) && (
        <Text style={styles.text}>
          Energy:{" "}
          {needs.ENERGY}
        </Text>
      )}

      <Text style={styles.debug}>
        Action: {action}
      </Text>

      <Text style={styles.debug}>
        Control: {controlMode}
      </Text>
    </View>
  );
}

const styles =
  StyleSheet.create({
    panel: {
      position: "absolute",

      left: 12,
      top: 12,

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

    debug: {
      color: "#DDDDDD",

      fontSize: 9,

      marginTop: 5,
    },
  });