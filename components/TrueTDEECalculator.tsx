"use client";

import { useMemo, useState } from "react";
import {
  CalculatorInput,
  CalculatorResult,
  DeviceType,
  PeriodDays,
  Sex,
  StarterActivityLevel,
  StarterInput,
  StarterResult,
  WearableComparison,
  calculateStarterTdee,
  calculateTrueTdee,
  cmToFeetInches,
  feetInchesToCm,
  kgToLb,
  lbToKg,
  periodOptions,
  roundToNearest,
  starterActivityOptions
} from "@/lib/calculations";

type UnitSystem = "metric" | "imperial";
type CalculatorMode = "starter" | "tracking";
type ResultCard = {
  label: string;
  value: string;
  subtext?: string;
  category?: "maintenance" | "trend" | "fat-loss" | "nutrition";
};

const deviceOptions: DeviceType[] = ["Apple Watch", "Garmin", "Fitbit", "Samsung Health", "Other"];

const formatCalories = (value: number) => `${Math.round(value).toLocaleString()} kcal/day`;
const formatSignedCalories = (value: number) =>
  `${value > 0 ? "+" : ""}${Math.round(value).toLocaleString()} kcal/day`;
const formatWeeklyKg = (value: number) => `${value > 0 ? "+" : ""}${value.toFixed(2)} kg/week`;
const asNumber = (value: string) => Number(value);
const optionalNumber = (value: string) => {
  if (value.trim() === "") {
    return undefined;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
};

type TextState = {
  age: string;
  heightCm: string;
  heightFeet: string;
  heightInches: string;
  currentWeight: string;
  goalWeight: string;
  averageCalories: string;
  startWeight: string;
  endWeight: string;
  averageSteps: string;
  activeCalories: string;
  restingCalories: string;
  exerciseMinutes: string;
  starterActivity: StarterActivityLevel;
};

type UpdateValue = <K extends keyof TextState>(key: K, value: TextState[K]) => void;

const defaultState: TextState = {
  age: "35",
  heightCm: "168",
  heightFeet: "5",
  heightInches: "6",
  currentWeight: "76",
  goalWeight: "70",
  averageCalories: "2200",
  startWeight: "77",
  endWeight: "76",
  averageSteps: "8000",
  activeCalories: "",
  restingCalories: "",
  exerciseMinutes: "35",
  starterActivity: "lightly-active"
};

const focusHints: Record<string, string> = {
  deficit: "The result includes mild and moderate fat-loss targets based on your estimated maintenance.",
  protein: "The result includes a protein target range based on your current and goal weight.",
  timeline: "The result includes a goal weight timeline when your current trend is moving toward the goal.",
  "apple-watch": "Enter Apple Watch active and resting energy to compare device calories with your observed trend.",
  garmin: "Enter Garmin active and resting calories to compare device estimates with your observed trend.",
  fitbit: "Enter Fitbit calorie and activity averages when available, or leave wearable fields blank.",
  home: "Start with a formula estimate today, then return with tracking data for the more accurate version.",
  true: "Longer analysis periods receive higher confidence because short-term scale noise matters less."
};

const starterActivitySelectText: Record<StarterActivityLevel, string> = {
  sedentary: "Sedentary (mostly sitting, little exercise)",
  "lightly-active": "Lightly active (some walking or light exercise)",
  "moderately-active": "Moderately active (regular movement or exercise)",
  active: "Active (high daily movement or hard exercise)",
  "very-active": "Very active (physical work or intense training)"
};

const resultCategoryLabels: Record<NonNullable<ResultCard["category"]>, string> = {
  maintenance: "Maintenance",
  trend: "Trend",
  "fat-loss": "Fat-loss",
  nutrition: "Nutrition"
};

export function TrueTDEECalculator({ focus = "true" }: { focus?: string }) {
  const [mode, setMode] = useState<CalculatorMode>("tracking");
  const [unitSystem, setUnitSystem] = useState<UnitSystem>("metric");
  const [sex, setSex] = useState<Sex>("female");
  const [periodDays, setPeriodDays] = useState<PeriodDays>(28);
  const [deviceType, setDeviceType] = useState<DeviceType>("Apple Watch");
  const [values, setValues] = useState<TextState>(defaultState);

  const updateValue: UpdateValue = (key, value) => {
    setValues((current) => ({ ...current, [key]: value }));
  };

  const changeUnitSystem = (nextUnit: UnitSystem) => {
    if (nextUnit === unitSystem) {
      return;
    }

    setValues((current) => {
      if (nextUnit === "imperial") {
        const height = cmToFeetInches(asNumber(current.heightCm));
        return {
          ...current,
          heightFeet: String(height.feet || 5),
          heightInches: String(height.inches || 6),
          currentWeight: String(roundToNearest(kgToLb(asNumber(current.currentWeight)), 0.1)),
          goalWeight: String(roundToNearest(kgToLb(asNumber(current.goalWeight)), 0.1)),
          startWeight: String(roundToNearest(kgToLb(asNumber(current.startWeight)), 0.1)),
          endWeight: String(roundToNearest(kgToLb(asNumber(current.endWeight)), 0.1))
        };
      }

      return {
        ...current,
        heightCm: String(
          roundToNearest(feetInchesToCm(asNumber(current.heightFeet), asNumber(current.heightInches)), 1)
        ),
        currentWeight: String(roundToNearest(lbToKg(asNumber(current.currentWeight)), 0.1)),
        goalWeight: String(roundToNearest(lbToKg(asNumber(current.goalWeight)), 0.1)),
        startWeight: String(roundToNearest(lbToKg(asNumber(current.startWeight)), 0.1)),
        endWeight: String(roundToNearest(lbToKg(asNumber(current.endWeight)), 0.1))
      };
    });
    setUnitSystem(nextUnit);
  };

  const baseProfile = useMemo(() => {
    const heightCm =
      unitSystem === "metric"
        ? asNumber(values.heightCm)
        : feetInchesToCm(asNumber(values.heightFeet), asNumber(values.heightInches));
    const currentWeightKg =
      unitSystem === "metric" ? asNumber(values.currentWeight) : lbToKg(asNumber(values.currentWeight));
    const goalWeightKg =
      unitSystem === "metric" ? asNumber(values.goalWeight) : lbToKg(asNumber(values.goalWeight));
    const coreValues = [asNumber(values.age), heightCm, currentWeightKg, goalWeightKg];

    if (coreValues.some((value) => !Number.isFinite(value) || value <= 0)) {
      return null;
    }

    return {
      age: asNumber(values.age),
      sex,
      heightCm,
      currentWeightKg,
      goalWeightKg
    };
  }, [sex, unitSystem, values.age, values.currentWeight, values.goalWeight, values.heightCm, values.heightFeet, values.heightInches]);

  const starterInput = useMemo<StarterInput | null>(() => {
    if (!baseProfile) {
      return null;
    }

    return {
      ...baseProfile,
      activityLevel: values.starterActivity,
      activeCalories: optionalNumber(values.activeCalories),
      restingCalories: optionalNumber(values.restingCalories),
      deviceType
    };
  }, [baseProfile, deviceType, values.activeCalories, values.restingCalories, values.starterActivity]);

  const trackingInput = useMemo<CalculatorInput | null>(() => {
    if (!baseProfile) {
      return null;
    }

    const startWeightKg =
      unitSystem === "metric" ? asNumber(values.startWeight) : lbToKg(asNumber(values.startWeight));
    const endWeightKg = unitSystem === "metric" ? asNumber(values.endWeight) : lbToKg(asNumber(values.endWeight));
    const averageCalories = asNumber(values.averageCalories);
    const averageSteps = asNumber(values.averageSteps);
    const requiredValues = [averageCalories, startWeightKg, endWeightKg];

    if (
      requiredValues.some((value) => !Number.isFinite(value) || value <= 0) ||
      !Number.isFinite(averageSteps) ||
      averageSteps < 0
    ) {
      return null;
    }

    return {
      ...baseProfile,
      periodDays,
      averageCalories,
      startWeightKg,
      endWeightKg,
      averageSteps,
      activeCalories: optionalNumber(values.activeCalories),
      restingCalories: optionalNumber(values.restingCalories),
      exerciseMinutes: optionalNumber(values.exerciseMinutes),
      deviceType
    };
  }, [
    baseProfile,
    deviceType,
    periodDays,
    unitSystem,
    values.activeCalories,
    values.averageCalories,
    values.averageSteps,
    values.endWeight,
    values.exerciseMinutes,
    values.restingCalories,
    values.startWeight
  ]);

  const starterResult = useMemo(
    () => (starterInput ? calculateStarterTdee(starterInput) : null),
    [starterInput]
  );
  const trackingResult = useMemo(
    () => (trackingInput ? calculateTrueTdee(trackingInput) : null),
    [trackingInput]
  );

  const weightUnit = unitSystem === "metric" ? "kg" : "lb";
  const heightUnit = unitSystem === "metric" ? "cm" : "ft / in";

  return (
    <section className="calculator" aria-labelledby="calculator-heading">
      <div className="section-kicker">Calculator</div>
      <div className="calculator-heading-row">
        <div>
          <h2 id="calculator-heading">True TDEE Calculator</h2>
          <p>
            Most TDEE calculators guess your activity level. TrueTDEE can give you a starting estimate today, then
            improve it with real calorie intake and weight trend data over time. {focusHints[focus] ?? focusHints.true}
          </p>
        </div>
        <div className="segmented-control" aria-label="Unit system">
          <button type="button" className={unitSystem === "metric" ? "active" : ""} onClick={() => changeUnitSystem("metric")}>
            Metric
          </button>
          <button
            type="button"
            className={unitSystem === "imperial" ? "active" : ""}
            onClick={() => changeUnitSystem("imperial")}
          >
            Imperial
          </button>
        </div>
      </div>

      <div className="calculator-layout">
        <form className="input-panel">
          <div className="mode-toggle" role="tablist" aria-label="Calculator mode">
            <button
              type="button"
              role="tab"
              aria-selected={mode === "starter"}
              className={mode === "starter" ? "active" : ""}
              onClick={() => setMode("starter")}
            >
              <strong>I&apos;m just starting</strong>
              <span>No calorie history required</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === "tracking"}
              className={mode === "tracking" ? "active" : ""}
              onClick={() => setMode("tracking")}
            >
              <strong>I have tracking data</strong>
              <span>Use intake and weight trend</span>
            </button>
          </div>

          <fieldset className="progressive-section">
            <legend>
              <span>1</span> About you
            </legend>
            <div className="form-grid">
              <NumberField
                id="age"
                label="Age"
                min="13"
                max="100"
                value={values.age}
                onChange={(value) => updateValue("age", value)}
                hint="Used for the Mifflin-St Jeor BMR estimate."
              />
              <label className="field-label" htmlFor="sex">
                <span>Sex</span>
                <select id="sex" value={sex} onChange={(event) => setSex(event.target.value as Sex)}>
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                </select>
                <small>Used only for the BMR equation and calorie floor logic.</small>
              </label>
              {unitSystem === "metric" ? (
                <NumberField
                  id="height-cm"
                  label={`Height (${heightUnit})`}
                  min="120"
                  max="230"
                  value={values.heightCm}
                  onChange={(value) => updateValue("heightCm", value)}
                  hint="Not sure? Use the height from your most recent health profile."
                />
              ) : (
                <div className="paired-inputs">
                  <NumberField
                    id="height-ft"
                    label="Height (ft)"
                    min="3"
                    max="8"
                    value={values.heightFeet}
                    onChange={(value) => updateValue("heightFeet", value)}
                    hint="Feet."
                  />
                  <NumberField
                    id="height-in"
                    label="Height (in)"
                    min="0"
                    max="11"
                    value={values.heightInches}
                    onChange={(value) => updateValue("heightInches", value)}
                    hint="Inches."
                  />
                </div>
              )}
              <NumberField
                id="current-weight"
                label={`Current weight (${weightUnit})`}
                min="30"
                value={values.currentWeight}
                onChange={(value) => updateValue("currentWeight", value)}
                hint="Use your current trend weight if you know it."
              />
              <NumberField
                id="goal-weight"
                label={`Goal weight (${weightUnit})`}
                min="30"
                value={values.goalWeight}
                onChange={(value) => updateValue("goalWeight", value)}
                hint="Used for protein range and goal timeline estimates."
              />
            </div>
          </fieldset>

          {mode === "starter" ? (
            <StarterFields values={values} updateValue={updateValue} />
          ) : (
            <TrackingFields
              periodDays={periodDays}
              setPeriodDays={setPeriodDays}
              values={values}
              updateValue={updateValue}
              weightUnit={weightUnit}
            />
          )}

          <WearableFields
            deviceType={deviceType}
            setDeviceType={setDeviceType}
            values={values}
            updateValue={updateValue}
            mode={mode}
          />

          <WhatIfNoData />
        </form>

        <div className="results-region" aria-live="polite">
          {mode === "starter" ? (
            starterResult ? (
              <StarterResults result={starterResult} deviceType={deviceType} />
            ) : (
              <EmptyResults mode={mode} />
            )
          ) : trackingResult ? (
            <TrackingResults result={trackingResult} deviceType={deviceType} />
          ) : (
            <EmptyResults mode={mode} />
          )}
        </div>
      </div>
    </section>
  );
}

