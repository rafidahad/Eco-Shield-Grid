#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h> // REQUIRED: Install "ArduinoJson" by Benoit Blanchon in Library Manager

// --- Configuration ---
const char* WIFI_SSID = "EcoShield";
const char* WIFI_PASSWORD = "ecoshield";
const char* SERVER_URL = "https://eco-shield-grid-iot.vercel.app/api/telemetry"; // Cloud endpoint via ngrok
const char* DEVICE_ID = "eco_node_e4ed5c9f34d025ad";
const char* API_KEY = "eco_sk_bb9d4e00be33fe868611c4d3b59cb438";

#define PUMP_RELAY_PIN 5
#define MQ135_PIN 34       
#define SOIL_PIN 35        

unsigned long lastSendTime = 0;
const unsigned long SEND_INTERVAL = 10000; // 10 seconds

// Dynamic Threshold Variable (Cloud-Controlled)
int currentIrrigationThreshold = 30; // Default 30%

void connectWiFi() {
  Serial.print("Connecting to WiFi");
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi Connected!");
}

void setup() {
  Serial.begin(115200);
  pinMode(PUMP_RELAY_PIN, OUTPUT);
  digitalWrite(PUMP_RELAY_PIN, HIGH); // Start with pump OFF (Active LOW relay)

  connectWiFi();
}

void loop() {
  if (millis() - lastSendTime >= SEND_INTERVAL) {
    lastSendTime = millis();

    int gasLevel = analogRead(MQ135_PIN); 
    
    int soilRaw = analogRead(SOIL_PIN);
    // Map raw analog reading to percentage (Assumes 4095 is dry, 0 is wet)
    int soilPercent = map(soilRaw, 4095, 0, 0, 100); 
    if(soilPercent < 0) soilPercent = 0;
    if(soilPercent > 100) soilPercent = 100;

    // --- Decision Logic using Cloud Threshold ---
    bool pumpActive = false;
    if (soilPercent < currentIrrigationThreshold) {
      digitalWrite(PUMP_RELAY_PIN, LOW); // ON
      pumpActive = true;
    } else {
      digitalWrite(PUMP_RELAY_PIN, HIGH); // OFF
    }

    if (WiFi.status() == WL_CONNECTED) {
      HTTPClient http;
      http.begin(SERVER_URL);
      http.addHeader("Content-Type", "application/json");
      http.addHeader("x-device-id", DEVICE_ID);
      http.addHeader("x-api-key", API_KEY);

      // Construct JSON payload
      String jsonBody = "{";
      jsonBody += "\"air_quality_ppm\":" + String(gasLevel) + ",";
      jsonBody += "\"soil_moisture_percent\":" + String(soilPercent) + ",";
      jsonBody += "\"pump_active\":" + String(pumpActive ? "true" : "false");
      jsonBody += "}";

      int httpResponseCode = http.POST(jsonBody);
      
      // Parse Response (Two-Way Communication)
      if (httpResponseCode == 201) {
        String response = http.getString();
        JsonDocument doc;
        DeserializationError error = deserializeJson(doc, response);
        
        if (!error) {
          int serverThreshold = doc["thresholds"]["irrigation"];
          if (serverThreshold > 0) {
            currentIrrigationThreshold = serverThreshold;
            Serial.println("Threshold Updated from Cloud: " + String(currentIrrigationThreshold) + "%");
          }
        }
      } else {
        Serial.print("Error sending telemetry: ");
        Serial.println(httpResponseCode);
      }
      http.end();
    } else {
      connectWiFi();
    }
  }
}