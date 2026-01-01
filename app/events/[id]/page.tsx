import { db } from '../../../lib/database';
import { notFound } from 'next/navigation';
import { Calendar, MapPin, Users, Clock, Share2, Bookmark } from 'lucide-react';
import DiscussionSection from '../../../components/DiscussionSection';
import EventStructuredData from '../../../components/EventStructuredData'; // ADD THIS

import Link from 'next/link';

interface EventPageProps {
  params: {
    id: string;
  };
}

export default async function EventPage({ params }: EventPageProps) {
  const id = parseInt(params.id);
  
  if (isNaN(id)) {
    notFound();
  }

  const event = db.events.byId(id) as { id: number; date: string; time: string; location: string; category: string; city: string; title_en: string; description_en: string; description_fr: string; image_url?: string; is_featured?: boolean };
  const discussions = db.discussions.byEvent(id);
  
  if (!event) {
    notFound();
  }

  const eventDate = new Date(event.date);
  
  return (
    <div className="max-w-6xl mx-auto">
      {/* Back Button */}
    <EventStructuredData event={event} /> {/* ADD THIS LINE */}

      <div className="mb-6">
        <Link 
          href="/events" 
          className="inline-flex items-center text-gray-600 hover:text-red-600"
        >
          ← Back to Events
        </Link>
      </div>

      {/* Event Header */}
      <div className="mb-8">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="px-3 py-1 bg-red-100 text-red-700 text-sm font-medium rounded-full">
            {event.category.charAt(0).toUpperCase() + event.category.slice(1)}
          </span>
          <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded-full">
            {event.city.charAt(0).toUpperCase() + event.city.slice(1)}
          </span>
          {event.is_featured && (
            <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-sm font-medium rounded-full">
              ★ Featured Event
            </span>
          )}
        </div>
        
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{event.title_en}</h1>
        
        <div className="flex flex-wrap items-center gap-4 text-gray-600">
          <div className="flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            <span>{eventDate.toLocaleDateString('en-CA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
          <div className="flex items-center">
            <Clock className="w-5 h-5 mr-2" />
            <span>{event.time}</span>
          </div>
          <div className="flex items-center">
            <MapPin className="w-5 h-5 mr-2" />
            <span>{event.location}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column - Event Details */}
        <div className="lg:col-span-2 space-y-8">
          {/* Event Image */}
          <div className="rounded-2xl overflow-hidden">
            {event.image_url ? (
              <img
                src={event.image_url}
                alt={event.title_en}
                className="w-full h-96 object-cover"
              />
            ) : (
              <div className="w-full h-96 bg-gradient-to-r from-red-500 to-orange-500 flex items-center justify-center">
                <Calendar className="w-24 h-24 text-white opacity-80" />
              </div>
            )}
          </div>

          {/* Event Description */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Event</h2>
            <div className="prose max-w-none">
              <p className="text-gray-700 whitespace-pre-line">{event.description_en}</p>
            </div>
            
            {/* French Description (Toggleable) */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <details className="group">
                <summary className="flex items-center justify-between cursor-pointer text-lg font-semibold text-gray-900">
                  <span>Description en français</span>
                  <span className="transition-transform group-open:rotate-180">▼</span>
                </summary>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-gray-700 whitespace-pre-line">{event.description_fr}</p>
                </div>
              </details>
            </div>
          </div>

          {/* Discussion Section */}
          <DiscussionSection eventId={event.id} discussions={discussions} />
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Event Actions */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="space-y-4">
              <button className="w-full btn-primary flex items-center justify-center space-x-2">
                <Bookmark className="w-5 h-5" />
                <span>Save Event</span>
              </button>
              
              <button className="w-full btn-secondary flex items-center justify-center space-x-2">
                <Share2 className="w-5 h-5" />
                <span>Share Event</span>
              </button>
            </div>
          </div>

          {/* Event Details Card */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Details</h3>
            <div className="space-y-3">
              <div className="flex items-start">
                <Calendar className="w-5 h-5 text-gray-500 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-900">{eventDate.toLocaleDateString('en-CA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  <p className="text-gray-600">{event.time}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <MapPin className="w-5 h-5 text-gray-500 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-900">Location</p>
                  <p className="text-gray-600">{event.location}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Users className="w-5 h-5 text-gray-500 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-900">Event Type</p>
                  <p className="text-gray-600">{event.category.charAt(0).toUpperCase() + event.category.slice(1)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Similar Events */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">More in {event.city.charAt(0).toUpperCase() + event.city.slice(1)}</h3>
            <div className="space-y-4">
              {db.events.byCity(event.city)
                .filter((e: any) => e.id !== event.id)
                .slice(0, 3)
                .map((similarEvent: any) => (
                  <Link 
                    key={similarEvent.id}
                    href={`/events/${similarEvent.id}`}
                    className="block p-3 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <p className="font-medium text-gray-900 line-clamp-1">{similarEvent.title_en}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(similarEvent.date).toLocaleDateString('en-CA', { month: 'short', day: 'numeric' })} • {similarEvent.time}
                    </p>
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}