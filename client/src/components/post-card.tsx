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
import { ImageViewerModal } from "./image-viewer-modal";

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
      if (navigator.share && post.type !== 'pulse') {
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
    if (post.type === 'pulse') {
      return <Zap className="w-4 h-4 text-yellow-500" />;
    }
    if (post.type === 'insight') {
      return <Lightbulb className="w-4 h-4 text-blue-500" />;
    }
    return null;
  };

  return (
    <>
      <article className="enhanced-card hover-lift group p-6 space-y-4 transition-all duration-200" data-testid={`post-card-${post.id}`}>
        <div className="flex space-x-4">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-gradient-cosmic text-white font-medium text-lg">
              {post.author.displayName.charAt(0)}
            </span>
          </div>
          
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-center space-x-2 mb-1">
              <span className="font-medium text-foreground" data-testid={`author-${post.id}`}>
                {post.author.displayName}
              </span>
              <Badge variant="secondary" className="text-xs">
                {post.author.role}
              </Badge>
              <span className="text-xs text-muted-foreground">•</span>
              <span className="text-xs text-muted-foreground" data-testid={`time-${post.id}`}>
                {formatTimeAgo(post.createdAt ? new Date(post.createdAt) : new Date())}
              </span>
            </div>
            
            {/* Content */}
            {!isDetailView ? (
              <Link href={`/thread/${post.id}`} className="block group mb-3">
                <div className="mb-3">
                  <h3 className="text-base font-semibold mb-1 text-foreground group-hover:text-primary transition-colors" data-testid={`title-${post.id}`}>
                    {post.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-3" data-testid={`content-${post.id}`}>
                    {post.content}
                  </p>
                </div>
                
                {/* Image */}
                {post.imageUrl && (
                  <div className="mb-3 rounded-lg overflow-hidden">
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
                <h1 className="text-xl font-bold mb-2 text-foreground" data-testid={`title-${post.id}`}>
                  {post.title}
                </h1>
                <div className="text-sm text-foreground whitespace-pre-wrap" data-testid={`content-${post.id}`}>
                  {post.content}
                </div>
                
                {/* Image */}
                {post.imageUrl && (
                  <div className="mb-3 rounded-lg overflow-hidden">
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
              </div>
            )}
            
            {/* Category and Platforms */}
            <div className="flex flex-wrap gap-2 mb-3">
              <Badge 
                variant="secondary" 
                className={cn("text-xs", getCategoryColor(post.category))}
                data-testid={`category-${post.id}`}
              >
                {post.category}
              </Badge>
              {post.platforms.map((platform: string) => (
                <Badge 
                  key={platform} 
                  variant="outline" 
                  className={cn("text-xs", getPlatformColor(platform))}
                  data-testid={`platform-${post.id}-${platform}`}
                >
                  {platform}
                </Badge>
              ))}
            </div>

            {/* VHub Data Pulse Poll */}
            {post.type === 'pulse' && (post as any).pollOptions && (
              <div className="mb-4">
                <p className="text-sm font-medium text-muted-foreground mb-3">
                  Vote on this pulse:
                </p>
                <div className="space-y-2">
                  {(post as any).pollOptions.map((option: string, index: number) => {
                    const percentage = (post as any).pollResults?.[index] || 0;
                    const isSelected = selectedOption === index;
                    
                    return (
                      <button
                        key={index}
                        onClick={() => {
                          if (!hasVoted) {
                            setSelectedOption(index);
                            setHasVoted(true);
                          }
                        }}
                        disabled={hasVoted}
                        className={cn(
                          "w-full p-3 rounded-lg border text-left transition-all",
                          hasVoted 
                            ? isSelected 
                              ? "border-primary bg-primary/10" 
                              : "border-border bg-muted/50"
                            : "border-border hover:border-primary hover:bg-accent/5"
                        )}
                        data-testid={`poll-option-${post.id}-${index}`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium">{option}</span>
                          {hasVoted && (
                            <span className="text-xs text-muted-foreground">
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
                  <p className="text-xs text-muted-foreground mt-2">
                    Poll results based on {(post as any).pollResults?.reduce((a: number, b: number) => a + b, 0) || 0} votes
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
                  className="flex items-center space-x-2 hover:bg-accent/5 dark:hover:bg-accent/10 transition-all duration-200 rounded-md px-2 py-1"
                  data-testid={`like-button-${post.id}`}
                >
                  <ThumbsUp size={16} />
                  <span>{post.likes}</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSave}
                  className="flex items-center space-x-2 hover:bg-accent/5 dark:hover:bg-accent/10 transition-all duration-200 rounded-md px-2 py-1"
                  data-testid={`save-button-${post.id}`}
                >
                  <Heart size={16} className={isSaved ? "fill-current" : ""} />
                  <span>{isSaved ? "Saved" : "Save"}</span>
                </Button>
                {!isDetailView ? (
                  <Link href={`/thread/${post.id}`}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center space-x-2 hover:bg-accent/5 dark:hover:bg-accent/10 transition-all duration-200 rounded-md px-2 py-1"
                      data-testid={`comment-button-${post.id}`}
                    >
                      <MessageCircle size={16} />
                      <span>{post.comments} comments</span>
                    </Button>
                  </Link>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center space-x-2 hover:bg-accent/5 dark:hover:bg-accent/10 transition-all duration-200 rounded-md px-2 py-1"
                    data-testid={`comment-button-${post.id}`}
                  >
                    <MessageCircle size={16} />
                    <span>{post.comments} comments</span>
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleShare}
                  className="flex items-center space-x-2 hover:bg-accent/5 dark:hover:bg-accent/10 transition-all duration-200 rounded-md px-2 py-1"
                  data-testid={`share-button-${post.id}`}
                >
                  <Share size={16} />
                  <span>
                    {post.type === 'pulse' && shareSuccess ? 'Link Copied!' : post.shares}
                  </span>
                </Button>
              </div>
              {post.price && (
                <span className="text-sm font-medium text-green-600 dark:text-green-400" data-testid={`price-${post.id}`}>
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