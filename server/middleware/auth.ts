import { Request, Response, NextFunction } from 'express';
import { supabase } from '../supabaseClient';

// Extend Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email?: string;
      };
    }
  }
}

export async function validateSession(req: Request, res: Response, next: NextFunction) {
  try {
    // Get the Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No authorization token provided' });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify the JWT token with Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }

    // Add user info to request object
    req.user = {
      id: user.id,
      email: user.email,
    };

    next();
  } catch (error) {
    console.error('Session validation error:', error);
    return res.status(401).json({ message: 'Authentication failed' });
  }
}

// Optional auth middleware - allows requests without auth but adds user if present
export async function optionalAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(); // Continue without auth
    }

    const token = authHeader.substring(7);
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (!error && user) {
      req.user = {
        id: user.id,
        email: user.email,
      };
    }

    next();
  } catch (error) {
    console.error('Optional auth error:', error);
    next(); // Continue even if auth fails
  }
}