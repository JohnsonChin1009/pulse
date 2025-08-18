'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import ForumHeader from '@/components/forum/ForumHeader';
import ForumSidebar from '@/components/forum/ForumSidebar';
import PostList from '@/components/forum/PostList';
import { mockPosts, mockUsers, mockForums } from '@/lib/mockData';
import { Users, Plus } from 'lucide-react';

export default function ForumPage() {
  const params = useParams();
  const forumId = params.forumId as string;
  const [sortBy, setSortBy] = useState<'hot' | 'new' | 'top'>('hot');

  const currentForum = mockForums.find(f => f.id === forumId);
  const forumPosts = mockPosts.filter(post => post.forumId === forumId);

  const sortedPosts = [...forumPosts].sort((a, b) => {
    switch (sortBy) {
      case 'new':
        return new Date(b.datePost).getTime() - new Date(a.datePost).getTime();
      case 'top':
        return (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes);
      case 'hot':
      default:
        const aScore = (a.upvotes - a.downvotes) / Math.max(1, Math.floor((Date.now() - new Date(a.datePost).getTime()) / (1000 * 60 * 60)));
        const bScore = (b.upvotes - b.downvotes) / Math.max(1, Math.floor((Date.now() - new Date(b.datePost).getTime()) / (1000 * 60 * 60)));
        return bScore - aScore;
    }
  });

  if (!currentForum) {
    return (
      <div className="min-h-screen bg-background">
        <ForumHeader />
        <div className="flex max-w-7xl mx-auto">
          <ForumSidebar 
            selectedForum={forumId}
            onForumSelect={() => {}}
            forums={mockForums}
          />
          <main className="flex-1 p-4">
            <div className="text-center py-12">
              <h1 className="text-2xl font-bold text-foreground mb-2">Forum Not Found</h1>
              <p className="text-muted-foreground">The forum you're looking for doesn't exist.</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <ForumHeader />
      <div className="flex max-w-7xl mx-auto">
        <ForumSidebar 
          selectedForum={forumId}
          onForumSelect={() => {}}
          forums={mockForums}
        />
        <main className="flex-1 p-4">
          {/* Forum Header */}
          <div className="bg-card border border-border rounded-lg p-6 mb-6">
            <div className="flex items-center gap-4 mb-4">
              <div className={`w-16 h-16 rounded-full ${currentForum.color} flex items-center justify-center text-white text-2xl font-bold`}>
                {currentForum.name.charAt(0)}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">r/{currentForum.name}</h1>
                <p className="text-muted-foreground mt-1">{currentForum.description}</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{currentForum.memberCount.toLocaleString()} members</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span>Active community</span>
                </div>
              </div>
              
              <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                <Plus className="w-4 h-4" />
                Create Post
              </button>
            </div>
          </div>

          {/* Sort Options */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex gap-2">
              {(['hot', 'new', 'top'] as const).map((sort) => (
                <button
                  key={sort}
                  onClick={() => setSortBy(sort)}
                  className={`px-4 py-2 rounded-lg capitalize transition-colors ${
                    sortBy === sort
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-accent'
                  }`}
                >
                  {sort}
                </button>
              ))}
            </div>
            <div className="text-sm text-muted-foreground">
              {sortedPosts.length} posts
            </div>
          </div>

          <PostList 
            posts={sortedPosts}
            users={mockUsers}
            forums={mockForums}
          />
        </main>
      </div>
    </div>
  );
}
