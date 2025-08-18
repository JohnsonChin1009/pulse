import { Forum } from '@/lib/mockData';
import { Home, Users, TrendingUp } from 'lucide-react';

interface ForumSidebarProps {
  selectedForum: string;
  onForumSelect: (forumId: string) => void;
  forums: Forum[];
}

export default function ForumSidebar({ selectedForum, onForumSelect, forums }: ForumSidebarProps) {
  return (
    <aside className="w-64 bg-card border-r border-border p-4 h-screen sticky top-16 overflow-y-auto">
      <div className="space-y-6">
        {/* Navigation */}
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
            Navigation
          </h3>
          <div className="space-y-1">
            <button
              onClick={() => onForumSelect('all')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                selectedForum === 'all'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-foreground hover:bg-accent'
              }`}
            >
              <Home className="w-4 h-4" />
              All Posts
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-foreground hover:bg-accent transition-colors">
              <TrendingUp className="w-4 h-4" />
              Trending
            </button>
          </div>
        </div>

        {/* Forums */}
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
            Communities
          </h3>
          <div className="space-y-1">
            {forums.map((forum) => (
              <button
                key={forum.id}
                onClick={() => onForumSelect(forum.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                  selectedForum === forum.id
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground hover:bg-accent'
                }`}
              >
                <div className={`w-4 h-4 rounded-full ${forum.color}`} />
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{forum.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {forum.memberCount.toLocaleString()} members
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Forum Rules */}
        <div className="bg-muted rounded-lg p-4">
          <h4 className="font-semibold text-foreground mb-2">Forum Rules</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Be respectful and kind</li>
            <li>• No medical advice</li>
            <li>• Stay on topic</li>
            <li>• No spam or self-promotion</li>
          </ul>
        </div>
      </div>
    </aside>
  );
}
