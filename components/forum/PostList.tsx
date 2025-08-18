import { ForumPost, User, Forum } from '@/lib/mockData';
import PostCard from './PostCard';

interface PostListProps {
  posts: ForumPost[];
  users: User[];
  forums: Forum[];
}

export default function PostList({ posts, users, forums }: PostListProps) {
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
      {posts.map((post) => {
        const user = users.find(u => u.id === post.userId);
        const forum = forums.find(f => f.id === post.forumId);
        
        return (
          <PostCard
            key={post.id}
            post={post}
            user={user}
            forum={forum}
          />
        );
      })}
    </div>
  );
}
