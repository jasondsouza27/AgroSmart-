# AgroSmart Local Setup (No WiFi Required)

This setup allows you to run the complete AgroSmart system locally without WiFi on the ESP32.

## Architecture

```
ESP32 (USB) → Python Data Collector → Flask Server → React Dashboard
              ↓
          Weather API
```

## Setup Instructions

### 1. Install Python Dependencies

```powershell
cd C:\Users\Jason Dsouza\Desktop\crop_project
.\venv\Scripts\activate
pip install pyserial requests flask-cors
```

### 2. Get Weather API Key (Free)

1. Go to https://openweathermap.org/api
2. Sign up for free account
3. Get your API key from the dashboard
4. Update `local_data_collector.py`:
   ```python
   WEATHER_API_KEY = 'your_api_key_here'
   WEATHER_LOCATION = 'Mumbai,IN'  # Your city
   ```

### 3. Upload ESP32 Code

#### Option A: Using PlatformIO (VS Code)
1. Open the `esp32_firmware` folder in VS Code
2. Rename `src/main_serial.cpp` to `src/main.cpp` (replace the WiFi version)
3. Connect ESP32 via USB
4. Click Upload button in PlatformIO

#### Option B: Using Arduino IDE
1. Open `esp32_agrosmart_serial.ino` in Arduino IDE
2. Select Board: ESP32 Dev Module
3. Select correct COM Port
4. Click Upload

### 4. Find ESP32 COM Port

```powershell
python detect_com_port.py
```

This will show all COM ports and recommend the ESP32 port.

Update `local_data_collector.py` with the correct port:
```python
SERIAL_PORT = 'COM3'  # Use the port from detect_com_port.py
```

### 5. Start the System

#### Terminal 1: Start Flask Server
```powershell
python prediction_server.py
```

#### Terminal 2: Start Data Collector
```powershell
python local_data_collector.py
```

#### Terminal 3: Start Frontend
```powershell
cd frontend
npm run dev
```

### 6. Open Dashboard

Open browser: http://localhost:8080

## How It Works

1. **ESP32** reads sensors (DHT11, Soil Moisture) and sends data via USB Serial every 5 seconds
2. **Data Collector** (Python):
   - Reads sensor data from ESP32
   - Fetches weather data from OpenWeatherMap API
   - Combines data and sends to Flask server
   - Receives pump command and sends back to ESP32
3. **Flask Server**:
   - Makes crop prediction using ML model
   - Stores sensor history
   - Provides REST API for frontend
4. **React Dashboard**:
   - Displays real-time sensor data
   - Shows crop recommendations
   - Displays pump status
   - Shows historical charts

## Troubleshooting

### ESP32 Not Found
- Check USB cable (use data cable, not charge-only)
- Install CP210x or CH340 drivers
- Try different USB port
- Close Arduino IDE Serial Monitor

### No Weather Data
- Check API key is valid
- Check internet connection
- Script will use default rainfall value if API fails

### Serial Port Busy
- Close Arduino IDE Serial Monitor
- Close PlatformIO Serial Monitor
- Only one program can use serial port at a time

### Pump Not Responding
- Check PUMP_RELAY_PIN (GPIO 5) connection
- Verify relay module is powered
- Check serial communication is working

## Hardware Setup

### Connections
- DHT11 Data → GPIO 4
- Soil Moisture Analog → GPIO 34
- Pump Relay Control → GPIO 5
- ESP32 → PC via USB

### Required Components
- ESP32 Development Board
- DHT11 Temperature/Humidity Sensor
- Soil Moisture Sensor (Analog)
- Relay Module (for water pump)
- Water Pump
- USB Cable (data cable)

## File Structure

```
crop_project/
├── local_data_collector.py    # Main data collection script
├── detect_com_port.py          # Helper to find COM port
├── prediction_server.py        # Flask ML server
├── esp32_firmware/            # ESP32 code
│   └── src/
│       └── main_serial.cpp    # Serial communication version
├── frontend/                  # React dashboard
└── requirements.txt
```

## Next Steps

- Calibrate soil moisture sensor values
- Add real NPK sensor readings
- Add more crop types to the model
- Implement irrigation scheduling
- Add data logging to database
