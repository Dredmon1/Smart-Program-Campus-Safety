# Network Architecture

## Overview

The SoCal-SMART Command System uses a multi-tier architecture with sensor networks feeding into a cloud-based platform that serves real-time dashboards to field operators and command centers.

## Architecture Diagram

```mermaid
graph TD
    subgraph Field["FIELD LAYER"]
        S1["Thermal Cameras<br/>FLIR A700"]
        S2["ALPR Cameras<br/>Genetec AutoVu"]
        S3["Motion Sensors<br/>Bosch ISC-BPR2"]
        S4["Body-Worn Cameras<br/>Axon Body 3"]
        S5["GPS Units<br/>Vehicle MDTs"]
        S6["Gunshot Detection<br/>ShotSpotter"]
    end

    subgraph Edge["EDGE GATEWAY LAYER"]
        GW1["IoT Gateway<br/>Dell Edge 3000"]
        GW2["Mobile Gateway<br/>Cradlepoint R1900"]
    end

    subgraph Network["NETWORK LAYER"]
        VPN["IPsec VPN Tunnel<br/>AES-256 Encrypted"]
        LTE["FirstNet LTE/5G<br/>Band 14 Priority"]
        MPLS["MPLS Private Circuit<br/>10 Gbps Redundant"]
    end

    subgraph Cloud["CLOUD PLATFORM"]
        LB["Load Balancer<br/>AWS ALB / NGINX"]
        API["API Cluster<br/>Flask on ECS Fargate"]
        WS["WebSocket Server<br/>Real-time Events"]
        DB["MySQL 8.0<br/>RDS Multi-AZ"]
        CACHE["Redis Cache<br/>Session + Pub/Sub"]
        S3["Static Assets<br/>S3 + CloudFront CDN"]
    end

    subgraph Users["END USERS"]
        CMD["Command Center<br/>Desktop Dashboard"]
        FLD["Field Officers<br/>Tablet / MDT"]
        MOB["Mobile Alerts<br/>Push Notifications"]
        EXT["External Agencies<br/>API Consumers"]
    end

    S1 & S2 & S3 --> GW1
    S4 & S5 & S6 --> GW2
    GW1 --> VPN
    GW2 --> LTE
    VPN & LTE & MPLS --> LB
    LB --> API
    LB --> WS
    API --> DB
    API --> CACHE
    WS --> CACHE
    S3 --> CMD
    API --> CMD & FLD & MOB
    WS --> CMD & FLD
    API --> EXT
```

## Data Flow

```mermaid
sequenceDiagram
    participant Sensor
    participant Gateway
    participant API
    participant Database
    participant Dashboard

    Sensor->>Gateway: Telemetry (MQTT/TLS)
    Gateway->>API: POST /api/events (HTTPS)
    API->>Database: INSERT event
    API->>Dashboard: WebSocket push
    Dashboard->>API: GET /api/incidents
    API->>Database: SELECT incidents
    Database-->>API: Result set
    API-->>Dashboard: JSON response
```

## Security Zones

```mermaid
graph LR
    subgraph Public["PUBLIC ZONE"]
        CDN["CloudFront CDN"]
        WAF["AWS WAF"]
    end

    subgraph DMZ["DMZ"]
        LB["Load Balancer"]
        PROXY["Reverse Proxy<br/>NGINX"]
    end

    subgraph Private["PRIVATE ZONE"]
        APP["Application Servers"]
        WS["WebSocket Servers"]
    end

    subgraph Data["DATA ZONE"]
        DB["MySQL Primary"]
        REPLICA["MySQL Replica"]
        REDIS["Redis Cache"]
        BACKUP["Encrypted Backups<br/>S3 Glacier"]
    end

    CDN --> WAF --> LB --> PROXY --> APP & WS
    APP --> DB & REDIS
    DB --> REPLICA
    DB --> BACKUP
```

## Network Specifications

| Segment | Protocol | Encryption | Bandwidth |
|---|---|---|---|
| Sensor → Gateway | MQTT over TLS 1.3 | AES-256 | 10-100 Mbps |
| Gateway → Cloud | IPsec VPN / FirstNet LTE | AES-256-GCM | 100 Mbps - 1 Gbps |
| API ↔ Database | MySQL TLS | AES-256 | Internal (10 Gbps) |
| Cloud → Dashboard | HTTPS / WSS | TLS 1.3 | 50+ Mbps per user |
| Inter-Agency | MPLS / SD-WAN | MACsec 256-bit | Dedicated 1-10 Gbps |

## Redundancy & Failover

| Component | Primary | Failover | RTO |
|---|---|---|---|
| API Servers | ECS Fargate (2+ tasks) | Auto-scaling | <30 seconds |
| Database | RDS Multi-AZ Primary | Automatic failover to standby | <60 seconds |
| Load Balancer | AWS ALB (multi-AZ) | Cross-region failover | <30 seconds |
| DNS | Route 53 health checks | Automatic DNS failover | <60 seconds |
| VPN | Primary IPsec tunnel | Secondary tunnel + LTE fallback | <10 seconds |