function StarterFields({
  values,
  updateValue
}: {
  values: TextState;
  updateValue: UpdateValue;
}) {
  return (
    <fieldset className="progressive-section">
      <legend>
        <span>2</span> Activity estimate
      </legend>
      <label className="field-label" htmlFor="starter-activity">
        <span>Typical activity level</span>
        <select
          id="starter-activity"
          value={values.starterActivity}
          onChange={(event) => updateValue("starterActivity", event.target.value as StarterActivityLevel)}
        >
          {starterActivityOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {starterActivitySelectText[option.value]}
            </option>
          ))}
        </select>
        <small>
          Choose the closest match. This uses typical activity multipliers until you have real tracking data.
        </small>
      </label>
      <p className="helper-text">
        This mode creates a starting estimate, not observed maintenance. The more accurate TrueTDEE result needs
        calorie intake and weight trend data.
      </p>
    </fieldset>
  );
}

function TrackingFields({
  periodDays,
  setPeriodDays,
  values,
  updateValue,
  weightUnit
}: {
  periodDays: PeriodDays;
  setPeriodDays: (value: PeriodDays) => void;
  values: TextState;
  updateValue: UpdateValue;
  weightUnit: string;
}) {
  return (
    <fieldset className="progressive-section">
      <legend>
        <span>2</span> Your tracking data
      </legend>
      <div className="period-grid" role="group" aria-label="Analysis period">
        {periodOptions.map((option) => (
          <button
            key={option}
            type="button"
            className={periodDays === option ? "active" : ""}
            onClick={() => setPeriodDays(option)}
          >
            {option}
            <span>days</span>
          </button>
        ))}
      </div>
      <p className="helper-text">
        If you only have 7 days, that is okay - your confidence score will be lower. 28 days is the recommended
        minimum, and 60 to 90 days is best.
      </p>
      <div className="form-grid tracking-grid">
        <NumberField
          id="average-calories"
          label="Average daily calories"
          min="800"
          value={values.averageCalories}
          onChange={(value) => updateValue("averageCalories", value)}
          hint="Use your average from the selected period if possible."
        />
        <NumberField
          id="start-weight"
          label={`Starting weight (${weightUnit})`}
          min="30"
          value={values.startWeight}
          onChange={(value) => updateValue("startWeight", value)}
          hint="Not sure? Use your first morning weigh-in or weekly average."
        />
        <NumberField
          id="end-weight"
          label={`Ending weight (${weightUnit})`}
          min="30"
          value={values.endWeight}
          onChange={(value) => updateValue("endWeight", value)}
          hint="Use the same style of weigh-in as your starting weight."
        />
        <NumberField
          id="tracking-steps"
          label="Average daily steps"
          min="0"
          value={values.averageSteps}
          onChange={(value) => updateValue("averageSteps", value)}
          hint="Use your average from the last 28 days if possible."
        />
      </div>
    </fieldset>
  );
}

