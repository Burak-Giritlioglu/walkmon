
import React from "react";

import {
  Image,
  StyleSheet,
} from "react-native";

import type {
  ImageSourcePropType,
} from "react-native";

import type {
  WorldObject,
} from "./worldTypes";

type Props = {
  object: WorldObject;
  image: ImageSourcePropType;
};

export default function WorldObjectRenderer({
  object,
  image,
}: Props) {
  return (
    <Image
      source={image}
      style={[
        styles.object,
        {
          left: object.x,
          top: object.y,
          width: object.width,
          height: object.height,
        },
      ]}
      resizeMode="contain"
    />
  );
}

const styles = StyleSheet.create({
  object: {
    position: "absolute",
  },
});
