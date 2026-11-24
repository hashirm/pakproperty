export default function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://pakproperty.com';
  const lastModified = new Date();

  const cities = ['islamabad', 'lahore', 'karachi', 'rawalpindi', 'peshawar', 'faisalabad', 'multan'];

  const staticPages = [
    {
      url: `${baseUrl}`,
      lastModified,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/properties-for-sale`,
      lastModified,
      changeFrequency: 'hourly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/properties-for-rent`,
      lastModified,
      changeFrequency: 'hourly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/agents`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ];

  const citySalePages = cities.map((city) => ({
    url: `${baseUrl}/properties-for-sale/${city}`,
    lastModified,
    changeFrequency: 'daily',
    priority: 0.85,
  }));

  const cityRentPages = cities.map((city) => ({
    url: `${baseUrl}/properties-for-rent/${city}`,
    lastModified,
    changeFrequency: 'daily',
    priority: 0.85,
  }));

  return [...staticPages, ...citySalePages, ...cityRentPages];
}
