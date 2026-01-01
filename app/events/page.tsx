import { db } from '../../lib/database';
import { Calendar, MapPin, Filter, Search } from 'lucide-react';
import EventCard from '../../components/EventCard';
import EventFilters from '../../components/EventFilters';
import { notFound } from 'next/navigation';
import EventStructuredData from '../../components/EventStructuredData';





export default async function EventsPage() {
  const events = db.events.all();
  const cities = ['toronto', 'montreal', 'vancouver', 'calgary', 'ottawa', 'edmonton'];
  const categories = ['community', 'sports', 'arts', 'food', 'education', 'business'];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-red-600 to-orange-500 text-white rounded-2xl p-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Discover Events Across Canada</h1>
          <p className="text-xl opacity-90">
            Find community gatherings, cultural events, and activities in major Canadian cities
          </p>
        </div>
      </div>

      {/* Filters */}
      <EventFilters cities={cities} categories={categories} />

      {/* Event Grid */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Upcoming Events <span className="text-gray-500">({events.length})</span>
          </h2>
          <div className="flex items-center space-x-2 text-gray-600">
            <span>Sort by:</span>
            <select className="border border-gray-300 rounded-lg px-3 py-1 bg-white">
              <option>Date (Newest)</option>
              <option>Date (Oldest)</option>
              <option>City</option>
              <option>Category</option>
            </select>
          </div>
        </div>

        {events.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No events found</h3>
            <p className="text-gray-500">Check back later for upcoming events in your city.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event: any) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}

        {/* Stats */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4">
              <div className="text-3xl font-bold text-red-600">{events.length}</div>
              <div className="text-gray-600">Total Events</div>
            </div>
            <div className="text-center p-4">
              <div className="text-3xl font-bold text-red-600">
                {(events as any[]).filter((e: any) => e.is_featured).length}
              </div>
              <div className="text-gray-600">Featured Events</div>
            </div>
            <div className="text-center p-4">
              <div className="text-3xl font-bold text-red-600">
                {new Set((events as any[]).map((e: any) => e.city)).size}
              </div>
              <div className="text-gray-600">Cities Covered</div>
            </div>
            <div className="text-center p-4">
              <div className="text-3xl font-bold text-red-600">
                {new Set((events as any[]).map((e: any) => e.category)).size}
              </div>
              <div className="text-gray-600">Categories</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}