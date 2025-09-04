import React, { useState, useEffect } from 'react';
import { X, Plus, Clock } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import type { Poll, PlatformKey, PollOption } from '@/types/content';
import { CATEGORIES, PLATFORM_LABELS } from '@/types/content';
import { mockApi } from '@/data/mockApi';
import { PollCard } from '@/components/polls/PollCard';

interface CreatePollModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (poll: Poll) => void;
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

const DURATION_PRESETS = [
  { label: '24 hours', hours: 24 },
  { label: '3 days', hours: 72 },
  { label: '7 days', hours: 168 },
  { label: 'Custom', hours: -1 }
];

export function CreatePollModal({ open, onOpenChange, onSuccess }: CreatePollModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState<string[]>(['', '']);
  const [allowMultiple, setAllowMultiple] = useState(false);
  const [showResults, setShowResults] = useState<'after-vote' | 'after-close'>('after-vote');
  const [durationPreset, setDurationPreset] = useState('72'); // 3 days default
  const [customDuration, setCustomDuration] = useState({ days: 3, hours: 0 });
  const [category, setCategory] = useState('General');
  const [platforms, setPlatforms] = useState<PlatformKey[]>([]);
  
  const { toast } = useToast();
  
  // Calculate closing timestamp
  const getClosingTimestamp = () => {
    const now = Date.now();
    const preset = DURATION_PRESETS.find(p => p.hours.toString() === durationPreset);
    
    if (preset && preset.hours > 0) {
      return now + (preset.hours * 60 * 60 * 1000);
    } else {
      // Custom duration
      const totalHours = (customDuration.days * 24) + customDuration.hours;
      return now + (totalHours * 60 * 60 * 1000);
    }
  };
  
  // Create preview poll for live preview
  const createPreviewPoll = (): Poll => {
    const validOptions = options.filter(opt => opt.trim());
    const pollOptions: PollOption[] = validOptions.map((opt, index) => ({
      id: `preview-opt-${index}`,
      label: opt.trim(),
      votes: 0
    }));
    
    return {
      id: 'preview-poll',
      type: 'poll',
      question: question.trim() || 'What do you want to ask the community?',
      options: pollOptions,
      allowMultiple,
      showResults,
      closesAt: getClosingTimestamp(),
      category,
      platforms,
      createdAt: Date.now(),
      author: {
        id: 'user1',
        name: 'VirtualCreator',
        avatar: undefined
      },
      status: 'active'
    };
  };
  
  const resetForm = () => {
    setQuestion('');
    setOptions(['', '']);
    setAllowMultiple(false);
    setShowResults('after-vote');
    setDurationPreset('72');
    setCustomDuration({ days: 3, hours: 0 });
    setCategory('General');
    setPlatforms([]);
  };
  
  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };
  
  const addOption = () => {
    if (options.length < 6) {
      setOptions(prev => [...prev, '']);
    }
  };
  
  const updateOption = (index: number, value: string) => {
    setOptions(prev => prev.map((opt, i) => i === index ? value : opt));
  };
  
  const removeOption = (index: number) => {
    if (options.length > 2) {
      setOptions(prev => prev.filter((_, i) => i !== index));
    }
  };
  
  const togglePlatform = (platform: PlatformKey) => {
    setPlatforms(prev => 
      prev.includes(platform)
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    );
  };
  
  const validateForm = () => {
    if (!question.trim()) {
      toast({
        title: 'Question required',
        description: 'Please enter a poll question',
        variant: 'destructive'
      });
      return false;
    }
    
    if (question.trim().length < 10) {
      toast({
        title: 'Question too short',
        description: 'Poll question must be at least 10 characters',
        variant: 'destructive'
      });
      return false;
    }
    
    const validOptions = options.filter(opt => opt.trim());
    if (validOptions.length < 2) {
      toast({
        title: 'More options needed',
        description: 'Poll must have at least 2 non-empty options',
        variant: 'destructive'
      });
      return false;
    }
    
    // Check for duplicate options
    const uniqueOptions = new Set(validOptions.map(opt => opt.trim().toLowerCase()));
    if (uniqueOptions.size !== validOptions.length) {
      toast({
        title: 'Duplicate options',
        description: 'Poll options must be unique',
        variant: 'destructive'
      });
      return false;
    }
    
    // Validate custom duration
    if (durationPreset === '-1') {
      const totalHours = (customDuration.days * 24) + customDuration.hours;
      if (totalHours < 1) {
        toast({
          title: 'Invalid duration',
          description: 'Poll must last at least 1 hour',
          variant: 'destructive'
        });
        return false;
      }
      if (totalHours > 30 * 24) { // 30 days max
        toast({
          title: 'Duration too long',
          description: 'Poll cannot last longer than 30 days',
          variant: 'destructive'
        });
        return false;
      }
    }
    
    return true;
  };
  
  const handleSubmit = async () => {
    if (!validateForm() || isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      const validOptions = options.filter(opt => opt.trim());
      const pollOptions: PollOption[] = validOptions.map(opt => ({
        id: generateId(),
        label: opt.trim(),
        votes: 0
      }));
      
      const pollData = {
        type: 'poll' as const,
        question: question.trim(),
        options: pollOptions,
        allowMultiple,
        showResults,
        closesAt: getClosingTimestamp(),
        category,
        platforms,
        author: {
          id: 'user1',
          name: 'VHub Data Pulse',
          avatar: undefined
        }
      };
      
      const poll = mockApi.createPoll(pollData);
      
      toast({
        title: 'Poll published',
        description: 'Your poll has been published successfully'
      });
      
      onSuccess?.(poll);
      handleClose();
    } catch (error) {
      console.error('Failed to create poll:', error);
      toast({
        title: 'Failed to publish',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const validOptions = options.filter(opt => opt.trim());
  const canSubmit = question.trim().length >= 10 && validOptions.length >= 2;
  
  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create a Poll</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left side - Form */}
          <div className="space-y-6">
            {/* Question */}
            <div className="space-y-2">
              <Label htmlFor="question">Poll Question *</Label>
              <Input
                id="question"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="What do you want to ask the community?"
                className="text-base"
                data-testid="poll-question-input"
              />
              <div className="text-xs text-muted-foreground">
                {question.length}/200 characters (min 10)
              </div>
            </div>
            
            {/* Options */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Options (min 2, max 6)</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addOption}
                  disabled={options.length >= 6}
                  className="flex items-center gap-1"
                  data-testid="add-option-button"
                >
                  <Plus className="w-3 h-3" />
                  Add Option
                </Button>
              </div>
              
              {options.map((option, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground min-w-[20px]">{index + 1}.</span>
                  <Input
                    value={option}
                    onChange={(e) => updateOption(index, e.target.value)}
                    placeholder="Add an option…"
                    data-testid={`poll-option-input-${index}`}
                  />
                  {options.length > 2 && (
                    <button
                      onClick={() => removeOption(index)}
                      className="text-destructive hover:text-destructive/80"
                      data-testid={`remove-option-${index}`}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            
            {/* Settings */}
            <div className="space-y-4">
              {/* Allow Multiple */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Allow multiple selections</Label>
                  <div className="text-sm text-muted-foreground">
                    Let users choose more than one option
                  </div>
                </div>
                <Switch
                  checked={allowMultiple}
                  onCheckedChange={setAllowMultiple}
                  data-testid="allow-multiple-toggle"
                />
              </div>
              
              {/* Show Results */}
              <div className="space-y-2">
                <Label>Show results</Label>
                <RadioGroup
                  value={showResults}
                  onValueChange={(value) => setShowResults(value as 'after-vote' | 'after-close')}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="after-vote" id="after-vote" data-testid="show-after-vote" />
                    <Label htmlFor="after-vote" className="text-sm font-normal">
                      After voting (default)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="after-close" id="after-close" data-testid="show-after-close" />
                    <Label htmlFor="after-close" className="text-sm font-normal">
                      After poll closes
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
            
            {/* Duration */}
            <div className="space-y-2">
              <Label>Poll duration</Label>
              <Select value={durationPreset} onValueChange={setDurationPreset}>
                <SelectTrigger data-testid="duration-select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DURATION_PRESETS.map(preset => (
                    <SelectItem key={preset.hours} value={preset.hours.toString()}>
                      {preset.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {durationPreset === '-1' && (
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label htmlFor="custom-days" className="text-xs">Days</Label>
                    <Input
                      id="custom-days"
                      type="number"
                      min="0"
                      max="30"
                      value={customDuration.days}
                      onChange={(e) => setCustomDuration(prev => ({ ...prev, days: parseInt(e.target.value) || 0 }))}
                      data-testid="custom-days-input"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="custom-hours" className="text-xs">Hours</Label>
                    <Input
                      id="custom-hours"
                      type="number"
                      min="0"
                      max="23"
                      value={customDuration.hours}
                      onChange={(e) => setCustomDuration(prev => ({ ...prev, hours: parseInt(e.target.value) || 0 }))}
                      data-testid="custom-hours-input"
                    />
                  </div>
                </div>
              )}
            </div>
            
            {/* Optional Fields */}
            <div className="space-y-4">
              {/* Category */}
              <div className="space-y-2">
                <Label>Category (optional)</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger data-testid="poll-category-select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Platforms */}
              <div className="space-y-2">
                <Label>Platforms (optional)</Label>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(PLATFORM_LABELS).map(([key, label]) => {
                    const isSelected = platforms.includes(key as PlatformKey);
                    return (
                      <Badge
                        key={key}
                        variant={isSelected ? 'default' : 'outline'}
                        className="cursor-pointer"
                        onClick={() => togglePlatform(key as PlatformKey)}
                        data-testid={`poll-platform-${key}`}
                      >
                        {label}
                      </Badge>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
          
          {/* Right side - Live Preview */}
          <div className="space-y-4">
            <div className="sticky top-4">
              <Label className="text-base font-semibold">Live Preview</Label>
              <div className="mt-4">
                <PollCard 
                  poll={createPreviewPoll()} 
                  context="feed" 
                  onUpdate={() => {}} 
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="flex items-center justify-end gap-3 pt-6 border-t">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
            data-testid="cancel-poll-button"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !canSubmit}
            data-testid="publish-poll-button"
          >
            {isSubmitting ? 'Publishing...' : 'Publish Poll'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}