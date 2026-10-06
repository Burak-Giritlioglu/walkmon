import React, { useEffect, useRef, useState } from "react";
import {
  Image,
  Pressable,
  StyleSheet,
} from "react-native";

import Animated, {
  Extrapolation,
  interpolate,
  runOnJS,
  SharedValue,
  useAnimatedReaction,
  useAnimatedStyle,
} from "react-native-reanimated";

import type { MovementDirection } from "../hooks/useCharacterMovement";

type Props = {
  babyX: SharedValue<number>;
  babyY: SharedValue<number>;
  movementDirection: SharedValue<MovementDirection>;
  onPress: () => void;
};

const BABY_SIZE = 220;

// Room perspective positions
const FRONT_Y = 750;
const MIDDLE_Y = 620;
const BACK_Y = 500;

// Idle perspective
const FRONT_SCALE = 1.6;
const MIDDLE_SCALE = 0.9;
const BACK_SCALE = 0.38;

const IDLE_IMAGES = {
  idle: require("../../assets/characters/elf-baby-idle.png"),
  blinkHalf: require("../../assets/characters/elf-baby-blink-half.png"),
  blinkClosed: require("../../assets/characters/elf-baby-blink-closed.png"),
};

const BACK_CRAWL_IMAGES = [
  require("../../assets/characters/back-crawl-1.png"),
  require("../../assets/characters/back-crawl-2.png"),
  require("../../assets/characters/back-crawl-3.png"),
  require("../../assets/characters/back-crawl-4.png"),
  require("../../assets/characters/back-crawl-5.png"),
  require("../../assets/characters/back-crawl-6.png"),
];

const FORWARD_CRAWL_IMAGES = [
  require("../../assets/characters/forward-crawl-1.png"),
  require("../../assets/characters/forward-crawl-2.png"),
  require("../../assets/characters/forward-crawl-3.png"),
  require("../../assets/characters/forward-crawl-4.png"),
  require("../../assets/characters/forward-crawl-5.png"),
  require("../../assets/characters/forward-crawl-6.png"),
];

type IdleFrame = keyof typeof IDLE_IMAGES;

const CRAWL_FRAME_DURATION = 120;

export default function BabyCharacter({
  babyX,
  babyY,
  movementDirection,
  onPress,
}: Props) {
  const [idleFrame, setIdleFrame] =
    useState<IdleFrame>("idle");

  const [crawlFrame, setCrawlFrame] = useState(0);

  const [direction, setDirection] =
    useState<MovementDirection>(
      movementDirection.value
    );

  const blinkTimeouts = useRef<
    ReturnType<typeof setTimeout>[]
  >([]);

  const nextBlinkTimeout = useRef<
    ReturnType<typeof setTimeout> | null
  >(null);

  /*
   * Reanimated movement direction
   * -> React state
   */
  useAnimatedReaction(
    () => movementDirection.value,
    (current, previous) => {
      if (current !== previous) {
        runOnJS(setDirection)(current);
      }
    },
    [movementDirection]
  );

  /*
   * Position + perspective
   *
   * Idle, forward crawl and back crawl
   * have separate scale curves.
   */
  const babyStyle = useAnimatedStyle(() => {
    // Normal / idle baby
    const normalScale = interpolate(
      babyY.value,
      [BACK_Y, MIDDLE_Y, FRONT_Y],
      [
        BACK_SCALE,
        MIDDLE_SCALE,
        FRONT_SCALE,
      ],
      Extrapolation.CLAMP
    );

    // Crawling toward the viewer
    const forwardScale = interpolate(
      babyY.value,
      [BACK_Y, MIDDLE_Y, FRONT_Y],
      [
        0.34,
        0.75,
        1.05,
      ],
      Extrapolation.CLAMP
    );

    // Crawling away from the viewer
    const backScale = interpolate(
      babyY.value,
      [BACK_Y, MIDDLE_Y, FRONT_Y],
      [
        0.30,
        0.72,
        1.05,
      ],
      Extrapolation.CLAMP
    );

    let scale = normalScale;

    if (
      movementDirection.value === "FORWARD"
    ) {
      scale = forwardScale;
    }

    if (
      movementDirection.value === "BACK"
    ) {
      scale = backScale;
    }

    return {
      transform: [
        {
          translateX:
            babyX.value - BABY_SIZE / 2,
        },
        {
          translateY:
            babyY.value -
            (BABY_SIZE * (1 + scale)) / 2,
        },
        {
          scale,
        },
      ],
    };
  });

  /*
   * Crawl animation
   */
  useEffect(() => {
    if (direction === "IDLE") {
      setCrawlFrame(0);
      return;
    }

    setCrawlFrame(0);

    const interval = setInterval(() => {
      setCrawlFrame(
        (current) => (current + 1) % 6
      );
    }, CRAWL_FRAME_DURATION);

    return () => {
      clearInterval(interval);
    };
  }, [direction]);

  /*
   * Idle blink animation
   */
  useEffect(() => {
    if (direction !== "IDLE") {
      setIdleFrame("idle");
      return;
    }

    let mounted = true;

    const blink = () => {
      if (!mounted) return;

      setIdleFrame("blinkHalf");

      blinkTimeouts.current.push(
        setTimeout(() => {
          if (mounted) {
            setIdleFrame("blinkClosed");
          }
        }, 70)
      );

      blinkTimeouts.current.push(
        setTimeout(() => {
          if (mounted) {
            setIdleFrame("blinkHalf");
          }
        }, 140)
      );

      blinkTimeouts.current.push(
        setTimeout(() => {
          if (mounted) {
            setIdleFrame("idle");
          }
        }, 210)
      );
    };

    const scheduleNextBlink = () => {
      if (!mounted) return;

      const delay =
        3000 + Math.random() * 4000;

      nextBlinkTimeout.current = setTimeout(
        () => {
          blink();
          scheduleNextBlink();
        },
        delay
      );
    };

    scheduleNextBlink();

    return () => {
      mounted = false;

      if (nextBlinkTimeout.current) {
        clearTimeout(
          nextBlinkTimeout.current
        );
      }

      blinkTimeouts.current.forEach(
        clearTimeout
      );

      blinkTimeouts.current = [];
    };
  }, [direction]);

  /*
   * Choose sprite based on movement
   */
  let currentImage;

  if (direction === "BACK") {
    currentImage =
      BACK_CRAWL_IMAGES[crawlFrame];
  } else if (direction === "FORWARD") {
    currentImage =
      FORWARD_CRAWL_IMAGES[crawlFrame];
  } else {
    currentImage =
      IDLE_IMAGES[idleFrame];
  }

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
      >
        <Image
          source={currentImage}
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
    left: 0,
    top: 0,
    width: BABY_SIZE,
    height: BABY_SIZE,
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