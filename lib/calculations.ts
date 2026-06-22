export type Sex = "female" | "male";
export type DeviceType =
  | "Apple Watch"
  | "Garmin"
  | "Fitbit"
  | "Samsung Health"
  | "Other";

export type PeriodDays = 7 | 14 | 28 | 60 | 90;
export type StarterActivityLevel =
  | "sedentary"
  | "lightly-active"
  | "moderately-active"
  | "active"
  | "very-active";

export type StarterActivityOption = {
  value: StarterActivityLevel;
  label: string;
  multiplier: number;
  description: string;
};

type BasicProfile = {
  age: number;
  sex: Sex;
  heightCm: number;
  currentWeightKg: number;
  goalWeightKg: number;
};

export type ConfidenceTier = {
  tier: 0 | 1 | 2 | 3 | 4 | 5;
  label: string;
  shortLabel: string;
  score: number;
  periodText: string;
  summary: string;
  suggestions: string[];
};

export type MaintenanceRange = {
  low: number;
  high: number;
  margin: number;
};

export type WearableComparison = {
  wearableTdee: number;
  comparedToTdee: number;
  difference: number;
  percentDifference: number;
  alignment: "higher" | "lower" | "aligned";
  summary: string;
  detail: string;
};

type CalorieTargets = {
  mildFatLossTarget: number;
  moderateFatLossTarget: number;
  mildFatLossDeficit: number;
  moderateFatLossDeficit: number;
  mildFatLossWeeklyKg: number;
  moderateFatLossWeeklyKg: number;
  protectedMinimumCalories: number;
  mildTargetClamped: boolean;
  moderateTargetClamped: boolean;
};

export type CalculatorInput = BasicProfile & {
  periodDays: PeriodDays;
  averageCalories: number;
  startWeightKg: number;
  endWeightKg: number;
  averageSteps: number;
  activeCalories?: number;
  restingCalories?: number;
  exerciseMinutes?: number;
  deviceType?: DeviceType;
};

export type StarterInput = BasicProfile & {
  activityLevel: StarterActivityLevel;
  activeCalories?: number;
  restingCalories?: number;
  deviceType?: DeviceType;
};

export type CalculatorResult = CalorieTargets & {
  bmr: number;
  theoreticalTdee: number;
  observedTdee: number;
  trueTdee: number;
  likelyRange: MaintenanceRange;
  dailyEnergyImbalance: number;
  dailyDeficitOrSurplus: number;
  weeklyWeightChangeKg: number;
  weightChangeKg: number;
  proteinLowG: number;
  proteinHighG: number;
  goalTimelineText: string;
  weightTrendText: string;
  activityLabel: string;
  activityAnalysis: string;
  wearableTdee?: number;
  wearableComparison?: WearableComparison;
  wearableComparisonText: string;
  confidence: ConfidenceTier;
  methodWeights: {
    observed: number;
    theoretical: number;
    wearable: number;
  };
};

export type StarterResult = CalorieTargets & {
  bmr: number;
  theoreticalTdee: number;
  startingTdee: number;
  likelyRange: MaintenanceRange;
  confidence: ConfidenceTier;
  activityLabel: string;
  activityAnalysis: string;
  activityMultiplier: number;
  wearableTdee?: number;
  proteinLowG: number;
  proteinHighG: number;
  nextSteps: string[];
};

const KCAL_PER_KG = 7700;

export const periodOptions: PeriodDays[] = [7, 14, 28, 60, 90];

export const starterActivityOptions: StarterActivityOption[] = [
  {
    value: "sedentary",
    label: "Sedentary",
    multiplier: 1.2,
    description: "Mostly sitting, low daily movement, little structured exercise."
  },
  {
    value: "lightly-active",
    label: "Lightly active",
    multiplier: 1.375,
    description: "Some walking or light exercise one to three days per week."
  },
  {
    value: "moderately-active",
    label: "Moderately active",
    multiplier: 1.55,
    description: "Regular movement or exercise three to five days per week."
  },
  {
    value: "active",
    label: "Active",
    multiplier: 1.725,
    description: "High daily movement or harder exercise most days."
  },
  {
    value: "very-active",
    label: "Very active",
    multiplier: 1.9,
    description: "Physically demanding work, very high steps, or intense training."
  }
];

