// ========================================
// SoCal-SMART Unified Command — App Logic
// ========================================

// --- State Management ---
const state = {
    currentRegion: 'la',
    map: null,
    markers: {},
    layerGroups: {},
    radarChart: null,
    latencyChart: null,
    barChart: null,
    doughnutChart: null,
    isDark: false,
    liveMode: false,
    liveModeInterval: null,
    simRunning: false,
    audioCtx: null,
    userName: 'Operator',
    userRole: 'Commander'
};

// --- Region Data ---
const regions = {
    la: {
        coords: [34.0522, -118.2437], zoom: 10,
        stats: [90, 85, 40, 95, 50],
        name: "Los Angeles Metro"
    },
    ie: {
        coords: [34.055, -117.4], zoom: 10,
        stats: [95, 60, 90, 40, 20],
        name: "Inland Empire"
    },
    sd: {
        coords: [32.7157, -117.1611], zoom: 10,
        stats: [80, 50, 60, 70, 98],
        name: "San Diego"
    }
};

// --- Pillar Modal Content with Pricing ---
const pillarData = {
    shield: {
        title: 'SMART-Shield',
        subtitle: 'Sensor & Logistics Layer',
        color: '#f59e0b',
        desc: 'A B2B private security integration platform for logistics hubs, ports, and critical infrastructure. Geofences high-value assets and triggers instant alerts upon unauthorized movement, feeding directly into the regional safety grid.',
        features: [
            'Automated geofence perimeter alerts',
            'Real-time cargo tracking & manifest verification',
            'Thermal & motion sensor array integration',
            'Cross-dock anomaly detection AI',
            'Private-to-public handoff protocols',
            'Compliance-ready audit trails'
        ],
        pricing: [
            {
                name: 'Starter',
                price: '$12',
                unit: '/node/month',
                desc: 'Up to 50 sensor nodes',
                highlights: ['Geofence alerts', 'Basic cargo tracking', 'Email notifications', '8×5 support'],
                cta: 'Start Free Trial'
            },
            {
                name: 'Professional',
                price: '$8',
                unit: '/node/month',
                desc: '50–500 nodes • Billed annually',
                highlights: ['Everything in Starter', 'AI anomaly detection', 'Public safety handoff', '24/7 SOC monitoring'],
                cta: 'Get Started',
                popular: true
            },
            {
                name: 'Enterprise',
                price: '$5',
                unit: '/node/month',
                desc: '500+ nodes • Custom contract',
                highlights: ['Everything in Professional', 'Dedicated account team', 'Custom integrations', 'SLA guarantee 99.99%'],
                cta: 'Contact Sales'
            }
        ]
    },
    iwin: {
        title: 'IWIN Tactical Suite',
        subtitle: 'Response & Law Enforcement Layer',
        color: '#4f46e5',
        desc: 'Information When It\'s Needed — a law enforcement SaaS platform that replaces legacy radio dispatch with tablet-based Digital Twins. Provides officers with 3D floor plans, HazMat data, and automated cross-county pursuit hand-offs.',
        features: [
            'Digital Twin building pre-plans',
            '3D interior navigation for first responders',
            'Cross-jurisdictional pursuit auto-handoff',
            'HazMat chemical manifest lookup',
            'Real-time unit positioning & dispatch',
            'Body-cam integration & evidence sync'
        ],
        pricing: [
            {
                name: 'Patrol',
                price: '$39',
                unit: '/seat/month',
                desc: 'Per officer • Billed annually',
                highlights: ['GPS dispatch & tracking', 'Digital radio replacement', 'Incident logging', 'Standard support'],
                cta: 'Start Free Trial'
            },
            {
                name: 'Tactical',
                price: '$79',
                unit: '/seat/month',
                desc: 'Per officer • Billed annually',
                highlights: ['Everything in Patrol', '3D Digital Twin access', 'HazMat manifest lookup', 'Cross-county handoff'],
                cta: 'Get Started',
                popular: true
            },
            {
                name: 'Command',
                price: '$129',
                unit: '/seat/month',
                desc: 'Per officer • Multi-agency',
                highlights: ['Everything in Tactical', 'Body-cam sync & evidence', 'Full analytics dashboard', 'Dedicated CSM + training'],
                cta: 'Contact Sales'
            }
        ]
    },
    horizon: {
        title: 'Horizon API',
        subtitle: 'Predictive Intelligence Layer',
        color: '#0d9488',
        desc: 'A Data-as-a-Service API for urban planners, autonomous logistics, and insurance actuaries. Uses historical response data to generate dynamic risk scores and "Safe Path" routing algorithms.',
        features: [
            'Dynamic regional risk scoring API',
            'Safe Path routing for autonomous vehicles',
            'Predictive incident modeling (72h lookahead)',
            'Urban planning heat-density analysis',
            'Insurance actuary risk feeds',
            'Historical trend pattern matching'
        ],
        pricing: [
            {
                name: 'Developer',
                price: '$149',
                unit: '/month',
                desc: '10,000 API calls included',
                highlights: ['Risk score endpoints', 'Sandbox environment', 'Community support', 'Basic rate limits'],
                cta: 'Start Free Trial'
            },
            {
                name: 'Growth',
                price: '$399',
                unit: '/month',
                desc: '100,000 API calls included',
                highlights: ['Everything in Developer', 'Safe Path routing', 'Predictive modeling', 'Priority support'],
                cta: 'Get Started',
                popular: true
            },
            {
                name: 'Enterprise',
                price: '$899',
                unit: '/month',
                desc: 'Unlimited calls • Custom SLA',
                highlights: ['Everything in Growth', 'Dedicated infrastructure', 'Custom model training', 'Premium SLA + CSM'],
                cta: 'Contact Sales'
            }
        ]
    }
};

// --- Hospital/Fire Station Data ---
const facilityData = {
    hospitals: [
        { coords: [34.0628, -118.2603], name: 'LA County General' },
        { coords: [34.0720, -117.3255], name: 'Loma Linda Medical' },
        { coords: [34.0552, -117.1924], name: 'San Bernardino Regional' },
        { coords: [32.7580, -117.1600], name: 'UCSD Trauma Center' },
        { coords: [33.7850, -118.1140], name: 'Long Beach Memorial' }
    ],
    fireStations: [
        { coords: [34.0553, -118.2468], name: 'LAFD Station 9' },
        { coords: [34.1015, -117.5610], name: 'SB County Fire 75' },
        { coords: [34.0633, -117.6356], name: 'Rancho Cucamonga FD' },
        { coords: [32.7270, -117.1628], name: 'SDFD Station 1' },
        { coords: [33.9425, -118.2551], name: 'Inglewood FD' }
    ]
};

