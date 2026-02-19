<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SoCal-SMART | Unified Command & Ecosystem</title>
    
    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>
    
    <!-- Chart.js -->
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    
    <!-- Phosphor Icons -->
    <script src="https://unpkg.com/@phosphor-icons/web"></script>
    
    <!-- Leaflet Mapping -->
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    
    <!-- Chosen Palette: Inland Light Command -->
    <!-- 
         Background: Slate-50 (Light/Professional base)
         Primary Text: Slate-800
         Panels: White with soft shadows
         
         Pillar Colors:
         - IWIN (Response/Police): Indigo-600
         - Shield (Logistics/Sensor): Amber-500
         - Horizon (Intel/Data): Teal-600
    -->
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        smart: {
                            base: '#f8fafc',
                            panel: '#ffffff',
                            text: '#1e293b',
                            iwin: '#4f46e5',   /* Indigo - Response */
                            shield: '#f59e0b', /* Amber - Sensor */
                            horizon: '#0d9488' /* Teal - Intel */
                        }
                    },
                    fontFamily: {
                        sans: ['Inter', 'system-ui', 'sans-serif'],
                        mono: ['JetBrains Mono', 'Menlo', 'monospace']
                    }
                }
            }
        }
    </script>
    
    <style>
        /* Chart Container Styling - Mandatory */
        .chart-container {
            position: relative;
            width: 100%;
            max-width: 600px;
            margin-left: auto;
            margin-right: auto;
            height: 300px;
            max-height: 400px;
        }

        /* Map Styling */
        #tactical-map {
            height: 500px;
            width: 100%;
            border-radius: 1rem;
            z-index: 10;
            background: #e2e8f0; /* Placeholder color before load */
        }
        
        /* Interactive Card Hover Effects */
        .pillar-card {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            border-left-width: 6px;
        }
        .pillar-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        }
        .pillar-active {
            background-color: #eff6ff;
            border-left-color: #4f46e5;
        }

        /* Leaflet Custom Marker Pulse */
        .unit-marker {
            width: 16px;
            height: 16px;
            background: #4f46e5;
            border: 3px solid white;
            border-radius: 50%;
            box-shadow: 0 0 15px rgba(79, 70, 229, 0.6);
            animation: pulse 2s infinite;
        }
        
        .hazard-marker {
            width: 16px;
            height: 16px;
            background: #f59e0b;
            border: 3px solid white;
            border-radius: 50%;
            box-shadow: 0 0 15px rgba(245, 158, 11, 0.6);
            animation: pulse-hazard 2s infinite;
        }

        @keyframes pulse {
            0% { box-shadow: 0 0 0 0 rgba(79, 70, 229, 0.7); }
            70% { box-shadow: 0 0 0 15px rgba(79, 70, 229, 0); }
            100% { box-shadow: 0 0 0 0 rgba(79, 70, 229, 0); }
        }
        
        @keyframes pulse-hazard {
            0% { box-shadow: 0 0 0 0 rgba(245, 158, 11, 0.7); }
            70% { box-shadow: 0 0 0 15px rgba(245, 158, 11, 0); }
            100% { box-shadow: 0 0 0 0 rgba(245, 158, 11, 0); }
        }

        .custom-popup .leaflet-popup-content-wrapper {
            background: white;
            color: #1e293b;
            border-radius: 8px;
            font-size: 12px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            border: 1px solid #e2e8f0;
        }
        .custom-popup .leaflet-popup-tip { background: white; }

        /* Feed Scrollbar hiding */
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }

        .feed-item {
            animation: slideIn 0.3s ease-out;
        }
        @keyframes slideIn {
            from { opacity: 0; transform: translateX(-10px); }
            to { opacity: 1; transform: translateX(0); }
        }
    </style>

    <!-- Application Structure Plan:
         1. Header: Branding and System Status (The 3 Pillars).
         2. Executive Summary: The Value Proposition of the SoCal-SMART ecosystem.
         3. Commercial Pillars (The Goods): Detailed interactive cards for Shield, IWIN, and Horizon.
         4. Tactical Operations Hub: The functional core.
            - Left: Live Intel Feed (Terminal style but light/clean).
            - Center/Right: Interactive Leaflet Map of SoCal (LA, IE, SD).
            - Controls: "Run Integrated Simulation" to demonstrate value.
         5. Regional Profiles: Deep dive into LA vs IE vs SD operational priorities (Radar Chart).
         6. Ecosystem Analytics: ROI and Latency metrics (Line/Bar Charts).
         7. Tech Stack Footer: ArcGIS credit.
         
         WHY: This structure sells the "Goods" by showing them in action. Users first understand *what* they are buying (Pillars), then see *how* they work (Map/Sim), then see *why* they work (Analytics).
    -->

    <!-- Visualization & Content Choices:
         - Leaflet Map: Essential for "Geospatial" context. Uses light tiles for the requested aesthetic.
         - Radar Chart: Perfect for comparing multi-variable regional priorities (e.g., Port safety vs. Wildfire).
         - Line Chart: Demonstrates the "Latency Reduction" value prop of the IWIN suite.
         - Simulation: A scripted JS sequence that moves map markers and updates the DOM to mimic a live operation.
         
         CONFIRMATION: NO SVG graphics used (Phosphor Icons font). NO Mermaid JS used.
    -->
