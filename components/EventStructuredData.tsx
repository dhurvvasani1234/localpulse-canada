// components/EventStructuredData.tsx
import JsonLd from './JsonLd';

interface EventStructuredDataProps {
  event: {
    id: number;
    title_en: string;
    title_fr: string;
    description_en: string;
    description_fr: string;
    date: string;
    time: string;
    location: string;
    city: string;
    category: string;
    image_url?: string;
  };
}

export default function EventStructuredData({ event }: EventStructuredDataProps) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.title_en,
    description: event.description_en,
    startDate: `${event.date}T${event.time}`,
    endDate: `${event.date}T${event.time}`,
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location: {
      '@type': 'Place',
      name: event.location,
      address: {
        '@type': 'PostalAddress',
        addressLocality: event.city,
        addressRegion: 'ON',
        addressCountry: 'CA'
      }
    },
    organizer: {
      '@type': 'Organization',
      name: 'LocalPulse Canada',
      url: 'https://localpulse-canada.vercel.app'
    },
    image: event.image_url || 'https://localpulse-canada.vercel.app/og-image.png',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'CAD',
      availability: 'https://schema.org/InStock',
      validFrom: new Date().toISOString()
    },
    performer: {
      '@type': 'PerformingGroup',
      name: 'Community Organization'
    }
  };

  return <JsonLd data={structuredData} />;
}