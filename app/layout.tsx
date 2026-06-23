import type { Metadata, Viewport } from "next";
import Link from "next/link";
import Script from "next/script";
import { StickyMobileAd } from "@/components/AdSlot";
import { seoPages } from "@/data/pages";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://truetdee.com";
const googleTagId = "G-9B3YYTTX48";
const adClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
const adsEnabled = Boolean(adClient && !adClient.includes("000000"));

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "TrueTDEE | Real-World TDEE Calculator",
    template: "%s"
  },
  description:
    "Estimate true maintenance calories from actual calorie intake, weight trends, steps, and optional wearable data.",
  openGraph: {
    title: "TrueTDEE",
    description:
      "Real-world TDEE calculator using intake, weight trends, steps, and optional wearable data.",
    url: siteUrl,
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
  },
  robots: {
    index: true,
    follow: true
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Google tag (gtag.js) */}
        <Script async src={`https://www.googletagmanager.com/gtag/js?id=${googleTagId}`} strategy="afterInteractive" />
        <Script id="google-tag" strategy="afterInteractive">
          {`
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', '${googleTagId}');
`}
        </Script>
      </head>
      <body>
        {adsEnabled && (
          <Script
            async
            strategy="afterInteractive"
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adClient}`}
            crossOrigin="anonymous"
          />
        )}

        <a className="skip-link" href="#main-content">
          Skip to content
        </a>

        <header className="site-header">
          <div className="container header-inner">
            <Link className="brand" href="/">
              <span>True</span>TDEE
            </Link>
            <nav aria-label="Primary navigation">
              <Link href="/true-tdee-calculator">Calculator</Link>
              <Link href="/calorie-deficit-calculator">Deficit</Link>
              <Link href="/protein-intake-calculator">Protein</Link>
              <Link href="/goal-weight-timeline-calculator">Timeline</Link>
              <Link href="/about">About</Link>
              <Link href="/privacy-policy">Privacy</Link>
              <Link href="/terms">Terms</Link>
              <Link href="/contact">Contact</Link>
            </nav>
          </div>
        </header>

        {children}

        <footer className="site-footer">
          <div className="container footer-grid">
            <div>
              <Link className="brand footer-brand" href="/">
                <span>True</span>TDEE
              </Link>
              <p>
                Client-side fitness calculators for estimating maintenance calories from actual intake and body
                weight trends. No accounts, uploads, payments, or health data storage.
              </p>
            </div>
            <div>
              <h2>Site links</h2>
              <ul>
                <li>
                  <Link href="/">Home</Link>
                </li>
                <li>
                  <Link href="/about">About</Link>
                </li>
                <li>
                  <Link href="/privacy-policy">Privacy Policy</Link>
                </li>
                <li>
                  <Link href="/terms">Terms of Use</Link>
                </li>
                <li>
                  <Link href="/contact">Contact</Link>
                </li>
              </ul>
            </div>
            <div>
              <h2>Educational use</h2>
              <p>
                TrueTDEE provides educational estimates only and does not provide medical, dietary, or healthcare
                advice.
              </p>
              <ul>
                {seoPages.slice(0, 4).map((page) => (
                  <li key={page.slug}>
                    <Link href={`/${page.slug}`}>{page.h1}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </footer>

        <StickyMobileAd />
      </body>
    </html>
  );
}
