'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import ForumHeader from '@/components/forum/ForumHeader';
import { mockPosts, mockUsers, mockForums, mockComments } from '@/lib/mockData';
import { ArrowUp, ArrowDown, MessageCircle, Share, Bookmark, ArrowLeft } from 'lucide-react';
import CommentSection from '@/components/forum/CommentSection';

export default function PostDetailPage() {
  const params = useParams();
  const postId = params.postId as string;
  
  const [userVote, setUserVote] = useState<'up' | 'down' | null>(null);
  
  const post = mockPosts.find(p => p.id === postId);
  const user = post ? mockUsers.find(u => u.id === post.userId) : null;
  const forum = post ? mockForums.find(f => f.id === post.forumId) : null;
  const comments = mockComments.filter(c => c.forumPostId === postId);

  const [localUpvotes, setLocalUpvotes] = useState(post?.upvotes || 0);
  const [localDownvotes, setLocalDownvotes] = useState(post?.downvotes || 0);

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
    const postDate = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - postDate.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'now';
    if (diffInHours < 24) return `${diffInHours}h`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d`;
    const diffInWeeks = Math.floor(diffInDays / 7);
    return `${diffInWeeks}w`;
  };

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <ForumHeader />
        <div className="max-w-4xl mx-auto p-4">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-foreground mb-2">Post Not Found</h1>
            <p className="text-muted-foreground">The post you're looking for doesn't exist.</p>
            <Link 
              href="/forum"
              className="inline-flex items-center gap-2 mt-4 text-primary hover:underline"
            >
              <ArrowLeft className="w-4 h-4" />
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
      <ForumHeader />
      
      {/* Mobile Layout - Reddit Style */}
      <div className="sm:hidden">
        {/* Mobile Back Button */}
        <div className="bg-card border-b border-border px-3 py-2">
          <Link 
            href="/forum"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
        </div>

        {/* Mobile Post Content */}
        <div className="bg-card border-b border-border">
          <div className="p-3">
            {/* Post Header */}
            <div className="flex items-center text-xs text-muted-foreground mb-2 overflow-hidden">
              <div className="flex items-center gap-1 flex-shrink-0">
                {forum && (
                  <>
                    <div className={`w-2 h-2 rounded-full ${forum.color}`} />
                    <Link 
                      href={`/forum/${forum.id}`}
                      className="font-medium hover:text-foreground transition-colors"
                    >
                      r/{forum.name}
                    </Link>
                    <span>•</span>
                  </>
                )}
              </div>
              <div className="flex items-center gap-1 min-w-0 flex-1">
                <span className="truncate">u/{user?.username || 'Unknown'}</span>
                <span className="flex-shrink-0">•</span>
                <span className="flex-shrink-0">{formatTimeAgo(post.datePost)}</span>
              </div>
            </div>

            {/* Post Title */}
            <h1 className="text-base font-semibold text-foreground mb-3">
              {post.title}
            </h1>

            {/* Post Description */}
            <div className="text-sm text-foreground mb-3">
              {post.description}
            </div>

            {/* Mobile Action Bar */}
            <div className="flex items-center justify-between pt-2 border-t border-border">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleVote('up')}
                    className={`p-1 rounded ${
                      userVote === 'up'
                        ? 'text-orange-500'
                        : 'text-muted-foreground hover:text-orange-500'
                    }`}
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <span className={`text-xs font-medium ${
                    netScore > 0 ? 'text-orange-500' : netScore < 0 ? 'text-blue-500' : 'text-muted-foreground'
                  }`}>
                    {Math.abs(netScore) > 999 ? `${(Math.abs(netScore) / 1000).toFixed(1)}k` : Math.abs(netScore)}
                  </span>
                  <button
                    onClick={() => handleVote('down')}
                    className={`p-1 rounded ${
                      userVote === 'down'
                        ? 'text-blue-500'
                        : 'text-muted-foreground hover:text-blue-500'
                    }`}
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center gap-1 text-muted-foreground">
                  <MessageCircle className="w-4 h-4" />
                  <span className="text-xs">{post.commentCount}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button className="p-1 text-muted-foreground hover:text-foreground transition-colors">
                  <Share className="w-4 h-4" />
                </button>
                <button className="p-1 text-muted-foreground hover:text-foreground transition-colors">
                  <Bookmark className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Comments */}
        <div className="p-3">
          <CommentSection 
            postId={postId}
            comments={comments}
            users={mockUsers}
          />
        </div>
      </div>

      {/* Desktop Layout - Original */}
      <div className="hidden sm:block">
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
          <div className="bg-card border border-border rounded-lg mb-6">
            <div className="flex">
              {/* Vote Section */}
              <div className="flex flex-col items-center p-4 bg-muted/30 rounded-l-lg">
                <button
                  onClick={() => handleVote('up')}
                  className={`p-2 rounded transition-colors ${
                    userVote === 'up'
                      ? 'text-orange-500 bg-orange-100 dark:bg-orange-900/30'
                      : 'text-muted-foreground hover:text-orange-500 hover:bg-orange-100 dark:hover:bg-orange-900/30'
                  }`}
                >
                  <ArrowUp className="w-6 h-6" />
                </button>
                <span className={`text-lg font-bold py-2 ${
                  netScore > 0 ? 'text-orange-500' : netScore < 0 ? 'text-blue-500' : 'text-muted-foreground'
                }`}>
                  {netScore}
                </span>
                <button
                  onClick={() => handleVote('down')}
                  className={`p-2 rounded transition-colors ${
                    userVote === 'down'
                      ? 'text-blue-500 bg-blue-100 dark:bg-blue-900/30'
                      : 'text-muted-foreground hover:text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900/30'
                  }`}
                >
                  <ArrowDown className="w-6 h-6" />
                </button>
              </div>

              {/* Content Section */}
              <div className="flex-1 p-6">
                {/* Post Header */}
                <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mb-4">
                  {forum && (
                    <>
                      <div className={`w-4 h-4 rounded-full ${forum.color}`} />
                      <Link 
                        href={`/forum/${forum.id}`}
                        className="font-medium hover:text-foreground transition-colors"
                      >
                        r/{forum.name}
                      </Link>
                      <span>•</span>
                    </>
                  )}
                  <span>Posted by</span>
                  <Link 
                    href={`/user/${user?.username}`}
                    className="hover:text-foreground transition-colors"
                  >
                    u/{user?.username || 'Unknown'}
                  </Link>
                  <span>•</span>
                  <span>{formatTimeAgo(post.datePost)} ago</span>
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
                <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground border-t border-border pt-4">
                  <div className="flex items-center gap-1">
                    <MessageCircle className="w-4 h-4" />
                    <span>{post.commentCount} comments</span>
                  </div>
                  <button className="flex items-center gap-1 hover:text-foreground transition-colors">
                    <Share className="w-4 h-4" />
                    <span>Share</span>
                  </button>
                  <button className="flex items-center gap-1 hover:text-foreground transition-colors">
                    <Bookmark className="w-4 h-4" />
                    <span>Save</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Comments Section */}
          <CommentSection 
            postId={postId}
            comments={comments}
            users={mockUsers}
          />
        </div>
      </div>
    </div>
  );
}
