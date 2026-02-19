# 🛡️ SoCal-SMART | Campus Safety Optimization

**Unified Command & Ecosystem Dashboard for Southern California Campus Safety**

> *One Region. Zero Latency.*

The SoCal-SMART (Southern California — Security, Monitoring, Analytics & Response Technology) Program integrates **Los Angeles**, the **Inland Empire**, and **San Diego** into a single unified command dashboard. Leveraging real-time sensor networks, AI-driven threat analysis, and predictive intelligence, it delivers **Information When It's Needed (IWIN)** across jurisdictional boundaries.

---

## 🚀 Features

- **Interactive Command Map** — Powered by [Leaflet.js](https://leafletjs.com/) with real-time unit positioning, heatmaps, and facility overlays (hospitals & fire stations)
- **Breach Simulation Engine** — Randomized multi-region threat scenarios with animated marker tracking and live event feeds
- **Three Product Pillars:**
  - 🟡 **SMART-Shield** — Sensor & logistics layer (thermal/motion detection, anomaly AI)
  - 🟣 **IWIN Tactical Suite** — Law enforcement response & dispatch integration
  - 🟢 **Horizon API** — Predictive intelligence with 72-hour incident forecasting
- **Bundle Packages** — Regional Starter, Full Spectrum, and Enterprise Command bundles with tiered savings
- **Analytics Dashboard** — Regional radar charts, latency monitoring, and response-time analytics via [Chart.js](https://www.chartjs.org/)
- **Live Mode** — Real-time random event spawning with audio alerts
- **KPI Counters** — Animated performance indicators (uptime, latency, active units, threat level)
- **PDF Export** — One-click situation report generation via jsPDF
- **Dark/Light Theme** — Full theme toggle with adaptive chart colors
- **Responsive Design** — Mobile-friendly with hamburger navigation

### 🔐 Security Features

- **Two-Factor Authentication (2FA)** — OTP modal enforced for all roles at login
- **Role-Based Access Control (RBAC)** — UI element visibility and functionality restricted by role (Commander, Analyst, Field Officer, Observer)
- **Password Strength Meter** — Real-time 4-bar strength indicator (Weak / Fair / Strong / Very Strong) below the password field
- **Account Lockout** — 3 failed CAPTCHA/login attempts triggers a 60-second lockout with live countdown
- **Admin Override** — Commanders and IT Administrators can clear lockouts via override code `SCS-OVERRIDE-2026` or the Admin Security Panel
- **CAPTCHA Simulation** — Math-based CAPTCHA required before login to prevent automated access
- **Session Fingerprinting** — Browser, OS, screen resolution, language, and timezone logged to the audit trail
- **Encryption Indicator** — Animated nav bar badge showing AES-256 / TLS 1.3 encryption status
- **CSP Badge** — Content Security Policy compliance indicator in footer (click for policy details)
- **Privacy Policy & Terms** — Full privacy modal accessible from login screen and footer
- **XSS Prevention** — `sanitizeInput()` function strips HTML entities from all incident form submissions
- **Admin Security Panel** — Commanders and IT Administrators can view/clear lockouts, purge session/local data

### 📊 Operational Features

- **Real-Time Clock** — Live date/time display in the navigation bar
- **Daily Briefing Modal** — Randomized morning intel briefing with threat level, active units, and key items
- **User Profile Modal** — Session details, role info, fingerprint data, and admin panel access
- **Data Persistence** — Audit log and incident data saved to `localStorage` and restored on reload
- **Print-Friendly Dashboard** — CSS print stylesheet for clean printouts; "Print Dashboard" button in footer
- **Heatmap Legend & Time Filtering** — Color-graded legend with time-range selection
- **Trend Forecasting** — 6-month incident forecast using linear regression
- **Session Timer & Auto-Logout** — Configurable session timeout with visual countdown
- **Real-time WebSocket Simulation** — Streaming event feed with random incident generation

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| **HTML5** | Page structure & semantic layout |
| **CSS3** | Custom styling with CSS variables, animations & glassmorphism |
| **JavaScript (ES6+)** | Application logic, state management & interactivity |
| **Python / Flask** | REST API backend with MySQL integration |
| **MySQL 8.0** | Relational database (incidents, units, users, audit log) |
| **Docker** | Containerized deployment (dashboard + API + MySQL) |
| **Leaflet.js** | Interactive mapping with tile layers & marker animations |
| **Chart.js** | Data visualization (radar, bar, doughnut, line charts) |
| **jsPDF** | Client-side PDF report generation |
| **Phosphor Icons** | Icon system |
| **Google Fonts (Inter)** | Typography |

---

## 📂 Project Structure

```
IST4910/
├── SMART Program Campus Safety Optimization.html   # Main dashboard
├── smart-app.js                                     # Core application logic
├── smart-styles.css                                 # Stylesheet & design system
├── api_server.py                                    # Flask REST API (MySQL + fallback)
├── run_dashboard.py                                 # Local dev server
├── requirements.txt                                 # Python dependencies
├── Dockerfile                                       # Docker image definition
├── docker-compose.yml                               # Multi-service (dashboard + API + MySQL)
├── db/
│   └── schema.sql                                   # MySQL schema (7 tables + seed data)
├── tests/
│   ├── test_api.py                                  # Python API unit tests
│   └── test_security.js                             # JS security function tests
├── docs/
│   ├── DEPLOYMENT_GUIDE.md                          # Local, Docker & cloud deployment
│   ├── SYSTEM_REQUIREMENTS.md                       # Hardware & software specs
│   ├── NETWORK_ARCHITECTURE.md                      # Network topology & diagrams
│   ├── SENSOR_INTEGRATION.md                        # Sensor hardware specs & protocols
│   ├── COMPARISON_MATRIX.md                         # Competitive analysis
│   └── DEMO_SCRIPT.md                               # 15-min presentation script
├── LICENSE                                          # MIT License
└── README.md                                        # This file
```

---

## ⚡ Getting Started

### Option 1: Static Dashboard (Simplest)
```bash
git clone https://github.com/Dredmon1/Smart-Program-Campus-Safety.git
cd Smart-Program-Campus-Safety
python run_dashboard.py
```

### Option 2: Dashboard + Flask API
```bash
pip install -r requirements.txt
python api_server.py        # Terminal 1 → http://localhost:5000
python run_dashboard.py     # Terminal 2 → http://localhost:8000
```

### Option 3: Docker (Full Stack with MySQL)
```bash
docker-compose up -d --build
# Dashboard: http://localhost:8000
# API:       http://localhost:5000/api/health
# MySQL:     localhost:3306
```

### Login
- Fill in name, email, badge number, agency, and role
- Solve the CAPTCHA and click **"Access Command Deck"**
- Complete 2FA verification

4. **Run via Local Server (Recommended):**
   - We've included a script to avoid browser security restrictions (CORS) with local files.
   - Run `python run_dashboard.py` in your terminal.
   - The dashboard will open automatically at `http://localhost:8000`.

---

## 🎮 Usage Guide

| Action | How |
|---|---|
| **Switch Regions** | Use the region selector buttons (LA / Inland Empire / San Diego) |
| **Run Simulation** | Click **"Run Breach Drill"** to trigger a randomized threat scenario |
| **Toggle Layers** | Show/hide hospitals, fire stations, and heatmap overlays on the map |
| **View Products** | Click on any pillar card to see pricing tiers and features |
| **Enable Live Mode** | Toggle live mode for continuous random event generation |
| **Export Report** | Click **"Export PDF"** to generate a situation report |
| **Dark Mode** | Click the moon/sun icon in the navigation bar |

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 👤 Author

**Derek Redmon**  
California State University, San Bernardino  
IST 4910 — Senior Project

---

<p align="center">
  <em>Built with ❤️ for campus safety innovation</em>
</p>
