import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { SensorCard } from "./SensorCard";
import { WeatherCard } from "./WeatherCard";
import { CropRecommendation } from "./CropRecommendation";
import { PumpControl } from "./PumpControl";
import { DataChart } from "./DataChart";
import { ChatBot } from "./ChatBot";
import { SensorDetailModal } from "./SensorDetailModal";
import { Thermometer, Droplets, Gauge, Leaf, History } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getCurrentSensors, getSensorHistory, getPumpStatus, getCropRecommendation, type SensorData } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

// Mock weather data (can be replaced with real API later)
const mockWeather = {
  condition: "sunny" as const,
  temperature: 28,
  humidity: 65,
  windSpeed: 12,
  forecast: "Sunny with occasional clouds. Perfect conditions for irrigation.",
};

// Mock crops data (will be replaced with API prediction results)
const mockCrops = [
  {
    name: "Tomatoes",
    suitability: "excellent" as const,
    expectedYield: "8-10 kg/m²",
    waterRequirement: "medium" as const,
    plantingTime: "Next week",
  },
  {
    name: "Lettuce", 
    suitability: "good" as const,
    expectedYield: "4-6 kg/m²",
    waterRequirement: "low" as const,
    plantingTime: "2 weeks",
  },
  {
    name: "Peppers",
    suitability: "fair" as const,
    expectedYield: "5-7 kg/m²", 
    waterRequirement: "high" as const,
    plantingTime: "3 weeks",
  },
];

