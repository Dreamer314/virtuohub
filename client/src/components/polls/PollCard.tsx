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
}

export function PollCard({ poll, context, onUpdate }: PollCardProps) {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [isVoting, setIsVoting] = useState(false);
  
  const userHasVoted = hasVoted(poll.id);
  const userVote = getUserVote(poll.id);
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
      await votePoll(poll.id, selectedOptions);
      setSelectedOptions([]);
      onUpdate?.();
    } catch (error) {
      console.error('Voting failed:', error);
    } finally {
      setIsVoting(false);
    }
  };

  const showResults = userHasVoted || isCompleted || poll.showResults === 'after-vote';
  const showVoting = !userHasVoted && !isCompleted;
  
  // Different styling based on context
  const cardClasses = context === 'feed' 
    ? "enhanced-card hover-lift p-6 space-y-4 transition-all duration-200"
    : "enhanced-card hover-lift rounded-xl p-6 border border-blue-500/30 flex flex-col min-h-[320px]";

  return (
    <article className={cardClasses} data-testid={`poll-card-${poll.id}`}>
      {context === 'feed' ? (
        // Feed layout (horizontal with avatar)
        <div className="flex space-x-4">
          <div className="flex-shrink-0">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white font-medium text-lg">
              <BarChart3 className="w-6 h-6" />
            </span>
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <span className="font-medium text-foreground">{poll.author.name}</span>
                <Badge variant="secondary" className="text-xs">Poll</Badge>
                <span className="text-xs text-muted-foreground">•</span>
                <span className="text-xs text-muted-foreground">
                  {Math.floor((Date.now() - poll.createdAt) / (1000 * 60 * 60))}h ago
                </span>
              </div>
            </div>
            
            <h3 className="text-lg font-semibold text-foreground mb-4">
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
        // Pulse page layout (vertical)
        <>
          <div className="flex items-center justify-between mb-4">
            <Badge 
              variant={poll.status === 'active' ? 'default' : 'secondary'}
              className={poll.status === 'active' ? 'bg-green-500/20 text-green-300 border-green-500/30' : 'bg-slate-500/20 text-slate-300 border-slate-500/30'}
            >
              {poll.status === 'active' ? 'Active Poll' : 'Completed'}
            </Badge>
            <span className="text-sm text-muted-foreground">{timeDisplay}</span>
          </div>
          
          <h3 className="text-lg font-semibold text-foreground mb-3">
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
          
          <div className="mt-auto pt-4 border-t border-border/30">
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
              className={`relative w-full p-3 border rounded-lg transition-colors ${
                isUserChoice 
                  ? 'border-primary bg-primary/10' 
                  : 'border-border bg-muted/20'
              }`}
            >
              <div className="flex justify-between items-center relative z-10">
                <span className={`text-sm font-medium ${isUserChoice ? 'text-primary' : 'text-foreground'}`}>
                  {option.label}
                  {isUserChoice && <CheckCircle className="inline w-4 h-4 ml-2" />}
                </span>
                <span className="text-xs text-muted-foreground">
                  {option.votes} votes ({percentage.toFixed(0)}%)
                </span>
              </div>
              <div 
                className={`absolute inset-0 bg-${color}-500/20 rounded-lg transition-all duration-300`}
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
              className={`w-full p-3 text-left border rounded-lg transition-colors ${
                isSelected 
                  ? 'border-primary bg-primary/10 text-primary' 
                  : 'border-border hover:border-primary/50'
              }`}
              data-testid={`poll-option-${poll.id}-${option.id}`}
            >
              <span className="text-sm font-medium">
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
        <div key={option.id} className="w-full p-3 border border-border rounded-lg">
          <span className="text-sm text-muted-foreground">{option.label}</span>
        </div>
      ))}
      <p className="text-sm text-muted-foreground text-center mt-4">
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
        <span className="text-sm text-muted-foreground flex items-center">
          <Users className="w-4 h-4 mr-1" />
          {totalVotes} votes
        </span>
        <span className="text-sm text-muted-foreground flex items-center">
          <Clock className="w-4 h-4 mr-1" />
          {timeDisplay}
        </span>
      </div>
      
      {showVoting && (
        <Button
          onClick={onVote}
          disabled={selectedOptions.length === 0 || isVoting}
          className="w-full"
          data-testid={`poll-vote-button-${poll.id}`}
        >
          {isVoting ? 'Voting...' : 'Vote'}
        </Button>
      )}
      
      {userHasVoted && poll.showResults === 'after-vote' && (
        <div className="flex items-center justify-center text-sm text-green-400">
          <CheckCircle className="w-4 h-4 mr-1" />
          You voted in this poll
        </div>
      )}
      
      {userHasVoted && poll.showResults === 'after-close' && poll.status === 'active' && (
        <div className="text-center text-sm text-muted-foreground">
          Thanks for voting. Results will be visible when the poll closes.
        </div>
      )}
      
      {/* Engagement actions */}
      <div className="flex items-center justify-between pt-3 border-t border-border mt-4">
        <div className="flex items-center space-x-4">
          <button 
            className="flex items-center space-x-1 text-sm text-muted-foreground hover:text-red-500 transition-colors"
            data-testid={`poll-like-${poll.id}`}
          >
            <Heart className="w-4 h-4" />
            <span>Like</span>
          </button>
          <button 
            className="flex items-center space-x-1 text-sm text-muted-foreground hover:text-blue-500 transition-colors"
            data-testid={`poll-save-${poll.id}`}
          >
            <Bookmark className="w-4 h-4" />
            <span>Save</span>
          </button>
          <button 
            className="flex items-center space-x-1 text-sm text-muted-foreground hover:text-green-500 transition-colors"
            data-testid={`poll-share-${poll.id}`}
          >
            <Share className="w-4 h-4" />
            <span>Share</span>
          </button>
        </div>
      </div>
    </>
  );
}