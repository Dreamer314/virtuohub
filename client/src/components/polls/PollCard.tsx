import React, { useState } from 'react';
import { Clock, Users, CheckCircle, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import type { Poll } from '@/types/content';
import { mockApi } from '@/data/mockApi';

interface PollCardProps {
  poll: Poll;
  context: 'feed' | 'pulse';
  onUpdate?: () => void;
}

export function PollCard({ poll, context, onUpdate }: PollCardProps) {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [isVoting, setIsVoting] = useState(false);
  
  // Check voting status based on poll type
  const isPulsePoll = poll.author?.name === 'VHub Data Pulse';
  const hasVoted = isPulsePoll 
    ? (() => { try { const { pulseApi } = require('@/data/pulseApi'); return pulseApi.hasVoted(poll.id); } catch { return false; } })()
    : mockApi.hasVoted(poll.id);
  const userVote = hasVoted 
    ? (isPulsePoll 
        ? (() => { try { const { pulseApi } = require('@/data/pulseApi'); const vote = pulseApi.getUserVote(poll.id); return vote !== undefined ? [poll.options[vote]?.id].filter(Boolean) : []; } catch { return []; } })()
        : mockApi.getUserVote(poll.id))
    : [];
  const totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes, 0);
  const isCompleted = poll.status === 'completed';
  
  // Calculate time remaining
  const timeLeft = Math.max(0, poll.closesAt - Date.now());
  const daysLeft = Math.ceil(timeLeft / (1000 * 60 * 60 * 24));
  const hoursLeft = Math.ceil(timeLeft / (1000 * 60 * 60));
  
  // Time display
  const getTimeDisplay = () => {
    if (isCompleted) {
      const endedDaysAgo = Math.floor((Date.now() - poll.closesAt) / (1000 * 60 * 60 * 24));
      return `Closed ${endedDaysAgo} days ago`;
    }
    if (daysLeft > 0) {
      return `Ends in ${daysLeft} day${daysLeft !== 1 ? 's' : ''}`;
    }
    if (hoursLeft > 0) {
      return `Ends in ${hoursLeft} hour${hoursLeft !== 1 ? 's' : ''}`;
    }
    return 'Ending soon';
  };
  
  const handleVote = async () => {
    if (selectedOptions.length === 0 || isVoting || hasVoted || isCompleted) return;
    
    setIsVoting(true);
    try {
      // Check if this is a legacy pulse poll or a new unified poll
      if (poll.author?.name === 'VHub Data Pulse') {
        // Use legacy pulse API for pulse polls
        const { pulseApi } = await import('@/data/pulseApi');
        const optionIndex = poll.options.findIndex(opt => selectedOptions.includes(opt.id));
        if (optionIndex >= 0) {
          pulseApi.vote(poll.id, optionIndex);
        }
      } else {
        // Use new unified API for regular polls
        await mockApi.votePoll(poll.id, selectedOptions);
      }
      setSelectedOptions([]);
      onUpdate?.();
    } catch (error) {
      console.error('Vote failed:', error);
    } finally {
      setIsVoting(false);
    }
  };
  
  const handleOptionChange = (optionId: string, checked: boolean) => {
    if (poll.allowMultiple) {
      setSelectedOptions(prev => 
        checked 
          ? [...prev, optionId]
          : prev.filter(id => id !== optionId)
      );
    } else {
      setSelectedOptions(checked ? [optionId] : []);
    }
  };
  
  const showResults = hasVoted || isCompleted || (poll.showResults === 'after-vote' && hasVoted);
  const canVote = !hasVoted && !isCompleted && selectedOptions.length > 0;
  
  const cardClasses = context === 'feed' 
    ? "enhanced-card hover-lift group p-6 transition-all duration-200 flex flex-col min-h-[280px]"
    : "enhanced-card hover-lift rounded-xl p-6 border border-green-500/30 flex flex-col min-h-[320px]";
    
  return (
    <article className={cardClasses} data-testid={`poll-card-${poll.id}`}>
      {context === 'feed' && (
        <div className="flex space-x-4 flex-1">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white font-medium text-lg">
              <Zap className="w-6 h-6" />
            </span>
          </div>
          
          <div className="flex-1 min-w-0 flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <span className="font-medium text-foreground">{poll.author.name}</span>
                <span className="text-xs text-muted-foreground">•</span>
                <span className="text-xs text-muted-foreground">
                  {Math.floor((Date.now() - poll.createdAt) / (1000 * 60 * 60))}h ago
                </span>
                <span className="inline-block px-2 py-1 text-xs font-medium bg-primary/10 text-primary border border-primary/20 rounded-full">Poll</span>
              </div>
            </div>
            
            {/* Poll Question */}
            <h3 className="text-lg font-semibold text-foreground mb-4">
              {poll.question}
            </h3>
            
            {/* Poll Options */}
            <div className="space-y-3 mb-4 flex-1">
              {showResults ? (
                // Show results
                poll.options.map((option, index) => {
                  const percentage = totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0;
                  const isUserChoice = userVote.includes(option.id);
                  
                  return (
                    <div key={option.id} className={`relative w-full p-3 border rounded-lg ${
                      isUserChoice ? 'border-primary bg-primary/5' : 'border-border bg-muted/20'
                    }`}>
                      <div className="flex justify-between items-center relative z-10">
                        <span className="text-sm font-medium text-foreground">{option.label}</span>
                        <span className="text-xs text-muted-foreground">
                          {option.votes} votes ({percentage.toFixed(0)}%)
                        </span>
                      </div>
                      <div className="absolute inset-0 bg-primary/10 rounded-lg" style={{ width: `${percentage}%` }}></div>
                    </div>
                  );
                })
              ) : (
                // Show voting options
                <div className="space-y-2">
                  {poll.allowMultiple ? (
                    // Checkbox mode
                    poll.options.map((option) => (
                      <div key={option.id} className="flex items-center space-x-2 p-3 border border-border rounded-lg hover:border-primary/50 transition-colors">
                        <Checkbox
                          id={`option-${option.id}`}
                          checked={selectedOptions.includes(option.id)}
                          onCheckedChange={(checked) => handleOptionChange(option.id, checked as boolean)}
                          data-testid={`poll-option-${poll.id}-${option.id}`}
                        />
                        <Label htmlFor={`option-${option.id}`} className="text-sm font-medium text-foreground cursor-pointer flex-1">
                          {option.label}
                        </Label>
                      </div>
                    ))
                  ) : (
                    // Radio mode
                    <RadioGroup
                      value={selectedOptions[0] || ''}
                      onValueChange={(value) => setSelectedOptions(value ? [value] : [])}
                    >
                      {poll.options.map((option) => (
                        <div key={option.id} className="flex items-center space-x-2 p-3 border border-border rounded-lg hover:border-primary/50 transition-colors">
                          <RadioGroupItem
                            value={option.id}
                            id={`option-${option.id}`}
                            data-testid={`poll-option-${poll.id}-${option.id}`}
                          />
                          <Label htmlFor={`option-${option.id}`} className="text-sm font-medium text-foreground cursor-pointer flex-1">
                            {option.label}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      {context === 'pulse' && (
        <>
          <div className="flex items-center justify-between mb-4">
            <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
              isCompleted 
                ? 'bg-slate-500/20 text-slate-300 border border-slate-500/30'
                : 'bg-green-500/20 text-green-300 border border-green-500/30'
            }`}>
              {isCompleted ? 'Completed' : 'Active Poll'}
            </span>
            <span className="text-sm text-muted-foreground">{getTimeDisplay()}</span>
          </div>
          
          <h3 className="text-lg font-semibold text-foreground mb-3">
            {poll.question}
          </h3>
          
          <div className="flex-1">
            {showResults ? (
              <div className="space-y-3 mb-4">
                {poll.options.map((option, index) => {
                  const percentage = totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0;
                  const colors = ['cyan', 'purple', 'yellow', 'green', 'blue', 'pink'];
                  const color = colors[index % colors.length];
                  const isUserChoice = userVote.includes(option.id);
                  
                  return (
                    <div key={option.id} className={`flex justify-between items-center p-2 rounded ${
                      isUserChoice ? 'bg-primary/5' : ''
                    }`}>
                      <span className="text-sm text-muted-foreground">{option.label}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                          <div className={`h-full bg-${color}-500 rounded-full`} style={{width: `${percentage}%`}}></div>
                        </div>
                        <span className={`text-sm text-${color}-400`}>{percentage.toFixed(0)}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-2 mb-4">
                {poll.allowMultiple ? (
                  poll.options.map((option) => (
                    <div key={option.id} className="flex items-center space-x-2 p-3 border border-border rounded-lg hover:border-primary/50 transition-colors">
                      <Checkbox
                        id={`pulse-option-${option.id}`}
                        checked={selectedOptions.includes(option.id)}
                        onCheckedChange={(checked) => handleOptionChange(option.id, checked as boolean)}
                        data-testid={`poll-option-${poll.id}-${option.id}`}
                      />
                      <Label htmlFor={`pulse-option-${option.id}`} className="text-sm font-medium text-foreground cursor-pointer flex-1">
                        {option.label}
                      </Label>
                    </div>
                  ))
                ) : (
                  <RadioGroup
                    value={selectedOptions[0] || ''}
                    onValueChange={(value) => setSelectedOptions(value ? [value] : [])}
                  >
                    {poll.options.map((option) => (
                      <div key={option.id} className="flex items-center space-x-2 p-3 border border-border rounded-lg hover:border-primary/50 transition-colors">
                        <RadioGroupItem
                          value={option.id}
                          id={`pulse-option-${option.id}`}
                          data-testid={`poll-option-${poll.id}-${option.id}`}
                        />
                        <Label htmlFor={`pulse-option-${option.id}`} className="text-sm font-medium text-foreground cursor-pointer flex-1">
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                )}
              </div>
            )}
          </div>
        </>
      )}
      
      {/* Sticky Bottom Section */}
      <div className="mt-auto pt-4 border-t border-border/30">
        {/* Vote Button */}
        {!showResults && !isCompleted && (
          <Button 
            onClick={handleVote}
            disabled={!canVote || isVoting}
            className="w-full mb-3 bg-primary hover:bg-primary/90"
            data-testid={`vote-button-${poll.id}`}
          >
            {isVoting ? 'Voting...' : 'Vote'}
          </Button>
        )}
        
        {/* Poll Meta */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-muted-foreground flex items-center">
            <Users className="w-4 h-4 mr-1" />
            {totalVotes} vote{totalVotes !== 1 ? 's' : ''}
          </span>
          <span className="text-sm text-muted-foreground flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            {getTimeDisplay()}
          </span>
        </div>
        
        {/* Status Messages */}
        {!hasVoted && !isCompleted && selectedOptions.length === 0 && (
          <div className="text-center text-sm text-muted-foreground">
            {poll.allowMultiple ? 'Select one or more options above' : 'Click an option above to vote'}
          </div>
        )}
        
        {hasVoted && poll.showResults === 'after-close' && !isCompleted && (
          <div className="text-center text-sm text-muted-foreground">
            Thanks for voting. Results will be visible when the poll closes.
          </div>
        )}
        
        {hasVoted && (poll.showResults === 'after-vote' || isCompleted) && (
          <div className="flex items-center justify-center text-sm text-green-400">
            <CheckCircle className="w-4 h-4 mr-1" />
            You voted in this poll
          </div>
        )}
        
        {isCompleted && !hasVoted && (
          <div className="text-center text-sm text-muted-foreground">
            This poll has closed
          </div>
        )}
      </div>
    </article>
  );
}