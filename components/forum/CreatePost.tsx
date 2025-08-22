'use client';

import { useState } from 'react';
import { forumAPI } from '@/lib/hooks/useForum';
import { Plus, X, Send } from 'lucide-react';

interface CreatePostProps {
  forums: Array<{
    id: string;
    name: string;
    description: string;
    color: string;
    memberCount: number;
  }>;
  selectedForumId?: string;
  onPostCreated?: () => void;
}

export default function CreatePost({ forums, selectedForumId, onPostCreated }: CreatePostProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [forumId, setForumId] = useState(selectedForumId || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !forumId || isSubmitting) return;

    setIsSubmitting(true);
    
    try {
      // For now, we'll use a placeholder user ID
      // In a real app, you'd get this from authentication context
      //placeholder-user-id for now
      const userId = '46e7628d-a464-43f6-a6ea-1163f7bae42b'; // TODO: Get from auth context
      
      await forumAPI.createPost({
        title: title.trim(),
        description: description.trim(),
        forum_id: parseInt(forumId),
        user_id: userId,
      });
      
      // Reset form
      setTitle('');
      setDescription('');
      setForumId(selectedForumId || '');
      setIsOpen(false);
      
      // Notify parent to refresh
      onPostCreated?.();
    } catch (error) {
      console.error('Error creating post:', error);
      // TODO: Show error toast
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setTitle('');
    setDescription('');
    setForumId(selectedForumId || '');
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
      >
        <Plus className="w-4 h-4" />
        Create Post
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-card border border-border rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">Create a Post</h2>
          <button
            onClick={handleClose}
            className="p-1 hover:bg-accent rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Forum Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Choose a community
            </label>
            <select
              value={forumId}
              onChange={(e) => setForumId(e.target.value)}
              className="w-full p-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              required
            >
              <option value="">Select a forum...</option>
              {forums.map((forum) => (
                <option key={forum.id} value={forum.id}>
                  r/{forum.name}
                </option>
              ))}
            </select>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="An interesting title"
              className="w-full p-3 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              maxLength={300}
              required
            />
            <div className="text-xs text-muted-foreground text-right">
              {title.length}/300
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Text (optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What's on your mind?"
              className="w-full p-3 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary"
              rows={6}
              required
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!title.trim() || !description.trim() || !forumId || isSubmitting}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
              {isSubmitting ? 'Posting...' : 'Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
