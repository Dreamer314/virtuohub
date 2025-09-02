import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "wouter";
import { Header } from "@/components/layout/header";
import { LeftSidebar } from "@/components/layout/left-sidebar";
import { PostCard } from "@/components/post-card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, MessageCircle, Heart, Share2, Send, ImageIcon, Smile, Paperclip, Copy, Check } from "lucide-react";
import { Link } from "wouter";
import { formatDistanceToNow } from "date-fns";
import type { PostWithAuthor } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { ObjectUploader } from "@/components/ObjectUploader";
import EmojiPicker from "emoji-picker-react";

export default function ThreadPage() {
  const { postId } = useParams<{ postId: string }>();
  const [commentText, setCommentText] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);
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
    mutationFn: async (data: { content: string; images: string[] }) => {
      return apiRequest('POST', `/api/posts/${postId}/comments`, {
        content: data.content, 
        images: data.images,
        authorId: 'user1'
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/posts', postId, 'comments'] });
      queryClient.invalidateQueries({ queryKey: ['/api/posts', postId] });
      queryClient.invalidateQueries({ queryKey: ['/api/posts'] });
      setCommentText("");
      setUploadedImages([]);
      setShowEmojiPicker(false);
    },
  });

  const handleSubmitComment = () => {
    if (commentText.trim() || uploadedImages.length > 0) {
      commentMutation.mutate({ 
        content: commentText, 
        images: uploadedImages 
      });
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
      
      <div className="flex">
        {/* Fixed Left Sidebar */}
        <div className="hidden lg:block w-64 fixed left-0 top-0 h-screen bg-background/95 backdrop-blur-sm border-r border-border z-10">
          <div className="pt-20 px-4">
            <LeftSidebar
              currentTab={'all'}
              onTabChange={() => {}}
              selectedPlatforms={selectedPlatforms}
              onPlatformChange={setSelectedPlatforms}
            />
          </div>
        </div>
        
        {/* Main Content Area */}
        <div className="flex-1 lg:ml-64">
          <div className="max-w-4xl mx-auto px-6 py-8">
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
              
              {/* Share Button */}
              <div className="mt-4 flex justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={async () => {
                    try {
                      const url = `${window.location.origin}/thread/${postId}`;
                      await navigator.clipboard.writeText(url);
                      setShareSuccess(true);
                      setTimeout(() => setShareSuccess(false), 2000);
                    } catch (error) {
                      // Fallback for browsers that don't support clipboard API
                      const url = `${window.location.origin}/thread/${postId}`;
                      const textArea = document.createElement('textarea');
                      textArea.value = url;
                      document.body.appendChild(textArea);
                      textArea.select();
                      document.execCommand('copy');
                      document.body.removeChild(textArea);
                      setShareSuccess(true);
                      setTimeout(() => setShareSuccess(false), 2000);
                    }
                  }}
                  className="flex items-center gap-2"
                  data-testid="share-thread-button"
                >
                  {shareSuccess ? (
                    <>
                      <Check className="w-4 h-4" />
                      Link Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Share Thread
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Comments Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-6">
                <MessageCircle className="w-5 h-5 text-accent" />
                <h2 className="text-xl font-semibold">
                  Comments ({Array.isArray(comments) ? comments.length : 0})
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
                    
                    {/* Display uploaded images */}
                    {uploadedImages.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {uploadedImages.map((imageUrl, index) => (
                          <div key={index} className="relative">
                            <img 
                              src={imageUrl} 
                              alt={`Upload ${index + 1}`} 
                              className="w-20 h-20 object-cover rounded-lg border"
                            />
                            <button
                              onClick={() => setUploadedImages(prev => prev.filter((_, i) => i !== index))}
                              className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center hover:bg-red-600"
                              data-testid={`remove-image-${index}`}
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {/* Image Upload Button */}
                        <ObjectUploader
                          maxNumberOfFiles={5}
                          maxFileSize={10485760}
                          onGetUploadParameters={async () => {
                            const response = await apiRequest('POST', '/api/objects/upload') as unknown as { uploadURL: string };
                            return {
                              method: 'PUT' as const,
                              url: response.uploadURL,
                            };
                          }}
                          onComplete={(result: any) => {
                            const urls = result.successful?.map((file: any) => file.uploadURL || '') || [];
                            setUploadedImages(prev => [...prev, ...urls]);
                          }}
                          buttonClassName="p-2 h-10 w-10"
                        >
                          <Paperclip className="w-4 h-4" />
                        </ObjectUploader>

                        {/* Emoji Picker Button */}
                        <div className="relative">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                            className="p-2 h-10 w-10"
                            data-testid="emoji-button"
                          >
                            <Smile className="w-4 h-4" />
                          </Button>
                          {showEmojiPicker && (
                            <div className="absolute bottom-12 left-0 z-50">
                              <EmojiPicker
                                onEmojiClick={(emojiData) => {
                                  setCommentText(prev => prev + emojiData.emoji);
                                  setShowEmojiPicker(false);
                                }}
                                width={300}
                                height={400}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <Button
                        onClick={handleSubmitComment}
                        disabled={(!commentText.trim() && uploadedImages.length === 0) || commentMutation.isPending}
                        data-testid="submit-comment-button"
                      >
                        <Send className="w-4 h-4 mr-2" />
                        {commentMutation.isPending ? 'Posting...' : 'Post Comment'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Display Comments */}
              {Array.isArray(comments) && comments.length > 0 ? (
                <div className="space-y-4">
                  {comments.map((comment: any) => (
                    <Card key={comment.id} className="glass-card">
                      <CardContent className="p-6">
                        <div className="flex space-x-4">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-semibold text-sm">
                            {comment.author?.displayName?.[0] || 'A'}
                          </div>
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
    </div>
  );
}