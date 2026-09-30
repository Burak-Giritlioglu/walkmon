import {
  useState,
} from "react";

import {
  BABY_MILESTONES,
} from "../progression/milestones";

const STARTING_OBJECT_IDS = [
  "crib",
  "fireplace",
];

type Props = {
  initialRevealedMilestoneIds?: string[];
};

export function useProgression({
  initialRevealedMilestoneIds = [],
}: Props = {}) {
  // Initial save sadece hook ilk oluşturulurken
  // state'e aktarılır.
  //
  // Burada useEffect KULLANMIYORUZ.
  // Çünkü array referansı her render'da
  // değişerek sonsuz update loop'una
  // sebep olabiliyor.

  const [
    revealedMilestoneIds,
    setRevealedMilestoneIds,
  ] = useState<string[]>(
    () => [
      ...initialRevealedMilestoneIds,
    ]
  );

  // =========================
  // REVEAL
  // =========================

  const revealMilestone = (
    milestoneId: string
  ) => {
    setRevealedMilestoneIds(
      (current) => {
        if (
          current.includes(
            milestoneId
          )
        ) {
          return current;
        }

        return [
          ...current,
          milestoneId,
        ];
      }
    );
  };

  // =========================
  // REVEALED CHECK
  // =========================

  const isMilestoneRevealed = (
    milestoneId: string
  ) => {
    return revealedMilestoneIds.includes(
      milestoneId
    );
  };

  // =========================
  // REVEALED MILESTONES
  // =========================

  const revealedMilestones =
    BABY_MILESTONES.filter(
      (milestone) =>
        revealedMilestoneIds.includes(
          milestone.id
        )
    );

  // =========================
  // OBJECT UNLOCKS
  // =========================

  const milestoneObjectIds =
    revealedMilestones.flatMap(
      (milestone) => {
        if (
          milestone.unlock.type !==
          "OBJECT"
        ) {
          return [];
        }

        return [
          milestone.unlock.objectId,
        ];
      }
    );

  const unlockedObjectIds = [
    ...STARTING_OBJECT_IDS,
    ...milestoneObjectIds,
  ];

  // =========================
  // ROOM UPGRADES
  // =========================

  const roomUpgradeIds =
    revealedMilestones.flatMap(
      (milestone) => {
        if (
          milestone.unlock.type !==
          "ROOM_UPGRADE"
        ) {
          return [];
        }

        return [
          milestone.unlock.upgradeId,
        ];
      }
    );

  // =========================
  // STAGES
  // =========================

  const unlockedStages =
    revealedMilestones.flatMap(
      (milestone) => {
        if (
          milestone.unlock.type !==
          "STAGE"
        ) {
          return [];
        }

        return [
          milestone.unlock.stage,
        ];
      }
    );

  // =========================
  // OBJECT CHECK
  // =========================

  const isObjectUnlocked = (
    objectId: string
  ) => {
    return unlockedObjectIds.includes(
      objectId
    );
  };

  return {
    revealedMilestoneIds,

    unlockedObjectIds,

    roomUpgradeIds,

    unlockedStages,

    revealMilestone,

    isMilestoneRevealed,

    isObjectUnlocked,
  };
}