"""
ESP32 Serial to Web Bridge
Reads sensor data from ESP32 via USB serial and provides it to the web frontend
Includes offline ML prediction using joblib model
"""
import serial
import serial.tools.list_ports
import json
import time
import joblib
import pandas as pd
from flask import Flask, jsonify
from flask_cors import CORS
from threading import Thread
import sys
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend access

# Configuration
ESP32_BAUD_RATE = 115200
AUTO_DETECT_PORT = True  # Set to False to manually specify COM port
MANUAL_COM_PORT = "COM5"  # Used if AUTO_DETECT_PORT is False

# Load ML Model
MODEL_PATH = os.path.join(os.path.dirname(__file__), '..', 'crop_recommendation_model.joblib')
print("Loading ML model...")
try:
    ml_model = joblib.load(MODEL_PATH)
    print("✓ ML Model loaded successfully")
except FileNotFoundError:
    print(f"❌ Model file not found at: {MODEL_PATH}")
    ml_model = None
except Exception as e:
    print(f"❌ Error loading model: {e}")
    ml_model = None

# Global variables to store latest data
latest_sensor_data = {
    "temperature": 0,
    "humidity": 0,
    "soil_moisture": 0,
    "timestamp": ""
}

latest_prediction = {
    "crop": "Unknown",
    "confidence": 0,
    "timestamp": ""
}

pump_status = "OFF"
connection_status = "Disconnected"


def find_esp32_port():
    """Automatically detect ESP32 COM port"""
    ports = serial.tools.list_ports.comports()
    for port in ports:
        # ESP32 usually shows as "USB Serial" or contains "CP210" or "CH340"
        if any(x in port.description.upper() for x in ['USB', 'SERIAL', 'CP210', 'CH340', 'UART']):
            print(f"✓ Found potential ESP32 on {port.device}: {port.description}")
            return port.device
    return None


def read_esp32_serial(ser):
    """Read and parse JSON data from ESP32"""
    global latest_sensor_data, latest_prediction, connection_status
    
    print("📡 Starting to read from ESP32...")
    
    while True:
        try:
            if ser.in_waiting > 0:
                line = ser.readline().decode('utf-8').strip()
                
                # Skip empty lines and non-JSON lines
                if not line or not line.startswith('{'):
                    if line and not line.startswith('='):  # Print ESP32 messages
                        print(f"ESP32: {line}")
                    continue
                
                # Parse JSON data
                try:
                    sensor_data = json.loads(line)
                    
                    # Validate required fields
                    if all(key in sensor_data for key in ['temperature', 'humidity', 'soil_moisture']):
                        latest_sensor_data = sensor_data
                        latest_sensor_data['timestamp'] = time.strftime('%Y-%m-%d %H:%M:%S')
                        connection_status = "Connected"
                        
                        print(f"📊 Sensor Data: T={sensor_data['temperature']}°C, "
                              f"H={sensor_data['humidity']}%, "
                              f"SM={sensor_data['soil_moisture']}%")
                        
                        # Send to prediction server
                        get_crop_prediction(sensor_data)
                    
                except json.JSONDecodeError as e:
                    print(f"⚠️  JSON parse error: {e}")
                    
        except serial.SerialException as e:
            print(f"❌ Serial error: {e}")
            connection_status = "Disconnected"
            time.sleep(2)
            
        except Exception as e:
            print(f"❌ Unexpected error: {e}")
            time.sleep(1)


def get_crop_prediction(sensor_data):
    """Predict crop using local ML model (offline)"""
    global latest_prediction
    
    if ml_model is None:
        print("⚠️  ML Model not loaded")
        latest_prediction = {
            "crop": "Model not loaded",
            "confidence": 0,
            "timestamp": time.strftime('%Y-%m-%d %H:%M:%S')
        }
        return
    
    try:
        # Prepare features for ML model
        # Model expects: ['N', 'P', 'K', 'temperature', 'humidity', 'rainfall']
        features = {
            "N": 50,  # Default Nitrogen value (can be adjusted)
            "P": 50,  # Default Phosphorus value
            "K": 50,  # Default Potassium value
            "temperature": sensor_data['temperature'],
            "humidity": sensor_data['humidity'],
            "rainfall": 100  # Default rainfall value
        }
        
        # Create DataFrame with correct column order
        feature_columns = ['N', 'P', 'K', 'temperature', 'humidity', 'rainfall']
        df = pd.DataFrame([features], columns=feature_columns)
        
        # Make prediction
        crop_prediction = ml_model.predict(df)[0]
        
        # Update latest prediction
        latest_prediction = {
            "crop": crop_prediction,
            "confidence": 85,  # Placeholder confidence value
            "timestamp": time.strftime('%Y-%m-%d %H:%M:%S')
        }
        
        print(f"🌱 Predicted Crop: {crop_prediction}")
        
    except Exception as e:
        print(f"❌ Prediction error: {e}")
        latest_prediction = {
            "crop": "Error",
            "confidence": 0,
            "timestamp": time.strftime('%Y-%m-%d %H:%M:%S')
        }


