import { useState } from "react";
import { useLocation } from "wouter";
import { supabase } from "@/lib/supabaseClient";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";

// Reuse constants from talent.tsx
const PRIMARY_ROLES = [
  "3D Modeler",
  "World Builder",
  "Environment Artist",
  "Character Artist",
  "Rigger",
  "Animator",
  "Scripter / Programmer",
  "Technical Artist",
  "UI / UX Designer",
  "Sound Designer",
  "Video Editor",
  "Community Manager",
  "Store Owner",
  "Educator",
  "Publisher / Producer",
  "Investor",
  "Other (Business / Education)"
];

const PLATFORMS = [
  "Roblox",
  "VRChat",
  "Second Life",
  "IMVU",
  "Meta Horizon Worlds",
  "GTA / FiveM",
  "The Sims (CC)",
  "Unity",
  "Unreal Engine"
];

const JOB_TYPES = [
  "Full-time",
  "Part-time",
  "Contract",
  "One-off project",
  "Internship"
];

interface JobFormData {
  title: string;
  companyName: string;
  primarySkill: string;
  platform: string;
  jobType: string;
  budget: string;
  isRemote: boolean;
  location: string;
  description: string;
}

export default function JobNew() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<JobFormData>({
    title: "",
    companyName: "",
    primarySkill: "",
    platform: "",
    jobType: "",
    budget: "",
    isRemote: true,
    location: "",
    description: ""
  });

  const [errors, setErrors] = useState<Partial<Record<keyof JobFormData, string>>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof JobFormData, string>> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Job title is required";
    }
    if (!formData.primarySkill) {
      newErrors.primarySkill = "Skill required is required";
    }
    if (!formData.platform) {
      newErrors.platform = "Platform is required";
    }
    if (!formData.jobType) {
      newErrors.jobType = "Job type is required";
    }
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Not Authenticated",
          description: "Please log in to post a job",
          variant: "destructive",
        });
        navigate('/');
        return;
      }

      // Insert job
      const { error } = await supabase
        .from('jobs')
        .insert({
          user_id: user.id,
          title: formData.title,
          company_name: formData.companyName || null,
          primary_skill: formData.primarySkill,
          platform: formData.platform,
          job_type: formData.jobType,
          budget: formData.budget || null,
          is_remote: formData.isRemote,
          location: formData.location || null,
          description: formData.description,
          visibility: 'PUBLIC'
        });

      if (error) {
        console.error('Error posting job:', error);
        toast({
          title: "Error",
          description: `Failed to post job: ${error.message}`,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success!",
        description: "Your job has been posted successfully",
      });

      // Navigate back to talent page with work tab active
      navigate('/talent?tab=work');
    } catch (error) {
      console.error('Error posting job:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-4 py-10">
          {/* Breadcrumb */}
          <div className="mb-6">
            <Link 
              href="/talent?tab=work"
              className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
              data-testid="link-back-talent"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Find Work
            </Link>
          </div>

          {/* Title */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2" data-testid="page-title">Post a Job</h1>
            <p className="text-lg text-muted-foreground">
              Connect with talented creators across virtual worlds.
            </p>
          </div>

          {/* Form */}
          <Card className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Job Title */}
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Job Title <span className="text-destructive">*</span>
                </label>
                <Input
                  placeholder="e.g. 3D Modeler for Fantasy Store"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  data-testid="input-job-title"
                  className={errors.title ? "border-destructive" : ""}
                />
                {errors.title && (
                  <p className="text-sm text-destructive mt-1">{errors.title}</p>
                )}
              </div>

              {/* Company Name */}
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Company / Studio Name
                </label>
                <Input
                  placeholder="e.g. VirtuoHub Studios"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  data-testid="input-company-name"
                />
              </div>

              {/* Skill Required */}
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Skill Required <span className="text-destructive">*</span>
                </label>
                <Select
                  value={formData.primarySkill}
                  onValueChange={(value) => setFormData({ ...formData, primarySkill: value })}
                >
                  <SelectTrigger data-testid="select-primary-skill" className={errors.primarySkill ? "border-destructive" : ""}>
                    <SelectValue placeholder="Select primary skill" />
                  </SelectTrigger>
                  <SelectContent>
                    {PRIMARY_ROLES.map((role) => (
                      <SelectItem key={role} value={role}>
                        {role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.primarySkill && (
                  <p className="text-sm text-destructive mt-1">{errors.primarySkill}</p>
                )}
              </div>

              {/* Platform */}
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Platform <span className="text-destructive">*</span>
                </label>
                <Select
                  value={formData.platform}
                  onValueChange={(value) => setFormData({ ...formData, platform: value })}
                >
                  <SelectTrigger data-testid="select-platform" className={errors.platform ? "border-destructive" : ""}>
                    <SelectValue placeholder="Select platform" />
                  </SelectTrigger>
                  <SelectContent>
                    {PLATFORMS.map((platform) => (
                      <SelectItem key={platform} value={platform}>
                        {platform}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.platform && (
                  <p className="text-sm text-destructive mt-1">{errors.platform}</p>
                )}
              </div>

              {/* Job Type */}
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Job Type <span className="text-destructive">*</span>
                </label>
                <Select
                  value={formData.jobType}
                  onValueChange={(value) => setFormData({ ...formData, jobType: value })}
                >
                  <SelectTrigger data-testid="select-job-type" className={errors.jobType ? "border-destructive" : ""}>
                    <SelectValue placeholder="Select job type" />
                  </SelectTrigger>
                  <SelectContent>
                    {JOB_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.jobType && (
                  <p className="text-sm text-destructive mt-1">{errors.jobType}</p>
                )}
              </div>

              {/* Budget */}
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Budget / Rate
                </label>
                <Input
                  placeholder="e.g. $1,000–$1,500 or $50/hr"
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                  data-testid="input-budget"
                />
              </div>

              {/* Remote Friendly */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is-remote"
                  checked={formData.isRemote}
                  onCheckedChange={(checked) => setFormData({ ...formData, isRemote: checked as boolean })}
                  data-testid="checkbox-is-remote"
                />
                <label
                  htmlFor="is-remote"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Remote friendly
                </label>
              </div>

              {/* Location */}
              {!formData.isRemote && (
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Location
                  </label>
                  <Input
                    placeholder="e.g. San Francisco, CA"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    data-testid="input-location"
                  />
                </div>
              )}

              {/* Description */}
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Description <span className="text-destructive">*</span>
                </label>
                <Textarea
                  placeholder="Describe the job, requirements, and what you're looking for in detail..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={8}
                  data-testid="textarea-description"
                  className={errors.description ? "border-destructive" : ""}
                />
                {errors.description && (
                  <p className="text-sm text-destructive mt-1">{errors.description}</p>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex gap-4">
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={isSubmitting}
                  data-testid="button-post-job"
                >
                  {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  {isSubmitting ? "Posting..." : "Post job"}
                </Button>
                <Link href="/talent?tab=work">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={isSubmitting}
                    data-testid="button-cancel"
                  >
                    Cancel
                  </Button>
                </Link>
              </div>
            </form>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
