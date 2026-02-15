import { MetadataRoute } from 'next'

export const dynamic = 'force-static'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/private/', '/admin/', '/api/', '/_next/', '/build/'],
        crawlDelay: 1,
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [],
        crawlDelay: 0,
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: [],
        crawlDelay: 1,
      }
    ],
    sitemap: [
      'https://biswajitpanday.github.io/sitemap.xml',
      'https://biswajitpanday.github.io/sitemap-index.xml'
    ],
    host: 'https://biswajitpanday.github.io',
  }
} 