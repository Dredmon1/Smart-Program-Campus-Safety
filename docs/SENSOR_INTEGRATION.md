# Sensor Integration Specifications

## Supported Sensor Types

### 1. Thermal Imaging Cameras
| Specification | Details |
|---|---|
| **Recommended Model** | FLIR A700 / A500 |
| **Resolution** | 640×480 (A700), 464×348 (A500) |
| **Temperature Range** | -20°C to 2000°C |
| **Frame Rate** | 30 fps |
| **Interface** | GigE Vision, RTSP over Ethernet |
| **Power** | PoE+ (802.3at) or 24V DC |
| **Protocol** | ONVIF Profile S, RTSP |
| **Data Rate** | ~15 Mbps per camera (H.264) |
| **Use Case** | Perimeter intrusion, fire detection, crowd density |

**Integration:**
```
Camera → PoE Switch → Edge Gateway → RTSP stream to cloud
                                    → MQTT alert on anomaly detection
```

### 2. Automatic License Plate Recognition (ALPR)
| Specification | Details |
|---|---|
| **Recommended Model** | Genetec AutoVu SharpX |
| **Capture Speed** | Up to 200 km/h |
| **Accuracy** | 99.2%+ (day), 97.5%+ (night) |
| **IR Illumination** | 850nm LED array |
| **Storage** | Local buffer 100K plates |
| **Interface** | REST API, MQTT |
| **Data Rate** | ~500 KB per plate read (image + metadata) |
| **Use Case** | Stolen vehicle detection, Amber Alert, traffic analysis |

**Integration:**
```json
{
  "event": "plate_read",
  "plate": "7ABC123",
  "state": "CA",
  "confidence": 99.4,
  "timestamp": "2026-02-19T14:30:00Z",
  "location": {"lat": 34.0522, "lng": -118.2437},
  "camera_id": "ALPR-LA-042",
  "image_url": "https://scs-storage/plates/2026/02/19/7ABC123.jpg"
}
```

### 3. Body-Worn Cameras (BWC)
| Specification | Details |
|---|---|
| **Recommended Model** | Axon Body 3 |
| **Resolution** | 1080p @ 30fps |
| **Battery Life** | 12 hours continuous |
| **Storage** | 64 GB onboard, auto-upload via Wi-Fi |
| **GPS** | Integrated, 1-second updates |
| **Interface** | Axon Evidence API (REST) |
| **Data Rate** | ~5 GB per 8-hour shift |
| **Use Case** | Evidence collection, officer accountability, incident documentation |

**Integration:**
```
BWC → (local storage) → Wi-Fi docking station → Axon Evidence Cloud
                                                → SCS API webhook on tag/bookmark
```

### 4. Motion / Intrusion Sensors
| Specification | Details |
|---|---|
| **Recommended Model** | Bosch ISC-BPR2-WP12 (Blue Line Gen2) |
| **Detection Range** | 12m × 12m |
| **Technology** | Dual PIR + microwave |
| **False Alarm Rate** | <0.1% (pet immune up to 45kg) |
| **Power** | 9-15V DC, 25mA |
| **Interface** | Dry contact relay → IoT gateway (Zigbee/Z-Wave) |
| **Data Rate** | ~100 bytes per event |
| **Use Case** | Perimeter security, building entry detection |

**Integration:**
```
Sensor → Relay → IoT Hub (Zigbee) → Edge Gateway → MQTT → SCS API
```

### 5. Gunshot Detection
| Specification | Details |
|---|---|
| **Recommended Model** | ShotSpotter (SoundThinking) |
| **Detection Range** | 2+ square miles per sensor cluster |
| **Accuracy** | 97% detection, 80%+ location accuracy |
| **Response Time** | <60 seconds from shot to alert |
| **Interface** | REST API webhook |
| **Data Rate** | ~2 KB per event |
| **Use Case** | Real-time gunfire alerts, unit dispatch |

**Integration:**
```json
{
  "event": "gunshot_detected",
  "rounds": 3,
  "confidence": 97.2,
  "timestamp": "2026-02-19T14:35:00Z",
  "location": {"lat": 33.9425, "lng": -118.2551},
  "radius_meters": 25,
  "sensor_cluster": "LA-SOUTH-07"
}
```

### 6. Vehicle GPS / MDT (Mobile Data Terminal)
| Specification | Details |
|---|---|
| **Recommended Model** | Cradlepoint R1900 5G Router + Panasonic Toughbook |
| **GPS Accuracy** | ±2.5 meters (WAAS-corrected) |
| **Update Rate** | 1-5 second intervals |
| **Connectivity** | FirstNet LTE Band 14, 5G, Wi-Fi 6 |
| **Interface** | REST API, MQTT |
| **Data Rate** | ~500 bytes per position update |
| **Use Case** | Unit tracking, dispatch, zone-based alerts |

---

## Communication Protocols

| Protocol | Use Case | Port | Security |
|---|---|---|---|
| **MQTT** | Sensor telemetry (motion, GPS) | 8883 (TLS) | TLS 1.3 + client certs |
| **RTSP** | Video streaming (thermal, ALPR) | 554/8554 | SRTP (encrypted RTP) |
| **REST/HTTPS** | API calls, webhooks | 443 | TLS 1.3 |
| **WebSocket** | Real-time dashboard updates | 443 (WSS) | TLS 1.3 |
| **ONVIF** | Camera discovery & configuration | 80/443 | WS-Security |

## Data Throughput Calculations

| Sensor Type | Units | Data/Unit/Day | Total/Day |
|---|---|---|---|
| Thermal Cameras | 50 | 1.6 TB (video) | 80 TB |
| ALPR | 30 | 200 MB (plates) | 6 GB |
| BWC | 200 | 5 GB (video) | 1 TB |
| Motion Sensors | 500 | 500 KB (events) | 250 MB |
| Gunshot | 10 clusters | 50 KB (events) | 500 KB |
| GPS/MDT | 100 | 50 MB (positions) | 5 GB |

> **Note**: Video storage is the primary driver. Edge processing (AI inference at the gateway) can reduce cloud upload to alerts + 30-second clips, reducing thermal camera data by ~95%.

## Installation Requirements

| Sensor | Mounting | Power | Network | Weather Rating |
|---|---|---|---|---|
| Thermal Camera | Pole/wall, 3-5m height | PoE+ (30W) | Cat6 or fiber | IP67 |
| ALPR | Overhead gantry or pole | PoE+ (30W) | Cat6 or LTE | IP67 |
| BWC | Officer's chest | Internal battery | Wi-Fi (docking) | IP67 |
| Motion Sensor | Wall mount, 2.1m height | 12V DC | Zigbee/Z-Wave | IP54 |
| Gunshot Array | Rooftop/pole, 10m+ | Solar + battery | LTE cellular | IP66 |
| GPS/MDT | Vehicle dash mount | Vehicle 12V | LTE/5G | Indoor |
