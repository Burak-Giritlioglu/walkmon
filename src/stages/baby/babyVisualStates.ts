import type { WorldObject } from "../../world/worldTypes";

export function getBabyVisualStates(
  activeObject: WorldObject | null
) {
  return {
    isBabySleeping:
      activeObject?.id === "crib",

    isBabyPlayingWithTeddy:
      activeObject?.id === "toy",

    isBabyEating:
      activeObject?.id === "high-chair",

    isBabyReading:
      activeObject?.id === "bookshelf",

    isBabyUsingActivityTable:
      activeObject?.id === "activity-table",
  };
}