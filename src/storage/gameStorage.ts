
import AsyncStorage from "@react-native-async-storage/async-storage";

import type { CharacterNeeds } from "../character/needs";
import type { CharacterStats } from "../character/stats";

import type {
  GameLocation,
  LifeStage,
} from "../game/gameTypes";

// =========================
// GAME SAVE DATA
// =========================

export type GameSaveData = {
  version: 1;

  lifetimeSteps: number;
  revealedMilestoneIds: string[];

  needs?: CharacterNeeds;
  stats?: CharacterStats;

  stage: LifeStage;
  location?: GameLocation;

  journeyStartDate?: string;
  journeyStartHealthSteps?: number;
};

// =========================
// STORAGE
// =========================

const GAME_SAVE_KEY = "@walkmon/game-save";

// Ensures storage writes and deletes run in order.
let pendingOperation: Promise<void> =
  Promise.resolve();

function enqueueOperation(
  operation: () => Promise<void>
): Promise<void> {
  const nextOperation = pendingOperation
    .catch(() => undefined)
    .then(operation);

  pendingOperation = nextOperation;

  return nextOperation;
}

// =========================
// SAVE GAME
// =========================

export function saveGame(
  data: GameSaveData
): Promise<void> {
  return enqueueOperation(async () => {
    try {
      const serialized = JSON.stringify(data);

      await AsyncStorage.setItem(
        GAME_SAVE_KEY,
        serialized
      );

      console.log("Walkmon game saved:", data);
    } catch (error) {
      console.error(
        "Failed to save Walkmon game:",
        error
      );
    }
  });
}

// =========================
// LOAD GAME
// =========================

export async function loadGame(): Promise<GameSaveData | null> {
  try {
    // Wait for any pending writes or deletes.
    await pendingOperation.catch(() => undefined);

    const serialized = await AsyncStorage.getItem(
      GAME_SAVE_KEY
    );

    if (!serialized) {
      console.log("No Walkmon save found.");
      return null;
    }

    const parsed = JSON.parse(
      serialized
    ) as GameSaveData;

    console.log("Walkmon game loaded:", parsed);

    return parsed;
  } catch (error) {
    console.error(
      "Failed to load Walkmon game:",
      error
    );

    return null;
  }
}

// =========================
// CLEAR SAVE
// =========================

export function clearGameSave(): Promise<void> {
  return enqueueOperation(async () => {
    try {
      await AsyncStorage.removeItem(
        GAME_SAVE_KEY
      );

      console.log("Walkmon save cleared.");
    } catch (error) {
      console.error(
        "Failed to clear Walkmon save:",
        error
      );
    }
  });
}
