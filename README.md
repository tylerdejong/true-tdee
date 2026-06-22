# TrueTDEE

TrueTDEE is a static, client-side Next.js calculator website for estimating real-world maintenance calories from calorie intake, body weight trends, steps, and optional wearable data.

It does not use accounts, payments, uploads, a database, coaching flows, or health data storage. Calculations run in the browser.

## Features

- True TDEE calculator with metric and imperial inputs
- Two calculator modes: starter estimate and tracking-data TrueTDEE
- Mifflin-St Jeor BMR estimate
- Observed maintenance calories from intake and body weight change
- Likely TDEE range instead of one perfect-number result
- Data quality score with starter plus five tracking confidence tiers
- Step-based activity analysis
- Optional Apple Watch, Garmin, Fitbit, Samsung Health, or other wearable comparison against observed maintenance
- Mild and moderate fat-loss targets with general safety floors
- Goal weight timeline estimate
- Protein target range
- Ten SEO landing pages with FAQ schema and internal links
- AdSense-ready placements below results, mid-article, article bottom, desktop sidebar, and optional sticky mobile footer
- Static export friendly for Vercel and Cloudflare Pages

## Requirements

- Node.js 20.9 or newer
- npm 9 or newer

## Local Setup

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Environment Variables

Copy `.env.example` to `.env.local` and replace the placeholder AdSense values when you have approved publisher and ad slot IDs.

```bash
cp .env.example .env.local
```

The site works without environment variables. Empty or placeholder AdSense values render visible placement boxes for layout review.

## Build

```bash
npm run build
```

The project uses `output: "export"` in `next.config.mjs`, so a production build creates a static `out/` directory.

Preview the exported site locally with:

```bash
npm run start
```

## Deploying TrueTDEE

TrueTDEE is ready for static hosting. `next.config.mjs` uses `output: "export"`, so `npm run build`
creates an `out/` directory containing the production HTML, CSS, JavaScript, sitemap, robots file, and
assets.

### Pre-deploy checks

Run these commands from the project root before uploading or deploying:

```bash
npm install
npm run lint
npm run typecheck
npm run build
```

The project should include these deployment files:

- `package.json`
- `package-lock.json`
- `next.config.mjs`
- `tsconfig.json`
- `app/sitemap.ts`
- `app/robots.ts`
- `.env.example`
- `public/favicon.ico`
- `public/images/truetdee-hero.png`

### Environment variables

The site works without environment variables. Add these only when the production domain and ad slots are ready.

| Variable | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Recommended | Canonical site URL used for metadata, sitemap, and robots.txt. Example: `https://truetdee.com`. |
| `NEXT_PUBLIC_ADSENSE_CLIENT` | Optional | Google AdSense publisher ID, such as `ca-pub-...`. Leave blank or use the placeholder until AdSense is approved. |
| `NEXT_PUBLIC_AD_SLOT_RESULTS` | Optional | AdSense slot for the below-results placement. |
| `NEXT_PUBLIC_AD_SLOT_MID_ARTICLE` | Optional | AdSense slot for the mid-article placement. |
| `NEXT_PUBLIC_AD_SLOT_BOTTOM` | Optional | AdSense slot for the bottom article placement. |
| `NEXT_PUBLIC_AD_SLOT_SIDEBAR` | Optional | AdSense slot for the desktop sidebar placement. |
| `NEXT_PUBLIC_AD_SLOT_STICKY_MOBILE` | Optional | AdSense slot for the sticky mobile placement. |
| `NEXT_PUBLIC_ENABLE_STICKY_MOBILE_AD` | Optional | Set to `true` only after reviewing AdSense policy and mobile UX. Defaults to disabled. |

No private server secrets are required because TrueTDEE has no authentication, database, payment system, or backend
API.

### GitHub upload steps

1. Create a new GitHub repository named `truetdee`.
2. In the local project folder, run:

```bash
git init
git add .
git commit -m "Initial TrueTDEE launch build"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/truetdee.git
git push -u origin main
```

