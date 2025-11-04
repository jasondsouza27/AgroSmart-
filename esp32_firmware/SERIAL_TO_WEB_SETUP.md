# ESP32 to Frontend Integration Guide

## 🎯 System Architecture

```
ESP32 (USB Serial) → Python Bridge → Web API → React Frontend
                          ↓
                    ML Prediction Server
```

## 📋 Prerequisites

1. **ESP32 Firmware**: Already uploaded (USB serial mode)
2. **Python**: Version 3.8+
3. **Node.js**: For React frontend
4. **Required Python packages**:
   - pyserial
   - Flask
   - Flask-CORS
   - requests
   - scikit-learn
   - joblib

## 🚀 Quick Start

### Step 1: Install Python Dependencies

```bash
cd C:\Users\Jason Dsouza\Desktop\crop_project
pip install pyserial Flask Flask-CORS requests scikit-learn joblib
```

### Step 2: Start the ML Prediction Server

```bash
python prediction_server.py
```

This should start on `http://localhost:5000`

### Step 3: Upload ESP32 Firmware (if not done)

```bash
cd esp32_firmware
platformio run --target upload --upload-port COM5
```

### Step 4: Start the Serial-to-Web Bridge

```bash
python esp32_firmware/serial_to_web_bridge.py
```

This will:
- Auto-detect ESP32 COM port
- Read sensor data from ESP32 via USB
- Provide API endpoints on `http://localhost:3001`

### Step 5: Update Frontend to Use Local API

In your React frontend, update the API base URL to:
```javascript
const API_BASE_URL = "http://localhost:3001/api"
```

Then start the frontend:
```bash
cd frontend
npm run dev
```

## 🔌 API Endpoints

The bridge provides these endpoints for your frontend:

### GET `/api/sensor-data`
Returns latest sensor readings:
```json
{
  "temperature": 25.5,
  "humidity": 60,
  "soil_moisture": 45,
  "timestamp": "2025-11-04 15:30:00"
}
```

### GET `/api/prediction`
Returns latest crop prediction:
```json
{
  "crop": "Rice",
  "confidence": 0.95,
  "timestamp": "2025-11-04 15:30:00"
}
```

### GET `/api/status`
Returns system status:
```json
{
  "connection": "Connected",
  "pump": "OFF",
  "timestamp": "2025-11-04 15:30:00"
}
```

### GET `/api/all`
Returns all data in one request:
```json
{
  "sensor_data": { ... },
  "prediction": { ... },
  "status": { ... }
}
```

### POST `/api/pump/ON` or `/api/pump/OFF`
Control the water pump:
```json
{
  "success": true,
  "status": "ON",
  "message": "ACK: Pump turned ON"
}
```

## 🎨 Frontend Integration Example

```javascript
// In your React component
import { useEffect, useState } from 'react';

function SensorDashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    // Fetch data every 5 seconds
    const interval = setInterval(async () => {
      try {
        const response = await fetch('http://localhost:3001/api/all');
        const jsonData = await response.json();
        setData(jsonData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Control pump
  const togglePump = async (action) => {
    try {
      const response = await fetch(`http://localhost:3001/api/pump/${action}`, {
        method: 'POST'
      });
      const result = await response.json();
      console.log('Pump response:', result);
    } catch (error) {
      console.error('Error controlling pump:', error);
    }
  };

  return (
    <div>
      <h1>Sensor Data</h1>
      {data && (
        <>
          <p>Temperature: {data.sensor_data.temperature}°C</p>
          <p>Humidity: {data.sensor_data.humidity}%</p>
          <p>Soil Moisture: {data.sensor_data.soil_moisture}%</p>
          <p>Recommended Crop: {data.prediction.crop}</p>
          <button onClick={() => togglePump('ON')}>Turn Pump ON</button>
          <button onClick={() => togglePump('OFF')}>Turn Pump OFF</button>
        </>
      )}
    </div>
  );
}
```

## 🔧 Troubleshooting

### COM Port Issues
- If auto-detection fails, set `AUTO_DETECT_PORT = False` in `serial_to_web_bridge.py`
- Manually specify `MANUAL_COM_PORT = "COM5"` (or your COM port)

### CORS Issues
- The bridge includes Flask-CORS to allow frontend access
- Make sure your frontend is making requests to `http://localhost:3001`

### Prediction Server Not Running
- Ensure `prediction_server.py` is running on port 5000
- Check that the model file `crop_recommendation_model.joblib` exists

### Serial Connection Lost
- Check that ESP32 is connected via USB
- Try unplugging and replugging the ESP32
- Restart the bridge script

## 📊 Data Flow

1. **ESP32** reads sensors every 5 seconds
2. **ESP32** sends JSON via USB Serial (115200 baud)
3. **Bridge** receives data and stores it
4. **Bridge** sends data to ML prediction server
5. **Bridge** exposes data via REST API
6. **Frontend** fetches data via HTTP requests
7. **Frontend** displays data and controls pump

## 🎉 Benefits

✅ No WiFi needed - USB connection is stable and fast
✅ Real-time data updates
✅ Pump control from web interface
✅ ML predictions integrated
✅ Easy to debug and monitor

## 📝 Next Steps

1. Customize sensor calibration values
2. Add more NPK sensors if needed
3. Implement data logging to database
4. Add historical data charts
5. Deploy frontend to production
