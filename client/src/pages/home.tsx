import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Header } from "@/components/layout/header";
import { LeftSidebar } from "@/components/layout/left-sidebar";
import { RightSidebar } from "@/components/layout/right-sidebar";
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
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="flex">
        <LeftSidebar 
          currentTab="all" 
          onTabChange={() => {}} 
        />
        
        <main className="flex-1 min-w-0">
          <div className="max-w-4xl mx-auto">
            {/* Hero Section */}
            <section className="px-6 py-16 text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
                The leading cultural and educational hub for active and aspiring world builders.
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
                Shaping the future of digital creators with insider insights, multi-platform learning, and real business growth. Learn. Monetize. Connect.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <div className="flex flex-col items-center gap-2">
                  <Button 
                    asChild 
                    size="lg" 
                    className="px-8 py-3 text-lg"
                    data-testid="button-join-community"
                  >
                    <Link href="/community">Join the Community</Link>
                  </Button>
                  <span className="text-sm text-muted-foreground" data-testid="text-signup-micro">
                    Create your free account today
                  </span>
                </div>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="px-8 py-3 text-lg"
                  data-testid="button-watch-demo"
                >
                  Watch Demo
                </Button>
              </div>
            </section>

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
                  <Link href="/community">Find Your Community</Link>
                </Button>
              </div>
            </section>

            {/* What You'll Find Section */}
            <section className="px-6 py-16">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                  What You'll Find in the Community
                </h2>
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                  VirtuoHub is a smarter way to run community threads. Tutorials, events, insights, talent, and real discussions that move the industry forward.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                <Card className="hover:shadow-lg transition-shadow" data-testid="card-tutorials">
                  <CardContent className="p-6">
                    <BookOpen className="w-8 h-8 text-primary mb-4" />
                    <h3 className="text-xl font-semibold text-foreground mb-3">
                      Tutorials and Guides
                    </h3>
                    <p className="text-muted-foreground">
                      Learn faster with step-by-step posts from creators like you.
                    </p>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow" data-testid="card-workshops">
                  <CardContent className="p-6">
                    <Calendar className="w-8 h-8 text-primary mb-4" />
                    <h3 className="text-xl font-semibold text-foreground mb-3">
                      Workshops and Events
                    </h3>
                    <p className="text-muted-foreground">
                      Host or join live sessions and share skills in real time.
                    </p>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow" data-testid="card-interviews">
                  <CardContent className="p-6">
                    <MessageSquare className="w-8 h-8 text-primary mb-4" />
                    <h3 className="text-xl font-semibold text-foreground mb-3">
                      Interviews
                    </h3>
                    <p className="text-muted-foreground">
                      Stay ahead with creator stories, updates, and deep dives.
                    </p>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow" data-testid="card-talent">
                  <CardContent className="p-6">
                    <Users className="w-8 h-8 text-primary mb-4" />
                    <h3 className="text-xl font-semibold text-foreground mb-3">
                      Talent Market
                    </h3>
                    <p className="text-muted-foreground">
                      List your skills or hire for the next project.
                    </p>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow" data-testid="card-marketplace">
                  <CardContent className="p-6">
                    <ShoppingBag className="w-8 h-8 text-primary mb-4" />
                    <h3 className="text-xl font-semibold text-foreground mb-3">
                      Marketplace
                    </h3>
                    <p className="text-muted-foreground">
                      Preview and showcase assets for a ready audience.
                    </p>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow" data-testid="card-pulse">
                  <CardContent className="p-6">
                    <BarChart3 className="w-8 h-8 text-primary mb-4" />
                    <h3 className="text-xl font-semibold text-foreground mb-3">
                      Pulse Reports
                    </h3>
                    <p className="text-muted-foreground">
                      Polls and focused discussions that give creators a voice with the platforms they build in.
                    </p>
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
        </main>

        <RightSidebar />
      </div>

      <Footer />
    </div>
  );
};

export default HomePage;