// --- Heatmap Data ---
const heatData = [
    [34.05, -118.24, 0.8], [34.04, -118.26, 0.6], [34.06, -118.20, 0.7],
    [34.02, -118.30, 0.5], [34.07, -118.35, 0.4], [33.95, -118.28, 0.6],
    [33.74, -118.28, 0.9], [33.77, -118.19, 0.7], [34.08, -117.45, 0.8],
    [34.05, -117.40, 0.7], [34.10, -117.50, 0.6], [34.02, -117.38, 0.5],
    [34.06, -117.55, 0.4], [33.98, -117.35, 0.6], [32.72, -117.16, 0.7],
    [32.75, -117.13, 0.5], [32.54, -117.03, 0.9], [32.62, -117.08, 0.6],
    [32.80, -117.20, 0.4], [33.88, -118.08, 0.5], [34.15, -118.45, 0.3]
];

// --- Randomized Breach Scenarios ---
const breachScenarios = [
    { region: 'ie', loc: [34.08, -117.48], name: 'Fontana Logistics Hub B-4', asset: 'CARGO-7741', type: 'Chemical', prediction: 'Target trending to SD Border', alert: 'San Diego Border Patrol' },
    { region: 'ie', loc: [34.06, -117.35], name: 'Ontario Distribution Center C-2', asset: 'CARGO-3390', type: 'Electronics', prediction: 'Target trending east toward AZ', alert: 'CHP Barstow Division' },
    { region: 'ie', loc: [33.95, -117.40], name: 'Riverside Railyard Gate 7', asset: 'RAIL-1188', type: 'Fuel Tanker', prediction: 'Target diverting to I-215 South', alert: 'Riverside County Fire' },
    { region: 'la', loc: [33.74, -118.26], name: 'Port of LA Terminal 4', asset: 'SHIP-5523', type: 'Pharmaceuticals', prediction: 'Suspect vehicle heading north on I-110', alert: 'LAPD Harbor Division' },
    { region: 'la', loc: [33.94, -118.41], name: 'LAX Cargo Facility West', asset: 'AIR-0092', type: 'Restricted Tech', prediction: 'Vehicle entering I-405 Northbound', alert: 'LAX Airport Police' },
    { region: 'la', loc: [34.07, -118.22], name: 'Downtown LA Transit Hub', asset: 'BUS-4421', type: 'Suspicious Package', prediction: 'Target moving toward Union Station', alert: 'Metro Transit Security' },
    { region: 'sd', loc: [32.54, -117.03], name: 'San Ysidro Border Crossing', asset: 'VEH-8834', type: 'Undeclared Cargo', prediction: 'Vehicle registered to flagged entity', alert: 'CBP San Diego Sector' },
    { region: 'sd', loc: [32.73, -117.18], name: 'SD Naval Base Perimeter', asset: 'DRONE-0017', type: 'Aerial Intrusion', prediction: 'UAS trajectory toward restricted airspace', alert: 'Naval Base Point Loma' }
];

// --- Bundle Package Data ---
const bundleData = {
    starter: {
        title: 'Regional Starter Bundle',
        subtitle: 'Shield + IWIN — 15% Savings',
        color: '#f59e0b',
        price: '$499',
        original: '$588',
        unit: '/month base',
        desc: 'The perfect entry point for agencies beginning their digital safety transformation. Combines sensor coverage with tactical response tools for a single county or jurisdiction.',
        includes: [
            { product: 'SMART-Shield Professional', details: '100 sensor nodes included' },
            { product: 'IWIN Tactical Suite (Patrol)', details: '15 officer seats included' }
        ],
        bonuses: ['Shared analytics dashboard', 'Unified alert routing', 'Joint training session (8 hrs)', 'Dedicated onboarding specialist'],
        savings: '$89/mo',
        ideal: 'Single-county agencies, campus police, port authorities'
    },
    spectrum: {
        title: 'Full Spectrum Bundle',
        subtitle: 'Shield + IWIN + Horizon — 25% Savings',
        color: '#4f46e5',
        price: '$899',
        original: '$1,198',
        unit: '/month base',
        desc: 'Complete ecosystem coverage for multi-county operations. The most popular choice for regional safety cooperatives that need sensor, response, and intelligence layers working together.',
        includes: [
            { product: 'SMART-Shield Professional', details: '250 sensor nodes included' },
            { product: 'IWIN Tactical Suite (Tactical)', details: '25 officer seats included' },
            { product: 'Horizon API (Growth)', details: '100K API calls/month included' }
        ],
        bonuses: ['Cross-product data fusion engine', 'Predictive dispatch routing', 'Quarterly strategy review', 'Priority 4-hour support SLA'],
        savings: '$299/mo',
        ideal: 'Multi-county cooperatives, regional task forces, transit authorities'
    },
    enterprise: {
        title: 'Enterprise Command Bundle',
        subtitle: 'Full Suite + Premium Services — 35% Savings',
        color: '#0d9488',
        price: '$1,499',
        original: '$2,306',
        unit: '/month base',
        desc: 'The ultimate package for large-scale deployments. Includes all products at their highest tier, plus dedicated infrastructure, custom AI training, and white-glove support.',
        includes: [
            { product: 'SMART-Shield Enterprise', details: 'Unlimited sensor nodes' },
            { product: 'IWIN Tactical Suite (Command)', details: 'Unlimited officer seats' },
            { product: 'Horizon API (Enterprise)', details: 'Unlimited API calls + custom models' }
        ],
        bonuses: ['Dedicated cloud infrastructure', 'Custom AI model training', '24/7 premium support + CSM', '99.99% SLA guarantee', 'Annual on-site training program', 'Executive reporting dashboard'],
        savings: '$807/mo',
        ideal: 'State agencies, multi-city cooperatives, federal partnerships'
    }
};

// ============ INITIALIZATION ============

document.addEventListener('DOMContentLoaded', () => {
    // Show loading screen, then login
    setTimeout(() => {
        document.getElementById('loading-screen').classList.add('hidden');
    }, 2800);
});

