import type { Metadata } from "next";
import Image from "next/image";
import { ContactForm } from "@/components/ContactForm";

const title = "Contact TrueTDEE";
const description =
  "Contact TrueTDEE with questions, feedback, bug reports, calculator issues, and feature requests.";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "/contact"
  },
  openGraph: {
    title,
    description,
    url: "/contact",
    siteName: "TrueTDEE",
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
          <h1>Contact</h1>
          <p>Questions, feedback, bug reports, and feature requests are welcome.</p>
        </div>
      </section>

      <section className="content-band">
        <div className="container content-page contact-layout">
          <article className="content-card">
            <h2>Send a message</h2>
            <p>
              Use the form below for questions, feedback, bug reports, and feature requests. The current version
              confirms locally; email hello@truetdee.com directly if you need a reply.
            </p>
            <ContactForm />
          </article>

          <aside className="content-card contact-aside">
            <h2>Contact details</h2>
            <p>Email: hello@truetdee.com</p>
            <p>Expected response time: within 3 to 5 business days.</p>
            <p>
              Please do not send medical records or sensitive health information. TrueTDEE does not provide medical,
              dietary, or healthcare advice.
            </p>
          </aside>
        </div>
      </section>
    </main>
  );
}
