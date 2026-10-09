
import React from "react";
import { StyleSheet, View } from "react-native";

import { babyRoomObjects } from "./babyWorldObjects";
import { BABY_OBJECT_IMAGES } from "./babyAssets";
import BabySpecialObjectRenderer from "./BabySpecialObjectRenderer";
import WorldObjectRenderer from "../../world/WorldObjectRenderer";

type Props = {
  unlockedObjectIds: string[];
  roomUpgradeIds?: string[];
  isBabySleeping?: boolean;
  isBabyPlayingWithTeddy?: boolean;
  isBabyEating?: boolean;
  isBabyReading?: boolean;
  isBabyUsingActivityTable?: boolean;
};

const SPECIAL_OBJECT_IDS = new Set([
  "crib",
  "high-chair",
  "bookshelf",
  "activity-table",
]);

export default function BabyRoomScene({
  unlockedObjectIds,
  isBabySleeping = false,
  isBabyPlayingWithTeddy = false,
  isBabyEating = false,
  isBabyReading = false,
  isBabyUsingActivityTable = false,
}: Props) {
  const visibleObjects = babyRoomObjects.filter((object) => {
    const isUnlocked = unlockedObjectIds.includes(object.id);
    const hasImage = BABY_OBJECT_IMAGES[object.id] !== undefined;

    const hideTeddy =
      object.id === "toy" && isBabyPlayingWithTeddy;

    return isUnlocked && hasImage && !hideTeddy;
  });

  return (
    <View pointerEvents="none" style={styles.container}>
      {visibleObjects.map((object) => {
        if (SPECIAL_OBJECT_IDS.has(object.id)) {
          return (
            <BabySpecialObjectRenderer
              key={object.id}
              object={object}
              isBabySleeping={isBabySleeping}
              isBabyEating={isBabyEating}
              isBabyReading={isBabyReading}
              isBabyUsingActivityTable={isBabyUsingActivityTable}
            />
          );
        }

        return (
          <WorldObjectRenderer
            key={object.id}
            object={object}
            image={BABY_OBJECT_IMAGES[object.id]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "transparent",
  },
});
