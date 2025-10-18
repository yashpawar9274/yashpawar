
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Experience from "@/components/Experience";
import Projects from "@/components/Projects";
import Education from "@/components/Education";
import Certificates from "@/components/Certificates";
import Achievements from "@/components/Achievements";
import Reviews from "@/components/Reviews";
import Contact from "@/components/Contact";
import Internships from "@/components/Internships";
import Footer from "@/components/Footer";
import PWAInstaller from "@/components/PWAInstaller";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main>
        <Hero />
      <About />
      <Experience />
      <Internships />
      <Projects />
        <Education />
        <Certificates />
        <Achievements />
        <Reviews />
        <Contact />
      </main>
      <Footer />
      <PWAInstaller />
      
      {/* Admin Access Button */}
      <Link to="/auth" className="fixed bottom-4 left-4 z-50">
        <Button variant="outline" size="icon" className="shadow-lg">
          <Settings className="h-4 w-4" />
        </Button>
      </Link>
    </div>
  );
};

export default Index;
