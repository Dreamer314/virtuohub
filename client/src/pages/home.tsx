import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { FeaturedCarousel } from "@/components/featured/FeaturedCarousel";
import { featuredItems } from "@/components/featured/types";
import { CreatePostModal } from "@/components/create-post-modal";
import vhubHeaderImage from '@assets/VHub.Header.no.font.Light.Page.png';
import day1Image from '@assets/download (2).png';
import week4Image from '@assets/download (1).png';
import { Link } from "wouter";
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
  ChevronRight
} from "lucide-react";

const HomePage = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="relative w-full">
        {/* Extended glow effect that affects the whole page */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute -top-20 -left-20 -right-20 h-96 bg-gradient-to-br from-cyan-400/15 via-purple-500/10 to-orange-400/15 blur-3xl"></div>
        </div>
        
        <main className="relative z-10">
          <div className="py-8 px-4 lg:px-8">
          {/* Hero Section */}
          <div className="mb-8">
            <div className="glass-card rounded-2xl overflow-hidden hover-lift relative" data-testid="hero-section">
              <div className="relative min-h-[576px] flex items-center justify-center hero-glow-container">
                <img 
                  src={vhubHeaderImage} 
                  alt="VirtuoHub Homepage Header"
                  className="absolute inset-0 w-full h-full object-cover rounded-2xl"
                  style={{
                    filter: 'drop-shadow(0 0 20px rgba(6, 182, 212, 0.2)) drop-shadow(0 0 40px rgba(147, 51, 234, 0.15))'
                  }}
                />
                <div className="text-center z-10 relative px-6">
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white mb-8 drop-shadow-lg max-w-4xl mx-auto leading-tight">
                    The leading cultural and educational hub for active and aspiring world builders.
                  </h1>
                  <p className="text-lg md:text-xl text-white/90 drop-shadow-md mb-12 max-w-3xl mx-auto leading-relaxed">
                    Shaping the future of digital creators with insider insights, multi-platform learning, and real business growth. Learn. Monetize. Connect.
                  </p>
                  <div className="flex flex-col gap-6 justify-center items-center">
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                      <Button 
                        asChild 
                        size="lg" 
                        className="px-10 py-4 text-lg font-semibold bg-gradient-cosmic hover:bg-gradient-cosmic-hover text-white shadow-2xl shadow-primary/50 transition-all hover:scale-105 hover:shadow-primary/70"
                        data-testid="button-join-community"
                      >
                        <Link href="/">Join the Community</Link>
                      </Button>
                      <Button 
                        variant="outline" 
                        size="lg" 
                        className="px-10 py-4 text-lg font-semibold bg-white/95 backdrop-blur-sm border-2 border-white/80 text-gray-900 hover:bg-white hover:border-white shadow-2xl shadow-white/30 transition-all hover:scale-105 hover:shadow-white/50"
                        data-testid="button-watch-demo"
                      >
                        Watch Demo
                      </Button>
                    </div>
                    <span className="text-base text-white/90 drop-shadow-lg" data-testid="text-signup-micro">
                      Create your free account today
                    </span>
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/25 to-black/35 rounded-2xl"></div>
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
                <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                  Ditch scattered subchannels, forums, and buried comments. Find exactly what you need. VirtuoHub gives you profiles, organized feeds, and real opportunities in one place where your work is seen and valued.
                </p>
                <Button 
                  asChild 
                  size="lg"
                  className="bg-gradient-nebula hover:bg-gradient-nebula-hover text-white shadow-lg hover:shadow-xl transition-all"
                  data-testid="button-find-community"
                >
                  <Link href="/">Find Your Community</Link>
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

              {/* Centralized Action Buttons */}
              <div className="relative z-10 text-center mb-8">
                <div className="flex justify-center gap-4">
                  <Button asChild variant="outline" size="lg" className="bg-gradient-mist hover:bg-gradient-mist-hover border-slate-200 text-slate-700 shadow-md hover:shadow-lg transition-all" data-testid="button-browse-all">
                    <Link href="/#community-feed">Browse Community</Link>
                  </Button>
                  <Button size="lg" className="bg-gradient-cosmic hover:bg-gradient-cosmic-hover text-white shadow-lg hover:shadow-xl transition-all" data-testid="button-start-thread" onClick={() => setIsCreateModalOpen(true)}>Start Thread</Button>
                </div>
              </div>

              <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                <Link href="/?tag=wip" data-testid="card-wip">
                  <Card className="enhanced-card hover-lift cursor-pointer">
                    <CardContent className="p-6">
                      <MessageSquare className="w-8 h-8 mb-4 text-transparent bg-gradient-cosmic bg-clip-text" style={{backgroundImage: 'var(--gradient-cosmic)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}} />
                      <h3 className="text-xl font-semibold text-foreground mb-3">
                        WIP (Work in Progress)
                      </h3>
                      <p className="text-muted-foreground">
                        Share progress, get eyes on your build, and track iterations.
                      </p>
                    </CardContent>
                  </Card>
                </Link>

                <Link href="/?tag=help-feedback" data-testid="card-help-feedback">
                  <Card className="enhanced-card hover-lift cursor-pointer">
                    <CardContent className="p-6">
                      <Users className="w-8 h-8 mb-4 text-transparent bg-gradient-nebula bg-clip-text" style={{backgroundImage: 'var(--gradient-nebula)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}} />
                      <h3 className="text-xl font-semibold text-foreground mb-3">
                        Help & Feedback
                      </h3>
                      <p className="text-muted-foreground">
                        Ask questions, debug blockers, and get quick reviews.
                      </p>
                    </CardContent>
                  </Card>
                </Link>

                <Link href="/?tag=tutorials-guides" data-testid="card-tutorials-guides">
                  <Card className="enhanced-card hover-lift cursor-pointer">
                    <CardContent className="p-6">
                      <BookOpen className="w-8 h-8 mb-4 text-transparent bg-gradient-aurora bg-clip-text" style={{backgroundImage: 'var(--gradient-aurora)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}} />
                      <h3 className="text-xl font-semibold text-foreground mb-3">
                        Tutorials & Guides
                      </h3>
                      <p className="text-muted-foreground">
                        Post step-by-step walkthroughs and quick tips.
                      </p>
                    </CardContent>
                  </Card>
                </Link>

                <Link href="/?tag=jobs-gigs" data-testid="card-jobs-gigs">
                  <Card className="enhanced-card hover-lift cursor-pointer">
                    <CardContent className="p-6">
                      <Users className="w-8 h-8 mb-4 text-transparent bg-gradient-dusk bg-clip-text" style={{backgroundImage: 'var(--gradient-dusk)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}} />
                      <h3 className="text-xl font-semibold text-foreground mb-3">
                        Jobs & Gigs
                      </h3>
                      <p className="text-muted-foreground">
                        Hire talent or offer your services.
                      </p>
                    </CardContent>
                  </Card>
                </Link>

                <Link href="/?tag=assets-sale" data-testid="card-assets-sale">
                  <Card className="enhanced-card hover-lift cursor-pointer">
                    <CardContent className="p-6">
                      <ShoppingBag className="w-8 h-8 mb-4 text-transparent bg-gradient-mist bg-clip-text" style={{backgroundImage: 'var(--gradient-mist)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}} />
                      <h3 className="text-xl font-semibold text-foreground mb-3">
                        Assets for Sale
                      </h3>
                      <p className="text-muted-foreground">
                        List avatars, props, shaders, tools, and more.
                      </p>
                    </CardContent>
                  </Card>
                </Link>

                <Link href="/?tag=collabs-teams" data-testid="card-collabs-teams">
                  <Card className="enhanced-card hover-lift cursor-pointer">
                    <CardContent className="p-6">
                      <Users className="w-8 h-8 mb-4 text-transparent bg-gradient-cosmic bg-clip-text" style={{backgroundImage: 'var(--gradient-cosmic)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}} />
                      <h3 className="text-xl font-semibold text-foreground mb-3">
                        Collabs & Teams
                      </h3>
                      <p className="text-muted-foreground">
                        Find collaborators or recruit for a project.
                      </p>
                    </CardContent>
                  </Card>
                </Link>

                <Link href="/?tag=events-workshops" data-testid="card-events-workshops">
                  <Card className="enhanced-card hover-lift cursor-pointer">
                    <CardContent className="p-6">
                      <Calendar className="w-8 h-8 mb-4 text-transparent bg-gradient-dawn bg-clip-text" style={{backgroundImage: 'var(--gradient-dawn)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}} />
                      <h3 className="text-xl font-semibold text-foreground mb-3">
                        Events & Workshops
                      </h3>
                      <p className="text-muted-foreground">
                        Promote a session, stream, or in-person meetup.
                      </p>
                    </CardContent>
                  </Card>
                </Link>

                <Link href="/?tag=platform-qa" data-testid="card-platform-qa">
                  <Card className="enhanced-card hover-lift cursor-pointer">
                    <CardContent className="p-6">
                      <MessageSquare className="w-8 h-8 mb-4 text-transparent bg-gradient-nebula bg-clip-text" style={{backgroundImage: 'var(--gradient-nebula)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}} />
                      <h3 className="text-xl font-semibold text-foreground mb-3">
                        Platform Q&A
                      </h3>
                      <p className="text-muted-foreground">
                        Roblox, VRChat, Horizon, Second Life, and more.
                      </p>
                    </CardContent>
                  </Card>
                </Link>

                <Link href="/?tag=general" data-testid="card-general">
                  <Card className="enhanced-card hover-lift cursor-pointer">
                    <CardContent className="p-6">
                      <MessageSquare className="w-8 h-8 mb-4 text-transparent bg-gradient-aurora bg-clip-text" style={{backgroundImage: 'var(--gradient-aurora)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}} />
                      <h3 className="text-xl font-semibold text-foreground mb-3">
                        General
                      </h3>
                      <p className="text-muted-foreground">
                        Anything that doesn't fit the other buckets.
                      </p>
                    </CardContent>
                  </Card>
                </Link>
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
                  <Card className="enhanced-card hover-lift cursor-pointer">
                    <CardContent className="p-6">
                      <Users className="w-8 h-8 mb-4 text-transparent bg-gradient-cosmic bg-clip-text" style={{backgroundImage: 'var(--gradient-cosmic)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}} />
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
                  <Card className="enhanced-card hover-lift cursor-pointer">
                    <CardContent className="p-6">
                      <MessageSquare className="w-8 h-8 mb-4 text-transparent bg-gradient-nebula bg-clip-text" style={{backgroundImage: 'var(--gradient-nebula)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}} />
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
                  <Card className="enhanced-card hover-lift cursor-pointer">
                    <CardContent className="p-6">
                      <BookOpen className="w-8 h-8 mb-4 text-transparent bg-gradient-aurora bg-clip-text" style={{backgroundImage: 'var(--gradient-aurora)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}} />
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
                  <Card className="enhanced-card hover-lift cursor-pointer">
                    <CardContent className="p-6">
                      <BarChart3 className="w-8 h-8 mb-4 text-transparent bg-gradient-mist bg-clip-text" style={{backgroundImage: 'var(--gradient-mist)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}} />
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
                  <Card className="enhanced-card hover-lift cursor-pointer">
                    <CardContent className="p-6">
                      <TrendingUp className="w-8 h-8 mb-4 text-transparent bg-gradient-dawn bg-clip-text" style={{backgroundImage: 'var(--gradient-dawn)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}} />
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
                  <Card className="enhanced-card hover-lift cursor-pointer">
                    <CardContent className="p-6">
                      <Calendar className="w-8 h-8 mb-4 text-transparent bg-gradient-dusk bg-clip-text" style={{backgroundImage: 'var(--gradient-dusk)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}} />
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
                  <Card className="enhanced-card hover-lift cursor-pointer">
                    <CardContent className="p-6">
                      <BarChart3 className="w-8 h-8 mb-4 text-transparent bg-gradient-cosmic bg-clip-text" style={{backgroundImage: 'var(--gradient-cosmic)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}} />
                      <h3 className="text-xl font-semibold text-foreground mb-3">
                        Pulse Reports
                      </h3>
                      <p className="text-muted-foreground">
                        Data insights and community polls analysis.
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              </div>
            </section>

            {/* Your Community Awaits Section */}
            <section className="relative px-6 py-20 overflow-hidden">
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
                <div className="text-center mb-20">
                  <div className="relative inline-block">
                    <h1 className="text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold text-foreground mb-10 relative">
                      <span className="bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
                        Build in Public. Level Up Faster.
                      </span>
                    </h1>
                    <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 blur-xl -z-10"></div>
                  </div>
                  <div className="max-w-5xl mx-auto">
                    <p className="text-2xl md:text-3xl lg:text-4xl text-muted-foreground font-medium leading-relaxed">
                      VirtuoHub is where immersive creators post WIP, get feedback, and turn threads into collaborations across VR and UGC platforms.
                    </p>
                  </div>
                </div>

                {/* Enhanced Platform Brand Row */}
                <div className="mb-24">
                  <div className="relative">
                    <div className="flex flex-wrap justify-center items-center gap-6 md:gap-8 lg:gap-10 xl:gap-12 opacity-70">
                      {[
                        'Roblox', 'IMVU', 'Second Life', 'Fortnite', 'Minecraft', 'GTA FiveM', 
                        'Meta Horizon Worlds', 'VRChat', 'Unity', 'Unreal Engine', 'Elder Scrolls', 
                        'Fallout', 'Counter-Strike', 'Team Fortress 2', 'Dreams', 'Core', 'The Sims', 'CCinZOI'
                      ].map((platform, index) => (
                        <span 
                          key={platform} 
                          className="text-base md:text-lg lg:text-xl font-medium text-muted-foreground tracking-wider px-3 py-2 rounded-lg 
                                     transition-all duration-300 hover:text-primary hover:scale-105 hover:opacity-100"
                          style={{ 
                            letterSpacing: '0.1em',
                            animationDelay: `${index * 0.1}s`,
                          }}
                        >
                          {platform}
                        </span>
                      ))}
                    </div>
                    {/* Subtle divider lines */}
                    <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>
                  </div>
                </div>

                {/* Enhanced Two Column Content */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 xl:gap-32 mb-24">
                  {/* Left Column - Enhanced */}
                  <div className="relative">
                    <div className="sticky top-24">
                      <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-10 leading-tight">
                        You don't have to be a pro to begin
                      </h2>
                      <div className="prose prose-lg text-muted-foreground mb-12 leading-relaxed">
                        <p className="text-xl md:text-2xl lg:text-3xl">
                          Beginners get unstuck and veterans find collaborators. Share work in progress, ask for help, and learn how the industry actually works.
                        </p>
                      </div>

                      {/* Enhanced Progress Images with Arrow */}
                      <div className="flex items-center gap-8 lg:gap-10 mb-12">
                        <div className="flex-1">
                          <Card className="enhanced-card hover-lift group overflow-hidden">
                            <CardContent className="p-0">
                              <div className="relative overflow-hidden">
                                <img 
                                  src={day1Image} 
                                  alt="Early 3D head model—work in progress" 
                                  className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                              </div>
                            </CardContent>
                          </Card>
                          <div className="mt-6 text-center">
                            <h4 className="font-bold text-xl lg:text-2xl text-foreground mb-2">Start here</h4>
                            <p className="text-base lg:text-lg text-muted-foreground">Your first WIP into 3D and worldbuilding.</p>
                          </div>
                        </div>
                        
                        {/* Arrow */}
                        <div className="flex-shrink-0 flex items-center justify-center">
                          <ChevronRight className="w-10 h-10 lg:w-12 lg:h-12 text-primary" />
                        </div>
                        
                        <div className="flex-1">
                          <Card className="enhanced-card hover-lift group overflow-hidden">
                            <CardContent className="p-0">
                              <div className="relative overflow-hidden">
                                <img 
                                  src={week4Image} 
                                  alt="Refined character head—improved after feedback" 
                                  className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                              </div>
                            </CardContent>
                          </Card>
                          <div className="mt-6 text-center">
                            <h4 className="font-bold text-xl lg:text-2xl text-foreground mb-2">Keep growing</h4>
                            <p className="text-base lg:text-lg text-muted-foreground">Better every week with peer feedback and practical tips.</p>
                          </div>
                        </div>
                      </div>

                      {/* Enhanced What you'll get list */}
                      <div className="relative mb-10">
                        <h3 className="text-3xl lg:text-4xl font-bold text-foreground mb-8 flex items-center">
                          <Sparkles className="w-8 h-8 lg:w-10 lg:h-10 text-primary mr-4" />
                          What you'll get:
                        </h3>
                        <div className="space-y-6 pl-12 lg:pl-14">
                          <CheckItem>Organized threads with categories like WIP, Help & Feedback, Jobs & Gigs, Assets for Sale, Events, and General</CheckItem>
                          <CheckItem>Editorial you can trust: Interviews, Spotlights, Tips & Guides, Industry News, and Pulse Reports</CheckItem>
                          <CheckItem>Lightweight profiles, simple DMs, and polls that capture the community's voice</CheckItem>
                        </div>
                      </div>

                      {/* Coming next section */}
                      <div className="pl-12 lg:pl-14">
                        <h4 className="text-base lg:text-lg font-semibold text-muted-foreground/70 mb-4">Coming next</h4>
                        <div className="space-y-3 text-base lg:text-lg text-muted-foreground/70">
                          <div>• Courses & live workshop library</div>
                          <div>• Smart creator tools</div>
                          <div>• Creator marketplace</div>
                          <div>• Analytics & talent network dashboards</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Enhanced with rich visual depth */}
                  <div className="relative">
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-10 leading-tight">
                      Your creativity should pay you back
                    </h2>
                    
                    <div className="space-y-8 lg:space-y-10 mb-20">
                      <Card className="enhanced-card hover-lift cursor-pointer group transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10" data-testid="card-sell-assets">
                        <CardContent className="p-10 lg:p-12 relative overflow-hidden">
                          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-cosmic opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity"></div>
                          <div className="flex items-start space-x-8 relative z-10">
                            <div className="p-4 lg:p-5 rounded-xl bg-gradient-cosmic/10 backdrop-blur-sm border border-primary/20">
                              <DollarSign className="w-10 h-10 lg:w-12 lg:h-12 text-primary" />
                            </div>
                            <div>
                              <h3 className="text-2xl lg:text-3xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors">
                                Showcase and sell your work
                              </h3>
                              <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed">
                                Post assets, tag "Assets for Sale," and link to your shop or marketplace.
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="enhanced-card hover-lift cursor-pointer group transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/10" data-testid="card-build-experiences">
                        <CardContent className="p-10 lg:p-12 relative overflow-hidden">
                          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-nebula opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity"></div>
                          <div className="flex items-start space-x-8 relative z-10">
                            <div className="p-4 lg:p-5 rounded-xl bg-gradient-nebula/10 backdrop-blur-sm border border-purple-500/20">
                              <Sparkles className="w-10 h-10 lg:w-12 lg:h-12 text-purple-500" />
                            </div>
                            <div>
                              <h3 className="text-2xl lg:text-3xl font-bold text-foreground mb-4 group-hover:text-purple-500 transition-colors">
                                Build with collaborators
                              </h3>
                              <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed">
                                Find teammates, post gigs, and ship worlds people actually use.
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="enhanced-card hover-lift cursor-pointer group transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10" data-testid="card-teach-workshops">
                        <CardContent className="p-10 lg:p-12 relative overflow-hidden">
                          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-aurora opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity"></div>
                          <div className="flex items-start space-x-8 relative z-10">
                            <div className="p-4 lg:p-5 rounded-xl bg-gradient-aurora/10 backdrop-blur-sm border border-blue-500/20">
                              <GraduationCap className="w-10 h-10 lg:w-12 lg:h-12 text-blue-500" />
                            </div>
                            <div>
                              <h3 className="text-2xl lg:text-3xl font-bold text-foreground mb-4 group-hover:text-blue-500 transition-colors">
                                Teach and share what you know
                              </h3>
                              <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed">
                                Announce workshops or streams, share threads, and grow your audience.
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Enhanced We built what we needed */}
                    <div className="relative">
                      <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-10 leading-tight">
                        We built what we needed
                      </h2>
                      
                      <div className="space-y-6 lg:space-y-8 relative">
                        <Card className="enhanced-card border border-primary/20 bg-primary/5 backdrop-blur-sm" data-testid="quote-creators">
                          <CardContent className="p-8 lg:p-10">
                            <p className="text-foreground italic text-xl lg:text-2xl relative">
                              <span className="text-primary text-3xl lg:text-4xl absolute -left-3 -top-3">"</span>
                              Why isn't there one hub where creator Q&A doesn't get buried?
                              <span className="text-primary text-3xl lg:text-4xl absolute -bottom-2 ml-1">"</span>
                            </p>
                          </CardContent>
                        </Card>

                        <Card className="enhanced-card border border-purple-500/20 bg-purple-500/5 backdrop-blur-sm" data-testid="quote-selling">
                          <CardContent className="p-8 lg:p-10">
                            <p className="text-foreground italic text-xl lg:text-2xl relative">
                              <span className="text-purple-500 text-3xl lg:text-4xl absolute -left-3 -top-3">"</span>
                              WIP + feedback is how I actually get better — not another algorithm.
                              <span className="text-purple-500 text-3xl lg:text-4xl absolute -bottom-2 ml-1">"</span>
                            </p>
                          </CardContent>
                        </Card>

                        <Card className="enhanced-card border border-blue-500/20 bg-blue-500/5 backdrop-blur-sm" data-testid="quote-workshop">
                          <CardContent className="p-8 lg:p-10">
                            <p className="text-foreground italic text-xl lg:text-2xl relative">
                              <span className="text-blue-500 text-3xl lg:text-4xl absolute -left-3 -top-3">"</span>
                              Where do I even find collaborators or students for my workshop?
                              <span className="text-blue-500 text-3xl lg:text-4xl absolute -bottom-2 ml-1">"</span>
                            </p>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Enhanced CTA Band */}
                <div className="text-center relative">
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
            <section className="px-6 py-16">
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
            <section className="px-6 py-12">
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
            <section className="px-6 py-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground text-center mb-12">
                Upcoming Events
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="enhanced-card hover-lift" data-testid="card-event-1">
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

                <Card className="enhanced-card hover-lift" data-testid="card-event-2">
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

                <Card className="enhanced-card hover-lift" data-testid="card-event-3">
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

      <Footer />
      
      {/* Create Post Modal */}
      <CreatePostModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)}
        initialType="regular"
      />
    </div>
  );
};

export default HomePage;