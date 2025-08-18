'use client';

import { useState } from 'react';
import ForumHeader from '@/components/forum/ForumHeader';
import ForumSidebar from '@/components/forum/ForumSidebar';
import PostList from '@/components/forum/PostList';
import { mockPosts, mockUsers, mockForums } from '@/lib/mockData';

export default function ForumPage() {
  const [selectedForum, setSelectedForum] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'hot' | 'new' | 'top'>('hot');

  const filteredPosts = selectedForum === 'all' 
    ? mockPosts 
    : mockPosts.filter(post => post.forumId === selectedForum);

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    switch (sortBy) {
      case 'new':
        return new Date(b.datePost).getTime() - new Date(a.datePost).getTime();
      case 'top':
        return (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes);
      case 'hot':
      default:
        // Simple hot algorithm: combine votes and recency
        const aScore = (a.upvotes - a.downvotes) / Math.max(1, Math.floor((Date.now() - new Date(a.datePost).getTime()) / (1000 * 60 * 60)));
        const bScore = (b.upvotes - b.downvotes) / Math.max(1, Math.floor((Date.now() - new Date(b.datePost).getTime()) / (1000 * 60 * 60)));
        return bScore - aScore;
    }
  });

  return (
    <div className="min-h-screen bg-background">
      <ForumHeader />
      <div className="flex max-w-7xl mx-auto">
        <ForumSidebar 
          selectedForum={selectedForum}
          onForumSelect={setSelectedForum}
          forums={mockForums}
        />
        <main className="flex-1 p-4">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold text-foreground">
                {selectedForum === 'all' ? 'All Posts' : mockForums.find(f => f.id === selectedForum)?.name}
              </h1>
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
