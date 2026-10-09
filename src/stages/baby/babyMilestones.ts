import type { Milestone } from "../../progression/milestones";

export const BABY_MILESTONES: Milestone[] = [
  {
    id: "plush-toy",
    title: "🧸 Plush Toy",
    requiredSteps: 6000,
    unlock: {
      type: "OBJECT",
      objectId: "toy",
    },
  },
  {
    id: "high-chair",
    title: "🪑 High Chair",
    requiredSteps: 16000,
    unlock: {
      type: "OBJECT",
      objectId: "high-chair",
    },
  },
  {
    id: "play-rug",
    title: "🧶 Play Rug",
    requiredSteps: 28000,
    unlock: {
      type: "OBJECT",
      objectId: "play-rug",
    },
  },
  {
    id: "bookshelf",
    title: "📚 Bookshelf",
    requiredSteps: 43000,
    unlock: {
      type: "OBJECT",
      objectId: "bookshelf",
    },
  },
  {
    id: "activity-table",
    title: "🧩 Activity Table",
    requiredSteps: 61000,
    unlock: {
      type: "OBJECT",
      objectId: "activity-table",
    },
  },
  {
    id: "room-upgrade",
    title: "🪟 Cozy Room",
    requiredSteps: 81000,
    unlock: {
      type: "ROOM_UPGRADE",
      upgradeId: "cozy-room",
    },
  },
  {
    id: "garden-door",
    title: "🚪 Garden Door",
    requiredSteps: 100000,
    unlock: {
      type: "OBJECT",
      objectId: "garden-door",
    },
  },
  {
    id: "toddler-stage",
    title: "🌱 Growing Up",
    requiredSteps: 120000,
    unlock: {
      type: "STAGE",
      stage: "TODDLER",
    },
  },
];