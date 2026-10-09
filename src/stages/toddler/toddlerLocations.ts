import type { GameLocation } from "../../game/gameTypes";

export const TODDLER_LOCATIONS = [
  "HOME",
  "VILLAGE",
] as const satisfies readonly GameLocation[];

export type ToddlerLocation =
  (typeof TODDLER_LOCATIONS)[number];

export function isToddlerLocation(
  location: GameLocation
): location is ToddlerLocation {
  return TODDLER_LOCATIONS.some(
    (allowedLocation) => allowedLocation === location
  );
}