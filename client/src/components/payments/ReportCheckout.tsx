import React, { useState, useEffect } from 'react';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { Loader2 } from 'lucide-react';

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

interface CheckoutFormProps {
  reportId: string;
  reportTitle: string;
  amount: number; // in cents
  onSuccess: () => void;
  onCancel: () => void;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ 
  reportId, 
  reportTitle, 
  amount, 
  onSuccess, 
  onCancel 
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/pulse?payment=success&report=${reportId}`,
          payment_method_data: {
            billing_details: {
              name: 'Customer', // You might want to get this from user session
            },
          },
        },
      });

      if (error) {
        console.error('Payment failed:', error);
        toast({
          title: "Payment Failed",
          description: error.message || "An unexpected error occurred.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Payment Successful",
          description: `Thank you for purchasing ${reportTitle}!`,
        });
        onSuccess();
      }
    } catch (error) {
      console.error('Payment error details:', error);
      console.error('Error type:', typeof error);
      console.error('Error message:', error instanceof Error ? error.message : String(error));
      toast({
        title: "Payment Error",
        description: `Payment failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="bg-muted p-4 rounded-lg">
          <h3 className="font-semibold text-lg mb-2">{reportTitle}</h3>
          <p className="text-2xl font-bold text-primary">
            ${(amount / 100).toFixed(2)}
          </p>
        </div>
        
        <PaymentElement 
          options={{
            layout: 'tabs',
            fields: {
              billingDetails: {
                address: {
                  postalCode: 'never'
                }
              }
            }
          }}
        />
      </div>
      
      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
          className="flex-1"
          data-testid="cancel-payment-button"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={!stripe || isLoading}
          className="flex-1"
          data-testid="submit-payment-button"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            `Pay $${(amount / 100).toFixed(2)}`
          )}
        </Button>
      </div>
    </form>
  );
};

interface ReportCheckoutProps {
  isOpen: boolean;
  onClose: () => void;
  reportId: string;
  reportTitle: string;
  amount: number; // in cents
  onSuccess: () => void;
}

export const ReportCheckout: React.FC<ReportCheckoutProps> = ({
  isOpen,
  onClose,
  reportId,
  reportTitle,
  amount,
  onSuccess
}) => {
  const [clientSecret, setClientSecret] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen && reportId && amount > 0) {
      setLoading(true);
      
      // Create payment intent (server determines price from report)
      apiRequest('POST', `/api/pulse/reports/${reportId}/purchase`, {})
        .then(async (response) => {
          const data = await response.json();
          setClientSecret(data.clientSecret);
        })
        .catch((error) => {
          console.error('Error creating payment intent:', error);
          toast({
            title: "Error",
            description: "Failed to initialize payment. Please try again.",
            variant: "destructive",
          });
          onClose();
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [isOpen, reportId, amount]);

  const handleSuccess = () => {
    setClientSecret('');
    onSuccess();
    onClose();
  };

  const handleCancel = () => {
    setClientSecret('');
    onClose();
  };

  if (!stripePromise) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Payment Error</DialogTitle>
          </DialogHeader>
          <p>Stripe is not properly configured. Please contact support.</p>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md" data-testid="payment-modal">
        <DialogHeader>
          <DialogTitle>Purchase Report</DialogTitle>
        </DialogHeader>
        
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin" />
            <span className="ml-2">Initializing payment...</span>
          </div>
        ) : clientSecret ? (
          <Elements 
            stripe={stripePromise} 
            options={{ 
              clientSecret,
              appearance: {
                theme: 'stripe',
                variables: {
                  colorPrimary: 'hsl(var(--primary))',
                }
              }
            }}
          >
            <CheckoutForm
              reportId={reportId}
              reportTitle={reportTitle}
              amount={amount}
              onSuccess={handleSuccess}
              onCancel={handleCancel}
            />
          </Elements>
        ) : (
          <div className="text-center py-4">
            <p>Unable to initialize payment. Please try again.</p>
            <Button onClick={onClose} className="mt-4">
              Close
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};