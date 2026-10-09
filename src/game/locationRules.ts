import type {
  GameLocation,
  LifeStage,
} from "./gameTypes";

const STAGE_LOCATIONS: Record<
  LifeStage,
  readonly GameLocation[]
> = {
  BABY: ["HOME"],

  TODDLER: ["HOME", "VILLAGE"],

  CHILD: ["HOME", "VILLAGE", "SURROUNDINGS"],

  TEEN: ["HOME", "VILLAGE", "SURROUNDINGS"],

  YOUNG_ADULT: ["HOME", "VILLAGE", "SURROUNDINGS"],

  ADULT: ["HOME", "VILLAGE", "SURROUNDINGS"],
};

export function getAvailableLocations(
  stage: LifeStage
): readonly GameLocation[] {
  return STAGE_LOCATIONS[stage];
}

export function canAccessLocation(
  stage: LifeStage,
  location: GameLocation
): boolean {
  return getAvailableLocations(stage).includes(location);
}

export function getValidLocation(
  stage: LifeStage,
  location: GameLocation
): GameLocation {
  return canAccessLocation(stage, location)
    ? location
    : "HOME";
}