function handleLogin() {
    const name = document.getElementById('login-name').value || 'Operator';
    const role = document.getElementById('login-role').value;
    state.userName = name;
    state.userRole = role;

    document.getElementById('login-screen').classList.add('hidden');

    // Update greeting badge
    const badge = document.getElementById('role-badge');
    badge.textContent = `${role} • ${name}`;
    badge.classList.add('visible');

    // Init everything
    initMap();
    initCharts();
    initKPIObserver();
    logFeed("SoCal Unified Command online.", "color: var(--success); font-weight: 700;");
    logFeed(`Welcome, ${role} ${name}. Syncing 1,402 Shield Nodes...`, "color: var(--text-secondary);");
}

// ============ THEME ============

function toggleTheme() {
    state.isDark = !state.isDark;
    document.documentElement.setAttribute('data-theme', state.isDark ? 'dark' : 'light');
    const icon = document.getElementById('theme-icon');
    icon.className = state.isDark ? 'ph-bold ph-sun' : 'ph-bold ph-moon';

    // Update charts for theme
    if (state.radarChart) updateChartColors();
}

function updateChartColors() {
    // Charts auto-adapt via CSS vars; force redraw
    [state.radarChart, state.latencyChart, state.barChart, state.doughnutChart].forEach(c => {
        if (c) c.update();
    });
}

// ============ MOBILE NAV ============

function openMobileNav() { document.getElementById('mobile-nav').classList.add('open'); }
function closeMobileNav() { document.getElementById('mobile-nav').classList.remove('open'); }

// ============ SCROLL ============

function scrollToSection(id) {
    document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
    closeMobileNav();
}

// ============ MAP ============

function initMap() {
    state.map = L.map('tactical-map', {
        zoomControl: false,
        attributionControl: false
    }).setView(regions.la.coords, 9);

    const lightTiles = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19, subdomains: 'abcd'
    });
    const darkTiles = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19, subdomains: 'abcd'
    });
    lightTiles.addTo(state.map);

    // Zone overlays
    L.circle([33.74, -118.26], {
        color: '#4f46e5', fillColor: '#4f46e5', fillOpacity: 0.1, radius: 6000
    }).addTo(state.map).bindPopup("<b>Port of LA</b><br>Shield Zone Active");

    L.circle([34.05, -117.45], {
        color: '#f59e0b', fillColor: '#f59e0b', fillOpacity: 0.1, radius: 10000
    }).addTo(state.map).bindPopup("<b>IE Logistics Corridor</b><br>Shield Zone Active");

    L.circle([32.54, -117.03], {
        color: '#0d9488', fillColor: '#0d9488', fillOpacity: 0.1, radius: 8000
    }).addTo(state.map).bindPopup("<b>San Ysidro Entry</b><br>Horizon Intel Active");

    // Prepare facility layers (hidden by default)
    state.layerGroups.hospitals = L.layerGroup();
    facilityData.hospitals.forEach(h => {
        const icon = L.divIcon({ className: 'hospital-marker', iconSize: [14, 14] });
        L.marker(h.coords, { icon }).bindPopup(`<b>${h.name}</b><br>Trauma Center`).addTo(state.layerGroups.hospitals);
    });

    state.layerGroups.fire = L.layerGroup();
    facilityData.fireStations.forEach(f => {
        const icon = L.divIcon({ className: 'fire-marker', iconSize: [14, 14] });
        L.marker(f.coords, { icon }).bindPopup(`<b>${f.name}</b><br>Fire Station`).addTo(state.layerGroups.fire);
    });

    // Heatmap layer
    if (typeof L.heatLayer === 'function') {
        state.layerGroups.heat = L.heatLayer(heatData, { radius: 30, blur: 20, maxZoom: 13 });
    }
}

function panToRegion(code) {
    const r = regions[code];
    state.map.flyTo(r.coords, r.zoom, { duration: 1.5 });
    logFeed(`Camera refocus: ${r.name}`, "color: var(--iwin); font-weight: 700;");
    updateRadar(code);
    closeMobileNav();
}

function toggleLayer(type) {
    const btn = document.querySelector(`[data-layer="${type}"]`);
    const group = state.layerGroups[type];
    if (!group) return;

    if (state.map.hasLayer(group)) {
        state.map.removeLayer(group);
        btn.classList.remove('active');
    } else {
        group.addTo(state.map);
        btn.classList.add('active');
        logFeed(`Layer toggled: ${type}`, "color: var(--text-secondary);");
    }
}

// ============ SIMULATION (RANDOMIZED) ============

