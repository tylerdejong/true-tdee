export type Faq = {
  question: string;
  answer: string;
};

export type ArticleSection = {
  heading: string;
  paragraphs: string[];
};

export type SeoPage = {
  slug: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  deck: string;
  calculatorFocus: string;
  intro: string[];
  sections: ArticleSection[];
  faqs: Faq[];
};

const sharedMethodSections: ArticleSection[] = [
  {
    heading: "Why the length of your data matters",
    paragraphs: [
      "TrueTDEE rewards better data because body weight is noisy. A seven day period can be pushed around by a salty restaurant meal, a hard training session, a long flight, alcohol, illness, menstrual cycle changes, extra carbohydrate, or a missed weigh-in. Those changes can move scale weight without meaningfully changing body fat. That is why the calculator displays a visible confidence score instead of pretending every estimate is equally precise.",
      "Four weeks is the recommended minimum because a 28 day trend gives enough time for many short-term fluctuations to average out. Sixty days is stronger, and ninety days is the best representation of normal life for most people. Longer periods also make tracking errors less powerful. One unusual weekend can dominate a seven day estimate, but it has much less influence across two or three months."
    ]
  },
  {
    heading: "How TrueTDEE uses your real-world data",
    paragraphs: [
      "The calculator starts with BMR from the Mifflin-St Jeor equation and builds a theoretical TDEE from your step-based activity level. It then calculates observed maintenance calories from average intake and body weight change. If weight went down, your body was in an energy deficit, so maintenance is estimated above your logged intake. If weight went up, maintenance is estimated below your logged intake. The model assumes about 7,700 kcal per kilogram of body weight change.",
      "The final TrueTDEE estimate weights observed data more heavily than theory. Wearable data can help explain activity patterns, but device calorie numbers are still estimates. For that reason, Apple Watch, Garmin, Fitbit, Samsung Health, and other wearable values are treated as comparison signals rather than the main answer."
    ]
  },
  {
    heading: "Finding useful data in fitness apps",
    paragraphs: [
      "For Apple Health or Apple Watch, look for active energy, resting energy, steps, workouts, and weight trends over the same date range as your food log. For Garmin Connect, use calories, resting calories, active calories, steps, intensity minutes, and weight reports. For Fitbit, review calories burned, steps, exercise minutes, and weight history. For Samsung Health, use daily activity, exercise time, steps, calories burned, and weight entries.",
      "The important part is consistency. Match the same start and end dates across food, weight, steps, and wearable averages. If a device was not worn for several days, leave wearable fields blank or choose a longer period. The calculator still works without wearable data because the weight trend and calorie intake are the strongest inputs."
    ]
  },
  {
    heading: "Safety and responsible use",
    paragraphs: [
      "This tool provides educational information only and does not provide medical advice. Results are estimates and may be inaccurate, especially when calorie tracking is inconsistent or weight changes are affected by water, medication, illness, travel, or major lifestyle changes. Consult a qualified health professional for medical or dietary advice.",
      "TrueTDEE does not recommend aggressive calorie deficits and protects calorie targets from falling below generally accepted minimums. If the calculator output conflicts with medical guidance, symptoms, performance, hunger, or mental health, treat those signals as more important than the number on the screen."
    ]
  }
];

const sharedFaqs: Faq[] = [
  {
    question: "Is TrueTDEE more accurate than a standard TDEE calculator?",
    answer:
      "It can be more useful when your calorie intake and weight data are consistent because it uses observed weight change instead of only a generic activity multiplier. The estimate still depends on the quality and length of your data."
  },
  {
    question: "Why is 28 days recommended?",
    answer:
      "Twenty-eight days gives short-term water weight changes more time to average out. Seven days can still be useful, but it is much more affected by sodium, travel, alcohol, hard workouts, illness, and glycogen changes."
  },
  {
    question: "Does TrueTDEE store my health data?",
    answer:
      "No. The calculator runs in your browser, requires no account, has no database, and does not upload files. You enter summary averages and the result is calculated on the client side."
  },
  {
    question: "Can I use wearable calorie estimates as my TDEE?",
    answer:
      "Wearable estimates are useful context, but they can overestimate or underestimate calorie burn. TrueTDEE compares device estimates with your observed intake and weight trend instead of trusting the device number alone."
  },
  {
    question: "What if my result seems too high or too low?",
    answer:
      "Check whether the date ranges match, whether weight entries reflect trend weight rather than one unusual weigh-in, and whether calorie tracking included weekends, drinks, sauces, snacks, and restaurant meals. Extending the data window usually improves confidence."
  }
];