# Flask API endpoints for frontend
@app.route('/api/sensor-data', methods=['GET'])
def get_sensor_data():
    """Get latest sensor data"""
    return jsonify(latest_sensor_data)


@app.route('/api/prediction', methods=['GET'])
def get_prediction():
    """Get latest crop prediction"""
    return jsonify(latest_prediction)


@app.route('/api/status', methods=['GET'])
def get_status():
    """Get system status"""
    return jsonify({
        "connection": connection_status,
        "pump": pump_status,
        "timestamp": time.strftime('%Y-%m-%d %H:%M:%S')
    })


@app.route('/api/pump/<action>', methods=['POST'])
def control_pump(action):
    """Control water pump (ON/OFF)"""
    global pump_status
    
    try:
        if action.upper() in ['ON', 'OFF']:
            command = f"PUMP_{action.upper()}\n"
            ser.write(command.encode())
            
            # Wait for acknowledgment
            time.sleep(0.5)
            response = ser.readline().decode('utf-8').strip()
            
            if "ACK" in response:
                pump_status = action.upper()
                return jsonify({"success": True, "status": pump_status, "message": response})
            else:
                return jsonify({"success": False, "message": response}), 400
        else:
            return jsonify({"success": False, "message": "Invalid action. Use ON or OFF"}), 400
            
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500


@app.route('/api/all', methods=['GET'])
def get_all_data():
    """Get all data in one request"""
    return jsonify({
        "sensor_data": latest_sensor_data,
        "prediction": latest_prediction,
        "status": {
            "connection": connection_status,
            "pump": pump_status
        }
    })


def main():
    """Main function"""
    global ser
    
    print("=" * 50)
    print("  ESP32 Serial to Web Bridge")
    print("=" * 50)
    
    # 1. Detect COM port
    if AUTO_DETECT_PORT:
        com_port = find_esp32_port()
        if not com_port:
            print("\n❌ Could not auto-detect ESP32.")
            print("📝 Available ports:")
            for port in serial.tools.list_ports.comports():
                print(f"   - {port.device}: {port.description}")
            print(f"\n💡 Set AUTO_DETECT_PORT=False and specify MANUAL_COM_PORT in the script")
            return
    else:
        com_port = MANUAL_COM_PORT
    
    print(f"\n✓ Using COM port: {com_port}")
    
    # 2. Connect to ESP32
    try:
        ser = serial.Serial(com_port, ESP32_BAUD_RATE, timeout=1)
        print(f"✓ Connected to ESP32 at {ESP32_BAUD_RATE} baud")
        time.sleep(2)  # Wait for ESP32 to reset
    except serial.SerialException as e:
        print(f"❌ Failed to connect to {com_port}: {e}")
        return
    
    # 3. Start serial reading thread
    serial_thread = Thread(target=read_esp32_serial, args=(ser,), daemon=True)
    serial_thread.start()
    print("✓ Serial reading thread started")
    
    # 4. Start Flask API server
    print("\n" + "=" * 50)
    print("  🌐 Web API Server")
    print("=" * 50)
    print("  Sensor Data:  http://localhost:3001/api/sensor-data")
    print("  Prediction:   http://localhost:3001/api/prediction")
    print("  Status:       http://localhost:3001/api/status")
    print("  All Data:     http://localhost:3001/api/all")
    print("  Pump Control: http://localhost:3001/api/pump/ON or /OFF")
    print("=" * 50)
    print("\n✓ Frontend can now fetch data from these endpoints")
    print("✓ Press Ctrl+C to stop\n")
    
    try:
        app.run(host='0.0.0.0', port=3001, debug=False)
    except KeyboardInterrupt:
        print("\n\n🛑 Shutting down...")
        ser.close()
        print("✓ Serial port closed")


if __name__ == "__main__":
    main()