</head>
<body class="bg-smart-base text-smart-text font-sans antialiased selection:bg-indigo-100 selection:text-indigo-700">

    <!-- Navigation / Status Bar -->
    <nav class="sticky top-0 z-[1000] bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between h-16 items-center">
                <!-- Brand -->
                <div class="flex items-center gap-3">
                    <div class="bg-smart-iwin p-2 rounded-lg text-white shadow-lg shadow-indigo-500/30">
                        <i class="ph-bold ph-globe-hemisphere-west text-xl"></i>
                    </div>
                    <div>
                        <h1 class="font-black text-lg tracking-tight text-slate-900 leading-none">SoCal SMART</h1>
                        <p class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Unified Ecosystem</p>
                    </div>
                </div>

                <!-- Pillar Indicators -->
                <div class="hidden md:flex gap-8">
                    <div class="flex items-center gap-2">
                        <div class="w-2 h-2 rounded-full bg-smart-shield animate-pulse"></div>
                        <span class="text-xs font-bold text-slate-600 uppercase">Shield Active</span>
                    </div>
                    <div class="flex items-center gap-2">
                        <div class="w-2 h-2 rounded-full bg-smart-iwin"></div>
                        <span class="text-xs font-bold text-slate-600 uppercase">IWIN Ready</span>
                    </div>
                    <div class="flex items-center gap-2">
                        <div class="w-2 h-2 rounded-full bg-smart-horizon"></div>
                        <span class="text-xs font-bold text-slate-600 uppercase">Horizon Online</span>
                    </div>
                </div>

                <!-- Action -->
                <div>
                    <button onclick="scrollToSection('tactical-hub')" class="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-5 py-2.5 rounded-full transition shadow-md">
                        Open Command Deck
                    </button>
                </div>
            </div>
        </div>
    </nav>

    <!-- Main Content Container -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">

        <!-- 1. Strategic Overview -->
        <header class="text-center max-w-3xl mx-auto">
            <h2 class="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
                One Region. <span class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-teal-500">Zero Latency.</span>
            </h2>
            <p class="text-lg text-slate-600 leading-relaxed mb-8">
                The SoCal-SMART Program integrates Los Angeles, the Inland Empire, and San Diego into a single intelligent safety net. By combining private sector sensors, public safety response, and predictive data, we deliver <strong>Information When It's Needed (IWIN)</strong> across jurisdictional boundaries.
            </p>
        </header>

        <!-- 2. The Commercial Pillars (The "Goods") -->
        <section>
            <div class="flex items-center gap-2 mb-6">
                <i class="ph-duotone ph-package text-2xl text-slate-400"></i>
                <h3 class="text-xl font-bold text-slate-800">Core Ecosystem Products</h3>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                <!-- Shield (Sensor) -->
                <div class="pillar-card bg-white p-6 rounded-2xl shadow-sm border border-slate-100 border-l-smart-shield cursor-pointer group" onclick="highlightPillar('shield')">
                    <div class="flex justify-between items-start mb-4">
                        <div class="p-3 bg-amber-50 text-amber-600 rounded-xl group-hover:bg-amber-500 group-hover:text-white transition">
                            <i class="ph-fill ph-shield-check text-3xl"></i>
                        </div>
                        <span class="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-1 rounded uppercase">Sensor Layer</span>
                    </div>
                    <h4 class="text-lg font-bold text-slate-900 mb-2">SMART-Shield</h4>
                    <p class="text-sm text-slate-500 leading-relaxed">
                        **Private Security Integration.** A B2B solution for logistics hubs and ports. Geofences assets and triggers instant alerts upon unauthorized exit, feeding directly into the regional safety grid.
                    </p>
                </div>

                <!-- IWIN (Response) -->
                <div class="pillar-card bg-white p-6 rounded-2xl shadow-sm border border-slate-100 border-l-smart-iwin cursor-pointer group" onclick="highlightPillar('iwin')">
                    <div class="flex justify-between items-start mb-4">
                        <div class="p-3 bg-indigo-50 text-indigo-600 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition">
                            <i class="ph-fill ph-siren text-3xl"></i>
                        </div>
                        <span class="bg-indigo-100 text-indigo-800 text-[10px] font-bold px-2 py-1 rounded uppercase">Response Layer</span>
                    </div>
                    <h4 class="text-lg font-bold text-slate-900 mb-2">IWIN Tactical Suite</h4>
                    <p class="text-sm text-slate-500 leading-relaxed">
                        **Law Enforcement SaaS.** Replaces legacy radios with tablet-based "Digital Twins". Provides officers with 3D floor plans, HazMat data, and automated cross-county pursuit hand-offs.
                    </p>
                </div>

                <!-- Horizon (Intel) -->
                <div class="pillar-card bg-white p-6 rounded-2xl shadow-sm border border-slate-100 border-l-smart-horizon cursor-pointer group" onclick="highlightPillar('horizon')">
                    <div class="flex justify-between items-start mb-4">
                        <div class="p-3 bg-teal-50 text-teal-600 rounded-xl group-hover:bg-teal-600 group-hover:text-white transition">
                            <i class="ph-fill ph-chart-polar text-3xl"></i>
                        </div>
                        <span class="bg-teal-100 text-teal-800 text-[10px] font-bold px-2 py-1 rounded uppercase">Intel Layer</span>
                    </div>
                    <h4 class="text-lg font-bold text-slate-900 mb-2">Horizon API</h4>
                    <p class="text-sm text-slate-500 leading-relaxed">
                        **Predictive Data (DaaS).** An API for urban planners and autonomous logistics. Uses historical response data to generate dynamic risk scores and "Safe Path" routing algorithms.
                    </p>
                </div>

            </div>
        </section>

        <!-- 3. Tactical Operations Hub (The Map) -->
        <section id="tactical-hub" class="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
            <!-- Toolbar -->
            <div class="bg-slate-50 px-6 py-4 border-b border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
                <div class="flex items-center gap-3">
                    <div class="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span class="text-xs font-bold text-slate-700 uppercase tracking-wider">Live Operations: Southern California Sector</span>
                </div>
                <div class="flex gap-2">
                    <button onclick="panToRegion('la')" class="px-4 py-2 bg-white border border-slate-200 hover:border-indigo-500 hover:text-indigo-600 rounded-lg text-xs font-bold transition">LA Metro</button>
                    <button onclick="panToRegion('ie')" class="px-4 py-2 bg-white border border-slate-200 hover:border-indigo-500 hover:text-indigo-600 rounded-lg text-xs font-bold transition">Inland Empire</button>
                    <button onclick="panToRegion('sd')" class="px-4 py-2 bg-white border border-slate-200 hover:border-indigo-500 hover:text-indigo-600 rounded-lg text-xs font-bold transition">San Diego</button>
                    <div class="w-px h-8 bg-slate-300 mx-2"></div>
                    <button onclick="runSimulation()" class="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-lg shadow-indigo-200 transition flex items-center gap-2">
                        <i class="ph-bold ph-play"></i> Simulate Breach
                    </button>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-12">
                <!-- Live Intel Feed (Left) -->
                <div class="lg:col-span-4 bg-slate-50 border-r border-slate-200 p-0 flex flex-col h-[500px]">
                    <div class="p-4 border-b border-slate-200 bg-white">
                        <h4 class="text-xs font-bold text-slate-400 uppercase">Ecosystem Activity Log</h4>
                    </div>
                    <div id="intel-feed" class="flex-1 overflow-y-auto p-4 space-y-3 font-mono text-[11px] bg-slate-50 scrollbar-hide">
                        <!-- Feed items injected via JS -->
                        <div class="text-slate-400 italic text-center mt-10">System Ready. Waiting for trigger...</div>
                    </div>
                    <div class="p-4 bg-white border-t border-slate-200">
                        <div class="flex justify-between items-center mb-1">
                            <span class="text-[10px] font-bold text-slate-500 uppercase">Latency</span>
                            <span class="text-[10px] font-bold text-emerald-600">0.05ms</span>
                        </div>
                        <div class="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                            <div class="bg-emerald-500 h-full w-[98%]"></div>
                        </div>
                    </div>
                </div>

                <!-- Map Container (Right) -->
                <div class="lg:col-span-8 relative bg-slate-200">
                    <div id="tactical-map"></div>
                    
                    <!-- Map HUD Legend -->
                    <div class="absolute bottom-4 left-4 z-[1000] flex flex-col gap-2">
                        <div class="bg-white/95 backdrop-blur px-3 py-2 rounded-lg shadow-lg border border-slate-200 flex items-center gap-3">
                            <div class="w-3 h-3 rounded-full bg-indigo-600 border-2 border-white shadow-sm"></div>
                            <span class="text-[10px] font-bold text-slate-700">IWIN Police Unit</span>
                        </div>
                        <div class="bg-white/95 backdrop-blur px-3 py-2 rounded-lg shadow-lg border border-slate-200 flex items-center gap-3">
                            <div class="w-3 h-3 rounded-full bg-amber-500 border-2 border-white shadow-sm"></div>
                            <span class="text-[10px] font-bold text-slate-700">Shield Logistics Hub</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- 4. Regional Profiles & Analytics -->
        <section class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            <!-- Regional Radar Analysis -->
            <div class="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                <div class="mb-6">
                    <h3 class="text-xl font-bold text-slate-900">Regional Threat Profiles</h3>
                    <p class="text-sm text-slate-500 mt-1">
                        Each hub utilizes the SMART ecosystem differently based on local geography and industry.
                    </p>
                </div>
                <!-- Dynamic Region Selector for Chart -->
                <div class="flex gap-2 mb-4">
                    <button onclick="updateRadar('la')" class="text-[10px] font-bold uppercase px-3 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 transition">LA</button>
                    <button onclick="updateRadar('ie')" class="text-[10px] font-bold uppercase px-3 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 transition">IE</button>
                    <button onclick="updateRadar('sd')" class="text-[10px] font-bold uppercase px-3 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 transition">SD</button>
                </div>
                <div class="chart-container">
                    <canvas id="regionalRadarChart"></canvas>
                </div>
            </div>

            <!-- ROI / Latency Analytics -->
            <div class="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
                <div>
                    <h3 class="text-xl font-bold text-slate-900">Ecosystem Efficiency</h3>
                    <p class="text-sm text-slate-500 mt-1">
                        Reduction in cross-jurisdictional communication latency after implementing the IWIN Suite.
                    </p>
                </div>
                
                <div class="grid grid-cols-2 gap-4 my-6">
                    <div class="p-4 bg-indigo-50 rounded-2xl">
                        <p class="text-[10px] font-bold text-indigo-400 uppercase">Legacy System</p>
                        <p class="text-2xl font-black text-indigo-900">12m 30s</p>
                        <p class="text-xs text-indigo-600">Avg. Handoff Time</p>
                    </div>
                    <div class="p-4 bg-emerald-50 rounded-2xl">
                        <p class="text-[10px] font-bold text-emerald-400 uppercase">SMART Integrated</p>
                        <p class="text-2xl font-black text-emerald-700">0.05s</p>
                        <p class="text-xs text-emerald-600">Avg. Handoff Time</p>
                    </div>
                </div>

                <div class="chart-container h-48">
                    <canvas id="latencyLineChart"></canvas>
                </div>
            </div>
        </section>

    </main>

    <!-- Footer / Tech Stack -->
    <footer class="bg-white border-t border-slate-200 py-12 mt-12">
        <div class="max-w-7xl mx-auto px-4 text-center">
            <div class="flex justify-center items-center gap-2 mb-4 text-slate-400">
                <i class="ph-duotone ph-stack text-2xl"></i>
                <span class="font-bold text-sm tracking-widest uppercase">Powered by ArcGIS Enterprise</span>
            </div>
            <div class="flex justify-center gap-8 mb-8">
                <div class="text-center">
                    <p class="text-xs font-bold text-slate-900">ArcGIS Pro</p>
                    <p class="text-[10px] text-slate-500">Historical Analysis</p>
                </div>
                <div class="text-center">
                    <p class="text-xs font-bold text-slate-900">GeoEvent Server</p>
                    <p class="text-[10px] text-slate-500">Real-Time Engine</p>
                </div>
                <div class="text-center">
                    <p class="text-xs font-bold text-slate-900">Dashboards</p>
                    <p class="text-[10px] text-slate-500">Command Visualization</p>
                </div>
            </div>
            <p class="text-[10px] text-slate-400">
                &copy; 2026 SoCal SMART Consortium. All rights reserved. <br>
                Built for the Inland Empire, Los Angeles, and San Diego Public Safety Cooperative.
            </p>
        </div>
    </footer>

    <!-- Scripts -->
    <script>
        // --- State Management ---
        const state = {
            currentRegion: 'la',
            map: null,
            markers: {},
            radarChart: null
        };

        // --- Data Definitions ---
        const regions = {
            la: { 
                coords: [34.0522, -118.2437], 
                zoom: 10,
                stats: [90, 85, 40, 95, 50], // Port, Transit, Wildfire, Event, Border
                name: "Los Angeles Metro"
            },
            ie: { 
                coords: [34.055, -117.4], // Centered near Fontana/Ontario
                zoom: 10,
                stats: [95, 60, 90, 40, 20], // High Logistics/Wildfire
                name: "Inland Empire"
            },
            sd: { 
                coords: [32.7157, -117.1611], 
                zoom: 10,
                stats: [80, 50, 60, 70, 98], // High Border/Maritime
                name: "San Diego"
            }
        };

        // --- Initialization ---
        document.addEventListener('DOMContentLoaded', () => {
            initMap();
            initCharts();
            // Initial Feed Message
            logFeed("SoCal Unified Command online.", "text-emerald-600 font-bold");
            logFeed("Syncing 1,402 Shield Nodes...", "text-slate-500");
        });

        // --- Leaflet Map Logic ---
        function initMap() {
            // Using a light-themed tile layer (CartoDB Positron) to match the "Light Color" prompt requirement
            state.map = L.map('tactical-map', {
                zoomControl: false,
                attributionControl: false
            }).setView(regions.la.coords, 10);

            L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
                maxZoom: 19,
                subdomains: 'abcd'
            }).addTo(state.map);

            // Add Pre-defined Zones (Visuals)
            
            // LA Port Zone
            L.circle([33.74, -118.26], {
                color: '#4f46e5', // Indigo
                fillColor: '#4f46e5',
                fillOpacity: 0.1,
                radius: 6000
            }).addTo(state.map).bindPopup("<b>Port of LA</b><br>Shield Zone Active");

            // IE Logistics Zone
            L.circle([34.05, -117.45], {
                color: '#f59e0b', // Amber
                fillColor: '#f59e0b',
                fillOpacity: 0.1,
                radius: 10000
            }).addTo(state.map).bindPopup("<b>IE Logistics Corridor</b><br>Shield Zone Active");

            // SD Border Zone
            L.circle([32.54, -117.03], {
                color: '#0d9488', // Teal
                fillColor: '#0d9488',
                fillOpacity: 0.1,
                radius: 8000
            }).addTo(state.map).bindPopup("<b>San Ysidro Entry</b><br>Horizon Intel Active");
        }

        function panToRegion(code) {
            const r = regions[code];
            state.map.flyTo(r.coords, r.zoom, { duration: 1.5 });
            logFeed(`Camera refocus: ${r.name}`, "text-indigo-600 font-bold");
            updateRadar(code);
        }

        // --- Simulation Logic ---
        function runSimulation() {
            const feed = document.getElementById('intel-feed');
            feed.innerHTML = ''; // Clear feed
            logFeed("SIMULATION SEQUENCE INITIATED...", "text-slate-900 font-black");

            // 1. Trigger Shield Breach in IE
            setTimeout(() => {
                panToRegion('ie');
                logFeed("⚠️ SMART-Shield Alert: Geofence Breach", "text-amber-600 font-bold");
                logFeed("Loc: Fontana Logistics Hub B-4", "text-slate-500");
                
                // Add Hazard Marker
                const hazardIcon = L.divIcon({ className: 'hazard-marker', iconSize: [16,16] });
                const breachLoc = [34.08, -117.48];
                const marker = L.marker(breachLoc, { icon: hazardIcon }).addTo(state.map)
                    .bindPopup("Unidentified Cargo Exit").openPopup();
                
                state.markers.hazard = marker;
            }, 1000);

            // 2. IWIN Response
            setTimeout(() => {
                logFeed("📡 IWIN Suite: Dispatching Unit 7-Alpha", "text-indigo-600 font-bold");
                logFeed("Data Push: 3D Twin & Chemical Manifest", "text-slate-500");
                
                // Add Unit Marker & Animate
                const unitIcon = L.divIcon({ className: 'unit-marker', iconSize: [16,16] });
                const startLoc = [34.05, -117.40]; // Nearby patrol
                const unit = L.marker(startLoc, { icon: unitIcon }).addTo(state.map);
                state.markers.unit = unit;

                // Animate movement towards hazard
                animateMarker(unit, startLoc, [34.08, -117.48], 2000);
            }, 3000);

            // 3. Horizon Prediction
            setTimeout(() => {
                logFeed("🧠 Horizon API: Pattern Match Detected", "text-teal-600 font-bold");
                logFeed("Predictive Route: Target trending to SD Border", "text-slate-500");
                logFeed("Action: Alerting San Diego Border Patrol", "text-slate-900");
            }, 6000);
        }

        function animateMarker(marker, start, end, duration) {
            const startTime = performance.now();
            
            function step(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                const lat = start[0] + (end[0] - start[0]) * progress;
                const lng = start[1] + (end[1] - start[1]) * progress;
                
                marker.setLatLng([lat, lng]);
                
                if (progress < 1) {
                    requestAnimationFrame(step);
                } else {
                    marker.bindPopup("<b>Target Intercepted</b><br>Latency: 0.05s").openPopup();
                }
            }
            requestAnimationFrame(step);
        }

        function logFeed(msg, classes) {
            const feed = document.getElementById('intel-feed');
            const div = document.createElement('div');
            const time = new Date().toLocaleTimeString([], { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" });
            div.className = `feed-item py-1 border-b border-slate-100 ${classes}`;
            div.innerHTML = `<span class="text-slate-300 mr-2">[${time}]</span>${msg}`;
            feed.prepend(div);
        }

        // --- Chart Logic ---
        function initCharts() {
            // Radar Chart (Regional Profiles)
            const ctxRadar = document.getElementById('regionalRadarChart').getContext('2d');
            state.radarChart = new Chart(ctxRadar, {
                type: 'radar',
                data: {
                    labels: ['Logistics Security', 'Urban Transit', 'Wildfire/HazMat', 'Mass Events', 'Border Integrity'],
                    datasets: [{
                        label: 'Operational Priority',
                        data: regions.la.stats,
                        backgroundColor: 'rgba(79, 70, 229, 0.2)', // Indigo
                        borderColor: '#4f46e5',
                        borderWidth: 2,
                        pointBackgroundColor: '#4f46e5'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        r: {
                            beginAtZero: true,
                            max: 100,
                            ticks: { display: false },
                            grid: { color: '#e2e8f0' },
                            pointLabels: {
                                font: { size: 10, family: 'Inter' },
                                color: '#64748b'
                            }
                        }
                    },
                    plugins: { legend: { display: false } }
                }
            });

            // Line Chart (Latency Reduction)
            const ctxLine = document.getElementById('latencyLineChart').getContext('2d');
            new Chart(ctxLine, {
                type: 'line',
                data: {
                    labels: ['Legacy Radio', 'Digital Dispatch', 'GPS Sync', 'GeoEvent Server', 'Unified Ecosystem'],
                    datasets: [{
                        label: 'Response Latency (Seconds)',
                        data: [600, 300, 120, 10, 0.05],
                        borderColor: '#0d9488', // Teal (Horizon)
                        backgroundColor: 'rgba(13, 148, 136, 0.1)',
                        fill: true,
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: { 
                            type: 'logarithmic',
                            grid: { display: false },
                            display: false 
                        },
                        x: { grid: { display: false } }
                    },
                    plugins: { legend: { display: false } }
                }
            });
        }

        function updateRadar(code) {
            const data = regions[code].stats;
            state.radarChart.data.datasets[0].data = data;
            
            // Dynamic Colors based on region flavor
            let color = '#4f46e5'; // Default Indigo
            if (code === 'ie') color = '#f59e0b'; // Amber for Logistics
            if (code === 'sd') color = '#0d9488'; // Teal for Border
            
            state.radarChart.data.datasets[0].borderColor = color;
            state.radarChart.data.datasets[0].backgroundColor = color + '33'; // 20% opacity
            state.radarChart.data.datasets[0].pointBackgroundColor = color;
            
            state.radarChart.update();
        }

        function scrollToSection(id) {
            document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
        }

        function highlightPillar(type) {
            // Visual feedback for clicking a card
            logFeed(`Viewing Details: ${type.toUpperCase()} Module`, "text-slate-500");
            // Could add modal or detailed scroll here in future
        }

    </script>
</body>
</html>