import React from "react";

import {
  Image,
  StyleSheet,
  View,
} from "react-native";

import {
  babyRoomObjects,
} from "../world/worldObjects";

type Props = {
  unlockedObjectIds: string[];

  roomUpgradeIds?: string[];

  isBabySleeping?: boolean;

  isBabyPlayingWithTeddy?: boolean;

  isBabyEating?: boolean;

  isBabyReading?: boolean;

  isBabyUsingActivityTable?: boolean;
};

const OBJECT_IMAGES: Record<
  string,
  number
> = {
  crib: require(
    "../../assets/objects/crib.png"
  ),

  fireplace: require(
    "../../assets/objects/fireplace.png"
  ),

  toy: require(
    "../../assets/objects/plush-toy.png"
  ),

  "high-chair": require(
    "../../assets/objects/high-chair.png"
  ),

  "play-rug": require(
    "../../assets/objects/rug.png"
  ),

  bookshelf: require(
    "../../assets/objects/bookshelf.png"
  ),

  "activity-table": require(
    "../../assets/objects/activity-table.png"
  ),
};

const CRIB_BABY_IMAGE =
  require(
    "../../assets/objects/crib-baby.png"
  );

const BABY_EATING_IMAGE =
  require(
    "../../assets/characters/baby-eating.png"
  );

const BABY_READING_IMAGE =
  require(
    "../../assets/characters/baby-reading.png"
  );

const BABY_ACTIVITY_IMAGE =
  require(
    "../../assets/characters/baby-activity.png"
  );

export default function BabyRoomScene({
  unlockedObjectIds,

  isBabySleeping = false,

  isBabyPlayingWithTeddy = false,

  isBabyEating = false,

  isBabyReading = false,

  isBabyUsingActivityTable = false,
}: Props) {
  const visibleObjects =
    babyRoomObjects.filter(
      (object) => {
        const isUnlocked =
          unlockedObjectIds.includes(
            object.id
          );

        const hasImage =
          OBJECT_IMAGES[
            object.id
          ] !== undefined;

        const hideTeddy =
          object.id === "toy" &&
          isBabyPlayingWithTeddy;

        return (
          isUnlocked &&
          hasImage &&
          !hideTeddy
        );
      }
    );

  return (
    <View
      pointerEvents="none"
      style={styles.container}
    >
      {visibleObjects.map(
        (object) => {
          // =====================
          // CRIB
          // =====================

          if (
            object.id === "crib"
          ) {
            const cribImage =
              isBabySleeping
                ? CRIB_BABY_IMAGE
                : OBJECT_IMAGES.crib;

            return (
              <View
                key={object.id}
                style={{
                  position:
                    "absolute",

                  left: object.x,
                  top: object.y,

                  width:
                    object.width,

                  height:
                    object.height,
                }}
              >
                <Image
                  source={
                    cribImage
                  }
                  style={{
                    position:
                      "absolute",

                    left: -1,
                    top: -1,

                    width:
                      object.width +
                      1,

                    height:
                      object.height +
                      1,

                    opacity: 0.1,
                  }}
                  resizeMode="contain"
                  blurRadius={4}
                />

                <Image
                  source={
                    cribImage
                  }
                  style={{
                    position:
                      "absolute",

                    left: 0,
                    top: 0,

                    width:
                      object.width,

                    height:
                      object.height,
                  }}
                  resizeMode="contain"
                />
              </View>
            );
          }

          // =====================
          // HIGH CHAIR
          // =====================

          if (
            object.id ===
            "high-chair"
          ) {
            const highChairImage =
              isBabyEating
                ? BABY_EATING_IMAGE
                : OBJECT_IMAGES[
                    "high-chair"
                  ];

            return (
              <Image
                key={object.id}
                source={
                  highChairImage
                }
                style={{
                  position:
                    "absolute",

                  left: object.x,
                  top: object.y,

                  width:
                    object.width,

                  height:
                    object.height,
                }}
                resizeMode="contain"
              />
            );
          }

          // =====================
          // BOOKSHELF
          // =====================

          if (
            object.id ===
            "bookshelf"
          ) {
            return (
              <View
                key={object.id}
                style={{
                  position:
                    "absolute",

                  left: object.x,
                  top: object.y,

                  width:
                    object.width,

                  height:
                    object.height,
                }}
              >
                {/* Bookshelf stays visible */}
                <Image
                  source={
                    OBJECT_IMAGES.bookshelf
                  }
                  style={{
                    position:
                      "absolute",

                    left: 0,
                    top: 0,

                    width:
                      object.width,

                    height:
                      object.height,
                  }}
                  resizeMode="contain"
                />

                {/* Reading baby */}
                {isBabyReading && (
                  <Image
                    source={
                      BABY_READING_IMAGE
                    }
                    style={{
                      position:
                        "absolute",

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

         // =====================
// ACTIVITY TABLE
// =====================

if (
  object.id ===
  "activity-table"
) {
  if (isBabyUsingActivityTable) {
    return (
      <Image
        key={object.id}
        source={BABY_ACTIVITY_IMAGE}
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
    <Image
      key={object.id}
      source={
        OBJECT_IMAGES[
          "activity-table"
        ]
      }
      style={{
        position: "absolute",

        left: object.x,
        top: object.y,

        width: object.width,
        height: object.height,
      }}
      resizeMode="contain"
    />
  );
}

          // =====================
          // ALL OTHER OBJECTS
          // =====================

          return (
            <Image
              key={object.id}
              source={
                OBJECT_IMAGES[
                  object.id
                ]
              }
              style={{
                position:
                  "absolute",

                left: object.x,
                top: object.y,

                width:
                  object.width,

                height:
                  object.height,
              }}
              resizeMode="contain"
            />
          );
        }
      )}
    </View>
  );
}

const styles =
  StyleSheet.create({
    container: {
      position: "absolute",

      top: 0,
      left: 0,
      right: 0,
      bottom: 0,

      backgroundColor:
        "transparent",
    },
  });