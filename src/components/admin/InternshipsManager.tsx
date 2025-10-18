import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useForm } from "react-hook-form";
import { Plus, Pencil, Trash2, Building2 } from "lucide-react";

interface Internship {
  id?: string;
  title: string;
  company: string;
  location: string;
  duration: string;
  description: string[];
  order_index: number;
}

const InternshipsManager = () => {
  const [internships, setInternships] = useState<Internship[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingInternship, setEditingInternship] = useState<Internship | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const { register, handleSubmit, reset, setValue } = useForm<Internship>();

  useEffect(() => {
    fetchInternships();
  }, []);

  const fetchInternships = async () => {
    try {
      const { data, error } = await supabase
        .from("internships")
        .select("*")
        .order("order_index");

      if (error) throw error;
      setInternships(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch internships",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (formData: Internship) => {
    try {
      const internshipData = {
        ...formData,
        description: formData.description,
        order_index: editingInternship ? editingInternship.order_index : internships.length,
      };

      if (editingInternship) {
        const { error } = await supabase
          .from("internships")
          .update(internshipData)
          .eq("id", editingInternship.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Internship updated successfully",
        });
      } else {
        const { error } = await supabase
          .from("internships")
          .insert([internshipData]);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Internship added successfully",
        });
      }

      setIsDialogOpen(false);
      setEditingInternship(null);
      reset();
      fetchInternships();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save internship",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (internship: Internship) => {
    setEditingInternship(internship);
    setValue("title", internship.title);
    setValue("company", internship.company);
    setValue("location", internship.location);
    setValue("duration", internship.duration);
    setValue("description", internship.description);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("internships")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Internship deleted successfully",
      });

      fetchInternships();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete internship",
        variant: "destructive",
      });
    }
  };

  const handleDescriptionChange = (value: string) => {
    const lines = value.split('\n').filter(line => line.trim() !== '');
    setValue("description", lines);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Manage Internships</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditingInternship(null);
              reset();
            }}>
              <Plus className="mr-2 h-4 w-4" />
              Add Internship
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {editingInternship ? "Edit Internship" : "Add New Internship"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="title">Position</Label>
                <Input
                  id="title"
                  {...register("title", { required: true })}
                  placeholder="e.g. Software Development Intern"
                />
              </div>
              <div>
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  {...register("company", { required: true })}
                  placeholder="e.g. Tech Corp"
                />
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  {...register("location", { required: true })}
                  placeholder="e.g. Mumbai, India"
                />
              </div>
              <div>
                <Label htmlFor="duration">Duration</Label>
                <Input
                  id="duration"
                  {...register("duration", { required: true })}
                  placeholder="e.g. Jun 2023 - Aug 2023"
                />
              </div>
              <div>
                <Label htmlFor="description">Description (one point per line)</Label>
                <Textarea
                  id="description"
                  rows={4}
                  placeholder="Enter each responsibility or achievement on a new line"
                  onChange={(e) => handleDescriptionChange(e.target.value)}
                  defaultValue={editingInternship ? editingInternship.description.join('\n') : ''}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingInternship ? "Update" : "Add"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {internships.map((internship) => (
          <Card key={internship.id} className="p-4">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Building2 className="h-5 w-5 text-primary" />
                  <span>{internship.title}</span>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(internship)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => internship.id && handleDelete(internship.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  <strong>{internship.company}</strong> • {internship.location} • {internship.duration}
                </p>
                <ul className="list-disc list-inside space-y-1">
                  {internship.description.map((item, index) => (
                    <li key={index} className="text-sm">{item}</li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default InternshipsManager;