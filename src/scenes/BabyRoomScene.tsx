
import React from "react";
import { StyleSheet, View } from "react-native";

type Props = {
  unlockedObjectIds: string[];
  roomUpgradeIds?: string[];
};

export default function BabyRoomScene({
  unlockedObjectIds,
  roomUpgradeIds = [],
}: Props) {
  return <View style={styles.container} />;
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "transparent",
    pointerEvents: "none",
  },
});
