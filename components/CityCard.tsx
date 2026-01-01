'use client';

import { MapPin, Calendar, Users } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { getCityName } from '../lib/i18n';
import Link from 'next/link';

interface CityCardProps {
  cityKey: string;
  eventCount: number;
  description: string;
  imageUrl?: string;
}

export default function CityCard({ cityKey, eventCount, description, imageUrl }: CityCardProps) {
  const { language } = useLanguage();
  const cityName = getCityName(language, cityKey);

  return (
    <Link href={`/cities/${cityKey}`}>
      <div className="card hover:scale-[1.02] transition-transform cursor-pointer h-full">
        <div className="relative h-48 mb-4 rounded-lg overflow-hidden">
          {imageUrl ? (
            <img 
              src={imageUrl} 
              alt={cityName}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-red-500 to-orange-500 flex items-center justify-center">
              <MapPin className="w-16 h-16 text-white opacity-80" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-4 left-4 text-white">
            <h3 className="text-2xl font-bold">{cityName}</h3>
          </div>
        </div>
        
        <p className="text-gray-600 mb-4 line-clamp-2">{description}</p>
        
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-1">
            <Calendar className="w-4 h-4" />
            <span>{eventCount} events</span>
          </div>
          <div className="flex items-center space-x-1">
            <Users className="w-4 h-4" />
            <span>Active community</span>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-100">
          <span className="text-red-600 font-medium hover:text-red-700">
            Explore events →
          </span>
        </div>
      </div>
    </Link>
  );
}