export function roundToNearest(value: number, increment = 1) {
  return Math.round(value / increment) * increment;
}

export function kgToLb(kg: number) {
  return kg * 2.2046226218;
}

export function lbToKg(lb: number) {
  return lb / 2.2046226218;
}

export function cmToFeetInches(cm: number) {
  const totalInches = cm / 2.54;
  const feet = Math.floor(totalInches / 12);
  const inches = Math.round(totalInches - feet * 12);
  return { feet, inches };
}

export function feetInchesToCm(feet: number, inches: number) {
  return (feet * 12 + inches) * 2.54;
}

export function getLikelyRangeMargin(days: number) {
  if (days >= 90) {
    return 50;
  }

  if (days >= 60) {
    return 75;
  }

  if (days >= 28) {
    return 100;
  }

  if (days >= 14) {
    return 175;
  }

  if (days >= 7) {
    return 250;
  }

  return 300;
}

function getLikelyRange(center: number, days: number): MaintenanceRange {
  const margin = getLikelyRangeMargin(days);

  return {
    low: roundToNearest(center - margin, 5),
    high: roundToNearest(center + margin, 5),
    margin
  };
}

export function getConfidenceTier(days: number): ConfidenceTier {
  if (days <= 0) {
    return {
      tier: 0,
      label: "Starter Estimate",
      shortLabel: "Starter",
      score: 32,
      periodText: "0 days of tracking data",
      summary:
        "This is a starting estimate. The most accurate version of TrueTDEE uses your real calorie intake and weight trend over time.",
      suggestions: [
        "Track daily morning body weight for the next 14 to 28 days.",
        "Track daily calorie intake with the same method each day.",
        "Come back with 14, 28, or 90 days of data for a more accurate result."
      ]
    };
  }

  if (days >= 90) {
    return {
      tier: 5,
      label: "Elite Confidence",
      shortLabel: "Elite",
      score: 96,
      periodText: "90+ days of data",
      summary:
        "Ninety days is the best representation of normal life for most people because short-term scale noise has much less influence.",
      suggestions: [
        "Keep weighing under similar conditions.",
        "Use the same calorie tracking method for the whole period.",
        "Compare wearable estimates after the trend is stable."
      ]
    };
  }

  if (days >= 60) {
    return {
      tier: 4,
      label: "Very High Confidence",
      shortLabel: "Very High",
      score: 90,
      periodText: "60 to 89 days of data",
      summary:
        "Sixty to ninety days is excellent. Your estimate is much less likely to be distorted by one unusual week.",
      suggestions: [
        "Extend the log to 90 days for the highest confidence tier.",
        "Keep step averages and calorie tracking consistent.",
        "Note unusual weeks so you can interpret outliers."
      ]
    };
  }

  if (days >= 28) {
    return {
      tier: 3,
      label: "High Confidence",
      shortLabel: "High",
      score: 80,
      periodText: "28 to 59 days of data",
      summary:
        "Twenty-eight days is the recommended minimum because most short-term fluctuations begin to average out.",
      suggestions: [
        "Continue to 60 days to reduce the influence of unusual weeks.",
        "Use body weight trend averages when possible.",
        "Keep tracking calories even on higher intake days."
      ]
    };
  }

  if (days >= 14) {
    return {
      tier: 2,
      label: "Medium Confidence",
      shortLabel: "Medium",
      score: 64,
      periodText: "14 to 27 days of data",
      summary:
        "Fourteen days is better than one week, but water weight and schedule changes may still distort the result.",
      suggestions: [
        "Build toward 28 days for the recommended minimum.",
        "Avoid drawing conclusions from a single high or low weigh-in.",
        "Use average intake rather than best-day intake."
      ]
    };
  }

  return {
    tier: 1,
    label: "Low Confidence",
    shortLabel: "Low",
    score: 46,
    periodText: "7 to 13 days of data",
    summary:
      "Seven days is useful but noisy. Sodium, illness, alcohol, travel, hard workouts, and glycogen changes can move scale weight quickly.",
    suggestions: [
      "Use this as a rough starting estimate only.",
      "Collect at least 14 days before making bigger changes.",
      "Come back at 28 days for the recommended minimum."
    ]
  };
}

