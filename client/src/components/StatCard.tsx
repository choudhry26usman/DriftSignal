import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  subtitle?: string;
  testId?: string;
  gradientClass?: string;
}

const defaultGradients = [
  "gradient-stat-1",
  "gradient-stat-2", 
  "gradient-stat-3",
  "gradient-stat-4",
];

export function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  subtitle, 
  testId,
  gradientClass 
}: StatCardProps) {
  return (
    <div 
      data-testid={testId}
      className={cn(
        "rounded-xl p-5 text-white relative overflow-hidden",
        gradientClass || defaultGradients[0]
      )}
    >
      <div className="absolute top-0 right-0 w-24 h-24 opacity-20">
        <svg viewBox="0 0 100 50" className="w-full h-full">
          <path
            d="M0 45 Q 10 35, 20 40 T 40 30 T 60 35 T 80 25 T 100 30"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="opacity-60"
          />
        </svg>
      </div>
      
      <div className="relative z-10">
        <p className="text-xs font-medium uppercase tracking-wider opacity-90 mb-1">
          {title}
        </p>
        <div className="flex items-baseline gap-2">
          <p className="text-3xl font-bold" data-testid={`${testId}-value`}>{value}</p>
          {trend && (
            <span
              className={cn(
                "text-sm font-medium opacity-90",
                trend.isPositive ? "text-emerald-200" : "text-red-200"
              )}
            >
              {trend.isPositive ? "+" : ""}{trend.value}
            </span>
          )}
        </div>
        {subtitle && (
          <p className="text-xs opacity-80 mt-1">{subtitle}</p>
        )}
      </div>
      
      <div className="absolute bottom-3 right-3 opacity-30">
        <Icon className="h-8 w-8" />
      </div>
    </div>
  );
}
