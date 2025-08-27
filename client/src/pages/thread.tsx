import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "wouter";
import { Header } from "@/components/layout/header";
import { PostCard } from "@/components/post-card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, MessageCircle, Heart, Share2, Send } from "lucide-react";
import { Link } from "wouter";
import { formatDistanceToNow } from "date-fns";
import type { PostWithAuthor } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

export default function ThreadPage() {
  const { postId } = useParams<{ postId: string }>();
  const [commentText, setCommentText] = useState("");
  const queryClient = useQueryClient();

  // Fetch the specific post
  const { data: post, isLoading: postLoading } = useQuery<PostWithAuthor>({
    queryKey: ['/api/posts', postId],
    enabled: !!postId,
  });

  // Fetch comments for this post (placeholder - would need backend implementation)
  const { data: comments = [] } = useQuery({
    queryKey: ['/api/posts', postId, 'comments'],
    enabled: !!postId,
  });

  // Comment submission mutation
  const commentMutation = useMutation({
    mutationFn: async (content: string) => {
      return apiRequest(`/api/posts/${postId}/comments`, {
        method: 'POST',
        body: { content, authorId: 'user1' }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/posts', postId, 'comments'] });
      setCommentText("");
    },
  });

  const handleSubmitComment = () => {
    if (commentText.trim()) {
      commentMutation.mutate(commentText);
    }
  };

  if (postLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-muted rounded w-1/4"></div>
              <div className="h-64 bg-muted rounded"></div>
              <div className="h-32 bg-muted rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-2xl font-bold mb-4">Post not found</h1>
            <Link href="/">
              <Button>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Community
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Link href="/">
            <Button variant="ghost" className="mb-6">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Community
            </Button>
          </Link>

          {/* Main Post */}
          <div className="mb-8">
            <PostCard post={post} isDetailView={true} />
          </div>

          {/* Comments Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-6">
              <MessageCircle className="w-5 h-5 text-accent" />
              <h2 className="text-xl font-semibold">
                Comments ({comments.length})
              </h2>
            </div>

            {/* Comment Form */}
            <Card className="glass-card">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <Textarea
                    placeholder="Share your thoughts..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    className="min-h-[100px] resize-none"
                    data-testid="comment-textarea"
                  />
                  <div className="flex justify-end">
                    <Button
                      onClick={handleSubmitComment}
                      disabled={!commentText.trim() || commentMutation.isPending}
                      data-testid="submit-comment-button"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      {commentMutation.isPending ? 'Posting...' : 'Post Comment'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Comments List */}
            {comments.length > 0 ? (
              <div className="space-y-4">
                {comments.map((comment: any) => (
                  <Card key={comment.id} className="glass-card">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-full flex-shrink-0"></div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-semibold text-sm">{comment.author?.displayName || 'Anonymous'}</span>
                            <span className="text-xs text-muted-foreground">
                              {formatDistanceToNow(new Date(comment.createdAt))} ago
                            </span>
                          </div>
                          <p className="text-sm text-foreground mb-3">
                            {comment.content}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <button className="flex items-center gap-1 hover:text-foreground transition-colors">
                              <Heart className="w-3 h-3" />
                              {comment.likes || 0}
                            </button>
                            <button className="hover:text-foreground transition-colors">
                              Reply
                            </button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="glass-card">
                <CardContent className="p-8 text-center">
                  <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">No comments yet</h3>
                  <p className="text-muted-foreground text-sm">
                    Be the first to share your thoughts on this post!
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}