function getStepActivity(averageSteps: number) {
  if (averageSteps >= 12500) {
    return {
      label: "Very active",
      multiplier: 1.9,
      analysis:
        "Your step average suggests a very active lifestyle. Real-world tracking still matters because appetite, wearables, and food logging can all vary."
    };
  }

  if (averageSteps >= 10000) {
    return {
      label: "Active",
      multiplier: 1.725,
      analysis:
        "Your steps are consistent with an active routine. This helps the formula estimate, but observed weight trend is the stronger signal when available."
    };
  }

  if (averageSteps >= 7500) {
    return {
      label: "Moderately active",
      multiplier: 1.55,
      analysis:
        "Your step average is in a moderate range. If your estimate seems off, food logging accuracy and non-step activity may explain the gap."
    };
  }

  if (averageSteps >= 5000) {
    return {
      label: "Lightly active",
      multiplier: 1.375,
      analysis:
        "Your step average suggests light activity. A small change in daily walking can noticeably change maintenance calories over time."
    };
  }

  return {
    label: "Sedentary",
    multiplier: 1.2,
    analysis:
      "Your step average suggests a sedentary baseline. If this is from an unusual week, collect more data before making a large calorie change."
  };
}

function getStarterActivity(activityLevel: StarterActivityLevel) {
  return (
    starterActivityOptions.find((option) => option.value === activityLevel) ??
    starterActivityOptions[0]
  );
}

function calculateBmr(input: BasicProfile) {
  // Mifflin-St Jeor BMR. This estimates resting energy needs before daily movement.
  const sexOffset = input.sex === "male" ? 5 : -161;
  return 10 * input.currentWeightKg + 6.25 * input.heightCm - 5 * input.age + sexOffset;
}

function getWearableTdee(activeCalories?: number, restingCalories?: number) {
  if (!activeCalories || !restingCalories) {
    return undefined;
  }

  return activeCalories + restingCalories;
}

function getWearableComparison(
  wearableTdee: number | undefined,
  observedMaintenance: number,
  deviceType?: DeviceType
): WearableComparison | undefined {
  if (!wearableTdee || observedMaintenance <= 0) {
    return undefined;
  }

  const difference = wearableTdee - observedMaintenance;
  const percentDifference = (difference / observedMaintenance) * 100;
  const absDifference = Math.abs(Math.round(difference));
  const absPercent = Math.abs(percentDifference);
  const deviceName = deviceType ?? "Your wearable";

  if (absPercent <= 5) {
    return {
      wearableTdee: roundToNearest(wearableTdee, 5),
      comparedToTdee: roundToNearest(observedMaintenance, 5),
      difference: roundToNearest(difference),
      percentDifference,
      alignment: "aligned",
      summary: "Your wearable estimate is closely aligned with your observed weight trend.",
      detail: `${deviceName} is within ${absPercent.toFixed(1)}% of your observed maintenance result.`
    };
  }

  const alignment = difference > 0 ? "higher" : "lower";

  return {
    wearableTdee: roundToNearest(wearableTdee, 5),
    comparedToTdee: roundToNearest(observedMaintenance, 5),
    difference: roundToNearest(difference),
    percentDifference,
    alignment,
    summary:
      difference > 0
        ? "Your wearable may be overestimating your burn compared with your real weight trend."
        : "Your wearable may be underestimating your burn compared with your real weight trend.",
    detail: `${deviceName} is estimating about ${absDifference.toLocaleString()} kcal/day ${alignment}, or ${absPercent.toFixed(1)}% ${difference > 0 ? "above" : "below"} your observed result.`
  };
}

