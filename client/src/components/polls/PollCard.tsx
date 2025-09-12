import React, { useState } from 'react';
import { Poll } from '@/types/content';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Users, CheckCircle, BarChart3, Heart, Bookmark, Share } from 'lucide-react';
import { votePoll, hasVoted, getUserVote } from '@/data/mockApi';

interface PollCardProps {
  poll: Poll;
  context: 'feed' | 'pulse';
  onUpdate?: () => void;
  onVote?: (pollId: string, optionIds: string[]) => Promise<void>;
  userHasVoted?: boolean;
  userVoteIds?: string[];
}

export function PollCard({ poll, context, onUpdate, onVote, userHasVoted: providedUserHasVoted, userVoteIds: providedUserVoteIds }: PollCardProps) {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [isVoting, setIsVoting] = useState(false);
  
  // Use provided voting state for pulse context, fallback to mockApi for feed context
  const userHasVoted = providedUserHasVoted !== undefined ? providedUserHasVoted : hasVoted(poll.id);
  const userVote = providedUserVoteIds !== undefined ? providedUserVoteIds : getUserVote(poll.id);
  const totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes, 0);
  const isCompleted = poll.status === 'completed';
  
  // Calculate time remaining
  const timeLeft = Math.max(0, poll.closesAt - Date.now());
  const daysLeft = Math.ceil(timeLeft / (1000 * 60 * 60 * 24));
  const hoursLeft = Math.ceil(timeLeft / (1000 * 60 * 60));
  
  const timeDisplay = isCompleted 
    ? 'Closed' 
    : daysLeft > 0 
      ? `${daysLeft}d left` 
      : `${hoursLeft}h left`;

  const handleOptionSelect = (optionId: string) => {
    if (userHasVoted || isCompleted) return;
    
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
    if (selectedOptions.length === 0 || isVoting) return;
    
    try {
      setIsVoting(true);
      // Use custom onVote prop if provided (for pulse polls), otherwise use default mockApi voting
      if (onVote) {
        await onVote(poll.id, selectedOptions);
      } else {
        await votePoll(poll.id, selectedOptions);
      }
      setSelectedOptions([]);
      onUpdate?.();
    } catch (error) {
      console.error('Voting failed:', error);
    } finally {
      setIsVoting(false);
    }
  };

  const showResults = userHasVoted || isCompleted;
  const showVoting = !userHasVoted && !isCompleted;
  
  // Use unified theme system styling for both contexts
  const cardClasses = context === 'feed' 
    ? "vh-poll-card"
    : "vh-poll-card flex flex-col min-h-[320px]";

  return (
    <article className={cardClasses} data-testid={`poll-card-${poll.id}`}>
      {context === 'feed' ? (
        // Feed layout (horizontal with avatar) - Reddit-style
        <div className="flex space-x-4">
          <div className="flex-shrink-0">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-vh-accent1 text-white font-medium text-lg">
              <BarChart3 className="w-6 h-6" />
            </span>
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <span className="vh-body font-medium" data-testid={`poll-author-${poll.id}`}>
                {poll.author.name}
              </span>
              <Badge variant="secondary" className="text-xs bg-vh-accent2-light text-vh-accent2">
                VHub Data Pulse
              </Badge>
              <span className="text-xs text-vh-text-subtle">•</span>
              <span className="vh-caption" data-testid={`poll-time-${poll.id}`}>
                {Math.floor((Date.now() - poll.createdAt) / (1000 * 60 * 60))}h ago
              </span>
            </div>
            
            <h3 className="vh-heading-5 mb-3" data-testid={`poll-question-${poll.id}`}>
              {poll.question}
            </h3>
            
            <PollContent 
              poll={poll}
              showResults={showResults}
              showVoting={showVoting}
              selectedOptions={selectedOptions}
              userVote={userVote}
              totalVotes={totalVotes}
              onOptionSelect={handleOptionSelect}
            />
            
            <PollFooter 
              poll={poll}
              showVoting={showVoting}
              selectedOptions={selectedOptions}
              isVoting={isVoting}
              totalVotes={totalVotes}
              timeDisplay={timeDisplay}
              userHasVoted={userHasVoted}
              onVote={handleVote}
            />
          </div>
        </div>
      ) : (
        // Pulse page layout (vertical) - Card-based 
        <>
          <div className="flex items-center justify-between mb-4">
            <Badge 
              variant={poll.status === 'active' ? 'default' : 'secondary'}
              className={poll.status === 'active' 
                ? 'bg-vh-success/20 text-vh-success border-vh-success/30' 
                : 'bg-vh-muted/20 text-vh-text-muted border-vh-border'
              }
              data-testid={`poll-status-${poll.id}`}
            >
              {poll.status === 'active' ? 'Active Poll' : 'Completed'}
            </Badge>
            <span className="vh-caption" data-testid={`poll-time-display-${poll.id}`}>
              {timeDisplay}
            </span>
          </div>
          
          <h3 className="vh-heading-4 mb-3" data-testid={`poll-question-pulse-${poll.id}`}>
            {poll.question}
          </h3>
          
          <div className="flex-1">
            <PollContent 
              poll={poll}
              showResults={showResults}
              showVoting={showVoting}
              selectedOptions={selectedOptions}
              userVote={userVote}
              totalVotes={totalVotes}
              onOptionSelect={handleOptionSelect}
            />
          </div>
          
          <div className="mt-auto pt-4 border-t border-vh-border/30">
            <PollFooter 
              poll={poll}
              showVoting={showVoting}
              selectedOptions={selectedOptions}
              isVoting={isVoting}
              totalVotes={totalVotes}
              timeDisplay={timeDisplay}
              userHasVoted={userHasVoted}
              onVote={handleVote}
            />
          </div>
        </>
      )}
    </article>
  );
}

