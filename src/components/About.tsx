
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface AboutInfo {
  summary: string;
  years_experience: string;
  projects_completed: string;
  technologies_count: string;
  client_satisfaction: string;
}

const About = () => {
  const [aboutInfo, setAboutInfo] = useState<AboutInfo>({
    summary: "I'm a passionate Full Stack Developer with over 3 years of experience creating innovative web applications and digital solutions. My expertise spans across modern frontend frameworks, robust backend systems, and cloud technologies.\n\nI believe in writing clean, maintainable code and creating user-centric applications that solve real-world problems. My approach combines technical excellence with creative problem-solving to deliver exceptional results.\n\nWhen I'm not coding, you'll find me exploring new technologies, contributing to open-source projects, or sharing knowledge with the developer community.",
    years_experience: "3+",
    projects_completed: "25+",
    technologies_count: "10+",
    client_satisfaction: "100%",
  });

  useEffect(() => {
    fetchAboutInfo();

    // Set up real-time subscription
    const channel = supabase
      .channel('about-info-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'about_info'
        },
        () => {
          fetchAboutInfo();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchAboutInfo = async () => {
    try {
      const { data, error } = await supabase
        .from("about_info")
        .select("*")
        .limit(1)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error("Error fetching about info:", error);
        return;
      }

      if (data) {
        setAboutInfo(data);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const stats = [
    { number: aboutInfo.years_experience, label: "Years Experience" },
    { number: aboutInfo.projects_completed, label: "Projects Completed" },
    { number: aboutInfo.technologies_count, label: "Technologies" },
    { number: aboutInfo.client_satisfaction, label: "Client Satisfaction" },
  ];

  return (
    <section id="about" className="section-alternate">
      <div className="section-container">
        <div className="text-center mb-16">
          <h2 className="heading-section animate-fade-up">About Me</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-green-600 mx-auto mb-8"></div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="animate-slide-in">
            <h3 className="text-2xl font-semibold mb-6">Professional Summary</h3>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              {aboutInfo.summary.split('\n').map((paragraph, index) => (
                paragraph.trim() && <p key={index}>{paragraph.trim()}</p>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 animate-fade-up">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="card-elevated p-6 text-center hover-lift"
              >
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-sm text-muted-foreground font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