function describeWeightTrend(weightChangeKg: number, days: number) {
  const weeklyChange = (weightChangeKg / days) * 7;
  const absWeeklyChange = Math.abs(weeklyChange);

  if (absWeeklyChange < 0.05) {
    return "Your weight was essentially stable across the period, which suggests your average intake was close to maintenance.";
  }

  const direction = weightChangeKg > 0 ? "gaining" : "losing";
  return `You were ${direction} about ${absWeeklyChange.toFixed(2)} kg per week during this period. TrueTDEE uses that observed trend to adjust maintenance calories.`;
}

function getMethodWeights(days: number, hasWearable: boolean) {
  const observed =
    days >= 90 ? 0.9 : days >= 60 ? 0.86 : days >= 28 ? 0.78 : days >= 14 ? 0.68 : 0.56;
  const wearable = hasWearable ? Math.min(0.08, 1 - observed) : 0;
  const theoretical = 1 - observed - wearable;

  return { observed, theoretical, wearable };
}

function calculateGoalTimeline(input: CalculatorInput, dailyDeficitOrSurplus: number) {
  const kgToGoal = input.goalWeightKg - input.currentWeightKg;

  if (Math.abs(kgToGoal) < 0.2) {
    return "You are already very close to the goal weight entered.";
  }

  if (Math.abs(dailyDeficitOrSurplus) < 25) {
    return "Based on the data provided, your current average intake is close to maintenance, so a goal timeline is not meaningful yet.";
  }

  const expectedDailyKgChange = dailyDeficitOrSurplus / KCAL_PER_KG;
  const daysToGoal = kgToGoal / expectedDailyKgChange;

  if (!Number.isFinite(daysToGoal) || daysToGoal <= 0) {
    return "Based on the data provided, your current intake trend is moving away from the goal weight entered. A small, sustainable adjustment may be needed before estimating a timeline.";
  }

  if (daysToGoal > 730) {
    return "At the current trend, the goal timeline is longer than two years. A modest adjustment may be more practical.";
  }

  const weeks = Math.round(daysToGoal / 7);
  const months = Math.max(1, Math.round(daysToGoal / 30.4));
  return `Based on the data provided, the goal weight estimate is about ${weeks} weeks, or roughly ${months} months.`;
}

function calculateTargets(input: BasicProfile, maintenanceCalories: number): CalorieTargets {
  const protectedMinimumCalories = input.sex === "female" ? 1200 : 1500;
  const mildPlannedCut = 300;
  const moderatePlannedCut = 550;
  const rawMildTarget = maintenanceCalories - mildPlannedCut;
  const rawModerateTarget = maintenanceCalories - moderatePlannedCut;
  const mildFatLossTarget = Math.max(protectedMinimumCalories, roundToNearest(rawMildTarget, 25));
  const moderateFatLossTarget = Math.max(protectedMinimumCalories, roundToNearest(rawModerateTarget, 25));
  const mildTargetClamped = rawMildTarget < protectedMinimumCalories;
  const moderateTargetClamped = rawModerateTarget < protectedMinimumCalories;
  const mildFatLossDeficit = mildTargetClamped
    ? Math.max(0, roundToNearest(maintenanceCalories - mildFatLossTarget))
    : mildPlannedCut;
  const moderateFatLossDeficit = moderateTargetClamped
    ? Math.max(0, roundToNearest(maintenanceCalories - moderateFatLossTarget))
    : moderatePlannedCut;

  return {
    mildFatLossTarget,
    moderateFatLossTarget,
    mildFatLossDeficit,
    moderateFatLossDeficit,
    mildFatLossWeeklyKg: (mildFatLossDeficit * 7) / KCAL_PER_KG,
    moderateFatLossWeeklyKg: (moderateFatLossDeficit * 7) / KCAL_PER_KG,
    protectedMinimumCalories,
    mildTargetClamped,
    moderateTargetClamped
  };
}

function calculateProteinTarget(input: BasicProfile) {
  const proteinWeight = input.goalWeightKg < input.currentWeightKg ? input.goalWeightKg : input.currentWeightKg;

  return {
    proteinLowG: Math.round(proteinWeight * 1.6),
    proteinHighG: Math.round(proteinWeight * 2.2)
  };
}

