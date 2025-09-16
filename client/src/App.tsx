import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import ErrorBoundary from "@/components/error-boundary";
import Community from "@/pages/community";
import HomePage from "@/pages/home";
import ArticlePage from "@/pages/article";
import InsightsPage from "@/pages/insights";
import ThreadPage from "@/pages/thread";
import TrendingPage from "@/pages/trending";
import SpotlightsPage from "@/pages/spotlights";
import SpotlightDetailPage from "@/pages/spotlight-detail";
import InterviewsPage from "@/pages/interviews";
import InterviewDetailPage from "@/pages/interview-detail";
import GuidesPage from "@/pages/guides";
import NewsPage from "@/pages/news";
import EventsPage from "@/pages/events";
import PulsePage from "@/pages/pulse";
import ListsPage from "@/pages/lists";
import ListDetailPage from "@/pages/list-detail";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Community} />
      <Route path="/home" component={HomePage} />
      <Route path="/community" component={Community} />
      <Route path="/spotlights" component={SpotlightsPage} />
      <Route path="/spotlight/:id" component={SpotlightDetailPage} />
      <Route path="/interviews" component={InterviewsPage} />
      <Route path="/interview/:id" component={InterviewDetailPage} />
      <Route path="/guides" component={GuidesPage} />
      <Route path="/guides/:slug" component={GuidesPage} />
      <Route path="/news" component={NewsPage} />
      <Route path="/news/:slug" component={NewsPage} />
      <Route path="/trending" component={TrendingPage} />
      <Route path="/events" component={EventsPage} />
      <Route path="/events/:slug" component={EventsPage} />
      <Route path="/pulse" component={PulsePage} />
      <Route path="/pulse/:slug" component={PulsePage} />
      <Route path="/community/lists" component={ListsPage} />
      <Route path="/community/lists/:slug" component={ListDetailPage} />
      <Route path="/article/:slug" component={ArticlePage} />
      <Route path="/insights" component={InsightsPage} />
      <Route path="/thread/:postId" component={ThreadPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
