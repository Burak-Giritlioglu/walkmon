import React from "react";
import { StyleSheet, View } from "react-native";

import type { ToddlerLocation } from "./toddlerLocations";
import ToddlerHome from "./ToddlerHome";
import VillageScene from "../../locations/village/VillageScene";

type Props = {
  location: ToddlerLocation;
};

export default function ToddlerWorld({
  location,
}: Props) {
  const renderLocation = () => {
    switch (location) {
      case "HOME":
        return <ToddlerHome />;

      case "VILLAGE":
        return <VillageScene />;
    }
  };

  return (
    <View style={styles.container}>
      {renderLocation()}
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
});