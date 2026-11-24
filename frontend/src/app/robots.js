export default function robots() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://pakproperty.com';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/dashboard/', '/admin/', '/api/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
