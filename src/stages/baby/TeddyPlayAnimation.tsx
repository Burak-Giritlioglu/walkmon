import React, {
  useEffect,
  useState,
} from "react";

import {
  Image,
  StyleSheet,
} from "react-native";

import Animated, {
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";

type Props = {
  babyX: SharedValue<number>;
  babyY: SharedValue<number>;
};

const PLAY_SIZE = 180;

// Room perspective positions
const FRONT_Y = 750;
const MIDDLE_Y = 620;
const BACK_Y = 500;

// Same perspective scale as idle baby
const FRONT_SCALE = 1.6;
const MIDDLE_SCALE = 0.9;
const BACK_SCALE = 0.38;

// Teddy play position
const PLAY_X = 190;
const PLAY_Y = 590;

// Animation speed
const FRAME_DURATION = 150;

const FRAMES = [
  require("../../../assets/characters/baby-teddy-play-1.png"),
  require("../../../assets/characters/baby-teddy-play-2.png"),
  require("../../../assets/characters/baby-teddy-play-3.png"),
  require("../../../assets/characters/baby-teddy-play-4.png"),
  require("../../../assets/characters/baby-teddy-play-5.png"),
  require("../../../assets/characters/baby-teddy-play-6.png"),
  require("../../../assets/characters/baby-teddy-play-7.png"),
  require("../../../assets/characters/baby-teddy-play-8.png"),
  require("../../../assets/characters/baby-teddy-play-9.png"),
  require("../../../assets/characters/baby-teddy-play-10.png"),
  require("../../../assets/characters/baby-teddy-play-11.png"),
  require("../../../assets/characters/baby-teddy-play-12.png"),
];

export default function TeddyPlayAnimation({
  babyY,
}: Props) {
  const [
    frameIndex,
    setFrameIndex,
  ] = useState(0);

  /*
   * Teddy play animation
   */
  useEffect(() => {
    setFrameIndex(0);

    const interval = setInterval(() => {
      setFrameIndex(
        (current) =>
          (current + 1) %
          FRAMES.length
      );
    }, FRAME_DURATION);

    return () => {
      clearInterval(interval);
    };
  }, []);

  /*
   * Position + perspective
   */
  const playStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      babyY.value,
      [
        BACK_Y,
        MIDDLE_Y,
        FRONT_Y,
      ],
      [
        BACK_SCALE,
        MIDDLE_SCALE,
        FRONT_SCALE,
      ],
      Extrapolation.CLAMP
    );

    return {
      transform: [
        {
          translateX:
            PLAY_X -
            PLAY_SIZE / 2,
        },
        {
          translateY:
            PLAY_Y -
            (PLAY_SIZE *
              (1 + scale)) /
              2,
        },
        {
          scale,
        },
      ],
    };
  });

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.container,
        playStyle,
      ]}
    >
      <Image
        source={
          FRAMES[frameIndex]
        }
        style={styles.image}
        resizeMode="contain"
      />
    </Animated.View>
  );
}

const styles =
  StyleSheet.create({
    container: {
      position: "absolute",

      left: 0,
      top: 0,

      width: PLAY_SIZE,
      height: PLAY_SIZE,

      zIndex: 30,

      alignItems: "center",
      justifyContent: "center",
    },

    image: {
      width: "100%",
      height: "100%",
    },
  });