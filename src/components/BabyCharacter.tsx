
import React from "react";
import { Image, Pressable, StyleSheet } from "react-native";
import Animated, {
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";

import { HOME_POSITION } from "../hooks/useCharacterMovement";

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
  const babyStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: babyX.value - HOME_POSITION.x,
      },
      {
        translateY: babyY.value - HOME_POSITION.y,
      },
    ],
  }));

  return (
    <Animated.View
      style={[styles.babyContainer, babyStyle]}
    >
      <Pressable
        onPress={onPress}
        hitSlop={12}
        style={styles.babyButton}
      >
        <Image
          source={require("../../assets/characters/elf-baby-sitting.png")}
          style={styles.babyImage}
          resizeMode="contain"
        />
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  babyContainer: {
    position: "absolute",
    left: 105,
    top: 280,
    width: 180,
    height: 180,
    zIndex: 30,
  },

  babyButton: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },

  babyImage: {
    width: "100%",
    height: "100%",
  },
});
