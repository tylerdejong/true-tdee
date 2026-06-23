import type { Metadata } from "next";
import Image from "next/image";
import { SITE_NAME, SITE_URL } from "@/lib/site";

const title = "Terms of Use | TrueTDEE";
const description =
  "Read the TrueTDEE Terms of Use, including educational purpose, no medical advice, accuracy disclaimers, and limitation of liability.";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: `${SITE_URL}/terms`
  },
  openGraph: {
    title,
    description,
    url: `${SITE_URL}/terms`,
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

export default function TermsPage() {
  return (
    <main id="main-content">
      <section className="page-hero compact-hero">
        <div className="hero-media" aria-hidden="true">
          <Image src="/images/truetdee-hero.png" alt="" fill priority sizes="100vw" />
        </div>
        <div className="container hero-content">
          <span className="section-kicker">Terms</span>
          <h1>Terms of Use</h1>
          <p>The terms for using TrueTDEE as an educational calculator and planning tool.</p>
        </div>
      </section>

      <section className="content-band">
        <article className="container content-page">
          <p className="updated-date">Last updated: June 23, 2026</p>

          <section className="content-card">
            <h2>Acceptance of Terms</h2>
            <p>
              By using TrueTDEE, you agree to these Terms of Use. If you do not agree with these terms, do not use the
              website.
            </p>
          </section>

          <section className="content-card">
            <h2>Educational Purpose Only</h2>
            <p>
              TrueTDEE provides educational estimates related to maintenance calories, calorie trends, protein ranges,
              and weight-change planning. The site is intended to help users understand general fitness concepts and
              make more informed personal decisions.
            </p>
          </section>

          <section className="content-card">
            <h2>No Medical Advice</h2>
            <p>
              TrueTDEE is not a medical service. TrueTDEE is not dietetic advice. TrueTDEE is not healthcare advice. The
              site does not diagnose, treat, prevent, or cure any condition and does not replace guidance from a
              qualified medical, dietary, or healthcare professional.
            </p>
          </section>

          <section className="content-card">
            <h2>Accuracy Disclaimer</h2>
            <p>
              Calculator results are estimates only. Results may be inaccurate because calorie tracking, body weight,
              activity, wearable data, and daily routines all contain uncertainty. Users should not rely solely on the
              calculator when making nutrition, fitness, or health decisions.
            </p>
          </section>

          <section className="content-card">
            <h2>Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by law, TrueTDEE and its operators are not liable for losses, injuries,
              damages, or consequences arising from use of the website, calculator outputs, educational content, or
              third-party links.
            </p>
          </section>

          <section className="content-card">
            <h2>Use at Your Own Risk</h2>
            <p>
              You are responsible for how you interpret and use information from TrueTDEE. If you have medical concerns,
              a history of disordered eating, are pregnant, are managing a medical condition, or are unsure whether a
              calorie target is appropriate, seek qualified professional guidance.
            </p>
          </section>

          <section className="content-card">
            <h2>Third-Party Links</h2>
            <p>
              TrueTDEE may link to third-party websites, services, analytics tools, or advertising networks. These
              services are not controlled by TrueTDEE and may have their own terms, privacy policies, and practices.
            </p>
          </section>

          <section className="content-card">
            <h2>Changes to the Service</h2>
            <p>
              TrueTDEE may change, update, suspend, or remove features, pages, calculators, or content at any time.
              These Terms of Use may also be updated as the service evolves.
            </p>
          </section>

          <section className="content-card">
            <h2>Contact Information</h2>
            <p>
              Questions about these terms can be sent to hello@truetdee.fitness.
            </p>
          </section>
        </article>
      </section>
    </main>
  );
}
