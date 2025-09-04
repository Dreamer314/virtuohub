import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { X, Plus, BarChart3, Clock, Users } from 'lucide-react';
import { PlatformKey, CATEGORIES, PLATFORMS } from '@/types/content';
import { createPoll, getCurrentUser } from '@/data/mockApi';
import { useToast } from '@/hooks/use-toast';

const createPollSchema = z.object({
  question: z.string().min(10, 'Question must be at least 10 characters').max(200, 'Question too long'),
  options: z.array(z.string().min(1, 'Option cannot be empty')).min(2, 'At least 2 options required').max(6, 'Maximum 6 options allowed'),
  allowMultiple: z.boolean(),
  showResults: z.enum(['after-vote', 'after-close']),
  duration: z.string(),
  category: z.string().optional(),
  platforms: z.array(z.string()).optional(),
});

type CreatePollForm = z.infer<typeof createPollSchema>;

interface CreatePollModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPollCreated?: () => void;
}

const DURATION_OPTIONS = [
  { value: '24h', label: '24 hours', ms: 24 * 60 * 60 * 1000 },
  { value: '3d', label: '3 days', ms: 3 * 24 * 60 * 60 * 1000 },
  { value: '7d', label: '7 days', ms: 7 * 24 * 60 * 60 * 1000 },
  { value: '30d', label: '30 days', ms: 30 * 24 * 60 * 60 * 1000 },
];

function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

