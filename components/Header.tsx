'use client';

import { useState } from 'react';
import { useLanguage } from '.././contexts/LanguageContext';
import { Menu, MapPin, Globe, X } from 'lucide-react';
import { getTranslation } from './../lib/i18n';
import Link from 'next/link';

export default function Header() {
  const { language, toggleLanguage } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const t = (key: string) => getTranslation(language, key);

  const cities = ['toronto', 'montreal', 'vancouver', 'calgary', 'ottawa', 'edmonton'];

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-800">LocalPulse</h1>
              <p className="text-xs text-gray-600">Canada</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-gray-700 hover:text-red-600 font-medium text-sm">
              {t('nav.home')}
            </Link>
            <Link href="/events" className="text-gray-700 hover:text-red-600 font-medium text-sm">
              {t('nav.events')}
            </Link>
            <Link href="/discussions" className="text-gray-700 hover:text-red-600 font-medium text-sm">
              {t('nav.discussions')}
            </Link>
            <Link href="/newsletter" className="text-gray-700 hover:text-red-600 font-medium text-sm">
              {t('nav.newsletter')}
            </Link>
            <Link href="/analytics" className="text-gray-700 hover:text-red-600 font-medium text-sm">
              Analytics
            </Link>
          </nav>

          {/* Language Toggle & Mobile Menu */}
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleLanguage}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
              aria-label={`Switch to ${language === 'en' ? 'French' : 'English'}`}
            >
              <Globe className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="font-medium text-sm sm:text-base">
                {language === 'en' ? 'FR' : 'EN'}
              </span>
            </button>
            
            <button 
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="w-6 h-6 text-gray-700" />
              ) : (
                <Menu className="w-6 h-6 text-gray-700" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-200 pt-4">
            <nav className="flex flex-col space-y-3">
              <Link 
                href="/" 
                className="text-gray-700 hover:text-red-600 font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('nav.home')}
              </Link>
              <Link 
                href="/events" 
                className="text-gray-700 hover:text-red-600 font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('nav.events')}
              </Link>
              <Link 
                href="/discussions" 
                className="text-gray-700 hover:text-red-600 font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('nav.discussions')}
              </Link>
              <Link 
                href="/newsletter" 
                className="text-gray-700 hover:text-red-600 font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('nav.newsletter')}
              </Link>
              <Link 
                href="/analytics" 
                className="text-gray-700 hover:text-red-600 font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Analytics
              </Link>
            </nav>
          </div>
        )}

        {/* City Navigation */}
        <div className="mt-4 md:mt-6">
          <div className="flex overflow-x-auto pb-2 hide-scrollbar">
            <div className="flex space-x-2 px-1">
              {cities.map(city => (
                <Link
                  key={city}
                  href={`/cities/${city}`}
                  className="flex-shrink-0 px-3 py-2 bg-gray-100 hover:bg-red-50 text-gray-700 hover:text-red-700 rounded-full text-sm font-medium transition-colors border border-gray-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t(`cities.${city}`)}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </header>
  );
}