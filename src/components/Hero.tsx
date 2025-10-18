
import { useState, useEffect } from "react";
import { ArrowDown, Github, Linkedin, Mail, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

interface PersonalInfo {
  name: string;
  title: string;
  subtitle: string;
  email: string;
  github_url: string;
  linkedin_url: string;
  instagram_url: string;
  profile_picture_url: string;
}

const Hero = () => {
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    name: "Yash Pawar",
    title: "Full Stack Developer & Software Engineer",
    subtitle: "Passionate about creating exceptional digital experiences with modern technologies. Specialized in React, Node.js, and cloud solutions.",
    email: "yash@example.com",
    github_url: "https://github.com/yashpawar",
    linkedin_url: "https://linkedin.com/in/yashpawar",
    instagram_url: "https://instagram.com/yashpawar",
    profile_picture_url: "",
  });

  useEffect(() => {
    fetchPersonalInfo();

    // Set up real-time subscription
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'personal_info'
        },
        () => {
          fetchPersonalInfo();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchPersonalInfo = async () => {
    try {
      const { data, error } = await supabase
        .from("personal_info")
        .select("*")
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error("Error fetching personal info:", error);
        return;
      }

      if (data) {
        setPersonalInfo(data);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const socialLinks = [
    { icon: Github, href: personalInfo.github_url, label: "GitHub" },
    { icon: Linkedin, href: personalInfo.linkedin_url, label: "LinkedIn" },
    { icon: Instagram, href: personalInfo.instagram_url, label: "Instagram" },
    { icon: Mail, href: `mailto:${personalInfo.email}`, label: "Email" },
  ];

  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative">
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted/30"></div>
      
      <div className="section-container relative z-10 text-center">
        <div className="animate-fade-up">
          {personalInfo.profile_picture_url && (
            <div className="mb-8">
              <img 
                src={personalInfo.profile_picture_url} 
                alt={personalInfo.name}
                className="w-32 h-32 rounded-full mx-auto border-4 border-primary/20 shadow-lg object-cover"
              />
            </div>
          )}
          
          <h1 className="heading-hero mb-6">
            Hi, I'm{" "}
            <span className="bg-gradient-to-r from-primary to-green-600 bg-clip-text text-transparent">
              {personalInfo.name}
            </span>
          </h1>
          
          <div className="text-hero-subtitle mb-8 max-w-3xl mx-auto">
            <p className="mb-4">{personalInfo.title}</p>
            <p className="text-lg text-muted-foreground">
              {personalInfo.subtitle}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button className="btn-hero">
              <a href="#projects">View My Work</a>
            </Button>
            <Button variant="outline" className="btn-secondary">
              <a href="#contact">Get In Touch</a>
            </Button>
          </div>

          <div className="flex justify-center space-x-6 mb-16">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-full bg-muted hover:bg-accent transition-all duration-300 hover:scale-110 group"
                aria-label={social.label}
              >
                <social.icon className="h-5 w-5 text-muted-foreground group-hover:text-foreground" />
              </a>
            ))}
          </div>

          <div className="animate-bounce">
            <a href="#about" className="inline-block">
              <ArrowDown className="h-6 w-6 text-muted-foreground hover:text-foreground transition-colors" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
