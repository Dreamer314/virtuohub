import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { FeaturedCarousel } from "@/components/featured/FeaturedCarousel";
import { featuredItems } from "@/components/featured/types";
import { CreatePostModal } from "@/components/create-post-modal";
import vhubHeaderImage from '@assets/VHub.Header.no.font.Light.Page.png';
import { Link } from "wouter";
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
  Zap
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