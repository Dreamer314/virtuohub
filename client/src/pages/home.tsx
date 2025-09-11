import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { FeaturedCarousel } from "@/components/featured/FeaturedCarousel";
import { featuredItems } from "@/components/featured/types";
// COMPOSER ROUTING - Remove composer import, add navigation
import { useLocation } from "wouter";
import vhubHeaderImage from '@assets/VHub.Header.no.font.new.png';
import day1Image from '@assets/download (2).png';
import week4Image from '@assets/download (1).png';
import { Link } from "wouter";
// POST CATEGORIES MVP - Import canonical categories
import { POST_CATEGORIES } from "@/constants/postCategories";
// BUILD IN PUBLIC - Import toast for platform filtering feedback
import { useToast } from "@/hooks/use-toast";
import { PLATFORMS } from "@/types/content";
import { TitleWithRule } from "@/components/ui/title-with-rule";
import { CheckItem } from "@/components/ui/check-item";
import { 
  BookOpen, 
  Calendar, 
  MessageSquare, 
  Users, 
  ShoppingBag, 
  BarChart3,
  ArrowRight,
  TrendingUp,
  Clock,
  Star,
  FileText,
  Heart,
  Zap,
  DollarSign,
  Briefcase,
  GraduationCap,
  Sparkles,
  Check,
  ChevronRight,
  Lock,
  HelpCircle,
  EyeOff,
  ListOrdered
} from "lucide-react";

// POST CATEGORIES MVP - Category icons and content mapping
const CATEGORY_CONFIG = {
  "wip": {
    icon: MessageSquare,
    gradient: "gradient-cosmic",
    description: "Share updates, get eyes on your build, and track iterations."
  },
  "feedback": {
    icon: Users,
    gradient: "gradient-nebula", 
    description: "Ask questions, debug blockers, and get quick reviews."
  },
  "tutorials": {
    icon: BookOpen,
    gradient: "gradient-aurora",
    description: "Post step-by-step walkthroughs and creator tips."
  },
  "hire-collab": {
    icon: Users,
    gradient: "gradient-dusk",
    description: "Hire talent or team up on projects."
  },
  "sell": {
    icon: ShoppingBag,
    gradient: "gradient-mist",
    description: "Sell avatars, props, shaders, tools, and more."
  },
  "teams": {
    icon: Users,
    gradient: "gradient-cosmic",
    description: "Find collaborators or recruit for a project."
  },
  "events": {
    icon: Calendar,
    gradient: "gradient-dawn",
    description: "Promote a session, stream, or in-person meetup."
  },
  "platform-qa": {
    icon: MessageSquare,
    gradient: "gradient-nebula",
    description: "Discuss Roblox, VRChat, Horizon, Second Life, and more."
  },
  "general": {
    icon: MessageSquare,
    gradient: "gradient-aurora",
    description: "For anything that doesn't fit the other categories."
  }
} as const;

