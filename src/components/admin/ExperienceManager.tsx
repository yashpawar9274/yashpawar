
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Plus, Pencil, Trash2, MapPin, Calendar } from "lucide-react";
import { useForm } from "react-hook-form";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Experience {
  id?: string;
  title: string;
  company: string;
  location: string;
  duration: string;
  description: string[];
  order_index: number;
}

export const ExperienceManager = () => {
  const { toast } = useToast();
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [descriptionInput, setDescriptionInput] = useState("");

  const form = useForm<Experience>({
    defaultValues: {
      title: "",
      company: "",
      location: "",
      duration: "",
      description: [],
      order_index: 0,
    },
  });

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    try {
      const { data, error } = await supabase
        .from("experiences")
        .select("*")
        .order("order_index", { ascending: true });

      if (error) throw error;
      setExperiences(data || []);
    } catch (error) {
      console.error("Error fetching experiences:", error);
    }
  };

  const handleSubmit = async (values: Experience) => {
    setLoading(true);
    try {
      let result;
      
      if (editingExperience?.id) {
        result = await supabase
          .from("experiences")
          .update({ ...values, updated_at: new Date().toISOString() })
          .eq("id", editingExperience.id);
      } else {
        result = await supabase
          .from("experiences")
          .insert([values]);
      }

      if (result.error) throw result.error;

      toast({
        title: "Success",
        description: `Experience ${editingExperience ? 'updated' : 'created'} successfully!`,
      });

      setIsDialogOpen(false);
      setEditingExperience(null);
      form.reset();
      setDescriptionInput("");
      fetchExperiences();
    } catch (error) {
      console.error("Error saving experience:", error);
      toast({
        title: "Error",
        description: "Failed to save experience",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (experience: Experience) => {
    setEditingExperience(experience);
    form.reset(experience);
    setDescriptionInput(experience.description.join("\n"));
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("experiences")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Experience deleted successfully!",
      });

      fetchExperiences();
    } catch (error) {
      console.error("Error deleting experience:", error);
      toast({
        title: "Error",
        description: "Failed to delete experience",
        variant: "destructive",
      });
    }
  };

  const handleDescriptionChange = () => {
    if (descriptionInput.trim()) {
      const descriptions = descriptionInput
        .split("\n")
        .map(desc => desc.trim())
        .filter(Boolean);
      form.setValue("description", descriptions);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Manage Experience</h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditingExperience(null);
              form.reset();
              setDescriptionInput("");
            }}>
              <Plus className="h-4 w-4 mr-2" />
              Add Experience
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingExperience ? 'Edit' : 'Add New'} Experience</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Job Title</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Senior Full Stack Developer" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="company"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company</FormLabel>
                        <FormControl>
                          <Input placeholder="Company name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <Input placeholder="City, Country" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duration</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 2022 - Present" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div>
                  <FormLabel>Description (one point per line)</FormLabel>
                  <Textarea
                    placeholder="• Led development of 5+ enterprise web applications&#10;• Improved application performance by 40%&#10;• Mentored junior developers"
                    rows={5}
                    value={descriptionInput}
                    onChange={(e) => setDescriptionInput(e.target.value)}
                    onBlur={handleDescriptionChange}
                    className="mt-2"
                  />
                </div>

                <Button type="submit" disabled={loading}>
                  {loading ? "Saving..." : editingExperience ? "Update" : "Create"}
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {experiences.map((experience) => (
          <Card key={experience.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg">{experience.title}</CardTitle>
              <div className="flex space-x-2">
                <Button variant="ghost" size="sm" onClick={() => handleEdit(experience)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleDelete(experience.id!)}
                  className="text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-green-600 font-medium mb-2">{experience.company}</div>
              <div className="flex items-center text-sm text-muted-foreground mb-3 space-x-4">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  {experience.location}
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {experience.duration}
                </div>
              </div>
              <ul className="space-y-1">
                {experience.description.map((item, index) => (
                  <li key={index} className="text-muted-foreground text-sm flex items-start">
                    <span className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
