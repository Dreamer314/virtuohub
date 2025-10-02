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
  const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Poll voting state from server - defensive reading
  const options = (post as any).poll?.options ?? (post as any).poll_options ?? [];
  const talliesRaw = (post as any).poll?.tallies ?? (post as any).results ?? [];
  const myVote = (post as any).poll?.my_vote ?? (post as any).my_vote ?? null;
  const total = (post as any).poll?.total ?? talliesRaw.reduce((a: number, b: number) => a + (Number(b) || 0), 0);
  const tallies = Array.isArray(talliesRaw) ? talliesRaw : new Array(options.length).fill(0);
  const hasVoted = myVote !== null;

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

  const voteMutation = useMutation({
    mutationFn: (optionIndex: number) => 
      apiRequest('POST', `/api/posts/${post.id}/polls/vote`, { optionIndex }),
    onSuccess: (data: any) => {
      // Update the post cache with fresh tallies from server using normalized response
      // Update in posts list
      queryClient.setQueryData(['/api/posts'], (oldData: any) => {
        if (!oldData) return oldData;
        return oldData.map((p: any) => {
          if (p.id !== post.id) return p;
          return {
            ...p,
            poll: data.poll ?? p.poll,
            poll_question: data.poll_question ?? p.poll_question,
            poll_options: data.poll_options ?? p.poll_options,
            results: data.results ?? p.results,
            my_vote: data.my_vote ?? p.my_vote,
          };
        });
      });
      
      // Update single post cache if it exists
      queryClient.setQueryData(['/api/posts', post.id], (oldData: any) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          poll: data.poll ?? oldData.poll,
          poll_question: data.poll_question ?? oldData.poll_question,
          poll_options: data.poll_options ?? oldData.poll_options,
          results: data.results ?? oldData.results,
          my_vote: data.my_vote ?? oldData.my_vote,
        };
      });
      
      toast({ title: "Vote recorded!" });
    },
    onError: (error: any) => {
      const errorMessage = error?.message || "Please try again";
      toast({ 
        title: "Vote failed", 
        description: errorMessage,
        variant: "destructive" 
      });
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

  // Get poll data - handle both old format and new { poll: { question, options } } format
  const pollData = post.subtype === 'poll'
    ? (() => {
        const subtypeData = (post as any).subtypeData;
        const pollNode = subtypeData?.poll;
        
        // New format: { poll: { question, options } }
        if (pollNode && Array.isArray(pollNode.options)) {
          return {
            question: pollNode.question || post.title || 'Poll',
            choices: pollNode.options.map((text: string, i: number) => ({
              id: String(i), text, votes: 0,
            })),
            closesAt: null,
            oneVotePerUser: true,
          };
        }
        
        // Old format or fallback to poll_options
        if (subtypeData?.question && Array.isArray(subtypeData?.choices)) {
          return subtypeData;
        }
        
        // Final fallback to poll_options
        return {
          question: (post as any).poll_question || post.title || post.body || 'Poll',
          choices: Array.isArray((post as any).poll_options)
            ? (post as any).poll_options.map((text: string, i: number) => ({
                id: String(i), text, votes: 0,
              }))
            : [],
          closesAt: null,
          oneVotePerUser: true,
        };
      })()
    : null;

  // Derive images with array-safe fallback
  const images: string[] = Array.isArray(post.images)
    ? post.images
    : Array.isArray((post as any).image_urls)
      ? (post as any).image_urls
      : [];

  // Generate thumbnail URL using Supabase render endpoint for faster feed loading
  const toThumb = (url: string) => {
    if (!url) return url;
    return url.replace('/storage/v1/object/', '/storage/v1/render/image/')
            + (url.includes('?') ? '&' : '?')
            + 'width=640&height=360&resize=cover&quality=80';
  };

  const originalUrl = images[0] || '';
  const thumbUrl = originalUrl ? toThumb(originalUrl) : '';
  const thumb2x = originalUrl 
    ? toThumb(originalUrl).replace('width=640', 'width=1280').replace('height=360', 'height=720')
    : '';

  return (
    <>
      <article className="vh-post-card" data-testid={`post-card-${post.id}`}>
        <div className="flex space-x-4">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-vh-accent1 text-white font-medium text-lg">
              {(post.author.handle || post.author.displayName || 'U').charAt(0)}
            </span>
          </div>
          
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-center space-x-2 mb-1">
              <span className="vh-body font-medium" data-testid={`author-${post.id}`}>
                {post.author.handle ? `@${post.author.handle}` : post.author.displayName || (post.authorId ? `user_${post.authorId.slice(-5)}` : '')}
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
                
                {/* Images from Supabase Storage */}
                {images.length > 0 && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setIsImageViewerOpen(true);
                    }}
                    className="mb-3 rounded-vh-lg overflow-hidden block w-full"
                    aria-label="Open image"
                    data-testid={`storage-image-${post.id}`}
                  >
                    <img
                      src={thumbUrl}
                      srcSet={thumb2x ? `${thumbUrl} 1x, ${thumb2x} 2x` : undefined}
                      sizes="(max-width: 768px) 100vw, 640px"
                      alt={post.title || 'post image'}
                      className="w-full max-h-[28rem] object-contain bg-black rounded-vh-lg"
                      loading="lazy"
                      decoding="async"
                    />
                  </button>
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
                
                {/* Images from Supabase Storage */}
                {images.length > 0 && (
                  <div className="mt-4 rounded-vh-lg overflow-hidden">
                    <img
                      src={images[0]}
                      alt={post.title || 'post image'}
                      className="w-full max-h-[80vh] object-contain bg-black rounded-vh-lg"
                      data-testid={`storage-image-${post.id}`}
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
              {post.platforms && post.platforms.map((platform: string) => (
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
            {post.subtype === 'poll' && options.length > 0 && (
              <div className="vh-poll-card mb-4">
                <p className="vh-body-small font-medium text-vh-text-muted mb-3">
                  {(post as any).poll?.question ?? (post as any).poll_question ?? post.title ?? 'Vote on this poll:'}
                </p>
                <div className="space-y-2">
                  {options.map((optionText: string, index: number) => {
                    const voteCount = tallies[index] || 0;
                    const percentage = total > 0 ? Math.round((voteCount / total) * 100) : 0;
                    const isSelected = myVote === index;
                    
                    return (
                      <button
                        key={index}
                        onClick={() => {
                          if (!hasVoted && !voteMutation.isPending) {
                            voteMutation.mutate(index);
                          }
                        }}
                        disabled={hasVoted || voteMutation.isPending}
                        className={cn(
                          "w-full p-3 rounded-vh-md border text-left transition-all duration-200",
                          hasVoted 
                            ? isSelected 
                              ? "border-vh-accent1 bg-vh-accent1-light" 
                              : "border-vh-border bg-vh-surface"
                            : "border-vh-border hover:border-vh-accent1 hover:bg-vh-accent1-light hover:shadow-md cursor-pointer"
                        )}
                        data-testid={`poll-option-${post.id}-${index}`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="vh-body-small font-medium">{optionText}</span>
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
                    Poll results based on {total} votes
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
      <ImageViewerModal
        isOpen={isImageViewerOpen}
        onClose={() => setIsImageViewerOpen(false)}
        imageUrl={originalUrl || post.imageUrl || ''}
        imageAlt={post.title || ""}
      />
    </>
  );
});