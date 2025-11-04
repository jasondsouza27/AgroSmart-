# ESP32 AgroSmart Firmware

This folder contains the ESP32 firmware for the AgroSmart project.

## Hardware Requirements
- ESP32 Development Board
- DHT11 Temperature & Humidity Sensor
- Soil Moisture Sensor
- Water Pump with Relay Module

## Pin Configuration
- **DHT11 Data Pin**: GPIO 4
- **Soil Moisture Sensor**: GPIO 34 (ADC)
- **Pump Relay**: GPIO 5

## Setup Instructions

### 1. Install PlatformIO
PlatformIO IDE extension should already be installed in VS Code.

### 2. Update Configuration
Edit `src/main.cpp` and update:
- WiFi SSID and Password
- Server URL (your PC's IP address)

### 3. Build the Project
- Click the PlatformIO icon in the left sidebar
- Click "Build" or use the checkmark icon in the bottom toolbar

### 4. Upload to ESP32
- Connect your ESP32 via USB
- Click "Upload" or use the arrow icon in the bottom toolbar

### 5. Monitor Serial Output
- Click "Serial Monitor" or use the plug icon in the bottom toolbar
- Baud rate: 115200

## Libraries Used
- WiFi (built-in)
- HTTPClient (built-in)
- ArduinoJson (v7.2.0)
- DHT sensor library (v1.4.6)
- Adafruit Unified Sensor (v1.1.14)

## How It Works
1. Reads temperature, humidity, and soil moisture from sensors
2. Sends data as JSON to the Python prediction server
3. Receives crop recommendation and pump command
4. Controls the water pump based on server response
5. Repeats every 30 seconds
