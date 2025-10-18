import { useState, useEffect } from "react";
import { Star, Quote, User, Calendar, Building, ArrowLeft, Filter } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

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
  const [filteredReviews, setFilteredReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [ratingFilter, setRatingFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");

  useEffect(() => {
    fetchReviews();

    // Real-time subscription for reviews
    const channel = supabase
      .channel('reviews-page-changes')
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

  useEffect(() => {
    filterAndSortReviews();
  }, [reviews, ratingFilter, sortBy]);

  const fetchReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('is_approved', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReviews(data || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortReviews = () => {
    let filtered = reviews;

    // Filter by rating
    if (ratingFilter !== "all") {
      const minRating = parseInt(ratingFilter);
      filtered = filtered.filter(review => review.rating >= minRating);
    }

    // Sort reviews
    switch (sortBy) {
      case "newest":
        filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case "oldest":
        filtered.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        break;
      case "rating-high":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "rating-low":
        filtered.sort((a, b) => a.rating - b.rating);
        break;
      case "featured":
        filtered.sort((a, b) => {
          if (a.is_featured && !b.is_featured) return -1;
          if (!a.is_featured && b.is_featured) return 1;
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        });
        break;
    }

    setFilteredReviews(filtered);
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

  const getAverageRating = () => {
    if (reviews.length === 0) return "0.0";
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  const getRatingDistribution = () => {
    const distribution: Record<1 | 2 | 3 | 4 | 5, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(review => {
      distribution[review.rating as 1 | 2 | 3 | 4 | 5]++;
    });
    return distribution;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        <main className="py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">Loading reviews...</div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const distribution = getRatingDistribution();
  const averageRating = getAverageRating();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <Link to="/" className="inline-flex items-center text-primary hover:text-primary/80 mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Portfolio
          </Link>

          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Client Reviews & Testimonials
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
              Real feedback from clients about their experience working with me on various projects
            </p>

            {/* Rating Summary */}
            {reviews.length > 0 && (
              <Card className="max-w-md mx-auto">
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-foreground mb-2">{averageRating}</div>
                    <div className="flex justify-center items-center mb-2">
                      {renderStars(Math.round(parseFloat(averageRating)))}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Based on {reviews.length} review{reviews.length !== 1 ? 's' : ''}
                    </p>
                    
                    {/* Rating Distribution */}
                    <div className="mt-4 space-y-2 text-xs">
                      {[5, 4, 3, 2, 1].map((rating) => (
                        <div key={rating} className="flex items-center justify-between">
                          <span>{rating} star{rating !== 1 ? 's' : ''}</span>
                          <div className="flex-1 mx-2 bg-muted rounded-full h-2">
                            <div
                              className="bg-yellow-400 h-2 rounded-full"
                              style={{
                                width: `${reviews.length > 0 ? ((distribution[rating as 1 | 2 | 3 | 4 | 5] || 0) / reviews.length) * 100 : 0}%`
                              }}
                            />
                          </div>
                          <span>{distribution[rating as 1 | 2 | 3 | 4 | 5] || 0}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Filters */}
          {reviews.length > 0 && (
            <div className="flex flex-wrap items-center gap-4 mb-8">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4" />
                <span className="text-sm font-medium">Filter & Sort:</span>
              </div>
              
              <Select value={ratingFilter} onValueChange={setRatingFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="All ratings" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All ratings</SelectItem>
                  <SelectItem value="5">5 stars only</SelectItem>
                  <SelectItem value="4">4+ stars</SelectItem>
                  <SelectItem value="3">3+ stars</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest first</SelectItem>
                  <SelectItem value="oldest">Oldest first</SelectItem>
                  <SelectItem value="rating-high">Highest rated</SelectItem>
                  <SelectItem value="rating-low">Lowest rated</SelectItem>
                  <SelectItem value="featured">Featured first</SelectItem>
                </SelectContent>
              </Select>

              <div className="text-sm text-muted-foreground">
                Showing {filteredReviews.length} of {reviews.length} reviews
              </div>
            </div>
          )}

          {/* Reviews Grid */}
          {filteredReviews.length === 0 ? (
            <div className="text-center py-16">
              <h3 className="text-xl font-semibold text-foreground mb-2">No Reviews Yet</h3>
              <p className="text-muted-foreground">
                Be the first to work with me and leave a review!
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredReviews.map((review) => (
                <Card 
                  key={review.id} 
                  className={`h-full transition-shadow hover:shadow-lg ${
                    review.is_featured ? 'border-2 border-primary/20 shadow-lg' : ''
                  }`}
                >
                  <CardContent className="p-6 h-full flex flex-col">
                    {review.is_featured && (
                      <Badge className="w-fit mb-4 bg-yellow-100 text-yellow-800">
                        Featured Review
                      </Badge>
                    )}

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
                      <span className="ml-2 text-sm text-muted-foreground">
                        {new Date(review.created_at).toLocaleDateString()}
                      </span>
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
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Reviews;