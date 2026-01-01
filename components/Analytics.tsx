'use client';

import { useState, useEffect } from 'react';
import { Eye, Users, Calendar, TrendingUp } from 'lucide-react';

interface AnalyticsData {
  totalViews: number;
  uniqueVisitors: number;
  eventsCreated: number;
  newsletterSubscribers: number;
  topCities: Array<{ city: string; count: number }>;
  popularCategories: Array<{ category: string; count: number }>;
}

export default function Analytics() {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalViews: 0,
    uniqueVisitors: 0,
    eventsCreated: 0,
    newsletterSubscribers: 0,
    topCities: [],
    popularCategories: []
  });
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month'>('week');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching analytics data
    const fetchAnalytics = async () => {
      setIsLoading(true);
      
      // In a real app, you would fetch from your analytics API
      // For now, we'll use mock data
      setTimeout(() => {
        const mockData: AnalyticsData = {
          totalViews: timeRange === 'day' ? 245 : timeRange === 'week' ? 1876 : 8450,
          uniqueVisitors: timeRange === 'day' ? 142 : timeRange === 'week' ? 892 : 4210,
          eventsCreated: timeRange === 'day' ? 3 : timeRange === 'week' ? 12 : 45,
          newsletterSubscribers: timeRange === 'day' ? 8 : timeRange === 'week' ? 45 : 210,
          topCities: [
            { city: 'toronto', count: timeRange === 'day' ? 56 : timeRange === 'week' ? 324 : 1560 },
            { city: 'montreal', count: timeRange === 'day' ? 42 : timeRange === 'week' ? 278 : 1340 },
            { city: 'vancouver', count: timeRange === 'day' ? 38 : timeRange === 'week' ? 215 : 980 }
          ],
          popularCategories: [
            { category: 'community', count: timeRange === 'day' ? 34 : timeRange === 'week' ? 210 : 980 },
            { category: 'arts', count: timeRange === 'day' ? 28 : timeRange === 'week' ? 189 : 870 },
            { category: 'food', count: timeRange === 'day' ? 22 : timeRange === 'week' ? 156 : 720 }
          ]
        };
        
        setAnalytics(mockData);
        setIsLoading(false);
      }, 500);
    };
    
    fetchAnalytics();
  }, [timeRange]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
          <p className="text-gray-600">Track your community engagement and growth</p>
        </div>
        
        <div className="flex space-x-2">
          {(['day', 'week', 'month'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                timeRange === range
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Eye className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total Views</p>
              <p className="text-2xl font-bold text-gray-900">
                {isLoading ? '...' : analytics.totalViews.toLocaleString()}
              </p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center text-sm">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-green-600">+12.5%</span>
              <span className="text-gray-500 ml-2">from last {timeRange}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Unique Visitors</p>
              <p className="text-2xl font-bold text-gray-900">
                {isLoading ? '...' : analytics.uniqueVisitors.toLocaleString()}
              </p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center text-sm">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-green-600">+8.2%</span>
              <span className="text-gray-500 ml-2">from last {timeRange}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Events Created</p>
              <p className="text-2xl font-bold text-gray-900">
                {isLoading ? '...' : analytics.eventsCreated}
              </p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center text-sm">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-green-600">+15.3%</span>
              <span className="text-gray-500 ml-2">from last {timeRange}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 bg-orange-100 rounded-lg">
              <Users className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Newsletter Subscribers</p>
              <p className="text-2xl font-bold text-gray-900">
                {isLoading ? '...' : analytics.newsletterSubscribers}
              </p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center text-sm">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-green-600">+5.7%</span>
              <span className="text-gray-500 ml-2">from last {timeRange}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Charts/Visualizations */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top Cities */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Cities by Engagement</h3>
          <div className="space-y-4">
            {analytics.topCities.map((cityData) => {
              const maxCount = Math.max(...analytics.topCities.map(c => c.count));
              const percentage = (cityData.count / maxCount) * 100;
              
              return (
                <div key={cityData.city} className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-900">
                      {cityData.city.charAt(0).toUpperCase() + cityData.city.slice(1)}
                    </span>
                    <span className="text-gray-600">{cityData.count.toLocaleString()}</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-red-600 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Popular Categories */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Event Categories</h3>
          <div className="space-y-4">
            {analytics.popularCategories.map((categoryData) => {
              const maxCount = Math.max(...analytics.popularCategories.map(c => c.count));
              const percentage = (categoryData.count / maxCount) * 100;
              
              return (
                <div key={categoryData.category} className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-900">
                      {categoryData.category.charAt(0).toUpperCase() + categoryData.category.slice(1)}
                    </span>
                    <span className="text-gray-600">{categoryData.count}</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-600 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Engagement Metrics */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Engagement Metrics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900">
              {isLoading ? '...' : '2.4m'}
            </div>
            <div className="text-sm text-gray-600">Avg. Session Duration</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900">
              {isLoading ? '...' : '68%'}
            </div>
            <div className="text-sm text-gray-600">Return Visitors</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900">
              {isLoading ? '...' : '42%'}
            </div>
            <div className="text-sm text-gray-600">Mobile Users</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900">
              {isLoading ? '...' : '3.2'}
            </div>
            <div className="text-sm text-gray-600">Pages per Visit</div>
          </div>
        </div>
      </div>
    </div>
  );
}