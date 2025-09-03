import Link from "next/link";
import { Search, User, Menu } from "lucide-react";

interface ForumHeaderProps {
  onMenuClick?: () => void;
}

export default function ForumHeader({ onMenuClick }: ForumHeaderProps) {
  return (
    <header className="bg-card border-b border-border sticky top-0 z-50">
      {/* Mobile Header - Reddit Style */}
      <div className="sm:hidden px-3 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onMenuClick}
              className="p-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button className="p-2 text-muted-foreground hover:text-foreground transition-colors">
              <Search className="w-5 h-5" />
            </button>
            <button className="p-2 text-muted-foreground hover:text-foreground transition-colors">
              <User className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Header - Original */}
      <div className="hidden sm:block">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Desktop search bar */}
            <div className="flex-1 max-w-md mx-2 sm:mx-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full pl-10 pr-4 py-2 bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent text-sm sm:text-base"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
