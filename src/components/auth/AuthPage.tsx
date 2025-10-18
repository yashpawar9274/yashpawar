import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, Lock } from "lucide-react";
interface AuthFormData {
  email: string;
  password: string;
  confirmPassword?: string;
}
const AuthPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const {
    toast
  } = useToast();
  const navigate = useNavigate();
  const form = useForm<AuthFormData>({
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: ""
    }
  });
  const onSubmit = async (values: AuthFormData) => {
    setIsLoading(true);
    try {
      if (isSignUp) {
        if (values.password !== values.confirmPassword) {
          toast({
            title: "Error",
            description: "Passwords do not match",
            variant: "destructive"
          });
          return;
        }
        const {
          error
        } = await supabase.auth.signUp({
          email: values.email,
          password: values.password,
          options: {
            emailRedirectTo: `${window.location.origin}/admin`
          }
        });
        if (error) throw error;
        toast({
          title: "Success",
          description: "Please check your email to confirm your account"
        });
      } else {
        const {
          error
        } = await supabase.auth.signInWithPassword({
          email: values.email,
          password: values.password
        });
        if (error) throw error;
        toast({
          title: "Success",
          description: "Welcome back!"
        });
        navigate("/admin");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An error occurred",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  return <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Lock className="h-12 w-12 mx-auto mb-4 text-primary" />
          <h1 className="text-2xl font-bold">Admin Access</h1>
          <p className="text-muted-foreground">
            {isSignUp ? "Create an admin account" : "Sign in to manage your portfolio"}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{isSignUp ? "Sign Up" : "Sign In"}</CardTitle>
            <CardDescription>
              {isSignUp ? "Create your admin account to manage the portfolio" : "Enter your credentials to access the admin dashboard"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField control={form.control} name="email" render={({
                field
              }) => <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="admin@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>} />

                <FormField control={form.control} name="password" render={({
                field
              }) => <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input type={showPassword ? "text" : "password"} placeholder="Enter your password" {...field} />
                          <Button type="button" variant="ghost" size="sm" className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent" onClick={() => setShowPassword(!showPassword)}>
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>} />

                {isSignUp && <FormField control={form.control} name="confirmPassword" render={({
                field
              }) => <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="Confirm your password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>} />}

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Processing..." : isSignUp ? "Create Account" : "Sign In"}
                </Button>
              </form>
            </Form>

            <div className="mt-4 text-center">
              
            </div>
          </CardContent>
        </Card>
      </div>
    </div>;
};
export default AuthPage;