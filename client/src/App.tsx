import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import Community from "@/pages/community";
import ArticlePage from "@/pages/article";
import InsightsPage from "@/pages/insights";
import ThreadPage from "@/pages/thread";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Community} />
      <Route path="/community" component={Community} />
      <Route path="/article/:slug" component={ArticlePage} />
      <Route path="/insights" component={InsightsPage} />
      <Route path="/thread/:postId" component={ThreadPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
