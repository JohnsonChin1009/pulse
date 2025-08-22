'use client';

import { useState } from 'react';
import { Forum } from '@/lib/mockData';
import { Home, Users, TrendingUp, X } from 'lucide-react';
import CreateForum from './CreateForum';

interface ForumSidebarProps {
  selectedForum: string;
  onForumSelect: (forumId: string) => void;
  forums: Forum[];
  isOpen?: boolean;
  onClose?: () => void;
  onForumCreated?: () => void;
}

export default function ForumSidebar({ selectedForum, onForumSelect, forums, isOpen = true, onClose, onForumCreated }: ForumSidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside className={`
        fixed lg:sticky top-0 lg:top-16 left-0 z-50 lg:z-auto
        w-64 lg:w-64 h-screen bg-card border-r border-border
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        overflow-y-auto
      `}>
        <div className="p-4">
          {/* Mobile close button */}
          <div className="flex justify-between items-center mb-4 lg:hidden">
            <h2 className="text-lg font-semibold text-foreground">Menu</h2>
            <button
              onClick={onClose}
              className="p-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Navigation */}
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                Navigation
              </h3>
              <div className="space-y-1">
                <button
                  onClick={() => {
                    onForumSelect('all');
                    onClose?.();
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    selectedForum === 'all'
                      ? 'bg-primary text-primary-foreground'
                      : 'text-foreground hover:bg-accent'
                  }`}
                >
                  <Home className="w-4 h-4" />
                  All Posts
                </button>
                <button 
                  onClick={onClose}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-foreground hover:bg-accent transition-colors"
                >
                  <TrendingUp className="w-4 h-4" />
                  Trending
                </button>
              </div>
            </div>

            {/* Forums */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Communities
                </h3>
                <CreateForum onForumCreated={onForumCreated} />
              </div>
              <div className="space-y-1">
                {forums.map((forum) => (
                  <button
                    key={forum.id}
                    onClick={() => {
                      onForumSelect(forum.id);
                      onClose?.();
                    }}
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
        </div>
      </aside>
    </>
  );
}
