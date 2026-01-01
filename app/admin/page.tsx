'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Calendar, MessageSquare, Users, TrendingUp } from 'lucide-react';

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [stats, setStats] = useState({
    totalEvents: 0,
    featuredEvents: 0,
    discussions: 0,
    pendingDiscussions: 0,
    subscribers: 0
  });
  const [recentEvents, setRecentEvents] = useState([]);
  const [recentDiscussions, setRecentDiscussions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const router = useRouter();

  // Check if already logged in
  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      setIsAuthenticated(true);
      fetchDashboardData();
    }
  }, []);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      // Fetch events
      const eventsRes = await fetch('/api/admin/events');
      const eventsData = await eventsRes.json();
      
      // Fetch discussions
      const discussionsRes = await fetch('/api/admin/discussions');
      const discussionsData = await discussionsRes.json();
      
      // Fetch subscribers
      const newsletterRes = await fetch('/api/admin/newsletter');
      const newsletterData = await newsletterRes.json();
      
      setStats({
        totalEvents: eventsData.events?.length || 0,
        featuredEvents: eventsData.events?.filter((e: any) => e.is_featured).length || 0,
        discussions: discussionsData.discussions?.length || 0,
        pendingDiscussions: discussionsData.pending?.length || 0,
        subscribers: newsletterData.subscribers?.length || 0
      });
      
      setRecentEvents(eventsData.events?.slice(0, 5) || []);
      setRecentDiscussions(discussionsData.discussions?.slice(0, 5) || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoggingIn(true);

    // Simple password check
    setTimeout(() => {
      if (password === 'admin123') {
        localStorage.setItem('admin_token', 'authenticated');
        setIsAuthenticated(true);
        fetchDashboardData();
      } else {
        setError('Invalid password. Try "admin123" for demo.');
      }
      setIsLoggingIn(false);
    }, 500);
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    setIsAuthenticated(false);
    setPassword('');
  };

  // If not authenticated, show login form
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-red-100">
              <Lock className="h-6 w-6 text-red-600" />
            </div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Admin Access Required
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Enter the admin password to continue
            </p>
          </div>
          
          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm"
                placeholder="Enter admin password"
              />
            </div>

            {error && (
              <div className="text-red-600 text-sm text-center">
                {error}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isLoggingIn}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
              >
                {isLoggingIn ? 'Signing in...' : 'Sign in to Admin Panel'}
              </button>
            </div>
            
            <div className="text-center text-sm text-gray-500">
              <p>Demo password: <code className="bg-gray-100 px-2 py-1 rounded">admin123</code></p>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Dashboard content (shown after login)
  return (
    <div className="space-y-6">
      {/* Dashboard Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening with your community.</p>
        </div>
        <button
          onClick={handleLogout}
          className="text-sm text-gray-600 hover:text-red-600"
        >
          Logout
        </button>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard data...</p>
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center">
                <div className="p-3 bg-red-100 rounded-lg">
                  <Calendar className="w-6 h-6 text-red-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Total Events</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalEvents}</p>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center text-sm">
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-green-600">Active</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <MessageSquare className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Discussions</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.discussions}</p>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center text-sm">
                  <span className="text-yellow-600 font-medium">
                    {stats.pendingDiscussions} pending
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Subscribers</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.subscribers}</p>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center text-sm">
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-green-600">Growing</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Calendar className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Featured Events</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.featuredEvents}</p>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center text-sm">
                  <span className="text-gray-600">Highlighted</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Recent Events */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Events</h2>
              <div className="space-y-4">
                {recentEvents.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No events yet</p>
                ) : (
                  recentEvents.map((event: any) => (
                    <div key={event.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{event.title_en}</p>
                        <p className="text-sm text-gray-600">
                          {new Date(event.date).toLocaleDateString()} • {event.city}
                        </p>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${event.is_featured ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>
                        {event.is_featured ? 'Featured' : 'Regular'}
                      </span>
                    </div>
                  ))
                )}
              </div>
              <div className="mt-4 pt-4 border-t">
                <a href="/admin/events" className="text-red-600 hover:text-red-700 font-medium">
                  View all events →
                </a>
              </div>
            </div>

            {/* Recent Discussions */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Discussions</h2>
              <div className="space-y-4">
                {recentDiscussions.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No discussions yet</p>
                ) : (
                  recentDiscussions.map((discussion: any) => (
                    <div key={discussion.id} className="p-3 hover:bg-gray-50 rounded-lg">
                      <p className="font-medium text-gray-900">{discussion.name}</p>
                      <p className="text-sm text-gray-600 line-clamp-2">{discussion.comment}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(discussion.created_at).toLocaleDateString()} • {discussion.city}
                      </p>
                    </div>
                  ))
                )}
              </div>
              <div className="mt-4 pt-4 border-t">
                <a href="/admin/discussions" className="text-red-600 hover:text-red-700 font-medium">
                  Manage discussions →
                </a>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <a
                href="/admin/events/new"
                className="bg-red-50 text-red-700 p-4 rounded-lg text-center hover:bg-red-100 transition-colors"
              >
                <Calendar className="w-6 h-6 mx-auto mb-2" />
                <span className="font-medium">Add New Event</span>
              </a>
              
              <a
                href="/admin/discussions"
                className="bg-blue-50 text-blue-700 p-4 rounded-lg text-center hover:bg-blue-100 transition-colors"
              >
                <MessageSquare className="w-6 h-6 mx-auto mb-2" />
                <span className="font-medium">Moderate Comments</span>
              </a>
              
              <a
                href="/admin/newsletter"
                className="bg-green-50 text-green-700 p-4 rounded-lg text-center hover:bg-green-100 transition-colors"
              >
                <Users className="w-6 h-6 mx-auto mb-2" />
                <span className="font-medium">View Subscribers</span>
              </a>
              
              <a
                href="/"
                target="_blank"
                className="bg-gray-50 text-gray-700 p-4 rounded-lg text-center hover:bg-gray-100 transition-colors"
              >
                <span className="font-medium">Visit Site</span>
              </a>
            </div>
          </div>
        </>
      )}
    </div>
  );
}