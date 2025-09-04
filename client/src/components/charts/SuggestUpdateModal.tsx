import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { X, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SuggestUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SuggestUpdateModal({ isOpen, onClose }: SuggestUpdateModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    suggestion: '',
    url: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.suggestion.trim()) {
      toast({
        title: "Suggestion required",
        description: "Please tell us what should be updated.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call - in real app would send to backend
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock store the suggestion
      const suggestions = JSON.parse(localStorage.getItem('chartSuggestions') || '[]');
      suggestions.push({
        ...formData,
        timestamp: new Date().toISOString(),
        id: Date.now().toString()
      });
      localStorage.setItem('chartSuggestions', JSON.stringify(suggestions));
      
      setIsSubmitted(true);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit suggestion. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({ name: '', email: '', suggestion: '', url: '' });
    setIsSubmitted(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background border rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        {isSubmitted ? (
          <div className="p-6 text-center space-y-4">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto" />
            <h3 className="text-lg font-semibold">Thank you!</h3>
            <p className="text-muted-foreground">
              Your suggestion has been submitted. Submissions are reviewed and may take up to 7 days to reflect.
            </p>
            <Button onClick={handleClose} className="w-full">
              Close
            </Button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-semibold">Suggest an Update</h3>
              <Button variant="ghost" size="sm" onClick={handleClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name (optional)</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Your name"
                    data-testid="input-name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email (optional)</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="your@email.com"
                    data-testid="input-email"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="suggestion">What should we update? *</Label>
                <Textarea
                  id="suggestion"
                  value={formData.suggestion}
                  onChange={(e) => setFormData(prev => ({ ...prev, suggestion: e.target.value }))}
                  placeholder="Tell us what needs to be updated, corrected, or added..."
                  required
                  rows={4}
                  data-testid="textarea-suggestion"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="url">Relevant URL (optional)</Label>
                <Input
                  id="url"
                  type="url"
                  value={formData.url}
                  onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
                  placeholder="https://..."
                  data-testid="input-url"
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  className="flex-1"
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={isSubmitting}
                  data-testid="button-submit-suggestion"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit'}
                </Button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}