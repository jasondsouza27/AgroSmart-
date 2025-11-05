import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Power, Droplets, Settings, Timer } from "lucide-react";
import { toast } from "sonner";

interface PumpControlProps {
  isActive: boolean;
  waterLevel: number;
  pressure: number;
  flowRate: number;
  onToggle: (active: boolean) => void;
  onAutoModeToggle?: (enabled: boolean) => Promise<void>;
}

export function PumpControl({ 
  isActive, 
  waterLevel, 
  pressure, 
  flowRate, 
  onToggle,
  onAutoModeToggle
}: PumpControlProps) {
  const [autoMode, setAutoMode] = useState(true);
  
  const handleManualToggle = async () => {
    // If in auto mode, switch to manual mode first
    if (autoMode) {
      setAutoMode(false);
      toast.info("Switched to manual mode");
    }
    
    // Then toggle the pump
    onToggle(!isActive);
    toast.success(isActive ? "Pump stopped" : "Pump started");
  };
  
  const handleAutoModeToggle = async (enabled: boolean) => {
    setAutoMode(enabled);
    
    if (enabled && onAutoModeToggle) {
      try {
        await onAutoModeToggle(enabled);
      } catch (error) {
        console.error("Error toggling auto mode:", error);
        toast.error("Failed to enable auto mode");
        // Revert the toggle state
        setAutoMode(!enabled);
      }
    } else {
      toast.info("Manual mode enabled - use buttons to control pump");
    }
  };
  
  return (
    <Card className="shadow-soft hover:shadow-medium transition-all duration-300">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Power className="h-5 w-5" />
            Pump Control
          </div>
          <Badge 
            variant={isActive ? "default" : "secondary"}
            className={isActive ? "bg-success text-white animate-pulse-glow" : ""}
          >
            {isActive ? "Running" : "Stopped"}
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Auto Mode Toggle */}
        <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
          <div className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span className="font-medium">Auto Mode</span>
          </div>
          <Switch 
            checked={autoMode} 
            onCheckedChange={handleAutoModeToggle}
          />
        </div>
        
        {/* Manual Control */}
        <div className="space-y-3">
          <Button 
            onClick={handleManualToggle}
            className={`w-full ${isActive ? 'bg-destructive hover:bg-destructive/90' : 'bg-gradient-primary'}`}
            size="lg"
          >
            <Power className="h-4 w-4 mr-2" />
            {isActive ? "Stop Pump" : "Start Pump"}
          </Button>
          
          {autoMode && (
            <div className="text-xs text-muted-foreground text-center">
              Click button to switch to manual control
            </div>
          )}
        </div>
        
        {/* Status Indicators */}
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Droplets className="h-3 w-3 text-water" />
                Water Level
              </div>
              <span className="font-medium">{waterLevel}%</span>
            </div>
            <Progress value={waterLevel} className="h-2" />
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-info rounded-full"></div>
              <span className="text-muted-foreground">Pressure:</span>
              <span className="font-medium">{pressure} PSI</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Timer className="h-3 w-3 text-muted-foreground" />
              <span className="text-muted-foreground">Flow:</span>
              <span className="font-medium">{flowRate} L/min</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}