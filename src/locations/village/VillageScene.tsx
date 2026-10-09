import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function VillageScene() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Chapter 2 — Village
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },

  title: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "600",
  },
});