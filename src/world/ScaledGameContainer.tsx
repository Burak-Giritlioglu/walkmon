
import React, { useState } from "react";
import {
  StyleSheet,
  View,
  type LayoutChangeEvent,
} from "react-native";

import {
  SCENE_WIDTH,
  SCENE_HEIGHT,
} from "./sceneConfig";

type Props = {
  children: React.ReactNode;
};

export default function ScaledGameContainer({
  children,
}: Props) {
  const [size, setSize] = useState({
    width: 0,
    height: 0,
  });

  const handleLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;

    setSize((previous) => {
      if (
        previous.width === width &&
        previous.height === height
      ) {
        return previous;
      }

      return { width, height };
    });
  };

  const scale =
    size.width > 0 && size.height > 0
      ? Math.min(
          size.width / SCENE_WIDTH,
          size.height / SCENE_HEIGHT
        )
      : 1;

  const scaledWidth = SCENE_WIDTH * scale;
  const scaledHeight = SCENE_HEIGHT * scale;

  return (
    <View
      style={styles.container}
      onLayout={handleLayout}
    >
      <View
        style={[
          styles.scene,
          {
            width: SCENE_WIDTH,
            height: SCENE_HEIGHT,
            left: (size.width - scaledWidth) / 2,
            top: (size.height - scaledHeight) / 2,
            transform: [{ scale }],
          },
        ]}
      >
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: "hidden",
  },

  scene: {
    position: "absolute",
    transformOrigin: "top left",
  },
});
