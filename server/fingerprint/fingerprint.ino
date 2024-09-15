#include <Adafruit_Fingerprint.h>
#include <HardwareSerial.h>
#include <WiFi.h>
#include <HTTPClient.h>

#define SSID "Drogo"
#define PASS "75982466703"
#define SERVER_URL "http://192.168.1.8:2399/get-fingerprint"

HardwareSerial mySerial(2);
Adafruit_Fingerprint finger = Adafruit_Fingerprint(&mySerial);

void setup() {
  Serial.begin(115200);
  mySerial.begin(57600, SERIAL_8N1, 16, 17);
  
  // Inicializa o sensor
  finger.begin(57600);

  // Verifica se o sensor está funcionando
  if (finger.verifyPassword()) {
    Serial.println("Fingerprint sensor initialized successfully!");
  } else {
    Serial.println("Couldn't find fingerprint sensor");
    while (1) { delay(1); }
  }
  
  // Conecta ao Wi-Fi
  WiFi.begin(SSID, PASS);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("Connected to WiFi!");
}

void loop() {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("WiFi Disconnected");
    WiFi.reconnect();
    return;
  }
  
  Serial.println("Place your finger on the sensor...");
  
  uint8_t p = finger.getImage();
  if (p != FINGERPRINT_OK) {
    Serial.println("Error capturing image");
    return;
  }

  p = finger.image2Tz();
  if (p != FINGERPRINT_OK) {
    Serial.println("Error converting image");
    return;
  }

  Serial.println("Image captured and converted successfully!");

  // Inicia a conexão HTTP
  WiFiClient client;
  HTTPClient http;
  
  http.begin(client, SERVER_URL);
  http.addHeader("Content-Type", "application/json");
  
  // Envia os dados da impressão digital
  String fingerprintData = "";
  for (uint8_t i = 0; i < 512; i++) {
    fingerprintData += String(finger.fingerID, HEX);
  }

  String payload = "{\"fingerprintData\":\"" + fingerprintData + "\"}";
  int httpResponseCode = http.POST(payload);
  
  if (httpResponseCode > 0) {
    Serial.printf("HTTP Response code: %d\n", httpResponseCode);
    String response = http.getString();
    Serial.println("Response: " + response);
  } else {
    Serial.printf("Error: %s\n", http.errorToString(httpResponseCode).c_str());
  }
  
  http.end();
  
  delay(10000); // Espera 10 segundos antes do próximo loop
}
