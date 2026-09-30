import {
  runOnJS,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import {
  WorldObject,
} from "../world/worldObjects";

export const HOME_POSITION = {
  x: 190,
  y: 365,
};

const WALK_SPEED = 150;

export function useCharacterMovement() {
  const babyX = useSharedValue(
    HOME_POSITION.x
  );

  const babyY = useSharedValue(
    HOME_POSITION.y
  );

  const moveToObject = (
    object: WorldObject,
    onArrival: (
      object: WorldObject
    ) => void
  ) => {
    const targetX =
      object.interactionPoint.x;

    const targetY =
      object.interactionPoint.y;

    const currentX =
      babyX.value;

    const currentY =
      babyY.value;

    const dx =
      targetX - currentX;

    const dy =
      targetY - currentY;

    const distance = Math.sqrt(
      dx * dx + dy * dy
    );

    const duration = Math.max(
      250,
      (distance / WALK_SPEED) *
        1000
    );

    babyX.value = withTiming(
      targetX,
      {
        duration,
      }
    );

    babyY.value = withTiming(
      targetY,
      {
        duration,
      },
      (finished) => {
        if (finished) {
          runOnJS(onArrival)(
            object
          );
        }
      }
    );
  };

  const moveHome = (
    onArrival?: () => void
  ) => {
    const currentX =
      babyX.value;

    const currentY =
      babyY.value;

    const dx =
      HOME_POSITION.x -
      currentX;

    const dy =
      HOME_POSITION.y -
      currentY;

    const distance = Math.sqrt(
      dx * dx + dy * dy
    );

    const duration = Math.max(
      250,
      (distance / WALK_SPEED) *
        1000
    );

    babyX.value = withTiming(
      HOME_POSITION.x,
      {
        duration,
      }
    );

    babyY.value = withTiming(
      HOME_POSITION.y,
      {
        duration,
      },
      (finished) => {
        if (
          finished &&
          onArrival
        ) {
          runOnJS(onArrival)();
        }
      }
    );
  };

  return {
    babyX,
    babyY,

    moveToObject,
    moveHome,
  };
}