const HomePage = () => {
  // COMPOSER ROUTING - Remove modal state, add navigation hook
  const [, setLocation] = useLocation();
  // BUILD IN PUBLIC - Toast for platform filtering feedback
  const { toast } = useToast();


  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="relative w-full">
        {/* Extended glow effect that affects the whole page */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute -top-20 -left-20 -right-20 h-96 bg-gradient-to-br from-cyan-400/15 via-purple-500/10 to-orange-400/15 blur-3xl animate-pulse"></div>
          {/* Floating ambient orbs */}
          <div className="absolute top-1/4 left-1/4 w-40 h-40 bg-purple-400/20 rounded-full blur-2xl" style={{animation: 'float-gentle 18s ease-in-out infinite', animationDelay: '0s'}}></div>
          <div className="absolute top-3/4 right-1/3 w-32 h-32 bg-cyan-400/15 rounded-full blur-2xl" style={{animation: 'float-drift 24s ease-in-out infinite', animationDelay: '3s'}}></div>
          <div className="absolute bottom-1/4 left-1/2 w-28 h-28 bg-orange-400/12 rounded-full blur-xl" style={{animation: 'gentle-pulse 15s ease-in-out infinite', animationDelay: '6s'}}></div>
        </div>
        
        <main className="relative z-10">
          <div className="py-8 px-4 lg:px-8">
          {/* Hero Section */}
          <div className="mb-16">
            <div className="glass-card rounded-2xl overflow-hidden hover-lift relative" data-testid="hero-section">
              <div className="relative h-[400px] sm:h-[500px] lg:h-[600px] xl:h-[700px] flex items-center justify-center hero-glow-container">
                <img 
                  src={vhubHeaderImage} 
                  alt="VirtuoHub Homepage Header"
                  className="absolute inset-0 w-full h-full object-cover object-center rounded-2xl"
                  style={{
                    objectPosition: 'center 20%',
                    filter: 'drop-shadow(0 0 20px rgba(6, 182, 212, 0.2)) drop-shadow(0 0 40px rgba(147, 51, 234, 0.15))'
                  }}
                />
                {/* HERO updated per community-first MVP - Lighter gradient overlay for better image visibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent rounded-2xl"></div>
                <div className="absolute bottom-0 left-0 right-0 text-center z-10 relative px-4 pb-8 sm:pb-12">
                  {/* HERO updated per community-first MVP - Smaller, responsive headline */}
                  <h1 className="orbitron-font text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-4 sm:mb-6 drop-shadow-lg max-w-4xl mx-auto leading-tight">
                    VirtuoHub: The HQ for creators building the future of immersive games and virtual worlds.
                  </h1>
                  {/* HERO updated per community-first MVP - Smaller subhead text */}
                  <p className="text-sm sm:text-base lg:text-lg text-white/90 drop-shadow-md mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed">
                    Your community for news, insights, and connection across the immersive creator economy. From Roblox and GTA to Sims and Second Life, join the conversation shaping what's next in virtual worlds.
                  </p>
                  <div className="flex flex-col gap-4 sm:gap-6 justify-center items-center">
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
                      {/* HERO updated per community-first MVP - Primary CTA with neon-blue glow and aria-label */}
                      <Button 
                        asChild 
                        size="lg" 
                        className="px-8 py-3 text-base font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-2xl shadow-cyan-500/50 transition-all hover:scale-[1.02] hover:shadow-cyan-500/70 ring-2 ring-cyan-400/20"
                        data-testid="button-join-community"
                        aria-label="Join the VirtuoHub community"
                      >
                        <Link href="/community">Join the Community</Link>
                      </Button>
                      {/* HERO updated per community-first MVP - Secondary CTA with outline style and aria-label */}
                      <Button 
                        asChild
                        variant="outline" 
                        size="lg" 
                        className="px-8 py-3 text-base font-semibold bg-white/10 backdrop-blur-sm border-2 border-white/60 text-white hover:bg-white/20 hover:border-white/80 shadow-2xl shadow-white/20 transition-all hover:scale-[1.02] hover:shadow-white/30"
                        data-testid="button-watch-demo"
                        aria-label="Watch the VirtuoHub demo"
                      >
                        <Link href="/demo">Watch Demo</Link>
                      </Button>
                    </div>
                    {/* HERO updated per community-first MVP - New microcopy */}
                    <span className="text-xs sm:text-sm text-white/90 drop-shadow-lg" data-testid="text-signup-micro">
                      Start free and connect with creators across the immersive economy today.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-6xl mx-auto">
            {/* All Creators. One Hub Section */}
            <section className="px-6 py-16 bg-muted/30 rounded-2xl mx-6 mb-16">
              <div className="max-w-3xl mx-auto text-center">
                <div className="flex items-center justify-center mb-6">
                  <div className="flex items-center space-x-2 w-full max-w-4xl mx-auto">
                    <div className="h-px bg-gradient-to-r from-transparent via-primary to-transparent flex-1"></div>
                    <div className="flex items-center space-x-4">
                      <Zap className="w-8 h-8 text-primary" />
                      <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                        All Creators. One Hub.
                      </h2>
                    </div>
                    <div className="h-px bg-gradient-to-r from-primary via-transparent to-transparent flex-1"></div>
                  </div>
                </div>
                {/* ONE HUB MVP - Updated blurb paragraph */}
                <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                  Step beyond scattered forums and subchannels. VirtuoHub is built for immersive creators, with organized feeds, profiles, and real opportunities in one hub where your work is seen, valued, and celebrated.
                </p>
                {/* ONE HUB MVP - Updated button label, routing, and accessibility */}
                <Button 
                  asChild 
                  size="lg"
                  className="bg-gradient-nebula hover:bg-gradient-nebula-hover text-white shadow-lg hover:shadow-xl transition-all"
                  data-testid="button-find-community"
                  aria-label="Explore the VirtuoHub community feed"
                >
                  <Link href="/community">Explore the Feed</Link>
                </Button>
              </div>
            </section>

            {/* Thread Categories Section */}
            <section className="relative px-6 py-16 overflow-hidden">
              {/* Subtle ambient background shapes */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-32 -left-32 w-[600px] h-[600px] bg-gradient-radial from-purple-400/8 via-purple-500/4 to-transparent blur-[100px]"></div>
                <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] bg-gradient-radial from-violet-400/6 via-indigo-500/3 to-transparent blur-[80px]"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gradient-radial from-cyan-400/5 via-blue-500/2 to-transparent blur-[60px]"></div>
              </div>
              
              <div className="relative z-10 text-center mb-12">
                <div className="flex items-center justify-center mb-6">
                  <div className="flex items-center space-x-2 w-full max-w-4xl mx-auto">
                    <div className="h-px bg-gradient-to-r from-transparent via-accent to-transparent flex-1"></div>
                    <div className="flex items-center space-x-4">
                      <FileText className="w-8 h-8 text-accent" />
                      <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                        What You Can Post
                      </h2>
                    </div>
                    <div className="h-px bg-gradient-to-r from-accent via-transparent to-transparent flex-1"></div>
                  </div>
                </div>
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                  Choose the right category for your post. Each section is designed to help you connect with the right audience and get the engagement you need.
                </p>
              </div>

              {/* POST CATEGORIES MVP - Updated button hierarchy */}
              <div className="relative z-10 text-center mb-8">
                <div className="flex justify-center gap-4">
                  {/* COMPOSER ROUTING - Navigate to community with compose query param */}
                  <Button 
                    size="lg" 
                    className="bg-gradient-cosmic hover:bg-gradient-cosmic-hover text-white shadow-lg hover:shadow-xl transition-all" 
                    data-testid="button-start-thread" 
                    onClick={() => setLocation('/community?compose=true')}
                    aria-label="Start a new thread"
                  >
                    Start a Thread
                  </Button>
                  <Button asChild variant="outline" size="lg" className="bg-gradient-mist hover:bg-gradient-mist-hover border-slate-200 text-slate-700 shadow-md hover:shadow-lg transition-all" data-testid="button-browse-all">
                    <Link href="/community" aria-label="Browse the community feed">Browse Community</Link>
                  </Button>
                </div>
              </div>

              {/* POST CATEGORIES MVP - Dynamic category cards from canonical source */}
              <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                {POST_CATEGORIES.map((category) => {
                  const config = CATEGORY_CONFIG[category.slug as keyof typeof CATEGORY_CONFIG];
                  const IconComponent = config?.icon || MessageSquare;
                  
                  // COMPOSER ROUTING - Navigate to community with category preselected
                  const handleClick = () => {
                    setLocation(`/community?compose=true&category=${category.slug}`);
                  };
                  
                  const handleKeyPress = (e: React.KeyboardEvent) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleClick();
                    }
                  };
                  
                  return (
                    <div key={category.slug}>
                      <Card 
                        className="enhanced-card hover-lift cursor-pointer group transition-all duration-300 hover:shadow-xl hover:shadow-primary/20 hover:scale-105 hover:border-primary/30"
                        role="button"
                        tabIndex={0}
                        onClick={handleClick}
                        onKeyDown={handleKeyPress}
                        aria-label={`Start a new thread in ${category.label}`}
                        data-testid={`card-${category.slug}`}
                      >
                        <CardContent className="p-6">
                          <IconComponent 
                            className="w-8 h-8 mb-4 text-transparent bg-clip-text" 
                            style={{
                              backgroundImage: `var(--${config?.gradient || 'gradient-cosmic'})`, 
                              WebkitBackgroundClip: 'text', 
                              WebkitTextFillColor: 'transparent'
                            }} 
                          />
                          <h3 className="text-xl font-semibold text-foreground mb-3">
                            {category.label}
                          </h3>
                          <p className="text-muted-foreground">
                            {config?.description || 'Post content in this category.'}
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Editorial & Data Section */}
            <section className="relative px-6 py-16 bg-muted/30 rounded-2xl mx-6 overflow-hidden">
              {/* Centered ambient background behind icon cluster */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-violet-400/8 via-purple-500/4 to-transparent blur-[120px]"></div>
                <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-gradient-radial from-indigo-400/6 via-blue-500/3 to-transparent blur-[80px]"></div>
                <div className="absolute bottom-1/4 left-1/4 w-[350px] h-[350px] bg-gradient-radial from-cyan-400/5 via-teal-500/2 to-transparent blur-[70px]"></div>
              </div>
              
              <div className="relative z-10 text-center mb-12">
                <div className="flex items-center justify-center mb-6">
                  <div className="flex items-center space-x-2 w-full max-w-4xl mx-auto">
                    <div className="h-px bg-gradient-to-r from-transparent via-primary to-transparent flex-1"></div>
                    <div className="flex items-center space-x-4">
                      <BarChart3 className="w-8 h-8 text-primary" />
                      <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                        Editorial & Data
                      </h2>
                    </div>
                    <div className="h-px bg-gradient-to-r from-primary via-transparent to-transparent flex-1"></div>
                  </div>
                </div>
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                  Curated content, insights, and data-driven reports from our editorial team and community research.
                </p>
              </div>

              <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                <Link href="/spotlights" data-testid="card-spotlights">
                  <Card className="enhanced-card hover-lift cursor-pointer group transition-all duration-300 hover:shadow-xl hover:shadow-primary/20 hover:scale-105 hover:border-primary/30">
                    <CardContent className="p-6">
                      <Users className="w-8 h-8 mb-4 text-transparent bg-gradient-cosmic bg-clip-text group-hover:scale-110 transition-all duration-300" style={{backgroundImage: 'var(--gradient-cosmic)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}} />
                      <h3 className="text-xl font-semibold text-foreground mb-3">
                        Creator Spotlights
                      </h3>
                      <p className="text-muted-foreground">
                        Featured creator profiles and success stories.
                      </p>
                    </CardContent>
                  </Card>
                </Link>

                <Link href="/interviews" data-testid="card-interviews">
                  <Card className="enhanced-card hover-lift cursor-pointer group transition-all duration-300 hover:shadow-xl hover:shadow-primary/20 hover:scale-105 hover:border-primary/30">
                    <CardContent className="p-6">
                      <MessageSquare className="w-8 h-8 mb-4 text-transparent bg-gradient-nebula bg-clip-text group-hover:scale-110 transition-all duration-300" style={{backgroundImage: 'var(--gradient-nebula)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}} />
                      <h3 className="text-xl font-semibold text-foreground mb-3">
                        Interviews
                      </h3>
                      <p className="text-muted-foreground">
                        In-depth Q&As with industry leaders and creators.
                      </p>
                    </CardContent>
                  </Card>
                </Link>

                <Link href="/guides" data-testid="card-tips-guides">
                  <Card className="enhanced-card hover-lift cursor-pointer group transition-all duration-300 hover:shadow-xl hover:shadow-primary/20 hover:scale-105 hover:border-primary/30">
                    <CardContent className="p-6">
                      <BookOpen className="w-8 h-8 mb-4 text-transparent bg-gradient-aurora bg-clip-text group-hover:scale-110 transition-all duration-300" style={{backgroundImage: 'var(--gradient-aurora)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}} />
                      <h3 className="text-xl font-semibold text-foreground mb-3">
                        Tips & Guides
                      </h3>
                      <p className="text-muted-foreground">
                        Expert tutorials and best practice guides.
                      </p>
                    </CardContent>
                  </Card>
                </Link>

                <Link href="/news" data-testid="card-industry-news">
                  <Card className="enhanced-card hover-lift cursor-pointer group transition-all duration-300 hover:shadow-xl hover:shadow-primary/20 hover:scale-105 hover:border-primary/30">
                    <CardContent className="p-6">
                      <BarChart3 className="w-8 h-8 mb-4 text-transparent bg-gradient-mist bg-clip-text group-hover:scale-110 transition-all duration-300" style={{backgroundImage: 'var(--gradient-mist)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}} />
                      <h3 className="text-xl font-semibold text-foreground mb-3">
                        Industry News
                      </h3>
                      <p className="text-muted-foreground">
                        Latest updates from virtual world platforms.
                      </p>
                    </CardContent>
                  </Card>
                </Link>

                <Link href="/trending" data-testid="card-trending">
                  <Card className="enhanced-card hover-lift cursor-pointer group transition-all duration-300 hover:shadow-xl hover:shadow-primary/20 hover:scale-105 hover:border-primary/30">
                    <CardContent className="p-6">
                      <TrendingUp className="w-8 h-8 mb-4 text-transparent bg-gradient-dawn bg-clip-text group-hover:scale-110 transition-all duration-300" style={{backgroundImage: 'var(--gradient-dawn)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}} />
                      <h3 className="text-xl font-semibold text-foreground mb-3">
                        Trending
                      </h3>
                      <p className="text-muted-foreground">
                        Most popular content across all categories.
                      </p>
                    </CardContent>
                  </Card>
                </Link>

                <Link href="/events" data-testid="card-upcoming-events">
                  <Card className="enhanced-card hover-lift cursor-pointer group transition-all duration-300 hover:shadow-xl hover:shadow-primary/20 hover:scale-105 hover:border-primary/30">
                    <CardContent className="p-6">
                      <Calendar className="w-8 h-8 mb-4 text-transparent bg-gradient-dusk bg-clip-text group-hover:scale-110 transition-all duration-300" style={{backgroundImage: 'var(--gradient-dusk)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}} />
                      <h3 className="text-xl font-semibold text-foreground mb-3">
                        Upcoming Events
                      </h3>
                      <p className="text-muted-foreground">
                        Community events and workshops calendar.
                      </p>
                    </CardContent>
                  </Card>
                </Link>

                <Link href="/pulse" data-testid="card-pulse-reports">
                  <Card className="enhanced-card hover-lift cursor-pointer group transition-all duration-300 hover:shadow-xl hover:shadow-primary/20 hover:scale-105 hover:border-primary/30">
                    <CardContent className="p-6">
                      <BarChart3 className="w-8 h-8 mb-4 text-transparent bg-gradient-cosmic bg-clip-text group-hover:scale-110 transition-all duration-300" style={{backgroundImage: 'var(--gradient-cosmic)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}} />
                      <h3 className="text-xl font-semibold text-foreground mb-3">
                        Pulse Reports
                      </h3>
                      <p className="text-muted-foreground">
                        Data insights and community polls analysis.
                      </p>
                    </CardContent>
                  </Card>
                </Link>

                <Link href="/community/lists" data-testid="card-lists">
                  <Card className="enhanced-card hover-lift cursor-pointer group transition-all duration-300 hover:shadow-xl hover:shadow-primary/20 hover:scale-105 hover:border-primary/30">
                    <CardContent className="p-6">
                      <ListOrdered className="w-8 h-8 mb-4 text-transparent bg-gradient-dawn bg-clip-text group-hover:scale-110 transition-all duration-300" style={{backgroundImage: 'var(--gradient-dawn)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}} />
                      <h3 className="text-xl font-semibold text-foreground mb-3">
                        Lists
                      </h3>
                      <p className="text-muted-foreground">
                        Curated rankings and featured industry collections.
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              </div>
            </section>

            {/* Your Community Awaits Section */}
            <section className="relative px-6 py-20 overflow-hidden mb-20">
              {/* Complex ambient background with depth */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {/* Primary gradient behind right column */}
                <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[1000px] h-[1000px] bg-gradient-radial from-violet-400/12 via-purple-500/6 to-transparent blur-[150px]"></div>
                {/* Secondary accent behind left column */}
                <div className="absolute top-1/3 left-1/4 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-cyan-400/8 via-blue-500/4 to-transparent blur-[120px]"></div>
                {/* Bottom glow */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-radial from-purple-400/6 via-indigo-500/3 to-transparent blur-[100px]"></div>
              </div>
              
              <div className="relative z-10 max-w-7xl mx-auto">
                {/* Section Header with enhanced typography */}
                <div className="text-center mb-16">
                  <div className="relative inline-block">
                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-8 relative">
                      <span className="bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
                        Build in Public. Get Real Feedback.
                      </span>
                    </h1>
                    <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 blur-xl -z-10"></div>
                  </div>
                  <div className="max-w-4xl mx-auto">
                    <p className="text-xl md:text-2xl text-muted-foreground font-medium leading-relaxed">
                      VirtuoHub is where immersive creators share WIP, get reviews, and turn threads into collaborations across VR and UGC platforms.
                    </p>
                  </div>
                </div>

                {/* BUILD IN PUBLIC - Interactive Platform Chips */}
                <div className="mb-20">
                  <div className="relative">
                    {/* BUILD IN PUBLIC - Clickable platform chips with routing */}
                    <div className="flex flex-wrap justify-center items-center gap-3 md:gap-4 overflow-x-auto md:overflow-x-visible scrollbar-hide px-4 md:px-0 relative z-20 pointer-events-auto">
                      {[
                        ...PLATFORMS.slice(0, 8).map(p => ({ name: p.label, slug: p.key })),
                        { name: '+ more', slug: null as any }
                      ].map((platform, index) => (
                        <button
                          key={platform.slug || platform.name}
                          onClick={() => {
                            if (platform.slug) {
                              setLocation(`/community?platform=${platform.slug}`);
                              toast({
                                title: `Filtered by ${platform.name}`,
                                description: `Showing posts related to ${platform.name}`,
                              });
                            } else {
                              setLocation('/community');
                            }
                          }}
                          type="button"
                          className="flex-shrink-0 px-4 py-2 text-sm font-medium text-muted-foreground bg-muted/20 border border-muted-foreground/20 rounded-full hover:text-primary hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
                          aria-label={platform.slug ? `Filter community by ${platform.name}` : 'View all platforms'}
                          data-testid={`homepage-platform-chip-${platform.slug || 'more'}`}
                        >
                          {platform.name}
                        </button>
                      ))}
                    </div>
                    {/* Subtle divider lines */}
                    <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent pointer-events-none z-0"></div>
                  </div>
                </div>

                {/* Enhanced Two Column Content */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-16">
                  {/* Left Column - Enhanced */}
                  <div className="relative">
                    <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6 leading-tight">
                      You don't have to be a pro to begin
                    </h2>
                    <p className="text-base text-muted-foreground mb-8 leading-relaxed">
                      Beginners get unstuck and veterans find collaborators. Share progress, ask for help, and learn how the industry actually works.
                    </p>

                    {/* Large Progress Images with Arrow */}
                    <div className="flex items-center gap-6 mb-8">
                      <div className="flex-1">
                        <Card className="enhanced-card hover-lift group overflow-hidden">
                          <CardContent className="p-0">
                            <div className="relative overflow-hidden" style={{ aspectRatio: '4/5' }}>
                              <img 
                                src={day1Image} 
                                alt="Early 3D head model—work in progress" 
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                            </div>
                          </CardContent>
                        </Card>
                        <div className="mt-3 text-center">
                          <h4 className="font-bold text-base text-foreground mb-1">Start here</h4>
                          <p className="text-sm text-muted-foreground">Your first WIP post and worldbuilding log.</p>
                        </div>
                      </div>
                      
                      {/* Arrow */}
                      <div className="flex-shrink-0 flex items-center justify-center">
                        <ChevronRight className="w-6 h-6 text-primary" />
                      </div>
                      
                      <div className="flex-1">
                        <Card className="enhanced-card hover-lift group overflow-hidden">
                          <CardContent className="p-0">
                            <div className="relative overflow-hidden" style={{ aspectRatio: '4/5' }}>
                              <img 
                                src={week4Image} 
                                alt="Refined character head—improved after feedback" 
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                            </div>
                          </CardContent>
                        </Card>
                        <div className="mt-3 text-center">
                          <h4 className="font-bold text-base text-foreground mb-1">Keep growing</h4>
                          <p className="text-sm text-muted-foreground">Weekly peer feedback and practical tips.</p>
                        </div>
                      </div>
                    </div>

                    {/* What you'll get list */}
                    <div className="relative">
                      <h4 className="text-lg font-bold text-foreground mb-4">
                        What you'll get:
                      </h4>
                      <div className="space-y-3">
                        <CheckItem>Organized threads with categories like WIP, Feedback, Tutorials, Events, and General</CheckItem>
                        <CheckItem>Editorial you can trust: Spotlights, Tips, Industry News, and Pulse polls</CheckItem>
                        <CheckItem>Lightweight profiles, simple DMs, and polls that capture the community's voice</CheckItem>
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Compact horizontal cards */}
                  <div className="relative">
                    <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6 leading-tight">
                      Your creativity should pay you back
                    </h2>
                    
                    {/* BUILD IN PUBLIC - Interactive right-side buttons with category routing */}
                    <div className="space-y-4 mb-12">
                      <button
                        onClick={() => setLocation('/community?category=sell')}
                        className="w-full flex items-center gap-4 p-4 rounded-lg border border-primary/20 bg-primary/5 backdrop-blur-sm hover:border-primary/40 hover:bg-primary/10 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                        aria-label="View posts in Sell Your Creations"
                        data-testid="button-sell-work"
                      >
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                          <DollarSign className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="text-base font-semibold text-foreground mb-1 text-left">
                            Showcase and sell your work
                          </h3>
                        </div>
                      </button>

                      <button
                        onClick={() => setLocation('/community?category=hire-collab')}
                        className="w-full flex items-center gap-4 p-4 rounded-lg border border-purple-500/20 bg-purple-500/5 backdrop-blur-sm hover:border-purple-500/40 hover:bg-purple-500/10 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                        aria-label="View posts in Hire & Collaborate"
                        data-testid="button-build-collaborators"
                      >
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                          <Sparkles className="w-5 h-5 text-purple-500" />
                        </div>
                        <div>
                          <h3 className="text-base font-semibold text-foreground mb-1 text-left">
                            Build with collaborators
                          </h3>
                        </div>
                      </button>

                      <button
                        onClick={() => setLocation('/community?category=tutorials')}
                        className="w-full flex items-center gap-4 p-4 rounded-lg border border-blue-500/20 bg-blue-500/5 backdrop-blur-sm hover:border-blue-500/40 hover:bg-blue-500/10 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                        aria-label="View posts in Tutorials & Guides"
                        data-testid="button-teach-share"
                      >
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                          <GraduationCap className="w-5 h-5 text-blue-500" />
                        </div>
                        <div>
                          <h3 className="text-base font-semibold text-foreground mb-1 text-left">
                            Teach and share what you know
                          </h3>
                        </div>
                      </button>
                    </div>

                    {/* We built what we needed - Compact list style */}
                    <div className="relative">
                      <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6 leading-tight">
                        We built what we needed
                      </h2>
                      
                      <div className="space-y-3">
                        <div className="flex items-start gap-3" data-testid="quote-creators">
                          <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-2"></div>
                          <p className="text-base text-muted-foreground italic">
                            "Why isn't there one hub where creator Q&A doesn't get buried?"
                          </p>
                        </div>

                        <div className="flex items-start gap-3" data-testid="quote-selling">
                          <div className="flex-shrink-0 w-2 h-2 rounded-full bg-purple-500 mt-2"></div>
                          <p className="text-base text-muted-foreground italic">
                            "WIP + feedback is how I actually get better — not another algorithm."
                          </p>
                        </div>

                        <div className="flex items-start gap-3" data-testid="quote-workshop">
                          <div className="flex-shrink-0 w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
                          <p className="text-base text-muted-foreground italic">
                            "Where do I even find collaborators or students for my workshop?"
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Enhanced CTA Band */}
                <div className="text-center relative mt-24 md:mt-32 lg:mt-40">
                  <div className="max-w-4xl mx-auto mb-16">
                    <h2 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-foreground mb-8 leading-tight">
                      The industry is changing fast
                    </h2>
                    <p className="text-xl md:text-2xl lg:text-3xl text-muted-foreground leading-relaxed mb-12">
                      UGC platforms evolve monthly. VirtuoHub keeps creators in the loop so you can adapt and grow.
                    </p>
                    
                    <div className="relative inline-block">
                      <Button 
                        asChild 
                        size="lg" 
                        className="px-16 py-8 text-2xl lg:text-3xl font-bold bg-gradient-cosmic hover:bg-gradient-cosmic-hover text-white shadow-2xl shadow-primary/30 transition-all duration-300 hover:scale-105 hover:shadow-primary/50 rounded-2xl"
                        data-testid="button-join-community"
                      >
                        <Link href="/">
                          Join the Community 
                          <ArrowRight className="ml-4 w-8 h-8 lg:w-10 lg:h-10" />
                        </Link>
                      </Button>
                      <div className="absolute -inset-3 bg-gradient-cosmic opacity-20 blur-xl rounded-2xl -z-10"></div>
                    </div>
                    
                    <p className="text-lg lg:text-xl text-muted-foreground mt-6">
                      Create your free account today
                    </p>
                  </div>
                </div>
              </div>
            </section>


            {/* Featured Content Section */}
            <section className="px-6 py-16 mb-20">
              <div className="text-center mb-8">
                <div className="flex items-center justify-center mb-6">
                  <div className="flex items-center space-x-2 w-full max-w-4xl mx-auto">
                    <div className="h-px bg-gradient-to-r from-transparent via-accent to-transparent flex-1"></div>
                    <div className="flex items-center space-x-4">
                      <Star className="w-8 h-8 text-accent" />
                      <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                        Featured Content
                      </h2>
                    </div>
                    <div className="h-px bg-gradient-to-r from-accent via-transparent to-transparent flex-1"></div>
                  </div>
                </div>
                <p className="text-lg text-muted-foreground">
                  Discover the latest insights, interviews, and guides from our community
                </p>
              </div>
              <FeaturedCarousel items={featuredItems} />
            </section>

            {/* Pulse Teaser Section */}
            <section className="px-6 py-12 mb-16">
              <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
                <CardContent className="p-8 text-center">
                  <TrendingUp className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-foreground mb-4">VHub Pulse</h3>
                  <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                    Get your voice heard on the latest industry trends. Quick polls on the hottest topics in the immersive economy.
                  </p>
                  <Button asChild size="lg" className="bg-gradient-aurora hover:bg-gradient-aurora-hover text-white">
                    <Link href="/pulse">Participate in Polls</Link>
                  </Button>
                </CardContent>
              </Card>
            </section>

            {/* Community Highlights */}
            <section className="px-6 py-16 mb-20">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground text-center mb-12">
                Upcoming Events
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="enhanced-card hover-lift group transition-all duration-300 hover:shadow-xl hover:shadow-primary/20 hover:scale-105 hover:border-primary/30" data-testid="card-event-1">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-3 mb-3">
                      <Clock className="w-5 h-5 text-primary mt-0.5" />
                      <div>
                        <span className="text-sm text-primary font-medium">Dec 15, 2024</span>
                        <span className="text-sm text-muted-foreground ml-2">2:00 PM EST</span>
                      </div>
                    </div>
                    <h4 className="font-semibold text-foreground mb-2">
                      VRChat Creator Meetup
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Join fellow VRChat creators for networking and collaboration opportunities.
                    </p>
                  </CardContent>
                </Card>

                <Card className="enhanced-card hover-lift group transition-all duration-300 hover:shadow-xl hover:shadow-primary/20 hover:scale-105 hover:border-primary/30" data-testid="card-event-2">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-3 mb-3">
                      <Clock className="w-5 h-5 text-primary mt-0.5" />
                      <div>
                        <span className="text-sm text-primary font-medium">Dec 18, 2024</span>
                        <span className="text-sm text-muted-foreground ml-2">7:00 PM EST</span>
                      </div>
                    </div>
                    <h4 className="font-semibold text-foreground mb-2">
                      Unity Workshop: Advanced Scripting
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Learn advanced Unity scripting techniques from industry professionals.
                    </p>
                  </CardContent>
                </Card>

                <Card className="enhanced-card hover-lift group transition-all duration-300 hover:shadow-xl hover:shadow-primary/20 hover:scale-105 hover:border-primary/30" data-testid="card-event-3">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-3 mb-3">
                      <Clock className="w-5 h-5 text-primary mt-0.5" />
                      <div>
                        <span className="text-sm text-primary font-medium">Dec 22, 2024</span>
                        <span className="text-sm text-muted-foreground ml-2">4:00 PM EST</span>
                      </div>
                    </div>
                    <h4 className="font-semibold text-foreground mb-2">
                      Monetization Strategies Panel
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Expert panel discussion on monetizing virtual world creations.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </section>
            </div>
          </div>
        </main>
      </div>

      {/* Footer CTA Section */}
      <div className="relative">
        {/* Purple gradient section */}
        <div className="bg-gradient-to-r from-primary via-purple-500 to-primary px-6 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to start creating?
            </h2>
            <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
              Join thousands of creators building the future.
            </p>
            
            <Button 
              asChild 
              size="lg" 
              className="px-10 py-4 text-lg font-bold bg-white text-primary hover:bg-white/90 rounded-xl mb-16 shadow-xl"
              data-testid="button-join-footer"
            >
              <Link href="/">
                Join Early!
              </Link>
            </Button>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">50K+</div>
                <div className="text-white/70 text-base">Creators</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">15+</div>
                <div className="text-white/70 text-base">Platforms</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">$2M+</div>
                <div className="text-white/70 text-base">Sales Generated</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">24/7</div>
                <div className="text-white/70 text-base">Community Support</div>
              </div>
            </div>
          </div>
        </div>

        {/* Dark section - Why Creators Get Stuck */}
        <div className="bg-background border-t border-border px-6 py-20 relative overflow-hidden">
          {/* Animated background elements */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-20 left-10 w-32 h-32 bg-primary rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-20 right-10 w-40 h-40 bg-purple-400 rounded-full blur-3xl animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-primary rounded-full blur-2xl animate-pulse delay-500"></div>
          </div>
          
          <div className="max-w-7xl mx-auto relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-1000">
              Why Creators Get Stuck
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
              {/* Problem 1 - Enhanced with hover effects */}
              <div className="text-center group cursor-pointer transform transition-all duration-500 hover:scale-105 animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-200">
                <div className="relative">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-cosmic/20 border border-primary/30 flex items-center justify-center mx-auto mb-6 enhanced-card group-hover:shadow-2xl group-hover:shadow-primary/20 transition-all duration-500 group-hover:rotate-3">
                    <Lock className="w-10 h-10 text-primary group-hover:scale-110 transition-all duration-300 group-hover:rotate-12" />
                    {/* Glowing ring effect */}
                    <div className="absolute inset-0 rounded-2xl bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm scale-110"></div>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4 transition-colors duration-300">Too many tools. No Clear System</h3>
                <p className="text-muted-foreground text-base leading-relaxed group-hover:text-foreground/80 transition-colors duration-300">
                  You bounce between Discord, Reddit, YouTube, and still feel like you're starting from scratch.
                </p>
                {/* Interactive highlight bar */}
                <div className="h-1 w-0 bg-gradient-cosmic rounded-full mt-4 mx-auto group-hover:w-full transition-all duration-500"></div>
              </div>

              {/* Problem 2 - Enhanced with hover effects */}
              <div className="text-center group cursor-pointer transform transition-all duration-500 hover:scale-105 animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-400">
                <div className="relative">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-nebula/20 border border-primary/30 flex items-center justify-center mx-auto mb-6 enhanced-card group-hover:shadow-2xl group-hover:shadow-primary/20 transition-all duration-500 group-hover:-rotate-3">
                    <HelpCircle className="w-10 h-10 text-primary group-hover:scale-110 transition-all duration-300 group-hover:-rotate-12" />
                    {/* Glowing ring effect */}
                    <div className="absolute inset-0 rounded-2xl bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm scale-110"></div>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4 transition-colors duration-300">Didn't realize this could be a career?</h3>
                <p className="text-muted-foreground text-base leading-relaxed group-hover:text-foreground/80 transition-colors duration-300">
                  People keep saying "follow your passion" and "build in public," especially where income feels impossible to new.
                </p>
                {/* Interactive highlight bar */}
                <div className="h-1 w-0 bg-gradient-nebula rounded-full mt-4 mx-auto group-hover:w-full transition-all duration-500"></div>
              </div>

              {/* Problem 3 - Enhanced with hover effects */}
              <div className="text-center group cursor-pointer transform transition-all duration-500 hover:scale-105 animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-600">
                <div className="relative">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-aurora/20 border border-primary/30 flex items-center justify-center mx-auto mb-6 enhanced-card group-hover:shadow-2xl group-hover:shadow-primary/20 transition-all duration-500 group-hover:rotate-3">
                    <EyeOff className="w-10 h-10 text-primary group-hover:scale-110 transition-all duration-300 group-hover:rotate-12" />
                    {/* Glowing ring effect */}
                    <div className="absolute inset-0 rounded-2xl bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm scale-110"></div>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4 transition-colors duration-300">You're Skilled—but you're Invisible.</h3>
                <p className="text-muted-foreground text-base leading-relaxed group-hover:text-foreground/80 transition-colors duration-300">
                  Skill alone isn't enough to grow an audience, reputation, and real opportunities to rise.
                </p>
                {/* Interactive highlight bar */}
                <div className="h-1 w-0 bg-gradient-aurora rounded-full mt-4 mx-auto group-hover:w-full transition-all duration-500"></div>
              </div>
            </div>

            {/* Animated Arrow with pulsing effect */}
            <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-800">
              <div className="inline-block p-6 bg-gradient-to-r from-primary via-purple-500 to-primary rounded-full enhanced-card group cursor-pointer transform transition-all duration-500 hover:scale-110 hover:rotate-12 shadow-lg hover:shadow-primary/30 animate-bounce">
                <ArrowRight className="w-8 h-8 text-white group-hover:translate-x-1 transition-transform duration-300" />
                {/* Pulsing glow ring */}
                <div className="absolute inset-0 rounded-full bg-primary/20 scale-150 animate-ping opacity-30"></div>
              </div>
            </div>

            {/* Final CTA with gradient text effect */}
            <div className="text-center animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-1000">
              <p className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary via-purple-400 to-primary bg-clip-text text-transparent animate-pulse">
                Stop building in the dark—and start building your future.
              </p>
              {/* Subtle underline effect */}
              <div className="h-1 w-32 bg-gradient-to-r from-primary to-purple-400 rounded-full mx-auto mt-4 opacity-50"></div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
      
      {/* COMPOSER ROUTING - Removed CreatePostModal, routing to community page instead */}
    </div>
  );
};

export default HomePage;