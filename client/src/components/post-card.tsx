import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { type PostWithAuthor } from "@shared/schema";
import { ThumbsUp, MessageCircle, Share, Heart, Zap, Lightbulb, Clock } from "lucide-react";
import { Link } from "wouter";

interface PostCardProps {
  post: PostWithAuthor;
  currentUserId?: string;
  isDetailView?: boolean;
}

export function PostCard({ post, currentUserId = 'user1', isDetailView = false }: PostCardProps) {
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

  const shareMutation = useMutation({
    mutationFn: () => apiRequest('POST', `/api/posts/${post.id}/share`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/posts'] });
      toast({ title: "Post shared!" });
    }
  });

  const voteMutation = useMutation({
    mutationFn: (optionIndex: number) => 
      apiRequest('POST', `/api/posts/${post.id}/vote`, { optionIndex }),
    onSuccess: () => {
      setHasVoted(true);
      queryClient.invalidateQueries({ queryKey: ['/api/posts'] });
      toast({ 
        title: "Vote submitted!",
        description: "Thank you for participating in VHub Pulse!"
      });
    }
  });

  const getPlatformColor = (platform: string) => {
    const colors: Record<string, string> = {
      'VRChat': 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200',
      'Roblox': 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200',
      'Second Life': 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200',
      'IMVU': 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-200',
      'GTA RP': 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200',
      'The Sims': 'bg-pink-100 dark:bg-pink-900/30 text-pink-800 dark:text-pink-200',
      'Other': 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-200',
    };
    return colors[platform] || colors['Other'];
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Assets for Sale': 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200',
      'Jobs & Gigs': 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-200',
      'Collaboration & WIP': 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200',
      'General': 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-200',
    };
    return colors[category] || colors['General'];
  };

  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - new Date(date).getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours === 1) return '1 hour ago';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return '1 day ago';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    
    return new Date(date).toLocaleDateString();
  };

  const renderPostContent = () => {
    if (post.type === 'pulse' && post.pollData) {
      return (
        <div className="space-y-4" data-testid={`poll-${post.id}`}>
          <h2 className="text-xl font-display font-semibold text-foreground">
            {post.title}
          </h2>
          
          <p className="text-sm text-muted-foreground">Tap an option to vote.</p>
          
          <div className="space-y-3">
            {(post.pollData as any)?.options?.map((option: any, index: number) => (
              <button
                key={index}
                onClick={() => {
                  if (!hasVoted) {
                    setSelectedOption(index);
                    voteMutation.mutate(index);
                  }
                }}
                disabled={hasVoted || voteMutation.isPending}
                className={`w-full p-3 rounded-lg border transition-all duration-200 ${
                  selectedOption === index
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border hover:border-primary/50 bg-card hover:border-2'
                } ${hasVoted || voteMutation.isPending ? 'cursor-not-allowed opacity-75' : 'cursor-pointer'}`}
                data-testid={`poll-option-${post.id}-${index}`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-left font-medium">{option.text}</span>
                  <div className="flex items-center space-x-3">
                    <Progress value={option.percentage} className="w-24 h-2" />
                    <span className="text-sm text-muted-foreground min-w-[3rem] text-right">
                      {option.percentage}%
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
          
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-sm flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              Ends in 2 days • Results show after a few votes
            </span>
            {hasVoted && (
              <span className="text-sm text-primary font-medium">✓ Vote submitted</span>
            )}
          </div>
        </div>
      );
    }

    if (post.type === 'insight') {
      return (
        <div className="flex items-start space-x-4" data-testid={`insight-${post.id}`}>
          <img 
            src={post.imageUrl || post.author.avatar || ''} 
            alt="Featured creator portrait" 
            className="w-16 h-16 rounded-xl object-cover" 
          />
          <div className="flex-1">
            <h2 className="text-xl font-display font-semibold mb-2 text-foreground">
              {post.title}
            </h2>
            <p className="text-muted-foreground mb-4">{post.content}</p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">15 min read • Interview</span>
              <Button size="sm" variant="secondary" className="transition-all" data-testid={`read-more-${post.id}`}>
                Read More
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <>
        {post.imageUrl && (
          <img 
            src={post.imageUrl} 
            alt={post.title} 
            className="w-full h-48 object-cover" 
            data-testid={`post-image-${post.id}`}
          />
        )}
        
        <div className="p-6">
          <h2 className="text-xl font-display font-semibold mb-3 text-foreground">
            {post.title}
          </h2>
          <p className="text-muted-foreground mb-4">{post.content}</p>
        </div>
      </>
    );
  };

  return (
    <article 
      className={`glass-card rounded-xl overflow-hidden hover-lift bg-gradient-to-br from-card/95 to-card/90 backdrop-blur-sm border-2 border-border/30 shadow-lg hover:shadow-xl transition-all duration-300 ${
        post.type === 'pulse' ? 'border-l-4 border-primary' : 
        post.type === 'insight' ? 'border-l-4 border-accent' : ''
      }`}
      data-testid={`post-card-${post.id}`}
    >
      {/* Post Type Badge */}
      {post.type !== 'regular' && (
        <div className="px-6 pt-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              {post.type === 'pulse' ? (
                <>
                  <Zap className="text-primary" size={16} />
                  <span className="text-sm font-semibold text-primary">VHub Pulse</span>
                </>
              ) : (
                <>
                  <Lightbulb className="text-accent" size={16} />
                  <span className="text-sm font-semibold text-accent">Creator Insight</span>
                </>
              )}
            </div>
            {post.type === 'pulse' && (
              <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full border border-primary/20">
                Official VHub Poll
              </span>
            )}
          </div>
        </div>
      )}

      {/* Author Header */}
      {post.type === 'regular' && (
        <div className="p-6 pb-0">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <img 
                src={post.author.avatar || `/images/vr-creator.png`} 
                alt={post.author.displayName}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <h3 className="font-semibold text-foreground" data-testid={`author-name-${post.id}`}>
                  {post.author.displayName}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {post.author.role} • {getTimeAgo(post.createdAt || new Date())}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => saveMutation.mutate()}
              className={`save-button transition-all ${isSaved ? 'saved text-red-500' : 'text-muted-foreground hover:text-red-500'}`}
              data-testid={`save-button-${post.id}`}
            >
              <Heart className={`text-lg ${isSaved ? 'fill-current' : ''}`} size={20} />
            </Button>
          </div>
        </div>
      )}

      {/* Post Content */}
      <div className={post.type !== 'regular' ? 'px-6 pb-4' : ''}>
        {renderPostContent()}
      </div>

      {/* Tags and Engagement */}
      <div className={`px-6 ${post.type === 'regular' ? 'pt-0 ' : ''}pb-6`}>
        {/* Platform and Category Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {post.platforms.map((platform) => (
            <Badge 
              key={platform} 
              className={`platform-tag px-3 py-1 rounded-full text-sm font-medium ${getPlatformColor(platform)}`}
              data-testid={`platform-tag-${platform}-${post.id}`}
            >
              {platform}
            </Badge>
          ))}
          <Badge 
            className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(post.category)}`}
            data-testid={`category-tag-${post.id}`}
          >
            {post.category}
          </Badge>
        </div>

        {/* Engagement Actions */}
        <div className="flex items-center justify-between text-muted-foreground">
          <div className="flex items-center space-x-6">
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
            {isDetailView ? (
              <div className="flex items-center space-x-2 text-muted-foreground">
                <MessageCircle size={16} />
                <span>{post.comments}</span>
              </div>
            ) : (
              <Link href={`/thread/${post.id}`}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center space-x-2 hover:border-2 hover:border-gray-300 dark:hover:border-gray-600 border border-transparent transition-all"
                  data-testid={`comment-button-${post.id}`}
                >
                  <MessageCircle size={16} />
                  <span>{post.comments} Join Discussion</span>
                </Button>
              </Link>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => shareMutation.mutate()}
              className="flex items-center space-x-2 hover:border-2 hover:border-gray-300 dark:hover:border-gray-600 border border-transparent transition-all"
              data-testid={`share-button-${post.id}`}
            >
              <Share size={16} />
              <span>{post.shares}</span>
            </Button>
          </div>
          {post.price && (
            <span className="text-sm font-medium text-green-600 dark:text-green-400" data-testid={`price-${post.id}`}>
              {post.price}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
