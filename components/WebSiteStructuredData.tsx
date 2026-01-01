// components/WebSiteStructuredData.tsx
import JsonLd from './JsonLd';

export default function WebSiteStructuredData() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'LocalPulse Canada',
    description: 'Discover local events and community discussions across Canadian cities',
    url: 'https://localpulse-canada.vercel.app',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://localpulse-canada.vercel.app/events?search={search_term_string}'
      },
      'query-input': 'required name=search_term_string'
    },
    publisher: {
      '@type': 'Organization',
      name: 'LocalPulse Canada',
      logo: {
        '@type': 'ImageObject',
        url: 'https://localpulse-canada.vercel.app/logo.png'
      }
    }
  };

  return <JsonLd data={structuredData} />;
}