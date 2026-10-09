import {
  cancelAnimation,
  runOnJS,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import type { WorldObject } from "../world/worldTypes";

export type MovementDirection =
  | "IDLE"
  | "BACK"
  | "FORWARD";

type MovementConfig = {
  homePosition: {
    x: number;
    y: number;
  };
  speed: number;
};

export function useCharacterMovement({
  homePosition,
  speed,
}: MovementConfig) {
  const characterX = useSharedValue(homePosition.x);
  const characterY = useSharedValue(homePosition.y);

  const movementDirection =
    useSharedValue<MovementDirection>("IDLE");

  const moveToObject = (
    object: WorldObject,
    onArrival: (object: WorldObject) => void
  ) => {
    cancelAnimation(characterX);
    cancelAnimation(characterY);

    const targetX = object.interactionPoint.x;
    const targetY = object.interactionPoint.y;

    const dx = targetX - characterX.value;
    const dy = targetY - characterY.value;

    const distance = Math.sqrt(dx * dx + dy * dy);

    const duration = Math.max(
      250,
      (distance / speed) * 1000
    );

    if (dy < 0) {
      movementDirection.value = "BACK";
    } else if (dy > 0) {
      movementDirection.value = "FORWARD";
    } else {
      movementDirection.value = "IDLE";
    }

    characterX.value = withTiming(targetX, {
      duration,
    });

    characterY.value = withTiming(
      targetY,
      {
        duration,
      },
      (finished) => {
        if (finished) {
          movementDirection.value = "IDLE";
          runOnJS(onArrival)(object);
        }
      }
    );
  };

  const moveHome = (onArrival?: () => void) => {
    cancelAnimation(characterX);
    cancelAnimation(characterY);

    const dx = homePosition.x - characterX.value;
    const dy = homePosition.y - characterY.value;

    const distance = Math.sqrt(dx * dx + dy * dy);

    const duration = Math.max(
      250,
      (distance / speed) * 1000
    );

    if (dy < 0) {
      movementDirection.value = "BACK";
    } else if (dy > 0) {
      movementDirection.value = "FORWARD";
    } else {
      movementDirection.value = "IDLE";
    }

    characterX.value = withTiming(homePosition.x, {
      duration,
    });

    characterY.value = withTiming(
      homePosition.y,
      {
        duration,
      },
      (finished) => {
        if (finished) {
          movementDirection.value = "IDLE";

          if (onArrival) {
            runOnJS(onArrival)();
          }
        }
      }
    );
  };

  return {
    characterX,
    characterY,
    movementDirection,
    moveToObject,
    moveHome,
  };
}