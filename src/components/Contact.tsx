
import { useState, useEffect } from "react";
import { Mail, Phone, MapPin, Send, Github, Linkedin, Instagram, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface PersonalInfo {
  email: string;
  phone: string;
  location: string;
}

interface SocialLink {
  id: string;
  platform: string;
  url: string;
  icon_type: string;
  is_active: boolean;
}

const Contact = () => {
  const { toast } = useToast();
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    email: "yash.pawar@example.com",
    phone: "+91 98765 43210",
    location: "Mumbai, India"
  });
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchPersonalInfo();
    fetchSocialLinks();

    // Set up real-time subscription for personal info
    const personalChannel = supabase
      .channel('personal-info-changes')
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

    // Set up real-time subscription for social links
    const socialChannel = supabase
      .channel('social-links-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'social_links'
        },
        () => {
          fetchSocialLinks();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(personalChannel);
      supabase.removeChannel(socialChannel);
    };
  }, []);

  const fetchPersonalInfo = async () => {
    try {
      const { data, error } = await supabase
        .from("personal_info")
        .select("email, phone, location")
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error("Error fetching personal info:", error);
        return;
      }

      if (data) {
        setPersonalInfo({
          email: data.email || "yash.pawar@example.com",
          phone: data.phone || "+91 98765 43210",
          location: data.location || "Mumbai, India"
        });
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const fetchSocialLinks = async () => {
    try {
      const { data, error } = await supabase
        .from("social_links")
        .select("*")
        .eq("is_active", true)
        .order("order_index", { ascending: true });

      if (error) throw error;
      setSocialLinks(data || []);
    } catch (error) {
      console.error("Error fetching social links:", error);
    }
  };

  const getIcon = (iconType: string) => {
    const iconMap: { [key: string]: any } = {
      github: Github,
      linkedin: Linkedin,
      instagram: Instagram,
      mail: Mail,
      phone: Phone,
      "map-pin": MapPin,
      link: ExternalLink,
    };
    return iconMap[iconType] || ExternalLink;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from("contact_messages")
        .insert({
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message
        });

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Your message has been sent successfully. I'll get back to you soon!",
      });

      // Reset form
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: ""
      });

    } catch (error: any) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      label: "Email",
      value: personalInfo.email,
      href: `mailto:${personalInfo.email}`
    },
    {
      icon: Phone,
      label: "Phone",
      value: personalInfo.phone,
      href: `tel:${personalInfo.phone.replace(/\s/g, '')}`
    },
    {
      icon: MapPin,
      label: "Location",
      value: personalInfo.location,
      href: "#"
    }
  ];

  return (
    <section id="contact">
      <div className="section-container">
        <div className="text-center mb-16">
          <h2 className="heading-section animate-fade-up">Get In Touch</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-green-600 mx-auto mb-8"></div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            I'm always open to discussing new opportunities, creative projects, or just having a chat.
            Feel free to reach out!
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Information */}
          <div className="animate-slide-in">
            <h3 className="text-2xl font-semibold mb-8">Let's Connect</h3>
            
            <div className="space-y-6 mb-8">
              {contactInfo.map((info, index) => (
                <div key={index} className="flex items-center space-x-4 group">
                  <div className="flex-shrink-0 w-12 h-12 bg-green-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <info.icon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">{info.label}</div>
                    <a
                      href={info.href}
                      className="text-foreground hover:text-green-600 transition-colors font-medium"
                    >
                      {info.value}
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {/* Social Links */}
            {socialLinks.length > 0 && (
              <div className="mb-8">
                <h4 className="font-semibold mb-4">Follow Me</h4>
                <div className="flex flex-wrap gap-4">
                  {socialLinks.map((social) => {
                    const IconComponent = getIcon(social.icon_type);
                    return (
                      <a
                        key={social.id}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 p-3 rounded-lg bg-muted hover:bg-accent transition-colors group"
                      >
                        <IconComponent className="h-5 w-5 text-muted-foreground group-hover:text-foreground" />
                        <span className="text-sm font-medium">{social.platform}</span>
                      </a>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="p-6 bg-muted/30 rounded-xl">
              <h4 className="font-semibold mb-3">Quick Response</h4>
              <p className="text-muted-foreground text-sm leading-relaxed">
                I typically respond to emails within 24 hours. For urgent matters,
                feel free to give me a call or connect with me on LinkedIn.
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="animate-fade-up">
            <div className="card-elevated p-8">
              <h3 className="text-2xl font-semibold mb-6">Send a Message</h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-2">
                      Name
                    </label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Your Name"
                      className="w-full"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2">
                      Email
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="your.email@example.com"
                      className="w-full"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium mb-2">
                    Subject
                  </label>
                  <Input
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    placeholder="What's this about?"
                    className="w-full"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2">
                    Message
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Tell me about your project or inquiry..."
                    rows={5}
                    className="w-full resize-none"
                    required
                  />
                </div>

                <Button 
                  type="submit" 
                  className="btn-accent w-full sm:w-auto"
                  disabled={isSubmitting}
                >
                  <Send className="h-4 w-4 mr-2" />
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
