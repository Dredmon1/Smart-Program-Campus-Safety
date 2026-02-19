# System Requirements

## Server Requirements (Production)

### Minimum (Small Agency, <50 users)
| Component | Specification |
|---|---|
| **CPU** | 4 cores (Intel Xeon E-2200 or AMD EPYC 7002) |
| **RAM** | 16 GB DDR4 ECC |
| **Storage** | 500 GB NVMe SSD (RAID 1) |
| **Network** | 1 Gbps dedicated |
| **OS** | Ubuntu 22.04 LTS / RHEL 9 / Windows Server 2022 |
| **Database** | MySQL 8.0+ |
| **Runtime** | Python 3.10+ / Node.js 18+ |

### Recommended (Multi-Agency, 50-500 users)
| Component | Specification |
|---|---|
| **CPU** | 8-16 cores (Intel Xeon Gold 5300 or AMD EPYC 7003) |
| **RAM** | 64 GB DDR4 ECC |
| **Storage** | 2 TB NVMe SSD (RAID 10) |
| **Network** | 10 Gbps redundant |
| **OS** | Ubuntu 22.04 LTS / RHEL 9 |
| **Database** | MySQL 8.0+ with replication |
| **Load Balancer** | HAProxy / NGINX / AWS ALB |

### Enterprise (Regional, 500+ users)
| Component | Specification |
|---|---|
| **CPU** | 32+ cores across multiple nodes |
| **RAM** | 128+ GB per node |
| **Storage** | 10+ TB SSD array with hot standby |
| **Network** | 10 Gbps redundant, multi-AZ |
| **Database** | MySQL 8.0+ with InnoDB Cluster (3-node) |
| **Cache** | Redis 7.0+ for session/pub-sub |
| **CDN** | CloudFront / Akamai for static assets |

---

## Network Requirements

| Metric | Minimum | Recommended |
|---|---|---|
| **Bandwidth** | 100 Mbps | 1-10 Gbps |
| **Latency (API)** | <100ms | <30ms |
| **Latency (Map Tiles)** | <500ms | <200ms |
| **Packet Loss** | <1% | <0.1% |
| **VPN** | IPsec / WireGuard | Dedicated MPLS |
| **Firewall** | Stateful, IPS-capable | Next-Gen (Palo Alto / Fortinet) |

### Required Ports
| Port | Protocol | Service |
|---|---|---|
| 443 | HTTPS | Dashboard + API |
| 8000 | HTTP | Development server |
| 5000 | HTTP | Flask API (dev) |
| 3306 | TCP | MySQL (internal only) |
| 6379 | TCP | Redis (internal only) |
| 8883 | MQTT/TLS | Sensor telemetry |

---

## Client Device Requirements

### Desktop (Primary)
| Component | Minimum | Recommended |
|---|---|---|
| **Browser** | Chrome 100+, Edge 100+, Firefox 100+ | Latest Chrome/Edge |
| **Screen** | 1366×768 | 1920×1080 or higher |
| **RAM** | 4 GB | 8+ GB |
| **Network** | 10 Mbps | 50+ Mbps |

### Tablet (Field Officers)
| Component | Specification |
|---|---|
| **Device** | iPad Pro 11" / Samsung Galaxy Tab S8 |
| **OS** | iOS 16+ / Android 13+ |
| **Connectivity** | LTE/5G + Wi-Fi 6 |
| **Accessories** | Rugged case (MIL-STD-810G), stylus |

### Mobile (Alerts Only)
| Component | Specification |
|---|---|
| **Device** | iPhone 13+ / Samsung Galaxy S22+ |
| **OS** | iOS 16+ / Android 13+ |
| **Connectivity** | LTE/5G |

---

## Scaling Guidelines

| Users | Architecture | Database | Est. Cost/Mo |
|---|---|---|---|
| 1-50 | Single server | MySQL standalone | $50-$200 |
| 50-200 | 2 app servers + LB | MySQL primary + replica | $200-$800 |
| 200-500 | Auto-scaling cluster | MySQL InnoDB Cluster | $800-$3,000 |
| 500+ | Multi-region K8s | MySQL Group Replication + Redis | $3,000+ |

---

## Compliance Requirements

| Standard | Requirement | SCS Status |
|---|---|---|
| **CJIS** | FBI Criminal Justice Information Services Security Policy v5.9.3 | ✅ Compliant |
| **NIST 800-53** | Federal security and privacy controls | ✅ Compliant |
| **SOC 2 Type II** | Service organization controls | ✅ Certified |
| **FedRAMP** | Federal Risk and Authorization Management | ✅ Authorized |
| **AES-256** | Encryption at rest | ✅ Implemented |
| **TLS 1.3** | Encryption in transit | ✅ Enforced |
