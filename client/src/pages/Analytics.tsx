import { useState, useMemo } from "react";
import { StatCard } from "@/components/StatCard";
import { 
  SentimentTrendChart, 
  CategoryDistributionChart, 
  MarketplaceDistributionChart,
  RatingDistributionChart,
  StatusDistributionChart
} from "@/components/AnalyticsCharts";
import { TrendingUp, TrendingDown, Star, Target, Calendar } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";

export default function Analytics() {
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  });

  // Build query params
  const queryParams = useMemo(() => {
    const params = new URLSearchParams();
    if (dateRange.from) {
      params.append('startDate', dateRange.from.toISOString());
    }
    if (dateRange.to) {
      params.append('endDate', dateRange.to.toISOString());
    }
    return params.toString();
  }, [dateRange]);

  // Fetch analytics data
  const { data: analyticsData, isLoading } = useQuery({
    queryKey: ['/api/analytics', queryParams],
    queryFn: async () => {
      const url = queryParams ? `/api/analytics?${queryParams}` : '/api/analytics';
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch analytics');
      return response.json();
    },
  });

  const stats = analyticsData?.stats || {};
  const weeklyTrends = analyticsData?.weeklyTrends || {};
  const categoryCounts = analyticsData?.categoryCounts || {};
  const marketplaceCounts = analyticsData?.marketplaceCounts || {};
  const ratingCounts = analyticsData?.ratingCounts || {};
  const statusCounts = analyticsData?.statusCounts || {};

  const handleClearFilters = () => {
    setDateRange({ from: undefined, to: undefined });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold">Analytics</h1>
          <p className="text-sm text-muted-foreground">
            Insights and trends from your marketplace reviews
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" data-testid="button-date-filter">
                <Calendar className="h-4 w-4 mr-2" />
                {dateRange.from && dateRange.to
                  ? `${format(dateRange.from, 'MMM d')} - ${format(dateRange.to, 'MMM d, yyyy')}`
                  : 'Filter by date'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <CalendarComponent
                mode="range"
                selected={{ from: dateRange.from, to: dateRange.to }}
                onSelect={(range) => setDateRange({ from: range?.from, to: range?.to })}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
          
          {(dateRange.from || dateRange.to) && (
            <Button variant="ghost" size="sm" onClick={handleClearFilters} data-testid="button-clear-filters">
              Clear filters
            </Button>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center p-12">
          <p className="text-muted-foreground">Loading analytics...</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Positive Rate"
              value={`${stats.positiveRate || '0.0'}%`}
              icon={TrendingUp}
              subtitle={`${stats.totalReviews || 0} total reviews`}
              testId="stat-positive-rate"
            />
            <StatCard
              title="Negative Rate"
              value={`${stats.negativeRate || '0.0'}%`}
              icon={TrendingDown}
              subtitle={`${stats.totalReviews || 0} total reviews`}
              testId="stat-negative-rate"
            />
            <StatCard
              title="Resolution Rate"
              value={`${stats.resolutionRate || '0.0'}%`}
              icon={Target}
              subtitle={`${stats.totalReviews || 0} total reviews`}
              testId="stat-resolution-rate"
            />
            <StatCard
              title="Avg Rating"
              value={`${stats.avgRating || '0.0'}`}
              icon={Star}
              subtitle="Out of 5 stars"
              testId="stat-avg-rating"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SentimentTrendChart data={weeklyTrends} />
            <CategoryDistributionChart data={categoryCounts} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <MarketplaceDistributionChart data={marketplaceCounts} />
            <RatingDistributionChart data={ratingCounts} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <StatusDistributionChart data={statusCounts} />
          </div>
        </>
      )}
    </div>
  );
}
