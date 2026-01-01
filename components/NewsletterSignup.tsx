'use client';

import { useState } from 'react';
import { Mail, Check } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export default function NewsletterSignup() {
  const { language } = useLanguage();
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      alert('Please enter your email address');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          city: city || undefined,
          language
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsSuccess(true);
        setEmail('');
        setCity('');
        
        // Reset success message after 5 seconds
        setTimeout(() => setIsSuccess(false), 5000);
      } else {
        alert(data.error || 'Failed to subscribe to newsletter');
      }
    } catch (error) {
      console.error('Error subscribing:', error);
      alert('Failed to subscribe. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-red-600 to-orange-500 rounded-2xl p-8 text-white">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-6 mx-auto">
          <Mail className="w-8 h-8" />
        </div>
        
        <h3 className="text-2xl font-bold text-center mb-3">
          {language === 'en' ? 'Stay Updated' : 'Restez Informé'}
        </h3>
        
        <p className="text-center opacity-90 mb-6">
          {language === 'en' 
            ? 'Get the latest event updates delivered to your inbox. Never miss out on community happenings!'
            : 'Recevez les dernières mises à jour d\'événements dans votre boîte de réception. Ne manquez jamais les événements communautaires!'
          }
        </p>

        {isSuccess ? (
          <div className="bg-green-500/20 border border-green-500/30 rounded-xl p-4 text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Check className="w-5 h-5" />
              <span className="font-semibold">
                {language === 'en' ? 'Successfully Subscribed!' : 'Abonnement Réussi!'}
              </span>
            </div>
            <p className="text-sm opacity-90">
              {language === 'en' 
                ? 'Thank you for subscribing to our newsletter!'
                : 'Merci de vous être abonné à notre newsletter!'
              }
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={language === 'en' ? 'Your email address' : 'Votre adresse email'}
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
                >
                  <option value="">
                    {language === 'en' ? 'Select your city (optional)' : 'Choisissez votre ville (optionnel)'}
                  </option>
                  <option value="toronto">Toronto</option>
                  <option value="montreal">Montreal</option>
                  <option value="vancouver">Vancouver</option>
                  <option value="calgary">Calgary</option>
                  <option value="ottawa">Ottawa</option>
                  <option value="edmonton">Edmonton</option>
                </select>
              </div>
            </div>
            
            <div className="text-center">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-white text-red-600 font-semibold px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 flex items-center justify-center mx-auto space-x-2"
              >
                <Mail className="w-4 h-4" />
                <span>
                  {isSubmitting 
                    ? (language === 'en' ? 'Subscribing...' : 'Abonnement...')
                    : (language === 'en' ? 'Subscribe Now' : 'Abonnez-vous Maintenant')
                  }
                </span>
              </button>
            </div>
            
            <p className="text-center text-sm opacity-80 pt-2">
              {language === 'en' 
                ? 'We respect your privacy. Unsubscribe at any time.'
                : 'Nous respectons votre vie privée. Désabonnez-vous à tout moment.'
              }
            </p>
          </form>
        )}
      </div>
    </div>
  );
}