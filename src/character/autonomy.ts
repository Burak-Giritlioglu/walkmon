import {
  CharacterNeeds,
  NeedType,
  NEED_TRIGGER_THRESHOLD,
} from "./needs";

import {
  WorldObject,
} from "../world/worldObjects";

export type AutonomousTarget = {
  need: NeedType;
  value: number;
  object: WorldObject;
};

export function findAutonomousTarget(
  needs: CharacterNeeds,
  activeNeeds: NeedType[],
  availableObjects: WorldObject[]
): AutonomousTarget | null {
  const needsList: {
    need: NeedType;
    value: number;
  }[] = [
    {
      need: "SATIETY",
      value: needs.SATIETY,
    },

    {
      need: "HAPPINESS",
      value: needs.HAPPINESS,
    },

    {
      need: "FUN",
      value: needs.FUN,
    },

    {
      need: "ENERGY",
      value: needs.ENERGY,
    },
  ];

  // =========================
  // FIND ACTIVE LOW NEEDS
  // =========================

  const urgentNeeds =
    needsList
      .filter((item) =>
        activeNeeds.includes(
          item.need
        )
      )
      .filter(
        (item) =>
          item.value <
          NEED_TRIGGER_THRESHOLD
      )
      .sort(
        (a, b) =>
          a.value - b.value
      );

  // =========================
  // FIND OBJECT FOR NEED
  // =========================

  for (const item of urgentNeeds) {
    const object =
      availableObjects.find(
        (worldObject) => {
          // Bookshelf, Garden Door gibi
          // need effect'i olmayan objeleri
          // autonomy dikkate almaz.
          if (!worldObject.effect) {
            return false;
          }

          return (
            worldObject.effect.need ===
            item.need
          );
        }
      );

    if (object) {
      return {
        need: item.need,
        value: item.value,
        object,
      };
    }
  }

  return null;
}