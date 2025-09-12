import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { type PostWithAuthor } from "@shared/schema";
import { ThumbsUp, MessageCircle, Share, Heart, Zap, Lightbulb, Clock } from "lucide-react";
import { Link } from "wouter";
import { cn, getPlatformColor, getCategoryColor, formatTimeAgo } from "@/lib/utils";
import { getCategoryLabel, normalizeCategoryToSlug } from "@/constants/postCategories";
import { ImageViewerModal } from "@/components/modals/ImageViewerModal";
import { OptimizedImage } from "@/components/ui/optimized-image";

interface PostCardProps {
  post: PostWithAuthor;
  currentUserId?: string;
  isDetailView?: boolean;
}

export const PostCard = React.memo(function PostCard({ post, currentUserId = 'user1', isDetailView = false }: PostCardProps) {
  const [isSaved, setIsSaved] = useState(post.isSaved || false);
  const [hasVoted, setHasVoted] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const likeMutation = useMutation({
    mutationFn: () => apiRequest('POST', `/api/posts/${post.id}/like`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/posts'] });
      queryClient.invalidateQueries({ queryKey: ['/api/posts', post.id] });
      toast({ title: "Post liked!" });
    }
  });

  const saveMutation = useMutation({
    mutationFn: () => {
      const endpoint = isSaved ? 'delete' : 'post';
      return apiRequest(endpoint.toUpperCase() as any, `/api/users/${currentUserId}/saved-posts`, 
        endpoint === 'post' ? { postId: post.id } : undefined);
    },
    onSuccess: () => {
      setIsSaved(!isSaved);
      queryClient.invalidateQueries({ queryKey: ['/api/users', currentUserId, 'saved-posts'] });
      toast({ title: isSaved ? "Post unsaved" : "Post saved!" });
    }
  });

  const [shareSuccess, setShareSuccess] = useState(false);

  const handleLike = () => {
    if (!likeMutation.isPending) {
      likeMutation.mutate();
    }
  };

  const handleSave = () => {
    if (!saveMutation.isPending) {
      saveMutation.mutate();
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share && post.subtype !== 'poll') {
        await navigator.share({
          title: post.title,
          url: `${window.location.origin}/thread/${post.id}`
        });
      } else {
        await navigator.clipboard.writeText(`${window.location.origin}/thread/${post.id}`);
        setShareSuccess(true);
        setTimeout(() => setShareSuccess(false), 2000);
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const renderTypeIcon = () => {
    if (post.subtype === 'poll') {
      return <Zap className="w-4 h-4 text-yellow-500" />;
    }
    if (post.subtype === 'interview') {
      return <Lightbulb className="w-4 h-4 text-blue-500" />;
    }
    return null;
  };

  // Get poll data from subtypeData if it's a poll
  const pollData = post.subtype === 'poll' ? post.subtypeData as { question?: string, choices?: Array<{text: string, votes: number, id: string}>, closesAt?: number, oneVotePerUser?: boolean } : null;

  return (
    <>
      <article className="vh-post-card" data-testid={`post-card-${post.id}`}>
        <div className="flex space-x-4">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-vh-accent1 text-white font-medium text-lg">
              {(post.author.displayName || post.author.username || 'U').charAt(0)}
            </span>
          </div>
          
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-center space-x-2 mb-1">
              <span className="vh-body font-medium" data-testid={`author-${post.id}`}>
                {post.author.displayName || post.author.username || 'Anonymous'}
              </span>
              {post.author.role && (
                <Badge variant="secondary" className="text-xs">
                  {post.author.role}
                </Badge>
              )}
              <span className="text-xs text-vh-text-subtle">•</span>
              <span className="vh-caption" data-testid={`time-${post.id}`}>
                {formatTimeAgo(post.createdAt ? new Date(post.createdAt) : new Date())}
              </span>
              {renderTypeIcon()}
            </div>
            
            {/* Content */}
            {!isDetailView ? (
              <Link href={`/thread/${post.id}`} className="block group mb-3">
                <div className="mb-3">
                  <h3 className="vh-heading-5 mb-1 group-hover:text-vh-accent1 transition-colors" data-testid={`title-${post.id}`}>
                    {post.title}
                  </h3>
                  {post.summary && (
                    <p className="vh-body-small text-vh-text-muted line-clamp-2" data-testid={`summary-${post.id}`}>
                      {post.summary}
                    </p>
                  )}
                  <p className="vh-body text-vh-text-muted line-clamp-3" data-testid={`content-${post.id}`}>
                    {post.body}
                  </p>
                </div>
                
                {/* Image */}
                {post.imageUrl && post.imageUrl.trim() !== '' && (
                  <div className="mb-3 rounded-vh-lg overflow-hidden">
                    <img 
                      src={post.imageUrl} 
                      alt={post.title}
                      className="w-full h-auto max-h-96 object-cover cursor-pointer hover:scale-105 transition-transform duration-200"
                      data-testid={`image-${post.id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setIsImageViewerOpen(true);
                      }}
                    />
                  </div>
                )}
              </Link>
            ) : (
              <div className="mb-3">
                <h1 className="vh-heading-3 mb-2" data-testid={`title-${post.id}`}>
                  {post.title}
                </h1>
                {post.summary && (
                  <p className="vh-body-large text-vh-text-muted mb-3" data-testid={`summary-${post.id}`}>
                    {post.summary}
                  </p>
                )}
                <div className="vh-body whitespace-pre-wrap" data-testid={`content-${post.id}`}>
                  {post.body}
                </div>
                
                {/* Image */}
                {post.imageUrl && post.imageUrl.trim() !== '' && (
                  <div className="mt-4 rounded-vh-lg overflow-hidden">
                    <OptimizedImage 
                      src={post.imageUrl} 
                      alt={post.title}
                      width="100%"
                      height="auto"
                      aspectRatio="wide"
                      loading="eager"
                      priority={true}
                      className="w-full h-auto max-h-96 object-cover cursor-pointer hover:scale-105 transition-transform duration-200"
                      data-testid={`image-${post.id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setIsImageViewerOpen(true);
                      }}
                    />
                  </div>
                )}
              </div>
            )}
            
            {/* Tags and Platforms */}
            <div className="flex flex-wrap gap-2 mb-3">
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {post.tags.map((tag: string) => (
                    <span 
                      key={tag}
                      className="vh-pill text-xs bg-vh-accent1-light text-vh-accent1"
                      data-testid={`tag-${post.id}-${tag}`}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
              {post.platforms.map((platform: string) => (
                <span 
                  key={platform} 
                  className="vh-platform-pill"
                  data-testid={`platform-${post.id}-${platform}`}
                >
                  {platform}
                </span>
              ))}
            </div>

            {/* Poll Section for VHub Data Pulse */}
            {post.subtype === 'poll' && pollData && pollData.choices && (
              <div className="vh-poll-card mb-4">
                <p className="vh-body-small font-medium text-vh-text-muted mb-3">
                  {pollData.question || 'Vote on this poll:'}
                </p>
                <div className="space-y-2">
                  {pollData.choices.map((choice, index) => {
                    const totalVotes = pollData.choices?.reduce((sum, c) => sum + c.votes, 0) || 0;
                    const percentage = totalVotes > 0 ? Math.round((choice.votes / totalVotes) * 100) : 0;
                    const isSelected = selectedOption === index;
                    
                    return (
                      <button
                        key={choice.id}
                        onClick={() => {
                          if (!hasVoted) {
                            setSelectedOption(index);
                            setHasVoted(true);
                          }
                        }}
                        disabled={hasVoted}
                        className={cn(
                          "w-full p-3 rounded-vh-md border text-left transition-vh-fast",
                          hasVoted 
                            ? isSelected 
                              ? "border-vh-accent1 bg-vh-accent1-light" 
                              : "border-vh-border bg-vh-surface"
                            : "border-vh-border hover:border-vh-accent1 hover:bg-vh-accent1-light"
                        )}
                        data-testid={`poll-option-${post.id}-${index}`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="vh-body-small font-medium">{choice.text}</span>
                          {hasVoted && (
                            <span className="vh-caption">
                              {percentage}%
                            </span>
                          )}
                        </div>
                        {hasVoted && (
                          <Progress 
                            value={percentage} 
                            className="h-1.5"
                            data-testid={`poll-progress-${post.id}-${index}`}
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
                {hasVoted && (
                  <p className="vh-caption mt-2">
                    Poll results based on {pollData.choices?.reduce((sum, c) => sum + c.votes, 0) || 0} votes
                  </p>
                )}
              </div>
            )}

            {/* Engagement Actions */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLike}
                  className="vh-button flex items-center space-x-2 px-2 py-1"
                  data-testid={`like-button-${post.id}`}
                >
                  <ThumbsUp size={16} />
                  <span className="vh-body-small">{post.likes}</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSave}
                  className="vh-button flex items-center space-x-2 px-2 py-1"
                  data-testid={`save-button-${post.id}`}
                >
                  <Heart size={16} className={isSaved ? "fill-current text-vh-error" : ""} />
                  <span className="vh-body-small">{isSaved ? "Saved" : "Save"}</span>
                </Button>
                {!isDetailView ? (
                  <Link href={`/thread/${post.id}`}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="vh-button flex items-center space-x-2 px-2 py-1"
                      data-testid={`comment-button-${post.id}`}
                    >
                      <MessageCircle size={16} />
                      <span className="vh-body-small">{post.comments} comments</span>
                    </Button>
                  </Link>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="vh-button flex items-center space-x-2 px-2 py-1"
                    data-testid={`comment-button-${post.id}`}
                  >
                    <MessageCircle size={16} />
                    <span className="vh-body-small">{post.comments} comments</span>
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleShare}
                  className="vh-button flex items-center space-x-2 px-2 py-1"
                  data-testid={`share-button-${post.id}`}
                >
                  <Share size={16} />
                  <span className="vh-body-small">
                    {post.subtype === 'poll' && shareSuccess ? 'Link Copied!' : post.shares}
                  </span>
                </Button>
              </div>
              {post.price && (
                <span className="vh-body-small font-medium text-vh-success" data-testid={`price-${post.id}`}>
                  {post.price}
                </span>
              )}
            </div>
          </div>
        </div>
      </article>

      {/* Image Viewer Modal */}
      {post.imageUrl && (
        <ImageViewerModal
          isOpen={isImageViewerOpen}
          onClose={() => setIsImageViewerOpen(false)}
          imageUrl={post.imageUrl}
          imageAlt={post.title || ""}
        />
      )}
    </>
  );
});