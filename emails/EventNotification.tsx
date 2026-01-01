// emails/EventNotification.tsx
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Text,
  Button,
  Section,
  Tailwind,
  Column,
  Row,
} from '@react-email/components';

interface EventNotificationProps {
  userName?: string;
  events: Array<{
    id: number;
    title: string;
    description: string;
    date: string;
    time: string;
    location: string;
    city: string;
    category: string;
  }>;
  city: string;
  language: 'en' | 'fr';
}

export const EventNotification = ({ 
  userName, 
  events, 
  city,
  language = 'en' 
}: EventNotificationProps) => {
  const cityName = city.charAt(0).toUpperCase() + city.slice(1);
  const previewText = language === 'en'
    ? `Upcoming events in ${cityName}`
    : `Événements à venir à ${cityName}`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="bg-gray-50 font-sans">
          <Container className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm p-8">
            {/* Header */}
            <Section className="text-center mb-8">
              <div className="inline-block bg-red-600 rounded-full p-4 mb-4">
                <span className="text-white text-2xl font-bold">LP</span>
              </div>
              <Heading className="text-2xl font-bold text-gray-900 mb-2">
                {language === 'en'
                  ? `This Week in ${cityName}`
                  : `Cette Semaine à ${cityName}`
                }
              </Heading>
              <Text className="text-gray-600">
                {language === 'en'
                  ? `Discover ${events.length} upcoming community events`
                  : `Découvrez ${events.length} événements communautaires à venir`
                }
              </Text>
            </Section>

            {/* Greeting */}
            <Section className="mb-8">
              <Text className="text-gray-700">
                {language === 'en'
                  ? `Hello${userName ? ` ${userName}` : ''}, here are the latest events happening in ${cityName} this week:`
                  : `Bonjour${userName ? ` ${userName}` : ''}, voici les derniers événements qui se déroulent à ${cityName} cette semaine :`
                }
              </Text>
            </Section>

            {/* Events List */}
            <Section className="mb-8">
              {events.map((event, index) => (
                <div 
                  key={event.id} 
                  className={`mb-6 pb-6 ${index !== events.length - 1 ? 'border-b border-gray-200' : ''}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <Heading className="text-lg font-semibold text-gray-900">
                      {event.title}
                    </Heading>
                    <span className="bg-red-100 text-red-700 text-xs font-medium px-3 py-1 rounded-full">
                      {event.category}
                    </span>
                  </div>
                  
                  <Text className="text-gray-600 mb-3 line-clamp-2">
                    {event.description}
                  </Text>
                  
                  <Row className="text-sm text-gray-700">
                    <Column>
                      <Text className="font-medium">
                        📅 {new Date(event.date).toLocaleDateString(language === 'en' ? 'en-CA' : 'fr-CA', { 
                          weekday: 'short', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </Text>
                    </Column>
                    <Column>
                      <Text>⏰ {event.time}</Text>
                    </Column>
                    <Column>
                      <Text className="truncate">📍 {event.location}</Text>
                    </Column>
                  </Row>
                  
                  <Button
                    href={`https://localhost:3000/events/${event.id}`}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm mt-3"
                  >
                    {language === 'en' ? 'View Details' : 'Voir les Détails'}
                  </Button>
                </div>
              ))}
            </Section>

            {/* CTA Section */}
            <Section className="bg-red-50 rounded-lg p-6 mb-8 text-center">
              <Heading className="text-lg font-semibold text-gray-900 mb-4">
                {language === 'en' 
                  ? 'Want to see more events?'
                  : 'Vous voulez voir plus d\'événements ?'
                }
              </Heading>
              <Button
                href="https://localhost:3000/events"
                className="bg-red-600 text-white px-8 py-3 rounded-lg font-semibold"
              >
                {language === 'en' ? 'Browse All Events' : 'Parcourir Tous les Événements'}
              </Button>
            </Section>

            {/* Footer */}
            <Section className="text-center border-t border-gray-200 pt-8">
              <Text className="text-xs text-gray-500">
                {language === 'en'
                  ? 'You\'re receiving this email because you subscribed to LocalPulse Canada newsletter.'
                  : 'Vous recevez cet email car vous vous êtes abonné à la newsletter de LocalPulse Canada.'
                }
              </Text>
              
              <Text className="text-xs text-gray-500 mt-4">
                <Link 
                  href="https://localhost:3000/unsubscribe" 
                  className="text-red-600"
                >
                  {language === 'en' ? 'Unsubscribe' : 'Se désabonner'}
                </Link>
                {' • '}
                <Link 
                  href="https://localhost:3000/privacy" 
                  className="text-red-600"
                >
                  {language === 'en' ? 'Privacy Policy' : 'Politique de confidentialité'}
                </Link>
                {' • '}
                <Link 
                  href="https://localhost:3000/preferences" 
                  className="text-red-600"
                >
                  {language === 'en' ? 'Update Preferences' : 'Mettre à jour les préférences'}
                </Link>
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default EventNotification;