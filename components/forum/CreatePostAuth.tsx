'use client';

import { useState, useEffect } from 'react';
import { Plus, X, Send } from 'lucide-react';

interface CreatePostAuthProps {
  forums?: Array<{
    id: string;
    name: string;
    description: string;
    color: string;
    memberCount: number;
  }>;
  selectedForumId?: string;
  onPostCreated?: () => void;
  forumId?: number;
  onClose?: () => void;
  apiEndpoint?: string; // New prop for API endpoint
}

export default function CreatePostAuth({ 
  forums, 
  selectedForumId, 
  onPostCreated, 
  forumId, 
  onClose,
  apiEndpoint = '/api/user/posts' // Default to authenticated endpoint
}: CreatePostAuthProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedForum, setSelectedForum] = useState(selectedForumId || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableForums, setAvailableForums] = useState(forums || []);

  const isSpecificForumMode = !!forumId;
  
  useEffect(() => {
    if (isSpecificForumMode) {
      setIsOpen(true);
      setSelectedForum(forumId.toString());
      
      if (!forums || forums.length === 0) {
        const fetchForums = async () => {
          try {
            const response = await fetch('/api/user/forums');
            if (response.ok) {
              const forumsData = await response.json();
              const transformedForums = forumsData.map((forum: any) => ({
                id: forum.id.toString(),
                name: forum.topic,
                description: forum.description || '',
                color: 'bg-blue-500',
                memberCount: forum.popular_rank || 0
              }));
              setAvailableForums(transformedForums);
            }
          } catch (error) {
            console.error('Error fetching forums:', error);
          }
        };
        fetchForums();
      }
    }
  }, [isSpecificForumMode, forumId, forums]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !description.trim() || !selectedForum) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      console.log('Creating post with data:', {
        title: title.trim(),
        description: description.trim(),
        forum_id: parseInt(selectedForum),
      });
      
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          forum_id: parseInt(selectedForum),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create post');
      }

      const newPost = await response.json();
      console.log('Post created successfully:', newPost);

      // Reset form
      setTitle('');
      setDescription('');
      setSelectedForum(selectedForumId || '');
      setIsOpen(false);

      // Notify parent component
      if (onPostCreated) {
        onPostCreated();
      }

      // Close modal if in specific forum mode
      if (onClose) {
        onClose();
      }
    } catch (error) {
      console.error('Error creating post:', error);
      alert(error instanceof Error ? error.message : 'Failed to create post');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setTitle('');
    setDescription('');
    setSelectedForum(selectedForumId || '');
    if (onClose) {
      onClose();
    }
  };

  if (isSpecificForumMode && !isOpen) {
    return null;
  }

  return (
    <>
      {!isSpecificForumMode && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Create Post</span>
        </button>
      )}

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-card rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="text-lg font-semibold text-foreground">Create New Post</h2>
              <button
                onClick={handleClose}
                className="p-1 hover:bg-accent rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              {!isSpecificForumMode && (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Select Forum
                  </label>
                  <select
                    value={selectedForum}
                    onChange={(e) => setSelectedForum(e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  >
                    <option value="">Choose a forum...</option>
                    {availableForums.map((forum) => (
                      <option key={forum.id} value={forum.id}>
                        {forum.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter post title..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={6}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  placeholder="Write your post content..."
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !title.trim() || !description.trim() || !selectedForum}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Create Post
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
