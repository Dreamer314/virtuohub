import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ExternalLink, User, Lock } from "lucide-react";

interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

export function SignupModal({ isOpen, onClose, title = "VHUB Charts" }: SignupModalProps) {
  const handleSignup = () => {
    // In a real app, this would redirect to signup page or open signup flow
    console.log("Redirecting to signup...");
    onClose();
  };

  const handleLogin = () => {
    // In a real app, this would redirect to login page or open login modal
    console.log("Redirecting to login...");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <User className="h-6 w-6" />
            Sign up to view full charts
          </DialogTitle>
          <DialogDescription>
            Create a free account to access complete rankings and detailed creator insights.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Feature highlights */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm text-muted-foreground">What you'll get with a free account:</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                Complete Top 25 rankings for all charts
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                Detailed creator profiles and platform data
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                Weekly chart updates and insights
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                Access to community lists and discussions
              </li>
            </ul>
          </div>

          {/* CTA buttons */}
          <div className="space-y-3">
            <Button 
              onClick={handleSignup} 
              className="w-full"
              data-testid="signup-button"
            >
              Create Free Account
            </Button>
            
            <Button 
              variant="outline" 
              onClick={handleLogin} 
              className="w-full"
              data-testid="login-button"
            >
              Already have an account? Log in
            </Button>
          </div>

          {/* Footer note */}
          <div className="text-xs text-muted-foreground text-center pt-4 border-t">
            Free forever. Upgrade to Pro later for advanced analytics and data exports.
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}