// emails/NewsletterWelcome.tsx
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
} from '@react-email/components';

interface NewsletterWelcomeProps {
  userEmail: string;
  city?: string;
  language: 'en' | 'fr';
}

export const NewsletterWelcome = ({ 
  userEmail, 
  city, 
  language = 'en' 
}: NewsletterWelcomeProps) => {
  const previewText = language === 'en' 
    ? 'Welcome to LocalPulse Canada!'
    : 'Bienvenue à LocalPulse Canada!';

  const cityName = city ? 
    city.charAt(0).toUpperCase() + city.slice(1) : 
    (language === 'en' ? 'your city' : 'votre ville');

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
                {language === 'en' ? 'Welcome to LocalPulse Canada!' : 'Bienvenue à LocalPulse Canada!'}
              </Heading>
              <Text className="text-gray-600">
                {language === 'en' 
                  ? 'Your gateway to community events across Canadian cities'
                  : 'Votre porte d\'entrée vers les événements communautaires dans les villes canadiennes'
                }
              </Text>
            </Section>

            {/* Welcome Message */}
            <Section className="mb-8">
              <Text className="text-gray-700">
                {language === 'en' 
                  ? `Hello, thank you for subscribing to LocalPulse Canada! We'll keep you updated on the latest community events in ${cityName}.`
                  : `Bonjour, merci de vous être abonné à LocalPulse Canada ! Nous vous tiendrons informé des derniers événements communautaires à ${cityName}.`
                }
              </Text>
              
              <Text className="text-gray-700 mt-4">
                {language === 'en'
                  ? 'You can expect to receive:'
                  : 'Vous pouvez vous attendre à recevoir :'
                }
              </Text>
              
              <ul className="list-disc pl-5 text-gray-700 mt-2 space-y-1">
                <li>
                  {language === 'en'
                    ? 'Weekly event digests for your selected city'
                    : 'Des résumés hebdomadaires d\'événements pour votre ville sélectionnée'
                  }
                </li>
                <li>
                  {language === 'en'
                    ? 'Featured event announcements'
                    : 'Annonces d\'événements en vedette'
                  }
                </li>
                <li>
                  {language === 'en'
                    ? 'Community news and updates'
                    : 'Nouvelles et mises à jour de la communauté'
                  }
                </li>
              </ul>
            </Section>

            {/* Quick Links */}
            <Section className="bg-gray-50 rounded-lg p-6 mb-8">
              <Heading className="text-lg font-semibold text-gray-900 mb-4">
                {language === 'en' ? 'Quick Links' : 'Liens Rapides'}
              </Heading>
              <div className="space-y-3">
                <Button
                  href="https://localhost:3000/events"
                  className="bg-red-600 text-white px-6 py-3 rounded-lg text-center block w-full"
                >
                  {language === 'en' ? 'Browse Events' : 'Parcourir les Événements'}
                </Button>
                <Button
                  href="https://localhost:3000/newsletter"
                  className="bg-white text-red-600 border border-red-600 px-6 py-3 rounded-lg text-center block w-full"
                >
                  {language === 'en' ? 'Manage Preferences' : 'Gérer les Préférences'}
                </Button>
              </div>
            </Section>

            {/* Footer */}
            <Section className="text-center border-t border-gray-200 pt-8">
              <Text className="text-sm text-gray-600">
                {language === 'en'
                  ? 'This email was sent to'
                  : 'Cet email a été envoyé à'
                }: {userEmail}
              </Text>
              
              <Text className="text-xs text-gray-500 mt-4">
                {language === 'en'
                  ? '© 2024 LocalPulse Canada. All rights reserved.'
                  : '© 2024 LocalPulse Canada. Tous droits réservés.'
                }
              </Text>
              
              <Text className="text-xs text-gray-500 mt-2">
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
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default NewsletterWelcome;