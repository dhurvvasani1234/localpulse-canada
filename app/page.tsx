import { Calendar, MessageSquare, Bell, MapPin } from 'lucide-react';
import CityCard from '../components/CityCard';
import db from '../lib/database';
import { getTranslation } from '../lib/i18n';
import { LanguageProvider } from '../contexts/LanguageContext';
import ClientHome from '../components/ClientHome';
import NewsletterSignup from '../components/NewsletterSignup';
import WebSiteStructuredData from './../components/WebSiteStructuredData';



// This is a server component that fetches data
export default async function HomePage() {
  // Get events count per city
  const events = db.events.all();
  const cityCounts = events.reduce((acc: Record<string, number>, event) => {
    acc[event.city] = (acc[event.city] || 0) + 1;
    return acc;
  }, {});

  const cities = [
    { key: 'toronto', count: cityCounts.toronto || 5, desc: 'Canada\'s largest city and economic hub' },
    { key: 'montreal', count: cityCounts.montreal || 4, desc: 'Vibrant cultural capital with European flair' },
    { key: 'vancouver', count: cityCounts.vancouver || 3, desc: 'West coast beauty with mountains and ocean' },
    { key: 'calgary', count: cityCounts.calgary || 2, desc: 'Gateway to the Rockies with western charm' },
    { key: 'ottawa', count: cityCounts.ottawa || 3, desc: 'Canada\'s capital city and political center' },
    { key: 'edmonton', count: cityCounts.edmonton || 2, desc: 'Festival city with river valley parks' },
  ];

  return (
    <div className="space-y-12">
    <WebSiteStructuredData />

      {/* Hero Section */}
      <section className="text-center py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            <span className="text-red-600">LocalPulse</span> Canada
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Discover local events and community discussions across Canadian cities
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="/events" className="btn-primary flex items-center space-x-2">
              <Calendar className="w-5 h-5" />
              <span>Browse Events</span>
            </a>
            <a href="/discussions" className="btn-secondary flex items-center space-x-2">
              <MessageSquare className="w-5 h-5" />
              <span>Join Discussions</span>
            </a>
          </div>
          
        </div>
      </section>

      {/* Features */}
      <section className="py-8">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">City-Focused</h3>
            <p className="text-gray-600">Events and discussions specific to major Canadian cities</p>
          </div>
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Community Driven</h3>
            <p className="text-gray-600">Share ideas and connect with locals in your area</p>
          </div>
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Stay Updated</h3>
            <p className="text-gray-600">Get notified about upcoming events in your city</p>
          </div>
        </div>
      </section>

      {/* Featured Cities */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Explore Cities</h2>
          <a href="/events" className="text-red-600 hover:text-red-700 font-medium">
            View all events →
          </a>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cities.map(city => (
            <CityCard
              key={city.key}
              cityKey={city.key}
              eventCount={city.count}
              description={city.desc}
            />
          ))}
        </div>
      </section>

      {/* Recent Events Preview */}
      <section>
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Upcoming Events</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {events.slice(0, 4).map((event: any) => (
            <div key={event.id} className="card">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="inline-block px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
                    {event.category.charAt(0).toUpperCase() + event.category.slice(1)}
                  </span>
                  <h3 className="text-xl font-semibold mt-2">{event.title_en}</h3>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-red-600">{new Date(event.date).toLocaleDateString('en-CA', { month: 'short', day: 'numeric' })}</p>
                  <p className="text-gray-500 text-sm">{event.time}</p>
                </div>
              </div>
              <p className="text-gray-600 mb-4">{event.description_en.substring(0, 100)}...</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center text-gray-500">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span className="text-sm">{event.location}</span>
                </div>
                <a href={`/events/${event.id}`} className="text-red-600 hover:text-red-700 font-medium">
                  Details →
                </a>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <a href="/events" className="btn-primary px-8">
            View All Events
          </a>
        </div>
      </section>
      <section className="py-12">
        <NewsletterSignup />
      </section>
    </div>
    
  );
}