function runSimulation() {
    if (state.simRunning) return;
    state.simRunning = true;

    // Pick a random breach scenario
    const scenario = breachScenarios[Math.floor(Math.random() * breachScenarios.length)];
    const breachLoc = scenario.loc;

    // Clean up previous simulation markers
    ['hazard', 'unit1', 'unit2', 'unit3', 'unit1_line', 'unit2_line', 'unit3_line', 'containment'].forEach(k => {
        if (state.markers[k]) {
            state.map.removeLayer(state.markers[k]);
            delete state.markers[k];
        }
    });

    const feed = document.getElementById('intel-feed');
    feed.innerHTML = '';
    const timeline = document.getElementById('sim-timeline');
    timeline.classList.add('visible');
    const phases = timeline.querySelectorAll('.sim-phase');
    phases.forEach(p => { p.classList.remove('active', 'done'); });

    logFeed("━━ SIMULATION SEQUENCE INITIATED ━━", "font-weight: 900;");
    playTone(220, 0.3);

    // Phase 1: Shield Breach (randomized location)
    phases[0].classList.add('active');
    setTimeout(() => {
        panToRegion(scenario.region);
        logFeed(`⚠️ SMART-Shield Alert: Geofence Breach`, "color: var(--shield); font-weight: 700;");
        logFeed(`Loc: ${scenario.name}`, "color: var(--text-secondary);");
        logFeed(`Asset ID: ${scenario.asset} • Class: ${scenario.type}`, "color: var(--text-secondary);");
        playTone(440, 0.2);

        const hazardIcon = L.divIcon({ className: 'hazard-marker', iconSize: [16, 16] });
        state.markers.hazard = L.marker(breachLoc, { icon: hazardIcon })
            .addTo(state.map).bindPopup(`⚠️ ${scenario.type} — Unauthorized Exit`).openPopup();

        phases[0].classList.remove('active');
        phases[0].classList.add('done');
    }, 1500);

    // Phase 2: IWIN Dispatch — units spawn near the breach location
    setTimeout(() => {
        phases[1].classList.add('active');
        logFeed("📡 IWIN Suite: Dispatching 3 Units", "color: var(--iwin); font-weight: 700;");
        logFeed("Data Push: 3D Twin & Manifest", "color: var(--text-secondary);");
        playTone(330, 0.15);

        // Generate 3 random nearby unit positions
        const units = [
            { start: [breachLoc[0] - 0.03, breachLoc[1] + 0.08], id: 'unit1', label: 'Unit 7-Alpha' },
            { start: [breachLoc[0] + 0.02, breachLoc[1] - 0.04], id: 'unit2', label: 'Unit 3-Bravo' },
            { start: [breachLoc[0] - 0.05, breachLoc[1] - 0.03], id: 'unit3', label: 'Unit 12-Charlie' }
        ];

        units.forEach((u, i) => {
            setTimeout(() => {
                const m = L.marker(u.start, { icon: L.divIcon({ className: 'unit-marker', iconSize: [16, 16] }) }).addTo(state.map);
                state.markers[u.id] = m;
                logFeed(`↗ ${u.label} en route`, "color: var(--iwin);");

                const line = L.polyline([u.start, breachLoc], {
                    color: '#4f46e5', weight: 2, opacity: 0.5, dashArray: '6 4'
                }).addTo(state.map);
                state.markers[u.id + '_line'] = line;

                animateMarker(m, u.start, breachLoc, 3000);
            }, i * 600);
        });

        phases[1].classList.remove('active');
        phases[1].classList.add('done');
    }, 4000);

    // Phase 3: Horizon Prediction (uses scenario data)
    setTimeout(() => {
        phases[2].classList.add('active');
        logFeed("🧠 Horizon API: Pattern Match Detected", "color: var(--horizon); font-weight: 700;");
        logFeed(`Predictive Route: ${scenario.prediction}`, "color: var(--text-secondary);");
        logFeed(`Action: Alerting ${scenario.alert}`, "color: var(--text-primary);");
        playTone(550, 0.2);

        phases[2].classList.remove('active');
        phases[2].classList.add('done');
    }, 8000);

    // Phase 4: Containment
    setTimeout(() => {
        phases[3].classList.add('active');
        logFeed("✅ TARGET INTERCEPTED — Latency: 0.05s", "color: var(--success); font-weight: 900;");
        playTone(660, 0.3);

        const containment = L.circle(breachLoc, {
            color: '#10b981', fillColor: '#10b981', fillOpacity: 0.15, radius: 100
        }).addTo(state.map);
        state.markers.containment = containment;

        let r = 100;
        const expandInterval = setInterval(() => {
            r += 200;
            containment.setRadius(r);
            if (r >= 2000) {
                clearInterval(expandInterval);
                phases[3].classList.remove('active');
                phases[3].classList.add('done');
                state.simRunning = false;
            }
        }, 50);
    }, 10000);
}

function animateMarker(marker, start, end, duration) {
    const startTime = performance.now();
    function step(currentTime) {
        const p = Math.min((currentTime - startTime) / duration, 1);
        const eased = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
        marker.setLatLng([
            start[0] + (end[0] - start[0]) * eased,
            start[1] + (end[1] - start[1]) * eased
        ]);
        if (p < 1) requestAnimationFrame(step);
        else marker.bindPopup("<b>Target Intercepted</b><br>Latency: 0.05s").openPopup();
    }
    requestAnimationFrame(step);
}

// ============ LIVE MODE ============

function toggleLiveMode() {
    state.liveMode = !state.liveMode;
    const btn = document.getElementById('live-mode-btn');

    if (state.liveMode) {
        btn.classList.add('active');
        btn.textContent = '⏹ Stop Live';
        logFeed("Live Mode: ACTIVATED", "color: var(--success); font-weight: 700;");
        state.liveModeInterval = setInterval(spawnRandomEvent, 3000);
    } else {
        btn.classList.remove('active');
        btn.textContent = '▶ Live Mode';
        logFeed("Live Mode: Deactivated", "color: var(--text-muted);");
        clearInterval(state.liveModeInterval);
    }
}

function spawnRandomEvent() {
    const events = [
        { msg: "🔵 Patrol check-in: Unit 4-Delta • Sector 7", style: "color: var(--iwin);" },
        { msg: "🟡 Shield ping: Sensor Node 842 • Normal", style: "color: var(--shield);" },
        { msg: "🟢 Traffic flow: I-10 Corridor clear", style: "color: var(--success);" },
        { msg: "🔵 Speed anomaly: SR-60 Eastbound flagged", style: "color: var(--iwin);" },
        { msg: "🟡 Cargo scan: Port of LA Gate 3 • Cleared", style: "color: var(--shield);" },
        { msg: "🟢 Horizon: Risk score update — IE Zone -2pts", style: "color: var(--horizon);" },
        { msg: "🔵 Border check: San Ysidro checkpoint normal", style: "color: var(--iwin);" },
        { msg: "🟡 Shield: Temp spike Sensor 1204 • Monitoring", style: "color: var(--shield);" }
    ];
    const e = events[Math.floor(Math.random() * events.length)];
    logFeed(e.msg, e.style);

    // Random map blip
    const lat = 32.5 + Math.random() * 2;
    const lng = -118.5 + Math.random() * 1.5;
    const blip = L.circleMarker([lat, lng], {
        radius: 6, color: '#4f46e5', fillColor: '#4f46e5',
        fillOpacity: 0.5, weight: 1
    }).addTo(state.map);

    setTimeout(() => state.map.removeLayer(blip), 4000);
}

// ============ FEED ============

