"""
Local Data Collector for AgroSmart
Reads sensor data from ESP32 via USB serial and fetches weather from API
Sends combined data to the Flask prediction server
"""

import serial
import json
import requests
import time
from datetime import datetime

# Configuration
SERIAL_PORT = 'COM5'  # Change this to your ESP32 port (COM3, COM4, etc. on Windows)
BAUD_RATE = 115200
WEATHER_API_KEY = '3d0f470cb64243c0b4494926250411'  # WeatherAPI.com key
WEATHER_LOCATION = 'Mumbai,IN'  # Change to your location
FLASK_SERVER_URL = 'http://localhost:5000/predict'

# Weather API endpoint (using weatherapi.com instead of openweathermap)
WEATHER_API_URL = f'http://api.weatherapi.com/v1/current.json?key={WEATHER_API_KEY}&q={WEATHER_LOCATION}'

def get_weather_data():
    """
    Fetch current weather data from WeatherAPI.com
    Returns rainfall (or 0 if no rain)
    """
    try:
        response = requests.get(WEATHER_API_URL, timeout=5)
        response.raise_for_status()
        data = response.json()
        
        # Extract rainfall (mm in last hour from WeatherAPI.com)
        rainfall = data.get('current', {}).get('precip_mm', 0)
        
        # If no rainfall data, use a default based on weather conditions
        if rainfall == 0:
            condition_text = data.get('current', {}).get('condition', {}).get('text', '').lower()
            if any(word in condition_text for word in ['rain', 'drizzle', 'shower']):
                rainfall = 5  # Assume 5mm if raining but no measurement
        
        weather_desc = data.get('current', {}).get('condition', {}).get('text', 'unknown')
        print(f"Weather: {weather_desc}")
        print(f"Rainfall: {rainfall} mm")
        
        return rainfall
    except Exception as e:
        print(f"Error fetching weather data: {e}")
        # Return default rainfall value
        return 200  # mm (default for testing)

def read_esp32_data(ser):
    """
    Read JSON data from ESP32 via serial
    """
    try:
        line = ser.readline().decode('utf-8').strip()
        
        # Skip non-JSON lines (like "ESP32 AgroSmart - Ready" or ACK messages)
        if not line.startswith('{'):
            return None
        
        # Parse JSON
        data = json.loads(line)
        return data
    except json.JSONDecodeError:
        print(f"Invalid JSON: {line}")
        return None
    except Exception as e:
        print(f"Error reading serial data: {e}")
        return None

def send_pump_command(ser, command):
    """
    Send pump command to ESP32
    """
    try:
        ser.write(f"{command}\n".encode('utf-8'))
        print(f"Sent command to ESP32: {command}")
    except Exception as e:
        print(f"Error sending command: {e}")

def send_to_flask(data):
    """
    Send combined data to Flask prediction server
    """
    try:
        response = requests.post(FLASK_SERVER_URL, json=data, timeout=5)
        response.raise_for_status()
        result = response.json()
        
        print(f"✓ Prediction: {result.get('recommended_crop', 'N/A')}")
        print(f"✓ Pump Command: {result.get('pump_command', 'N/A')}")
        
        return result
    except Exception as e:
        print(f"Error sending to Flask: {e}")
        return None

def main():
    """
    Main loop: Read ESP32, fetch weather, send to Flask, control pump
    """
    print("=" * 60)
    print("AgroSmart Local Data Collector")
    print("=" * 60)
    print(f"Connecting to ESP32 on {SERIAL_PORT}...")
    
    try:
        # Open serial connection
        ser = serial.Serial(SERIAL_PORT, BAUD_RATE, timeout=1)
        time.sleep(2)  # Wait for connection to stabilize
        print("✓ Connected to ESP32")
        
        print("\nStarting data collection loop...")
        print("Press Ctrl+C to stop\n")
        
        while True:
            # Read sensor data from ESP32
            esp32_data = read_esp32_data(ser)
            
            if esp32_data is None:
                continue
            
            print(f"\n[{datetime.now().strftime('%H:%M:%S')}] ESP32 Data Received:")
            print(f"  Temperature: {esp32_data.get('temperature', 0)}°C")
            print(f"  Humidity: {esp32_data.get('humidity', 0)}%")
            print(f"  Soil Moisture: {esp32_data.get('soil_moisture', 0)}%")
            print(f"  N: {esp32_data.get('N', 0)}, P: {esp32_data.get('P', 0)}, K: {esp32_data.get('K', 0)}")
            
            # Fetch weather data
            rainfall = get_weather_data()
            
            # Combine data
            combined_data = {
                'N': esp32_data.get('N', 90),
                'P': esp32_data.get('P', 42),
                'K': esp32_data.get('K', 43),
                'temperature': esp32_data.get('temperature', 25),
                'humidity': esp32_data.get('humidity', 60),
                'rainfall': rainfall,
                'soil_moisture': esp32_data.get('soil_moisture', 50)
            }
            
            # Send to Flask server
            result = send_to_flask(combined_data)
            
            if result:
                # Send pump command back to ESP32
                pump_command = result.get('pump_command', 'PUMP_OFF')
                send_pump_command(ser, pump_command)
            
            print("-" * 60)
            
            # Wait before next reading (ESP32 sends every 5 seconds)
            time.sleep(1)
            
    except serial.SerialException as e:
        print(f"\n❌ Serial connection error: {e}")
        print(f"\nTroubleshooting:")
        print(f"1. Check if ESP32 is connected via USB")
        print(f"2. Verify the correct COM port (use Device Manager on Windows)")
        print(f"3. Close Arduino IDE Serial Monitor if open")
        print(f"4. Try a different USB cable or port")
    except KeyboardInterrupt:
        print("\n\nStopping data collector...")
    except Exception as e:
        print(f"\n❌ Unexpected error: {e}")
    finally:
        if 'ser' in locals() and ser.is_open:
            ser.close()
            print("✓ Serial connection closed")

if __name__ == '__main__':
    main()
