import Image from "next/image";
import Link from "next/link";
import { AdSlot } from "@/components/AdSlot";
import { TrueTDEECalculator } from "@/components/TrueTDEECalculator";
import { getRelatedPages, SeoPage } from "@/data/pages";
import { SITE_NAME, SITE_URL } from "@/lib/site";

export function ArticlePage({ page }: { page: SeoPage }) {
  const relatedPages = getRelatedPages(page.slug);
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${SITE_URL}/${page.slug}#faq`,
    mainEntity: page.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer
      }
    }))
  };
  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "@id": `${SITE_URL}/#webapplication`,
    name: SITE_NAME,
    url: SITE_URL,
    applicationCategory: "HealthApplication",
    operatingSystem: "Any",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD"
    },
    featureList: [
      "True TDEE calculation",
      "BMR calculation",
      "Data quality confidence score",
      "Wearable calorie comparison",
      "Goal weight timeline estimate"
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />

      <main id="main-content">
        <section className="page-hero compact-hero">
          <div className="hero-media" aria-hidden="true">
            <Image src="/images/truetdee-hero.png" alt="" fill priority sizes="100vw" />
          </div>
          <div className="container hero-content">
            <span className="section-kicker">TrueTDEE</span>
            <h1>{page.h1}</h1>
            <p>{page.deck}</p>
          </div>
        </section>

        <div className="container">
          <TrueTDEECalculator focus={page.calculatorFocus} />
          <AdSlot slot="results" className="below-results-ad" />
        </div>

        <section className="article-band">
          <div className="container article-layout">
            <article className="article-content">
              {page.intro.map((paragraph) => (
                <p className="lead-copy" key={paragraph}>
                  {paragraph}
                </p>
              ))}

              {page.sections.slice(0, 2).map((section) => (
                <ArticleSectionBlock section={section} key={section.heading} />
              ))}

              <AdSlot slot="mid" className="mid-article-ad" />

              {page.sections.slice(2).map((section) => (
                <ArticleSectionBlock section={section} key={section.heading} />
              ))}

              <section className="internal-links" aria-labelledby="internal-links-heading">
                <h2 id="internal-links-heading">Related calculators</h2>
                <div className="link-grid">
                  {relatedPages.map((related) => (
                    <Link href={`/${related.slug}`} key={related.slug}>
                      <span>{related.h1}</span>
                      <small>{related.metaDescription}</small>
                    </Link>
                  ))}
                </div>
              </section>

              <section className="faq-section" aria-labelledby="faq-heading">
                <h2 id="faq-heading">FAQ</h2>
                {page.faqs.map((faq) => (
                  <details key={faq.question}>
                    <summary>{faq.question}</summary>
                    <p>{faq.answer}</p>
                  </details>
                ))}
              </section>

              <AdSlot slot="bottom" className="bottom-article-ad" />
            </article>

            <aside className="desktop-sidebar" aria-label="Sidebar">
              <AdSlot slot="sidebar" />
              <div className="sidebar-note">
                <strong>Educational only</strong>
                <p>
                  TrueTDEE provides estimates for planning. It does not diagnose conditions, prescribe diets, or
                  replace qualified medical advice.
                </p>
              </div>
            </aside>
          </div>
        </section>
      </main>
    </>
  );
}

function ArticleSectionBlock({ section }: { section: SeoPage["sections"][number] }) {
  return (
    <section className="article-section">
      <h2>{section.heading}</h2>
      {section.paragraphs.map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}
    </section>
  );
}
