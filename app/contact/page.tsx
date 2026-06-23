import type { Metadata } from "next";
import Image from "next/image";
import { ContactForm } from "@/components/ContactForm";
import { SITE_NAME, SITE_URL } from "@/lib/site";

const title = "Contact TrueTDEE";
const description =
  "Contact TrueTDEE with questions, feedback, bug reports, and feature requests through a secure feedback form.";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: `${SITE_URL}/contact`
  },
  openGraph: {
    title,
    description,
    url: `${SITE_URL}/contact`,
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

export default function ContactPage() {
  return (
    <main id="main-content">
      <section className="page-hero compact-hero">
        <div className="hero-media" aria-hidden="true">
          <Image src="/images/truetdee-hero.png" alt="" fill priority sizes="100vw" />
        </div>
        <div className="container hero-content">
          <span className="section-kicker">Contact</span>
          <h1>Contact TrueTDEE</h1>
          <p>Questions, feedback, bug reports, and feature requests are welcome.</p>
        </div>
      </section>

      <section className="content-band">
        <div className="container content-page contact-layout">
          <article className="content-card">
            <h2>Send feedback</h2>
            <p>
              Use this form for site feedback, bug reports, feature requests, and calculation questions. Submissions
              are stored in a private Google Sheet for review.
            </p>
            <ContactForm />
          </article>

          <aside className="content-card contact-aside">
            <h2>Before you submit</h2>
            <p>
              TrueTDEE provides educational estimates only and does not provide medical, dietary, or healthcare advice.
            </p>
            <p>
              Please do not submit medical records, sensitive health details, passwords, or payment information.
            </p>
          </aside>
        </div>
      </section>
    </main>
  );
}
