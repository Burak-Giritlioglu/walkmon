
import type { ImageSourcePropType } from "react-native";

export const BABY_OBJECT_IMAGES: Record<
  string,
  ImageSourcePropType
> = {
  crib: require("../../../assets/objects/crib.png"),

  fireplace: require("../../../assets/objects/fireplace.png"),

  toy: require("../../../assets/objects/plush-toy.png"),

  "high-chair": require("../../../assets/objects/high-chair.png"),

  "play-rug": require("../../../assets/objects/rug.png"),

  bookshelf: require("../../../assets/objects/bookshelf.png"),

  "activity-table": require("../../../assets/objects/activity-table.png"),
};

export const BABY_STATE_IMAGES = {
  sleeping: require("../../../assets/objects/crib-baby.png"),

  eating: require("../../../assets/characters/baby-eating.png"),

  reading: require("../../../assets/characters/baby-reading.png"),

  activity: require("../../../assets/characters/baby-activity.png"),
} satisfies Record<string, ImageSourcePropType>;
