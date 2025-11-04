import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Heart, MessageCircle, Share, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/lib/supabaseClient';
import { queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

type AuthorLite = {
  id: string;
  handle: string | null;
  display_name: string | null;
  avatar_url: string | null;
};

type SpotlightCommentRow = {
  id: string;
  body: string;
  created_at: string;
  user_id: string | null;
  author?: AuthorLite;
};

interface SpotlightEngagementProps {
  spotlightId: string;
}

export function SpotlightEngagement({ spotlightId }: SpotlightEngagementProps) {
  const { toast } = useToast();
  const [newComment, setNewComment] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setCurrentUser(data.user));
  }, []);

  // Fetch likes count
  const { data: likesCount = 0 } = useQuery({
    queryKey: ['spotlight-likes', spotlightId],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('spotlight_likes')
        .select('*', { count: 'exact', head: true })
        .eq('spotlight_id', spotlightId);
      if (error) throw error;
      return count || 0;
    }
  });

  // Check if current user liked
  const { data: userLiked = false } = useQuery({
    queryKey: ['spotlight-user-liked', spotlightId, currentUser?.id],
    queryFn: async () => {
      if (!currentUser) return false;
      const { data, error } = await supabase
        .from('spotlight_likes')
        .select('id')
        .eq('spotlight_id', spotlightId)
        .eq('user_id', currentUser.id)
        .single();
      return !!data;
    },
    enabled: !!currentUser
  });

  // Fetch comments with author info
  const { data: comments = [], error: commentsError } = useQuery<SpotlightCommentRow[]>({
    queryKey: ['spotlight-comments', spotlightId],
    queryFn: async () => {
      // Step A: Fetch comments
      const { data: commentsData, error: commentsErr } = await supabase
        .from('spotlight_comments')
        .select('id, body, created_at, user_id')
        .eq('spotlight_id', spotlightId)
        .order('created_at', { ascending: false });

      if (commentsErr) {
        console.error('Failed to load comments', commentsErr);
        throw commentsErr;
      }

      const comments = commentsData ?? [];

      // Step B: Fetch authors from v1 profiles
      const userIds = Array.from(
        new Set(comments.map(c => c.user_id).filter((v): v is string => !!v))
      );

      let authors: AuthorLite[] = [];

      if (userIds.length) {
        const { data: authorRows = [], error: authorsErr } = await supabase
          .from('profiles') // v1 table
          .select('id, handle, display_name, avatar_url')
          .in('id', userIds);

        if (authorsErr) {
          console.error('Failed to load authors', authorsErr);
        }

        authors = authorRows ?? [];
      }

      const authorById: Record<string, AuthorLite> = Object.fromEntries(
        authors.map(a => [a.id, a as AuthorLite])
      );

      const rows: SpotlightCommentRow[] = comments.map(c => ({
        ...c,
        author: c.user_id
          ? authorById[c.user_id] ?? {
              id: c.user_id,
              handle: null,
              display_name: 'User',
              avatar_url: null,
            }
          : {
              id: 'anonymous',
              handle: null,
              display_name: 'User',
              avatar_url: null,
            },
      }));

      return rows;
    },
    enabled: !!spotlightId
  });

  // Like mutation
  const likeMutation = useMutation({
    mutationFn: async () => {
      if (!currentUser) throw new Error('Not logged in');
      
      if (userLiked) {
        // Unlike
        const { error } = await supabase
          .from('spotlight_likes')
          .delete()
          .eq('spotlight_id', spotlightId)
          .eq('user_id', currentUser.id);
        if (error) throw error;
      } else {
        // Like
        const { error } = await supabase
          .from('spotlight_likes')
          .insert({ spotlight_id: spotlightId, user_id: currentUser.id });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['spotlight-likes', spotlightId] });
      queryClient.invalidateQueries({ queryKey: ['spotlight-user-liked', spotlightId] });
    },
    onError: () => {
      toast({ title: 'Error', description: 'Please log in to like this spotlight', variant: 'destructive' });
    }
  });

  // Comment mutation
  const commentMutation = useMutation({
    mutationFn: async (body: string) => {
      if (!currentUser) throw new Error('Not logged in');
      const { error } = await supabase
        .from('spotlight_comments')
        .insert({ spotlight_id: spotlightId, user_id: currentUser.id, body });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['spotlight-comments', spotlightId] });
      setNewComment('');
    },
    onError: () => {
      toast({ title: 'Error', description: 'Please log in to comment', variant: 'destructive' });
    }
  });

  const handleLike = () => {
    likeMutation.mutate();
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setShareSuccess(true);
    setTimeout(() => setShareSuccess(false), 2000);
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      commentMutation.mutate(newComment);
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
            disabled={!currentUser || likeMutation.isPending}
            className={`flex items-center space-x-2 hover:bg-transparent ${
              userLiked 
                ? 'text-red-500 hover:text-red-400' 
                : 'text-muted-foreground hover:text-red-500'
            }`}
            data-testid={`like-button-${spotlightId}`}
          >
            <Heart 
              size={20} 
              className={userLiked ? 'fill-current' : ''} 
            />
            <span>{likesCount}</span>
          </Button>

          <Button
            variant="ghost"
            onClick={() => setShowComments(!showComments)}
            className="flex items-center space-x-2 text-muted-foreground hover:text-accent hover:bg-transparent"
            data-testid={`comment-button-${spotlightId}`}
          >
            <MessageCircle size={20} />
            <span>{comments.length}</span>
          </Button>

          <Button
            variant="ghost"
            onClick={handleShare}
            className="flex items-center space-x-2 text-muted-foreground hover:text-accent hover:bg-transparent"
            data-testid={`share-button-${spotlightId}`}
          >
            <Share size={20} />
            <span>{shareSuccess ? 'Link Copied!' : 'Share'}</span>
          </Button>
        </div>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="space-y-4">
          {/* Error State */}
          {commentsError && (
            <p className="text-xs text-muted-foreground">Couldn't load comments.</p>
          )}

          {/* Comments List */}
          {!commentsError && comments.length > 0 && (
            <div className="space-y-4 mb-4">
              {comments.map((comment) => {
                const name = comment.author?.display_name || comment.author?.handle || 'User';
                const avatarUrl = comment.author?.avatar_url;
                const initial = name.charAt(0).toUpperCase();

                return (
                  <div key={comment.id} className="flex space-x-3">
                    {avatarUrl ? (
                      <img 
                        src={avatarUrl} 
                        alt={name}
                        className="w-8 h-8 rounded-full flex-shrink-0 object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-teal-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-white">
                          {initial}
                        </span>
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium text-foreground text-sm">
                          {name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(comment.created_at).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {comment.body}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Add Comment */}
          <div className="flex space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-bold text-white">Y</span>
            </div>
            <div className="flex-1 space-y-2">
              <Textarea
                placeholder="Share your thoughts on this spotlight..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                disabled={!currentUser}
                className="min-h-[80px] resize-none"
                data-testid={`comment-input-${spotlightId}`}
              />
              <Button
                onClick={handleAddComment}
                disabled={!currentUser || !newComment.trim() || commentMutation.isPending}
                className="ml-auto flex items-center space-x-2"
                data-testid={`submit-comment-${spotlightId}`}
              >
                <Send size={16} />
                <span>Comment</span>
              </Button>
              {!currentUser && (
                <p className="text-xs text-muted-foreground">Please log in to comment</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
