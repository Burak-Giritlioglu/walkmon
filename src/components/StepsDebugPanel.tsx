import React from "react";

import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  DEBUG_STEP_LARGE,
  DEBUG_STEP_SMALL,
} from "../steps/steps";

type Props = {
  lifetimeSteps: number;
  addSteps: (amount: number) => void;
};

export default function StepsDebugPanel({
  addSteps,
}: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        DEV STEPS
      </Text>

      <View style={styles.buttons}>
        <Pressable
          style={styles.button}
          onPress={() =>
            addSteps(
              DEBUG_STEP_SMALL
            )
          }
        >
          <Text
            style={
              styles.buttonText
            }
          >
            +100
          </Text>
        </Pressable>

        <Pressable
          style={styles.button}
          onPress={() =>
            addSteps(
              DEBUG_STEP_LARGE
            )
          }
        >
          <Text
            style={
              styles.buttonText
            }
          >
            +1K
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles =
  StyleSheet.create({
    container: {
      paddingHorizontal: 8,
      paddingVertical: 7,

      borderRadius: 10,

      backgroundColor:
        "rgba(45, 39, 35, 0.82)",

      alignItems: "center",
    },

    label: {
      marginBottom: 5,

      fontSize: 8,
      fontWeight: "800",

      letterSpacing: 0.7,

      color:
        "rgba(255,255,255,0.7)",
    },

    buttons: {
      flexDirection: "row",
      gap: 5,
    },

    button: {
      minWidth: 46,

      paddingHorizontal: 8,
      paddingVertical: 6,

      borderRadius: 7,

      backgroundColor:
        "rgba(255,255,255,0.14)",

      alignItems: "center",
    },

    buttonText: {
      color: "#FFFFFF",

      fontSize: 11,
      fontWeight: "800",
    },
  });