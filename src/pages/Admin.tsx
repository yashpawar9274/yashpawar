import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import InternshipsManager from "@/components/admin/InternshipsManager";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PersonalInfoForm } from "@/components/admin/PersonalInfoForm";
import { AboutManager } from "@/components/admin/AboutManager";
import { ProjectsManager } from "@/components/admin/ProjectsManager";
import { ExperienceManager } from "@/components/admin/ExperienceManager";
import { EducationManager } from "@/components/admin/EducationManager";
import { CertificatesManager } from "@/components/admin/CertificatesManager";
import { AchievementsManager } from "@/components/admin/AchievementsManager";
import { SocialLinksManager } from "@/components/admin/SocialLinksManager";
import { MessagesManager } from "@/components/admin/MessagesManager";
import ReviewsManager from "@/components/admin/ReviewsManager";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { LogOut, Home } from "lucide-react";
import { Link } from "react-router-dom";

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Signed out successfully",
      });
      
      navigate("/");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to sign out",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Portfolio Admin Dashboard</h1>
            <p className="text-muted-foreground mt-2">
              Complete control over your portfolio website. Edit all content in real-time and see changes immediately.
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Link to="/">
              <Button variant="outline">
                <Home className="h-4 w-4 mr-2" />
                View Site
              </Button>
            </Link>
            <Button variant="destructive" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>

        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="grid w-full grid-cols-11">
            <TabsTrigger value="personal">Personal Info</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="experience">Experience</TabsTrigger>
            <TabsTrigger value="internships">Internships</TabsTrigger>
            <TabsTrigger value="education">Education</TabsTrigger>
            <TabsTrigger value="certificates">Certificates</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="social">Social Links</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
          </TabsList>

          <TabsContent value="personal" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>
                  Update your basic information, contact details, and social media links that appear in the hero section
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PersonalInfoForm />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="about" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>About Section</CardTitle>
                <CardDescription>
                  Update your professional summary, statistics, and about page content
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AboutManager />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="projects" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Projects Portfolio</CardTitle>
                <CardDescription>
                  Add, edit, or remove your portfolio projects. Manage project details, technologies, and links
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ProjectsManager />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="experience" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Work Experience</CardTitle>
                <CardDescription>
                  Manage your professional work experience, job positions, and career timeline
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ExperienceManager />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="internships" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Internships</CardTitle>
                <CardDescription>
                  Manage your internship experiences and training positions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <InternshipsManager />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="education" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Education Background</CardTitle>
                <CardDescription>
                  Update your educational qualifications, degrees, and academic achievements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <EducationManager />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="certificates" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Professional Certificates</CardTitle>
                <CardDescription>
                  Manage your professional certifications, licenses, and skill validations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CertificatesManager />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="achievements" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Achievements & Awards</CardTitle>
                <CardDescription>
                  Showcase your professional achievements, awards, and notable recognitions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AchievementsManager />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Client Reviews & Testimonials</CardTitle>
                <CardDescription>
                  Manage client reviews, testimonials, and feedback about your work and projects
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ReviewsManager />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="social" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Social Links & Contact</CardTitle>
                <CardDescription>
                  Manage your social media links and contact information for the "Let's Connect" section
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SocialLinksManager />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="messages" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Contact Messages</CardTitle>
                <CardDescription>
                  View and manage messages received through the contact form. New messages appear in real-time.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MessagesManager />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
