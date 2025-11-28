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

const COLORS = ["#06b6d4", "#a855f7", "#f59e0b", "#ec4899", "#22c55e"];

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
      <Card data-testid="chart-sentiment-trend" className="bg-slate-100 dark:bg-slate-200 rounded-2xl border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-slate-800">Sentiment Trend</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[300px]">
          <p className="text-slate-500 text-sm">No review data available for trends</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card data-testid="chart-sentiment-trend" className="bg-slate-100 dark:bg-slate-200 rounded-2xl border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="text-slate-800">Sentiment Trend</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData} margin={{ bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
            <XAxis 
              dataKey="week" 
              stroke="#64748b" 
              tick={{ fontSize: 10, fill: "#64748b" }}
              angle={-30}
              textAnchor="end"
              height={50}
            />
            <YAxis stroke="#64748b" tick={{ fill: "#64748b" }} allowDecimals={false} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: "#ffffff", 
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
                color: "#1e293b"
              }}
              formatter={(value: number) => [Math.round(value), '']}
            />
            <Legend wrapperStyle={{ color: "#1e293b" }} />
            <Line type="monotone" dataKey="positive" stroke="#22c55e" strokeWidth={2} dot={{ r: 4, fill: "#22c55e" }} />
            <Line type="monotone" dataKey="neutral" stroke="#f59e0b" strokeWidth={2} dot={{ r: 4, fill: "#f59e0b" }} />
            <Line type="monotone" dataKey="negative" stroke="#ef4444" strokeWidth={2} dot={{ r: 4, fill: "#ef4444" }} />
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

  const total = chartData.reduce((sum, item) => sum + item.count, 0);

  return (
    <Card data-testid="chart-category-distribution" className="bg-slate-100 dark:bg-slate-200 rounded-2xl border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="text-slate-800">Category Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              fill="#06b6d4"
              dataKey="count"
              label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
              labelLine={false}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={index === 0 ? "#06b6d4" : "#1e3a5f"} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: "#ffffff", 
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
                color: "#1e293b"
              }}
              formatter={(value: number) => [value, 'Count']}
            />
            <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="text-2xl font-bold" fill="#1e293b">
              {total}
            </text>
          </PieChart>
        </ResponsiveContainer>
        <p className="text-center text-slate-600 text-sm mt-2">Category Distribution</p>
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
    <Card data-testid="chart-marketplace-distribution" className="bg-slate-100 dark:bg-slate-200 rounded-2xl border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="text-slate-800">Marketplace Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} barCategoryGap="20%">
            <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
            <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 11, fill: "#64748b" }} />
            <YAxis stroke="#64748b" tick={{ fill: "#64748b" }} allowDecimals={false} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: "#ffffff", 
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
                color: "#1e293b"
              }} 
            />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={index % 2 === 0 ? "#a855f7" : "#06b6d4"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <p className="text-center text-slate-600 text-sm mt-2">Rating Distribution</p>
      </CardContent>
    </Card>
  );
}

interface RatingDistributionChartProps {
  data: Record<number, number>;
}

export function RatingDistributionChart({ data }: RatingDistributionChartProps) {
  const chartData = [1, 2, 3, 4, 5].map(rating => ({
    rating: rating.toString(),
    count: Math.round(data[rating] || 0),
  }));

  return (
    <Card data-testid="chart-rating-distribution" className="bg-slate-100 dark:bg-slate-200 rounded-2xl border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="text-slate-800">Rating Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} barCategoryGap="20%">
            <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
            <XAxis dataKey="rating" stroke="#64748b" tick={{ fontSize: 12, fill: "#64748b" }} />
            <YAxis stroke="#64748b" tick={{ fill: "#64748b" }} allowDecimals={false} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: "#ffffff", 
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
                color: "#1e293b"
              }}
              formatter={(value: number) => [Math.round(value), 'Reviews']}
            />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={index % 2 === 0 ? "#a855f7" : "#06b6d4"} />
              ))}
            </Bar>
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
    <Card data-testid="chart-status-distribution" className="bg-slate-100 dark:bg-slate-200 rounded-2xl border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="text-slate-800">Review Status Distribution</CardTitle>
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
              fill="#06b6d4"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: "#ffffff", 
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
                color: "#1e293b"
              }} 
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
