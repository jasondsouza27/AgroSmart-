#include <DHT.h>

// Sensor Pins
#define DHTPIN 4       // Pin for DHT11 data
#define SOIL_PIN 34    // Pin for Soil Moisture sensor
#define PUMP_RELAY_PIN 5 // Pin to control the water pump relay

// Sensor Types
#define DHTTYPE DHT11

// Global Objects
DHT dht(DHTPIN, DHTTYPE);

// Variables for pump control (will be set by Python script)
bool pumpActive = false;

void setup() {
  Serial.begin(115200);
  dht.begin();
  pinMode(PUMP_RELAY_PIN, OUTPUT);
  digitalWrite(PUMP_RELAY_PIN, LOW); // Start with pump off
  
  // Wait for serial connection
  while (!Serial) {
    delay(10);
  }
  
  Serial.println("ESP32 AgroSmart - Ready");
}

void loop() {
  // Read sensor data
  float humidity = dht.readHumidity();
  float temperature = dht.readTemperature(); // in Celsius
  int soilMoistureRaw = analogRead(SOIL_PIN);
  
  // Convert raw soil moisture to percentage (0-100%)
  // Calibrate these values based on your sensor!
  int soilMoisturePercent = map(soilMoistureRaw, 4095, 1000, 0, 100);
  soilMoisturePercent = constrain(soilMoisturePercent, 0, 100);
  
  // FAKE NPK values for testing (replace with real sensor later)
  float n_value = 90.0;
  float p_value = 42.0;
  float k_value = 43.0;
  
  // Check if readings are valid
  if (isnan(humidity) || isnan(temperature)) {
    Serial.println("ERROR: Failed to read from DHT sensor!");
    delay(2000);
    return;
  }
  
  // Send data as JSON over Serial
  Serial.print("{");
  Serial.print("\"temperature\":");
  Serial.print(temperature, 1);
  Serial.print(",\"humidity\":");
  Serial.print(humidity, 1);
  Serial.print(",\"soil_moisture\":");
  Serial.print(soilMoisturePercent);
  Serial.print(",\"N\":");
  Serial.print(n_value, 1);
  Serial.print(",\"P\":");
  Serial.print(p_value, 1);
  Serial.print(",\"K\":");
  Serial.print(k_value, 1);
  Serial.println("}");
  
  // Check for pump commands from Python
  if (Serial.available() > 0) {
    String command = Serial.readStringUntil('\n');
    command.trim();
    
    if (command == "PUMP_ON") {
      digitalWrite(PUMP_RELAY_PIN, HIGH);
      pumpActive = true;
      Serial.println("ACK: Pump turned ON");
    } else if (command == "PUMP_OFF") {
      digitalWrite(PUMP_RELAY_PIN, LOW);
      pumpActive = false;
      Serial.println("ACK: Pump turned OFF");
    }
  }
  
  // Wait 5 seconds before next reading
  delay(5000);
}