function WearableFields({
  deviceType,
  setDeviceType,
  values,
  updateValue,
  mode
}: {
  deviceType: DeviceType;
  setDeviceType: (value: DeviceType) => void;
  values: TextState;
  updateValue: UpdateValue;
  mode: CalculatorMode;
}) {
  return (
    <fieldset className="progressive-section">
      <legend>
        <span>3</span> Optional wearable data
      </legend>
      <div className="form-grid">
        <label className="field-label" htmlFor="device-type">
          <span>Device type</span>
          <select id="device-type" value={deviceType} onChange={(event) => setDeviceType(event.target.value as DeviceType)}>
            {deviceOptions.map((device) => (
              <option key={device} value={device}>
                {device}
              </option>
            ))}
          </select>
          <small>Optional fields improve context but are not required.</small>
        </label>
        <NumberField
          id="active-calories"
          label="Average active calories"
          min="0"
          value={values.activeCalories}
          onChange={(value) => updateValue("activeCalories", value)}
          placeholder="Optional"
          hint="You can find this in Apple Health, Garmin Connect, Fitbit, or Samsung Health."
        />
        <NumberField
          id="resting-calories"
          label="Average resting calories"
          min="0"
          value={values.restingCalories}
          onChange={(value) => updateValue("restingCalories", value)}
          placeholder="Optional"
          hint="Add both resting and active calories for the wearable comparison."
        />
        {mode === "tracking" && (
          <NumberField
            id="exercise-minutes"
            label="Average exercise minutes"
            min="0"
            value={values.exerciseMinutes}
            onChange={(value) => updateValue("exerciseMinutes", value)}
            hint="Optional context for interpreting activity."
          />
        )}
      </div>
    </fieldset>
  );
}

