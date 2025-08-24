'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ForumHeader from '@/components/forum/ForumHeader';
import ForumSidebar from '@/components/forum/ForumSidebar';
import PostList from '@/components/forum/PostList';
import CreatePost from '@/components/forum/CreatePost';
import { Users, Plus, Menu } from 'lucide-react';

// Types for real data from database
interface Forum {
  id: number;
  topic: string;
  description: string | null;
  popular_rank: number | null;
  user_id: string;
  created_at: string | null;
}

interface Post {
  id: number;
  title: string;
  description: string;
  date_posted: string | null;
  upvotes: number | null;
  downvotes: number | null;
  forum_id: number;
  user_id: string;
  username: string | null;
  user_profile_picture: string | null;
  forum_topic: string | null;
  comment_count: number;
}

export default function ForumPage() {
  const params = useParams();
  const router = useRouter();
  const forumId = params.forumId as string;
  const [sortBy, setSortBy] = useState<'hot' | 'new' | 'top'>('hot');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showCreatePost, setShowCreatePost] = useState(false);
  
  // State for real data
  const [currentForum, setCurrentForum] = useState<Forum | null>(null);
  const [forumPosts, setForumPosts] = useState<Post[]>([]);
  const [allForums, setAllForums] = useState<Forum[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch forum data
  useEffect(() => {
    const fetchForumData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Always fetch all forums for sidebar first
        try {
          const forumsResponse = await fetch("/api/forums");
          if (forumsResponse.ok) {
            const forums = await forumsResponse.json();
            setAllForums(forums);
          }
        } catch (forumsErr) {
          console.error("Error fetching forums for sidebar:", forumsErr);
        }

        // Fetch the specific forum
        const forumResponse = await fetch(`/api/forums/${forumId}`);
        if (!forumResponse.ok) {
          if (forumResponse.status === 404) {
            setError('Forum not found');
            return;
          }
          throw new Error('Failed to fetch forum');
        }
        const forum = await forumResponse.json();
        setCurrentForum(forum);

        // Fetch posts for this forum
        const postsResponse = await fetch(`/api/posts?forumId=${forumId}`);
        if (!postsResponse.ok) {
          throw new Error('Failed to fetch posts');
        }
        const posts = await postsResponse.json();
        setForumPosts(posts);


      } catch (err) {
        console.error('Error fetching forum data:', err);
        setError('Failed to load forum data');
      } finally {
        setLoading(false);
      }
    };

    if (forumId) {
      fetchForumData();
    }
  }, [forumId]);

  // Sort posts based on selected criteria
  const sortedPosts = [...forumPosts].sort((a, b) => {
    switch (sortBy) {
      case 'new':
        return new Date(b.date_posted || 0).getTime() - new Date(a.date_posted || 0).getTime();
      case 'top':
        return ((b.upvotes || 0) - (b.downvotes || 0)) - ((a.upvotes || 0) - (a.downvotes || 0));
      case 'hot':
      default:
        const aScore = ((a.upvotes || 0) - (a.downvotes || 0)) / Math.max(1, Math.floor((Date.now() - new Date(a.date_posted || 0).getTime()) / (1000 * 60 * 60)));
        const bScore = ((b.upvotes || 0) - (b.downvotes || 0)) / Math.max(1, Math.floor((Date.now() - new Date(b.date_posted || 0).getTime()) / (1000 * 60 * 60)));
        return bScore - aScore;
    }
  });

  // Handle forum selection from sidebar
  const handleForumSelect = (selectedForumId: string) => {
    if (selectedForumId === 'all') {
      router.push('/forum');
    } else {
      router.push(`/forum/${selectedForumId}`);
    }
  };

  // Handle post creation
  const handlePostCreated = () => {
    setShowCreatePost(false);
    // Refresh posts
    const fetchPosts = async () => {
      try {
        const response = await fetch(`/api/posts?forumId=${forumId}`);
        if (response.ok) {
          const posts = await response.json();
          setForumPosts(posts);
        }
      } catch (err) {
        console.error('Error refreshing posts:', err);
      }
    };
    fetchPosts();
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <ForumHeader onMenuClick={() => setSidebarOpen(true)} />
        <div className="flex max-w-7xl mx-auto">
          <main className="flex-1 p-4">
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading forum...</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !currentForum) {
    return (
      <div className="min-h-screen bg-background">
        <ForumHeader onMenuClick={() => setSidebarOpen(true)} />
        <div className="flex max-w-7xl mx-auto">
          <ForumSidebar 
            selectedForum={forumId}
            onForumSelect={handleForumSelect}
            forums={allForums.map(f => ({
              id: f.id.toString(),
              name: f.topic,
              description: f.description || '',
              memberCount: 0, // We don't have member count in current schema
              color: 'bg-blue-500' // Default color
            }))}
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />
          <main className="flex-1 p-4">
            <div className="text-center py-12">
              <h1 className="text-2xl font-bold text-foreground mb-2">
                {error === 'Forum not found' ? 'Forum Not Found' : 'Error Loading Forum'}
              </h1>
              <p className="text-muted-foreground">
                {error === 'Forum not found' 
                  ? "The forum you're looking for doesn't exist." 
                  : 'There was an error loading the forum data. Please try again.'}
              </p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <ForumHeader onMenuClick={() => setSidebarOpen(true)} />
      
      {/* Mobile Layout */}
      <div className="sm:hidden">
        <ForumSidebar 
          selectedForum={forumId}
          onForumSelect={handleForumSelect}
          forums={allForums.map(f => ({
            id: f.id.toString(),
            name: f.topic,
            description: f.description || '',
            memberCount: 0,
            color: 'bg-blue-500'
          }))}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onForumCreated={() => {
            const fetchForums = async () => {
              try {
                const response = await fetch('/api/forums');
                if (response.ok) {
                  const forums = await response.json();
                  setAllForums(forums);
                }
              } catch (err) {
                console.error('Error refreshing forums:', err);
              }
            };
            fetchForums();
          }}
        />
        
        {/* Mobile Forum Header */}
        <div className="bg-card border-b border-border p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white text-lg font-bold">
              {currentForum.topic.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-foreground">r/{currentForum.topic}</h1>
              <p className="text-sm text-muted-foreground">
                {currentForum.description || 'No description available'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex gap-2 overflow-x-auto">
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
            <button 
              onClick={() => setShowCreatePost(true)}
              className="flex items-center gap-2 px-3 py-1 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors text-sm ml-2"
            >
              <Plus className="w-4 h-4" />
              Post
            </button>
          </div>
        </div>

        {/* Mobile Posts List */}
        <div className="bg-background">
          <RealPostList posts={sortedPosts} />
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden sm:flex max-w-7xl mx-auto relative">
        <ForumSidebar 
          selectedForum={forumId}
          onForumSelect={handleForumSelect}
          forums={allForums.map(f => ({
            id: f.id.toString(),
            name: f.topic,
            description: f.description || '',
            memberCount: 0, // We don't have member count in current schema
            color: 'bg-blue-500' // Default color
          }))}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onForumCreated={() => {
            // Refresh forums list when a new forum is created
            const fetchForums = async () => {
              try {
                const response = await fetch('/api/forums');
                if (response.ok) {
                  const forums = await response.json();
                  setAllForums(forums);
                }
              } catch (err) {
                console.error('Error refreshing forums:', err);
              }
            };
            fetchForums();
          }}
        />
        
        <main className="flex-1 p-4 lg:ml-0">
          {/* Forum Header - Desktop */}
          <div className="bg-card border border-border rounded-lg p-4 sm:p-6 mb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-blue-500 flex items-center justify-center text-white text-xl sm:text-2xl font-bold">
                {currentForum.topic.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground">r/{currentForum.topic}</h1>
                <p className="text-muted-foreground mt-1 text-sm sm:text-base">
                  {currentForum.description || 'No description available'}
                </p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4 sm:gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{forumPosts.length} posts</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span>Active community</span>
                </div>
              </div>
              
              <button 
                onClick={() => setShowCreatePost(true)}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm sm:text-base"
              >
                <Plus className="w-4 h-4" />
                Create Post
              </button>
            </div>
          </div>

          {/* Sort Options - Desktop */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
            <div className="flex gap-2 overflow-x-auto w-full sm:w-auto">
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
            <div className="text-sm text-muted-foreground">
              {sortedPosts.length} posts
            </div>
          </div>

          {/* Posts List */}
          <RealPostList posts={sortedPosts} />
        </main>
      </div>

      {/* Create Post Modal */}
      {showCreatePost && (
        <CreatePost
          forumId={parseInt(forumId)}
          onClose={() => setShowCreatePost(false)}
          onPostCreated={handlePostCreated}
        />
      )}
    </div>
  );
}

// Component to render posts with real data structure
function RealPostList({ posts }: { posts: Post[] }) {
  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-muted-foreground text-lg mb-2">No posts found</div>
        <div className="text-sm text-muted-foreground">
          Be the first to start a discussion in this community!
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <RealPostCard key={post.id} post={post} />
      ))}
    </div>
  );
}

