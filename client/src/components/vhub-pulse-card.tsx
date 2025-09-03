import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ThumbsUp, MessageCircle, Share, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface VHubPulseCardProps {
  poll: {
    id: string;
    title: string;
    content: string;
    question: string;
    options: Array<{
      text: string;
      votes: number;
      percentage: number;
    }>;
    totalVotes: number;
    status: 'active' | 'completed';
    endDate: string;
    tags: string[];
    likes: number;
    comments: number;
    shares: number;
    createdAt: string;
  };
}

export function VHubPulseCard({ poll }: VHubPulseCardProps) {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const queryClient = useQueryClient();

  const voteMutation = useMutation({
    mutationFn: async (optionIndex: number) => {
      const response = await fetch(`/api/pulse/polls/${poll.id}/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ optionIndex }),
      });
      if (!response.ok) {
        throw new Error('Failed to vote');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/pulse/polls', 'active'] });
    },
  });

  const engageMutation = useMutation({
    mutationFn: async (action: 'like' | 'comment' | 'share') => {
      const response = await fetch(`/api/pulse/polls/${poll.id}/engage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action }),
      });
      if (!response.ok) {
        throw new Error('Failed to engage');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/pulse/polls', 'active'] });
    },
  });

  const handleVote = (optionIndex: number) => {
    if (!hasVoted && poll.status === 'active') {
      setSelectedOption(optionIndex);
      setHasVoted(true);
      voteMutation.mutate(optionIndex);
    }
  };

  const handleEngage = (action: 'like' | 'comment' | 'share') => {
    engageMutation.mutate(action);
  };

  const timeUntilEnd = poll.status === 'active' ? new Date(poll.endDate).getTime() - Date.now() : 0;
  const daysLeft = Math.ceil(timeUntilEnd / (1000 * 60 * 60 * 24));

  return (
    <div className="glass-card rounded-xl p-6 space-y-4" data-testid={`pulse-card-${poll.id}`}>
      {/* Admin Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center border border-primary/30">
          <span className="text-lg font-bold text-primary">V</span>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-primary">VHub Data Pulse</span>
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="w-3 h-3" />
            {poll.status === 'active' ? (
              <span>Poll ends in {daysLeft} days</span>
            ) : (
              <span>Poll ended {new Date(poll.endDate).toLocaleDateString()}</span>
            )}
          </div>
        </div>
      </div>

      {/* Title and Content */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-foreground" data-testid={`pulse-title-${poll.id}`}>
          {poll.title}
        </h3>
        <p className="text-muted-foreground" data-testid={`pulse-content-${poll.id}`}>
          {poll.content}
        </p>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2">
        {poll.tags.map((tag, index) => (
          <Badge 
            key={index}
            variant="secondary" 
            className="text-xs bg-primary/10 text-primary border-primary/20"
          >
            {tag}
          </Badge>
        ))}
      </div>

      {/* Poll Options */}
      <div className="space-y-3 p-4 bg-gradient-to-br from-primary/5 to-accent/5 rounded-xl border border-primary/20">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
          <p className="text-sm font-medium text-primary">
            {poll.status === 'active' ? 'Cast your vote' : 'Poll Results'}
          </p>
          <div className="text-xs text-muted-foreground">
            • {poll.totalVotes} votes
          </div>
        </div>
        
        <div className="space-y-3">
          {poll.options.map((option, index) => {
            const isSelected = selectedOption === index;
            const showResults = hasVoted || poll.status === 'completed';
            
            return (
              <button
                key={index}
                onClick={() => handleVote(index)}
                disabled={hasVoted || poll.status === 'completed'}
                className={cn(
                  "w-full p-4 rounded-lg border text-left transition-all group",
                  showResults
                    ? isSelected || poll.status === 'completed'
                      ? "border-primary bg-primary/10" 
                      : "border-border bg-muted/30"
                    : "border-border hover:border-primary hover:bg-accent/10 hover:shadow-sm"
                )}
                data-testid={`pulse-option-${poll.id}-${index}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">{option.text}</span>
                  {showResults && (
                    <span className="text-sm font-semibold text-primary">
                      {option.percentage}%
                    </span>
                  )}
                </div>
                {showResults && (
                  <div className="space-y-1">
                    <Progress 
                      value={option.percentage} 
                      className="h-2"
                      data-testid={`pulse-progress-${poll.id}-${index}`}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{option.votes} votes</span>
                    </div>
                  </div>
                )}
                {!showResults && poll.status === 'active' && (
                  <div className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                    Click to vote
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Engagement Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-border/50">
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEngage('like')}
            className="flex items-center space-x-2 hover:bg-accent/5 dark:hover:bg-accent/10 transition-all duration-200 rounded-md px-2 py-1"
            data-testid={`pulse-like-button-${poll.id}`}
          >
            <ThumbsUp size={16} />
            <span>{poll.likes}</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEngage('comment')}
            className="flex items-center space-x-2 hover:bg-accent/5 dark:hover:bg-accent/10 transition-all duration-200 rounded-md px-2 py-1"
            data-testid={`pulse-comment-button-${poll.id}`}
          >
            <MessageCircle size={16} />
            <span>{poll.comments} comments</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEngage('share')}
            className="flex items-center space-x-2 hover:bg-accent/5 dark:hover:bg-accent/10 transition-all duration-200 rounded-md px-2 py-1"
            data-testid={`pulse-share-button-${poll.id}`}
          >
            <Share size={16} />
            <span>{poll.shares}</span>
          </Button>
        </div>
      </div>
    </div>
  );
}