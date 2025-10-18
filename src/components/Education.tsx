
import { useState, useEffect } from "react";
import { GraduationCap, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Education {
  id: string;
  degree: string;
  institution: string;
  location: string;
  duration: string;
  grade?: string;
  description?: string;
}

const Education = () => {
  const [education, setEducation] = useState<Education[]>([]);

  useEffect(() => {
    fetchEducation();

    // Set up real-time subscription
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'education'
        },
        () => {
          fetchEducation();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchEducation = async () => {
    try {
      const { data, error } = await supabase
        .from("education")
        .select("*")
        .order("order_index", { ascending: true });

      if (error) throw error;
      setEducation(data || []);
    } catch (error) {
      console.error("Error fetching education:", error);
    }
  };

  return (
    <section id="education">
      <div className="section-container">
        <div className="text-center mb-16">
          <h2 className="heading-section animate-fade-up">Education</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-green-600 mx-auto mb-8"></div>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {education.map((edu, index) => (
            <div key={edu.id} className="card-project animate-fade-up hover-glow">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                  <GraduationCap className="h-6 w-6 text-white" />
                </div>
                
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                    <h3 className="text-xl font-semibold text-foreground">{edu.degree}</h3>
                    <div className="flex items-center text-sm text-muted-foreground mt-1 md:mt-0">
                      <Calendar className="h-4 w-4 mr-1" />
                      {edu.duration}
                    </div>
                  </div>
                  
                  <div className="text-green-600 font-medium mb-1">{edu.institution}</div>
                  <div className="text-sm text-muted-foreground mb-2">{edu.location}</div>
                  
                  {edu.grade && (
                    <div className="inline-block px-3 py-1 bg-muted text-muted-foreground rounded-full text-sm font-medium mb-3">
                      {edu.grade}
                    </div>
                  )}
                  
                  {edu.description && (
                    <p className="text-muted-foreground leading-relaxed">{edu.description}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Education;
