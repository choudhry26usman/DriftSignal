import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))", "hsl(var(--chart-5))"];

interface SentimentTrendChartProps {
  data: Record<string, { positive: number; neutral: number; negative: number }>;
}

export function SentimentTrendChart({ data }: SentimentTrendChartProps) {
  const chartData = Object.entries(data).map(([week, counts]) => ({
    week,
    positive: Math.round(counts.positive),
    neutral: Math.round(counts.neutral),
    negative: Math.round(counts.negative),
  }));

  if (chartData.length === 0) {
    return (
      <Card data-testid="chart-sentiment-trend">
        <CardHeader>
          <CardTitle>Sentiment Trends</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[300px]">
          <p className="text-muted-foreground text-sm">No review data available for trends</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card data-testid="chart-sentiment-trend">
      <CardHeader>
        <CardTitle>Sentiment Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData} margin={{ bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="week" 
              stroke="hsl(var(--muted-foreground))" 
              tick={{ fontSize: 10 }}
              angle={-30}
              textAnchor="end"
              height={50}
            />
            <YAxis stroke="hsl(var(--muted-foreground))" allowDecimals={false} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: "hsl(var(--popover))", 
                border: "1px solid hsl(var(--border))",
                borderRadius: "6px"
              }}
              formatter={(value: number) => [Math.round(value), '']}
            />
            <Legend />
            <Line type="monotone" dataKey="positive" stroke="hsl(var(--chart-2))" strokeWidth={2} dot={{ r: 4 }} />
            <Line type="monotone" dataKey="neutral" stroke="hsl(var(--chart-3))" strokeWidth={2} dot={{ r: 4 }} />
            <Line type="monotone" dataKey="negative" stroke="hsl(var(--destructive))" strokeWidth={2} dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

interface CategoryDistributionChartProps {
  data: Record<string, number>;
}

export function CategoryDistributionChart({ data }: CategoryDistributionChartProps) {
  const chartData = Object.entries(data).map(([category, count]) => ({
    category: category.charAt(0).toUpperCase() + category.slice(1),
    shortCategory: category.length > 12 ? category.substring(0, 10) + '...' : category,
    count,
  })).sort((a, b) => b.count - a.count).slice(0, 8);

  return (
    <Card data-testid="chart-category-distribution">
      <CardHeader>
        <CardTitle>Issue Categories</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} margin={{ bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="shortCategory" 
              stroke="hsl(var(--muted-foreground))" 
              tick={{ fontSize: 10 }}
              angle={-45}
              textAnchor="end"
              height={60}
              interval={0}
            />
            <YAxis stroke="hsl(var(--muted-foreground))" allowDecimals={false} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: "hsl(var(--popover))", 
                border: "1px solid hsl(var(--border))",
                borderRadius: "6px"
              }}
              formatter={(value: number) => [value, 'Count']}
              labelFormatter={(label: string, payload: any[]) => payload?.[0]?.payload?.category || label}
            />
            <Bar dataKey="count" fill="hsl(var(--chart-1))" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

interface MarketplaceDistributionChartProps {
  data: Record<string, number>;
}

export function MarketplaceDistributionChart({ data }: MarketplaceDistributionChartProps) {
  const chartData = Object.entries(data).map(([name, value]) => ({ name, value }));

  return (
    <Card data-testid="chart-marketplace-distribution">
      <CardHeader>
        <CardTitle>Reviews by Marketplace</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="hsl(var(--chart-1))"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: "hsl(var(--popover))", 
                border: "1px solid hsl(var(--border))",
                borderRadius: "6px"
              }} 
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

interface RatingDistributionChartProps {
  data: Record<number, number>;
}

export function RatingDistributionChart({ data }: RatingDistributionChartProps) {
  const chartData = [1, 2, 3, 4, 5].map(rating => ({
    rating: `${rating} ★`,
    count: Math.round(data[rating] || 0),
  }));

  return (
    <Card data-testid="chart-rating-distribution">
      <CardHeader>
        <CardTitle>Rating Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="rating" stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 12 }} />
            <YAxis stroke="hsl(var(--muted-foreground))" allowDecimals={false} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: "hsl(var(--popover))", 
                border: "1px solid hsl(var(--border))",
                borderRadius: "6px"
              }}
              formatter={(value: number) => [Math.round(value), 'Reviews']}
            />
            <Bar dataKey="count" fill="hsl(var(--chart-4))" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

interface StatusDistributionChartProps {
  data: Record<string, number>;
}

export function StatusDistributionChart({ data }: StatusDistributionChartProps) {
  const chartData = Object.entries(data).map(([name, value]) => ({
    name: name.replace('_', ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
    value,
  }));

  return (
    <Card data-testid="chart-status-distribution">
      <CardHeader>
        <CardTitle>Review Status Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="hsl(var(--chart-1))"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: "hsl(var(--popover))", 
                border: "1px solid hsl(var(--border))",
                borderRadius: "6px"
              }} 
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
