import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null 
    };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { 
      hasError: true, 
      error, 
      errorInfo: null 
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error details for debugging
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo
    });

    // Report error to monitoring service in production
    if (import.meta.env.PROD) {
      // Here you could send error to monitoring service like Sentry
      // reportError(error, errorInfo);
    }
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  private handleToggleDetails = () => {
    const detailsEl = document.getElementById('error-details');
    if (detailsEl) {
      detailsEl.classList.toggle('hidden');
    }
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-6">
          <div className="max-w-2xl mx-auto text-center">
            {/* Error Icon */}
            <div className="mb-8">
              <div className="relative inline-block">
                <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="w-10 h-10 text-red-500" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-yellow-500/20 rounded-full flex items-center justify-center">
                  <Bug className="w-4 h-4 text-yellow-600" />
                </div>
              </div>
            </div>

            {/* Error Message */}
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Something went wrong
            </h1>
            
            <p className="text-lg text-muted-foreground mb-8 max-w-lg mx-auto">
              We apologize for the inconvenience. A technical error occurred while loading this page.
              Our team has been notified and is working on a fix.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <Button 
                onClick={this.handleReload}
                className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white font-medium px-6 py-3 rounded-lg transition-all duration-300"
                data-testid="button-reload"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
              
              <Button 
                variant="outline"
                onClick={this.handleGoHome}
                className="px-6 py-3 rounded-lg border-muted-foreground/20 hover:border-accent hover:text-accent transition-all duration-300"
                data-testid="button-home"
              >
                <Home className="w-4 h-4 mr-2" />
                Go to Home
              </Button>
            </div>

            {/* Error Details Toggle (Development) */}
            {!import.meta.env.PROD && this.state.error && (
              <div className="text-left">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={this.handleToggleDetails}
                  className="text-muted-foreground hover:text-foreground mb-4"
                  data-testid="button-toggle-details"
                >
                  Show Technical Details
                </Button>
                
                <div id="error-details" className="hidden bg-muted/20 rounded-lg p-4 text-sm">
                  <h3 className="font-semibold text-foreground mb-2">Error Details:</h3>
                  <pre className="text-red-400 mb-4 whitespace-pre-wrap overflow-x-auto">
                    {this.state.error.toString()}
                  </pre>
                  
                  {this.state.errorInfo && (
                    <>
                      <h3 className="font-semibold text-foreground mb-2">Stack Trace:</h3>
                      <pre className="text-muted-foreground text-xs whitespace-pre-wrap overflow-x-auto">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Help Information */}
            <div className="mt-8 p-4 bg-muted/10 rounded-lg max-w-lg mx-auto">
              <p className="text-sm text-muted-foreground">
                If this problem persists, please contact support or try refreshing the page.
                Include any details about what you were doing when this error occurred.
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Simple HOC for wrapping components with error boundary
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: ReactNode
) {
  return function WrappedComponent(props: P) {
    return (
      <ErrorBoundary fallback={fallback}>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
}

export default ErrorBoundary;