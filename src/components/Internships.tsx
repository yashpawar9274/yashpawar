import { useEffect, useState } from "react";
import { Calendar, MapPin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Internship {
  id: string;
  title: string;
  company: string;
  location: string;
  duration: string;
  description: string[];
}

const Internships = () => {
  const [internships, setInternships] = useState<Internship[]>([]);

  useEffect(() => {
    fetchInternships();

    // Set up real-time listener
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'internships'
        },
        () => fetchInternships()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchInternships = async () => {
    const { data, error } = await supabase
      .from("internships")
      .select("*")
      .order("order_index");

    if (!error && data) {
      setInternships(data);
    }
  };

  if (internships.length === 0) return null;

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-12 text-foreground">Internships</h2>
        <div className="max-w-4xl mx-auto">
          <div className="space-y-8">
            {internships.map((internship, index) => (
              <div key={internship.id} className="relative pl-8 pb-8 border-l-2 border-primary/20 last:border-l-0">
                {index < internships.length - 1 && (
                  <div className="absolute left-[-9px] top-0 w-4 h-4 bg-primary rounded-full border-4 border-background"></div>
                )}
                <div className="bg-card p-6 rounded-lg shadow-sm border">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                    <h3 className="text-xl font-semibold text-foreground">
                      {internship.title}
                    </h3>
                    <div className="flex items-center text-sm text-muted-foreground mt-2 sm:mt-0">
                      <Calendar className="mr-1 h-4 w-4" />
                      {internship.duration}
                    </div>
                  </div>
                  
                  <div className="flex items-center text-muted-foreground mb-4">
                    <MapPin className="mr-1 h-4 w-4" />
                    <span className="font-medium mr-2">{internship.company}</span>
                    <span>• {internship.location}</span>
                  </div>

                  <ul className="space-y-2">
                    {internship.description.map((item, i) => (
                      <li key={i} className="flex items-start">
                        <span className="text-primary mr-2 text-sm">•</span>
                        <span className="text-muted-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Internships;