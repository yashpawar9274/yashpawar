import { useState, useEffect } from "react";
import { Star, Quote, User, Calendar, Building } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";

interface Review {
  id: string;
  client_name: string;
  client_position?: string;
  client_company?: string;
  rating: number;
  review_text: string;
  project_name?: string;
  work_duration?: string;
  client_image_url?: string;
  is_featured: boolean;
  created_at: string;
}

const Reviews = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();

    // Real-time subscription for reviews
    const channel = supabase
      .channel('reviews-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'reviews'
        },
        () => {
          fetchReviews();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('is_approved', true)
        .order('is_featured', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReviews(data || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-muted-foreground'
        }`}
      />
    ));
  };

  if (loading) {
    return (
      <section id="reviews" className="py-20 bg-muted/20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">Loading reviews...</div>
        </div>
      </section>
    );
  }

  const featuredReviews = reviews.filter(review => review.is_featured).slice(0, 3);
  const regularReviews = reviews.filter(review => !review.is_featured);

  return (
    <section id="reviews" className="py-20 bg-muted/20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Client Reviews & Testimonials
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            What my clients say about working with me and the projects we've built together
          </p>
        </div>

        {reviews.length === 0 ? (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <Quote className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No Reviews Yet</h3>
              <p className="text-muted-foreground mb-6">
                Be the first to work with me and share your experience! I'm always excited to take on new projects and deliver exceptional results.
              </p>
              <a
                href="#contact"
                className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                Start a Project
              </a>
            </div>
          </div>
        ) : (
          <>
            {/* Featured Reviews Grid */}
            {featuredReviews.length > 0 && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {featuredReviews.map((review) => (
                  <Card key={review.id} className="h-full border-2 border-primary/20 shadow-lg hover:shadow-xl transition-shadow">
                    <CardContent className="p-6 h-full flex flex-col">
                      <div className="flex items-center mb-4">
                        <Avatar className="w-12 h-12 mr-4">
                          <AvatarImage src={review.client_image_url} alt={review.client_name} />
                          <AvatarFallback>
                            <User className="w-6 h-6" />
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold text-foreground">{review.client_name}</h3>
                          {review.client_position && (
                            <p className="text-sm text-muted-foreground">{review.client_position}</p>
                          )}
                          {review.client_company && (
                            <p className="text-sm text-muted-foreground flex items-center">
                              <Building className="w-3 h-3 mr-1" />
                              {review.client_company}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center mb-4">
                        {renderStars(review.rating)}
                      </div>

                      <div className="flex-1 mb-4">
                        <Quote className="w-6 h-6 text-primary mb-2" />
                        <p className="text-muted-foreground leading-relaxed">
                          {review.review_text}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {review.project_name && (
                          <Badge variant="secondary" className="text-xs">
                            {review.project_name}
                          </Badge>
                        )}
                        {review.work_duration && (
                          <Badge variant="outline" className="text-xs flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            {review.work_duration}
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Regular Reviews */}
            {regularReviews.length > 0 && (
              <div className="grid md:grid-cols-2 gap-6">
                {regularReviews.slice(0, 4).map((review) => (
                  <Card key={review.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start mb-4">
                        <Avatar className="w-10 h-10 mr-3">
                          <AvatarImage src={review.client_image_url} alt={review.client_name} />
                          <AvatarFallback>
                            <User className="w-5 h-5" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h4 className="font-semibold text-foreground">{review.client_name}</h4>
                          {review.client_position && (
                            <p className="text-sm text-muted-foreground">{review.client_position}</p>
                          )}
                          <div className="flex items-center mt-1">
                            {renderStars(review.rating)}
                          </div>
                        </div>
                      </div>

                      <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                        {review.review_text}
                      </p>

                      {(review.project_name || review.work_duration) && (
                        <div className="flex flex-wrap gap-2">
                          {review.project_name && (
                            <Badge variant="secondary" className="text-xs">
                              {review.project_name}
                            </Badge>
                          )}
                          {review.work_duration && (
                            <Badge variant="outline" className="text-xs">
                              {review.work_duration}
                            </Badge>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {reviews.length > 7 && (
              <div className="text-center mt-8">
                <Link
                  to="/reviews"
                  className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  View All Reviews ({reviews.length})
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default Reviews;