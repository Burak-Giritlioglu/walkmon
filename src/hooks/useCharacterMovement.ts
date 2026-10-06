import {
  cancelAnimation,
  runOnJS,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import type { WorldObject } from "../world/worldObjects";

export const HOME_POSITION = {
  x: 190,
  y: 750,
};

const WALK_SPEED = 70;

export type MovementDirection =
  | "IDLE"
  | "BACK"
  | "FORWARD";

export function useCharacterMovement() {
  const babyX = useSharedValue(HOME_POSITION.x);
  const babyY = useSharedValue(HOME_POSITION.y);

  const movementDirection =
    useSharedValue<MovementDirection>("IDLE");

  const moveToObject = (
    object: WorldObject,
    onArrival: (object: WorldObject) => void
  ) => {
    cancelAnimation(babyX);
    cancelAnimation(babyY);

    const targetX = object.interactionPoint.x;
    const targetY = object.interactionPoint.y;

    const dx = targetX - babyX.value;
    const dy = targetY - babyY.value;

    const distance = Math.sqrt(dx * dx + dy * dy);

    const duration = Math.max(
      250,
      (distance / WALK_SPEED) * 1000
    );

    if (dy < 0) {
      movementDirection.value = "BACK";
    } else if (dy > 0) {
      movementDirection.value = "FORWARD";
    } else {
      movementDirection.value = "IDLE";
    }

    babyX.value = withTiming(targetX, {
      duration,
    });

    babyY.value = withTiming(
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
    cancelAnimation(babyX);
    cancelAnimation(babyY);

    const dx = HOME_POSITION.x - babyX.value;
    const dy = HOME_POSITION.y - babyY.value;

    const distance = Math.sqrt(dx * dx + dy * dy);

    const duration = Math.max(
      250,
      (distance / WALK_SPEED) * 1000
    );

    if (dy < 0) {
      movementDirection.value = "BACK";
    } else if (dy > 0) {
      movementDirection.value = "FORWARD";
    } else {
      movementDirection.value = "IDLE";
    }

    babyX.value = withTiming(HOME_POSITION.x, {
      duration,
    });

    babyY.value = withTiming(
      HOME_POSITION.y,
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
    babyX,
    babyY,
    movementDirection,
    moveToObject,
    moveHome,
  };
}