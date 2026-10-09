
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
  // =========================
  // STATE
  // =========================

  const [
    initialSave,
    setInitialSave,
  ] = useState<GameSaveData | null>(null);

  const [
    isLoading,
    setIsLoading,
  ] = useState(true);

  const [
    isResetting,
    setIsResetting,
  ] = useState(false);

  const [
    gameKey,
    setGameKey,
  ] = useState(0);

  // =========================
  // INITIAL LOAD
  // =========================

  useEffect(() => {
    let mounted = true;

    async function initializeGame() {
      const save = await loadGame();

      if (!mounted) {
        return;
      }

      setInitialSave(save);
      setIsLoading(false);
    }

    initializeGame();

    return () => {
      mounted = false;
    };
  }, []);

  // =========================
  // RESET
  // =========================

  useEffect(() => {
    if (!isResetting) {
      return;
    }

    let cancelled = false;

    async function resetGame() {
      // GameScreen has been unmounted.
      // Pending saves complete before clearing.
      await clearGameSave();

      if (cancelled) {
        return;
      }

      setInitialSave(null);
      setGameKey((current) => current + 1);
      setIsResetting(false);
    }

    resetGame();

    return () => {
      cancelled = true;
    };
  }, [isResetting]);

  const handleResetGame = () => {
    setIsResetting(true);
  };

  // =========================
  // LOADING / RESET SCREEN
  // =========================

  if (isLoading || isResetting) {
    return (
      <GestureHandlerRootView
        style={styles.root}
      >
        <View style={styles.loadingContainer}>
          <ActivityIndicator />

          <Text style={styles.loadingText}>
            {isResetting
              ? "Resetting Walkmon..."
              : "Loading Walkmon..."}
          </Text>
        </View>
      </GestureHandlerRootView>
    );
  }

  // =========================
  // GAME
  // =========================

  return (
    <GestureHandlerRootView
      style={styles.root}
    >
      <GameScreen
        key={gameKey}
        initialSave={initialSave}
        onResetGame={handleResetGame}
      />
    </GestureHandlerRootView>
  );
}

// =========================
// STYLES
// =========================

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },

  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F4EFE7",
  },

  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#7B7067",
  },
});
