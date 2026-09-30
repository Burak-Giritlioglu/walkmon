import AsyncStorage from "@react-native-async-storage/async-storage";

import type {
  CharacterNeeds,
} from "../character/needs";

import type {
  CharacterStats,
} from "../character/stats";

export type GameStage =
  | "BABY"
  | "CHILD";

export type GameSaveData = {
  version: 1;

  lifetimeSteps: number;

  revealedMilestoneIds: string[];

  needs?: CharacterNeeds;

  stats?: CharacterStats;

  stage: GameStage;

  // =========================
  // WALKMON JOURNEY
  // =========================

  // The exact moment this Walkmon
  // journey started.
  journeyStartDate?: string;

  // HealthKit's step count at the
  // moment the journey started.
  //
  // Steps before this baseline
  // must never count toward
  // Steps Together.
  journeyStartHealthSteps?: number;
};

const GAME_SAVE_KEY =
  "@walkmon/game-save";

export async function saveGame(
  data: GameSaveData
): Promise<void> {
  try {
    const serialized =
      JSON.stringify(data);

    await AsyncStorage.setItem(
      GAME_SAVE_KEY,
      serialized
    );

    console.log(
      "Walkmon game saved:",
      data
    );
  } catch (error) {
    console.error(
      "Failed to save Walkmon game:",
      error
    );
  }
}

export async function loadGame(): Promise<GameSaveData | null> {
  try {
    const serialized =
      await AsyncStorage.getItem(
        GAME_SAVE_KEY
      );

    if (!serialized) {
      console.log(
        "No Walkmon save found."
      );

      return null;
    }

    const parsed =
      JSON.parse(
        serialized
      ) as GameSaveData;

    console.log(
      "Walkmon game loaded:",
      parsed
    );

    return parsed;
  } catch (error) {
    console.error(
      "Failed to load Walkmon game:",
      error
    );

    return null;
  }
}

export async function clearGameSave(): Promise<void> {
  try {
    await AsyncStorage.removeItem(
      GAME_SAVE_KEY
    );

    console.log(
      "Walkmon save cleared."
    );
  } catch (error) {
    console.error(
      "Failed to clear Walkmon save:",
      error
    );
  }
}