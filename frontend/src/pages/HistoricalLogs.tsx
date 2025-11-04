import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Download, Filter, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { DataChart } from "@/components/dashboard/DataChart";

// Mock historical data
const generateHistoricalData = () => {
  const data = [];
  const now = new Date();
  
  for (let i = 30; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    // Generate multiple readings per day
    for (let hour = 0; hour < 24; hour += 3) {
      data.push({
        timestamp: new Date(date.getFullYear(), date.getMonth(), date.getDate(), hour),
        soilMoisture: Math.floor(Math.random() * 30) + 40,
        temperature: Math.floor(Math.random() * 10) + 20,
        humidity: Math.floor(Math.random() * 20) + 60,
        pumpStatus: Math.random() > 0.7 ? "ON" : "OFF",
        waterUsage: Math.floor(Math.random() * 50) + 10,
      });
    }
  }
  
  return data.reverse();
};

const mockLogs = generateHistoricalData();

const formatChartData = (logs: typeof mockLogs) => {
  return logs.slice(-24).map(log => ({
    time: log.timestamp.getHours().toString().padStart(2, '0') + ':00',
    soilMoisture: log.soilMoisture,
    temperature: log.temperature,
    humidity: log.humidity,
  }));
};

export function HistoricalLogs() {
  const navigate = useNavigate();

  const getTotalWaterUsage = () => {
    return mockLogs.reduce((sum, log) => sum + log.waterUsage, 0);
  };

  const getAverageValues = () => {
    const total = mockLogs.length;
    return {
      soilMoisture: Math.round(mockLogs.reduce((sum, log) => sum + log.soilMoisture, 0) / total),
      temperature: Math.round(mockLogs.reduce((sum, log) => sum + log.temperature, 0) / total),
      humidity: Math.round(mockLogs.reduce((sum, log) => sum + log.humidity, 0) / total),
    };
  };

  const averages = getAverageValues();
  const chartData = formatChartData(mockLogs);

  return (
    <div className="min-h-screen bg-background p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => navigate("/")}
            className="border-primary/20 hover:bg-primary/10"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          
          <div>
            <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Historical Logs
            </h1>
            <p className="text-muted-foreground">
              30-day sensor data and irrigation history
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" className="border-primary/20 hover:bg-primary/10">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" className="border-primary/20 hover:bg-primary/10">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="shadow-soft hover:shadow-medium transition-all duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Total Water Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-water">
              {getTotalWaterUsage().toLocaleString()} L
            </div>
            <p className="text-xs text-muted-foreground mt-1">Last 30 days</p>
          </CardContent>
        </Card>

        <Card className="shadow-soft hover:shadow-medium transition-all duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Avg Soil Moisture</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-soil">
              {averages.soilMoisture}%
            </div>
            <p className="text-xs text-success mt-1">Optimal range</p>
          </CardContent>
        </Card>

        <Card className="shadow-soft hover:shadow-medium transition-all duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Avg Temperature</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">
              {averages.temperature}°C
            </div>
            <p className="text-xs text-success mt-1">Good conditions</p>
          </CardContent>
        </Card>

        <Card className="shadow-soft hover:shadow-medium transition-all duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Avg Humidity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-info">
              {averages.humidity}%
            </div>
            <p className="text-xs text-success mt-1">Ideal level</p>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <DataChart 
        data={chartData}
        title="Last 24 Hours Detailed Readings"
      />

      {/* Detailed Logs Table */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Detailed Activity Logs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-3 text-sm font-medium text-muted-foreground">
                    Timestamp
                  </th>
                  <th className="text-left p-3 text-sm font-medium text-muted-foreground">
                    Soil Moisture
                  </th>
                  <th className="text-left p-3 text-sm font-medium text-muted-foreground">
                    Temperature
                  </th>
                  <th className="text-left p-3 text-sm font-medium text-muted-foreground">
                    Humidity
                  </th>
                  <th className="text-left p-3 text-sm font-medium text-muted-foreground">
                    Pump Status
                  </th>
                  <th className="text-left p-3 text-sm font-medium text-muted-foreground">
                    Water Used
                  </th>
                </tr>
              </thead>
              <tbody>
                {mockLogs.slice(-20).reverse().map((log, index) => (
                  <tr key={index} className="border-b border-border/50 hover:bg-muted/30">
                    <td className="p-3 text-sm">
                      {log.timestamp.toLocaleDateString()} {log.timestamp.toLocaleTimeString()}
                    </td>
                    <td className="p-3 text-sm">
                      <span className="text-soil font-medium">{log.soilMoisture}%</span>
                    </td>
                    <td className="p-3 text-sm">
                      <span className="text-accent font-medium">{log.temperature}°C</span>
                    </td>
                    <td className="p-3 text-sm">
                      <span className="text-info font-medium">{log.humidity}%</span>
                    </td>
                    <td className="p-3 text-sm">
                      <Badge 
                        variant="outline" 
                        className={log.pumpStatus === "ON" ? "bg-success text-white" : ""}
                      >
                        {log.pumpStatus}
                      </Badge>
                    </td>
                    <td className="p-3 text-sm">
                      <span className="text-water font-medium">{log.waterUsage}L</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default HistoricalLogs;