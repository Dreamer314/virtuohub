import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { FeaturedCarousel } from "@/components/featured/FeaturedCarousel";
import { featuredItems } from "@/components/featured/types";
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
  Clock
} from "lucide-react";

const HomePage = () => {
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
                        className="px-10 py-4 text-lg font-semibold bg-gradient-to-r from-primary via-purple-600 to-accent hover:from-primary/90 hover:via-purple-500 hover:to-accent/90 text-white shadow-2xl shadow-primary/50 transition-all hover:scale-105 hover:shadow-primary/70"
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
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                  All Creators. One Hub.
                </h2>
                <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                  Ditch scattered subchannels, forums, and buried comments. Find exactly what you need. VirtuoHub gives you profiles, organized feeds, and real opportunities in one place where your work is seen and valued.
                </p>
                <Button 
                  asChild 
                  size="lg"
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
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                  What You Can Post
                </h2>
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                  Choose the right category for your post. Each section is designed to help you connect with the right audience and get the engagement you need.
                </p>
              </div>

              <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                <Card className="hover:shadow-lg transition-shadow" data-testid="card-wip">
                  <CardContent className="p-6">
                    <MessageSquare className="w-8 h-8 text-primary mb-4" />
                    <h3 className="text-xl font-semibold text-foreground mb-3">
                      WIP (Work in Progress)
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Share progress, get eyes on your build, and track iterations.
                    </p>
                    <div className="flex gap-2">
                      <Button asChild variant="outline" size="sm" className="bg-gradient-mist hover:bg-gradient-mist-hover border-slate-200 text-slate-700 shadow-md hover:shadow-lg transition-all" data-testid="button-browse-wip">
                        <Link href="/?tag=wip">Browse</Link>
                      </Button>
                      <Button size="sm" className="bg-gradient-aurora hover:bg-gradient-aurora-hover text-white shadow-lg hover:shadow-xl transition-all" data-testid="button-start-wip">Start Thread</Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow" data-testid="card-help-feedback">
                  <CardContent className="p-6">
                    <Users className="w-8 h-8 text-primary mb-4" />
                    <h3 className="text-xl font-semibold text-foreground mb-3">
                      Help & Feedback
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Ask questions, debug blockers, and get quick reviews.
                    </p>
                    <div className="flex gap-2">
                      <Button asChild variant="outline" size="sm" className="bg-gradient-mist hover:bg-gradient-mist-hover border-slate-200 text-slate-700 shadow-md hover:shadow-lg transition-all" data-testid="button-browse-help">
                        <Link href="/?tag=help-feedback">Browse</Link>
                      </Button>
                      <Button size="sm" className="bg-gradient-nebula hover:bg-gradient-nebula-hover text-white shadow-lg hover:shadow-xl transition-all" data-testid="button-start-help">Start Thread</Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow" data-testid="card-tutorials-guides">
                  <CardContent className="p-6">
                    <BookOpen className="w-8 h-8 text-primary mb-4" />
                    <h3 className="text-xl font-semibold text-foreground mb-3">
                      Tutorials & Guides
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Post step-by-step walkthroughs and quick tips.
                    </p>
                    <div className="flex gap-2">
                      <Button asChild variant="outline" size="sm" className="bg-gradient-mist hover:bg-gradient-mist-hover border-slate-200 text-slate-700 shadow-md hover:shadow-lg transition-all" data-testid="button-browse-tutorials">
                        <Link href="/?tag=tutorials-guides">Browse</Link>
                      </Button>
                      <Button size="sm" className="bg-gradient-cosmic hover:bg-gradient-cosmic-hover text-white shadow-lg hover:shadow-xl transition-all" data-testid="button-start-tutorial">Start Thread</Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow" data-testid="card-jobs-gigs">
                  <CardContent className="p-6">
                    <Users className="w-8 h-8 text-primary mb-4" />
                    <h3 className="text-xl font-semibold text-foreground mb-3">
                      Jobs & Gigs
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Hire talent or offer your services.
                    </p>
                    <div className="flex gap-2">
                      <Button asChild variant="outline" size="sm" className="bg-gradient-mist hover:bg-gradient-mist-hover border-slate-200 text-slate-700 shadow-md hover:shadow-lg transition-all" data-testid="button-browse-jobs">
                        <Link href="/?tag=jobs-gigs">Browse</Link>
                      </Button>
                      <Button size="sm" className="bg-gradient-aurora hover:bg-gradient-aurora-hover text-white shadow-lg hover:shadow-xl transition-all" data-testid="button-start-job">Start Thread</Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow" data-testid="card-assets-sale">
                  <CardContent className="p-6">
                    <ShoppingBag className="w-8 h-8 text-primary mb-4" />
                    <h3 className="text-xl font-semibold text-foreground mb-3">
                      Assets for Sale
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      List avatars, props, shaders, tools, and more.
                    </p>
                    <div className="flex gap-2">
                      <Button asChild variant="outline" size="sm" className="bg-gradient-mist hover:bg-gradient-mist-hover border-slate-200 text-slate-700 shadow-md hover:shadow-lg transition-all" data-testid="button-browse-assets">
                        <Link href="/?tag=assets-for-sale">Browse</Link>
                      </Button>
                      <Button size="sm" className="bg-gradient-nebula hover:bg-gradient-nebula-hover text-white shadow-lg hover:shadow-xl transition-all" data-testid="button-start-asset">Start Thread</Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow" data-testid="card-collabs-teams">
                  <CardContent className="p-6">
                    <Users className="w-8 h-8 text-primary mb-4" />
                    <h3 className="text-xl font-semibold text-foreground mb-3">
                      Collabs & Teams
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Find collaborators or recruit for a project.
                    </p>
                    <div className="flex gap-2">
                      <Button asChild variant="outline" size="sm" className="bg-gradient-mist hover:bg-gradient-mist-hover border-slate-200 text-slate-700 shadow-md hover:shadow-lg transition-all" data-testid="button-browse-collabs">
                        <Link href="/?tag=collabs-teams">Browse</Link>
                      </Button>
                      <Button size="sm" className="bg-gradient-cosmic hover:bg-gradient-cosmic-hover text-white shadow-lg hover:shadow-xl transition-all" data-testid="button-start-collab">Start Thread</Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow" data-testid="card-events-workshops">
                  <CardContent className="p-6">
                    <Calendar className="w-8 h-8 text-primary mb-4" />
                    <h3 className="text-xl font-semibold text-foreground mb-3">
                      Events & Workshops
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Promote a session, stream, or in-person meetup.
                    </p>
                    <div className="flex gap-2">
                      <Button asChild variant="outline" size="sm" className="bg-gradient-mist hover:bg-gradient-mist-hover border-slate-200 text-slate-700 shadow-md hover:shadow-lg transition-all" data-testid="button-browse-events-cat">
                        <Link href="/?tag=events-workshops">Browse</Link>
                      </Button>
                      <Button size="sm" className="bg-gradient-aurora hover:bg-gradient-aurora-hover text-white shadow-lg hover:shadow-xl transition-all" data-testid="button-start-event">Start Thread</Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow" data-testid="card-platform-qa">
                  <CardContent className="p-6">
                    <MessageSquare className="w-8 h-8 text-primary mb-4" />
                    <h3 className="text-xl font-semibold text-foreground mb-3">
                      Platform Q&A
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Roblox, VRChat, Horizon, Second Life, and more.
                    </p>
                    <div className="flex gap-2">
                      <Button asChild variant="outline" size="sm" className="bg-gradient-mist hover:bg-gradient-mist-hover border-slate-200 text-slate-700 shadow-md hover:shadow-lg transition-all" data-testid="button-browse-platform">
                        <Link href="/?tag=platform-qa">Browse</Link>
                      </Button>
                      <Button size="sm" className="bg-gradient-nebula hover:bg-gradient-nebula-hover text-white shadow-lg hover:shadow-xl transition-all" data-testid="button-start-platform">Start Thread</Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow" data-testid="card-general">
                  <CardContent className="p-6">
                    <MessageSquare className="w-8 h-8 text-primary mb-4" />
                    <h3 className="text-xl font-semibold text-foreground mb-3">
                      General
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Anything that doesn't fit the other buckets.
                    </p>
                    <div className="flex gap-2">
                      <Button asChild variant="outline" size="sm" className="bg-gradient-mist hover:bg-gradient-mist-hover border-slate-200 text-slate-700 shadow-md hover:shadow-lg transition-all" data-testid="button-browse-general">
                        <Link href="/?tag=general">Browse</Link>
                      </Button>
                      <Button size="sm" className="bg-gradient-cosmic hover:bg-gradient-cosmic-hover text-white shadow-lg hover:shadow-xl transition-all" data-testid="button-start-general">Start Thread</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Editorial & Data Section */}
            <section className="relative px-6 py-16 bg-muted/30 rounded-2xl mx-6 overflow-hidden">
              {/* Subtle ambient background shapes for Editorial section */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-24 -right-24 w-[450px] h-[450px] bg-gradient-radial from-violet-400/6 via-purple-500/3 to-transparent blur-[90px]"></div>
                <div className="absolute -bottom-24 -left-24 w-[400px] h-[400px] bg-gradient-radial from-indigo-400/5 via-blue-500/2 to-transparent blur-[70px]"></div>
                <div className="absolute top-1/2 right-1/3 w-[300px] h-[300px] bg-gradient-radial from-cyan-400/4 via-teal-500/2 to-transparent blur-[50px]"></div>
              </div>
              
              <div className="relative z-10 text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                  Editorial & Data
                </h2>
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                  Curated content, insights, and data-driven reports from our editorial team and community research.
                </p>
              </div>

              <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                <Card className="hover:shadow-lg transition-shadow" data-testid="card-spotlights">
                  <CardContent className="p-6 flex flex-col h-full">
                    <Users className="w-8 h-8 text-primary mb-4" />
                    <h3 className="text-xl font-semibold text-foreground mb-3">
                      Creator Spotlights
                    </h3>
                    <p className="text-muted-foreground mb-4 flex-1">
                      Featured creator profiles and success stories.
                    </p>
                    <Button asChild variant="outline" size="sm" className="w-full bg-gradient-dawn hover:bg-gradient-dawn-hover border-purple-200 text-purple-700 shadow-md hover:shadow-lg transition-all mt-auto" data-testid="button-read-spotlights">
                      <Link href="/spotlights">Read</Link>
                    </Button>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow" data-testid="card-interviews">
                  <CardContent className="p-6 flex flex-col h-full">
                    <MessageSquare className="w-8 h-8 text-primary mb-4" />
                    <h3 className="text-xl font-semibold text-foreground mb-3">
                      Interviews
                    </h3>
                    <p className="text-muted-foreground mb-4 flex-1">
                      In-depth Q&As with industry leaders and creators.
                    </p>
                    <Button asChild variant="outline" size="sm" className="w-full bg-gradient-dusk hover:bg-gradient-dusk-hover border-indigo-200 text-indigo-700 shadow-md hover:shadow-lg transition-all mt-auto" data-testid="button-read-interviews">
                      <Link href="/interviews">Read</Link>
                    </Button>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow" data-testid="card-tips-guides">
                  <CardContent className="p-6 flex flex-col h-full">
                    <BookOpen className="w-8 h-8 text-primary mb-4" />
                    <h3 className="text-xl font-semibold text-foreground mb-3">
                      Tips & Guides
                    </h3>
                    <p className="text-muted-foreground mb-4 flex-1">
                      Expert tutorials and best practice guides.
                    </p>
                    <Button asChild variant="outline" size="sm" className="w-full bg-gradient-dawn hover:bg-gradient-dawn-hover border-violet-200 text-violet-700 shadow-md hover:shadow-lg transition-all mt-auto" data-testid="button-read-guides">
                      <Link href="/guides">Read</Link>
                    </Button>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow" data-testid="card-industry-news">
                  <CardContent className="p-6 flex flex-col h-full">
                    <BarChart3 className="w-8 h-8 text-primary mb-4" />
                    <h3 className="text-xl font-semibold text-foreground mb-3">
                      Industry News
                    </h3>
                    <p className="text-muted-foreground mb-4 flex-1">
                      Latest updates from virtual world platforms.
                    </p>
                    <Button asChild variant="outline" size="sm" className="w-full bg-gradient-dusk hover:bg-gradient-dusk-hover border-purple-200 text-purple-700 shadow-md hover:shadow-lg transition-all mt-auto" data-testid="button-read-news">
                      <Link href="/news">Read</Link>
                    </Button>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow" data-testid="card-trending">
                  <CardContent className="p-6 flex flex-col h-full">
                    <TrendingUp className="w-8 h-8 text-primary mb-4" />
                    <h3 className="text-xl font-semibold text-foreground mb-3">
                      Trending
                    </h3>
                    <p className="text-muted-foreground mb-4 flex-1">
                      Most popular content across all categories.
                    </p>
                    <Button asChild variant="outline" size="sm" className="w-full bg-gradient-dawn hover:bg-gradient-dawn-hover border-indigo-200 text-indigo-700 shadow-md hover:shadow-lg transition-all mt-auto" data-testid="button-explore-trending">
                      <Link href="/trending">Explore</Link>
                    </Button>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow" data-testid="card-upcoming-events">
                  <CardContent className="p-6 flex flex-col h-full">
                    <Calendar className="w-8 h-8 text-primary mb-4" />
                    <h3 className="text-xl font-semibold text-foreground mb-3">
                      Upcoming Events
                    </h3>
                    <p className="text-muted-foreground mb-4 flex-1">
                      Community events and workshops calendar.
                    </p>
                    <Button asChild variant="outline" size="sm" className="w-full bg-gradient-dusk hover:bg-gradient-dusk-hover border-violet-200 text-violet-700 shadow-md hover:shadow-lg transition-all mt-auto" data-testid="button-view-schedule">
                      <Link href="/events">View Schedule</Link>
                    </Button>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow" data-testid="card-pulse-reports">
                  <CardContent className="p-6 flex flex-col h-full">
                    <BarChart3 className="w-8 h-8 text-primary mb-4" />
                    <h3 className="text-xl font-semibold text-foreground mb-3">
                      Pulse Reports
                    </h3>
                    <p className="text-muted-foreground mb-4 flex-1">
                      Data insights and community polls analysis.
                    </p>
                    <Button asChild variant="outline" size="sm" className="w-full bg-gradient-dawn hover:bg-gradient-dawn-hover border-purple-200 text-purple-700 shadow-md hover:shadow-lg transition-all mt-auto" data-testid="button-explore-pulse">
                      <Link href="/pulse">Explore</Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Featured Content Section */}
            <section className="px-6 py-16">
              <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Featured Content
                </h2>
                <p className="text-lg text-muted-foreground">
                  Discover the latest insights, interviews, and guides from our community
                </p>
              </div>
              <FeaturedCarousel items={featuredItems} />
            </section>

            {/* Pulse Teaser Section */}
            <section className="px-6 py-12">
              <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
                <CardContent className="p-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-2xl font-bold text-foreground mb-2 flex items-center gap-2">
                        <TrendingUp className="w-6 h-6 text-primary" />
                        VHub Data Pulse
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        Real insights from our creator community. See what's trending across platforms.
                      </p>
                      <div className="flex gap-6 text-sm">
                        <div data-testid="metric-active-polls">
                          <span className="block text-2xl font-bold text-primary">12</span>
                          <span className="text-muted-foreground">Active Polls</span>
                        </div>
                        <div data-testid="metric-responses">
                          <span className="block text-2xl font-bold text-accent">1,247</span>
                          <span className="text-muted-foreground">Responses</span>
                        </div>
                        <div data-testid="metric-insights">
                          <span className="block text-2xl font-bold text-primary">8</span>
                          <span className="text-muted-foreground">New Insights</span>
                        </div>
                      </div>
                    </div>
                    <Button asChild variant="outline" data-testid="button-view-pulse">
                      <Link href="/pulse">
                        View Full Charts
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Events Strip Section */}
            <section className="px-6 py-12">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-bold text-foreground">Upcoming Events</h3>
                <Button asChild variant="outline" data-testid="button-see-all-events">
                  <Link href="/events">See All Events</Link>
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="hover:shadow-lg transition-shadow" data-testid="card-event-1">
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

                <Card className="hover:shadow-lg transition-shadow" data-testid="card-event-2">
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

                <Card className="hover:shadow-lg transition-shadow" data-testid="card-event-3">
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
    </div>
  );
};

export default HomePage;