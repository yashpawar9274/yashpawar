
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AboutInfo {
  id?: string;
  summary: string;
  years_experience: string;
  projects_completed: string;
  technologies_count: string;
  client_satisfaction: string;
}

export const AboutManager = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [aboutInfo, setAboutInfo] = useState<AboutInfo | null>(null);

  const form = useForm<AboutInfo>({
    defaultValues: {
      summary: "",
      years_experience: "",
      projects_completed: "",
      technologies_count: "",
      client_satisfaction: "",
    },
  });

  useEffect(() => {
    fetchAboutInfo();
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
        form.reset(data);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const onSubmit = async (values: AboutInfo) => {
    setLoading(true);
    try {
      let result;
      
      if (aboutInfo?.id) {
        result = await supabase
          .from("about_info")
          .update({ ...values, updated_at: new Date().toISOString() })
          .eq("id", aboutInfo.id);
      } else {
        result = await supabase
          .from("about_info")
          .insert([values]);
      }

      if (result.error) {
        throw result.error;
      }

      toast({
        title: "Success",
        description: "About section updated successfully!",
      });

      fetchAboutInfo();
    } catch (error) {
      console.error("Error saving about info:", error);
      toast({
        title: "Error",
        description: "Failed to save about information",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="summary"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Professional Summary</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Write your professional summary here..." 
                  className="resize-none min-h-[200px]"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <FormField
            control={form.control}
            name="years_experience"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Years Experience</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="e.g., 3+"
                    className="resize-none"
                    rows={2}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="projects_completed"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Projects Completed</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="e.g., 25+"
                    className="resize-none"
                    rows={2}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="technologies_count"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Technologies</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="e.g., 10+"
                    className="resize-none"
                    rows={2}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="client_satisfaction"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Client Satisfaction</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="e.g., 100%"
                    className="resize-none"
                    rows={2}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" disabled={loading} className="btn-hero">
          {loading ? "Saving..." : "Save About Section"}
        </Button>
      </form>
    </Form>
  );
};
