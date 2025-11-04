import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Cloud, Sun, CloudRain, Wind } from "lucide-react";

interface WeatherData {
  condition: "sunny" | "cloudy" | "rainy";
  temperature: number;
  humidity: number;
  windSpeed: number;
  forecast: string;
}

const weatherIcons = {
  sunny: Sun,
  cloudy: Cloud,
  rainy: CloudRain,
};

const weatherColors = {
  sunny: "bg-gradient-to-br from-yellow-400 to-orange-500",
  cloudy: "bg-gradient-to-br from-gray-400 to-gray-600",
  rainy: "bg-gradient-water",
};

export function WeatherCard({ weather }: { weather: WeatherData }) {
  const WeatherIcon = weatherIcons[weather.condition];
  
  return (
    <Card className="shadow-soft hover:shadow-medium transition-all duration-300">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <WeatherIcon className="h-5 w-5" />
          Current Weather
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <div className={`p-4 rounded-lg ${weatherColors[weather.condition]}`}>
            <WeatherIcon className="h-8 w-8 text-white" />
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{weather.temperature}°C</div>
            <div className="text-sm text-muted-foreground capitalize">
              {weather.condition}
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-water rounded-full"></div>
            <span className="text-muted-foreground">Humidity:</span>
            <span className="font-medium">{weather.humidity}%</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Wind className="h-3 w-3 text-muted-foreground" />
            <span className="text-muted-foreground">Wind:</span>
            <span className="font-medium">{weather.windSpeed} km/h</span>
          </div>
        </div>
        
        <div className="mt-4 p-3 bg-muted rounded-lg">
          <div className="text-xs text-muted-foreground mb-1">24h Forecast</div>
          <div className="text-sm font-medium">{weather.forecast}</div>
        </div>
      </CardContent>
    </Card>
  );
}