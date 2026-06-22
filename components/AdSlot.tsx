"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

type AdSlotProps = {
  slot: "results" | "mid" | "bottom" | "sidebar" | "sticky";
  className?: string;
};

const slotEnv: Record<AdSlotProps["slot"], string | undefined> = {
  results: process.env.NEXT_PUBLIC_AD_SLOT_RESULTS,
  mid: process.env.NEXT_PUBLIC_AD_SLOT_MID_ARTICLE,
  bottom: process.env.NEXT_PUBLIC_AD_SLOT_BOTTOM,
  sidebar: process.env.NEXT_PUBLIC_AD_SLOT_SIDEBAR,
  sticky: process.env.NEXT_PUBLIC_AD_SLOT_STICKY_MOBILE
};

export function AdSlot({ slot, className = "" }: AdSlotProps) {
  const adClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
  const adSlot = slotEnv[slot];
  const label = slot === "sticky" ? "Mobile advertisement" : "Advertisement";
  const enabled = Boolean(adClient && adSlot && !adClient.includes("000000"));

  useEffect(() => {
    if (!enabled) {
      return;
    }

    try {
      window.adsbygoogle = window.adsbygoogle || [];
      window.adsbygoogle.push({});
    } catch {
      // Ad blockers and local development can block AdSense. The placement still renders.
    }
  }, [enabled, adSlot]);

  if (!enabled) {
    return (
      <aside className={`ad-slot ${className}`} aria-label={label}>
        <span>{label}</span>
        <strong>AdSense placement</strong>
        <small>Replace slot IDs in .env to activate.</small>
      </aside>
    );
  }

  return (
    <aside className={`ad-slot ${className}`} aria-label={label}>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={adClient}
        data-ad-slot={adSlot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </aside>
  );
}

export function StickyMobileAd() {
  if (process.env.NEXT_PUBLIC_ENABLE_STICKY_MOBILE_AD !== "true") {
    return null;
  }

  return (
    <div className="sticky-mobile-ad">
      <AdSlot slot="sticky" />
    </div>
  );
}
