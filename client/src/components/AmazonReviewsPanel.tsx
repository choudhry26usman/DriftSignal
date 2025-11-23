import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Star, Package, Loader2, Download } from "lucide-react";

interface AmazonReview {
  reviewTitle: string;
  reviewText: string;
  rating: string;
  reviewerName: string;
  reviewDate: string;
  verified: boolean;
}

interface ReviewsResponse {
  asin: string;
  reviews: AmazonReview[];
  total: number;
}

export function AmazonReviewsPanel() {
  const [asin, setAsin] = useState("");
  const [reviews, setReviews] = useState<AmazonReview[]>([]);
  const [fetchedAsin, setFetchedAsin] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchReviewsMutation = useMutation({
    mutationFn: async (asinValue: string) => {
      const response = await apiRequest("POST", "/api/amazon/reviews", { asin: asinValue });
      return await response.json() as ReviewsResponse;
    },
    onSuccess: (data) => {
      setReviews(data.reviews);
      setFetchedAsin(data.asin);
      toast({
        title: "Success!",
        description: `Fetched ${data.total} reviews for ASIN: ${data.asin}`,
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Failed to fetch reviews",
        description: error.message || "Please check your ASIN and try again",
      });
    },
  });

  const handleFetchReviews = () => {
    const trimmedAsin = asin.trim();
    if (!trimmedAsin) {
      toast({
        variant: "destructive",
        title: "ASIN required",
        description: "Please enter an Amazon ASIN",
      });
      return;
    }
    fetchReviewsMutation.mutate(trimmedAsin);
  };

  const getRatingColor = (rating: string) => {
    const numRating = parseFloat(rating);
    if (numRating >= 4) return "text-green-600 dark:text-green-400";
    if (numRating >= 3) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  return (
    <div className="space-y-4">
      <Card className="border-primary/20">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-primary" />
            <CardTitle>Amazon Reviews Importer</CardTitle>
          </div>
          <CardDescription>
            Enter an Amazon ASIN to fetch and import product reviews from Amazon
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Enter Amazon ASIN (e.g., B0C1ZQRKQ2)"
              value={asin}
              onChange={(e) => setAsin(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleFetchReviews();
                }
              }}
              data-testid="input-asin"
            />
            <Button
              onClick={handleFetchReviews}
              disabled={fetchReviewsMutation.isPending}
              data-testid="button-fetch-reviews"
            >
              {fetchReviewsMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Fetching...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Fetch Reviews
                </>
              )}
            </Button>
          </div>

          {fetchedAsin && reviews.length > 0 && (
            <div className="pt-2">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-muted-foreground">
                  Showing {reviews.length} reviews for ASIN: <span className="font-mono font-semibold">{fetchedAsin}</span>
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {reviews.length > 0 && (
        <div className="space-y-3">
          {reviews.map((review, index) => (
            <Card key={index} className="hover-elevate" data-testid={`card-review-${index}`}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-base line-clamp-2">{review.reviewTitle}</CardTitle>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span className="text-sm text-muted-foreground">{review.reviewerName}</span>
                      {review.verified && (
                        <Badge variant="secondary" className="text-xs">
                          Verified Purchase
                        </Badge>
                      )}
                      <span className="text-xs text-muted-foreground">{review.reviewDate}</span>
                    </div>
                  </div>
                  <div className={`flex items-center gap-1 ${getRatingColor(review.rating)}`}>
                    <Star className="w-4 h-4 fill-current" />
                    <span className="font-semibold">{review.rating}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-3">{review.reviewText}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {fetchedAsin && reviews.length === 0 && !fetchReviewsMutation.isPending && (
        <Card>
          <CardContent className="pt-6 text-center text-muted-foreground">
            No reviews found for ASIN: {fetchedAsin}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
