import { createContext, useContext, useState, ReactNode, useCallback, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';

type IntentData = {
  // Create post
  category?: string;
  subtype?: 'thread' | 'poll';
  title?: string;
  body?: string;
  
  // Add comment
  postId?: string;
  commentText?: string;
  commentImages?: string[];
  
  // Cast vote
  pollId?: string;
  optionIndex?: number;
};

type Intent = {
  action: 'create_post' | 'add_comment' | 'cast_vote';
  data: IntentData;
} | null;

type AuthModalController = {
  openAuthModal: (mode: 'signin' | 'signup') => void;
};

type IntentContextType = {
  intent: Intent;
  setIntent: (intent: Intent) => void;
  replayIntent: () => void;
  clearIntent: () => void;
  registerAuthModalController: (controller: AuthModalController) => void;
  requestAuth: (mode?: 'signin' | 'signup') => void;
};

const IntentContext = createContext<IntentContextType | undefined>(undefined);

export function useIntentContext() {
  const context = useContext(IntentContext);
  if (!context) {
    throw new Error('useIntentContext must be used within IntentProvider');
  }
  return context;
}

// Replay handlers registry - supports multiple handlers per action
type ReplayHandler = {
  createPost?: (data: IntentData) => void;
  addComment?: (data: IntentData) => void;
  castVote?: (data: IntentData) => void;
};

let replayHandlers: {
  createPost: Array<(data: IntentData) => void>;
  addComment: Array<(data: IntentData) => void>;
  castVote: Array<(data: IntentData) => void>;
} = {
  createPost: [],
  addComment: [],
  castVote: []
};

export function registerReplayHandlers(handlers: Partial<ReplayHandler>) {
  // Add handlers to arrays and return unregister function
  const added: Array<{ action: keyof ReplayHandler; handler: (data: IntentData) => void }> = [];
  
  if (handlers.createPost) {
    replayHandlers.createPost.push(handlers.createPost);
    added.push({ action: 'createPost', handler: handlers.createPost });
  }
  if (handlers.addComment) {
    replayHandlers.addComment.push(handlers.addComment);
    added.push({ action: 'addComment', handler: handlers.addComment });
  }
  if (handlers.castVote) {
    replayHandlers.castVote.push(handlers.castVote);
    added.push({ action: 'castVote', handler: handlers.castVote });
  }
  
  // Return unregister function
  return () => {
    added.forEach(({ action, handler }) => {
      const arr = replayHandlers[action];
      const index = arr.indexOf(handler);
      if (index !== -1) {
        arr.splice(index, 1);
      }
    });
  };
}

export function IntentProvider({ children }: { children: ReactNode }) {
  const [intent, setIntent] = useState<Intent>(null);
  const authModalControllerRef = useRef<AuthModalController | null>(null);
  const { toast } = useToast();

  const registerAuthModalController = useCallback((controller: AuthModalController) => {
    authModalControllerRef.current = controller;
  }, []);

  const requestAuth = useCallback((mode: 'signin' | 'signup' = 'signin') => {
    if (authModalControllerRef.current) {
      authModalControllerRef.current.openAuthModal(mode);
    }
  }, []);

  const clearIntent = useCallback(() => {
    setIntent(null);
  }, []);

  const replayIntent = useCallback(() => {
    if (!intent) return;

    try {
      switch (intent.action) {
        case 'create_post':
          // Call all registered handlers (usually just one)
          replayHandlers.createPost.forEach(handler => handler(intent.data));
          break;
        case 'add_comment':
          replayHandlers.addComment.forEach(handler => handler(intent.data));
          break;
        case 'cast_vote':
          // Call all registered handlers; each will check if pollId matches
          replayHandlers.castVote.forEach(handler => handler(intent.data));
          break;
      }
    } catch (error) {
      console.error('Intent replay failed:', error);
      toast({
        title: 'Action failed',
        description: 'Please try again.',
        variant: 'destructive'
      });
    } finally {
      // Always clear intent after replay, even on failure
      clearIntent();
    }
  }, [intent, toast, clearIntent]);

  return (
    <IntentContext.Provider
      value={{
        intent,
        setIntent,
        replayIntent,
        clearIntent,
        registerAuthModalController,
        requestAuth
      }}
    >
      {children}
    </IntentContext.Provider>
  );
}
