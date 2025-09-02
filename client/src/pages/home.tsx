import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { FeaturedCarousel } from "@/components/featured/FeaturedCarousel";
import { featuredItems } from "@/components/featured/types";
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
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="floating-element absolute top-20 left-10 w-16 h-16 bg-primary/20 rounded-full blur-xl"></div>
        <div className="floating-element absolute top-40 right-20 w-24 h-24 bg-accent/20 rounded-full blur-xl" style={{ animationDelay: '-2s' }}></div>
        <div className="floating-element absolute bottom-20 left-1/4 w-20 h-20 bg-primary/15 rounded-full blur-xl" style={{ animationDelay: '-4s' }}></div>
        <div className="floating-element absolute top-1/2 right-1/3 w-12 h-12 bg-accent/25 rounded-full blur-xl" style={{ animationDelay: '-6s' }}></div>
      </div>

      <Header />
      
      <main className="w-full relative">
        {/* Hero Banner Section */}
        <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
          {/* Hero Background with Glow */}
          <div className="absolute inset-0 header-glow">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/5 to-background opacity-80"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>
          </div>
          
          {/* Hero Content */}
          <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
            <div className="space-y-8">
              {/* Main Headline */}
              <div className="space-y-4">
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-tight">
                  <span className="block gradient-text font-display">The Leading</span>
                  <span className="block text-foreground font-sans font-medium text-4xl md:text-5xl lg:text-6xl opacity-90">
                    Cultural & Educational
                  </span>
                  <span className="block gradient-text font-display text-6xl md:text-8xl lg:text-9xl">
                    Hub
                  </span>
                </h1>
                <p className="text-lg md:text-xl font-light text-muted-foreground/80 italic">
                  for active and aspiring world builders
                </p>
              </div>

              {/* Subline */}
              <div className="max-w-4xl mx-auto space-y-4">
                <p className="text-xl md:text-2xl lg:text-3xl font-medium text-foreground/90 leading-relaxed">
                  <span className="font-bold text-primary">Learn.</span> 
                  <span className="mx-2 font-bold text-accent">Monetize.</span> 
                  <span className="font-bold gradient-text">Connect.</span>
                </p>
                <p className="text-base md:text-lg text-muted-foreground leading-relaxed font-light">
                  Shaping the future of digital creators with insider insights, multi-platform learning, and real business growth.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8">
                <div className="flex flex-col items-center gap-3">
                  <Button 
                    asChild 
                    size="lg" 
                    className="px-10 py-4 text-lg font-semibold bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-2xl shadow-primary/25 transform hover:scale-105 transition-all duration-300 border-0"
                    data-testid="button-join-community"
                  >
                    <Link href="/">
                      <span className="flex items-center gap-2">
                        Join the Community
                        <ArrowRight className="w-5 h-5" />
                      </span>
                    </Link>
                  </Button>
                  <span className="text-sm text-muted-foreground font-medium" data-testid="text-signup-micro">
                    Create your free account today
                  </span>
                </div>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="px-10 py-4 text-lg font-semibold border-2 border-primary/30 hover:border-primary hover:bg-primary/10 backdrop-blur-sm shadow-xl transform hover:scale-105 transition-all duration-300"
                  data-testid="button-watch-demo"
                >
                  Watch Demo
                </Button>
              </div>
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-background to-transparent"></div>
        </section>

        <div className="max-w-6xl mx-auto">

            {/* All Creators. One Hub Section */}
            <section className="relative px-6 py-20 mx-6 mb-20">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/3 to-muted/20 rounded-3xl backdrop-blur-sm border border-primary/10 shadow-2xl"></div>
              <div className="relative z-10 max-w-4xl mx-auto text-center">
                <div className="space-y-8">
                  <h2 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight">
                    <span className="gradient-text font-display">All Creators.</span>
                    <br />
                    <span className="text-foreground font-sans font-light">One Hub.</span>
                  </h2>
                  <p className="text-lg md:text-xl text-muted-foreground/90 leading-relaxed font-light max-w-3xl mx-auto">
                    Ditch scattered subchannels, forums, and buried comments. Find exactly what you need. 
                    <span className="font-medium text-foreground">VirtuoHub gives you profiles, organized feeds, and real opportunities</span> 
                    in one place where your work is seen and valued.
                  </p>
                  <Button 
                    asChild 
                    size="lg"
                    className="px-8 py-4 text-lg font-semibold bg-gradient-to-r from-accent to-primary hover:from-accent/90 hover:to-primary/90 shadow-xl shadow-accent/20 transform hover:scale-105 transition-all duration-300"
                    data-testid="button-find-community"
                  >
                    <Link href="/">
                      <span className="flex items-center gap-2">
                        Find Your Community
                        <ArrowRight className="w-5 h-5" />
                      </span>
                    </Link>
                  </Button>
                </div>
              </div>
            </section>

            {/* What You'll Find Section */}
            <section className="px-6 py-20">
              <div className="text-center mb-16">
                <div className="space-y-6">
                  <h2 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight">
                    <span className="text-foreground font-display">What You'll Find</span>
                    <br />
                    <span className="gradient-text font-sans font-light text-3xl md:text-4xl lg:text-5xl">in the Community</span>
                  </h2>
                  <p className="text-lg md:text-xl text-muted-foreground/90 max-w-4xl mx-auto leading-relaxed font-light">
                    <span className="font-semibold text-primary">VirtuoHub is a smarter way</span> to run community threads. 
                    <span className="font-medium text-foreground">Tutorials, events, insights, talent, and real discussions</span> 
                    that move the industry forward.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
                <Card className="group relative overflow-hidden bg-gradient-to-br from-background to-muted/20 border-primary/20 hover:border-primary/40 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-500" data-testid="card-tutorials">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <CardContent className="relative p-8">
                    <div className="mb-6 relative">
                      <div className="absolute -inset-2 bg-primary/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <BookOpen className="relative w-10 h-10 text-primary group-hover:text-primary/90 transition-colors duration-300" />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground mb-4 group-hover:gradient-text transition-all duration-300">
                      Tutorials & Guides
                    </h3>
                    <p className="text-muted-foreground/80 leading-relaxed group-hover:text-muted-foreground transition-colors duration-300">
                      Learn faster with step-by-step posts from creators like you.
                    </p>
                  </CardContent>
                </Card>

                <Card className="group relative overflow-hidden bg-gradient-to-br from-background to-muted/20 border-accent/20 hover:border-accent/40 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-500" data-testid="card-workshops">
                  <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <CardContent className="relative p-8">
                    <div className="mb-6 relative">
                      <div className="absolute -inset-2 bg-accent/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <Calendar className="relative w-10 h-10 text-accent group-hover:text-accent/90 transition-colors duration-300" />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground mb-4 group-hover:gradient-text transition-all duration-300">
                      Workshops & Events
                    </h3>
                    <p className="text-muted-foreground/80 leading-relaxed group-hover:text-muted-foreground transition-colors duration-300">
                      Host or join live sessions and share skills in real time.
                    </p>
                  </CardContent>
                </Card>

                <Card className="group relative overflow-hidden bg-gradient-to-br from-background to-muted/20 border-primary/20 hover:border-primary/40 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-500" data-testid="card-interviews">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <CardContent className="relative p-8">
                    <div className="mb-6 relative">
                      <div className="absolute -inset-2 bg-primary/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <MessageSquare className="relative w-10 h-10 text-primary group-hover:text-primary/90 transition-colors duration-300" />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground mb-4 group-hover:gradient-text transition-all duration-300">
                      Interviews
                    </h3>
                    <p className="text-muted-foreground/80 leading-relaxed group-hover:text-muted-foreground transition-colors duration-300">
                      Stay ahead with creator stories, updates, and deep dives.
                    </p>
                  </CardContent>
                </Card>

                <Card className="group relative overflow-hidden bg-gradient-to-br from-background to-muted/20 border-accent/20 hover:border-accent/40 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-500" data-testid="card-talent">
                  <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <CardContent className="relative p-8">
                    <div className="mb-6 relative">
                      <div className="absolute -inset-2 bg-accent/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <Users className="relative w-10 h-10 text-accent group-hover:text-accent/90 transition-colors duration-300" />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground mb-4 group-hover:gradient-text transition-all duration-300">
                      Talent Market
                    </h3>
                    <p className="text-muted-foreground/80 leading-relaxed group-hover:text-muted-foreground transition-colors duration-300">
                      List your skills or hire for the next project.
                    </p>
                  </CardContent>
                </Card>

                <Card className="group relative overflow-hidden bg-gradient-to-br from-background to-muted/20 border-primary/20 hover:border-primary/40 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-500" data-testid="card-marketplace">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <CardContent className="relative p-8">
                    <div className="mb-6 relative">
                      <div className="absolute -inset-2 bg-primary/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <ShoppingBag className="relative w-10 h-10 text-primary group-hover:text-primary/90 transition-colors duration-300" />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground mb-4 group-hover:gradient-text transition-all duration-300">
                      Marketplace
                    </h3>
                    <p className="text-muted-foreground/80 leading-relaxed group-hover:text-muted-foreground transition-colors duration-300">
                      Preview and showcase assets for a ready audience.
                    </p>
                  </CardContent>
                </Card>

                <Card className="group relative overflow-hidden bg-gradient-to-br from-background to-muted/20 border-accent/20 hover:border-accent/40 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-500" data-testid="card-pulse">
                  <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <CardContent className="relative p-8">
                    <div className="mb-6 relative">
                      <div className="absolute -inset-2 bg-accent/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <BarChart3 className="relative w-10 h-10 text-accent group-hover:text-accent/90 transition-colors duration-300" />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground mb-4 group-hover:gradient-text transition-all duration-300">
                      Pulse Reports
                    </h3>
                    <p className="text-muted-foreground/80 leading-relaxed group-hover:text-muted-foreground transition-colors duration-300">
                      Polls and focused discussions that give creators a voice with the platforms they build in.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Featured Content Section */}
            <section className="px-6 py-20">
              <div className="text-center mb-12">
                <div className="space-y-6">
                  <h2 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight">
                    <span className="gradient-text font-display">Featured</span>
                    <span className="text-foreground font-sans font-light ml-4">Content</span>
                  </h2>
                  <p className="text-lg md:text-xl text-muted-foreground/90 font-light max-w-3xl mx-auto">
                    Discover the <span className="font-semibold text-foreground">latest insights, interviews, and guides</span> from our community
                  </p>
                </div>
              </div>
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-primary/10 via-accent/5 to-primary/10 rounded-3xl blur-xl opacity-50"></div>
                <div className="relative">
                  <FeaturedCarousel items={featuredItems} />
                </div>
              </div>
            </section>

            {/* Pulse Teaser Section */}
            <section className="px-6 py-16">
              <Card className="group relative overflow-hidden bg-gradient-to-br from-primary/10 via-accent/5 to-background border-primary/30 shadow-2xl hover:shadow-primary/10 transition-all duration-500">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <CardContent className="relative p-10">
                  <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
                    <div className="space-y-6">
                      <div className="space-y-3">
                        <h3 className="text-3xl md:text-4xl font-black text-foreground flex items-center gap-3">
                          <div className="relative">
                            <div className="absolute -inset-2 bg-primary/20 rounded-full blur-xl opacity-75"></div>
                            <TrendingUp className="relative w-8 h-8 text-primary" />
                          </div>
                          <span className="gradient-text font-display">VHub Data Pulse</span>
                        </h3>
                        <p className="text-lg text-muted-foreground/90 font-light max-w-2xl">
                          Real insights from our creator community. <span className="font-semibold text-foreground">See what's trending</span> across platforms.
                        </p>
                      </div>
                      <div className="grid grid-cols-3 gap-8">
                        <div className="text-center" data-testid="metric-active-polls">
                          <div className="space-y-2">
                            <span className="block text-4xl md:text-5xl font-black gradient-text">12</span>
                            <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Active Polls</span>
                          </div>
                        </div>
                        <div className="text-center" data-testid="metric-responses">
                          <div className="space-y-2">
                            <span className="block text-4xl md:text-5xl font-black text-accent">1,247</span>
                            <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Responses</span>
                          </div>
                        </div>
                        <div className="text-center" data-testid="metric-insights">
                          <div className="space-y-2">
                            <span className="block text-4xl md:text-5xl font-black text-primary">8</span>
                            <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">New Insights</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <Button 
                      asChild 
                      className="px-8 py-4 text-lg font-semibold bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-xl shadow-primary/20 transform hover:scale-105 transition-all duration-300 border-0"
                      data-testid="button-view-pulse"
                    >
                      <Link href="/pulse">
                        <span className="flex items-center gap-2">
                          View Full Charts
                          <ArrowRight className="w-5 h-5" />
                        </span>
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Events Strip Section */}
            <section className="px-6 py-16">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-12 gap-6">
                <div className="space-y-2">
                  <h3 className="text-3xl md:text-4xl font-black leading-tight">
                    <span className="gradient-text font-display">Upcoming</span>
                    <span className="text-foreground font-sans font-light ml-3">Events</span>
                  </h3>
                  <p className="text-muted-foreground/80 font-light">Join live sessions and connect with creators</p>
                </div>
                <Button 
                  asChild 
                  className="px-6 py-3 font-semibold bg-gradient-to-r from-accent to-primary hover:from-accent/90 hover:to-primary/90 shadow-lg transform hover:scale-105 transition-all duration-300"
                  data-testid="button-see-all-events"
                >
                  <Link href="/events">
                    <span className="flex items-center gap-2">
                      See All Events
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </Link>
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <Card className="group relative overflow-hidden bg-gradient-to-br from-background to-muted/20 border-primary/20 hover:border-primary/40 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-500" data-testid="card-event-1">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <CardContent className="relative p-6">
                    <div className="flex items-start gap-3 mb-4">
                      <div className="relative">
                        <div className="absolute -inset-1 bg-primary/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <Clock className="relative w-6 h-6 text-primary" />
                      </div>
                      <div className="space-y-1">
                        <span className="text-sm font-bold text-primary">Dec 15, 2024</span>
                        <span className="block text-xs text-muted-foreground font-medium">2:00 PM EST</span>
                      </div>
                    </div>
                    <h4 className="text-lg font-bold text-foreground mb-3 group-hover:gradient-text transition-all duration-300">
                      VRChat Creator Meetup
                    </h4>
                    <p className="text-sm text-muted-foreground/80 leading-relaxed group-hover:text-muted-foreground transition-colors duration-300">
                      Join fellow VRChat creators for networking and collaboration opportunities.
                    </p>
                  </CardContent>
                </Card>

                <Card className="group relative overflow-hidden bg-gradient-to-br from-background to-muted/20 border-accent/20 hover:border-accent/40 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-500" data-testid="card-event-2">
                  <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <CardContent className="relative p-6">
                    <div className="flex items-start gap-3 mb-4">
                      <div className="relative">
                        <div className="absolute -inset-1 bg-accent/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <Clock className="relative w-6 h-6 text-accent" />
                      </div>
                      <div className="space-y-1">
                        <span className="text-sm font-bold text-accent">Dec 18, 2024</span>
                        <span className="block text-xs text-muted-foreground font-medium">7:00 PM EST</span>
                      </div>
                    </div>
                    <h4 className="text-lg font-bold text-foreground mb-3 group-hover:gradient-text transition-all duration-300">
                      Unity Workshop: Advanced Scripting
                    </h4>
                    <p className="text-sm text-muted-foreground/80 leading-relaxed group-hover:text-muted-foreground transition-colors duration-300">
                      Learn advanced Unity scripting techniques from industry professionals.
                    </p>
                  </CardContent>
                </Card>

                <Card className="group relative overflow-hidden bg-gradient-to-br from-background to-muted/20 border-primary/20 hover:border-primary/40 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-500" data-testid="card-event-3">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <CardContent className="relative p-6">
                    <div className="flex items-start gap-3 mb-4">
                      <div className="relative">
                        <div className="absolute -inset-1 bg-primary/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <Clock className="relative w-6 h-6 text-primary" />
                      </div>
                      <div className="space-y-1">
                        <span className="text-sm font-bold text-primary">Dec 22, 2024</span>
                        <span className="block text-xs text-muted-foreground font-medium">4:00 PM EST</span>
                      </div>
                    </div>
                    <h4 className="text-lg font-bold text-foreground mb-3 group-hover:gradient-text transition-all duration-300">
                      Monetization Strategies Panel
                    </h4>
                    <p className="text-sm text-muted-foreground/80 leading-relaxed group-hover:text-muted-foreground transition-colors duration-300">
                      Expert panel discussion on monetizing virtual world creations.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </section>
          </div>
        </main>

      <Footer />
    </div>
  );
};

export default HomePage;