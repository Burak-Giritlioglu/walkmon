import React from "react";

import {
  Image,
  ImageSourcePropType,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

type Props = {
  visible: boolean;
  title: string;
  objectId?: string;
  onPlace: () => void;
};

const REWARD_IMAGES: Record<
  string,
  ImageSourcePropType
> = {
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

const REWARD_DESCRIPTIONS: Record<
  string,
  string
> = {
  toy:
    "A new companion has joined your little world.",

  "high-chair":
    "A cozy new place for mealtime has been discovered.",

  "play-rug":
    "A soft new place to sit, play and dream.",

  bookshelf:
    "A little library filled with stories waiting to be discovered.",

  "activity-table":
    "A little table filled with shapes, puzzles and new things to discover.",
};

export default function UnlockReveal({
  visible,
  title,
  objectId,
  onPlace,
}: Props) {
  const rewardImage =
    objectId
      ? REWARD_IMAGES[objectId]
      : undefined;

  const description =
    objectId
      ? REWARD_DESCRIPTIONS[
          objectId
        ]
      : undefined;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.eyebrow}>
            NEW DISCOVERY
          </Text>

          <Text style={styles.title}>
            {title}
          </Text>

          {rewardImage && (
            <View
              style={
                styles.imageContainer
              }
            >
              <Image
                source={rewardImage}
                style={styles.image}
                resizeMode="contain"
              />
            </View>
          )}

          {description && (
            <Text
              style={
                styles.description
              }
            >
              {description}
            </Text>
          )}

          <Pressable
            style={styles.button}
            onPress={onPlace}
          >
            <Text
              style={
                styles.buttonText
              }
            >
              Place in Room
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles =
  StyleSheet.create({
    overlay: {
      flex: 1,

      alignItems: "center",
      justifyContent: "center",

      paddingHorizontal: 28,

      backgroundColor:
        "rgba(8, 12, 20, 0.78)",
    },

    card: {
      width: "100%",

      paddingHorizontal: 24,
      paddingTop: 28,
      paddingBottom: 24,

      alignItems: "center",

      borderRadius: 28,

      backgroundColor:
        "rgba(35, 43, 39, 0.97)",
    },

    eyebrow: {
      marginBottom: 8,

      fontSize: 12,
      fontWeight: "700",
      letterSpacing: 2,

      color:
        "rgba(236, 225, 190, 0.65)",
    },

    title: {
      textAlign: "center",

      fontSize: 26,
      fontWeight: "700",

      color: "#F2E8C9",
    },

    imageContainer: {
      width: "100%",
      height: 230,

      marginTop: 18,

      alignItems: "center",
      justifyContent: "center",
    },

    image: {
      width: "100%",
      height: "100%",
    },

    description: {
      marginTop: 12,

      paddingHorizontal: 12,

      textAlign: "center",

      fontSize: 15,
      lineHeight: 22,

      color:
        "rgba(242, 232, 201, 0.78)",
    },

    button: {
      width: "100%",

      marginTop: 24,
      paddingVertical: 15,

      alignItems: "center",

      borderRadius: 18,

      backgroundColor: "#708A61",
    },

    buttonText: {
      fontSize: 16,
      fontWeight: "700",

      color: "#FFFFFF",
    },
  });