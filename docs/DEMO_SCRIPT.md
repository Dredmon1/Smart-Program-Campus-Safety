# Demo Script — 15-Minute Presentation

## Pre-Demo Setup
1. Open `http://localhost:8000` in Chrome (full-screen)
2. Clear browser cache (Ctrl+Shift+R)
3. Have API server running: `python api_server.py`
4. Keep these tabs ready: GitHub repo, this script

---

## Part 1: Introduction (2 min)

**[SLIDE: Login Screen]**

> "Good [morning/afternoon]. I'm Derek Redmon, presenting my IST 4910 Senior Project — the SoCal-SMART Command System, or SCS."

> "SCS is a unified command dashboard that integrates four Southern California regions — Los Angeles, Orange County, the Inland Empire, and San Diego — into a single real-time intelligence platform."

**Key Talking Points:**
- Problem: Fragmented agency systems, slow cross-jurisdiction coordination
- Solution: One dashboard, zero latency, predictive intelligence
- Built with: HTML5, CSS3, JavaScript, Flask, MySQL, Leaflet.js, Chart.js

---

## Part 2: Security Features (3 min)

**[ACTION: Show password strength meter — type in password field]**

> "Before we even log in, notice the security layers. The password strength meter provides real-time feedback. There's a CAPTCHA verification to prevent automated access."

**[ACTION: Enter wrong CAPTCHA 3 times to trigger lockout]**

> "After three failed attempts, the account locks for 60 seconds. Administrators can override with a master code — SCS-OVERRIDE-2026."

**[ACTION: Enter correct CAPTCHA and log in as Commander]**

> "On login, multi-factor authentication is enforced for all roles. The system fingerprints the session — browser, OS, screen resolution — and logs it to the audit trail."

**[ACTION: Point out encryption indicator in nav bar]**

> "The green lock badge confirms AES-256 encryption with TLS 1.3 is active."

---

## Part 3: Command Dashboard (3 min)

**[ACTION: Dismiss daily briefing (or walk through it)]**

> "Officers receive a randomized daily intel briefing showing threat level, active units, and key incidents."

**[ACTION: Show the interactive map]**

> "The command map displays real-time unit positions across all four regions. We can toggle layers — hospitals, fire stations, heatmaps."

**[ACTION: Click region buttons (LA → IE → SD)]**

> "Switching regions instantly recenters the map and updates all analytics."

**[ACTION: Click 'Run Breach Drill']**

> "The breach simulation engine generates randomized threat scenarios with animated tracking and live event feeds."

**[ACTION: Point to KPI counters]**

> "KPI counters show system uptime, API latency, active units, and threat level — all animated in real-time."

---

## Part 4: Products & Services (2 min)

**[ACTION: Click on each pillar card]**

> "SCS offers five product pillars:"
> 1. "**SMART-Shield** — Sensor and logistics layer for ports and critical infrastructure, starting at $7 per node per month."
> 2. "**IWIN Tactical Suite** — Law enforcement tablet-based response system with digital twins, starting at $45 per seat."
> 3. "**Horizon API** — Predictive intelligence API for urban planners and insurance actuaries."
> 4. "**CyberGuard SOC** — Managed security operations for agencies without in-house teams."
> 5. "**TrainForce Academy** — Online training and certification platform."

---

## Part 5: Analytics & Reporting (2 min)

**[ACTION: Scroll to charts section]**

> "The analytics dashboard includes ROI projections, response time comparisons, and a 6-month incident trend forecast using linear regression."

**[ACTION: Click 'Export Enhanced PDF']**

> "One-click PDF export generates a multi-page situation report with charts, KPIs, and a dashboard screenshot."

**[ACTION: Open audit log from footer]**

> "Every action is logged in the audit trail — searchable, exportable, and persisted in localStorage."

---

## Part 6: Architecture & Technical (2 min)

**[ACTION: Scroll to architecture diagram and hover over nodes]**

> "The architecture diagram shows our three-pillar design — Shield, IWIN, and Horizon — with interactive node highlighting."

**[ACTION: Show API documentation section]**

> "SCS provides a full REST API with documented endpoints for incidents, units, stats, and health checks."

**[ACTION: Show the Flask API in another tab — http://localhost:5000/api/health]**

> "The Flask backend is running now — here's the live health check response."

---

## Part 7: Q&A Preparation (1 min)

**Common Questions & Answers:**

| Question | Answer |
|---|---|
| "Is this using real data?" | "The dashboard uses simulated data for demonstration. In production, it connects to MySQL and sensor feeds." |
| "How does it handle security?" | "CJIS-compliant with AES-256 encryption, MFA, RBAC, session fingerprinting, account lockout, and XSS prevention." |
| "What's the tech stack?" | "HTML5/CSS3/JS frontend, Flask backend, MySQL database, Leaflet.js for mapping, Chart.js for analytics." |
| "Can it scale?" | "Yes — the architecture supports single-server to multi-region Kubernetes deployments." |
| "How is this different from Axon?" | "SCS is the only platform combining sensor integration, tactical response, predictive intelligence, SOC monitoring, and training in one unified multi-region system." |

---

## Closing

> "Thank you for your time. SCS demonstrates that with modern web technologies and thoughtful architecture, we can build a unified command system that serves public safety across Southern California. Questions?"
