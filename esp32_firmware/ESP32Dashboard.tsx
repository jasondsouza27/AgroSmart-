// Example React Component for ESP32 Sensor Dashboard
// Add this to your frontend/src/components/ folder

import { useEffect, useState } from 'react';

interface SensorData {
  temperature: number;
  humidity: number;
  soil_moisture: number;
  timestamp: string;
}

interface Prediction {
  crop: string;
  confidence: number;
  timestamp: string;
}

interface Status {
  connection: string;
  pump: string;
}

interface AllData {
  sensor_data: SensorData;
  prediction: Prediction;
  status: Status;
}

export default function ESP32Dashboard() {
  const [data, setData] = useState<AllData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data from bridge API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/all');
        if (!response.ok) throw new Error('Failed to fetch data');
        const jsonData = await response.json();
        setData(jsonData);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    // Fetch immediately
    fetchData();

    // Then fetch every 5 seconds
    const interval = setInterval(fetchData, 5000);

    return () => clearInterval(interval);
  }, []);

  // Control pump
  const togglePump = async (action: 'ON' | 'OFF') => {
    try {
      const response = await fetch(`http://localhost:3001/api/pump/${action}`, {
        method: 'POST'
      });
      const result = await response.json();
      
      if (result.success) {
        // Update local state immediately
        if (data) {
          setData({
            ...data,
            status: { ...data.status, pump: action }
          });
        }
        console.log('Pump response:', result);
      } else {
        alert(`Failed to control pump: ${result.message}`);
      }
    } catch (err) {
      console.error('Error controlling pump:', err);
      alert('Error controlling pump. Check console for details.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading sensor data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-red-500">
          Error: {error}
          <br />
          <span className="text-sm">Make sure the bridge is running on port 3001</span>
        </div>
      </div>
    );
  }

  if (!data) {
    return <div>No data available</div>;
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <h1 className="text-4xl font-bold mb-8 text-center">
        🌱 AgroSmart ESP32 Dashboard
      </h1>

      {/* Connection Status */}
      <div className="mb-6 flex justify-between items-center bg-gray-100 p-4 rounded-lg">
        <div className="flex items-center gap-2">
          <div 
            className={`w-3 h-3 rounded-full ${
              data.status.connection === 'Connected' ? 'bg-green-500' : 'bg-red-500'
            }`}
          />
          <span className="font-medium">
            ESP32: {data.status.connection}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div 
            className={`w-3 h-3 rounded-full ${
              data.status.pump === 'ON' ? 'bg-blue-500' : 'bg-gray-400'
            }`}
          />
          <span className="font-medium">
            Pump: {data.status.pump}
          </span>
        </div>
      </div>

      {/* Sensor Data Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Temperature Card */}
        <div className="bg-gradient-to-br from-red-500 to-orange-500 text-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Temperature</p>
              <p className="text-4xl font-bold mt-2">
                {data.sensor_data.temperature.toFixed(1)}°C
              </p>
            </div>
            <div className="text-6xl opacity-30">🌡️</div>
          </div>
          <p className="text-xs opacity-75 mt-4">
            Updated: {data.sensor_data.timestamp}
          </p>
        </div>

        {/* Humidity Card */}
        <div className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Humidity</p>
              <p className="text-4xl font-bold mt-2">
                {data.sensor_data.humidity.toFixed(1)}%
              </p>
            </div>
            <div className="text-6xl opacity-30">💧</div>
          </div>
          <p className="text-xs opacity-75 mt-4">
            Updated: {data.sensor_data.timestamp}
          </p>
        </div>

        {/* Soil Moisture Card */}
        <div className="bg-gradient-to-br from-green-500 to-emerald-500 text-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Soil Moisture</p>
              <p className="text-4xl font-bold mt-2">
                {data.sensor_data.soil_moisture}%
              </p>
            </div>
            <div className="text-6xl opacity-30">🌾</div>
          </div>
          <p className="text-xs opacity-75 mt-4">
            Updated: {data.sensor_data.timestamp}
          </p>
        </div>
      </div>

      {/* Crop Prediction */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-8 rounded-xl shadow-lg mb-8">
        <h2 className="text-2xl font-bold mb-4">🎯 Recommended Crop</h2>
        {data.prediction.crop !== 'Unknown' ? (
          <>
            <p className="text-5xl font-bold mb-2">{data.prediction.crop}</p>
            <p className="text-lg opacity-90">
              Confidence: {(data.prediction.confidence * 100).toFixed(1)}%
            </p>
            <p className="text-sm opacity-75 mt-4">
              Prediction made: {data.prediction.timestamp}
            </p>
          </>
        ) : (
          <p className="text-xl opacity-90">
            Waiting for prediction... Make sure prediction_server.py is running.
          </p>
        )}
      </div>

      {/* Pump Control */}
      <div className="bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold mb-4">💦 Pump Control</h2>
        <div className="flex gap-4">
          <button
            onClick={() => togglePump('ON')}
            disabled={data.status.pump === 'ON'}
            className={`
              flex-1 py-4 px-6 rounded-lg font-bold text-lg
              transition-all duration-200
              ${data.status.pump === 'ON' 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                : 'bg-blue-500 hover:bg-blue-600 text-white active:scale-95'
              }
            `}
          >
            {data.status.pump === 'ON' ? '✓ Pump is ON' : 'Turn Pump ON'}
          </button>
          
          <button
            onClick={() => togglePump('OFF')}
            disabled={data.status.pump === 'OFF'}
            className={`
              flex-1 py-4 px-6 rounded-lg font-bold text-lg
              transition-all duration-200
              ${data.status.pump === 'OFF' 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                : 'bg-red-500 hover:bg-red-600 text-white active:scale-95'
              }
            `}
          >
            {data.status.pump === 'OFF' ? '✓ Pump is OFF' : 'Turn Pump OFF'}
          </button>
        </div>
      </div>

      {/* Debug Info */}
      <details className="mt-8 bg-gray-100 p-4 rounded-lg">
        <summary className="cursor-pointer font-bold">🔍 Debug Info</summary>
        <pre className="mt-4 text-xs overflow-auto">
          {JSON.stringify(data, null, 2)}
        </pre>
      </details>
    </div>
  );
}
