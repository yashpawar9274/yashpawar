
import { useState, useEffect } from "react";
import { Github, Linkedin, Twitter, Mail, Heart, Instagram, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface PersonalInfo {
  name: string;
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

const Footer = () => {
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    name: "Yash Pawar",
    email: "yash@example.com",
    phone: "+91 98765 43210",
    location: "Mumbai, India"
  });
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);

  useEffect(() => {
    fetchPersonalInfo();
    fetchSocialLinks();

    // Set up real-time subscription for personal info
    const personalChannel = supabase
      .channel('personal-info-footer')
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
      .channel('social-links-footer')
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
        .select("name, email, phone, location")
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error("Error fetching personal info:", error);
        return;
      }

      if (data) {
        setPersonalInfo({
          name: data.name || "Yash Pawar",
          email: data.email || "yash@example.com",
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
      twitter: Twitter,
      instagram: Instagram,
      mail: Mail,
      link: ExternalLink,
    };
    return iconMap[iconType] || ExternalLink;
  };

  const quickLinks = [
    { href: "#about", label: "About" },
    { href: "#experience", label: "Experience" },
    { href: "#projects", label: "Projects" },
    { href: "#education", label: "Education" },
    { href: "#certificates", label: "Certificates" },
    { href: "#contact", label: "Contact" },
  ];

  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-bold mb-4">{personalInfo.name}</h3>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Full Stack Developer passionate about creating exceptional digital experiences
              with modern technologies.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => {
                const IconComponent = getIcon(social.icon_type);
                return (
                  <a
                    key={social.id}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-background hover:bg-accent transition-colors group"
                    aria-label={social.platform}
                  >
                    <IconComponent className="h-5 w-5 text-muted-foreground group-hover:text-foreground" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <div className="space-y-2 text-muted-foreground">
              <p>{personalInfo.email}</p>
              <p>{personalInfo.phone}</p>
              <p>{personalInfo.location}</p>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center">
          <p className="text-muted-foreground flex items-center justify-center">
            Made with <Heart className="h-4 w-4 mx-1 text-red-500" /> by {personalInfo.name}
            <span className="mx-2">•</span>
            © {new Date().getFullYear()} All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
