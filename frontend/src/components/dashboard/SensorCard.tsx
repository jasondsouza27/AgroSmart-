import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LucideIcon } from "lucide-react";

interface SensorCardProps {
  title: string;
  value: string;
  unit: string;
  status: "good" | "warning" | "danger";
  icon: LucideIcon;
  change?: string;
  onClick?: () => void;
}

const statusColors = {
  good: "bg-gradient-success text-white",
  warning: "bg-warning text-white",
  danger: "bg-destructive text-white",
};

const statusBadgeColors = {
  good: "bg-success text-white",
  warning: "bg-warning text-white", 
  danger: "bg-destructive text-white",
};

export function SensorCard({ title, value, unit, status, icon: Icon, change, onClick }: SensorCardProps) {
  return (
    <Card 
      className="relative overflow-hidden shadow-soft hover:shadow-medium transition-all duration-300 hover:scale-105 cursor-pointer"
      onClick={onClick}
    >
      <div className={`absolute top-0 right-0 w-20 h-20 ${statusColors[status]} rounded-bl-full opacity-10`} />
      
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      
      <CardContent>
        <div className="flex items-baseline space-x-2">
          <div className="text-2xl font-bold text-foreground">
            {value}
          </div>
          <span className="text-sm text-muted-foreground">{unit}</span>
        </div>
        
        <div className="flex items-center justify-between mt-3">
          <Badge variant="outline" className={statusBadgeColors[status]}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
          
          {change && (
            <div className="text-xs text-muted-foreground">
              {change}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}