function TrackingResults({ result, deviceType }: { result: CalculatorResult; deviceType: DeviceType }) {
  // The card arrays keep label, value, subtext, and category together so the
  // result grid stays easy to scan without adding more cards.
  const resultCards: ResultCard[] = [
    {
      label: "Observed maintenance",
      value: formatCalories(result.observedTdee),
      subtext: "Based on your intake and weight trend",
      category: "maintenance"
    },
    {
      label: "Formula estimate",
      value: formatCalories(result.theoreticalTdee),
      subtext: "Based on BMR and activity inputs",
      category: "maintenance"
    },
    {
      label: "Estimated BMR",
      value: formatCalories(result.bmr),
      subtext: "Estimated calories at complete rest",
      category: "maintenance"
    },
    {
      label: "Current intake vs maintenance",
      value: `${Math.abs(result.dailyDeficitOrSurplus).toLocaleString()} kcal/day ${
        result.dailyDeficitOrSurplus >= 0 ? "above" : "below"
      }`,
      subtext: `Estimated current daily ${result.dailyDeficitOrSurplus >= 0 ? "surplus" : "deficit"}`,
      category: "trend"
    },
    {
      label: "At current intake",
      value: formatWeeklyKg(result.weeklyWeightChangeKg),
      subtext: "Estimated trend if intake stays the same",
      category: "trend"
    },
    {
      label: "Mild fat-loss",
      value: formatCalories(result.mildFatLossTarget),
      subtext: `Suggested target: ${result.mildFatLossDeficit} kcal cut - approx ${result.mildFatLossWeeklyKg.toFixed(2)} kg/week`,
      category: "fat-loss"
    },
    {
      label: "Moderate fat-loss",
      value: formatCalories(result.moderateFatLossTarget),
      subtext: `Suggested target: ${result.moderateFatLossDeficit} kcal cut - approx ${result.moderateFatLossWeeklyKg.toFixed(2)} kg/week`,
      category: "fat-loss"
    },
    {
      label: "Protein target",
      value: `${result.proteinLowG}-${result.proteinHighG} g/day`,
      subtext: "Based on current body weight",
      category: "nutrition"
    }
  ];

  return (
    <>
      <ConfidenceBanner resultScore={result.confidence.score} label={result.confidence.shortLabel} tier={result.confidence.tier}>
        {result.confidence.summary} Your estimate improves as you collect more weigh-ins and calorie data.
      </ConfidenceBanner>

      <PrimaryResult
        label="Estimated True TDEE"
        value={result.trueTdee}
        rangeLow={result.likelyRange.low}
        rangeHigh={result.likelyRange.high}
        confidence={result.confidence.shortLabel}
      >
        Based on the data provided, this blends observed maintenance most heavily, with smaller context from BMR,
        steps, and optional wearable data.
      </PrimaryResult>

      <WearableComparisonCard comparison={result.wearableComparison} deviceType={deviceType} />

      <div className="metric-grid">
        {resultCards.map((card) => (
          <MetricCard {...card} key={card.label} />
        ))}
      </div>

      <div className="result-explanations">
        <h3>What this means</h3>
        <p>{result.weightTrendText}</p>
        <p>{result.goalTimelineText}</p>
        <p>{result.activityAnalysis}</p>
        <p>{result.wearableComparisonText}</p>
        {(result.mildTargetClamped || result.moderateTargetClamped) && (
          <p>
            One or more targets were protected by a general minimum of {formatCalories(result.protectedMinimumCalories)}.
            Avoid extreme calorie targets unless a qualified professional has told you otherwise.
          </p>
        )}
      </div>

      <ConfidenceDetails result={result} />
      <SafetyNote />
    </>
  );
}

