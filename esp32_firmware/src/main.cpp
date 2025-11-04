#include <ArduinoJson.h>
#include <DHT.h>

// --- Configuration ---
// No WiFi needed - using USB serial communication

// Sensor Pins
#define DHTPIN 4       // Pin for DHT11 data
#define SOIL_PIN 34    // Pin for Soil Moisture sensor
#define PUMP_RELAY_PIN 5 // Pin to control the water pump relay

// Sensor Types
#define DHTTYPE DHT11

// --- Global Objects ---
DHT dht(DHTPIN, DHTTYPE);

// --- Setup Function (runs once) ---
void setup() {
  Serial.begin(115200);
  delay(1000);
  Serial.println("\n\n=== ESP32 AgroSmart - USB Serial Mode ===");
  Serial.println("Ready to send sensor data via USB serial");
  
  dht.begin();
  pinMode(PUMP_RELAY_PIN, OUTPUT);
  digitalWrite(PUMP_RELAY_PIN, LOW); // Start with pump off
  
  Serial.println("DHT11 sensor initialized");
  Serial.println("Pump relay initialized (OFF)");
  Serial.println("Waiting for commands from PC...\n");
}

// --- Main Loop (runs repeatedly) ---
void loop() {
  // 1. Read Sensor Data
  float humidity = dht.readHumidity();
  float temperature = dht.readTemperature(); // in Celsius
  int soilMoistureRaw = analogRead(SOIL_PIN);
  
  // Convert raw soil moisture to percentage (0-100%)
  // IMPORTANT: Lower raw value = WET, Higher raw value = DRY
  // Calibration values (adjust based on your sensor):
  // - When in water (very wet): ~1000-1500
  // - When completely dry: ~3500-4095
  const int WET_VALUE = 1500;   // Raw value when sensor is in water
  const int DRY_VALUE = 3500;   // Raw value when sensor is completely dry
  
  // Map: LOW raw value (wet) = HIGH moisture %, HIGH raw value (dry) = LOW moisture %
  int soilMoisturePercent = map(soilMoistureRaw, WET_VALUE, DRY_VALUE, 100, 0);
  soilMoisturePercent = constrain(soilMoisturePercent, 0, 100);

  // Check if sensor readings are valid
  if (isnan(humidity) || isnan(temperature)) {
    Serial.println("ERROR: Failed to read from DHT sensor!");
    delay(2000);
    return;
  }

  // 2. Create JSON payload with sensor data
  StaticJsonDocument<256> jsonDoc;
  jsonDoc["temperature"] = temperature;
  jsonDoc["humidity"] = humidity;
  jsonDoc["soil_moisture"] = soilMoisturePercent;
  jsonDoc["soil_moisture_raw"] = soilMoistureRaw; // For debugging/calibration

  // 3. Send JSON data via Serial (USB)
  serializeJson(jsonDoc, Serial);
  Serial.println(); // End of JSON line

  // 4. Check for commands from PC via Serial
  if (Serial.available() > 0) {
    String command = Serial.readStringUntil('\n');
    command.trim();
    
    if (command == "PUMP_ON") {
      digitalWrite(PUMP_RELAY_PIN, HIGH);
      Serial.println("ACK: Pump turned ON");
    } 
    else if (command == "PUMP_OFF") {
      digitalWrite(PUMP_RELAY_PIN, LOW);
      Serial.println("ACK: Pump turned OFF");
    }
    else if (command == "STATUS") {
      Serial.print("ACK: Pump is ");
      Serial.println(digitalRead(PUMP_RELAY_PIN) ? "ON" : "OFF");
    }
    else {
      Serial.print("ERROR: Unknown command: ");
      Serial.println(command);
    }
  }

  // Wait 5 seconds before next reading
  delay(5000);
}
