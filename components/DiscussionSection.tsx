'use client';

import { useState } from 'react';
import { MessageSquare, Send, User, Clock } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface DiscussionSectionProps {
  eventId: number;
  discussions: Array<{
    id: number;
    name: string;
    comment: string;
    created_at: string;
  }>;
}

export default function DiscussionSection({ eventId, discussions }: DiscussionSectionProps) {
  const { language } = useLanguage();
  const [comment, setComment] = useState('');
  const [name, setName] = useState('');
  const [submittedComments, setSubmittedComments] = useState(discussions);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !comment.trim()) {
      alert('Please enter your name and comment');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/discussions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          comment,
          event_id: eventId,
          city: 'general' // You might want to get this from event data
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Add the new comment to the list (pending approval)
        const newComment = {
          id: Date.now(), // Temporary ID
          name,
          comment,
          created_at: new Date().toISOString(),
          approved: false
        };
        setSubmittedComments([newComment, ...submittedComments]);
        setComment('');
        setName('');
        alert('Thank you for your comment! It will be visible after moderation.');
      } else {
        alert(data.error || 'Failed to submit comment');
      }
    } catch (error) {
      console.error('Error submitting comment:', error);
      alert('Failed to submit comment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
          <MessageSquare className="w-6 h-6 mr-2 text-red-600" />
          Discussions
          <span className="ml-2 text-gray-500 text-lg">({submittedComments.length})</span>
        </h2>
      </div>

      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Your Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="Enter your name"
              required
            />
          </div>
          
          <div>
            <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
              Your Comment
            </label>
            <textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="Share your thoughts about this event..."
              required
            />
          </div>
          
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary flex items-center space-x-2 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? 'Submitting...' : 'Post Comment'}</span>
            </button>
          </div>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-6">
        {submittedComments.length === 0 ? (
          <div className="text-center py-8">
            <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No comments yet. Be the first to share your thoughts!</p>
          </div>
        ) : (
          submittedComments.map((discussion) => (
            <div key={discussion.id} className="border-b border-gray-100 pb-6 last:border-0">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
                    <User className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{discussion.name}</h4>
                    <p className="text-sm text-gray-500 flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {new Date(discussion.created_at).toLocaleDateString('en-CA', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
                {!discussion.approved && (
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">
                    Awaiting Approval
                  </span>
                )}
              </div>
              <p className="text-gray-700 pl-13">{discussion.comment}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}