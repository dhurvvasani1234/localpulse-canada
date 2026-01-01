'use client';

import { useLanguage } from '../contexts/LanguageContext';
import { getTranslation } from '../lib/i18n';

export default function ClientHome() {
  const { language } = useLanguage();
  const t = (key: string) => getTranslation(language, key);

  return (
    <div className="text-center mb-12">
      <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
        {t('common.welcome')}
      </h1>
      <p className="text-xl text-gray-600">
        {t('common.subtitle')}
      </p>
    </div>
  );
}