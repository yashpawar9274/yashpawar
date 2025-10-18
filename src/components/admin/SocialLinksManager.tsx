import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Trash2, Plus, GripVertical } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface SocialLink {
  id?: string;
  platform: string;
  url: string;
  icon_type: string;
  is_active: boolean;
  order_index: number;
}

export const SocialLinksManager = () => {
  const { toast } = useToast();
  const [links, setLinks] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(false);

  const form = useForm<SocialLink>({
    defaultValues: {
      platform: "",
      url: "",
      icon_type: "link",
      is_active: true,
      order_index: 0,
    },
  });

  useEffect(() => {
    fetchLinks();

    // Set up real-time subscription
    const channel = supabase
      .channel('social-links-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'social_links'
        },
        () => {
          fetchLinks();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchLinks = async () => {
    try {
      const { data, error } = await supabase
        .from("social_links")
        .select("*")
        .order("order_index", { ascending: true });

      if (error) throw error;
      setLinks(data || []);
    } catch (error) {
      console.error("Error fetching social links:", error);
    }
  };

  const onSubmit = async (values: SocialLink) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from("social_links")
        .insert([{ ...values, order_index: links.length }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Social link added successfully!",
      });

      form.reset();
      fetchLinks();
    } catch (error) {
      console.error("Error adding social link:", error);
      toast({
        title: "Error",
        description: "Failed to add social link",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteLink = async (id: string) => {
    try {
      const { error } = await supabase
        .from("social_links")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Social link deleted successfully!",
      });

      fetchLinks();
    } catch (error) {
      console.error("Error deleting social link:", error);
      toast({
        title: "Error",
        description: "Failed to delete social link",
        variant: "destructive",
      });
    }
  };

  const toggleActive = async (id: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from("social_links")
        .update({ is_active: isActive })
        .eq("id", id);

      if (error) throw error;
      fetchLinks();
    } catch (error) {
      console.error("Error updating social link:", error);
    }
  };

  const iconOptions = [
    { value: "github", label: "GitHub" },
    { value: "linkedin", label: "LinkedIn" },
    { value: "twitter", label: "Twitter" },
    { value: "instagram", label: "Instagram" },
    { value: "mail", label: "Email" },
    { value: "phone", label: "Phone" },
    { value: "map-pin", label: "Location" },
    { value: "link", label: "Website" },
  ];

  return (
    <div className="space-y-6">
      {/* Add New Link Form */}
      <div className="border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Add New Social Link</h3>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="platform"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Platform Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., GitHub, LinkedIn" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="icon_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Icon Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select an icon" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {iconOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://github.com/username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={loading} className="btn-hero">
              <Plus className="h-4 w-4 mr-2" />
              {loading ? "Adding..." : "Add Social Link"}
            </Button>
          </form>
        </Form>
      </div>

      {/* Existing Links */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Existing Social Links</h3>
        {links.length === 0 ? (
          <p className="text-muted-foreground">No social links found. Add your first link above.</p>
        ) : (
          <div className="space-y-3">
            {links.map((link) => (
              <div key={link.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <GripVertical className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="font-medium">{link.platform}</div>
                    <div className="text-sm text-muted-foreground">{link.url}</div>
                    <div className="text-xs text-muted-foreground">Icon: {link.icon_type}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={link.is_active}
                    onCheckedChange={(checked) => toggleActive(link.id!, checked)}
                  />
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteLink(link.id!)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