export function CreatePollModal({ open, onOpenChange, onPollCreated }: CreatePollModalProps) {
  const [options, setOptions] = useState<string[]>(['', '']);
  const [selectedPlatforms, setSelectedPlatforms] = useState<PlatformKey[]>([]);
  const [allowMultiple, setAllowMultiple] = useState(false);
  const [showResults, setShowResults] = useState<'after-vote' | 'after-close'>('after-vote');
  const [duration, setDuration] = useState('7d');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<CreatePollForm>({
    resolver: zodResolver(createPollSchema),
    defaultValues: {
      question: '',
      options: ['', ''],
      allowMultiple: false,
      showResults: 'after-vote',
      duration: '7d',
      category: 'General',
      platforms: [],
    },
  });

  const question = form.watch('question');

  const handleOptionChange = (index: number, value: string) => {
    const updated = [...options];
    updated[index] = value;
    setOptions(updated);
    
    const validOptions = updated.filter(opt => opt.trim());
    form.setValue('options', validOptions);
  };

  const addOption = () => {
    if (options.length < 6) {
      setOptions([...options, '']);
    }
  };

  const removeOption = (index: number) => {
    if (options.length > 2) {
      const updated = options.filter((_, i) => i !== index);
      setOptions(updated);
      
      const validOptions = updated.filter(opt => opt.trim());
      form.setValue('options', validOptions);
    }
  };

  const handlePlatformToggle = (platform: PlatformKey) => {
    setSelectedPlatforms(prev => {
      const updated = prev.includes(platform)
        ? prev.filter(p => p !== platform)
        : [...prev, platform];
      form.setValue('platforms', updated);
      return updated;
    });
  };

  const getDurationMs = (durationValue: string): number => {
    const option = DURATION_OPTIONS.find(opt => opt.value === durationValue);
    return option?.ms || DURATION_OPTIONS[2].ms; // Default to 7 days
  };

  const onSubmit = async (data: CreatePollForm) => {
    try {
      setIsSubmitting(true);
      
      const validOptions = options.filter(opt => opt.trim());
      if (validOptions.length < 2) {
        toast({
          title: 'Invalid poll',
          description: 'Please provide at least 2 non-empty options',
          variant: 'destructive',
        });
        return;
      }

      const closesAt = Date.now() + getDurationMs(duration);
      
      const poll = createPoll({
        type: 'poll',
        question: data.question,
        options: validOptions.map(label => ({
          id: generateId(),
          label,
          votes: 0
        })),
        allowMultiple,
        showResults,
        closesAt,
        category: data.category,
        platforms: selectedPlatforms,
        author: getCurrentUser(),
      });

      toast({
        title: 'Poll published',
        description: 'Your poll is now live and visible in the community feed and pulse reports',
      });

      // Reset form
      form.reset();
      setOptions(['', '']);
      setSelectedPlatforms([]);
      setAllowMultiple(false);
      setShowResults('after-vote');
      setDuration('7d');
      
      onPollCreated?.();
      onOpenChange(false);
    } catch (error) {
      toast({
        title: 'Failed to create poll',
        description: 'Please try again',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Live preview poll object
  const previewPoll = {
    id: 'preview',
    type: 'poll' as const,
    question: question || 'What do you want to ask the community?',
    options: options.filter(opt => opt.trim()).map((label, index) => ({
      id: `preview-opt-${index}`,
      label,
      votes: 0
    })),
    allowMultiple,
    showResults,
    closesAt: Date.now() + getDurationMs(duration),
    category: form.watch('category'),
    platforms: selectedPlatforms,
    createdAt: Date.now(),
    author: getCurrentUser(),
    status: 'active' as const
  };

  const timeLeft = Math.max(0, previewPoll.closesAt - Date.now());
  const daysLeft = Math.ceil(timeLeft / (1000 * 60 * 60 * 24));
  const hoursLeft = Math.ceil(timeLeft / (1000 * 60 * 60));
  const timeDisplay = daysLeft > 0 ? `${daysLeft}d left` : `${hoursLeft}h left`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create a Poll</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left side - Form */}
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Question */}
            <div className="space-y-2">
              <Label htmlFor="question">Poll Question *</Label>
              <Input
                id="question"
                placeholder="What do you want to ask the community?"
                {...form.register('question')}
                data-testid="poll-question-input"
              />
              {form.formState.errors.question && (
                <p className="text-sm text-red-500">{form.formState.errors.question.message}</p>
              )}
            </div>

            {/* Options */}
            <div className="space-y-2">
              <Label>Options *</Label>
              {options.map((option, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder="Add an option..."
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    data-testid={`poll-option-${index}`}
                  />
                  {options.length > 2 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeOption(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              {options.length < 6 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addOption}
                  className="w-full"
                  data-testid="add-poll-option"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Option
                </Button>
              )}
              {form.formState.errors.options && (
                <p className="text-sm text-red-500">{form.formState.errors.options.message}</p>
              )}
            </div>

            {/* Allow Multiple */}
            <div className="flex items-center space-x-2">
              <Switch
                id="allowMultiple"
                checked={allowMultiple}
                onCheckedChange={(checked) => {
                  setAllowMultiple(checked);
                  form.setValue('allowMultiple', checked);
                }}
                data-testid="allow-multiple-toggle"
              />
              <Label htmlFor="allowMultiple">Allow multiple selections</Label>
            </div>

            {/* Show Results */}
            <div className="space-y-2">
              <Label>Show results</Label>
              <RadioGroup
                value={showResults}
                onValueChange={(value: 'after-vote' | 'after-close') => {
                  setShowResults(value);
                  form.setValue('showResults', value);
                }}
                data-testid="show-results-radio"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="after-vote" id="after-vote" />
                  <Label htmlFor="after-vote">After voting (default)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="after-close" id="after-close" />
                  <Label htmlFor="after-close">After poll closes</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Duration */}
            <div className="space-y-2">
              <Label>Poll duration</Label>
              <Select 
                value={duration}
                onValueChange={(value) => {
                  setDuration(value);
                  form.setValue('duration', value);
                }}
              >
                <SelectTrigger data-testid="poll-duration-select">
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  {DURATION_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label>Category (optional)</Label>
              <Select 
                defaultValue="General"
                onValueChange={(value) => form.setValue('category', value)}
              >
                <SelectTrigger data-testid="poll-category-select">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Platforms */}
            <div className="space-y-2">
              <Label>Platforms (optional)</Label>
              <div className="flex flex-wrap gap-2">
                {PLATFORMS.map((platform) => (
                  <Badge
                    key={platform.key}
                    variant={selectedPlatforms.includes(platform.key) ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => handlePlatformToggle(platform.key)}
                    data-testid={`poll-platform-${platform.key}`}
                  >
                    {platform.label}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Submit */}
            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || !question || options.filter(opt => opt.trim()).length < 2}
                data-testid="poll-submit-button"
              >
                {isSubmitting ? 'Publishing...' : 'Publish Poll'}
              </Button>
            </div>
          </form>

          {/* Right side - Live Preview */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Live Preview</h3>
            
            <div className="enhanced-card hover-lift p-6 space-y-4 transition-all duration-200">
              <div className="flex space-x-4">
                <div className="flex-shrink-0">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white font-medium text-lg">
                    <BarChart3 className="w-6 h-6" />
                  </span>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-foreground">{previewPoll.author.name}</span>
                      <Badge variant="secondary" className="text-xs">Poll</Badge>
                      <span className="text-xs text-muted-foreground">•</span>
                      <span className="text-xs text-muted-foreground">now</span>
                    </div>
                  </div>
                  
                  <h4 className="text-lg font-semibold text-foreground mb-4">
                    {previewPoll.question}
                  </h4>
                  
                  <div className="space-y-2 mb-4">
                    {previewPoll.options.length > 0 ? (
                      previewPoll.options.map((option, index) => (
                        <div
                          key={option.id}
                          className="w-full p-3 text-left border border-border rounded-lg opacity-80"
                        >
                          <span className="text-sm font-medium">
                            {allowMultiple ? '☐' : '○'} {option.label || `Option ${index + 1}`}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="text-sm text-muted-foreground text-center py-4">
                        Add options to see preview
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-muted-foreground flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      0 votes
                    </span>
                    <span className="text-sm text-muted-foreground flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {timeDisplay}
                    </span>
                  </div>
                  
                  <Button className="w-full" disabled>
                    Vote
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="text-sm text-muted-foreground">
              <p>This is how your poll will appear in:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Community feed (mixed with posts)</li>
                <li>Pulse Reports → Active Polls section</li>
              </ul>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}