function withShared(page: Omit<SeoPage, "sections" | "faqs"> & { sections: ArticleSection[]; faqs: Faq[] }): SeoPage {
  return {
    ...page,
    sections: [...page.sections, ...sharedMethodSections],
    faqs: [...page.faqs, ...sharedFaqs]
  };
}

export const seoPages: SeoPage[] = [
  withShared({
    slug: "true-tdee-calculator",
    metaTitle: "True TDEE Calculator | Real Maintenance Calories From Your Data",
    metaDescription:
      "Calculate your true TDEE from calorie intake, weight trends, steps, and optional wearable data. Includes confidence score, fat-loss targets, and goal timeline.",
    h1: "True TDEE Calculator",
    deck:
      "Estimate real-world maintenance calories from actual intake, body weight trends, steps, and wearable data instead of a generic activity multiplier.",
    calculatorFocus: "true",
    intro: [
      "A true TDEE estimate should answer a practical question: what calorie intake is maintaining your body weight in real life? Generic calculators can be helpful starting points, but they usually ask you to choose an activity level and then apply a broad multiplier. That works for a rough estimate, not for understanding what your own food intake and weight trend are showing.",
      "TrueTDEE uses your selected period, average daily calories, starting weight, ending weight, steps, and optional wearable averages to estimate maintenance. The more complete the data window, the more confidence the calculator assigns to the result."
    ],
    sections: [
      {
        heading: "What makes a TDEE estimate true",
        paragraphs: [
          "A useful TDEE number is not just the output of a formula. It is a calorie level that explains what happened to your weight while you were eating a known average amount. If you ate 2,200 kcal per day for 28 days and lost weight, your maintenance was probably higher than 2,200. If you gained weight, maintenance was probably lower. If weight was stable, the average intake was close to maintenance.",
          "This is the reason TrueTDEE asks for historical data instead of only age, sex, height, weight, and activity. The calculator still shows BMR and a theoretical estimate, but the observed trend gets the strongest influence."
        ]
      },
      {
        heading: "How to choose an analysis period",
        paragraphs: [
          "Use 28 days if you have it. It is the recommended minimum for meaningful accuracy because it covers enough normal eating days, training days, rest days, and weekly routines to smooth out some noise. Use 60 or 90 days when you want a stronger planning number for a long diet phase, maintenance phase, or performance goal.",
          "Use seven or fourteen days only when you need a quick starting estimate. Short periods can be distorted by water retention, menstrual cycle changes, sodium, carbohydrate changes, hard workouts, constipation, or travel. The calculator still produces a result, but it labels that result with lower confidence."
        ]
      }
    ],
    faqs: [
      {
        question: "What does True TDEE mean?",
        answer:
          "True TDEE means an estimated maintenance calorie level based on your actual calorie intake and observed weight change, with theoretical BMR and activity estimates used as supporting context."
      },
      {
        question: "Do I need a wearable to use the calculator?",
        answer:
          "No. Wearable data is optional. Average calories, starting weight, ending weight, steps, and the selected date range are enough to calculate a real-world estimate."
      }
    ]
  }),
  withShared({
    slug: "actual-tdee-calculator",
    metaTitle: "Actual TDEE Calculator | Use Intake and Weight Change",
    metaDescription:
      "Estimate actual TDEE from real calorie intake and body weight changes. Includes data quality tiers, activity analysis, and wearable comparison.",
    h1: "Actual TDEE Calculator",
    deck:
      "Use what actually happened to your body weight while eating a known calorie average to estimate your maintenance needs.",
    calculatorFocus: "actual",
    intro: [
      "An actual TDEE calculator is different from a basic calorie calculator because it looks backward before making a recommendation. Instead of asking whether you are lightly active or very active, it asks how much you ate, what happened to your weight, and how long the trend lasted.",
      "That approach is useful for people whose real expenditure does not match standard assumptions. Two people can share the same height, weight, age, and steps while having different jobs, training styles, recovery needs, logging accuracy, and adaptive responses."
    ],
    sections: [
      {
        heading: "Actual TDEE comes from a trend",
        paragraphs: [
          "The key idea is energy balance. When average intake is below maintenance, weight tends to trend down over time. When average intake is above maintenance, weight tends to trend up. TrueTDEE converts the observed weight change into an estimated daily energy imbalance, then adjusts your logged intake to estimate maintenance.",
          "This method is not magic. It assumes your average calorie intake is reasonably accurate and that the weight trend reflects tissue change across the selected window. The confidence score exists because short windows are noisy and because even careful food logs can miss small details."
        ]
      },
      {
        heading: "When actual TDEE is most useful",
        paragraphs: [
          "Actual TDEE is especially useful after a diet phase, a gaining phase, a training block, or a period where your routine changed. It can reveal whether your maintenance has drifted from an old estimate and whether a wearable or macro app is giving you a realistic target.",
          "It is also helpful for maintenance. If your weight is stable across 60 or 90 days while eating a consistent average, you have a strong practical estimate of the calories you can use to hold your current weight."
        ]
      }
    ],
    faqs: [
      {
        question: "How is actual TDEE different from BMR?",
        answer:
          "BMR estimates resting energy needs. Actual TDEE estimates total daily energy expenditure from observed intake, body weight change, steps, and optional wearable data."
      },
      {
        question: "Can actual TDEE change over time?",
        answer:
          "Yes. Body weight, training, steps, work demands, dieting history, and food logging habits can all change your practical maintenance calories. Recalculate when your routine changes."
      }
    ]
  }),
  withShared({
    slug: "real-maintenance-calories-calculator",
    metaTitle: "Real Maintenance Calories Calculator | TrueTDEE",
    metaDescription:
      "Find real maintenance calories from food intake, weight trend, daily steps, and optional wearable data. Built for practical, no-account calorie planning.",
    h1: "Real Maintenance Calories Calculator",
    deck:
      "Estimate the calorie intake that is actually maintaining your weight, using your own recent food and scale data.",
    calculatorFocus: "maintenance",
    intro: [
      "Real maintenance calories are the calories your body appears to maintain on in normal life. They are not always the same as a formula estimate because real life includes missed steps, stressful weeks, inconsistent sleep, restaurant meals, water fluctuations, training changes, and tracking habits.",
      "The best maintenance estimate comes from a period where you know your average intake and have a clear weight trend. TrueTDEE combines that observed trend with BMR, step-based activity, and optional device calories to produce a practical maintenance target."
    ],
    sections: [
      {
        heading: "Why maintenance is a range, not a single perfect number",
        paragraphs: [
          "Maintenance calories are best treated as a range because daily expenditure changes. A busy day with extra walking, a hard workout, and poor sleep does not have the same energy cost as a quiet rest day. Food labels, restaurant estimates, and home measurements also contain error.",
          "TrueTDEE gives one primary estimate because planning needs a number, but the surrounding metrics matter. The confidence score, weight trend, expected weekly change, and wearable comparison help you decide whether to hold steady, adjust slightly, or collect more data."
        ]
      },
      {
        heading: "How to test your maintenance estimate",
        paragraphs: [
          "After calculating real maintenance calories, the simplest test is to eat near that estimate for two to four weeks and watch your trend weight. A small drift is normal. A consistent movement in one direction means maintenance is probably a little higher or lower than expected.",
          "Avoid reacting to a single weigh-in. Maintenance testing works best with repeated weigh-ins, weekly averages, and a normal routine. If you change training, steps, sleep, or sodium intake at the same time, the test becomes harder to interpret."
        ]
      }
    ],
    faqs: [
      {
        question: "Are maintenance calories the same every day?",
        answer:
          "No. Daily expenditure moves with steps, training, digestion, stress, and routine. A maintenance estimate is a planning average, not a fixed daily burn."
      },
      {
        question: "Should I eat exactly my maintenance number?",
        answer:
          "You can use it as a target, but it is usually better to think in weekly averages. Consistency across time matters more than matching one exact number every day."
      }
    ]
  }),
  withShared({
    slug: "calorie-deficit-calculator",
    metaTitle: "Calorie Deficit Calculator | Deficit From True TDEE",
    metaDescription:
      "Calculate a mild or moderate calorie deficit from your estimated true TDEE. Includes safety floors, expected weekly trend, and confidence guidance.",
    h1: "Calorie Deficit Calculator",
    deck:
      "Estimate a sustainable calorie deficit from your real-world maintenance calories instead of cutting from a guessed activity multiplier.",
    calculatorFocus: "deficit",
    intro: [
      "A calorie deficit calculator is most useful when the maintenance number is realistic. If maintenance is guessed too high, the deficit may disappear in practice. If maintenance is guessed too low, the target can become unnecessarily aggressive and harder to sustain.",
      "TrueTDEE calculates maintenance first, then displays mild and moderate fat-loss targets while protecting against generally accepted low calorie floors. The goal is not to find the harshest deficit; it is to identify a target that matches real data and can be repeated consistently."
    ],
    sections: [
      {
        heading: "Why small deficits often work better",
        paragraphs: [
          "A mild deficit can be less dramatic on paper, but it is often easier to follow. Hunger, training performance, sleep, social eating, and adherence all matter. The best deficit is usually the one that produces a steady trend without causing constant rebound eating or reduced daily movement.",
          "The calculator shows the estimated daily deficit or surplus at your current intake. If your current trend is already losing weight at a reasonable pace, you may not need to cut further. If you are maintaining or gaining, a small adjustment may be enough."
        ]
      },
      {
        heading: "Interpreting expected weekly weight change",
        paragraphs: [
          "Expected weekly change is based on the energy gap between your intake and estimated True TDEE. It is a directional planning estimate, not a promise. Scale weight can pause even when fat loss is happening because water, food volume, soreness, and hormones can temporarily mask progress.",
          "If the calculator assigns low confidence, avoid making large changes. Collect more data, use a longer period, and compare trend averages before deciding that the deficit has failed."
        ]
      }
    ],
    faqs: [
      {
        question: "What is a moderate calorie deficit?",
        answer:
          "In this calculator, a moderate target is roughly 500 kcal below estimated True TDEE, subject to a calorie floor. That does not mean it is appropriate for every person."
      },
      {
        question: "Why does the calculator avoid aggressive deficits?",
        answer:
          "Aggressive deficits can increase hunger, fatigue, poor adherence, and health risks. This tool is educational and avoids recommending targets below generally accepted minimums."
      }
    ]
  }),
  withShared({
    slug: "maintenance-calorie-calculator",
    metaTitle: "Maintenance Calorie Calculator | BMR, Steps, and Weight Trend",
    metaDescription:
      "Calculate maintenance calories with BMR, steps, calorie intake, and body weight trend. No account, no uploads, client-side results.",
    h1: "Maintenance Calorie Calculator",
    deck:
      "Use BMR, activity, calorie intake, and weight trend data to estimate a practical maintenance calorie target.",
    calculatorFocus: "maintenance-calorie",
    intro: [
      "A maintenance calorie calculator should help you hold weight steady, plan a diet break, or set a sensible starting target. Many calculators stop after BMR and an activity multiplier. TrueTDEE keeps those pieces but adds observed intake and weight change so the answer reflects your own recent data.",
      "This is useful because maintenance is personal. A desk worker who trains hard, a nurse who walks all day, a parent with broken sleep, and a lifter in a high-volume training block may all need different planning methods."
    ],
    sections: [
      {
        heading: "The role of BMR in maintenance calories",
        paragraphs: [
          "BMR is the estimated energy your body uses at rest. TrueTDEE uses the Mifflin-St Jeor equation because it is a common, practical starting point. BMR is not maintenance by itself because it excludes movement, exercise, digestion, and daily life.",
          "The calculator combines BMR with a step-informed multiplier to create a theoretical TDEE. That number is useful context, but the observed estimate from intake and weight trend carries more weight in the final result."
        ]
      },
      {
        heading: "Using maintenance calories in practice",
        paragraphs: [
          "Once you have a maintenance estimate, choose a simple test. Hold calories near the number for a few weeks and keep steps reasonably consistent. If trend weight stays stable, the estimate is working. If weight moves consistently, adjust by 100 to 200 kcal and test again.",
          "Maintenance is especially useful after dieting. It can provide structure while hunger, training performance, and daily energy normalize. A realistic maintenance target can also prevent accidental weight regain from jumping from a diet target to an untested number."
        ]
      }
    ],
    faqs: [
      {
        question: "Does BMR equal maintenance calories?",
        answer:
          "No. BMR estimates resting needs. Maintenance calories include BMR plus daily movement, exercise, digestion, and other activity."
      },
      {
        question: "How often should I recalculate maintenance?",
        answer:
          "Recalculate after major weight changes, routine changes, training changes, or when your trend weight no longer matches the expected result."
      }
    ]
  }),
  withShared({
    slug: "apple-watch-tdee-calculator",
    metaTitle: "Apple Watch TDEE Calculator | Compare Watch Calories to TrueTDEE",
    metaDescription:
      "Compare Apple Watch active and resting calories with a real-world TDEE estimate from intake, weight trend, and steps.",
    h1: "Apple Watch TDEE Calculator",
    deck:
      "Use Apple Watch active energy and resting energy as comparison data while estimating maintenance from your actual intake and weight trend.",
    calculatorFocus: "apple-watch",
    intro: [
      "Apple Watch can provide helpful activity data, especially active energy, resting energy, steps, workouts, and exercise minutes. Those numbers are useful, but they are still estimates. The most practical question is whether the watch calorie estimate matches what happened to your body weight while you ate a known amount.",
      "TrueTDEE lets you enter average Apple Watch active calories and resting calories, then compares that device estimate with an observed TDEE based on intake and weight change."
    ],
    sections: [
      {
        heading: "Which Apple Watch numbers to use",
        paragraphs: [
          "Use the same date range as your food log and weight trend. In Apple Health, review active energy, resting energy, steps, workouts, and weight. If active energy and resting energy are both available, their sum can be compared with the calculator's TrueTDEE estimate.",
          "If you only have active energy, TrueTDEE can compare it by adding active calories to estimated BMR. That is less direct than active plus resting energy, but it is still useful context when evaluating whether the watch is high, low, or close."
        ]
      },
      {
        heading: "Why watch calories may not match your trend",
        paragraphs: [
          "Wearables estimate energy from heart rate, movement, body size, and device-specific models. Strength training, cycling, pushing a stroller, carrying loads, wrist fit, medication, heat, stress, and unusual heart rate responses can all affect the estimate.",
          "A mismatch does not mean the watch is useless. It means the device is one signal. If 60 or 90 days of intake and weight trend disagree with the watch, the trend is usually the better planning anchor."
        ]
      }
    ],
    faqs: [
      {
        question: "Should I eat back Apple Watch active calories?",
        answer:
          "Be careful. Active calories can be overestimated or offset by reduced movement later. Compare the watch estimate with your weight trend before eating back all activity calories."
      },
      {
        question: "Where do I find Apple Watch resting calories?",
        answer:
          "Open Apple Health, review the Activity or Energy sections, and look for resting energy over the same date range as your food and weight data."
      }
    ]
  }),
  withShared({
    slug: "garmin-tdee-calculator",
    metaTitle: "Garmin TDEE Calculator | Compare Garmin Calories to TrueTDEE",
    metaDescription:
      "Use Garmin calories, steps, intensity minutes, and weight trend data to estimate real-world TDEE and compare device estimates.",
    h1: "Garmin TDEE Calculator",
    deck:
      "Compare Garmin calorie estimates with a real-world maintenance estimate from intake, body weight trend, and steps.",
    calculatorFocus: "garmin",
    intro: [
      "Garmin Connect can provide detailed activity information, including steps, calories, resting calories, active calories, activities, and intensity minutes. That data can be useful for understanding your routine, but the most reliable calorie target still needs to be checked against your body weight trend.",
      "TrueTDEE uses Garmin numbers as optional comparison data. The calculator does not assume your device is right or wrong. It shows the gap between Garmin's estimate and the observed estimate from calorie intake and weight change."
    ],
    sections: [
      {
        heading: "Using Garmin data consistently",
        paragraphs: [
          "Choose a date range first, then pull all averages from the same range. Use your average daily steps, average calories consumed, starting weight, ending weight, and optional Garmin active and resting calorie averages. If you missed wearing the device for several days, either leave wearable fields blank or use a longer period.",
          "Garmin users often have varied training weeks. A 90 day period can be helpful because it includes deloads, long runs or rides, rest days, and normal life. Short periods can overrepresent one training block."
        ]
      },
      {
        heading: "Why endurance and strength training complicate TDEE",
        paragraphs: [
          "Endurance sessions may create large device calorie estimates, while strength sessions can be harder for wearables to quantify. Both can also change appetite, water retention, soreness, and non-exercise movement after training.",
          "That is why TrueTDEE uses weight trend as the anchor. If the Garmin estimate says one number but your intake and body weight imply another, use the discrepancy as feedback rather than a reason to chase daily calorie burn."
        ]
      }
    ],
    faqs: [
      {
        question: "Can Garmin calories replace food and weight tracking?",
        answer:
          "No. Garmin calories can help explain activity, but intake and weight trend are needed to estimate real-world maintenance calories."
      },
      {
        question: "Should I use total calories or active calories from Garmin?",
        answer:
          "If Garmin provides resting and active calories, enter both. If you only have active calories, enter active calories and let the calculator compare it with estimated BMR."
      }
    ]
  }),
  withShared({
    slug: "fitbit-tdee-calculator",
    metaTitle: "Fitbit TDEE Calculator | Compare Fitbit Calories to TrueTDEE",
    metaDescription:
      "Estimate real-world TDEE and compare Fitbit calories, steps, exercise minutes, and weight trend with actual intake.",
    h1: "Fitbit TDEE Calculator",
    deck:
      "Use Fitbit calories and steps as context while calculating maintenance from your actual food intake and body weight trend.",
    calculatorFocus: "fitbit",
    intro: [
      "Fitbit can make activity visible by tracking steps, exercise minutes, estimated calories burned, and weight entries. Those numbers can be motivating, but calorie burn estimates should be checked against what happened in the real world.",
      "TrueTDEE compares Fitbit-style device estimates with your observed energy balance. If your average intake and weight trend imply a different maintenance level, that is useful planning information."
    ],
    sections: [
      {
        heading: "What to enter from Fitbit",
        paragraphs: [
          "Use average daily steps, average exercise minutes, and any available active or total calorie estimates for the same period as your food log. If you have body weight history in Fitbit, use the starting and ending weights from the same date range.",
          "If Fitbit gives a total calories burned number but not clear resting and active components, you can still use the calculator without wearable fields. The core TrueTDEE result depends on average intake and body weight trend."
        ]
      },
      {
        heading: "Why Fitbit estimates can drift",
        paragraphs: [
          "Wrist-based trackers estimate movement and energy burn from sensors and algorithms. They may handle walking well for one person and less well for another. Cycling, lifting, carrying objects, wrist position, and missing wear time can all influence the estimate.",
          "Rather than treating Fitbit calories as a command, compare them with the trend. A stable 60 day maintenance period is strong evidence, even if the device estimate is a few hundred calories away."
        ]
      }
    ],
    faqs: [
      {
        question: "Is Fitbit calorie burn accurate enough for dieting?",
        answer:
          "It can be useful context, but it should be validated with intake and weight trend. Do not rely on device calories alone for a diet target."
      },
      {
        question: "What if Fitbit says I burned more than TrueTDEE?",
        answer:
          "Use the difference as a comparison signal. If your weight trend is reliable, the observed TrueTDEE estimate is usually a better calorie target."
      }
    ]
  }),
  withShared({
    slug: "protein-intake-calculator",
    metaTitle: "Protein Intake Calculator | Range Based on Goal Weight",
    metaDescription:
      "Estimate a daily protein target range alongside TrueTDEE, calorie targets, confidence score, and weight trend analysis.",
    h1: "Protein Intake Calculator",
    deck:
      "Calculate a practical protein target range while estimating maintenance calories and fat-loss targets from real-world data.",
    calculatorFocus: "protein",
    intro: [
      "Protein targets are easier to set when they are tied to your body size and goal. TrueTDEE estimates a daily protein range using a practical grams-per-kilogram approach and displays it alongside maintenance calories, deficit targets, and confidence scoring.",
      "The protein result is not a medical prescription. It is a general planning range for people who want structure while managing body composition, training, or satiety."
    ],
    sections: [
      {
        heading: "How the protein range is estimated",
        paragraphs: [
          "The calculator uses the lower of current weight and goal weight when the goal is weight loss, then applies a general range of about 1.6 to 2.2 grams per kilogram. This keeps the estimate from scaling too high when someone is intentionally reducing body weight.",
          "People with kidney disease, medical conditions, pregnancy, eating disorder history, or clinical nutrition needs should not use a web calculator as their guide. A qualified professional can set an appropriate target for those situations."
        ]
      },
      {
        heading: "Why protein and TDEE belong together",
        paragraphs: [
          "Calories determine the energy trend, while protein helps structure the diet. During fat loss, adequate protein can support satiety and lean mass retention when paired with resistance training. During maintenance, it can make meals more predictable and filling.",
          "Still, protein does not override energy balance. If calories are too high for your true maintenance, weight gain can happen even with a high protein intake. If calories are too low, performance and adherence can suffer even when protein is adequate."
        ]
      }
    ],
    faqs: [
      {
        question: "Is more protein always better?",
        answer:
          "No. More is not automatically better. The calculator gives a practical range, but total calories, food quality, training, preferences, and medical context still matter."
      },
      {
        question: "Should I base protein on current weight or goal weight?",
        answer:
          "For weight loss, goal weight can be a useful anchor. For maintenance or gaining, current weight is often practical. TrueTDEE uses the lower of current and goal weight when the goal is lower."
      }
    ]
  }),
  withShared({
    slug: "goal-weight-timeline-calculator",
    metaTitle: "Goal Weight Timeline Calculator | Estimate Weeks to Goal",
    metaDescription:
      "Estimate a realistic goal weight timeline from TrueTDEE, current intake, weight trend, and confidence score.",
    h1: "Goal Weight Timeline Calculator",
    deck:
      "Estimate how long a goal weight may take based on your real-world calorie balance and observed body weight trend.",
    calculatorFocus: "timeline",
    intro: [
      "Goal weight timelines are often too neat. Real progress includes plateaus, water retention, travel, illness, training changes, and adherence swings. A useful timeline should be based on a realistic energy gap and should be presented as an estimate, not a promise.",
      "TrueTDEE calculates whether your current average intake is creating a deficit, surplus, or maintenance trend. It then estimates a timeline only when the current trend is actually moving toward the goal weight entered."
    ],
    sections: [
      {
        heading: "Why timelines need confidence context",
        paragraphs: [
          "A timeline built from seven days of data can be misleading because one unusual weigh-in can change the result. A timeline from 60 or 90 days is more stable because it reflects more normal variation. That is why the confidence tier appears next to the result.",
          "If the current trend is moving away from the goal, the calculator does not pretend there is a meaningful completion date. It explains that a sustainable calorie adjustment is needed before estimating time to goal."
        ]
      },
      {
        heading: "How to use the timeline responsibly",
        paragraphs: [
          "Treat the timeline as a planning tool. It can help you decide whether a target is realistic before a holiday, event, sport season, or maintenance phase. It should not become a deadline that encourages aggressive calorie cuts.",
          "If your goal requires a large body weight change, review the estimate every four to eight weeks. Your maintenance calories may change as body weight changes, and your real-world adherence may differ from the first estimate."
        ]
      }
    ],
    faqs: [
      {
        question: "Why did the calculator not give me a goal date?",
        answer:
          "If your current intake trend is maintaining weight or moving away from the goal, a timeline would be misleading. Create a small, sustainable calorie adjustment and collect more data."
      },
      {
        question: "Will the timeline stay accurate as I lose weight?",
        answer:
          "Not perfectly. Maintenance calories often change with body weight and routine. Recalculate after meaningful weight changes or when the trend no longer matches expectations."
      }
    ]
  })
];

export const primarySlug = "true-tdee-calculator";

export function getPageBySlug(slug: string) {
  return seoPages.find((page) => page.slug === slug);
}

export function getRelatedPages(currentSlug: string) {
  return seoPages.filter((page) => page.slug !== currentSlug).slice(0, 6);
}
