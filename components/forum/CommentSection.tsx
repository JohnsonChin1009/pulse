'use client';

import { useState } from 'react';
import { ForumComment, User } from '@/lib/mockData';
import { ArrowUp, ArrowDown, MessageCircle, MoreHorizontal } from 'lucide-react';

interface CommentSectionProps {
  postId: string;
  comments: ForumComment[];
  users: User[];
}

interface CommentProps {
  comment: ForumComment;
  user?: User;
}

function Comment({ comment, user }: CommentProps) {
  const [userVote, setUserVote] = useState<'up' | 'down' | null>(null);
  const [localUpvotes, setLocalUpvotes] = useState(comment.upvotes);
  const [localDownvotes, setLocalDownvotes] = useState(comment.downvotes);
  const [showReply, setShowReply] = useState(false);

  const handleVote = (voteType: 'up' | 'down') => {
    if (userVote === voteType) {
      if (voteType === 'up') {
        setLocalUpvotes(prev => prev - 1);
      } else {
        setLocalDownvotes(prev => prev - 1);
      }
      setUserVote(null);
    } else {
      if (userVote === 'up') {
        setLocalUpvotes(prev => prev - 1);
      } else if (userVote === 'down') {
        setLocalDownvotes(prev => prev - 1);
      }

      if (voteType === 'up') {
        setLocalUpvotes(prev => prev + 1);
      } else {
        setLocalDownvotes(prev => prev + 1);
      }
      setUserVote(voteType);
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const commentDate = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - commentDate.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    const diffInWeeks = Math.floor(diffInDays / 7);
    return `${diffInWeeks}w ago`;
  };

  const netScore = localUpvotes - localDownvotes;

  return (
    <div className="border-l-2 border-border pl-4 py-3">
      <div className="flex items-start gap-3">
        {/* User Avatar */}
        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-semibold">
          {user?.username?.charAt(0).toUpperCase() || 'U'}
        </div>

        <div className="flex-1">
          {/* Comment Header */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <span className="font-medium text-foreground">
              u/{user?.username || 'Unknown'}
            </span>
            <span>•</span>
            <span>{formatTimeAgo(comment.datePost)}</span>
          </div>

          {/* Comment Content */}
          <div className="text-foreground mb-3">
            {comment.description}
          </div>

          {/* Comment Actions */}
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <button
                onClick={() => handleVote('up')}
                className={`p-1 rounded transition-colors ${
                  userVote === 'up'
                    ? 'text-orange-500 bg-orange-100 dark:bg-orange-900/30'
                    : 'text-muted-foreground hover:text-orange-500 hover:bg-orange-100 dark:hover:bg-orange-900/30'
                }`}
              >
                <ArrowUp className="w-4 h-4" />
              </button>
              <span className={`font-medium ${
                netScore > 0 ? 'text-orange-500' : netScore < 0 ? 'text-blue-500' : 'text-muted-foreground'
              }`}>
                {netScore}
              </span>
              <button
                onClick={() => handleVote('down')}
                className={`p-1 rounded transition-colors ${
                  userVote === 'down'
                    ? 'text-blue-500 bg-blue-100 dark:bg-blue-900/30'
                    : 'text-muted-foreground hover:text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900/30'
                }`}
              >
                <ArrowDown className="w-4 h-4" />
              </button>
            </div>

            <button 
              onClick={() => setShowReply(!showReply)}
              className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              Reply
            </button>

            <button className="text-muted-foreground hover:text-foreground transition-colors">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>

          {/* Reply Form */}
          {showReply && (
            <div className="mt-4 p-3 bg-muted rounded-lg">
              <textarea
                placeholder="Write a reply..."
                className="w-full p-3 bg-background border border-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                rows={3}
              />
              <div className="flex justify-end gap-2 mt-2">
                <button 
                  onClick={() => setShowReply(false)}
                  className="px-3 py-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Cancel
                </button>
                <button className="px-3 py-1 text-sm bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors">
                  Reply
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CommentSection({ postId, comments, users }: CommentSectionProps) {
  const [newComment, setNewComment] = useState('');

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      // Here you would typically submit to your backend
      console.log('Submitting comment:', newComment);
      setNewComment('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Comment Form */}
      <div className="bg-card border border-border rounded-lg p-4">
        <h3 className="text-lg font-semibold text-foreground mb-4">Add a comment</h3>
        <form onSubmit={handleSubmitComment}>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="What are your thoughts?"
            className="w-full p-3 bg-background border border-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-ring"
            rows={4}
          />
          <div className="flex justify-end mt-3">
            <button
              type="submit"
              disabled={!newComment.trim()}
              className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Comment
            </button>
          </div>
        </form>
      </div>

      {/* Comments List */}
      <div className="bg-card border border-border rounded-lg">
        <div className="p-4 border-b border-border">
          <h3 className="text-lg font-semibold text-foreground">
            Comments ({comments.length})
          </h3>
        </div>
        
        {comments.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No comments yet. Be the first to share your thoughts!</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {comments.map((comment) => {
              const user = users.find(u => u.id === comment.userId);
              return (
                <div key={comment.id} className="p-4">
                  <Comment comment={comment} user={user} />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
