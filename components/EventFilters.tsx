'use client';

import { useState } from 'react';
import { Filter, Search, X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { getCityName, getCategoryName } from '../lib/i18n';

interface EventFiltersProps {
  cities: string[];
  categories: string[];
}

export default function EventFilters({ cities, categories }: EventFiltersProps) {
  const { language } = useLanguage();
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const handleReset = () => {
    setSelectedCity('');
    setSelectedCategory('');
    setSearchQuery('');
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Filter className="w-5 h-5 mr-2 text-red-600" />
          {language === 'en' ? 'Filter Events' : 'Filtrer les Événements'}
        </h3>
        {(selectedCity || selectedCategory || searchQuery) && (
          <button
            onClick={handleReset}
            className="text-sm text-gray-600 hover:text-red-600 flex items-center"
          >
            <X className="w-4 h-4 mr-1" />
            {language === 'en' ? 'Clear filters' : 'Effacer les filtres'}
          </button>
        )}
      </div>

      <div className="space-y-6">
        {/* Search */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Search className="w-4 h-4 inline mr-1" />
            {language === 'en' ? 'Search events' : 'Rechercher des événements'}
          </label>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={language === 'en' ? 'Search by event name...' : 'Rechercher par nom d\'événement...'}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>

        {/* Filters Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* City Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {language === 'en' ? 'City' : 'Ville'}
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {cities.map((city) => (
                <button
                  key={city}
                  type="button"
                  onClick={() => setSelectedCity(selectedCity === city ? '' : city)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedCity === city
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {getCityName(language, city)}
                </button>
              ))}
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {language === 'en' ? 'Category' : 'Catégorie'}
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setSelectedCategory(selectedCategory === category ? '' : category)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === category
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {getCategoryName(language, category)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Active Filters */}
        {(selectedCity || selectedCategory) && (
          <div className="pt-4 border-t border-gray-200">
            <p className="text-sm font-medium text-gray-700 mb-2">
              {language === 'en' ? 'Active filters:' : 'Filtres actifs:'}
            </p>
            <div className="flex flex-wrap gap-2">
              {selectedCity && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-red-100 text-red-800">
                  {getCityName(language, selectedCity)}
                  <button
                    onClick={() => setSelectedCity('')}
                    className="ml-2 text-red-600 hover:text-red-800"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {selectedCategory && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-red-100 text-red-800">
                  {getCategoryName(language, selectedCategory)}
                  <button
                    onClick={() => setSelectedCategory('')}
                    className="ml-2 text-red-600 hover:text-red-800"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}