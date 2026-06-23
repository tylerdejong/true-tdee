import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticlePage } from "@/components/ArticlePage";
import { getPageBySlug, seoPages } from "@/data/pages";
import { SITE_NAME, SITE_URL } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return seoPages.map((page) => ({ slug: page.slug }));
}

type SlugPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: SlugPageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = getPageBySlug(slug);

  if (!page) {
    return {};
  }

  return {
    title: page.metaTitle,
    description: page.metaDescription,
    alternates: {
      canonical: `${SITE_URL}/${page.slug}`
    },
    openGraph: {
      title: page.metaTitle,
      description: page.metaDescription,
      url: `${SITE_URL}/${page.slug}`,
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
}

export default async function SeoCalculatorPage({ params }: SlugPageProps) {
  const { slug } = await params;
  const page = getPageBySlug(slug);

  if (!page) {
    notFound();
  }

  return <ArticlePage page={page} />;
}