export function Dashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [sensorData, setSensorData] = useState<SensorData>({
    temperature: 0,
    humidity: 0,
    soil_moisture: 0,
    N: 0,
    P: 0,
    K: 0,
    rainfall: 0,
  });
  const [pumpActive, setPumpActive] = useState(false);
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [recommendedCrop, setRecommendedCrop] = useState<string | null>(null);
  const [crops, setCrops] = useState<any[]>([]);
  const [selectedSensor, setSelectedSensor] = useState<{
    type: string;
    value: number;
    unit: string;
    status: "good" | "warning" | "danger";
    icon: any;
  } | null>(null);

  // Fetch sensor data from API
  const fetchSensorData = async () => {
    try {
      const data = await getCurrentSensors();
      
      // Check if we have real data or just zeros
      if (data.timestamp === null || data.timestamp === undefined) {
        // No real sensor data yet, use demo data
        setSensorData({
          temperature: Math.floor(Math.random() * 10) + 20,
          humidity: Math.floor(Math.random() * 20) + 60,
          soil_moisture: Math.floor(Math.random() * 30) + 40,
          N: 90,
          P: 42,
          K: 43,
          rainfall: 202.9,
        });
      } else {
        setSensorData(data);
      }
      
      // Update pump status
      const pumpStatus = await getPumpStatus();
      setPumpActive(pumpStatus.active);
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching sensor data:', error);
      // Use mock data as fallback
      setSensorData({
        temperature: Math.floor(Math.random() * 10) + 20,
        humidity: Math.floor(Math.random() * 20) + 60,
        soil_moisture: Math.floor(Math.random() * 30) + 40,
        N: 90,
        P: 42,
        K: 43,
        rainfall: 202.9,
      });
      setLoading(false);
    }
  };

  // Fetch historical data for charts
  const fetchHistoricalData = async () => {
    try {
      const history = await getSensorHistory(24);
      if (history && history.length > 0) {
        const formattedData = history.map((entry: SensorData) => ({
          time: entry.timestamp ? new Date(entry.timestamp).toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: false 
          }) : '',
          soilMoisture: entry.soil_moisture,
          temperature: entry.temperature,
          humidity: entry.humidity,
        }));
        setChartData(formattedData);
      }
    } catch (error) {
      console.error('Error fetching historical data:', error);
    }
  };

  // Fetch crop recommendation from ML model
  const fetchCropRecommendation = async () => {
    try {
      const recommendation = await getCropRecommendation();
      if (recommendation.recommended_crop && recommendation.recommended_crop !== 'Unknown') {
        setRecommendedCrop(recommendation.recommended_crop);
        
        // Create crop data for display
        const cropData = [{
          name: recommendation.recommended_crop,
          suitability: "excellent" as const,
          expectedYield: "Based on current conditions",
          waterRequirement: recommendation.current_conditions.soil_moisture < 40 ? "high" as const : 
                           recommendation.current_conditions.soil_moisture > 60 ? "low" as const : "medium" as const,
          plantingTime: "Now",
        }];
        setCrops(cropData);
        
        toast({
          title: "Crop Recommendation Updated",
          description: `AI recommends: ${recommendation.recommended_crop}`,
        });
      } else {
        // No recommendation yet, show placeholder
        setCrops([{
          name: "Waiting for sensor data...",
          suitability: "fair" as const,
          expectedYield: "N/A",
          waterRequirement: "medium" as const,
          plantingTime: "N/A",
        }]);
      }
    } catch (error) {
      console.error('Error fetching crop recommendation:', error);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchSensorData();
    fetchHistoricalData();
    fetchCropRecommendation();
  }, []);

  // Real-time data updates every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchSensorData();
      fetchHistoricalData();
      fetchCropRecommendation();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getSoilMoistureStatus = (moisture: number) => {
    if (moisture >= 60) return "good";
    if (moisture >= 40) return "warning";
    return "danger";
  };

  const getTemperatureStatus = (temp: number) => {
    if (temp >= 20 && temp <= 30) return "good";
    if (temp >= 15 && temp <= 35) return "warning";
    return "danger";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Loading Dashboard...</h2>
          <p className="text-muted-foreground">Connecting to sensors</p>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="text-center">
          <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            AgroSmart Dashboard
          </h1>
          <p className="text-muted-foreground text-lg">
            Intelligent Irrigation System - Monitor, Control & Optimize
          </p>
        </div>
        
        <Button
          onClick={() => navigate("/historical-logs")}
          variant="outline"
          className="border-primary/20 hover:bg-primary/10"
        >
          <History className="h-4 w-4 mr-2" />
          Historical Logs
        </Button>
      </div>

      {/* Real-time Sensor Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <SensorCard
          title="Soil Moisture"
          value={sensorData.soil_moisture.toString()}
          unit="%"
          status={getSoilMoistureStatus(sensorData.soil_moisture)}
          icon={Droplets}
          change="+2% from yesterday"
          onClick={() => setSelectedSensor({
            type: "Soil Moisture",
            value: sensorData.soil_moisture,
            unit: "%",
            status: getSoilMoistureStatus(sensorData.soil_moisture),
            icon: Droplets,
          })}
        />
        
        <SensorCard
          title="Temperature"
          value={sensorData.temperature.toString()}
          unit="°C"
          status={getTemperatureStatus(sensorData.temperature)}
          icon={Thermometer}
          change="+1.5°C from yesterday"
          onClick={() => setSelectedSensor({
            type: "Temperature",
            value: sensorData.temperature,
            unit: "°C",
            status: getTemperatureStatus(sensorData.temperature),
            icon: Thermometer,
          })}
        />
        
        <SensorCard
          title="Air Humidity"
          value={sensorData.humidity.toString()}
          unit="%"
          status="good"
          icon={Gauge}
          change="-3% from yesterday"
          onClick={() => setSelectedSensor({
            type: "Air Humidity",
            value: sensorData.humidity,
            unit: "%",
            status: "good",
            icon: Gauge,
          })}
        />
        
        <SensorCard
          title="NPK (N)"
          value={sensorData.N.toString()}
          unit=""
          status="good"
          icon={Leaf}
          change="Stable"
          onClick={() => setSelectedSensor({
            type: "Nitrogen (N)",
            value: sensorData.N,
            unit: "",
            status: "good",
            icon: Leaf,
          })}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Data Visualization */}
          <DataChart 
            data={chartData}
            title="24-Hour Sensor Readings"
          />
          
          {/* Crop Recommendations - Real-time from ML Model */}
          <CropRecommendation crops={crops.length > 0 ? crops : [{
            name: "Waiting for ESP32 data...",
            suitability: "fair" as const,
            expectedYield: "Connect ESP32 to get recommendations",
            waterRequirement: "medium" as const,
            plantingTime: "N/A",
          }]} />
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Weather Card */}
          <WeatherCard weather={mockWeather} />
          
          {/* Pump Control */}
          <PumpControl
            isActive={pumpActive}
            waterLevel={85}
            pressure={12}
            flowRate={15}
            onToggle={setPumpActive}
          />
        </div>
      </div>

      {/* Floating Chatbot */}
      <ChatBot 
        sensorContext={{
          temperature: sensorData.temperature,
          humidity: sensorData.humidity,
          soil_moisture: sensorData.soil_moisture,
          N: sensorData.N,
          P: sensorData.P,
          K: sensorData.K,
          recommended_crop: recommendedCrop || undefined,
        }}
      />

      {/* Sensor Detail Modal */}
      {selectedSensor && (
        <SensorDetailModal
          isOpen={!!selectedSensor}
          onClose={() => setSelectedSensor(null)}
          sensorType={selectedSensor.type}
          currentValue={selectedSensor.value}
          unit={selectedSensor.unit}
          status={selectedSensor.status}
          icon={selectedSensor.icon}
        />
      )}
    </div>
  );
}