function StarterResults({ result, deviceType }: { result: StarterResult; deviceType: DeviceType }) {
  const resultCards: ResultCard[] = [
    {
      label: "Estimated BMR",
      value: formatCalories(result.bmr),
      subtext: "Estimated calories at complete rest",
      category: "maintenance"
    },
    {
      label: "Formula activity estimate",
      value: formatCalories(result.theoreticalTdee),
      subtext: "Based on BMR and selected activity level",
      category: "maintenance"
    },
    {
      label: "Activity estimate",
      value: result.activityLabel,
      subtext: result.activityAnalysis,
      category: "maintenance"
    },
    {
      label: "Activity multiplier",
      value: `${result.activityMultiplier.toFixed(3)}x`,
      subtext: "Typical multiplier for this starting estimate",
      category: "maintenance"
    },
    {
      label: "Mild fat-loss",
      value: formatCalories(result.mildFatLossTarget),
      subtext: `Suggested target: ${result.mildFatLossDeficit} kcal cut - approx ${result.mildFatLossWeeklyKg.toFixed(2)} kg/week`,
      category: "fat-loss"
    },
    {
      label: "Moderate fat-loss",
      value: formatCalories(result.moderateFatLossTarget),
      subtext: `Suggested target: ${result.moderateFatLossDeficit} kcal cut - approx ${result.moderateFatLossWeeklyKg.toFixed(2)} kg/week`,
      category: "fat-loss"
    },
    {
      label: "Protein target",
      value: `${result.proteinLowG}-${result.proteinHighG} g/day`,
      subtext: "Based on current body weight",
      category: "nutrition"
    },
    {
      label: "Likely range margin",
      value: `+/- ${result.likelyRange.margin} kcal/day`,
      subtext: "Starter estimates use a wider range",
      category: "trend"
    }
  ];

  return (
    <>
      <ConfidenceBanner resultScore={result.confidence.score} label={result.confidence.shortLabel} tier={result.confidence.tier}>
        This is a starting estimate. The most accurate version of TrueTDEE uses your real calorie intake and weight
        trend over time.
      </ConfidenceBanner>

      <PrimaryResult
        label="Starting estimated TDEE"
        value={result.startingTdee}
        rangeLow={result.likelyRange.low}
        rangeHigh={result.likelyRange.high}
        confidence={result.confidence.shortLabel}
      >
        A reasonable starting target may be inside this range while you collect your first 14 to 28 days of data.
      </PrimaryResult>

      <StarterWearableCard wearableTdee={result.wearableTdee} deviceType={deviceType} />

      <div className="metric-grid">
        {resultCards.map((card) => (
          <MetricCard {...card} key={card.label} />
        ))}
      </div>

      <div className="result-explanations">
        <h3>What to track next</h3>
        <p>
          Track these for the next 14 to 28 days, then switch to &quot;I have tracking data&quot; for a more useful TrueTDEE
          estimate.
        </p>
        <ul className="checklist">
          {result.nextSteps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ul>
        <p>
          Weigh under similar conditions, use weekly averages rather than one-off scale readings, and do not panic
          over daily fluctuations.
        </p>
      </div>

      <ConfidenceDetails result={result} />
      <SafetyNote />
    </>
  );
}

function WearableComparisonCard({
  comparison,
  deviceType
}: {
  comparison?: WearableComparison;
  deviceType: DeviceType;
}) {
  if (!comparison) {
    return (
      <div className="wearable-card muted-card">
        <div>
          <span>Wearable comparison</span>
          <h3>Add resting + active calories</h3>
          <p>
            Enter both average resting calories and active calories to compare your wearable estimate with observed
            maintenance from real intake and weight change.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`wearable-card ${comparison.alignment}`}>
      <div className="wearable-heading">
        <div>
          <span>Wearable comparison</span>
          <h3>{deviceType} vs observed maintenance</h3>
        </div>
        <strong>{formatSignedCalories(comparison.difference)}</strong>
      </div>
      <div className="wearable-grid">
        <MetricCard label={`${deviceType} estimate`} value={formatCalories(comparison.wearableTdee)} />
        <MetricCard label="Observed maintenance" value={formatCalories(comparison.comparedToTdee)} />
        <MetricCard label="Difference" value={formatSignedCalories(comparison.difference)} />
        <MetricCard label="Percent difference" value={`${comparison.percentDifference > 0 ? "+" : ""}${comparison.percentDifference.toFixed(1)}%`} />
      </div>
      <p>
        Your {deviceType} estimate is {formatCalories(comparison.wearableTdee)}. Your observed maintenance is{" "}
        {formatCalories(comparison.comparedToTdee)}. {comparison.detail}
      </p>
      <p>{comparison.summary}</p>
    </div>
  );
}

function StarterWearableCard({ wearableTdee, deviceType }: { wearableTdee?: number; deviceType: DeviceType }) {
  return (
    <div className={`wearable-card ${wearableTdee ? "starter-wearable" : "muted-card"}`}>
      <div>
        <span>Wearable context</span>
        <h3>{wearableTdee ? `${deviceType} estimate: ${formatCalories(wearableTdee)}` : "Wearable data is optional"}</h3>
        <p>
          {wearableTdee
            ? "This number is blended into starter mode, but it is not observed maintenance. Come back with intake and weight trend data to compare it properly."
            : "If you enter both resting and active calories, starter mode can use them as context while you collect tracking data."}
        </p>
      </div>
    </div>
  );
}

function PrimaryResult({
  label,
  value,
  rangeLow,
  rangeHigh,
  confidence,
  children
}: {
  label: string;
  value: number;
  rangeLow: number;
  rangeHigh: number;
  confidence: string;
  children: React.ReactNode;
}) {
  return (
    <div className="primary-result">
      <span>{label}</span>
      <strong>{formatCalories(value)}</strong>
      <div className="range-row">
        <span>Likely range: {formatCalories(rangeLow)} - {formatCalories(rangeHigh)}</span>
        <span>Confidence: {confidence}</span>
      </div>
      <p>{children}</p>
    </div>
  );
}

function ConfidenceBanner({
  resultScore,
  label,
  tier,
  children
}: {
  resultScore: number;
  label: string;
  tier: number;
  children: React.ReactNode;
}) {
  return (
    <div className={`confidence-banner tier-${tier}`}>
      <div>
        <span>Confidence: {label}</span>
        <strong>{resultScore}/100</strong>
      </div>
      <div className="confidence-meter" aria-hidden="true">
        <span style={{ width: `${resultScore}%` }} />
      </div>
      <p>{children}</p>
    </div>
  );
}

function ConfidenceDetails({ result }: { result: CalculatorResult | StarterResult }) {
  return (
    <div className="confidence-details">
      <h3>{result.confidence.label}</h3>
      <p>
        {result.confidence.periodText}. Seven days is useful but noisy, 14 days is better, 28 days is the recommended
        minimum, and 60 to 90 days is best.
      </p>
      <p>
        Your estimate improves as you collect more weigh-ins and calorie data. Start today, then come back in 14, 28,
        or 90 days for a more accurate result.
      </p>
      <ul>
        {result.confidence.suggestions.map((suggestion) => (
          <li key={suggestion}>{suggestion}</li>
        ))}
      </ul>
    </div>
  );
}

function WhatIfNoData() {
  return (
    <section className="what-if-card" aria-labelledby="what-if-heading">
      <h3 id="what-if-heading">What if I don&apos;t have this data?</h3>
      <p>To get a better TrueTDEE estimate, track these for the next 14 to 28 days:</p>
      <ul className="checklist">
        <li>Daily morning body weight</li>
        <li>Daily calorie intake</li>
        <li>Average daily steps</li>
        <li>Optional: active calories from your wearable</li>
        <li>Optional: resting calories from your wearable</li>
      </ul>
      <p>
        Weigh under similar conditions, use weekly averages rather than one-off scale readings, and expect daily
        fluctuations.
      </p>
    </section>
  );
}

function SafetyNote() {
  return (
    <div className="safety-note">
      <strong>Educational only</strong>
      <p>
        This tool is not medical, dietetic, or healthcare advice. Estimates may be inaccurate. People with medical
        conditions, pregnancy, eating disorder history, or medication affecting weight or appetite should speak with a
        qualified professional. Avoid extreme calorie targets.
      </p>
    </div>
  );
}

function EmptyResults({ mode }: { mode: CalculatorMode }) {
  return (
    <div className="empty-results">
      <h3>{mode === "starter" ? "Enter your basics to get a starting estimate" : "Enter tracking data to calculate True TDEE"}</h3>
      <p>
        Use positive numbers where required. Calculations happen in your browser and are not stored or uploaded.
      </p>
    </div>
  );
}

function MetricCard({ label, value, subtext, category }: ResultCard) {
  return (
    <div className={`metric-card ${category ? `metric-card-${category}` : ""}`}>
      <div className="metric-card-header">
        <span>{label}</span>
        {category && <small>{resultCategoryLabels[category]}</small>}
      </div>
      <strong>{value}</strong>
      {subtext && <p>{subtext}</p>}
    </div>
  );
}

function NumberField({
  id,
  label,
  min,
  max,
  value,
  onChange,
  hint,
  placeholder
}: {
  id: string;
  label: string;
  min?: string;
  max?: string;
  value: string;
  onChange: (value: string) => void;
  hint: string;
  placeholder?: string;
}) {
  return (
    <label className="field-label" htmlFor={id}>
      <span>{label}</span>
      <input
        id={id}
        inputMode="decimal"
        min={min}
        max={max}
        type="number"
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
      <small>{hint}</small>
    </label>
  );
}
