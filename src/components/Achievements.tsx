
import { useState, useEffect } from "react";
import { Award, Trophy, Target, Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon_type: string;
  date: string;
  category: string;
  order_index: number;
}

const Achievements = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  useEffect(() => {
    fetchAchievements();

    // Set up real-time subscription
    const channel = supabase
      .channel('achievements-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'achievements'
        },
        () => {
          fetchAchievements();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchAchievements = async () => {
    try {
      const { data, error } = await supabase
        .from("achievements")
        .select("*")
        .order("order_index", { ascending: true });

      if (error && error.code !== 'PGRST116') {
        console.error("Error fetching achievements:", error);
        return;
      }

      if (data) {
        setAchievements(data);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const getIcon = (iconType: string) => {
    switch (iconType) {
      case 'award':
        return Award;
      case 'trophy':
        return Trophy;
      case 'target':
        return Target;
      case 'star':
        return Star;
      default:
        return Award;
    }
  };

  if (achievements.length === 0) {
    return null;
  }

  return (
    <section id="achievements" className="section-base">
      <div className="section-container">
        <div className="text-center mb-16">
          <h2 className="heading-section animate-fade-up">Achievements</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-green-600 mx-auto mb-8"></div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievements.map((achievement, index) => {
            const IconComponent = getIcon(achievement.icon_type);
            return (
              <div
                key={achievement.id}
                className="card-elevated p-6 hover-lift animate-fade-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-r from-primary to-green-600 rounded-lg flex items-center justify-center">
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold">{achievement.title}</h3>
                      <span className="text-sm text-muted-foreground">{achievement.date}</span>
                    </div>
                    <p className="text-muted-foreground mb-2">{achievement.description}</p>
                    <span className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
                      {achievement.category}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Achievements;
