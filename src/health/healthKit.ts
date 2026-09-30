import {
  isHealthDataAvailable,
  queryStatisticsForQuantity,
  requestAuthorization,
} from "@kingstinct/react-native-healthkit";

const STEP_COUNT_TYPE =
  "HKQuantityTypeIdentifierStepCount" as const;

// =========================
// AVAILABILITY
// =========================

export async function isHealthKitAvailable() {
  try {
    const available =
      await isHealthDataAvailable();

    return available;
  } catch (error) {
    console.error(
      "[HealthKit] Availability check failed:",
      error
    );

    return false;
  }
}

// =========================
// STEP PERMISSION
// =========================

export async function requestStepPermission() {
  const available =
    await isHealthKitAvailable();

  if (!available) {
    console.log(
      "[HealthKit] Health data is not available on this device."
    );

    return false;
  }

  try {
    await requestAuthorization({
      toRead: [
        STEP_COUNT_TYPE,
      ],
    });

    console.log(
      "[HealthKit] Step authorization request completed."
    );

    return true;
  } catch (error) {
    console.error(
      "[HealthKit] Step authorization failed:",
      error
    );

    return false;
  }
}

// =========================
// STEPS BETWEEN DATES
// =========================

async function getStepsBetween(
  startDate: Date,
  endDate: Date
) {
  try {
    const statistics =
      await queryStatisticsForQuantity(
        STEP_COUNT_TYPE,
        [
          "cumulativeSum",
        ],
        {
          filter: {
            date: {
              startDate,
              endDate,
            },
          },
        }
      );

    const steps =
      Math.round(
        statistics
          .sumQuantity
          ?.quantity ?? 0
      );

    return steps;
  } catch (error) {
    console.error(
      "[HealthKit] Failed to read steps:",
      error
    );

    return null;
  }
}

// =========================
// TODAY STEPS
// =========================

export async function getTodaySteps() {
  const now =
    new Date();

  const startOfToday =
    new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      0,
      0,
      0,
      0
    );

  const steps =
    await getStepsBetween(
      startOfToday,
      now
    );

  console.log(
    "[HealthKit] Today's steps:",
    steps
  );

  return steps;
}

// =========================
// STEPS SINCE JOURNEY START
// =========================

export async function getStepsSince(
  startDate: Date
) {
  const now =
    new Date();

  if (
    Number.isNaN(
      startDate.getTime()
    )
  ) {
    console.error(
      "[HealthKit] Invalid journey start date."
    );

    return null;
  }

  if (
    startDate.getTime() >
    now.getTime()
  ) {
    console.error(
      "[HealthKit] Journey start date is in the future."
    );

    return null;
  }

  const steps =
    await getStepsBetween(
      startDate,
      now
    );

  console.log(
    "[HealthKit] Steps since journey start:",
    steps
  );

  return steps;
}