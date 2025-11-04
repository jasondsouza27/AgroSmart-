import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Leaf, TrendingUp, Droplets } from "lucide-react";

interface CropData {
  name: string;
  suitability: "excellent" | "good" | "fair";
  expectedYield: string;
  waterRequirement: "low" | "medium" | "high";
  plantingTime: string;
}

const suitabilityColors = {
  excellent: "bg-success text-white",
  good: "bg-leaf text-white",
  fair: "bg-warning text-white",
};

const waterColors = {
  low: "text-success",
  medium: "text-warning", 
  high: "text-info",
};

export function CropRecommendation({ crops }: { crops: CropData[] }) {
  return (
    <Card className="shadow-soft hover:shadow-medium transition-all duration-300">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Leaf className="h-5 w-5 text-success" />
          AI Crop Recommendations
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {crops.map((crop, index) => (
            <div key={index} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold">{crop.name}</h4>
                <Badge className={suitabilityColors[crop.suitability]}>
                  {crop.suitability}
                </Badge>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-3 w-3 text-success" />
                  <span className="text-muted-foreground">Yield:</span>
                  <span className="font-medium">{crop.expectedYield}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Droplets className={`h-3 w-3 ${waterColors[crop.waterRequirement]}`} />
                  <span className="text-muted-foreground">Water:</span>
                  <span className="font-medium capitalize">{crop.waterRequirement}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-accent rounded-full"></div>
                  <span className="text-muted-foreground">Plant:</span>
                  <span className="font-medium">{crop.plantingTime}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}