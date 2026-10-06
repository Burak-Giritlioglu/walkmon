import React from "react";

import {
  StyleSheet,
  Text,
  View,
} from "react-native";

import type {
  CharacterNeeds,
  NeedType,
} from "../character/needs";

import {
  colors,
  radius,
  typography,
} from "../theme/theme";

type Props = {
  needs: CharacterNeeds;
  activeNeeds: NeedType[];
};

const NEED_CONFIG: Record<
  NeedType,
  {
    icon: string;
    label: string;
  }
> = {
  ENERGY: {
    icon: "⚡",
    label: "Energy",
  },

  HAPPINESS: {
    icon: "♥",
    label: "Happiness",
  },

  FUN: {
    icon: "✦",
    label: "Fun",
  },

  SATIETY: {
    icon: "●",
    label: "Fullness",
  },
};

export default function NeedsHUD({
  needs,
  activeNeeds,
}: Props) {
  return (
    <View
      pointerEvents="none"
      style={styles.container}
    >
      <Text style={styles.title}>
        NEEDS
      </Text>

      {activeNeeds.map((need) => {
        const value = Math.round(
          needs[need]
        );

        const config =
          NEED_CONFIG[need];

        return (
          <View
            key={need}
            style={styles.need}
          >
            <View
              style={
                styles.needHeader
              }
            >
              <View
                style={
                  styles.labelContainer
                }
              >
                <Text
                  style={styles.icon}
                >
                  {config.icon}
                </Text>

                <Text
                  style={styles.label}
                >
                  {config.label}
                </Text>
              </View>

              <Text
                style={styles.value}
              >
                {value}
              </Text>
            </View>

            <View
              style={
                styles.barBackground
              }
            >
              <View
                style={[
                  styles.barFill,
                  {
                    width: `${value}%`,
                  },
                ]}
              />
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles =
  StyleSheet.create({
    container: {
      position: "absolute",
      top: 14,
      left: 14,
      width: 150,
      paddingHorizontal: 12,
      paddingTop: 11,
      paddingBottom: 8,
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

    title: {
      marginBottom: 8,

      fontFamily:
        typography.display
          .fontFamily,

      fontSize: 10,

      fontWeight: "700",

      letterSpacing: 1.4,

      color:
        colors.creamSoft,
    },

    need: {
      marginBottom: 8,
    },

    needHeader: {
      flexDirection: "row",

      justifyContent:
        "space-between",

      alignItems: "center",

      marginBottom: 4,
    },

    labelContainer: {
      flexDirection: "row",

      alignItems: "center",
    },

    icon: {
      width: 20,

      fontSize: 11,

      color: colors.green,
    },

    label: {
      fontSize: 11,

      fontWeight: "600",

      color:
        colors.textPrimary,
    },

    value: {
      fontSize: 10,

      fontWeight: "700",

      color:
        colors.textSecondary,
    },

    barBackground: {
      height: 4,

      borderRadius: 999,

      overflow: "hidden",

      backgroundColor:
        "rgba(241, 231, 214, 0.15)",
    },

    barFill: {
      height: "100%",

      borderRadius: 999,

      backgroundColor:
        colors.green,
    },
  });