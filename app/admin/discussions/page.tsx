'use client';

import { useState, useEffect } from 'react';
import { Check, X, Trash2, MessageSquare } from 'lucide-react';

export default function AdminDiscussionsPage() {
  const [discussions, setDiscussions] = useState<any[]>([]);
  const [pendingDiscussions, setPendingDiscussions] = useState<any[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('pending');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDiscussions();
  }, []);

  const fetchDiscussions = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/discussions');
      const data = await response.json();
      
      if (response.ok) {
        setDiscussions(data.discussions || []);
        setPendingDiscussions(data.pending || []);
      } else {
        console.error('Failed to fetch discussions:', data.error);
      }
    } catch (error) {
      console.error('Error fetching discussions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (id: number) => {
    try {
      const response = await fetch('/api/admin/discussions?action=approve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id })
      });

      const data = await response.json();
      
      if (response.ok && data.success) {
        // Update local state
        const updatedPending = pendingDiscussions.filter(d => d.id !== id);
        const approvedDiscussion = pendingDiscussions.find(d => d.id === id);
        
        if (approvedDiscussion) {
          approvedDiscussion.approved = true;
          setDiscussions([approvedDiscussion, ...discussions]);
        }
        
        setPendingDiscussions(updatedPending);
      } else {
        alert(data.error || 'Failed to approve comment');
      }
    } catch (error) {
      console.error('Error approving comment:', error);
      alert('Failed to approve comment');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) {
      return;
    }

    try {
      const response = await fetch('/api/admin/discussions?action=delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id })
      });

      const data = await response.json();
      
      if (response.ok && data.success) {
        // Update local state
        const updatedDiscussions = discussions.filter(d => d.id !== id);
        const updatedPending = pendingDiscussions.filter(d => d.id !== id);
        setDiscussions(updatedDiscussions);
        setPendingDiscussions(updatedPending);
      } else {
        alert(data.error || 'Failed to delete comment');
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
      alert('Failed to delete comment');
    }
  };

  const filteredDiscussions = filter === 'all' 
    ? discussions 
    : filter === 'pending' 
      ? pendingDiscussions 
      : discussions.filter(d => d.approved);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Discussion Moderation</h1>
          <p className="text-gray-600">Review and manage community comments</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">
            {pendingDiscussions.length} pending
          </span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex space-x-4 border-b border-gray-200">
          <button
            onClick={() => setFilter('pending')}
            className={`pb-4 px-1 border-b-2 font-medium text-sm ${filter === 'pending' ? 'border-red-600 text-red-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            <div className="flex items-center space-x-2">
              <span>Pending Review</span>
              {pendingDiscussions.length > 0 && (
                <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                  {pendingDiscussions.length}
                </span>
              )}
            </div>
          </button>
          
          <button
            onClick={() => setFilter('approved')}
            className={`pb-4 px-1 border-b-2 font-medium text-sm ${filter === 'approved' ? 'border-red-600 text-red-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            Approved
          </button>
          
          <button
            onClick={() => setFilter('all')}
            className={`pb-4 px-1 border-b-2 font-medium text-sm ${filter === 'all' ? 'border-red-600 text-red-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            All Comments
          </button>
        </div>
      </div>

      {/* Comments List */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading discussions...</p>
          </div>
        ) : filteredDiscussions.length === 0 ? (
          <div className="p-12 text-center">
            <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              {filter === 'pending' ? 'No comments pending review' : 'No comments found'}
            </h3>
            <p className="text-gray-500">
              {filter === 'pending' 
                ? 'All comments have been moderated. Check back later for new submissions.'
                : 'There are no comments to display with the current filter.'
              }
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredDiscussions.map((discussion) => (
              <div key={discussion.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                      <span className="font-medium text-gray-600">
                        {discussion.name?.charAt(0)?.toUpperCase() || '?'}
                      </span>
                    </div>
                    <div className="ml-4">
                      <h4 className="font-semibold text-gray-900">{discussion.name || 'Anonymous'}</h4>
                      <div className="flex items-center text-sm text-gray-500">
                        <span>{discussion.created_at ? new Date(discussion.created_at).toLocaleDateString() : 'Unknown date'}</span>
                        <span className="mx-2">•</span>
                        <span>{discussion.city || 'Unknown city'}</span>
                        {discussion.event_id && (
                          <>
                            <span className="mx-2">•</span>
                            <span className="text-blue-600">Event #{discussion.event_id}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {!discussion.approved && (
                      <>
                        <button
                          onClick={() => handleApprove(discussion.id)}
                          className="p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                          title="Approve"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(discussion.id)}
                          className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                          title="Reject"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => handleDelete(discussion.id)}
                      className="p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <p className="text-gray-700 whitespace-pre-line">{discussion.comment}</p>
                
                {!discussion.approved && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      Awaiting Approval
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}