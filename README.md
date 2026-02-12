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

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| **HTML5** | Page structure & semantic layout |
| **CSS3** | Custom styling with CSS variables, animations & glassmorphism |
| **JavaScript (ES6+)** | Application logic, state management & interactivity |
| **Leaflet.js** | Interactive mapping with tile layers & marker animations |
| **Chart.js** | Data visualization (radar, bar, doughnut, line charts) |
| **jsPDF** | Client-side PDF report generation |
| **Phosphor Icons** | Icon system |
| **Google Fonts (Inter)** | Typography |

---

## 📂 Project Structure

```
IST4910/
├── SMART Program Campus Safety Optimization.html   # Main dashboard (production)
├── SMART Program Campus Safety Optimization.py     # Standalone prototype version
├── smart-app.js                                     # Core application logic
├── smart-styles.css                                 # Stylesheet & design system
├── .gitignore                                       # Git ignore rules
├── LICENSE                                          # MIT License
└── README.md                                        # This file
```

---

## ⚡ Getting Started

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Dredmon1/IST4910.git
   cd IST4910
   ```

2. **Open the dashboard:**
   - Open `SMART Program Campus Safety Optimization.html` in a modern web browser
   - No build tools or server required — it's a static web application

3. **Login:**
   - Select a role (Command, Analyst, or Field Officer)
   - Click **"Access Command Deck"** to enter the dashboard

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
