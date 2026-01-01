import Analytics from '../../components/Analytics';
import { ChartBar, TrendingUp } from 'lucide-react';

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center space-x-4 mb-6">
            <ChartBar className="w-12 h-12" />
            <TrendingUp className="w-12 h-12" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">
            Community Analytics
          </h1>
          <p className="text-xl text-center opacity-90">
            Track engagement, growth, and community impact across Canadian cities
          </p>
        </div>
      </div>

      {/* Analytics Dashboard */}
      <Analytics />

      {/* Insights Section */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Key Insights</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-4 border-l-4 border-blue-500 bg-blue-50 rounded-r-lg">
            <h3 className="font-semibold text-gray-900 mb-2">Peak Engagement Times</h3>
            <p className="text-gray-600 text-sm">
              Most active users visit between 6-9 PM on weekdays and 10 AM-2 PM on weekends.
            </p>
          </div>
          
          <div className="p-4 border-l-4 border-green-500 bg-green-50 rounded-r-lg">
            <h3 className="font-semibold text-gray-900 mb-2">City Performance</h3>
            <p className="text-gray-600 text-sm">
              Toronto leads in total engagement, while Montreal has the highest growth rate at 18% monthly.
            </p>
          </div>
          
          <div className="p-4 border-l-4 border-purple-500 bg-purple-50 rounded-r-lg">
            <h3 className="font-semibold text-gray-900 mb-2">Content Trends</h3>
            <p className="text-gray-600 text-sm">
              Community and arts events receive 40% more engagement than other categories.
            </p>
          </div>
        </div>
      </div>

      {/* Data Export */}
      <div className="bg-gray-50 rounded-xl p-6 text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Export Analytics Data</h3>
        <p className="text-gray-600 mb-4">
          Download detailed analytics reports for further analysis
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <button className="btn-primary">
            Export as CSV
          </button>
          <button className="btn-secondary">
            Generate PDF Report
          </button>
          <button className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300">
            View Raw Data
          </button>
        </div>
      </div>
    </div>
  );
}