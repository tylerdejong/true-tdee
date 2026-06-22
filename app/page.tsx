import Image from "next/image";
import Link from "next/link";
import { AdSlot } from "@/components/AdSlot";
import { TrueTDEECalculator } from "@/components/TrueTDEECalculator";
import { getRelatedPages, primarySlug, seoPages } from "@/data/pages";

export default function HomePage() {
  const primaryPage = seoPages.find((page) => page.slug === primarySlug)!;
  const relatedPages = getRelatedPages(primarySlug);

  return (
    <main id="main-content">
      <section className="page-hero home-hero">
        <div className="hero-media" aria-hidden="true">
          <Image src="/images/truetdee-hero.png" alt="" fill priority sizes="100vw" />
        </div>
        <div className="container hero-content">
          <span className="section-kicker">TrueTDEE</span>
          <h1>TrueTDEE</h1>
          <p>
            Calculate real-world maintenance calories from actual calorie intake, body weight trends, steps, and
            optional wearable data.
          </p>
          <Link className="hero-link" href={`/${primaryPage.slug}`}>
            Open the full True TDEE Calculator
          </Link>
        </div>
      </section>

      <div className="container">
        <TrueTDEECalculator focus="home" />
        <AdSlot slot="results" className="below-results-ad" />
      </div>

      <section className="home-education">
        <div className="container home-education-grid">
          <div>
            <span className="section-kicker">Why it works</span>
            <h2>Real data beats a guessed activity level</h2>
            <p>
              Standard calculators estimate activity with broad multipliers. TrueTDEE starts with BMR, then checks
              what your body weight did while you ate a known calorie average. Longer tracking periods receive higher
              confidence because they reduce the effect of water weight and unusual weeks.
            </p>
          </div>
          <div className="quality-steps" aria-label="Confidence tiers">
            <span>0 days: Starter</span>
            <span>7 days: Low</span>
            <span>14 days: Medium</span>
            <span>28 days: High</span>
            <span>60 days: Very High</span>
            <span>90 days: Elite</span>
          </div>
        </div>
      </section>

      <section className="container internal-links home-links" aria-labelledby="calculator-links-heading">
        <h2 id="calculator-links-heading">Calculator pages</h2>
        <div className="link-grid">
          {relatedPages.concat(primaryPage).map((page) => (
            <Link href={`/${page.slug}`} key={page.slug}>
              <span>{page.h1}</span>
              <small>{page.metaDescription}</small>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
