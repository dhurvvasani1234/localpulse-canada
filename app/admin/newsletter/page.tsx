'use client';

import { useState, useEffect } from 'react';
import { Mail, Download, Search, Trash2 } from 'lucide-react';

export default function AdminNewsletterPage() {
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [filteredSubscribers, setFilteredSubscribers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    mostPopularCity: 'N/A',
    enCount: 0,
    frCount: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchSubscribers();
  }, []);

  useEffect(() => {
    // Filter subscribers
    let result = subscribers;
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(sub => 
        sub.email?.toLowerCase().includes(query) ||
        (sub.city && sub.city.toLowerCase().includes(query))
      );
    }
    
    if (selectedCity) {
      result = selectedCity === 'unspecified'
        ? result.filter(sub => !sub.city || sub.city === '')
        : result.filter(sub => sub.city === selectedCity);
    }
    
    setFilteredSubscribers(result);
  }, [searchQuery, selectedCity, subscribers]);

  const fetchSubscribers = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/newsletter');
      const data = await response.json();
      
      if (response.ok) {
        setSubscribers(data.subscribers || []);
        setFilteredSubscribers(data.subscribers || []);
        setStats(data.stats || {
          total: 0,
          mostPopularCity: 'N/A',
          enCount: 0,
          frCount: 0
        });
      } else {
        console.error('Failed to fetch subscribers:', data.error);
      }
    } catch (error) {
      console.error('Error fetching subscribers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (email: string) => {
    if (!window.confirm('Are you sure you want to unsubscribe this email?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/newsletter?email=${encodeURIComponent(email)}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      
      if (response.ok && data.success) {
        // Update local state
        const updatedSubscribers = subscribers.filter(sub => sub.email !== email);
        setSubscribers(updatedSubscribers);
        alert('Subscriber removed successfully');
      } else {
        alert(data.error || 'Failed to unsubscribe');
      }
    } catch (error) {
      console.error('Error unsubscribing:', error);
      alert('Failed to unsubscribe');
    }
  };

  const handleExportCSV = () => {
    if (filteredSubscribers.length === 0) {
      alert('No subscribers to export');
      return;
    }

    const headers = ['Email', 'City', 'Language', 'Subscribed Date'];
    const csvData = [
      headers.join(','),
      ...filteredSubscribers.map(sub => [
        `"${sub.email || ''}"`,
        `"${sub.city || 'Not specified'}"`,
        `"${sub.language || 'en'}"`,
        `"${sub.subscribed_at ? new Date(sub.subscribed_at).toLocaleDateString() : 'Unknown'}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `newsletter-subscribers-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const cities = ['toronto', 'montreal', 'vancouver', 'calgary', 'ottawa', 'edmonton'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Newsletter Subscribers</h1>
          <p className="text-gray-600">Manage and export your newsletter subscribers</p>
        </div>
        
        <button
          onClick={handleExportCSV}
          className="btn-secondary flex items-center space-x-2"
          disabled={filteredSubscribers.length === 0}
        >
          <Download className="w-4 h-4" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Stats */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-xl shadow-md p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 bg-red-100 rounded-lg">
                <Mail className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Subscribers</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="text-center">
              <p className="text-sm text-gray-600">Most Popular City</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.mostPopularCity}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="text-center">
              <p className="text-sm text-gray-600">Language Preference</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.enCount} EN / {stats.frCount} FR
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="grid md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search subscribers by email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="">All Cities</option>
              {cities.map(city => (
                <option key={city} value={city}>
                  {city.charAt(0).toUpperCase() + city.slice(1)}
                </option>
              ))}
              <option value="unspecified">Not specified</option>
            </select>
          </div>
        </div>
      </div>

      {/* Subscribers Table */}
      {isLoading ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading subscribers...</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Language
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subscribed
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredSubscribers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <div className="text-gray-500">
                        No subscribers found. {subscribers.length === 0 ? 'No one has subscribed yet.' : 'Try changing your filters.'}
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredSubscribers.map((subscriber) => (
                    <tr key={subscriber.id || subscriber.email} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {subscriber.email || 'No email'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {subscriber.city 
                            ? subscriber.city.charAt(0).toUpperCase() + subscriber.city.slice(1)
                            : <span className="text-gray-400">Not specified</span>
                          }
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          subscriber.language === 'en' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {(subscriber.language || 'en').toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {subscriber.subscribed_at ? new Date(subscriber.subscribed_at).toLocaleDateString() : 'Unknown'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {subscriber.subscribed_at ? new Date(subscriber.subscribed_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleDelete(subscriber.email)}
                          className="text-gray-600 hover:text-red-600 p-1"
                          title="Unsubscribe"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {filteredSubscribers.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing <span className="font-medium">{filteredSubscribers.length}</span> of{' '}
                  <span className="font-medium">{subscribers.length}</span> subscribers
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}