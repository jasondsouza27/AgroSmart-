#include <ArduinoJson.h>
#include <DHT.h>

// --- Configuration ---
// No WiFi needed - using USB serial communication

// Sensor Pins
#define DHTPIN 15      // Pin for DHT11 data (GPIO 15 is more reliable than GPIO 4)
#define SOIL_PIN 34    // Pin for Capacitive Soil Moisture sensor (analog)
#define PUMP_RELAY_PIN 5 // Pin to control the water pump relay

// Sensor Types
#define DHTTYPE DHT11

// --- Global Objects ---
DHT dht(DHTPIN, DHTTYPE);

// Control mode: true = automatic, false = manual
bool autoMode = false;  // Start in MANUAL mode for testing
unsigned long manualModeTimeout = 0;
const unsigned long MANUAL_TIMEOUT = 300000; // 5 minutes in milliseconds

// --- Setup Function (runs once) ---
void setup() {
  Serial.begin(115200);
  delay(1000);
  Serial.println("\n\n=== ESP32 AgroSmart - USB Serial Mode ===");
  Serial.println("Ready to send sensor data via USB serial");
  
  // Initialize DHT sensor with delay
  dht.begin();
  delay(2000); // Give DHT11 time to stabilize (important!)
  
  pinMode(PUMP_RELAY_PIN, OUTPUT);
  digitalWrite(PUMP_RELAY_PIN, LOW); // LOW = OFF (for ACTIVE-HIGH relay that needs HIGH to trigger)
  
  Serial.println("DHT11 sensor initialized");
  Serial.println("Pump relay initialized (OFF)");
  Serial.println("Note: Relay using ACTIVE-HIGH logic: HIGH = ON, LOW = OFF");
  Serial.println("Testing relay: Will blink 3 times - LISTEN FOR CLICKS...");
  
  // Test relay by blinking 3 times
  for (int i = 0; i < 3; i++) {
    digitalWrite(PUMP_RELAY_PIN, HIGH);  // Turn ON (active-HIGH)
    delay(500);
    digitalWrite(PUMP_RELAY_PIN, LOW); // Turn OFF (active-HIGH)
    delay(500);
  }
  Serial.println("Relay test complete");
  Serial.println("Waiting for commands from PC...\n");
}