// Component to render individual post with real data structure
function RealPostCard({ post }: { post: Post }) {
  const router = useRouter();

  const handlePostClick = () => {
    router.push(`/forum/post/${post.id}`);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Unknown date';
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString();
  };

  const netVotes = (post.upvotes || 0) - (post.downvotes || 0);

  return (
    <div className="bg-card border border-border rounded-lg p-4 hover:bg-accent/50 transition-colors cursor-pointer">
      <div className="flex gap-3">
        {/* Vote section */}
        <div className="flex flex-col items-center gap-1 min-w-[40px]">
          <button className="p-1 hover:bg-accent rounded transition-colors">
            <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          </button>
          <span className={`text-sm font-medium ${netVotes > 0 ? 'text-orange-500' : netVotes < 0 ? 'text-blue-500' : 'text-muted-foreground'}`}>
            {netVotes}
          </span>
          <button className="p-1 hover:bg-accent rounded transition-colors">
            <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        {/* Content section */}
        <div className="flex-1 min-w-0" onClick={handlePostClick}>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
            <span>r/{post.forum_topic}</span>
            <span>•</span>
            <span>Posted by u/{post.username || 'Unknown'}</span>
            <span>•</span>
            <span>{formatDate(post.date_posted)}</span>
          </div>
          
          <h3 className="font-semibold text-foreground mb-2 line-clamp-2">
            {post.title}
          </h3>
          
          <p className="text-sm text-muted-foreground mb-3 line-clamp-3">
            {post.description}
          </p>
          
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <button className="flex items-center gap-1 hover:bg-accent px-2 py-1 rounded transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span>{post.comment_count} comments</span>
            </button>
            <button className="flex items-center gap-1 hover:bg-accent px-2 py-1 rounded transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
              </svg>
              <span>Share</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
