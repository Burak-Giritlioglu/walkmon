
import React from "react";

import BabyCharacter from "./BabyCharacter";
import TeddyPlayAnimation from "./TeddyPlayAnimation";

type Props = {
  babyX: React.ComponentProps<
    typeof BabyCharacter
  >["babyX"];

  babyY: React.ComponentProps<
    typeof BabyCharacter
  >["babyY"];

  movementDirection: React.ComponentProps<
    typeof BabyCharacter
  >["movementDirection"];

  isBabySleeping: boolean;
  isBabyPlayingWithTeddy: boolean;
  isBabyEating: boolean;
  isBabyReading: boolean;
  isBabyUsingActivityTable: boolean;

  onPress: () => void;
};

export default function BabyCharacterLayer({
  babyX,
  babyY,
  movementDirection,
  isBabySleeping,
  isBabyPlayingWithTeddy,
  isBabyEating,
  isBabyReading,
  isBabyUsingActivityTable,
  onPress,
}: Props) {
  const showBabyCharacter =
    !isBabySleeping &&
    !isBabyEating &&
    !isBabyReading &&
    !isBabyUsingActivityTable;

  if (isBabyPlayingWithTeddy) {
    return (
      <TeddyPlayAnimation
        babyX={babyX}
        babyY={babyY}
      />
    );
  }

  if (!showBabyCharacter) {
    return null;
  }

  return (
    <BabyCharacter
      babyX={babyX}
      babyY={babyY}
      movementDirection={movementDirection}
      onPress={onPress}
    />
  );
}
