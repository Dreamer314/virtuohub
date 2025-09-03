import React, { useState, useEffect, useCallback } from 'react';
import { Heart, MessageCircle, Share, Send, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { listComments, addComment, toggleLikeComment, type Comment } from '@/data/mockApi';

interface EngagementSectionProps {
  contentId: string;
  contentType: 'interview' | 'spotlight' | 'news';
  initialLikes?: number;
  initialComments?: Array<{
    id: string;
    author: string;
    content: string;
    timestamp: string;
    likes: number;
  }>;
}

interface CommentItemProps {
  comment: Comment;
  onReply: (parentId: string) => void;
  onToggleLike: (commentId: string) => void;
  isReply?: boolean;
  replyingTo?: string | null;
  onCancelReply?: () => void;
  onSubmitReply?: (body: string, parentId: string) => void;
}

function CommentItem({ 
  comment, 
  onReply, 
  onToggleLike, 
  isReply = false,
  replyingTo,
  onCancelReply,
  onSubmitReply
}: CommentItemProps) {
  const [replyText, setReplyText] = useState('');

  const handleReplySubmit = () => {
    if (replyText.trim() && onSubmitReply) {
      onSubmitReply(replyText, comment.id);
      setReplyText('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape' && onCancelReply) {
      onCancelReply();
    }
  };

  const formatTimestamp = (isoString: string) => {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) return `${diffDays}d ago`;
    if (diffHours > 0) return `${diffHours}h ago`;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    if (diffMins > 0) return `${diffMins}m ago`;
    return 'Just now';
  };

  return (
    <div className={`${isReply ? 'ml-4 pl-4 border-l-2 border-border' : ''}`}>
      <div className="flex items-start space-x-3">
        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-medium">
          {comment.author.avatar || comment.author.name.charAt(0)}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <span className="font-medium text-foreground text-sm">
              {comment.author.name}
            </span>
            <span className="text-xs text-muted-foreground">
              {formatTimestamp(comment.createdAt)}
            </span>
          </div>
          
          <p className="text-sm text-foreground leading-relaxed mb-2">
            {comment.body}
          </p>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => onToggleLike(comment.id)}
              className={`flex items-center space-x-1 text-xs hover:text-red-500 transition-colors ${
                comment.likedByUser ? 'text-red-500' : 'text-muted-foreground'
              }`}
              data-testid={`like-comment-${comment.id}`}
            >
              <Heart className={`w-3 h-3 ${comment.likedByUser ? 'fill-current' : ''}`} />
              <span>{comment.likes > 0 ? comment.likes : ''}</span>
            </button>
            
            {!isReply && (
              <button
                onClick={() => onReply(comment.id)}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                data-testid={`reply-button-${comment.id}`}
              >
                Reply
              </button>
            )}
          </div>
          
          {/* Inline Reply Composer */}
          {replyingTo === comment.id && (
            <div className="mt-3 space-y-2">
              <Textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Write a reply..."
                className="min-h-[80px] text-sm"
                maxLength={1000}
                onKeyDown={handleKeyDown}
                autoFocus
                data-testid={`reply-textarea-${comment.id}`}
              />
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  {replyText.length}/1000
                </span>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onCancelReply}
                    className="text-xs"
                    data-testid={`reply-cancel-${comment.id}`}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleReplySubmit}
                    disabled={!replyText.trim()}
                    className="text-xs"
                    data-testid={`reply-submit-${comment.id}`}
                  >
                    <Send className="w-3 h-3 mr-1" />
                    Reply
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function EngagementSection({ 
  contentId, 
  contentType, 
  initialLikes = 0
}: EngagementSectionProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [expandedReplies, setExpandedReplies] = useState<Set<string>>(new Set());

  // Load comments on mount
  useEffect(() => {
    const loadedComments = listComments(contentId);
    setComments(loadedComments);
  }, [contentId]);

  const handleLike = () => {
    if (isLiked) {
      setLikes(likes - 1);
      setIsLiked(false);
    } else {
      setLikes(likes + 1);
      setIsLiked(true);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setShareSuccess(true);
    setTimeout(() => setShareSuccess(false), 2000);
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      const comment = await addComment(contentId, newComment);
      setComments(prev => [comment, ...prev]);
      setNewComment('');
      setShowComments(true);
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  };

  const handleReply = (parentId: string) => {
    setReplyingTo(parentId);
  };

  const handleCancelReply = () => {
    setReplyingTo(null);
  };

  const handleSubmitReply = async (body: string, parentId: string) => {
    try {
      const reply = await addComment(contentId, body, parentId);
      setComments(prev => [...prev, reply]);
      setReplyingTo(null);
      
      // Auto-expand replies for the parent comment
      setExpandedReplies(prev => new Set([...Array.from(prev), parentId]));
    } catch (error) {
      console.error('Failed to add reply:', error);
    }
  };

  const handleToggleCommentLike = (commentId: string) => {
    const updatedComment = toggleLikeComment(commentId);
    if (updatedComment) {
      setComments(prev => 
        prev.map(comment => 
          comment.id === commentId ? updatedComment : comment
        )
      );
    }
  };

  // Group comments by parent/reply structure
  const topLevelComments = comments.filter(c => !c.parentId);
  const repliesByParent = comments.reduce((acc, comment) => {
    if (comment.parentId) {
      if (!acc[comment.parentId]) acc[comment.parentId] = [];
      acc[comment.parentId].push(comment);
    }
    return acc;
  }, {} as Record<string, Comment[]>);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setReplyingTo(null);
    }
  };

  return (
    <div className="border-t border-border pt-6 mt-8">
      {/* Engagement Actions */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-6">
          <Button
            variant="ghost"
            onClick={handleLike}
            className={`flex items-center space-x-2 hover:bg-transparent ${
              isLiked 
                ? 'text-red-500 hover:text-red-400' 
                : 'text-muted-foreground hover:text-red-500'
            }`}
            data-testid={`like-button-${contentId}`}
          >
            <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
            <span className="font-medium">{likes}</span>
          </Button>

          <Button
            variant="ghost"
            onClick={() => setShowComments(!showComments)}
            className="flex items-center space-x-2 text-muted-foreground hover:text-foreground hover:bg-transparent"
            data-testid={`comments-button-${contentId}`}
          >
            <MessageCircle className="w-5 h-5" />
            <span className="font-medium">{comments.length}</span>
          </Button>

          <Button
            variant="ghost"
            onClick={handleShare}
            className={`flex items-center space-x-2 hover:bg-transparent ${
              shareSuccess
                ? 'text-green-500 hover:text-green-400'
                : 'text-muted-foreground hover:text-foreground'
            }`}
            data-testid={`share-button-${contentId}`}
          >
            <Share className="w-5 h-5" />
            <span className="font-medium">
              {shareSuccess ? 'Copied!' : 'Share'}
            </span>
          </Button>
        </div>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="space-y-6">
          {/* Add Comment Form */}
          <div className="space-y-3">
            <Textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Share your thoughts..."
              className="min-h-[100px]"
              maxLength={1000}
              onKeyDown={handleKeyDown}
              data-testid={`comment-textarea-${contentId}`}
            />
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {newComment.length}/1000
              </span>
              <Button
                onClick={handleAddComment}
                disabled={!newComment.trim()}
                className="flex items-center space-x-2"
                data-testid={`comment-submit-${contentId}`}
              >
                <Send className="w-4 h-4" />
                <span>Comment</span>
              </Button>
            </div>
          </div>

          {/* Comments List */}
          <div className="space-y-6">
            {topLevelComments.length === 0 ? (
              <div className="text-center py-8">
                <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                <p className="text-muted-foreground">Be the first to start the conversation.</p>
              </div>
            ) : (
              topLevelComments.map((comment) => {
                const replies = repliesByParent[comment.id] || [];
                const visibleReplies = expandedReplies.has(comment.id) ? replies : replies.slice(0, 3);
                const hiddenRepliesCount = Math.max(0, replies.length - 3);

                return (
                  <div key={comment.id} className="space-y-3">
                    <CommentItem
                      comment={comment}
                      onReply={handleReply}
                      onToggleLike={handleToggleCommentLike}
                      replyingTo={replyingTo}
                      onCancelReply={handleCancelReply}
                      onSubmitReply={handleSubmitReply}
                    />
                    
                    {/* Replies */}
                    {visibleReplies.length > 0 && (
                      <div className="space-y-3">
                        {visibleReplies.map((reply) => (
                          <CommentItem
                            key={reply.id}
                            comment={reply}
                            onReply={handleReply}
                            onToggleLike={handleToggleCommentLike}
                            isReply={true}
                          />
                        ))}
                        
                        {/* Show more replies button */}
                        {hiddenRepliesCount > 0 && !expandedReplies.has(comment.id) && (
                          <button
                            onClick={() => setExpandedReplies(prev => new Set([...Array.from(prev), comment.id]))}
                            className="ml-12 text-sm text-primary hover:text-primary/80 font-medium"
                            data-testid={`expand-replies-${comment.id}`}
                          >
                            View {hiddenRepliesCount} more {hiddenRepliesCount === 1 ? 'reply' : 'replies'}
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}