function logFeed(msg, style) {
    const feed = document.getElementById('intel-feed');
    // Remove placeholder text
    const placeholder = feed.querySelector('.feed-placeholder');
    if (placeholder) placeholder.remove();

    const div = document.createElement('div');
    const time = new Date().toLocaleTimeString([], { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" });
    div.className = 'feed-item';
    div.setAttribute('style', style || '');
    div.innerHTML = `<span class="feed-time">[${time}]</span>${msg}`;
    feed.prepend(div);
}

function filterFeed() {
    const query = document.getElementById('feed-search').value.toLowerCase();
    const items = document.querySelectorAll('.feed-item');
    items.forEach(item => {
        item.style.display = item.textContent.toLowerCase().includes(query) || query === '' ? '' : 'none';
    });
}

// ============ CHARTS ============

function initCharts() {
    const gridColor = 'rgba(148,163,184,0.15)';
    const labelColor = '#64748b';

    // Radar Chart
    const ctxR = document.getElementById('radarChart').getContext('2d');
    state.radarChart = new Chart(ctxR, {
        type: 'radar',
        data: {
            labels: ['Logistics', 'Transit', 'Wildfire', 'Events', 'Border'],
            datasets: [{
                label: 'Priority',
                data: regions.la.stats,
                backgroundColor: 'rgba(79,70,229,0.15)',
                borderColor: '#4f46e5',
                borderWidth: 2,
                pointBackgroundColor: '#4f46e5',
                pointRadius: 4
            }]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            scales: {
                r: {
                    beginAtZero: true, max: 100,
                    ticks: { display: false },
                    grid: { color: gridColor },
                    pointLabels: { font: { size: 11, family: 'Inter' }, color: labelColor }
                }
            },
            plugins: { legend: { display: false } }
        }
    });

    // Latency Line Chart
    const ctxL = document.getElementById('latencyChart').getContext('2d');
    state.latencyChart = new Chart(ctxL, {
        type: 'line',
        data: {
            labels: ['Legacy Radio', 'Digital Dispatch', 'GPS Sync', 'GeoEvent Server', 'Unified Ecosystem'],
            datasets: [{
                label: 'Latency (s)',
                data: [600, 300, 120, 10, 0.05],
                borderColor: '#0d9488',
                backgroundColor: 'rgba(13,148,136,0.1)',
                fill: true, tension: 0.4, pointRadius: 5,
                pointBackgroundColor: '#0d9488'
            }]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            scales: {
                y: { type: 'logarithmic', display: false },
                x: { grid: { display: false }, ticks: { font: { size: 10 }, color: labelColor } }
            },
            plugins: { legend: { display: false } }
        }
    });

    // Bar Chart (Resource Allocation)
    const ctxB = document.getElementById('barChart').getContext('2d');
    state.barChart = new Chart(ctxB, {
        type: 'bar',
        data: {
            labels: ['LA Metro', 'Inland Empire', 'San Diego'],
            datasets: [
                { label: 'Officers', data: [450, 280, 320], backgroundColor: '#4f46e5', borderRadius: 6 },
                { label: 'Sensors', data: [620, 510, 290], backgroundColor: '#f59e0b', borderRadius: 6 },
                { label: 'Drones', data: [35, 22, 18], backgroundColor: '#0d9488', borderRadius: 6 }
            ]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            scales: {
                y: { grid: { color: gridColor }, ticks: { font: { size: 10 }, color: labelColor } },
                x: { grid: { display: false }, ticks: { font: { size: 11 }, color: labelColor } }
            },
            plugins: { legend: { position: 'top', labels: { boxWidth: 12, font: { size: 11 }, padding: 16 } } }
        }
    });

    // Doughnut Chart (Incident Types)
    const ctxD = document.getElementById('doughnutChart').getContext('2d');
    state.doughnutChart = new Chart(ctxD, {
        type: 'doughnut',
        data: {
            labels: ['Logistics', 'Transit', 'Wildfire', 'Border', 'Events'],
            datasets: [{
                data: [32, 22, 18, 16, 12],
                backgroundColor: ['#4f46e5', '#6366f1', '#f59e0b', '#0d9488', '#10b981'],
                borderWidth: 0,
                spacing: 3,
                borderRadius: 4
            }]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            cutout: '65%',
            plugins: { legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 11 }, padding: 12 } } }
        }
    });
}

function updateRadar(code) {
    const data = regions[code].stats;
    state.radarChart.data.datasets[0].data = data;
    let color = '#4f46e5';
    if (code === 'ie') color = '#f59e0b';
    if (code === 'sd') color = '#0d9488';
    state.radarChart.data.datasets[0].borderColor = color;
    state.radarChart.data.datasets[0].backgroundColor = color + '26';
    state.radarChart.data.datasets[0].pointBackgroundColor = color;
    state.radarChart.update();
}

function updateLatencyRange(range) {
    const datasets = {
        '24h': [120, 80, 40, 5, 0.05],
        '7d': [300, 200, 100, 8, 0.05],
        '30d': [600, 300, 120, 10, 0.05]
    };
    state.latencyChart.data.datasets[0].data = datasets[range] || datasets['30d'];
    state.latencyChart.update();

    document.querySelectorAll('.latency-btn').forEach(b => b.classList.remove('active'));
    document.querySelector(`[data-range="${range}"]`).classList.add('active');
}

// ============ KPI ANIMATED COUNTERS ============

function initKPIObserver() {
    const kpis = document.querySelectorAll('.kpi-value');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.dataset.animated) {
                entry.target.dataset.animated = 'true';
                animateCounter(entry.target);
            }
        });
    }, { threshold: 0.3 });
    kpis.forEach(el => observer.observe(el));
}

