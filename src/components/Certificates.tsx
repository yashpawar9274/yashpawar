
import { useState, useEffect } from "react";
import { Award, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

interface Certificate {
  id: string;
  title: string;
  issuer: string;
  date: string;
  credential_id?: string;
  verify_url?: string;
  description?: string;
}

const Certificates = () => {
  const [certificates, setCertificates] = useState<Certificate[]>([]);

  useEffect(() => {
    fetchCertificates();

    // Set up real-time subscription
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'certificates'
        },
        () => {
          fetchCertificates();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchCertificates = async () => {
    try {
      const { data, error } = await supabase
        .from("certificates")
        .select("*")
        .order("order_index", { ascending: true });

      if (error) throw error;
      setCertificates(data || []);
    } catch (error) {
      console.error("Error fetching certificates:", error);
    }
  };

  return (
    <section id="certificates" className="section-alternate">
      <div className="section-container">
        <div className="text-center mb-16">
          <h2 className="heading-section animate-fade-up">Certifications</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-green-600 mx-auto mb-8"></div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Professional certifications that validate my expertise in various technologies
            and development practices.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {certificates.map((cert, index) => (
            <div key={cert.id} className="card-project animate-fade-up hover-lift">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                  <Award className="h-6 w-6 text-white" />
                </div>
                
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-foreground mb-2">{cert.title}</h3>
                  <div className="text-green-600 font-medium mb-1">{cert.issuer}</div>
                  <div className="text-sm text-muted-foreground mb-3">Issued: {cert.date}</div>
                  
                  {cert.description && (
                    <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                      {cert.description}
                    </p>
                  )}
                  
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    {cert.credential_id && (
                      <div className="text-xs text-muted-foreground font-mono">
                        ID: {cert.credential_id}
                      </div>
                    )}
                    {cert.verify_url && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={cert.verify_url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-3 w-3 mr-2" />
                          Verify
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Certificates;