// --- Main Loop (runs repeatedly) ---
void loop() {
  // 1. Read Sensor Data
  // Add small delay before reading DHT
  delay(100);
  float humidity = dht.readHumidity();
  float temperature = dht.readTemperature(); // in Celsius
  
  int soilMoistureRaw = analogRead(SOIL_PIN);
  
  // Convert raw soil moisture to percentage (0-100%)
  // FLIPPED LOGIC: Your sensor reads LOWER values (~2800-3000) in DRY conditions
  // and HIGHER values when actually wet
  // This means: LOW raw = DRY, HIGH raw = WET (opposite of typical capacitive sensor)
  const int DRY_VALUE = 2800;   // Raw value when sensor is in dry soil
  const int WET_VALUE = 4095;   // Raw value when sensor is in wet soil/water
  
  int soilMoisturePercent;
  
  // Map: LOW raw value (dry) = LOW moisture %, HIGH raw value (wet) = HIGH moisture %
  // map(value, fromLow, fromHigh, toLow, toHigh)
  // When raw=2800 (dry), we want 0%
  // When raw=4095 (wet), we want 100%
  soilMoisturePercent = map(soilMoistureRaw, DRY_VALUE, WET_VALUE, 0, 100);
  soilMoisturePercent = constrain(soilMoisturePercent, 0, 100);
  
  // If sensor reads very low value, might be disconnected or extremely dry
  // Use a stable simulated value instead of fluctuating
  if (soilMoistureRaw <= 2700 || soilMoistureRaw >= 4090) {
    soilMoisturePercent = 35;  // Stable simulated value (slightly dry, will trigger pump)
    Serial.println("WARNING: Soil moisture sensor reading unusual (possibly disconnected)");
    Serial.println("Check wiring: VCC→3.3V, AOUT→GPIO34, GND→GND");
    Serial.println("Using stable simulated value: 35%");
  }

  // Check if sensor readings are valid
  // If DHT sensor fails, use mock data for demo/testing
  if (isnan(humidity) || isnan(temperature)) {
    Serial.println("Warning: DHT sensor not connected. Using demo data.");
    Serial.println("Connect DHT11 sensor for real readings:");
    Serial.println("  - DHT11 VCC  → ESP32 3.3V");
    Serial.println("  - DHT11 DATA → ESP32 GPIO 15");
    Serial.println("  - DHT11 GND  → ESP32 GND");
    
    // Use mock sensor values for demo
    temperature = 28.5 + (random(-20, 20) / 10.0); // 26.5°C - 30.5°C
    humidity = 65.0 + (random(-10, 10) / 10.0);    // 64% - 66%
    Serial.println("Using demo sensor values");
  }

  // 2. Create JSON payload with sensor data
  StaticJsonDocument<256> jsonDoc;
  jsonDoc["temperature"] = temperature;
  jsonDoc["humidity"] = humidity;
  jsonDoc["soil_moisture"] = soilMoisturePercent;
  jsonDoc["soil_moisture_raw"] = soilMoistureRaw; // For debugging/calibration
  
  // NPK values - using reasonable defaults for now (NPK sensor is expensive)
  // In production, these would come from an NPK sensor
  // These represent moderate soil nutrient levels suitable for most crops
  jsonDoc["N"] = 40;  // Nitrogen (mg/kg) - moderate level
  jsonDoc["P"] = 30;  // Phosphorus (mg/kg) - moderate level
  jsonDoc["K"] = 35;  // Potassium (mg/kg) - moderate level
  jsonDoc["rainfall"] = 0;  // Rainfall (mm) - can be updated from weather API

  // Print debug info for soil moisture calibration
  Serial.print("DEBUG: Soil Moisture Raw=");
  Serial.print(soilMoistureRaw);
  Serial.print(" Percent=");
  Serial.println(soilMoisturePercent);

  // Automatic pump control based on soil moisture
  // Trigger pump if soil moisture is below 40%
  String pumpCommand = "PUMP_OFF";
  
  // Check if manual mode has timed out (auto-return to automatic mode after 5 minutes)
  // Only if we're in manual mode AND timeout is set (not 0)
  if (!autoMode && manualModeTimeout > 0 && millis() > manualModeTimeout) {
    autoMode = true;
    manualModeTimeout = 0; // Reset timeout
    Serial.println("INFO: Returning to automatic mode after 5 minute timeout");
  }
  
  if (autoMode) {
    // Automatic control - ACTIVE-HIGH relay (HIGH=ON, LOW=OFF)
    if (soilMoisturePercent < 40) {
      digitalWrite(PUMP_RELAY_PIN, HIGH);  // Turn pump ON (active-HIGH)
      pumpCommand = "PUMP_ON";
      Serial.println("AUTO: Pump activated (soil moisture < 40%)");
    } else {
      digitalWrite(PUMP_RELAY_PIN, LOW);   // Turn pump OFF (active-HIGH)
      pumpCommand = "PUMP_OFF";
    }
  }
  // If in manual mode, don't change pump state automatically
  // Current pump state is maintained from last manual command
  else {
    // Manual mode - read current state (active-HIGH: HIGH=ON, LOW=OFF)
    pumpCommand = (digitalRead(PUMP_RELAY_PIN) == HIGH) ? "PUMP_ON" : "PUMP_OFF";
  }
  
  // Add pump command to JSON for backend tracking
  jsonDoc["pump_command"] = pumpCommand;

  // 3. Send JSON data via Serial (USB)
  serializeJson(jsonDoc, Serial);
  Serial.println(); // End of JSON line

  // 4. Check for commands from PC via Serial
  if (Serial.available() > 0) {
    String command = Serial.readStringUntil('\n');
    command.trim();
    
    // Manual commands - ACTIVE-HIGH relay (HIGH=ON, LOW=OFF)
    if (command == "PUMP_ON") {
      autoMode = false;
      manualModeTimeout = millis() + MANUAL_TIMEOUT;
      digitalWrite(PUMP_RELAY_PIN, HIGH);  // Turn pump ON (active-HIGH)
      Serial.println("ACK: Pump turned ON (manual mode)");
    } 
    else if (command == "PUMP_OFF") {
      autoMode = false;
      manualModeTimeout = millis() + MANUAL_TIMEOUT;
      digitalWrite(PUMP_RELAY_PIN, LOW);   // Turn pump OFF (active-HIGH)
      Serial.println("ACK: Pump turned OFF (manual mode)");
    }
    else if (command == "AUTO_MODE") {
      autoMode = true;
      manualModeTimeout = 0;  // Clear manual mode timeout
      Serial.println("ACK: Switched to automatic mode");
    }
    else if (command == "STATUS") {
      Serial.print("ACK: Pump is ");
      Serial.print((digitalRead(PUMP_RELAY_PIN) == HIGH) ? "ON" : "OFF");
      Serial.print(", Mode: ");
      Serial.println(autoMode ? "AUTO" : "MANUAL");
    }
    else {
      Serial.print("ERROR: Unknown command: ");
      Serial.println(command);
    }
  }

  // Wait 5 seconds before next reading
  delay(5000);
}
