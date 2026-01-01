'use client';

import { Calendar, MapPin, ArrowRight } from 'lucide-react';
import { useLanguage } from './../contexts/LanguageContext';
import { getCityName, getCategoryName } from './../lib/i18n';
import Link from 'next/link';

interface EventCardProps {
  event: {
    id: number;
    title_en: string;
    title_fr: string;
    description_en: string;
    description_fr: string;
    city: string;
    category: string;
    date: string;
    time: string;
    location: string;
    image_url: string;
    is_featured: boolean;
  };
  compact?: boolean;
}

export default function EventCard({ event, compact = false }: EventCardProps) {
  const { language } = useLanguage();
  const title = language === 'en' ? event.title_en : event.title_fr;
  const description = language === 'en' ? event.description_en : event.description_fr;
  const cityName = getCityName(language, event.city);
  const categoryName = getCategoryName(language, event.category);

  const eventDate = new Date(event.date);
  const formattedDate = eventDate.toLocaleDateString(language === 'en' ? 'en-CA' : 'fr-CA', {
    month: 'short',
    day: 'numeric'
  });

  if (compact) {
    return (
      <Link href={`/events/${event.id}`}>
        <div className="flex items-center space-x-3 p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <div className="flex-shrink-0 w-16 h-16 bg-red-100 rounded-lg flex items-center justify-center">
            <Calendar className="w-6 h-6 text-red-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{title}</p>
            <div className="flex items-center mt-1 space-x-2 text-xs text-gray-500">
              <span>{formattedDate}</span>
              <span>•</span>
              <span>{cityName}</span>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-gray-400" />
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/events/${event.id}`}>
      <div className="card hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
        {/* Event Image */}
        <div className="relative h-40 sm:h-48 w-full overflow-hidden rounded-t-xl">
          {event.image_url ? (
            <img
              src={event.image_url}
              alt={title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-red-500 to-orange-500 flex items-center justify-center">
              <Calendar className="w-10 h-10 sm:w-12 sm:h-12 text-white opacity-80" />
            </div>
          )}
          
          {/* Featured Badge */}
          {event.is_featured && (
            <div className="absolute top-2 left-2">
              <span className="bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                ★
              </span>
            </div>
          )}
          
          {/* City Badge */}
          <div className="absolute top-2 right-2">
            <span className="bg-white/90 backdrop-blur-sm text-gray-800 text-xs font-semibold px-2 py-1 rounded-full">
              {cityName}
            </span>
          </div>
        </div>

        {/* Event Content */}
        <div className="p-4 sm:p-5 flex-grow">
          {/* Category */}
          <div className="mb-2">
            <span className="inline-block px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">
              {categoryName}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 line-clamp-2">
            {title}
          </h3>

          {/* Description */}
          <p className="text-gray-600 mb-3 line-clamp-2 text-sm">
            {description}
          </p>

          {/* Event Details */}
          <div className="space-y-2 mt-auto">
            <div className="flex items-center text-gray-600">
              <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-2 flex-shrink-0" />
              <span className="text-xs sm:text-sm font-medium">
                {formattedDate} • {event.time}
              </span>
            </div>
            
            <div className="flex items-center text-gray-600">
              <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-2 flex-shrink-0" />
              <span className="text-xs sm:text-sm truncate">{event.location}</span>
            </div>
          </div>
        </div>

        {/* Footer with Action */}
        <div className="px-4 sm:px-5 pb-4 sm:pb-5 pt-3 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <span className="text-red-600 font-semibold text-xs sm:text-sm">
              View Details
            </span>
            <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 text-red-600" />
          </div>
        </div>
      </div>
    </Link>
  );
}