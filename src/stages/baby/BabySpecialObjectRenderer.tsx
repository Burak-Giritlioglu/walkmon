
import React from "react";
import { Image, StyleSheet, View } from "react-native";

import type { WorldObject } from "../../world/worldTypes";
import WorldObjectRenderer from "../../world/WorldObjectRenderer";
import {
  BABY_OBJECT_IMAGES,
  BABY_STATE_IMAGES,
} from "./babyAssets";

type Props = {
  object: WorldObject;
  isBabySleeping: boolean;
  isBabyEating: boolean;
  isBabyReading: boolean;
  isBabyUsingActivityTable: boolean;
};

export default function BabySpecialObjectRenderer({
  object,
  isBabySleeping,
  isBabyEating,
  isBabyReading,
  isBabyUsingActivityTable,
}: Props) {
  if (object.id === "crib") {
    const image = isBabySleeping
      ? BABY_STATE_IMAGES.sleeping
      : BABY_OBJECT_IMAGES.crib;

    return (
      <View
        style={[
          styles.object,
          {
            left: object.x,
            top: object.y,
            width: object.width,
            height: object.height,
          },
        ]}
      >
        <Image
          source={image}
          style={{
            position: "absolute",
            left: -1,
            top: -1,
            width: object.width + 1,
            height: object.height + 1,
            opacity: 0.1,
          }}
          resizeMode="contain"
          blurRadius={4}
        />

        <Image
          source={image}
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: object.width,
            height: object.height,
          }}
          resizeMode="contain"
        />
      </View>
    );
  }

  if (object.id === "high-chair") {
    return (
      <WorldObjectRenderer
        object={object}
        image={
          isBabyEating
            ? BABY_STATE_IMAGES.eating
            : BABY_OBJECT_IMAGES["high-chair"]
        }
      />
    );
  }

  if (object.id === "bookshelf") {
    return (
      <View
        style={[
          styles.object,
          {
            left: object.x,
            top: object.y,
            width: object.width,
            height: object.height,
          },
        ]}
      >
        <Image
          source={BABY_OBJECT_IMAGES.bookshelf}
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: object.width,
            height: object.height,
          }}
          resizeMode="contain"
        />

        {isBabyReading && (
          <Image
            source={BABY_STATE_IMAGES.reading}
            style={{
              position: "absolute",
              left: 55,
              top: 70,
              width: 50,
              height: 90,
            }}
            resizeMode="contain"
          />
        )}
      </View>
    );
  }

  if (object.id === "activity-table") {
    if (isBabyUsingActivityTable) {
      return (
        <Image
          source={BABY_STATE_IMAGES.activity}
          style={{
            position: "absolute",
            left: object.x - 10,
            top: object.y - 18,
            width: object.width + 12,
            height: object.height + 10,
          }}
          resizeMode="contain"
        />
      );
    }

    return (
      <WorldObjectRenderer
        object={object}
        image={BABY_OBJECT_IMAGES["activity-table"]}
      />
    );
  }

  return null;
}

const styles = StyleSheet.create({
  object: {
    position: "absolute",
  },
});
