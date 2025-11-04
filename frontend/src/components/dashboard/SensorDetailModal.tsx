import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { LucideIcon, TrendingUp, TrendingDown, Minus, Clock, AlertTriangle } from "lucide-react";
import { DataChart } from "./DataChart";

interface SensorDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  sensorType: string;
  currentValue: number;
  unit: string;
  status: "good" | "warning" | "danger";
  icon: LucideIcon;
}

// Generate detailed historical data for the sensor
const generateDetailedData = (sensorType: string, currentValue: number) => {
  const data = [];
  const now = new Date();
  
  for (let i = 23; i >= 0; i--) {
    const hour = new Date(now);
    hour.setHours(hour.getHours() - i);
    
    // Generate realistic variations based on sensor type
    let value;
    if (sensorType === "Soil Moisture") {
      value = currentValue + Math.sin(i * 0.5) * 5 + (Math.random() - 0.5) * 8;
    } else if (sensorType === "Temperature") {
      value = currentValue + Math.sin(i * 0.3) * 3 + (Math.random() - 0.5) * 4;
    } else {
      value = currentValue + Math.sin(i * 0.4) * 10 + (Math.random() - 0.5) * 6;
    }
    
    data.push({
      time: hour.getHours().toString().padStart(2, '0') + ':00',
      value: Math.max(0, Math.round(value)),
    });
  }
  
  return data;
};

const getOptimalRange = (sensorType: string) => {
  switch (sensorType) {
    case "Soil Moisture":
      return { min: 40, max: 70, ideal: "50-65%" };
    case "Temperature":
      return { min: 18, max: 30, ideal: "20-28°C" };
    case "Air Humidity":
      return { min: 40, max: 80, ideal: "60-75%" };
    default:
      return { min: 0, max: 100, ideal: "N/A" };
  }
};

const getTrend = (data: { value: number }[]) => {
  if (data.length < 2) return "stable";
  
  const recent = data.slice(-3);
  const avg = recent.reduce((sum, d) => sum + d.value, 0) / recent.length;
  const older = data.slice(-6, -3);
  const oldAvg = older.reduce((sum, d) => sum + d.value, 0) / older.length;
  
  const diff = avg - oldAvg;
  if (diff > 2) return "increasing";
  if (diff < -2) return "decreasing";
  return "stable";
};

const getRecommendations = (sensorType: string, value: number, status: string) => {
  const recommendations = [];
  
  if (sensorType === "Soil Moisture") {
    if (status === "danger") {
      recommendations.push("Immediate irrigation required - soil is too dry");
      recommendations.push("Check irrigation system for blockages");
    } else if (status === "warning") {
      recommendations.push("Consider light irrigation within 2-4 hours");
      recommendations.push("Monitor closely for the next few hours");
    } else {
      recommendations.push("Soil moisture levels are optimal");
      recommendations.push("Continue current irrigation schedule");
    }
  } else if (sensorType === "Temperature") {
    if (value > 30) {
      recommendations.push("High temperature - increase shade coverage");
      recommendations.push("Consider early morning irrigation");
    } else if (value < 18) {
      recommendations.push("Low temperature - protect sensitive crops");
      recommendations.push("Reduce irrigation frequency");
    } else {
      recommendations.push("Temperature is ideal for most crops");
    }
  } else if (sensorType === "Air Humidity") {
    if (value > 80) {
      recommendations.push("High humidity - monitor for fungal diseases");
      recommendations.push("Improve air circulation");
    } else if (value < 40) {
      recommendations.push("Low humidity - consider misting systems");
      recommendations.push("Monitor plant stress indicators");
    }
  }
  
  return recommendations;
};

export function SensorDetailModal({
  isOpen,
  onClose,
  sensorType,
  currentValue,
  unit,
  status,
  icon: Icon,
}: SensorDetailModalProps) {
  const detailedData = generateDetailedData(sensorType, currentValue);
  const optimalRange = getOptimalRange(sensorType);
  const trend = getTrend(detailedData);
  const recommendations = getRecommendations(sensorType, currentValue, status);
  
  const chartData = detailedData.map(d => ({
    time: d.time,
    [sensorType.toLowerCase().replace(' ', '')]: d.value,
    soilMoisture: sensorType === "Soil Moisture" ? d.value : 0,
    temperature: sensorType === "Temperature" ? d.value : 0,
    humidity: sensorType === "Air Humidity" ? d.value : 0,
  }));

  const TrendIcon = trend === "increasing" ? TrendingUp : trend === "decreasing" ? TrendingDown : Minus;
  const trendColor = trend === "increasing" ? "text-success" : trend === "decreasing" ? "text-destructive" : "text-muted-foreground";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Icon className="h-6 w-6 text-primary" />
            {sensorType} Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="shadow-soft">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground">Current Reading</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">
                  {currentValue}{unit}
                </div>
                <Badge variant="outline" className={
                  status === "good" ? "bg-success text-white" :
                  status === "warning" ? "bg-warning text-white" : 
                  "bg-destructive text-white"
                }>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </Badge>
              </CardContent>
            </Card>

            <Card className="shadow-soft">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground">24h Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <TrendIcon className={`h-6 w-6 ${trendColor}`} />
                  <span className="text-lg font-semibold capitalize">{trend}</span>
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  Based on last 24 hours
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-soft">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground">Optimal Range</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-semibold text-leaf">
                  {optimalRange.ideal}
                </div>
                <Progress 
                  value={Math.min(100, Math.max(0, (currentValue - optimalRange.min) / (optimalRange.max - optimalRange.min) * 100))} 
                  className="mt-2"
                />
              </CardContent>
            </Card>
          </div>

          {/* Chart */}
          <DataChart 
            data={chartData}
            title={`${sensorType} - Last 24 Hours`}
          />

          {/* Recommendations */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-warning" />
                AI Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recommendations.map((rec, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                    <span className="text-sm">{rec}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button className="bg-gradient-primary">
              <Clock className="h-4 w-4 mr-2" />
              View Historical Data
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}