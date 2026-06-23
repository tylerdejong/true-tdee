import type { Metadata } from "next";
import Image from "next/image";
import { SITE_NAME, SITE_URL } from "@/lib/site";

const title = "About TrueTDEE";
const description =
  "Learn why TrueTDEE exists, how it differs from generic TDEE calculators, and the data-driven philosophy behind the site.";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: `${SITE_URL}/about`
  },
  openGraph: {
    title,
    description,
    url: `${SITE_URL}/about`,
    siteName: SITE_NAME,
    images: [
      {
        url: "/images/truetdee-hero.png",
        width: 1792,
        height: 1024,
        alt: "TrueTDEE fitness calculator visual"
      }
    ],
    type: "website"
  }
};

export default function AboutPage() {
  return (
    <main id="main-content">
      <section className="page-hero compact-hero">
        <div className="hero-media" aria-hidden="true">
          <Image src="/images/truetdee-hero.png" alt="" fill priority sizes="100vw" />
        </div>
        <div className="container hero-content">
          <span className="section-kicker">About</span>
          <h1>Why TrueTDEE Exists</h1>
          <p>
            A calculator built around real-world weight trends, calorie intake, and practical uncertainty instead of a
            single guessed activity level.
          </p>
        </div>
      </section>

      <section className="content-band">
        <article className="container content-page">
          <section className="content-card">
            <h2>Most TDEE calculators start with a guess</h2>
            <p>
              Many calorie calculators ask you to choose an activity level, then multiply a BMR estimate by a broad
              category such as sedentary, lightly active, or very active. That can be useful as a starting point, but it
              often hides the question people actually care about: what happened in real life while you ate a known
              amount of food?
            </p>
            <p>
              TrueTDEE attempts to estimate maintenance calories using real-world weight trends and calorie intake. The
              goal is to help users make more informed decisions using actual data, while still being clear that every
              result is an estimate.
            </p>
          </section>

          <section className="content-card">
            <h2>The TrueTDEE philosophy</h2>
            <div className="principle-grid">
              <div>
                <h3>Data over guesses</h3>
                <p>Observed intake and weight change can reveal more than an activity multiplier alone.</p>
              </div>
              <div>
                <h3>Trends over daily fluctuations</h3>
                <p>Daily scale weight is noisy, so longer periods and trend direction matter.</p>
              </div>
              <div>
                <h3>Education over prescriptions</h3>
                <p>TrueTDEE explains estimates and tradeoffs instead of presenting numbers as exact instructions.</p>
              </div>
            </div>
          </section>

          <section className="content-card">
            <h2>What makes TrueTDEE different?</h2>
            <ul>
              <li>Uses observed weight change to estimate maintenance from what actually happened.</li>
              <li>Includes confidence scoring so short or noisy data periods are easier to interpret.</li>
              <li>Shows why longer data periods usually improve accuracy.</li>
              <li>Includes wearable comparison tools without treating wearable calorie burn as guaranteed truth.</li>
              <li>Runs calculations in the browser without accounts, uploads, or stored health records.</li>
            </ul>
          </section>

          <section className="content-card">
            <h2>Why we built it?</h2>
            <p>
              This project was created by a data nerd who was tired of using basic TDEE calculators and wanted to
              harness the wealth of data we have the ability to track through fitness wearables and food/macro tracking
              websites. It does not claim medical, dietetic, or healthcare credentials.
            </p>
          </section>
        </article>
      </section>
    </main>
  );
}
