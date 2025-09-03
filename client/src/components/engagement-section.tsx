import React, { useState } from 'react';
import { Heart, MessageCircle, Share, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

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

export function EngagementSection({ 
  contentId, 
  contentType, 
  initialLikes = 0, 
  initialComments = [] 
}: EngagementSectionProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(false);
  const [comments, setComments] = useState(initialComments);
  const [newComment, setNewComment] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);

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

  const handleAddComment = () => {
    if (newComment.trim()) {
      const comment = {
        id: Date.now().toString(),
        author: 'You',
        content: newComment,
        timestamp: 'Just now',
        likes: 0
      };
      setComments([comment, ...comments]);
      setNewComment('');
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
            <Heart 
              size={20} 
              className={isLiked ? 'fill-current' : ''} 
            />
            <span>{likes}</span>
          </Button>

          <Button
            variant="ghost"
            onClick={() => setShowComments(!showComments)}
            className="flex items-center space-x-2 text-muted-foreground hover:text-accent hover:bg-transparent"
            data-testid={`comment-button-${contentId}`}
          >
            <MessageCircle size={20} />
            <span>{comments.length}</span>
          </Button>

          <Button
            variant="ghost"
            onClick={handleShare}
            className="flex items-center space-x-2 text-muted-foreground hover:text-accent hover:bg-transparent"
            data-testid={`share-button-${contentId}`}
          >
            <Share size={20} />
            <span>{shareSuccess ? 'Link Copied!' : 'Share'}</span>
          </Button>
        </div>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="space-y-4">
          {/* Add Comment */}
          <div className="flex space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-bold text-white">Y</span>
            </div>
            <div className="flex-1 space-y-2">
              <Textarea
                placeholder={`Share your thoughts on this ${contentType}...`}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="min-h-[80px] resize-none"
                data-testid={`comment-input-${contentId}`}
              />
              <Button
                onClick={handleAddComment}
                disabled={!newComment.trim()}
                className="ml-auto flex items-center space-x-2"
                data-testid={`submit-comment-${contentId}`}
              >
                <Send size={16} />
                <span>Comment</span>
              </Button>
            </div>
          </div>

          {/* Comments List */}
          {comments.length > 0 && (
            <div className="space-y-4 border-t border-border pt-4">
              {comments.map((comment) => (
                <div key={comment.id} className="flex space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-teal-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-white">
                      {comment.author.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium text-foreground text-sm">
                        {comment.author}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {comment.timestamp}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {comment.content}
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs text-muted-foreground hover:text-accent hover:bg-transparent p-0 h-auto"
                    >
                      <Heart size={14} className="mr-1" />
                      {comment.likes}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}