interface PollContentProps {
  poll: Poll;
  showResults: boolean;
  showVoting: boolean;
  selectedOptions: string[];
  userVote: string[] | null;
  totalVotes: number;
  onOptionSelect: (optionId: string) => void;
}

function PollContent({ 
  poll, 
  showResults, 
  showVoting, 
  selectedOptions, 
  userVote, 
  totalVotes, 
  onOptionSelect 
}: PollContentProps) {
  if (showResults) {
    return (
      <div className="space-y-3 mb-4">
        {poll.options.map((option, index) => {
          const percentage = totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0;
          const colors = ['cyan', 'purple', 'yellow', 'green', 'blue', 'pink'];
          const color = colors[index % colors.length];
          const isUserChoice = userVote?.includes(option.id);
          
          return (
            <div 
              key={option.id} 
              className={`relative w-full p-3 rounded-vh-md border transition-vh-fast ${
                isUserChoice 
                  ? 'border-vh-accent1 bg-vh-accent1-light' 
                  : 'border-vh-border bg-vh-surface'
              }`}
              data-testid={`poll-result-${poll.id}-${option.id}`}
            >
              <div className="flex justify-between items-center relative z-10">
                <span className={`vh-body-small font-medium ${isUserChoice ? 'text-vh-accent1' : 'text-vh-text'}`}>
                  {option.label}
                  {isUserChoice && <CheckCircle className="inline w-4 h-4 ml-2 text-vh-accent1" />}
                </span>
                <span className="vh-caption text-vh-text-muted">
                  {option.votes} votes ({percentage.toFixed(0)}%)
                </span>
              </div>
              <div 
                className={`absolute inset-0 bg-vh-accent2/20 rounded-vh-md transition-all duration-300`}
                style={{ width: `${percentage}%` }}
              />
            </div>
          );
        })}
      </div>
    );
  }

  if (showVoting) {
    return (
      <div className="space-y-2 mb-4">
        {poll.options.map((option) => {
          const isSelected = selectedOptions.includes(option.id);
          
          return (
            <button
              key={option.id}
              onClick={() => onOptionSelect(option.id)}
              className={`w-full p-3 text-left rounded-vh-md border transition-vh-fast ${
                isSelected 
                  ? 'border-vh-accent1 bg-vh-accent1-light text-vh-accent1' 
                  : 'border-vh-border hover:border-vh-accent1 hover:bg-vh-accent1-light'
              }`}
              data-testid={`poll-option-${poll.id}-${option.id}`}
            >
              <span className="vh-body-small font-medium">
                {poll.allowMultiple ? '☐' : '○'} {option.label}
              </span>
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="space-y-2 mb-4 opacity-60">
      {poll.options.map((option) => (
        <div key={option.id} className="w-full p-3 border border-vh-border rounded-vh-md">
          <span className="vh-body-small text-vh-text-muted">{option.label}</span>
        </div>
      ))}
      <p className="vh-body-small text-vh-text-muted text-center mt-4">
        Results will be visible when the poll closes.
      </p>
    </div>
  );
}

interface PollFooterProps {
  poll: Poll;
  showVoting: boolean;
  selectedOptions: string[];
  isVoting: boolean;
  totalVotes: number;
  timeDisplay: string;
  userHasVoted: boolean;
  onVote: () => void;
}

function PollFooter({ 
  poll, 
  showVoting, 
  selectedOptions, 
  isVoting, 
  totalVotes, 
  timeDisplay, 
  userHasVoted, 
  onVote 
}: PollFooterProps) {
  return (
    <>
      <div className="flex items-center justify-between mb-3">
        <span className="vh-body-small text-vh-text-muted flex items-center" data-testid={`poll-vote-count-${poll.id}`}>
          <Users className="w-4 h-4 mr-1" />
          {totalVotes} votes
        </span>
        <span className="vh-body-small text-vh-text-muted flex items-center" data-testid={`poll-time-remaining-${poll.id}`}>
          <Clock className="w-4 h-4 mr-1" />
          {timeDisplay}
        </span>
      </div>
      
      {showVoting && (
        <Button
          onClick={onVote}
          disabled={selectedOptions.length === 0 || isVoting}
          className="vh-button w-full"
          data-testid={`poll-vote-button-${poll.id}`}
        >
          {isVoting ? 'Voting...' : 'Vote'}
        </Button>
      )}
      
      {userHasVoted && poll.showResults === 'after-vote' && (
        <div className="flex items-center justify-center vh-body-small text-vh-success" data-testid={`poll-voted-indicator-${poll.id}`}>
          <CheckCircle className="w-4 h-4 mr-1" />
          You voted in this poll
        </div>
      )}
      
      {userHasVoted && poll.showResults === 'after-close' && poll.status === 'active' && (
        <div className="text-center vh-body-small text-vh-text-muted">
          Thanks for voting. Results will be visible when the poll closes.
        </div>
      )}
      
      {/* Engagement actions - Reddit-style */}
      <div className="flex items-center justify-between pt-3 border-t border-vh-border mt-4">
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost" 
            size="sm"
            onClick={() => {
              console.log(`Liked poll: ${poll.id}`);
              // TODO: Implement actual like functionality with backend
            }}
            className="vh-button flex items-center space-x-2 px-2 py-1 hover:bg-accent/10 transition-colors"
            data-testid={`poll-like-${poll.id}`}
          >
            <Heart className="w-4 h-4" />
            <span className="vh-body-small">Like</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              console.log(`Saved poll: ${poll.id}`);
              // TODO: Implement actual save functionality with backend
            }}
            className="vh-button flex items-center space-x-2 px-2 py-1 hover:bg-accent/10 transition-colors"
            data-testid={`poll-save-${poll.id}`}
          >
            <Bookmark className="w-4 h-4" />
            <span className="vh-body-small">Save</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              const shareUrl = `${window.location.origin}/pulse?poll=${poll.id}`;
              navigator.clipboard.writeText(shareUrl);
              console.log(`Shared poll: ${poll.id}`);
              // TODO: Show toast notification
            }}
            className="vh-button flex items-center space-x-2 px-2 py-1 hover:bg-accent/10 transition-colors"
            data-testid={`poll-share-${poll.id}`}
          >
            <Share className="w-4 h-4" />
            <span className="vh-body-small">Share</span>
          </Button>
        </div>
      </div>
    </>
  );
}