function animateCounter(el) {
    const target = parseFloat(el.dataset.target);
    const suffix = el.dataset.suffix || '';
    const prefix = el.dataset.prefix || '';
    const decimals = el.dataset.decimals ? parseInt(el.dataset.decimals) : 0;
    const duration = 1500;
    const start = performance.now();

    function step(now) {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        const val = (target * eased).toFixed(decimals);
        el.textContent = prefix + Number(val).toLocaleString() + suffix;
        if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
}

// ============ MODALS ============

function openPillarModal(type) {
    const data = pillarData[type];
    if (!data) return;

    const body = document.getElementById('modal-body');
    body.innerHTML = `
        <h3>${data.title}</h3>
        <p class="modal-subtitle">${data.subtitle}</p>
        <p class="modal-desc">${data.desc}</p>
        <ul class="modal-features">
            ${data.features.map(f => `<li><i class="ph-bold ph-check-circle"></i> ${f}</li>`).join('')}
        </ul>
        <div style="margin-top:28px;margin-bottom:8px;">
            <h4 style="font-size:16px;font-weight:800;margin-bottom:4px;">Choose Your Plan</h4>
            <p style="font-size:12px;color:var(--text-muted);">All plans include a 14-day free trial. No credit card required.</p>
        </div>
        <div style="display:flex;flex-direction:column;gap:12px;">
            ${data.pricing.map(tier => `
                <div style="border:${tier.popular ? '2px solid ' + data.color : '1px solid var(--border)'};border-radius:16px;padding:20px;position:relative;background:var(--bg-panel-alt);transition:all 0.2s;">
                    ${tier.popular ? `<span style="position:absolute;top:-10px;right:16px;background:${data.color};color:white;font-size:9px;font-weight:800;padding:3px 10px;border-radius:6px;text-transform:uppercase;letter-spacing:1px;">Most Popular</span>` : ''}
                    <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px;">
                        <div>
                            <div style="font-size:14px;font-weight:700;">${tier.name}</div>
                            <div style="font-size:11px;color:var(--text-muted);">${tier.desc}</div>
                        </div>
                        <div style="text-align:right;">
                            <span style="font-size:28px;font-weight:900;color:${data.color};">${tier.price}</span>
                            <span style="font-size:11px;color:var(--text-muted);">${tier.unit}</span>
                        </div>
                    </div>
                    <ul style="list-style:none;padding:0;margin:12px 0;">
                        ${tier.highlights.map(h => `<li style="font-size:12px;color:var(--text-secondary);padding:3px 0;display:flex;align-items:center;gap:6px;"><i class="ph-bold ph-check" style="color:${data.color};font-size:12px;"></i>${h}</li>`).join('')}
                    </ul>
                    <button onclick="handlePurchase('${type}','${tier.name}','${tier.price}','${tier.unit}')" style="width:100%;padding:12px;border-radius:10px;border:none;font-size:13px;font-weight:700;cursor:pointer;transition:all 0.2s;font-family:'Inter',sans-serif;${tier.popular ? 'background:' + data.color + ';color:white;box-shadow:0 4px 12px ' + data.color + '44;' : 'background:var(--bg-panel);border:1px solid var(--border);color:var(--text-primary);'}">${tier.cta}</button>
                </div>
            `).join('')}
        </div>
        <p style="font-size:10px;color:var(--text-muted);text-align:center;margin-top:16px;">Volume discounts available for multi-region deployments. Contact sales for custom quotes.</p>
    `;
    document.getElementById('modal-overlay').classList.add('open');
    logFeed(`Viewing: ${data.title} pricing`, "color: var(--text-muted);");
}

function handlePurchase(productType, tierName, price, unit) {
    const data = pillarData[productType];
    const body = document.getElementById('modal-body');
    body.innerHTML = `
        <div style="text-align:center;margin-bottom:24px;">
            <div style="width:56px;height:56px;background:${data.color}15;color:${data.color};border-radius:16px;display:flex;align-items:center;justify-content:center;margin:0 auto 16px;font-size:28px;"><i class="ph-bold ph-shopping-cart"></i></div>
            <h3 style="margin-bottom:4px;">Complete Your Order</h3>
            <p class="modal-subtitle">${data.title} — ${tierName} Plan</p>
        </div>
        <div style="background:var(--bg-panel-alt);border:1px solid var(--border);border-radius:16px;padding:20px;margin-bottom:20px;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;padding-bottom:12px;border-bottom:1px solid var(--border);">
                <span style="font-size:13px;font-weight:600;">Plan</span>
                <span style="font-size:13px;font-weight:700;">${tierName}</span>
            </div>
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;padding-bottom:12px;border-bottom:1px solid var(--border);">
                <span style="font-size:13px;font-weight:600;">Rate</span>
                <span style="font-size:13px;font-weight:700;color:${data.color};">${price}${unit}</span>
            </div>
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;padding-bottom:12px;border-bottom:1px solid var(--border);">
                <span style="font-size:13px;font-weight:600;">Trial Period</span>
                <span style="font-size:13px;font-weight:700;">14 days free</span>
            </div>
            <div style="display:flex;justify-content:space-between;align-items:center;">
                <span style="font-size:13px;font-weight:600;">Billing</span>
                <span style="font-size:13px;font-weight:700;">Annual (save 20%)</span>
            </div>
        </div>
        <div style="margin-bottom:16px;">
            <label style="font-size:11px;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:1px;display:block;margin-bottom:6px;">Organization Name</label>
            <input type="text" placeholder="e.g. San Bernardino County" style="width:100%;padding:12px 16px;border:1px solid var(--border);border-radius:12px;font-size:14px;background:var(--bg-panel-alt);color:var(--text-primary);font-family:'Inter',sans-serif;outline:none;">
        </div>
        <div style="margin-bottom:16px;">
            <label style="font-size:11px;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:1px;display:block;margin-bottom:6px;">Contact Email</label>
            <input type="email" placeholder="procurement@agency.gov" style="width:100%;padding:12px 16px;border:1px solid var(--border);border-radius:12px;font-size:14px;background:var(--bg-panel-alt);color:var(--text-primary);font-family:'Inter',sans-serif;outline:none;">
        </div>
        <div style="margin-bottom:20px;">
            <label style="font-size:11px;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:1px;display:block;margin-bottom:6px;">Quantity</label>
            <input type="number" value="10" min="1" id="purchase-qty" style="width:100%;padding:12px 16px;border:1px solid var(--border);border-radius:12px;font-size:14px;background:var(--bg-panel-alt);color:var(--text-primary);font-family:'Inter',sans-serif;outline:none;">
        </div>
        <button onclick="confirmPurchase('${productType}','${tierName}','${price}')" style="width:100%;padding:14px;background:${data.color};color:white;border:none;border-radius:12px;font-size:14px;font-weight:700;cursor:pointer;transition:all 0.2s;font-family:'Inter',sans-serif;box-shadow:0 4px 16px ${data.color}44;">Confirm & Start Trial</button>
        <button onclick="openPillarModal('${productType}')" style="width:100%;padding:12px;background:transparent;border:1px solid var(--border);border-radius:12px;font-size:13px;font-weight:600;cursor:pointer;color:var(--text-secondary);margin-top:8px;font-family:'Inter',sans-serif;">← Back to Plans</button>
    `;
    logFeed(`Purchase flow: ${data.title} ${tierName}`, "color: ${data.color}; font-weight: 700;");
    playTone(440, 0.1);
}

function confirmPurchase(productType, tierName, price) {
    const data = pillarData[productType];
    const qty = document.getElementById('purchase-qty')?.value || '10';
    const body = document.getElementById('modal-body');
    body.innerHTML = `
        <div style="text-align:center;padding:40px 0;">
            <div style="width:72px;height:72px;background:#10b98120;color:#10b981;border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 20px;font-size:36px;"><i class="ph-bold ph-check-circle"></i></div>
            <h3 style="font-size:22px;margin-bottom:8px;">Order Confirmed!</h3>
            <p style="font-size:14px;color:var(--text-secondary);margin-bottom:24px;">Your 14-day free trial of <strong>${data.title} ${tierName}</strong> is now active.</p>
            <div style="background:var(--bg-panel-alt);border:1px solid var(--border);border-radius:16px;padding:20px;text-align:left;margin-bottom:24px;">
                <div style="font-size:12px;font-weight:700;color:var(--text-muted);text-transform:uppercase;margin-bottom:12px;">Order Summary</div>
                <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--border);"><span style="font-size:13px;">Product</span><span style="font-size:13px;font-weight:700;">${data.title}</span></div>
                <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--border);"><span style="font-size:13px;">Plan</span><span style="font-size:13px;font-weight:700;">${tierName}</span></div>
                <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--border);"><span style="font-size:13px;">Quantity</span><span style="font-size:13px;font-weight:700;">${qty} units</span></div>
                <div style="display:flex;justify-content:space-between;padding:8px 0;"><span style="font-size:13px;">Trial ends</span><span style="font-size:13px;font-weight:700;">${new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span></div>
            </div>
            <p style="font-size:12px;color:var(--text-muted);margin-bottom:20px;">A confirmation email has been sent to your address. Our team will reach out within 24 hours to begin onboarding.</p>
            <button onclick="closeModal()" style="padding:14px 32px;background:${data.color};color:white;border:none;border-radius:12px;font-size:14px;font-weight:700;cursor:pointer;font-family:'Inter',sans-serif;box-shadow:0 4px 16px ${data.color}44;">Return to Dashboard</button>
        </div>
    `;
    logFeed(`✅ ORDER CONFIRMED: ${data.title} ${tierName} × ${qty} units`, "color: var(--success); font-weight: 900;");
    playTone(660, 0.3);
}

// ============ BUNDLE MODALS ============

function openBundleModal(bundleType) {
    const data = bundleData[bundleType];
    if (!data) return;

    const body = document.getElementById('modal-body');
    body.innerHTML = `
        <div style="text-align:center;margin-bottom:20px;">
            <div style="display:inline-flex;align-items:center;gap:8px;background:${data.color}15;padding:6px 16px;border-radius:8px;margin-bottom:12px;">
                <i class="ph-fill ph-gift" style="color:${data.color};"></i>
                <span style="font-size:11px;font-weight:800;color:${data.color};text-transform:uppercase;letter-spacing:1px;">Bundle Package</span>
            </div>
            <h3 style="margin-bottom:4px;">${data.title}</h3>
            <p class="modal-subtitle">${data.subtitle}</p>
        </div>
        <p class="modal-desc">${data.desc}</p>

        <div style="display:flex;align-items:baseline;gap:8px;margin:20px 0 8px;flex-wrap:wrap;">
            <span style="font-size:36px;font-weight:900;color:${data.color};">${data.price}</span>
            <span style="font-size:13px;color:var(--text-muted);">${data.unit}</span>
            <span style="font-size:13px;color:var(--text-muted);text-decoration:line-through;margin-left:4px;">${data.original}</span>
            <span style="background:#10b98120;color:#10b981;font-size:10px;font-weight:800;padding:3px 8px;border-radius:6px;">SAVE ${data.savings}</span>
        </div>

        <div style="margin-top:20px;">
            <div style="font-size:12px;font-weight:800;color:var(--text-muted);text-transform:uppercase;letter-spacing:1px;margin-bottom:10px;">What's Included</div>
            ${data.includes.map(inc => `
                <div style="display:flex;justify-content:space-between;align-items:center;padding:10px 14px;border:1px solid var(--border);border-radius:10px;margin-bottom:6px;background:var(--bg-panel-alt);">
                    <div>
                        <div style="font-size:13px;font-weight:700;">${inc.product}</div>
                        <div style="font-size:11px;color:var(--text-muted);">${inc.details}</div>
                    </div>
                    <i class="ph-bold ph-check-circle" style="color:${data.color};font-size:18px;"></i>
                </div>
            `).join('')}
        </div>

        <div style="margin-top:20px;">
            <div style="font-size:12px;font-weight:800;color:var(--text-muted);text-transform:uppercase;letter-spacing:1px;margin-bottom:10px;">Bundle Bonuses</div>
            <ul style="list-style:none;padding:0;margin:0;">
                ${data.bonuses.map(b => `<li style="font-size:12px;color:var(--text-secondary);padding:4px 0;display:flex;align-items:center;gap:8px;"><i class="ph-bold ph-star" style="color:${data.color};font-size:11px;"></i>${b}</li>`).join('')}
            </ul>
        </div>

        <div style="margin-top:16px;padding:12px 14px;background:var(--bg-panel-alt);border:1px solid var(--border);border-radius:10px;">
            <div style="font-size:10px;font-weight:700;color:var(--text-muted);text-transform:uppercase;margin-bottom:4px;">Ideal For</div>
            <div style="font-size:12px;color:var(--text-secondary);">${data.ideal}</div>
        </div>

        <button onclick="handleBundlePurchase('${bundleType}')" style="width:100%;padding:14px;background:${data.color};color:white;border:none;border-radius:12px;font-size:14px;font-weight:700;cursor:pointer;transition:all 0.2s;font-family:'Inter',sans-serif;margin-top:20px;box-shadow:0 4px 16px ${data.color}44;">Get This Bundle \u2014 14-Day Free Trial</button>
        <p style="font-size:10px;color:var(--text-muted);text-align:center;margin-top:10px;">No credit card required. Cancel anytime during trial.</p>
    `;
    document.getElementById('modal-overlay').classList.add('open');
    logFeed(`Viewing: ${data.title}`, "color: var(--text-muted);");
}

function handleBundlePurchase(bundleType) {
    const data = bundleData[bundleType];
    const body = document.getElementById('modal-body');
    body.innerHTML = `
        <div style="text-align:center;margin-bottom:24px;">
            <div style="width:56px;height:56px;background:${data.color}15;color:${data.color};border-radius:16px;display:flex;align-items:center;justify-content:center;margin:0 auto 16px;font-size:28px;"><i class="ph-bold ph-gift"></i></div>
            <h3 style="margin-bottom:4px;">Get ${data.title}</h3>
            <p class="modal-subtitle">${data.subtitle}</p>
        </div>
        <div style="background:var(--bg-panel-alt);border:1px solid var(--border);border-radius:16px;padding:20px;margin-bottom:20px;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;padding-bottom:12px;border-bottom:1px solid var(--border);">
                <span style="font-size:13px;font-weight:600;">Bundle</span>
                <span style="font-size:13px;font-weight:700;">${data.title}</span>
            </div>
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;padding-bottom:12px;border-bottom:1px solid var(--border);">
                <span style="font-size:13px;font-weight:600;">Monthly Rate</span>
                <span style="font-size:13px;font-weight:700;color:${data.color};">${data.price}${data.unit}</span>
            </div>
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;padding-bottom:12px;border-bottom:1px solid var(--border);">
                <span style="font-size:13px;font-weight:600;">You Save</span>
                <span style="font-size:13px;font-weight:700;color:#10b981;">${data.savings}</span>
            </div>
            <div style="display:flex;justify-content:space-between;align-items:center;">
                <span style="font-size:13px;font-weight:600;">Trial Period</span>
                <span style="font-size:13px;font-weight:700;">14 days free</span>
            </div>
        </div>
        <div style="margin-bottom:16px;">
            <label style="font-size:11px;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:1px;display:block;margin-bottom:6px;">Organization Name</label>
            <input type="text" placeholder="e.g. San Bernardino County" style="width:100%;padding:12px 16px;border:1px solid var(--border);border-radius:12px;font-size:14px;background:var(--bg-panel-alt);color:var(--text-primary);font-family:'Inter',sans-serif;outline:none;">
        </div>
        <div style="margin-bottom:20px;">
            <label style="font-size:11px;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:1px;display:block;margin-bottom:6px;">Contact Email</label>
            <input type="email" placeholder="procurement@agency.gov" style="width:100%;padding:12px 16px;border:1px solid var(--border);border-radius:12px;font-size:14px;background:var(--bg-panel-alt);color:var(--text-primary);font-family:'Inter',sans-serif;outline:none;">
        </div>
        <button onclick="confirmBundlePurchase('${bundleType}')" style="width:100%;padding:14px;background:${data.color};color:white;border:none;border-radius:12px;font-size:14px;font-weight:700;cursor:pointer;transition:all 0.2s;font-family:'Inter',sans-serif;box-shadow:0 4px 16px ${data.color}44;">Confirm & Start Trial</button>
        <button onclick="openBundleModal('${bundleType}')" style="width:100%;padding:12px;background:transparent;border:1px solid var(--border);border-radius:12px;font-size:13px;font-weight:600;cursor:pointer;color:var(--text-secondary);margin-top:8px;font-family:'Inter',sans-serif;">\u2190 Back to Bundle Details</button>
    `;
    logFeed(`Bundle purchase flow: ${data.title}`, "color: " + data.color + "; font-weight: 700;");
    playTone(440, 0.1);
}

function confirmBundlePurchase(bundleType) {
    const data = bundleData[bundleType];
    const body = document.getElementById('modal-body');
    body.innerHTML = `
        <div style="text-align:center;padding:40px 0;">
            <div style="width:72px;height:72px;background:#10b98120;color:#10b981;border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 20px;font-size:36px;"><i class="ph-bold ph-check-circle"></i></div>
            <h3 style="font-size:22px;margin-bottom:8px;">Bundle Activated!</h3>
            <p style="font-size:14px;color:var(--text-secondary);margin-bottom:24px;">Your 14-day free trial of <strong>${data.title}</strong> is now active.</p>
            <div style="background:var(--bg-panel-alt);border:1px solid var(--border);border-radius:16px;padding:20px;text-align:left;margin-bottom:24px;">
                <div style="font-size:12px;font-weight:700;color:var(--text-muted);text-transform:uppercase;margin-bottom:12px;">Order Summary</div>
                <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--border);"><span style="font-size:13px;">Package</span><span style="font-size:13px;font-weight:700;">${data.title}</span></div>
                ${data.includes.map(inc => `<div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--border);"><span style="font-size:13px;">${inc.product}</span><span style="font-size:13px;font-weight:700;color:#10b981;">Included</span></div>`).join('')}
                <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--border);"><span style="font-size:13px;">Monthly Rate</span><span style="font-size:13px;font-weight:700;color:${data.color};">${data.price}</span></div>
                <div style="display:flex;justify-content:space-between;padding:8px 0;"><span style="font-size:13px;">Trial ends</span><span style="font-size:13px;font-weight:700;">${new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span></div>
            </div>
            <p style="font-size:12px;color:var(--text-muted);margin-bottom:20px;">A confirmation email has been sent. Your dedicated onboarding specialist will contact you within 24 hours.</p>
            <button onclick="closeModal()" style="padding:14px 32px;background:${data.color};color:white;border:none;border-radius:12px;font-size:14px;font-weight:700;cursor:pointer;font-family:'Inter',sans-serif;box-shadow:0 4px 16px ${data.color}44;">Return to Dashboard</button>
        </div>
    `;
    logFeed(`\u2705 BUNDLE CONFIRMED: ${data.title} \u2014 ${data.price}/mo`, "color: var(--success); font-weight: 900;");
    playTone(660, 0.3);
}

function closeModal() {
    document.getElementById('modal-overlay').classList.remove('open');
}

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
});

// ============ AUDIO ============

function playTone(freq, dur) {
    try {
        if (!state.audioCtx) state.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = state.audioCtx.createOscillator();
        const gain = state.audioCtx.createGain();
        osc.connect(gain);
        gain.connect(state.audioCtx.destination);
        osc.frequency.value = freq;
        osc.type = 'sine';
        gain.gain.setValueAtTime(0.08, state.audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, state.audioCtx.currentTime + dur);
        osc.start();
        osc.stop(state.audioCtx.currentTime + dur);
    } catch (e) { /* Audio not supported */ }
}

// ============ PDF EXPORT ============

async function exportPDF() {
    logFeed("Generating PDF report...", "color: var(--text-secondary);");
    try {
        const canvas = await html2canvas(document.querySelector('.main-content'), { scale: 1, useCORS: true });
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgData = canvas.toDataURL('image/png');
        const pdfW = pdf.internal.pageSize.getWidth();
        const pdfH = (canvas.height * pdfW) / canvas.width;
        pdf.addImage(imgData, 'PNG', 0, 0, pdfW, pdfH);
        pdf.save('SoCal-SMART-Report.pdf');
        logFeed("✅ PDF exported successfully", "color: var(--success); font-weight: 700;");
    } catch (e) {
        logFeed("⚠️ PDF export requires html2canvas & jsPDF", "color: var(--shield);");
    }
}
