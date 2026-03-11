import type { Metadata } from 'next'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://peptidedirectory.com'
const SITE_NAME = 'PeptideDirectory'

export function buildMetadata({
  title,
  description,
  path,
  noindex = false,
  canonical,
}: {
  title: string
  description: string
  path: string
  noindex?: boolean
  canonical?: string
}): Metadata {
  const fullTitle = `${title} | ${SITE_NAME}`
  const url = canonical || `${SITE_URL}${path}`

  return {
    title: fullTitle,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: SITE_NAME,
      type: 'website',
    },
    ...(noindex && { robots: { index: false, follow: false } }),
  }
}

export function buildBreadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.url}`,
    })),
  }
}

export function buildMedicalWebPageJsonLd({
  title,
  description,
  url,
  lastReviewed,
}: {
  title: string
  description: string
  url: string
  lastReviewed?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'MedicalWebPage',
    name: title,
    description,
    url: `${SITE_URL}${url}`,
    ...(lastReviewed && { lastReviewed }),
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    },
  }
}

export function buildFaqJsonLd(faqs: { question: string; answer: string }[]) {
  if (faqs.length === 0) return null
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}

export function buildOrganizationJsonLd({
  name,
  url,
  description,
  phone,
  address,
}: {
  name: string
  url?: string
  description?: string
  phone?: string
  address?: { street?: string; city?: string; state?: string; zip?: string; country?: string }
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'MedicalClinic',
    name,
    ...(url && { url }),
    ...(description && { description }),
    ...(phone && { telephone: phone }),
    ...(address && {
      address: {
        '@type': 'PostalAddress',
        ...(address.street && { streetAddress: address.street }),
        ...(address.city && { addressLocality: address.city }),
        ...(address.state && { addressRegion: address.state }),
        ...(address.zip && { postalCode: address.zip }),
        ...(address.country && { addressCountry: address.country }),
      },
    }),
  }
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}
