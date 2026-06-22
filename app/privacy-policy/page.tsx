import type { Metadata } from "next";
import Image from "next/image";

const title = "Privacy Policy | TrueTDEE";
const description =
  "Learn what TrueTDEE collects, what it does not collect, and how analytics, advertising, cookies, and calculator inputs are handled.";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "/privacy-policy"
  },
  openGraph: {
    title,
    description,
    url: "/privacy-policy",
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

export default function PrivacyPolicyPage() {
  return (
    <main id="main-content">
      <section className="page-hero compact-hero">
        <div className="hero-media" aria-hidden="true">
          <Image src="/images/truetdee-hero.png" alt="" fill priority sizes="100vw" />
        </div>
        <div className="container hero-content">
          <span className="section-kicker">Privacy</span>
          <h1>Privacy Policy</h1>
          <p>How TrueTDEE handles calculator inputs, analytics, advertising, cookies, and third-party services.</p>
        </div>
      </section>

      <section className="content-band">
        <article className="container content-page">
          <p className="updated-date">Last updated: June 23, 2026</p>

          <section className="content-card">
            <h2>Introduction</h2>
            <p>
              TrueTDEE is an educational fitness calculator website. It estimates maintenance calories and related
              planning numbers from information you enter into the calculator. The site does not require accounts,
              logins, uploads, payments, or server-side health data storage.
            </p>
            <p>
              Calculator results are generated in your browser. TrueTDEE is designed to help you understand estimates,
              not to collect or manage medical records.
            </p>
          </section>

          <section className="content-card">
            <h2>Information We Collect</h2>
            <p>TrueTDEE may collect limited, non-account information through standard website tools, including:</p>
            <ul>
              <li>Basic analytics information, such as page views and general site usage.</li>
              <li>Device and browser information, such as browser type, device type, and approximate screen size.</li>
              <li>Anonymous usage data, such as which pages are visited and how visitors interact with the site.</li>
              <li>Cookies where applicable, including analytics or advertising cookies from third-party services.</li>
            </ul>
          </section>

          <section className="content-card">
            <h2>Information We Do Not Collect</h2>
            <p>TrueTDEE does not intentionally collect or store:</p>
            <ul>
              <li>Account information, because there are no user accounts.</li>
              <li>Passwords, because there is no login system.</li>
              <li>Payment information, because TrueTDEE does not process payments.</li>
              <li>Health records stored on servers.</li>
              <li>Apple Health data or direct wearable health data.</li>
            </ul>
          </section>

          <section className="content-card">
            <h2>Advertising</h2>
            <p>
              TrueTDEE may use Google AdSense to display advertising. Google and other third-party advertising partners
              may use cookies or similar technologies to serve, measure, and improve ads. These cookies may be based on
              visits to this site and other sites.
            </p>
            <p>
              You can manage cookie and advertising preferences through your browser settings and through tools provided
              by Google where available.
            </p>
          </section>

          <section className="content-card">
            <h2>Analytics</h2>
            <p>
              TrueTDEE may use Google Analytics to understand how visitors use the website. Analytics data can include
              page views, device information, approximate location derived from network information, and anonymous usage
              patterns. This information helps improve page quality, performance, and calculator usability.
            </p>
          </section>

          <section className="content-card">
            <h2>Data Retention</h2>
            <p>
              Calculator inputs are processed in the browser and are not stored by TrueTDEE on a server. If analytics or
              advertising services are enabled, those third-party services may retain their own logs or cookie data under
              their own policies.
            </p>
          </section>

          <section className="content-card">
            <h2>Third-Party Services</h2>
            <p>TrueTDEE may use the following third-party services:</p>
            <ul>
              <li>Google Analytics for aggregate website measurement.</li>
              <li>Google AdSense for advertising.</li>
            </ul>
            <p>
              These services are operated by Google and are governed by Google&apos;s own privacy policies and controls.
            </p>
          </section>

          <section className="content-card">
            <h2>Your Rights</h2>
            <p>
              Depending on where you live, you may have rights to request access, deletion, correction, or restriction
              of personal information. Because TrueTDEE does not use accounts or store calculator inputs, many requests
              may relate to analytics or advertising data controlled by third-party services.
            </p>
            <p>For privacy requests, contact: privacy@truetdee.com</p>
          </section>

          <section className="content-card">
            <h2>Contact</h2>
            <p>
              Questions about this Privacy Policy can be sent to privacy@truetdee.com.
            </p>
          </section>
        </article>
      </section>
    </main>
  );
}
