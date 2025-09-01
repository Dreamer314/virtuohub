import { Box, Heart, Github, Twitter, MessageSquare, Mail } from "lucide-react";
import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-border bg-sidebar/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 gradient-bg rounded-lg flex items-center justify-center">
                <Box className="text-white text-sm" size={16} />
              </div>
              <span className="text-xl font-display font-bold gradient-text">VirtuoHub</span>
            </div>
            <p className="text-muted-foreground mb-4 max-w-md">
              The industry home for immersive creators. Learn, ship, and grow together.
            </p>
            <p className="text-muted-foreground text-sm mb-4 max-w-md">
              A new era for a fragmented industry.<br />
              Free to join. Creator led. New features regularly.
            </p>
            <div className="flex items-center space-x-4">
              <a 
                href="#" 
                className="text-muted-foreground hover:text-accent transition-colors"
                data-testid="footer-discord"
              >
                <MessageSquare size={20} />
              </a>
              <a 
                href="#" 
                className="text-muted-foreground hover:text-accent transition-colors"
                data-testid="footer-twitter"
              >
                <Twitter size={20} />
              </a>
              <a 
                href="#" 
                className="text-muted-foreground hover:text-accent transition-colors"
                data-testid="footer-github"
              >
                <Github size={20} />
              </a>
              <a 
                href="#" 
                className="text-muted-foreground hover:text-accent transition-colors"
                data-testid="footer-email"
              >
                <Mail size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Quick Links</h3>
            <div className="space-y-2">
              <Link href="/" className="block text-muted-foreground hover:text-accent transition-colors" data-testid="footer-community">
                Community
              </Link>
              <a href="#" className="block text-muted-foreground hover:text-accent transition-colors" data-testid="footer-learn">
                Learn
              </a>
              <a href="#" className="block text-muted-foreground hover:text-accent transition-colors" data-testid="footer-earn">
                Earn
              </a>
              <a href="#" className="block text-muted-foreground hover:text-accent transition-colors" data-testid="footer-connect">
                Connect
              </a>
            </div>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Resources</h3>
            <div className="space-y-2">
              <a href="#" className="block text-muted-foreground hover:text-accent transition-colors" data-testid="footer-help">
                Help Center
              </a>
              <a href="#" className="block text-muted-foreground hover:text-accent transition-colors" data-testid="footer-guidelines">
                Community Guidelines
              </a>
              <a href="#" className="block text-muted-foreground hover:text-accent transition-colors" data-testid="footer-privacy">
                Privacy Policy
              </a>
              <a href="#" className="block text-muted-foreground hover:text-accent transition-colors" data-testid="footer-terms">
                Terms of Service
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 pt-8 border-t border-border/50">
          <div className="flex justify-center md:justify-end">
            <div className="text-sm text-muted-foreground">
              © 2025 VirtuoHub. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}