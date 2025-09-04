import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { X, Plus, Calendar } from 'lucide-react';
import { mockApi } from '@/data/mockApi';
import { useToast } from '@/hooks/use-toast';
import { PollCard } from '@/components/polls/PollCard';
import { nanoid } from 'nanoid';
import type { PlatformKey, Poll } from '@/types/content';

interface CreatePollModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const PLATFORMS: { key: PlatformKey; label: string }[] = [
  { key: 'roblox', label: 'Roblox' },
  { key: 'vrchat', label: 'VRChat' },
  { key: 'secondlife', label: 'Second Life' },
  { key: 'unity', label: 'Unity' },
  { key: 'unreal', label: 'Unreal Engine' },
  { key: 'imvu', label: 'IMVU' },
  { key: 'horizon', label: 'Horizon Worlds' },
  { key: 'other', label: 'Other' }
];

const CATEGORIES = [
  'General',
  'Assets for Sale',
  'Jobs & Gigs',
  'Collaboration & WIP'
];

const DURATION_PRESETS = [
  { label: '24 hours', hours: 24 },
  { label: '3 days', hours: 72 },
  { label: '7 days', hours: 168 },
  { label: 'Custom', hours: 0 }
];

export const CreatePollModal: React.FC<CreatePollModalProps> = ({ 
  isOpen, 
  onClose, 
  onSuccess 
}) => {
  const [formData, setFormData] = useState({
    question: '',
    options: ['', ''],
    allowMultiple: false,
    showResults: 'after-vote' as 'after-vote' | 'after-close',
    duration: 72, // 3 days default
    category: '',
    platforms: [] as PlatformKey[]
  });
  const [customDuration, setCustomDuration] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData(prev => ({ ...prev, options: newOptions }));
  };

  const addOption = () => {
    if (formData.options.length < 6) {
      setFormData(prev => ({ ...prev, options: [...prev.options, ''] }));
    }
  };

  const removeOption = (index: number) => {
    if (formData.options.length > 2) {
      setFormData(prev => ({ 
        ...prev, 
        options: prev.options.filter((_, i) => i !== index) 
      }));
    }
  };

  const togglePlatform = (platform: PlatformKey) => {
    setFormData(prev => ({
      ...prev,
      platforms: prev.platforms.includes(platform)
        ? prev.platforms.filter(p => p !== platform)
        : [...prev.platforms, platform]
    }));
  };

  const handleDurationChange = (hours: number) => {
    if (hours === 0) {
      // Custom duration
      setFormData(prev => ({ ...prev, duration: 0 }));
    } else {
      setFormData(prev => ({ ...prev, duration: hours }));
      setCustomDuration('');
    }
  };

  const getActualDuration = () => {
    if (formData.duration === 0 && customDuration) {
      const parsed = parseInt(customDuration);
      return parsed > 0 ? parsed : 72; // Default to 3 days if invalid
    }
    return formData.duration || 72;
  };

  const validateForm = () => {
    if (formData.question.trim().length < 10) {
      toast({ 
        title: 'Question too short', 
        description: 'Poll question must be at least 10 characters',
        variant: 'destructive' 
      });
      return false;
    }

    const validOptions = formData.options.filter(opt => opt.trim());
    if (validOptions.length < 2) {
      toast({ 
        title: 'Not enough options', 
        description: 'Poll must have at least 2 options',
        variant: 'destructive' 
      });
      return false;
    }

    // Check for duplicate options
    const uniqueOptions = new Set(validOptions.map(opt => opt.trim().toLowerCase()));
    if (uniqueOptions.size !== validOptions.length) {
      toast({ 
        title: 'Duplicate options', 
        description: 'All poll options must be unique',
        variant: 'destructive' 
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const validOptions = formData.options.filter(opt => opt.trim());
      const duration = getActualDuration();
      const closesAt = Date.now() + (duration * 60 * 60 * 1000);

      mockApi.createPoll({
        type: 'poll',
        question: formData.question.trim(),
        options: validOptions.map(label => ({
          id: nanoid(),
          label: label.trim(),
          votes: 0
        })),
        allowMultiple: formData.allowMultiple,
        showResults: formData.showResults,
        closesAt,
        category: formData.category || undefined,
        platforms: formData.platforms.length > 0 ? formData.platforms : undefined,
        author: { id: 'user1', name: 'Alex Chen', avatar: '' }
      });

      toast({ title: 'Poll published successfully!' });
      onSuccess?.();
      onClose();
      
      // Reset form
      setFormData({
        question: '',
        options: ['', ''],
        allowMultiple: false,
        showResults: 'after-vote',
        duration: 72,
        category: '',
        platforms: []
      });
      setCustomDuration('');
    } catch (error) {
      toast({ 
        title: 'Failed to publish poll', 
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Create preview poll
  const previewPoll: Poll = {
    id: 'preview',
    type: 'poll',
    question: formData.question || 'What do you want to ask the community?',
    options: formData.options.filter(opt => opt.trim()).map((label, index) => ({
      id: `preview-${index}`,
      label: label.trim() || `Option ${index + 1}`,
      votes: 0
    })),
    allowMultiple: formData.allowMultiple,
    showResults: formData.showResults,
    closesAt: Date.now() + (getActualDuration() * 60 * 60 * 1000),
    category: formData.category || undefined,
    platforms: formData.platforms.length > 0 ? formData.platforms : undefined,
    createdAt: Date.now(),
    author: { id: 'user1', name: 'Alex Chen', avatar: '' },
    status: 'active'
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create a Poll</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Form Column */}
          <div className="space-y-6">
            {/* Question */}
            <div className="space-y-2">
              <Label htmlFor="question">Poll Question *</Label>
              <Textarea
                id="question"
                value={formData.question}
                onChange={(e) => handleInputChange('question', e.target.value)}
                placeholder="What do you want to ask the community?"
                rows={3}
                data-testid="poll-question-textarea"
              />
              <div className="text-xs text-muted-foreground">
                {formData.question.length}/300 characters (min 10)
              </div>
            </div>

            {/* Options */}
            <div className="space-y-2">
              <Label>Options (min 2, max 6)</Label>
              {formData.options.map((option, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    placeholder="Add an option…"
                    data-testid={`poll-option-input-${index}`}
                  />
                  {formData.options.length > 2 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeOption(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
              {formData.options.length < 6 && (
                <Button variant="outline" size="sm" onClick={addOption}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Option
                </Button>
              )}
            </div>

            {/* Settings */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="allow-multiple">Allow multiple selections</Label>
                <Switch
                  id="allow-multiple"
                  checked={formData.allowMultiple}
                  onCheckedChange={(checked) => handleInputChange('allowMultiple', checked)}
                />
              </div>

              <div className="space-y-2">
                <Label>Show results</Label>
                <Select value={formData.showResults} onValueChange={(value) => handleInputChange('showResults', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="after-vote">After voting</SelectItem>
                    <SelectItem value="after-close">After poll closes</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Poll duration</Label>
                <div className="flex flex-wrap gap-2">
                  {DURATION_PRESETS.map(preset => (
                    <Badge
                      key={preset.label}
                      variant={formData.duration === preset.hours ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => handleDurationChange(preset.hours)}
                    >
                      {preset.label}
                    </Badge>
                  ))}
                </div>
                {formData.duration === 0 && (
                  <div className="flex gap-2 items-center">
                    <Input
                      value={customDuration}
                      onChange={(e) => setCustomDuration(e.target.value)}
                      placeholder="Hours"
                      type="number"
                      min="1"
                      max="168"
                      className="w-24"
                    />
                    <span className="text-sm text-muted-foreground">hours</span>
                  </div>
                )}
              </div>
            </div>

            {/* Optional Settings */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Category (optional)</Label>
                <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map(category => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Platforms (optional)</Label>
                <div className="flex flex-wrap gap-2">
                  {PLATFORMS.map(platform => (
                    <Badge
                      key={platform.key}
                      variant={formData.platforms.includes(platform.key) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => togglePlatform(platform.key)}
                    >
                      {platform.label}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button 
                onClick={handleSubmit}
                disabled={isSubmitting}
                data-testid="publish-poll-button"
              >
                {isSubmitting ? 'Publishing...' : 'Publish Poll'}
              </Button>
            </div>
          </div>

          {/* Preview Column */}
          <div className="space-y-4">
            <Label>Live Preview</Label>
            <div className="border rounded-lg p-4 bg-muted/20">
              <PollCard 
                poll={previewPoll}
                context="feed"
                onUpdate={() => {}}
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};