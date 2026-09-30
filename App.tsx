import React, {
  useEffect,
  useState,
} from "react";

import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  GestureHandlerRootView,
} from "react-native-gesture-handler";

import GameScreen from "./src/screens/GameScreen";

import {
  clearGameSave,
  loadGame,
} from "./src/storage/gameStorage";

import type {
  GameSaveData,
} from "./src/storage/gameStorage";

export default function App() {
  const [
    initialSave,
    setInitialSave,
  ] =
    useState<GameSaveData | null>(
      null
    );

  const [
    isLoading,
    setIsLoading,
  ] =
    useState(true);

  const [
    gameKey,
    setGameKey,
  ] =
    useState(0);

  useEffect(() => {
    async function initializeGame() {
      const save =
        await loadGame();

      setInitialSave(save);

      setIsLoading(false);
    }

    initializeGame();
  }, []);

  const handleResetGame =
    async () => {
      await clearGameSave();

      setInitialSave(null);

      setGameKey(
        (current) =>
          current + 1
      );
    };

  if (isLoading) {
    return (
      <GestureHandlerRootView
        style={styles.root}
      >
        <View
          style={
            styles.loadingContainer
          }
        >
          <ActivityIndicator />

          <Text
            style={
              styles.loadingText
            }
          >
            Loading Walkmon...
          </Text>
        </View>
      </GestureHandlerRootView>
    );
  }

  return (
    <GestureHandlerRootView
      style={styles.root}
    >
      <GameScreen
        key={gameKey}
        initialSave={
          initialSave
        }
        onResetGame={
          handleResetGame
        }
      />
    </GestureHandlerRootView>
  );
}

const styles =
  StyleSheet.create({
    root: {
      flex: 1,
    },

    loadingContainer: {
      flex: 1,

      alignItems: "center",

      justifyContent:
        "center",

      backgroundColor:
        "#F4EFE7",
    },

    loadingText: {
      marginTop: 12,

      fontSize: 14,

      color: "#7B7067",
    },
  });