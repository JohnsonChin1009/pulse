'use client';

import { useState } from 'react';
import ForumHeader from '@/components/forum/ForumHeader';
import ForumSidebar from '@/components/forum/ForumSidebar';
import PostList from '@/components/forum/PostList';
import CreatePost from '@/components/forum/CreatePost';
import { useForums, usePosts } from '@/lib/hooks/useForum';
import { Plus } from 'lucide-react';

export default function ForumPage() {
  const [selectedForum, setSelectedForum] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'hot' | 'new' | 'top'>('hot');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showCreatePost, setShowCreatePost] = useState(false);

  // Fetch real data from database
  const { forums, loading: forumsLoading, error: forumsError, refetch: refetchForums } = useForums();
  const { posts, loading: postsLoading, error: postsError, refetch: refetchPosts } = usePosts(
    selectedForum === 'all' ? undefined : parseInt(selectedForum)
  );

  // Handle loading states
  if (forumsLoading || postsLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading forum data...</p>
        </div>
      </div>
    );
  }

  // Handle error states
  if (forumsError || postsError) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">Error loading forum data:</p>
          <p className="text-muted-foreground">{forumsError || postsError}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Transform database forums to match the expected format
  const transformedForums = forums.map(forum => ({
    id: forum.id.toString(),
    name: forum.topic,
    description: forum.description || '',
    color: getForumColor(forum.topic), // Helper function to assign colors
    memberCount: forum.popular_rank || 0
  }));

  // Transform database posts to match the expected format
  const transformedPosts = posts.map(post => ({
    id: post.id.toString(),
    title: post.title,
    description: post.description,
    datePost: post.date_posted ? new Date(post.date_posted as any).toISOString() : new Date().toISOString(),
    upvotes: post.upvotes || 0,
    downvotes: post.downvotes || 0,
    forumId: post.forum_id,
    userId: post.user_id,
    commentCount: post.comment_count || 0,
    username: post.username || 'Anonymous',
    userAvatar: post.user_profile_picture,
    forumName: post.forum_topic || 'Unknown Forum'
  }));

  // Create mock users array from posts (for compatibility)
  const users = Array.from(new Set(posts.map(post => post.user_id)))
    .map(userId => {
      const post = posts.find(p => p.user_id === userId);
      return {
        id: userId,
        username: post?.username || 'Anonymous',
        avatar: post?.user_profile_picture,
        karma: Math.floor(Math.random() * 2000) // Placeholder karma
      };
    });

  const sortedPosts = [...transformedPosts].sort((a, b) => {
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

  const handlePostCreated = () => {
    console.log('Post created, closing modal and refreshing posts');
    setShowCreatePost(false);
    refetchPosts();
  };

  return (
    <div className="min-h-screen bg-background">
      <ForumHeader onMenuClick={() => setSidebarOpen(true)} />
      
      {/* Mobile Layout - Reddit Style */}
      <div className="sm:hidden">
        <ForumSidebar 
          selectedForum={selectedForum}
          onForumSelect={setSelectedForum}
          forums={transformedForums}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onForumCreated={refetchForums}
        />
        
        {/* Mobile Sort Bar with Create Post Button */}
        <div className="bg-card border-b border-border px-3 py-2">
          <div className="flex items-center justify-between mb-2">
            <div className="flex gap-1 overflow-x-auto">
              {(['hot', 'new', 'top'] as const).map((sort) => (
                <button
                  key={sort}
                  onClick={() => setSortBy(sort)}
                  className={`px-3 py-1 rounded-full text-sm capitalize transition-colors whitespace-nowrap ${
                    sortBy === sort
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                  }`}
                >
                  {sort}
                </button>
              ))}
            </div>
            <CreatePost 
              forums={transformedForums}
              selectedForumId={selectedForum !== 'all' ? selectedForum : undefined}
              onPostCreated={refetchPosts}
            />
          </div>
        </div>
        

        {/* Mobile Post List */}
        <div className="bg-background">
          <PostList 
            posts={sortedPosts}
          />
        </div>
      </div>

      {/* Desktop Layout - Original */}
      <div className="hidden sm:flex max-w-7xl mx-auto relative">
        <ForumSidebar 
          selectedForum={selectedForum}
          onForumSelect={setSelectedForum}
          forums={transformedForums}
          isOpen={true}
          onClose={() => {}}
          onForumCreated={refetchForums}
        />
        
        <main className="flex-1 p-4">
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
              <h1 className="text-xl sm:text-2xl font-bold text-foreground">
                {selectedForum === 'all' ? 'All Posts' : transformedForums.find(f => f.id === selectedForum)?.name}
              </h1>
              
              <div className="flex items-center gap-3">
                <CreatePost 
                  forums={transformedForums}
                  selectedForumId={selectedForum !== 'all' ? selectedForum : undefined}
                  onPostCreated={refetchPosts}
                />
                
                <div className="flex gap-2 overflow-x-auto">
                  {(['hot', 'new', 'top'] as const).map((sort) => (
                    <button
                      key={sort}
                      onClick={() => setSortBy(sort)}
                      className={`px-3 sm:px-4 py-2 rounded-lg capitalize transition-colors whitespace-nowrap ${
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
          </div>
          <PostList 
            posts={sortedPosts}
          />
        </main>
      </div>

      {/* Create Post Modal */}
      {showCreatePost && (
        <>
          {console.log('Rendering CreatePost modal with showCreatePost:', showCreatePost)}
          <CreatePost
            forums={transformedForums}
            selectedForumId={selectedForum !== 'all' ? selectedForum : undefined}
            onPostCreated={handlePostCreated}
          />
        </>
      )}
    </div>
  );
}

// Helper function to assign colors to forums based on topic
function getForumColor(topic: string): string {
  const colors = [
    'bg-purple-500',
    'bg-red-500', 
    'bg-green-500',
    'bg-blue-500',
    'bg-yellow-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-orange-500'
  ];
  
  // Simple hash function to consistently assign colors
  let hash = 0;
  for (let i = 0; i < topic.length; i++) {
    hash = topic.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  return colors[Math.abs(hash) % colors.length];
}
