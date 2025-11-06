import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Download, Filter, Calendar, Loader2, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { DataChart } from "@/components/dashboard/DataChart";
import { useQuery } from "@tanstack/react-query";
import { getSensorHistory } from "@/lib/api";
import { useState } from "react";

const formatChartData = (logs: any[]) => {
  if (!logs || logs.length === 0) return [];
  
  // Take last 24 entries for the chart
  return logs.slice(-24).map((log) => ({
    time: new Date(log.timestamp).toLocaleString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    }),
    soilMoisture: log.soil_moisture || 0,
    temperature: log.temperature || 0,
    humidity: log.humidity || 0,
  }));
};

export function HistoricalLogs() {
  const navigate = useNavigate();
  const [dataLimit, setDataLimit] = useState(168); // Last 7 days (hourly readings)

  // Fetch sensor history from backend with auto-refresh
  const { data: sensorHistory, isLoading, error, refetch } = useQuery({
    queryKey: ['sensorHistory', dataLimit],
    queryFn: () => getSensorHistory(dataLimit),
    refetchInterval: 30000, // Refresh every 30 seconds
    staleTime: 10000, // Consider data stale after 10 seconds
  });

  const logs = sensorHistory || [];

  const getTotalWaterUsage = () => {
    if (!logs.length) return 0;
    return logs.reduce((sum: number, log: any) => sum + (log.water_usage || 0), 0);
  };

  const getAverageValues = () => {
    if (!logs.length) return { soilMoisture: 0, temperature: 0, humidity: 0 };
    
    const total = logs.length;
    return {
      soilMoisture: Math.round(logs.reduce((sum: number, log: any) => sum + (log.soil_moisture || 0), 0) / total),
      temperature: Math.round(logs.reduce((sum: number, log: any) => sum + (log.temperature || 0), 0) / total),
      humidity: Math.round(logs.reduce((sum: number, log: any) => sum + (log.humidity || 0), 0) / total),
    };
  };

  const exportToCSV = () => {
    if (!logs.length) return;
    
    const csvHeaders = "Timestamp,Soil Moisture (%),Temperature (°C),Humidity (%),Pump Status,Water Usage (L)\n";
    const csvRows = logs.map((log: any) => 
      `${new Date(log.timestamp).toLocaleString()},${log.soil_moisture || 0},${log.temperature || 0},${log.humidity || 0},${log.pump_status || 'OFF'},${log.water_usage || 0}`
    ).join('\n');
    
    const csvContent = csvHeaders + csvRows;
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `sensor_history_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const averages = getAverageValues();
  const chartData = formatChartData(logs);

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
              Real-time sensor data and irrigation history
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="border-primary/20 hover:bg-primary/10"
            onClick={() => setDataLimit(dataLimit === 168 ? 720 : 168)}
          >
            <Filter className="h-4 w-4 mr-2" />
            {dataLimit === 168 ? '7 Days' : '30 Days'}
          </Button>
          <Button 
            variant="outline" 
            className="border-primary/20 hover:bg-primary/10"
            onClick={exportToCSV}
            disabled={!logs.length}
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading sensor history...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <Card className="border-destructive/50 bg-destructive/5">
          <CardContent className="flex items-center gap-3 py-6">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <div>
              <p className="font-medium text-destructive">Failed to load sensor history</p>
              <p className="text-sm text-muted-foreground">Please check if the backend server is running.</p>
            </div>
            <Button variant="outline" onClick={() => refetch()} className="ml-auto">
              Retry
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Data Display */}
      {!isLoading && !error && (
        <>
          {logs.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Calendar className="h-12 w-12 text-muted-foreground mb-3" />
                <p className="text-lg font-medium">No sensor data available yet</p>
                <p className="text-sm text-muted-foreground">Data will appear once the ESP32 starts sending readings</p>
              </CardContent>
            </Card>
          ) : (
            <>
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
                    <p className="text-xs text-muted-foreground mt-1">Last {dataLimit === 168 ? '7' : '30'} days</p>
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
                    <p className="text-xs text-success mt-1">
                      {averages.soilMoisture > 60 ? 'Optimal range' : 'Needs attention'}
                    </p>
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
                    Detailed Activity Logs (Last 20 entries)
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
                        {logs.slice(-20).reverse().map((log: any, index: number) => (
                          <tr key={index} className="border-b border-border/50 hover:bg-muted/30">
                            <td className="p-3 text-sm">
                              {new Date(log.timestamp).toLocaleDateString()} {new Date(log.timestamp).toLocaleTimeString()}
                            </td>
                            <td className="p-3 text-sm">
                              <span className="text-soil font-medium">{log.soil_moisture || 0}%</span>
                            </td>
                            <td className="p-3 text-sm">
                              <span className="text-accent font-medium">{log.temperature || 0}°C</span>
                            </td>
                            <td className="p-3 text-sm">
                              <span className="text-info font-medium">{log.humidity || 0}%</span>
                            </td>
                            <td className="p-3 text-sm">
                              <Badge 
                                variant="outline" 
                                className={log.pump_status === "ON" ? "bg-success text-white" : ""}
                              >
                                {log.pump_status || 'OFF'}
                              </Badge>
                            </td>
                            <td className="p-3 text-sm">
                              <span className="text-water font-medium">{log.water_usage || 0}L</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </>
      )}
    </div>
  );
}

export default HistoricalLogs;