import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

interface ChartDataPoint {
  time: string;
  soilMoisture: number;
  temperature: number;
  humidity: number;
}

interface DataChartProps {
  data: ChartDataPoint[];
  title: string;
}

export function DataChart({ data, title }: DataChartProps) {
  return (
    <Card className="shadow-soft hover:shadow-medium transition-all duration-300">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {title}
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis 
              dataKey="time" 
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                boxShadow: 'var(--shadow-soft)'
              }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="soilMoisture" 
              stroke="hsl(var(--soil))" 
              strokeWidth={2}
              name="Soil Moisture (%)"
              dot={{ fill: 'hsl(var(--soil))', strokeWidth: 2, r: 4 }}
            />
            <Line 
              type="monotone" 
              dataKey="temperature" 
              stroke="hsl(var(--accent))" 
              strokeWidth={2}
              name="Temperature (°C)"
              dot={{ fill: 'hsl(var(--accent))', strokeWidth: 2, r: 4 }}
            />
            <Line 
              type="monotone" 
              dataKey="humidity" 
              stroke="hsl(var(--water))" 
              strokeWidth={2}
              name="Humidity (%)"
              dot={{ fill: 'hsl(var(--water))', strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}