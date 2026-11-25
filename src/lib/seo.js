// Schema.org без фреймворка. Тесты: seo.test.js.
// Пустые поля (null) не выводим: Яндекс и Google ругаются на пустые значения.

const clean = (obj) => Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== null && v !== undefined && !(Array.isArray(v) && !v.length)));

export function localBusiness({ site, brand, contacts, legal, area }) {
  return clean({
    '@context': 'https://schema.org',
    '@type': 'HomeAndConstructionBusiness',
    '@id': `${site}/#org`,
    name: brand,
    url: `${site}/`,
    telephone: contacts.phoneE164,
    email: contacts.email,
    address: contacts.address ? { '@type': 'PostalAddress', addressLocality: area.city, streetAddress: contacts.address, addressCountry: 'RU' } : { '@type': 'PostalAddress', addressLocality: area.city, addressCountry: 'RU' },
    geo: contacts.geo ? { '@type': 'GeoCoordinates', latitude: contacts.geo.lat, longitude: contacts.geo.lon } : null,
    areaServed: [area.city, ...(area.suburbs ?? [])].map((name) => ({ '@type': 'City', name })),
    taxID: legal.inn,
    sameAs: [contacts.telegram, contacts.whatsapp, contacts.max].filter(Boolean),
  });
}

export function service({ site, brand, name, description, url, price }) {
  return clean({
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    description,
    url,
    provider: { '@id': `${site}/#org`, name: brand },
    areaServed: { '@type': 'City', name: 'Екатеринбург' },
    offers: price ? { '@type': 'Offer', priceCurrency: 'RUB', price: price.value, priceSpecification: { '@type': 'PriceSpecification', minPrice: price.value, priceCurrency: 'RUB' } } : null,
  });
}

// В FAQPage попадают только вопросы с ответом.
export function faqPage(faq) {
  const answered = (faq ?? []).filter((x) => x.a);
  if (!answered.length) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: answered.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
  };
}

export function breadcrumbs(site, crumbs) {
  if (crumbs.length < 2) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.name, item: new URL(c.path, site).href })),
  };
}
