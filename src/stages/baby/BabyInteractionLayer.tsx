
import React from "react";

import {
  Pressable,
  StyleSheet,
  View,
} from "react-native";

import type {
  WorldObject,
} from "../../world/worldTypes";

type Props = {
  objects: WorldObject[];
  onObjectPress: (object: WorldObject) => void;
  onFloorPress: () => void;
};

export default function BabyInteractionLayer({
  objects,
  onObjectPress,
  onFloorPress,
}: Props) {
  return (
    <View
      pointerEvents="box-none"
      style={styles.container}
    >
      <Pressable
        style={styles.floorTouchArea}
        onPress={onFloorPress}
      />

      {objects.map((object) => {
        const isActivityTable =
          object.id === "activity-table";

        return (
          <Pressable
            key={object.id}
            style={[
              styles.objectTouchArea,
              {
                left: isActivityTable
                  ? object.x + 50
                  : object.x,
                top: isActivityTable
                  ? object.y + 15
                  : object.y,
                width: isActivityTable
                  ? object.width - 30
                  : object.width,
                height: isActivityTable
                  ? object.height - 30
                  : object.height,
              },
            ]}
            onPress={() => onObjectPress(object)}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
  },

  floorTouchArea: {
    ...StyleSheet.absoluteFill,
    zIndex: 1,
  },

  objectTouchArea: {
    position: "absolute",
    zIndex: 40,
  },
});