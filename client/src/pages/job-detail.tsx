import { useParams, useLocation, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MapPin, DollarSign, Calendar, Briefcase } from "lucide-react";
import { format } from "date-fns";

interface Job {
  id: string;
  user_id: string;
  title: string;
  company_name: string | null;
  primary_skill: string;
  platform: string;
  job_type: string;
  budget: string | null;
  is_remote: boolean;
  location: string | null;
  description: string;
  visibility: string;
  created_at: string;
}

export default function JobDetail() {
  const { id } = useParams();
  const [location] = useLocation();
  
  // Parse query params to determine back navigation
  const searchParams = new URLSearchParams(location.split('?')[1] || '');
  const from = searchParams.get('from');
  const backUrl = from === 'talent_work' ? '/talent?tab=work' : '/talent?tab=work';

  // Fetch job from Supabase
  const { data: job, isLoading, error } = useQuery<Job>({
    queryKey: ['/api/jobs', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('id', id)
        .eq('visibility', 'PUBLIC')
        .single();

      if (error) {
        console.error('Error fetching job:', error);
        throw error;
      }

      return data;
    },
    enabled: !!id,
  });

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 py-10">
          {/* Back Navigation */}
          <div className="mb-6">
            <Link 
              href={backUrl}
              className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
              data-testid="link-back-find-work"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Find Work
            </Link>
          </div>

          {/* Loading State */}
          {isLoading && (
            <Card className="p-8">
              <div className="animate-pulse space-y-4">
                <div className="h-8 bg-muted rounded w-3/4"></div>
                <div className="h-6 bg-muted rounded w-1/2"></div>
                <div className="flex gap-2">
                  <div className="h-6 bg-muted rounded w-24"></div>
                  <div className="h-6 bg-muted rounded w-24"></div>
                  <div className="h-6 bg-muted rounded w-24"></div>
                </div>
                <div className="space-y-2 pt-4">
                  <div className="h-4 bg-muted rounded"></div>
                  <div className="h-4 bg-muted rounded"></div>
                  <div className="h-4 bg-muted rounded w-5/6"></div>
                </div>
              </div>
            </Card>
          )}

          {/* Error / Not Found State */}
          {(error || (!isLoading && !job)) && (
            <Card className="p-8 text-center" data-testid="job-not-found">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Briefcase className="w-8 h-8 text-muted-foreground" />
              </div>
              <h2 className="text-2xl font-semibold mb-2">Job not found</h2>
              <p className="text-muted-foreground mb-6">
                This job posting is no longer available or does not exist.
              </p>
              <Link href={backUrl}>
                <Button data-testid="button-back-to-jobs">
                  Back to Find Work
                </Button>
              </Link>
            </Card>
          )}

          {/* Job Detail */}
          {!isLoading && !error && job && (
            <Card className="p-8" data-testid="job-detail-card">
              {/* Job Title */}
              <h1 className="text-4xl font-bold mb-3" data-testid="job-detail-title">
                {job.title}
              </h1>

              {/* Company Name */}
              {job.company_name && (
                <p className="text-xl text-muted-foreground mb-6" data-testid="job-detail-company">
                  {job.company_name}
                </p>
              )}

              {/* Tags Row */}
              <div className="flex flex-wrap gap-2 mb-6">
                <Badge variant="default" className="text-sm" data-testid="job-detail-skill">
                  {job.primary_skill}
                </Badge>
                <Badge variant="outline" className="text-sm" data-testid="job-detail-platform">
                  {job.platform}
                </Badge>
                <Badge variant="outline" className="text-sm" data-testid="job-detail-type">
                  {job.job_type}
                </Badge>
                {job.is_remote && (
                  <Badge variant="secondary" className="text-sm flex items-center gap-1" data-testid="job-detail-remote">
                    <MapPin className="w-3 h-3" />
                    Remote
                  </Badge>
                )}
                {!job.is_remote && job.location && (
                  <Badge variant="secondary" className="text-sm flex items-center gap-1" data-testid="job-detail-location">
                    <MapPin className="w-3 h-3" />
                    {job.location}
                  </Badge>
                )}
              </div>

              {/* Budget */}
              {job.budget && (
                <div className="flex items-center gap-2 text-lg font-medium mb-4" data-testid="job-detail-budget">
                  <DollarSign className="w-5 h-5 text-muted-foreground" />
                  <span>Budget: {job.budget}</span>
                </div>
              )}

              {/* Posted Date */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6" data-testid="job-detail-posted">
                <Calendar className="w-4 h-4" />
                <span>Posted on {format(new Date(job.created_at), 'MMMM d, yyyy')}</span>
              </div>

              {/* Divider */}
              <div className="border-t my-6"></div>

              {/* Description */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Description</h2>
                <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed" data-testid="job-detail-description">
                  {job.description}
                </p>
              </div>

              {/* Divider */}
              <div className="border-t my-6"></div>

              {/* Contact / Apply Button */}
              <div className="flex gap-4">
                <Button 
                  size="lg" 
                  className="flex-1"
                  disabled
                  data-testid="button-apply"
                >
                  Contact / Apply
                </Button>
                <p className="text-sm text-muted-foreground self-center">
                  Coming soon
                </p>
              </div>
            </Card>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
