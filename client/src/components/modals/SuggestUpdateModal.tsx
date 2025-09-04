import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { MessageSquare } from "lucide-react";

interface SuggestUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  chartTitle: string;
}

export function SuggestUpdateModal({
  isOpen,
  onClose,
  chartTitle
}: SuggestUpdateModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    type: '',
    creatorName: '',
    platform: '',
    description: '',
    evidence: ''
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Update suggestion submitted",
        description: "Thank you for helping improve our charts. We'll review your suggestion within 24 hours.",
      });
      
      setFormData({
        type: '',
        creatorName: '',
        platform: '',
        description: '',
        evidence: ''
      });
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit suggestion. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Suggest Update for {chartTitle}
          </DialogTitle>
          <DialogDescription>
            Help us keep our charts accurate by suggesting updates or corrections.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="type">Update Type</Label>
            <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select update type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ranking">Ranking Error</SelectItem>
                <SelectItem value="missing">Missing Creator/Platform</SelectItem>
                <SelectItem value="outdated">Outdated Information</SelectItem>
                <SelectItem value="duplicate">Duplicate Entry</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="creatorName">Creator/Platform Name</Label>
            <Input
              id="creatorName"
              value={formData.creatorName}
              onChange={(e) => setFormData(prev => ({ ...prev, creatorName: e.target.value }))}
              placeholder="Enter the name"
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="platform">Platform</Label>
            <Input
              id="platform"
              value={formData.platform}
              onChange={(e) => setFormData(prev => ({ ...prev, platform: e.target.value }))}
              placeholder="e.g., VRChat, Roblox, Unity"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe the issue or suggested change..."
              rows={3}
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="evidence">Evidence/Source (Optional)</Label>
            <Input
              id="evidence"
              value={formData.evidence}
              onChange={(e) => setFormData(prev => ({ ...prev, evidence: e.target.value }))}
              placeholder="Link to source or evidence"
              type="url"
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Suggestion"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}