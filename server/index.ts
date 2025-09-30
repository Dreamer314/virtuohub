import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { ensureAvatarsBucket } from "./storageSetup";

const app = express();

// Handle Stripe webhook BEFORE JSON parsing (needs raw body)
import Stripe from "stripe";
const stripe = new Stripe(process.env.TESTING_STRIPE_SECRET_KEY!, {
  apiVersion: "2025-08-27.basil",
});
import { supabaseAdmin } from "./supabaseClient";

app.post("/api/stripe/webhook", express.raw({type: 'application/json'}), async (req, res) => {
  try {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig!, process.env.STRIPE_WEBHOOK_SECRET!);
    } catch (err: any) {
      console.log(`Webhook signature verification failed.`, err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      
      // Only process pulse report purchases
      if (paymentIntent.metadata.type === 'pulse_report_purchase') {
        const { reportId, userId } = paymentIntent.metadata;
        
        // Upsert purchase record into Supabase using service role to bypass RLS
        const { data, error } = await supabaseAdmin
          .from('pulse_report_purchases')
          .upsert({
            report_id: reportId,
            user_id: userId,
            stripe_session_id: null,
            stripe_payment_intent: paymentIntent.id,
            amount_cents: paymentIntent.amount,
            currency: paymentIntent.currency,
            status: 'succeeded'
          }, {
            onConflict: 'stripe_payment_intent'
          });

        if (error) {
          console.error('Error upserting purchase record:', error);
        } else {
          console.log('Purchase recorded successfully:', data);
        }
      }
    }

    res.json({ received: true });
  } catch (error: any) {
    console.error('Webhook error:', error);
    res.status(500).json({ message: "Webhook processing failed" });
  }
});

// NOW apply JSON parsing to all other routes
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  // Ensure Supabase Storage buckets exist
  await ensureAvatarsBucket();

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || '5000', 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();