If the repository already exists locally, use:

```bash
git add .
git commit -m "Prepare TrueTDEE for deployment"
git push origin main
```

### Vercel deployment steps

1. Sign in to Vercel and choose **Add New... > Project**.
2. Import the GitHub repository.
3. Select the **Next.js** framework preset.
4. Set the root directory to the repository root.
5. Use build command `npm run build`.
6. Use output directory `out`.
7. Add the environment variables above if ads or a custom production URL are ready.
8. Click **Deploy**.
9. After deployment, add the production domain in Vercel and set `NEXT_PUBLIC_SITE_URL` to that exact URL.
10. Redeploy so sitemap, robots.txt, canonical URLs, and Open Graph metadata use the production domain.

### Final pre-launch checklist

- `npm install` passes.
- `npm run lint` passes.
- `npm run typecheck` passes.
- `npm run build` passes.
- `/sitemap.xml` is generated.
- `/robots.txt` is generated.
- All calculator, About, Privacy Policy, and Terms of Use pages load.
- Page titles, meta descriptions, and Open Graph metadata are present.
- `.env.example` contains placeholders only.
- No `.env`, `.env.local`, or real secret files are committed.
- `NEXT_PUBLIC_SITE_URL` matches the final production domain.
- AdSense publisher and slot IDs are added only after approval.
- Privacy Policy, Terms of Use, disclaimer text, and contact email are reviewed before launch.

## Calculator Modes

### I'm just starting

Starter mode is for users who do not yet have calorie history or weight trend data. It asks for age, sex, height, current weight, goal weight, a simple activity level, and optional wearable resting plus active calories.

This mode calculates BMR with Mifflin-St Jeor, estimates TDEE from a typical activity multiplier such as sedentary, lightly active, moderately active, active, or very active, and blends in wearable resting plus active calories when both are provided. The output is labeled as a starting estimate, not observed maintenance. It also gives a wide suggested maintenance range and a checklist for what to track next.

### I have tracking data

Tracking mode is the main TrueTDEE calculator. It asks for average calorie intake, starting weight, ending weight, analysis period, average steps, and optional wearable data. This mode calculates observed maintenance from actual intake and weight change, then uses BMR, steps, and wearable data as supporting context.

## Calculator Method

TrueTDEE estimates BMR with Mifflin-St Jeor. It then creates a theoretical TDEE from step-based activity. The primary observed estimate comes from:

```text
weight change kg = ending weight - starting weight
daily energy imbalance = weight change kg * 7700 / days
observed maintenance = average daily calories - daily energy imbalance
```

If weight decreased, the energy imbalance is negative and observed maintenance rises above intake. If weight increased, observed maintenance falls below intake.

The final tracking result weights observed data more heavily than theoretical calculations. If both resting and active wearable calories are provided, TrueTDEE also calculates:

```text
wearable TDEE = resting calories + active calories
difference = wearable TDEE - observed maintenance
percentage difference = difference / observed maintenance
```

The result shows estimated True TDEE, a likely range, and confidence. Range margins are wider for shorter data windows:

- Starter: +/- 300 kcal/day
- 7-13 days: +/- 250 kcal/day
- 14-27 days: +/- 175 kcal/day
- 28-59 days: +/- 100 kcal/day
- 60-89 days: +/- 75 kcal/day
- 90+ days: +/- 50 kcal/day

## SEO Pages

- `/true-tdee-calculator`
- `/actual-tdee-calculator`
- `/real-maintenance-calories-calculator`
- `/calorie-deficit-calculator`
- `/maintenance-calorie-calculator`
- `/apple-watch-tdee-calculator`
- `/garmin-tdee-calculator`
- `/fitbit-tdee-calculator`
- `/protein-intake-calculator`
- `/goal-weight-timeline-calculator`

## Safety Notes

This tool provides educational information only. It does not provide medical advice, diagnose medical conditions, prescribe diets, or replace a qualified health professional. Results are estimates and may be inaccurate.
