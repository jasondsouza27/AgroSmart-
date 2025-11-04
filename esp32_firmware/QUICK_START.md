# 🚀 Quick Start Guide - ESP32 to Frontend Connection

## ✅ System Status

Your ESP32 is now successfully connected and sending data!

**Bridge Server Running:** ✅
- URL: http://localhost:3001
- ESP32 COM Port: COM5
- Status: Connected
- Latest Reading: Temperature 31.6°C, Humidity 66.9%, Soil Moisture 42%

## 📡 Available API Endpoints

Test these in your browser or use in your frontend:

1. **All Data**: http://localhost:3001/api/all
2. **Sensor Data Only**: http://localhost:3001/api/sensor-data
3. **Prediction Only**: http://localhost:3001/api/prediction
4. **System Status**: http://localhost:3001/api/status

## 🎨 Integrate with Your Frontend

### Option 1: Use in Existing React Frontend

Copy `ESP32Dashboard.tsx` to your `frontend/src/components/` folder:

```bash
copy esp32_firmware\ESP32Dashboard.tsx ..\frontend\src\components\
```

Then use it in your app:

```tsx
// In your App.tsx or main component
import ESP32Dashboard from './components/ESP32Dashboard';

function App() {
  return <ESP32Dashboard />;
}
```

### Option 2: Fetch Data with Simple JavaScript

```javascript
// Fetch all data
async function fetchSensorData() {
  const response = await fetch('http://localhost:3001/api/all');
  const data = await response.json();
  console.log('Sensor Data:', data.sensor_data);
  console.log('Prediction:', data.prediction);
  console.log('Status:', data.status);
}

// Control pump
async function controlPump(action) {
  const response = await fetch(`http://localhost:3001/api/pump/${action}`, {
    method: 'POST'
  });
  const result = await response.json();
  console.log('Pump response:', result);
}

// Use it
fetchSensorData();
controlPump('ON');  // Turn pump on
controlPump('OFF'); // Turn pump off
```

### Option 3: Test with HTML (No Build Required)

Create a simple HTML file:

```html
<!DOCTYPE html>
<html>
<head>
  <title>ESP32 Sensor Dashboard</title>
  <style>
    body { font-family: Arial; padding: 20px; }
    .card { 
      border: 1px solid #ddd; 
      padding: 20px; 
      margin: 10px;
      border-radius: 8px;
    }
    .value { font-size: 2em; font-weight: bold; }
    button { 
      padding: 10px 20px; 
      margin: 5px; 
      font-size: 16px;
      cursor: pointer;
    }
  </style>
</head>
<body>
  <h1>🌱 ESP32 Sensor Dashboard</h1>
  
  <div class="card">
    <h2>Temperature</h2>
    <div class="value" id="temp">--</div>
  </div>
  
  <div class="card">
    <h2>Humidity</h2>
    <div class="value" id="humidity">--</div>
  </div>
  
  <div class="card">
    <h2>Soil Moisture</h2>
    <div class="value" id="soil">--</div>
  </div>
  
  <div class="card">
    <h2>Recommended Crop</h2>
    <div class="value" id="crop">--</div>
  </div>
  
  <div class="card">
    <h2>Pump Control</h2>
    <button onclick="controlPump('ON')">Turn ON</button>
    <button onclick="controlPump('OFF')">Turn OFF</button>
    <p>Status: <span id="pump-status">--</span></p>
  </div>

  <script>
    // Fetch data every 5 seconds
    setInterval(async () => {
      try {
        const response = await fetch('http://localhost:3001/api/all');
        const data = await response.json();
        
        document.getElementById('temp').textContent = 
          data.sensor_data.temperature.toFixed(1) + '°C';
        document.getElementById('humidity').textContent = 
          data.sensor_data.humidity.toFixed(1) + '%';
        document.getElementById('soil').textContent = 
          data.sensor_data.soil_moisture + '%';
        document.getElementById('crop').textContent = 
          data.prediction.crop;
        document.getElementById('pump-status').textContent = 
          data.status.pump;
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }, 5000);

    async function controlPump(action) {
      try {
        const response = await fetch(
          `http://localhost:3001/api/pump/${action}`, 
          { method: 'POST' }
        );
        const result = await response.json();
        alert(result.message || `Pump ${action}`);
      } catch (error) {
        alert('Error controlling pump: ' + error);
      }
    }
  </script>
</body>
</html>
```

Save this as `test_dashboard.html` and open in browser!

## 🔧 Troubleshooting

### CORS Issues in Frontend
If your React app has CORS issues, the bridge already has Flask-CORS enabled. Make sure your requests go to `http://localhost:3001` (not https).

### Prediction Server Not Running
If prediction shows "Unknown", start the prediction server:
```bash
cd C:\Users\Jason Dsouza\Desktop\crop_project
python prediction_server.py
```

### Can't Access Bridge API
Make sure the bridge is running:
```bash
python esp32_firmware/serial_to_web_bridge.py
```

### ESP32 Not Connected
Check the terminal output. If "Disconnected", try:
1. Unplug and replug ESP32 USB
2. Restart the bridge script
3. Check COM port in Device Manager

## 📊 Current Setup

```
┌─────────────┐
│   ESP32     │ Sensors: DHT11, Soil Moisture
│  (COM5)     │ Pump Relay: GPIO 5
└──────┬──────┘
       │ USB Serial (115200 baud)
       │ JSON data every 5 seconds
       ↓
┌─────────────────────────────┐
│  Serial-to-Web Bridge       │
│  (Python Flask Server)      │
│  Port: 3001                 │
└──────┬──────────────────────┘
       │ REST API
       ├─→ /api/sensor-data
       ├─→ /api/prediction
       ├─→ /api/status
       ├─→ /api/all
       └─→ /api/pump/ON|OFF
       ↓
┌─────────────────────────────┐
│  Your React Frontend        │
│  Fetch data & display       │
│  Control pump from UI       │
└─────────────────────────────┘
```

## 🎉 You're All Set!

Your ESP32 is now connected to your frontend **without WiFi**!

Next steps:
1. ✅ Bridge is running
2. ✅ ESP32 is sending data
3. ⏭️ Add the API calls to your React frontend
4. ⏭️ (Optional) Start prediction_server.py for ML predictions

**Test the API right now:**
Open in browser: http://localhost:3001/api/all
