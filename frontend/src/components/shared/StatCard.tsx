import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  change?: {
    value: string;
    trend: 'up' | 'down' | 'neutral';
  };
  className?: string;
}

export function StatCard({ title, value, icon: Icon, change, className = "" }: StatCardProps) {
  return (
    <div className={`glass-card p-5 rounded-xl ${className}`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-400 mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-white">{value}</h3>
          
          {change && (
            <p className={`text-xs mt-2 font-medium flex items-center gap-1 ${
              change.trend === 'up' ? 'text-emerald-400' : 
              change.trend === 'down' ? 'text-red-400' : 
              'text-gray-400'
            }`}>
              {change.trend === 'up' ? '↑' : change.trend === 'down' ? '↓' : '•'} 
              {change.value}
            </p>
          )}
        </div>
        
        <div className="p-3 bg-emerald-500/10 rounded-lg">
          <Icon className="w-5 h-5 text-emerald-500" />
        </div>
      </div>
    </div>
  );
}
