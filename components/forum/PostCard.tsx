'use client';

import { useState } from 'react';
import { ForumPost, User, Forum } from '@/lib/mockData';
import { ArrowUp, ArrowDown, MessageCircle, Share, Bookmark, MoreHorizontal } from 'lucide-react';
import Link from 'next/link';

interface PostCardProps {
  post: ForumPost;
  user?: User;
  forum?: Forum;
}

export default function PostCard({ post, user, forum }: PostCardProps) {
  const [userVote, setUserVote] = useState<'up' | 'down' | null>(null);
  const [localUpvotes, setLocalUpvotes] = useState(post.upvotes);
  const [localDownvotes, setLocalDownvotes] = useState(post.downvotes);

  const handleVote = (voteType: 'up' | 'down') => {
    if (userVote === voteType) {
      // Remove vote
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
    
    if (diffInHours < 1) return 'just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    const diffInWeeks = Math.floor(diffInDays / 7);
    return `${diffInWeeks}w ago`;
  };

  const netScore = localUpvotes - localDownvotes;

  return (
    <div className="bg-card border border-border rounded-lg hover:border-accent-foreground/20 transition-colors">
      <div className="flex">
        {/* Vote Section */}
        <div className="flex flex-col items-center p-3 bg-muted/30 rounded-l-lg">
          <button
            onClick={() => handleVote('up')}
            className={`p-1 rounded transition-colors ${
              userVote === 'up'
                ? 'text-orange-500 bg-orange-100 dark:bg-orange-900/30'
                : 'text-muted-foreground hover:text-orange-500 hover:bg-orange-100 dark:hover:bg-orange-900/30'
            }`}
          >
            <ArrowUp className="w-5 h-5" />
          </button>
          <span className={`text-sm font-semibold py-1 ${
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
            <ArrowDown className="w-5 h-5" />
          </button>
        </div>

        {/* Content Section */}
        <div className="flex-1 p-4">
          {/* Post Header */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            {forum && (
              <>
                <div className={`w-3 h-3 rounded-full ${forum.color}`} />
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
            <span>{formatTimeAgo(post.datePost)}</span>
          </div>

          {/* Post Title */}
          <Link href={`/forum/post/${post.id}`}>
            <h2 className="text-lg font-semibold text-foreground hover:text-primary transition-colors mb-2 cursor-pointer">
              {post.title}
            </h2>
          </Link>

          {/* Post Description */}
          <p className="text-foreground mb-4 line-clamp-3">
            {post.description}
          </p>

          {/* Post Actions */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <Link 
              href={`/forum/post/${post.id}`}
              className="flex items-center gap-1 hover:text-foreground transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{post.commentCount} comments</span>
            </Link>
            <button className="flex items-center gap-1 hover:text-foreground transition-colors">
              <Share className="w-4 h-4" />
              <span>Share</span>
            </button>
            <button className="flex items-center gap-1 hover:text-foreground transition-colors">
              <Bookmark className="w-4 h-4" />
              <span>Save</span>
            </button>
            <button className="flex items-center gap-1 hover:text-foreground transition-colors ml-auto">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
