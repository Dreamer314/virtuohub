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

interface PostCardProps {
  post: PostWithAuthor;
  currentUserId?: string;
  isDetailView?: boolean;
}

export const PostCard = React.memo(function PostCard({ post, currentUserId = 'user1', isDetailView = false }: PostCardProps) {
  const [isSaved, setIsSaved] = useState(post.isSaved || false);
  const [hasVoted, setHasVoted] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const likeMutation = useMutation({
    mutationFn: () => apiRequest('POST', `/api/posts/${post.id}/like`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/posts'] });
      toast({ title: "Post liked!" });
    }
  });

  const saveMutation = useMutation({
    mutationFn: () => 
      isSaved 
        ? apiRequest('DELETE', `/api/users/${currentUserId}/saved-posts/${post.id}`)
        : apiRequest('POST', `/api/users/${currentUserId}/saved-posts`, { postId: post.id }),
    onSuccess: () => {
      setIsSaved(!isSaved);
      queryClient.invalidateQueries({ queryKey: ['/api/users/user1/saved-posts'] });
      toast({ 
        title: isSaved ? "Post removed from saved" : "Post saved!",
      });
    }
  });

  const [shareSuccess, setShareSuccess] = useState(false);

  const shareMutation = useMutation({
    mutationFn: () => apiRequest('POST', `/api/posts/${post.id}/share`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/posts'] });
      toast({ title: "Post shared!" });
    }
  });

  const handleShare = async () => {
    // For pulse posts, copy link instead of just sharing
    if (post.type === 'pulse') {
      try {
        const url = `${window.location.origin}/thread/${post.id}`;
        await navigator.clipboard.writeText(url);
        setShareSuccess(true);
        setTimeout(() => setShareSuccess(false), 2000);
        toast({ title: "Link copied to clipboard!" });
      } catch (error) {
        // Fallback for browsers that don't support clipboard API
        const url = `${window.location.origin}/thread/${post.id}`;
        const textArea = document.createElement('textarea');
        textArea.value = url;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        setShareSuccess(true);
        setTimeout(() => setShareSuccess(false), 2000);
        toast({ title: "Link copied to clipboard!" });
      }
    } else {
      // Regular posts use normal share mutation
      shareMutation.mutate();
    }
  };

  const voteMutation = useMutation({
    mutationFn: (optionIndex: number) => 
      apiRequest('POST', `/api/posts/${post.id}/vote`, { optionIndex }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/posts'] });
      setHasVoted(true);
      toast({ title: "Vote submitted!" });
    }
  });

  const handleVote = (optionIndex: number) => {
    if (hasVoted) return;
    setSelectedOption(optionIndex);
    voteMutation.mutate(optionIndex);
  };

  // Handle VHub Pulse Posts (Polls)
  if (post.type === 'pulse') {
    const pollData = post.pollData || { question: '', options: [], totalVotes: 0 };
    
    return (
      <article className="bg-sidebar p-4 rounded-lg border border-sidebar-border hover:border-purple-500/50 transition-all duration-300 hover:shadow-lg" data-testid={`pulse-post-${post.id}`}>
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
            <Zap className="w-4 h-4 text-white" />
          </div>
          
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-xs font-medium text-purple-600 dark:text-purple-400">VHub Data Pulse</span>
              <span className="text-xs text-muted-foreground">•</span>
              <span className="text-xs text-muted-foreground" data-testid={`pulse-time-${post.id}`}>
                {formatTimeAgo(post.createdAt ? new Date(post.createdAt) : new Date())}
              </span>
            </div>
            
            {/* Question */}
            <h3 className="text-lg font-semibold mb-4 text-foreground" data-testid={`pulse-question-${post.id}`}>
              {(pollData as any).question || 'Poll question'}
            </h3>
            
            {/* Poll Options */}
            <div className="space-y-3 mb-4">
              {((pollData as any).options || []).map((option: any, index: number) => (
                <button
                  key={index}
                  onClick={() => handleVote(index)}
                  disabled={hasVoted}
                  className={cn(
                    "w-full text-left p-3 rounded-lg border transition-all duration-200",
                    hasVoted 
                      ? "cursor-not-allowed bg-muted" 
                      : "cursor-pointer hover:border-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/20",
                    selectedOption === index && "border-purple-500 bg-purple-50 dark:bg-purple-950/30"
                  )}
                  data-testid={`pulse-option-${post.id}-${index}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{option.text}</span>
                    {hasVoted && (
                      <span className="text-xs text-muted-foreground">
                        {Math.round((option.votes / ((pollData as any).totalVotes || 1)) * 100)}%
                      </span>
                    )}
                  </div>
                  {hasVoted && (
                    <div className="mt-2">
                      <Progress value={(option.votes / ((pollData as any).totalVotes || 1)) * 100} className="h-2" />
                    </div>
                  )}
                </button>
              ))}
            </div>
            
            {/* Poll Stats */}
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
              <span data-testid={`pulse-votes-${post.id}`}>{(pollData as any).totalVotes || 0} votes</span>
              <span>Poll ends in 2 days</span>
            </div>
            
            {/* Actions */}
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => likeMutation.mutate()}
                className="flex items-center space-x-2 hover:border-2 hover:border-gray-300 dark:hover:border-gray-600 border border-transparent transition-all"
                data-testid={`like-button-${post.id}`}
              >
                <ThumbsUp size={16} />
                <span>{post.likes}</span>
              </Button>
              <Link href={`/thread/${post.id}`}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center space-x-2 hover:border-2 hover:border-gray-300 dark:hover:border-gray-600 border border-transparent transition-all"
                  data-testid={`comment-button-${post.id}`}
                >
                  <MessageCircle size={16} />
                  <span>{post.comments} comments</span>
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleShare}
                className="flex items-center space-x-2 hover:border-2 hover:border-gray-300 dark:hover:border-gray-600 border border-transparent transition-all"
                data-testid={`share-button-${post.id}`}
              >
                <Share size={16} />
                <span>
                  {shareSuccess ? 'Link Copied!' : 'Share'}
                </span>
              </Button>
            </div>
          </div>
        </div>
      </article>
    );
  }

  // Handle Creator Insights Posts
  if (post.type === 'insight') {
    return (
      <article className="bg-sidebar p-4 rounded-lg border border-sidebar-border hover:border-amber-500/50 transition-all duration-300 hover:shadow-lg" data-testid={`insight-post-${post.id}`}>
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center flex-shrink-0">
            <Lightbulb className="w-4 h-4 text-white" />
          </div>
          
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-xs font-medium text-amber-600 dark:text-amber-400">Creator Insights</span>
              <span className="text-xs text-muted-foreground">•</span>
              <span className="text-xs text-muted-foreground" data-testid={`insight-time-${post.id}`}>
                {formatTimeAgo(post.createdAt ? new Date(post.createdAt) : new Date())}
              </span>
            </div>
            
            {/* Content */}
            <Link href={`/article/${post.id}`} className="block group">
              <h3 className="text-lg font-semibold mb-2 text-foreground group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors" data-testid={`insight-title-${post.id}`}>
                {post.title}
              </h3>
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2" data-testid={`insight-content-${post.id}`}>
                {post.content}
              </p>
            </Link>
            
            {/* Author Badge */}
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                <span className="text-xs font-bold text-white">
                  {post.author.displayName.charAt(0)}
                </span>
              </div>
              <span className="text-sm font-medium text-foreground" data-testid={`insight-author-${post.id}`}>
                {post.author.displayName}
              </span>
              <Badge variant="secondary" className="text-xs">
                {post.author.role}
              </Badge>
            </div>
            
            {/* Platforms */}
            <div className="flex flex-wrap gap-1 mb-3">
              {post.platforms.map((platform: string) => (
                <Badge 
                  key={platform} 
                  variant="outline" 
                  className={cn("text-xs", getPlatformColor(platform))}
                  data-testid={`insight-platform-${post.id}-${platform}`}
                >
                  {platform}
                </Badge>
              ))}
            </div>
            
            {/* Actions */}
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => likeMutation.mutate()}
                className="flex items-center space-x-2 hover:border-2 hover:border-gray-300 dark:hover:border-gray-600 border border-transparent transition-all"
                data-testid={`like-button-${post.id}`}
              >
                <ThumbsUp size={16} />
                <span>{post.likes}</span>
              </Button>
              <Link href={`/article/${post.id}`}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center space-x-2 hover:border-2 hover:border-gray-300 dark:hover:border-gray-600 border border-transparent transition-all"
                  data-testid={`comment-button-${post.id}`}
                >
                  <MessageCircle size={16} />
                  <span>{post.comments} comments</span>
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleShare}
                className="flex items-center space-x-2 hover:border-2 hover:border-gray-300 dark:hover:border-gray-600 border border-transparent transition-all"
                data-testid={`share-button-${post.id}`}
              >
                <Share size={16} />
                <span>{post.shares}</span>
              </Button>
            </div>
          </div>
        </div>
      </article>
    );
  }

  // Handle Regular Posts (Community Feed)
  return (
    <article className="bg-sidebar p-4 rounded-lg border border-sidebar-border hover:border-primary/30 transition-all duration-300 hover:shadow-md" data-testid={`regular-post-${post.id}`}>
      <div className="flex items-start space-x-3">
        {/* Author Avatar */}
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
          <span className="text-sm font-bold text-white">
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
          <div className="mb-3">
            {!isDetailView ? (
              <Link href={`/thread/${post.id}`} className="block group">
                <h3 className="text-base font-semibold mb-1 text-foreground group-hover:text-primary transition-colors" data-testid={`title-${post.id}`}>
                  {post.title}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-3" data-testid={`content-${post.id}`}>
                  {post.content}
                </p>
              </Link>
            ) : (
              <>
                <h1 className="text-xl font-bold mb-2 text-foreground" data-testid={`title-${post.id}`}>
                  {post.title}
                </h1>
                <div className="text-sm text-foreground whitespace-pre-wrap" data-testid={`content-${post.id}`}>
                  {post.content}
                </div>
              </>
            )}
          </div>
          
          {/* Image */}
          {post.imageUrl && (
            <div className="mb-3 rounded-lg overflow-hidden">
              <img 
                src={post.imageUrl} 
                alt={post.title}
                className="w-full h-auto max-h-96 object-cover"
                data-testid={`image-${post.id}`}
              />
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
          
          {/* Actions and Metadata */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => likeMutation.mutate()}
                className="flex items-center space-x-2 hover:border-2 hover:border-gray-300 dark:hover:border-gray-600 border border-transparent transition-all"
                data-testid={`like-button-${post.id}`}
              >
                <ThumbsUp size={16} />
                <span>{post.likes}</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => saveMutation.mutate()}
                className={cn(
                  "flex items-center space-x-2 hover:border-2 hover:border-gray-300 dark:hover:border-gray-600 border border-transparent transition-all",
                  isSaved && "text-red-500"
                )}
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
                    className="flex items-center space-x-2 hover:border-2 hover:border-gray-300 dark:hover:border-gray-600 border border-transparent transition-all"
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
                  className="flex items-center space-x-2 hover:border-2 hover:border-gray-300 dark:hover:border-gray-600 border border-transparent transition-all"
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
                className="flex items-center space-x-2 hover:border-2 hover:border-gray-300 dark:hover:border-gray-600 border border-transparent transition-all"
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
  );
});