import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Users, CheckCircle } from 'lucide-react';
import { mockApi } from '@/data/mockApi';
import { useToast } from '@/hooks/use-toast';
import type { Poll } from '@/types/content';

interface PollCardProps {
  poll: Poll;
  context: 'feed' | 'pulse';
  onUpdate?: () => void;
}

export const PollCard: React.FC<PollCardProps> = ({ poll, context, onUpdate }) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [isVoting, setIsVoting] = useState(false);
  const { toast } = useToast();

  const hasVoted = mockApi.hasVoted(poll.id);
  const userVote = mockApi.getUserVote(poll.id);
  const totalVotes = poll.options.reduce((sum, option) => sum + option.votes, 0);
  const isExpired = poll.status === 'completed';

  const timeLeft = Math.max(0, poll.closesAt - Date.now());
  const daysLeft = Math.ceil(timeLeft / (1000 * 60 * 60 * 24));
  const hoursLeft = Math.ceil(timeLeft / (1000 * 60 * 60));

  const handleOptionSelect = (optionId: string) => {
    if (hasVoted || isExpired) return;

    if (poll.allowMultiple) {
      setSelectedOptions(prev => 
        prev.includes(optionId) 
          ? prev.filter(id => id !== optionId)
          : [...prev, optionId]
      );
    } else {
      setSelectedOptions([optionId]);
    }
  };

  const handleVote = async () => {
    if (selectedOptions.length === 0 || hasVoted || isExpired) return;

    setIsVoting(true);
    try {
      await mockApi.votePoll(poll.id, selectedOptions);
      toast({ title: 'Vote recorded successfully!' });
      onUpdate?.();
      setSelectedOptions([]);
    } catch (error) {
      toast({ 
        title: 'Vote failed', 
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive'
      });
    } finally {
      setIsVoting(false);
    }
  };

  const shouldShowResults = hasVoted || 
    (poll.showResults === 'after-close' && isExpired) ||
    (poll.showResults === 'after-vote' && hasVoted);

  const getTimeDisplay = () => {
    if (isExpired) {
      const endDate = new Date(poll.closesAt);
      return `Closed on ${endDate.toLocaleDateString()}`;
    }
    
    if (daysLeft > 0) {
      return `Ends in ${daysLeft}d`;
    } else if (hoursLeft > 0) {
      return `Ends in ${hoursLeft}h`;
    } else {
      return 'Ending soon';
    }
  };

  return (
    <article className={`enhanced-card hover-lift rounded-xl p-6 border ${
      context === 'feed' 
        ? 'border-primary/20' 
        : poll.status === 'active' 
          ? 'border-green-500/30' 
          : 'border-slate-500/30'
    } flex flex-col min-h-[280px]`}>
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs">
            Poll
          </Badge>
          {poll.status === 'active' && (
            <Badge variant="outline" className="text-xs text-green-400 border-green-400">
              Active
            </Badge>
          )}
          {poll.status === 'completed' && (
            <Badge variant="outline" className="text-xs text-slate-400 border-slate-400">
              Completed
            </Badge>
          )}
        </div>
        <span className="text-sm text-muted-foreground">
          {getTimeDisplay()}
        </span>
      </div>

      {/* Question */}
      <h3 className="text-lg font-semibold text-foreground mb-4">
        {poll.question}
      </h3>

      {/* Options */}
      <div className="flex-1 mb-4">
        {shouldShowResults ? (
          <div className="space-y-3">
            {poll.options.map((option) => {
              const percentage = totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0;
              const isUserChoice = userVote?.includes(option.id);
              
              return (
                <div key={option.id} className="relative">
                  <div className={`w-full p-3 border rounded-lg ${
                    isUserChoice ? 'border-primary bg-primary/10' : 'border-border bg-muted/20'
                  }`}>
                    <div className="flex justify-between items-center relative z-10">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-foreground">
                          {option.label}
                        </span>
                        {isUserChoice && (
                          <CheckCircle className="w-4 h-4 text-primary" />
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {option.votes} votes ({percentage.toFixed(0)}%)
                      </span>
                    </div>
                    <div 
                      className="absolute inset-0 bg-primary/10 rounded-lg transition-all duration-300" 
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="space-y-2">
            {poll.options.map((option) => (
              <button
                key={option.id}
                onClick={() => handleOptionSelect(option.id)}
                disabled={hasVoted || isExpired}
                className={`w-full p-3 text-left border rounded-lg transition-colors ${
                  selectedOptions.includes(option.id)
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:border-primary/50'
                } ${hasVoted || isExpired ? 'opacity-50 cursor-not-allowed' : ''}`}
                data-testid={`poll-option-${poll.id}-${option.id}`}
              >
                <div className="flex items-center gap-2">
                  {poll.allowMultiple ? (
                    <div className={`w-4 h-4 border rounded ${
                      selectedOptions.includes(option.id) 
                        ? 'bg-primary border-primary' 
                        : 'border-border'
                    }`}>
                      {selectedOptions.includes(option.id) && (
                        <CheckCircle className="w-3 h-3 text-white" />
                      )}
                    </div>
                  ) : (
                    <div className={`w-4 h-4 border rounded-full ${
                      selectedOptions.includes(option.id) 
                        ? 'bg-primary border-primary' 
                        : 'border-border'
                    }`}>
                      {selectedOptions.includes(option.id) && (
                        <div className="w-2 h-2 bg-white rounded-full m-0.5" />
                      )}
                    </div>
                  )}
                  <span className="text-sm font-medium text-foreground">
                    {option.label}
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Voting Section */}
      {!hasVoted && !isExpired && selectedOptions.length > 0 && (
        <div className="mb-4">
          <Button 
            onClick={handleVote}
            disabled={isVoting}
            className="w-full"
            data-testid={`vote-button-${poll.id}`}
          >
            {isVoting ? 'Voting...' : 'Vote'}
          </Button>
        </div>
      )}

      {/* Sticky Bottom Section */}
      <div className="mt-auto pt-4 border-t border-border/30">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground flex items-center">
            <Users className="w-4 h-4 mr-1" />
            {totalVotes} votes
          </span>
          <span className="text-sm text-muted-foreground flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            {daysLeft > 0 ? `${daysLeft} days left` : 
             hoursLeft > 0 ? `${hoursLeft} hours left` : 
             isExpired ? 'Ended' : 'Ending soon'}
          </span>
        </div>

        {!hasVoted && !isExpired && selectedOptions.length === 0 && (
          <div className="text-center text-sm text-muted-foreground">
            {poll.allowMultiple ? 'Select one or more options' : 'Select an option to vote'}
          </div>
        )}

        {hasVoted && poll.showResults === 'after-close' && !isExpired && (
          <div className="text-center text-sm text-green-400">
            Thanks for voting. Results will be visible when the poll closes.
          </div>
        )}

        {hasVoted && shouldShowResults && (
          <div className="flex items-center justify-center text-sm text-green-400">
            <CheckCircle className="w-4 h-4 mr-1" />
            You voted in this poll
          </div>
        )}
      </div>
    </article>
  );
};