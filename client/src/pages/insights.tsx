import { useQuery } from '@tanstack/react-query';
import { Header } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Calendar, Clock, User, Heart, MessageCircle, Share2 } from 'lucide-react';
import { Link } from 'wouter';
import { formatDistanceToNow } from 'date-fns';
import type { PostWithAuthor } from '@shared/schema';

export default function InsightsPage() {
  const { data: posts = [], isLoading } = useQuery<PostWithAuthor[]>({
    queryKey: ['/api/posts'],
  });

  const insightPosts = posts.filter(post => post.type === 'insight');

  const getArticleSlug = (postId: string) => {
    switch (postId) {
      case 'post4': return 'breaking-creative-blocks-with-ai-tools';
      case 'post5': return 'from-sims-modding-to-virtual-world-design';
      case 'post6': return 'the-future-of-virtual-fashion';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link href="/">
              <Button variant="ghost" className="mb-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Community
              </Button>
            </Link>
            
            <div className="text-center mb-6">
              <h1 className="text-4xl font-bold mb-4">Creator Insights</h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Creator Insights is where we hear from the creators making an impact. We feature innovative minds and showcase their work, but more importantly, they share the real-world wisdom and practical tips that can help you level up.
              </p>
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="glass-card animate-pulse">
                  <div className="h-48 bg-muted rounded-t-lg"></div>
                  <CardContent className="p-6">
                    <div className="h-4 bg-muted rounded w-3/4 mb-3"></div>
                    <div className="h-3 bg-muted rounded w-full mb-2"></div>
                    <div className="h-3 bg-muted rounded w-2/3"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Insights Grid */}
          {!isLoading && (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {insightPosts.map((post) => (
                <Card key={post.id} className="glass-card hover-lift overflow-hidden group">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={post.imageUrl}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  </div>
                  
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-3 line-clamp-2">
                      {post.title}
                    </h3>
                    
                    <p className="text-muted-foreground mb-4 line-clamp-3">
                      {post.content}
                    </p>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        <span>{post.author.displayName}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDistanceToNow(new Date(post.createdAt))} ago</span>
                      </div>
                    </div>

                    {/* Engagement Stats */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Heart className="w-4 h-4" />
                          {post.likes}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageCircle className="w-4 h-4" />
                          {post.comments}
                        </span>
                        <span className="flex items-center gap-1">
                          <Share2 className="w-4 h-4" />
                          {post.shares}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        <Clock className="w-3 h-3 inline mr-1" />
                        Interview
                      </span>
                    </div>

                    <Link href={`/article/${getArticleSlug(post.id)}`}>
                      <Button className="w-full">
                        Read Full Article →
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!isLoading && insightPosts.length === 0 && (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold mb-2">No insights available yet</h3>
              <p className="text-muted-foreground">
                Check back soon for more creator insights and interviews.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}