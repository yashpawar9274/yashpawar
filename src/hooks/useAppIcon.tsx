import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useAppIcon = () => {
  const [appIcon, setAppIcon] = useState<string>("/manifest-icon-192.png");

  useEffect(() => {
    const fetchPersonalInfo = async () => {
      try {
        const { data, error } = await supabase
          .from("personal_info")
          .select("profile_picture_url, name")
          .limit(1)
          .maybeSingle();

        if (!error && data?.profile_picture_url) {
          setAppIcon(data.profile_picture_url);
          updatePWAIcons(data.profile_picture_url, data.name);
        }
      } catch (error) {
        console.error("Error fetching personal info:", error);
      }
    };

    fetchPersonalInfo();

    // Set up real-time listener for personal info changes
    const channel = supabase
      .channel('personal-info-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'personal_info'
        },
        () => fetchPersonalInfo()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const updatePWAIcons = (profileUrl: string, name?: string) => {
    // Update manifest icons dynamically
    const manifestLink = document.querySelector('link[rel="manifest"]') as HTMLLinkElement;
    if (manifestLink) {
      const newManifest = {
        name: name ? `${name} - Portfolio` : "Portfolio",
        short_name: name || "Portfolio",
        description: "Professional Portfolio Website",
        start_url: "/",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#000000",
        orientation: "portrait-primary",
        icons: [
          {
            src: profileUrl,
            sizes: "192x192",
            type: "image/png",
            purpose: "any maskable"
          },
          {
            src: profileUrl,
            sizes: "512x512", 
            type: "image/png",
            purpose: "any maskable"
          }
        ]
      };
      
      const blob = new Blob([JSON.stringify(newManifest)], { type: 'application/json' });
      const manifestURL = URL.createObjectURL(blob);
      manifestLink.href = manifestURL;
    }

    // Update favicon
    const favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
    if (favicon) {
      favicon.href = profileUrl;
    }

    // Update apple touch icon
    let appleIcon = document.querySelector('link[rel="apple-touch-icon"]') as HTMLLinkElement;
    if (!appleIcon) {
      appleIcon = document.createElement('link');
      appleIcon.rel = 'apple-touch-icon';
      document.head.appendChild(appleIcon);
    }
    appleIcon.href = profileUrl;
  };

  return { appIcon };
};