export function calculateStarterTdee(input: StarterInput): StarterResult {
  const confidence = getConfidenceTier(0);
  const activity = getStarterActivity(input.activityLevel);
  const bmr = calculateBmr(input);
  const theoreticalTdee = bmr * activity.multiplier;
  const wearableTdee = getWearableTdee(input.activeCalories, input.restingCalories);
  const startingTdee = roundToNearest(
    wearableTdee ? theoreticalTdee * 0.55 + wearableTdee * 0.45 : theoreticalTdee,
    5
  );
  const targets = calculateTargets(input, startingTdee);
  const protein = calculateProteinTarget(input);

  return {
    bmr: roundToNearest(bmr),
    theoreticalTdee: roundToNearest(theoreticalTdee, 5),
    startingTdee,
    likelyRange: getLikelyRange(startingTdee, 0),
    confidence,
    activityLabel: activity.label,
    activityAnalysis: activity.description,
    activityMultiplier: activity.multiplier,
    wearableTdee: wearableTdee ? roundToNearest(wearableTdee, 5) : undefined,
    ...targets,
    ...protein,
    nextSteps: [
      "Daily morning body weight",
      "Daily calorie intake",
      "Average daily steps",
      "Optional: active calories from your wearable",
      "Optional: resting calories from your wearable"
    ]
  };
}

export function calculateTrueTdee(input: CalculatorInput): CalculatorResult {
  const confidence = getConfidenceTier(input.periodDays);
  const activity = getStepActivity(input.averageSteps);
  const bmr = calculateBmr(input);
  const theoreticalTdee = bmr * activity.multiplier;
  const weightChangeKg = input.endWeightKg - input.startWeightKg;
  // Positive weight change means intake was above maintenance. Negative weight
  // change means intake was below maintenance.
  const dailyEnergyImbalance = (weightChangeKg * KCAL_PER_KG) / input.periodDays;
  const observedTdee = input.averageCalories - dailyEnergyImbalance;
  const wearableTdee = getWearableTdee(input.activeCalories, input.restingCalories);
  const wearableComparison = getWearableComparison(wearableTdee, observedTdee, input.deviceType);
  const methodWeights = getMethodWeights(input.periodDays, Boolean(wearableTdee));
  const weightedTdee =
    observedTdee * methodWeights.observed +
    theoreticalTdee * methodWeights.theoretical +
    (wearableTdee ?? 0) * methodWeights.wearable;
  const trueTdee = roundToNearest(weightedTdee, 5);
  const dailyDeficitOrSurplus = input.averageCalories - trueTdee;
  const weeklyWeightChangeKg = (dailyDeficitOrSurplus * 7) / KCAL_PER_KG;
  const targets = calculateTargets(input, trueTdee);
  const protein = calculateProteinTarget(input);
  const wearableComparisonText =
    wearableComparison === undefined
      ? "Add both average resting calories and active calories from a wearable to compare device estimates with observed maintenance."
      : wearableComparison.summary;

  return {
    bmr: roundToNearest(bmr),
    theoreticalTdee: roundToNearest(theoreticalTdee, 5),
    observedTdee: roundToNearest(observedTdee, 5),
    trueTdee,
    likelyRange: getLikelyRange(trueTdee, input.periodDays),
    dailyEnergyImbalance: roundToNearest(dailyEnergyImbalance),
    dailyDeficitOrSurplus: roundToNearest(dailyDeficitOrSurplus),
    weeklyWeightChangeKg,
    weightChangeKg,
    ...targets,
    ...protein,
    goalTimelineText: calculateGoalTimeline(input, dailyDeficitOrSurplus),
    weightTrendText: describeWeightTrend(weightChangeKg, input.periodDays),
    activityLabel: activity.label,
    activityAnalysis: activity.analysis,
    wearableTdee: wearableTdee ? roundToNearest(wearableTdee, 5) : undefined,
    wearableComparison,
    wearableComparisonText,
    confidence,
    methodWeights
  };
}
