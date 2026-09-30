import React from "react";

import {
  Pressable,
  StyleSheet,
} from "react-native";

import Animated, {
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";

import {
  HOME_POSITION,
} from "../hooks/useCharacterMovement";

type Props = {
  babyX: SharedValue<number>;
  babyY: SharedValue<number>;
  onPress: () => void;
};

export default function BabyCharacter({
  babyX,
  babyY,
  onPress,
}: Props) {
  const babyStyle =
    useAnimatedStyle(() => {
      return {
        transform: [
          {
            translateX:
              babyX.value -
              HOME_POSITION.x,
          },
          {
            translateY:
              babyY.value -
              HOME_POSITION.y,
          },
        ],
      };
    });

  return (
    <Animated.View
      style={[
        styles.babyContainer,
        babyStyle,
      ]}
    >
      <Pressable
        onPress={onPress}
        hitSlop={12}
        style={styles.babyButton}
      />
    </Animated.View>
  );
}

const styles =
  StyleSheet.create({
    babyContainer: {
      position: "absolute",

      left: 163,
      top: 338,

      width: 54,
      height: 54,

      zIndex: 30,
    },

    babyButton: {
      width: 54,
      height: 54,

      borderRadius: 27,

      backgroundColor:
        "#7E9B76",
    },
  });