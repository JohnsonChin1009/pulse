'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import ForumHeader from '@/components/forum/ForumHeader';
import { forumAPI } from '@/lib/hooks/useForum';
import { ArrowUp, ArrowDown, MessageCircle, Share, Bookmark, ArrowLeft } from 'lucide-react';
import CommentSection from '@/components/forum/CommentSection';

interface PostData {
  id: number;
  title: string;
  description: string;
  date_posted: Date | null;
  upvotes: number | null;
  downvotes: number | null;
  forum_id: number;
  user_id: string;
}

export default function PostDetailPage() {
  const params = useParams();
  const postId = params.postId as string;
  
  const [post, setPost] = useState<PostData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userVote, setUserVote] = useState<'up' | 'down' | null>(null);
  const [localUpvotes, setLocalUpvotes] = useState(0);
  const [localDownvotes, setLocalDownvotes] = useState(0);
  const [isVoting, setIsVoting] = useState(false);

  useEffect(() => {
    async function fetchPost() {
      try {
        const response = await fetch(`/api/posts/${postId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch post');
        }
        const data = await response.json();
        setPost(data);
        setLocalUpvotes(data.upvotes || 0);
        setLocalDownvotes(data.downvotes || 0);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    if (postId) {
      fetchPost();
    }
  }, [postId]);

  const handleVote = async (voteType: 'up' | 'down') => {
    if (isVoting || !post) return;
    
    setIsVoting(true);
    
    try {
      if (userVote === voteType) {
        // Remove vote - for now just update locally
        if (voteType === 'up') {
          setLocalUpvotes(prev => prev - 1);
        } else {
          setLocalDownvotes(prev => prev - 1);
        }
        setUserVote(null);
      } else {
        // Add new vote, remove old if exists
        if (userVote === 'up') {
          setLocalUpvotes(prev => prev - 1);
        } else if (userVote === 'down') {
          setLocalDownvotes(prev => prev - 1);
        }

        // Call the API
        const voteAction = voteType === 'up' ? 'upvote' : 'downvote';
        await forumAPI.votePost(post.id, voteAction);

        if (voteType === 'up') {
          setLocalUpvotes(prev => prev + 1);
        } else {
          setLocalDownvotes(prev => prev + 1);
        }
        setUserVote(voteType);
      }
    } catch (error) {
      console.error('Error voting:', error);
    } finally {
      setIsVoting(false);
    }
  };

  const formatTimeAgo = (dateString: string | Date | null) => {
    if (!dateString) return 'now';
    
    const now = new Date();
    const postDate = new Date(dateString);
    const diffInHours = Math.floor(
      (now.getTime() - postDate.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return 'now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    const diffInWeeks = Math.floor(diffInDays / 7);
    return `${diffInWeeks}w ago`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <ForumHeader onMenuClick={() => {}} />
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-background">
        <ForumHeader onMenuClick={() => {}} />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <p className="text-red-500 mb-4">Error: {error || 'Post not found'}</p>
            <Link 
              href="/forum"
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
            >
              Back to Forum
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const netScore = localUpvotes - localDownvotes;

  return (
    <div className="min-h-screen bg-background">
      <ForumHeader onMenuClick={() => {}} />
      
      <div className="max-w-4xl mx-auto p-4">
        {/* Back Button */}
        <Link 
          href="/forum"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Forum
        </Link>

        {/* Post Content */}
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="flex">
            {/* Vote Section */}
            <div className="flex flex-col items-center p-4 bg-muted/30">
              <button
                onClick={() => handleVote('up')}
                disabled={isVoting}
                className={`p-2 rounded transition-colors ${
                  userVote === 'up'
                    ? 'text-orange-500 bg-orange-100 dark:bg-orange-900/30'
                    : 'text-muted-foreground hover:text-orange-500 hover:bg-orange-100 dark:hover:bg-orange-900/30'
                } ${isVoting ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <ArrowUp className="w-6 h-6" />
              </button>
              <span
                className={`text-lg font-bold py-2 ${
                  netScore > 0
                    ? 'text-orange-500'
                    : netScore < 0
                    ? 'text-blue-500'
                    : 'text-muted-foreground'
                }`}
              >
                {netScore}
              </span>
              <button
                onClick={() => handleVote('down')}
                disabled={isVoting}
                className={`p-2 rounded transition-colors ${
                  userVote === 'down'
                    ? 'text-blue-500 bg-blue-100 dark:bg-blue-900/30'
                    : 'text-muted-foreground hover:text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900/30'
                } ${isVoting ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <ArrowDown className="w-6 h-6" />
              </button>
            </div>

            {/* Content Section */}
            <div className="flex-1 p-6">
              {/* Post Header */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                <span>Posted {formatTimeAgo(post.date_posted)}</span>
              </div>

              {/* Post Title */}
              <h1 className="text-2xl font-bold text-foreground mb-4">
                {post.title}
              </h1>

              {/* Post Description */}
              <div className="text-foreground mb-6 whitespace-pre-wrap">
                {post.description}
              </div>

              {/* Post Actions */}
              <div className="flex items-center gap-6 text-sm text-muted-foreground border-t border-border pt-4">
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  <span>Comments</span>
                </div>
                <button className="flex items-center gap-2 hover:text-foreground transition-colors">
                  <Share className="w-4 h-4" />
                  <span>Share</span>
                </button>
                <button className="flex items-center gap-2 hover:text-foreground transition-colors">
                  <Bookmark className="w-4 h-4" />
                  <span>Save</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="mt-6 bg-card border border-border rounded-lg p-6">
          <CommentSection postId={postId} />
        </div>
      </div>
    </div>
  );
}
