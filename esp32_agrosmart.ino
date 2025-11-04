#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <DHT.h>

// --- Configuration ---
const char* ssid = "AB's Mob";
const char* password = "Aryanb@05";

// Replace with your PC's local IP address
const char* serverUrl = "http://192.168.84.30:5000/predict";

// Sensor Pins
#define DHTPIN 4       // Pin for DHT11 data
#define SOIL_PIN 34    // Pin for Soil Moisture sensor
#define PUMP_RELAY_PIN 5 // Pin to control the water pump relay

// Sensor Types
#define DHTTYPE DHT11

// --- Global Objects ---
DHT dht(DHTPIN, DHTTYPE);
HTTPClient http;

// --- Setup Function (runs once) ---
void setup() {
  Serial.begin(115200);
  dht.begin();
  pinMode(PUMP_RELAY_PIN, OUTPUT);
  digitalWrite(PUMP_RELAY_PIN, LOW); // Start with pump off

  // Connect to Wi-Fi
  Serial.print("Connecting to ");
  Serial.println(ssid);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi connected!");
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());
}

// --- Main Loop (runs repeatedly) ---
void loop() {
  // 1. Read Sensor Data
  float humidity = dht.readHumidity();
  float temperature = dht.readTemperature(); // in Celsius
  int soilMoistureRaw = analogRead(SOIL_PIN);
  
  // Convert raw soil moisture to percentage (0-100%)
  // This mapping depends on your sensor. You MUST calibrate this!
  // For now, let's assume 4095 is dry and 1000 is wet.
  int soilMoisturePercent = map(soilMoistureRaw, 4095, 1000, 0, 100);

  // FAKE SENSOR/API DATA (for testing)
  // In your final version, you would read the NPK sensor
  // and make a real API call to a weather service.
  float n_value = 90.0;
  float p_value = 42.0;
  float k_value = 43.0;
  float rainfall = 202.9;

  // 2. Create JSON Payload
  StaticJsonDocument<256> jsonDoc;
  jsonDoc["N"] = n_value;
  jsonDoc["P"] = p_value;
  jsonDoc["K"] = k_value;
  jsonDoc["temperature"] = temperature;
  jsonDoc["humidity"] = humidity;
  jsonDoc["rainfall"] = rainfall;
  jsonDoc["soil_moisture"] = soilMoisturePercent; // Send this for pump logic

  String jsonString;
  serializeJson(jsonDoc, jsonString);

  // 3. Send Data to PC Server
  http.begin(serverUrl);
  http.addHeader("Content-Type", "application/json");

  Serial.println("Sending data to server...");
  Serial.println(jsonString);
  
  int httpResponseCode = http.POST(jsonString);

  // 4. Handle Response
  if (httpResponseCode > 0) {
    String response = http.getString();
    Serial.print("HTTP Response code: ");
    Serial.println(httpResponseCode);
    Serial.println(response);

    // Parse the response JSON
    StaticJsonDocument<128> responseDoc;
    deserializeJson(responseDoc, response);
    const char* pumpCommand = responseDoc["pump_command"];

    // 5. Control the Pump
    if (strcmp(pumpCommand, "PUMP_ON") == 0) {
      Serial.println("Turning pump ON");
      digitalWrite(PUMP_RELAY_PIN, HIGH);
    } else {
      Serial.println("Turning pump OFF");
      digitalWrite(PUMP_RELAY_PIN, LOW);
    }
    
  } else {
    Serial.print("Error on sending POST: ");
    Serial.println(httpResponseCode);
  }

  http.end();

  // Wait for 30 seconds before sending data again
  delay(30000); 
}
