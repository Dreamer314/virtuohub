import { useRoute } from 'wouter';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { ArrowLeft, Calendar, Clock, Heart, MessageCircle, Share2, User } from 'lucide-react';
import { Link } from 'wouter';
import { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { getDisplayName, getAvatarUrl } from '@/lib/utils';
import type { ArticleWithPost, CommentWithAuthor } from '@shared/schema';

export default function ArticlePage() {
  const [match, params] = useRoute('/article/:slug');
  const [newComment, setNewComment] = useState('');
  const queryClient = useQueryClient();

  const { data: article, isLoading } = useQuery<ArticleWithPost>({
    queryKey: ['/api/articles', params?.slug],
    enabled: !!params?.slug,
  });

  const { data: comments = [] } = useQuery<CommentWithAuthor[]>({
    queryKey: ['/api/articles', article?.id, 'comments'],
    enabled: !!article?.id,
  });

  const createCommentMutation = useMutation({
    mutationFn: async (content: string) => {
      const response = await fetch(`/api/articles/${article?.id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });
      if (!response.ok) throw new Error('Failed to post comment');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/articles', article?.id, 'comments'] });
      setNewComment('');
    },
  });

  const likeCommentMutation = useMutation({
    mutationFn: async (commentId: string) => {
      const response = await fetch(`/api/comments/${commentId}/like`, {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Failed to like comment');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/articles', article?.id, 'comments'] });
    },
  });

  // Update page title and meta description for SEO
  useEffect(() => {
    if (article) {
      document.title = article.seoTitle || `${article.post.title} | VirtuoHub`;
      
      // Update meta description
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', article.seoDescription || article.excerpt);
      } else {
        const meta = document.createElement('meta');
        meta.name = 'description';
        meta.content = article.seoDescription || article.excerpt;
        document.head.appendChild(meta);
      }

      // Add Open Graph tags
      const ogTitle = document.querySelector('meta[property="og:title"]') || document.createElement('meta');
      ogTitle.setAttribute('property', 'og:title');
      ogTitle.setAttribute('content', article.post.title);
      if (!document.querySelector('meta[property="og:title"]')) {
        document.head.appendChild(ogTitle);
      }

      const ogDescription = document.querySelector('meta[property="og:description"]') || document.createElement('meta');
      ogDescription.setAttribute('property', 'og:description');
      ogDescription.setAttribute('content', article.excerpt);
      if (!document.querySelector('meta[property="og:description"]')) {
        document.head.appendChild(ogDescription);
      }

      const ogImage = document.querySelector('meta[property="og:image"]') || document.createElement('meta');
      ogImage.setAttribute('property', 'og:image');
      ogImage.setAttribute('content', article.post.imageUrl || '');
      if (!document.querySelector('meta[property="og:image"]')) {
        document.head.appendChild(ogImage);
      }
    }
  }, [article]);

  const handleSubmitComment = () => {
    if (newComment.trim()) {
      createCommentMutation.mutate(newComment.trim());
    }
  };

  const renderMarkdown = (content: string) => {
    // Simple markdown rendering for headers and paragraphs
    return content
      .split('\n')
      .map((line, index) => {
        if (line.startsWith('# ')) {
          return <h1 key={index} className="text-3xl font-bold mb-4 mt-8 first:mt-0">{line.substring(2)}</h1>;
        }
        if (line.startsWith('## ')) {
          return <h2 key={index} className="text-2xl font-semibold mb-3 mt-6">{line.substring(3)}</h2>;
        }
        if (line.startsWith('### ')) {
          return <h3 key={index} className="text-xl font-medium mb-2 mt-4">{line.substring(4)}</h3>;
        }
        if (line.startsWith('- ') || line.startsWith('* ')) {
          return <li key={index} className="ml-4">{line.substring(2)}</li>;
        }
        if (line.match(/^\d+\. /)) {
          return <li key={index} className="ml-4">{line.replace(/^\d+\. /, '')}</li>;
        }
        if (line.startsWith('**') && line.endsWith('**')) {
          return <p key={index} className="font-semibold mb-2">{line.slice(2, -2)}</p>;
        }
        if (line.trim() === '') {
          return <br key={index} />;
        }
        return <p key={index} className="mb-3 leading-relaxed">{line}</p>;
      });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-64 bg-muted rounded-lg mb-8"></div>
            <div className="space-y-4">
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-4 bg-muted rounded w-full"></div>
              <div className="h-4 bg-muted rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Article Not Found</h1>
          <p className="text-muted-foreground mb-6">The article you're looking for doesn't exist.</p>
          <Link href="/">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Community
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-4 text-sm">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
            Community
          </Link>
          <span className="text-muted-foreground">→</span>
          <Link href="/insights" className="text-muted-foreground hover:text-foreground transition-colors">
            Creator Insights
          </Link>
          <span className="text-muted-foreground">→</span>
          <span className="text-foreground font-medium">{article.post.title}</span>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative h-96 overflow-hidden">
        <OptimizedImage
          src={article.post.imageUrl || '/placeholder-image.jpg'}
          alt={article.post.title}
          width="100%"
          height="384px"
          aspectRatio="wide"
          loading="eager"
          priority={true}
          className="w-full h-full object-cover"
          data-testid="article-hero-image"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
        <div className="absolute top-6 left-6">
          <Link href="/insights">
            <Button variant="secondary" size="sm" className="backdrop-blur-sm bg-white/10 border-white/20">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Creator Insights
            </Button>
          </Link>
        </div>
      </div>

      {/* Article Content */}
      <div className="container mx-auto px-4 -mt-20 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Article Header */}
          <Card className="glass-card mb-8">
            <CardContent className="p-8">
              <h1 className="text-4xl font-bold mb-4">{article.post.title}</h1>
              <p className="text-lg text-muted-foreground mb-6">{article.excerpt}</p>
              
              <div className="flex items-center gap-6 text-sm text-muted-foreground mb-6">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>{article.post.author.displayName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{article.publishDate ? formatDistanceToNow(new Date(article.publishDate)) + ' ago' : 'Recently'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{article.readTime} min read</span>
                </div>
              </div>

              {/* Tags */}
              {article.tags && article.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {article.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-accent/20 text-accent rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Engagement Stats */}
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" className="text-muted-foreground">
                  <Heart className="w-4 h-4 mr-2" />
                  {article.post.likes}
                </Button>
                <Button variant="ghost" size="sm" className="text-muted-foreground">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  {comments.length}
                </Button>
                <Button variant="ghost" size="sm" className="text-muted-foreground">
                  <Share2 className="w-4 h-4 mr-2" />
                  {article.post.shares}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Article Body */}
          <Card className="glass-card mb-8">
            <CardContent className="p-8">
              <div className="prose prose-lg max-w-none dark:prose-invert">
                {renderMarkdown(article.fullContent)}
              </div>
            </CardContent>
          </Card>

          {/* Engagement Actions */}
          <Card className="glass-card mb-8">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <button 
                    className="flex items-center gap-2 text-muted-foreground hover:text-red-500 transition-colors py-2 px-4 rounded-lg hover:bg-red-50 dark:hover:bg-red-950"
                    onClick={() => {
                      // Handle like functionality
                    }}
                  >
                    <Heart className="w-5 h-5" />
                    <span className="font-medium">{article.post.likes}</span>
                    <span className="text-sm">Likes</span>
                  </button>
                  
                  <button 
                    className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors py-2 px-4 rounded-lg hover:bg-primary/10"
                    onClick={() => {
                      document.getElementById('comment-section')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span className="font-medium">{comments.length}</span>
                    <span className="text-sm">Comments</span>
                  </button>
                  
                  <button 
                    className="flex items-center gap-2 text-muted-foreground hover:text-blue-500 transition-colors py-2 px-4 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950"
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      // You could add a toast notification here
                    }}
                  >
                    <Share2 className="w-5 h-5" />
                    <span className="text-sm">Share Link</span>
                  </button>
                </div>
                
                <div className="text-sm text-muted-foreground">
                  {article.post.shares} shares
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Comments Section */}
          <Card className="glass-card" id="comment-section">
            <CardContent className="p-8">
              <h2 className="text-2xl font-semibold mb-6">
                Comments ({comments.length})
              </h2>

              {/* Add Comment */}
              <div className="mb-8">
                <Textarea
                  placeholder="Share your thoughts..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="mb-4"
                  rows={3}
                  data-testid="textarea-new-comment"
                />
                <Button
                  onClick={handleSubmitComment}
                  disabled={!newComment.trim() || createCommentMutation.isPending}
                  data-testid="button-submit-comment"
                >
                  {createCommentMutation.isPending ? 'Posting...' : 'Post Comment'}
                </Button>
              </div>

              {/* Comments List */}
              <div className="space-y-6">
                {comments.map((comment) => (
                  <div key={comment.id} className="border-l-2 border-accent/20 pl-4" data-testid={`comment-${comment.id}`}>
                    <div className="flex items-start gap-4">
                      <img
                        src={getAvatarUrl(comment.author)}
                        alt={getDisplayName(comment?.author)}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-medium">{getDisplayName(comment?.author)}</span>
                          <span className="text-sm text-muted-foreground">
                            {comment.createdAt ? formatDistanceToNow(new Date(comment.createdAt)) + ' ago' : 'Recently'}
                          </span>
                        </div>
                        <p className="text-muted-foreground mb-3">{comment.content}</p>
                        <div className="flex items-center gap-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => likeCommentMutation.mutate(comment.id)}
                            disabled={likeCommentMutation.isPending}
                            className="text-muted-foreground"
                            data-testid={`button-like-comment-${comment.id}`}
                          >
                            <Heart className="w-4 h-4 mr-1" />
                            {comment.likes}
                          </Button>
                        </div>

                        {/* Replies */}
                        {comment.replies && comment.replies.length > 0 && (
                          <div className="mt-4 space-y-4">
                            {comment.replies.map((reply) => (
                              <div key={reply.id} className="flex items-start gap-4" data-testid={`reply-${reply.id}`}>
                                <img
                                  src={getAvatarUrl(reply.author, 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face')}
                                  alt={getDisplayName(reply?.author)}
                                  className="w-8 h-8 rounded-full object-cover"
                                />
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="font-medium text-sm">{getDisplayName(reply?.author)}</span>
                                    <span className="text-xs text-muted-foreground">
                                      {reply.createdAt ? formatDistanceToNow(new Date(reply.createdAt)) + ' ago' : 'Recently'}
                                    </span>
                                  </div>
                                  <p className="text-sm text-muted-foreground mb-2">{reply.content}</p>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => likeCommentMutation.mutate(reply.id)}
                                    disabled={likeCommentMutation.isPending}
                                    className="text-muted-foreground text-xs h-6"
                                  >
                                    <Heart className="w-3 h-3 mr-1" />
                                    {reply.likes}
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}