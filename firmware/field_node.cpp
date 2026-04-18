#include <WiFi.h>
#include <HTTPClient.h>
#include <Wire.h>
#include "DHT.h"
#include <ArduinoJson.h> // REQUIRED: Install "ArduinoJson" by Benoit Blanchon in Library Manager

// --- Configuration ---
const char* WIFI_SSID = "ROBONET";
const char* WIFI_PASSWORD = "blnt0077";
const char* SERVER_URL = "https://eco-shield-grid-iot.vercel.app/api/telemetry"; // Cloud endpoint via ngrok
const char* DEVICE_ID = "eco_node_cba05f72f7f8c8fd"; 
const char* API_KEY = "eco_sk_f0809266170e2fcb06ecb202e726536b";

#define DHTPIN_INTERNAL 4   // Internal Sensor Pin
#define DHTPIN_EXTERNAL 14  // External Sensor Pin
#define DHTTYPE DHT11
#define FAN_RELAY_PIN 5 

DHT dht_internal(DHTPIN_INTERNAL, DHTTYPE);
DHT dht_external(DHTPIN_EXTERNAL, DHTTYPE);

unsigned long lastSendTime = 0;
const unsigned long SEND_INTERVAL = 10000; // 10 seconds

// Dynamic Threshold Variable (Cloud-Controlled)
float currentCoolingThreshold = 25.0; 

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
  pinMode(FAN_RELAY_PIN, OUTPUT);
  digitalWrite(FAN_RELAY_PIN, LOW); // Start with fan OFF (Active LOW relay)

  dht_internal.begin();
  dht_external.begin();

  connectWiFi();
}

void loop() {
  if (millis() - lastSendTime >= SEND_INTERVAL) {
    lastSendTime = millis();

    // Read Internal Sensor
    float intTemp = dht_internal.readTemperature();
    float intHum = dht_internal.readHumidity();

    // Read External Sensor
    float extTemp = dht_external.readTemperature();
    float extHum = dht_external.readHumidity();

    if (isnan(intTemp) || isnan(intHum) || isnan(extTemp) || isnan(extHum)) {
      Serial.println("Sensor read failure! One or more DHT11s not detected.");
      return;
    }

    // --- Decision Logic using Cloud Threshold ---
    // Rule: Activate fan if internal temperature exceeds cloud setting
    bool fanActive = false;
    if (intTemp > currentCoolingThreshold) {
      digitalWrite(FAN_RELAY_PIN, HIGH); // ON
      fanActive = true;
    } else {
      digitalWrite(FAN_RELAY_PIN, LOW); // OFF
    }

    if (WiFi.status() == WL_CONNECTED) {
      HTTPClient http;
      http.begin(SERVER_URL);
      http.addHeader("Content-Type", "application/json");
      http.addHeader("x-device-id", DEVICE_ID);
      http.addHeader("x-api-key", API_KEY);

      // Construct JSON payload
      String jsonBody = "{";
      jsonBody += "\"internal_temp_c\":" + String(intTemp, 1) + ",";
      jsonBody += "\"internal_hum_pct\":" + String(intHum, 1) + ",";
      jsonBody += "\"external_temp_c\":" + String(extTemp, 1) + ",";
      jsonBody += "\"external_hum_pct\":" + String(extHum, 1) + ",";
      jsonBody += "\"fan_active\":" + String(fanActive ? "true" : "false");
      jsonBody += "}";

      int httpResponseCode = http.POST(jsonBody);
      
      // Parse Response (Two-Way Communication)
      if (httpResponseCode == 201) {
        String response = http.getString();
        JsonDocument doc;
        DeserializationError error = deserializeJson(doc, response);
        
        if (!error) {
          float serverThreshold = doc["thresholds"]["cooling"];
          if (serverThreshold > 0) {
            currentCoolingThreshold = serverThreshold;
            Serial.println("Threshold Updated from Cloud: " + String(currentCoolingThreshold));
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
