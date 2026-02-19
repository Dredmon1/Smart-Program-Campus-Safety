import os

target = r'c:\Users\derek\OneDrive\Documents\IST4910\smart-app.js'

# Read current part 1
with open(target, 'r', encoding='utf-8') as f:
    part1 = f.read()

part2 = """
// ============ INITIALIZATION ============

document.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() {
        document.getElementById('loading-screen').classList.add('hidden');
        document.getElementById('login-screen').classList.remove('hidden');
    }, 2500);
});

function handleLogin() {
    var name = document.getElementById('login-name').value || 'Operator';
    var role = document.getElementById('login-role').value;
    state.userName = name;
    state.userRole = role;
    document.getElementById('login-screen').classList.add('hidden');
    var badge = document.getElementById('role-badge');
    if (badge) { badge.textContent = role + ' \\u2022 ' + name; badge.classList.add('visible'); }
    initMap();
    initCharts();
    initKPIObserver();
    logFeed('SoCal Unified Command online.', 'color: var(--success); font-weight: 700;');
    logFeed('Welcome, ' + role + ' ' + name + '. Syncing 1,402 Shield Nodes...', 'color: var(--text-secondary);');
}

// ============ THEME ============

function toggleTheme() {
    state.isDark = !state.isDark;
    document.documentElement.setAttribute('data-theme', state.isDark ? 'dark' : 'light');
    var icon = document.getElementById('theme-icon');
    if (icon) icon.className = state.isDark ? 'ph-bold ph-sun' : 'ph-bold ph-moon';
    if (state.radarChart) {
        [state.radarChart, state.latencyChart, state.barChart, state.doughnutChart].forEach(function(c) { if (c) c.update(); });
    }
}

// ============ MOBILE NAV ============

function openMobileNav() { document.getElementById('mobile-nav').classList.add('open'); }
function closeMobileNav() { document.getElementById('mobile-nav').classList.remove('open'); }

function scrollToSection(id) {
    var el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    closeMobileNav();
}

// ============ MAP ============

function initMap() {
    state.map = L.map('tactical-map', { zoomControl: false, attributionControl: false }).setView(regions.la.coords, 9);
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', { maxZoom: 19, subdomains: 'abcd' }).addTo(state.map);
    L.circle([33.74, -118.26], { color: '#4f46e5', fillColor: '#4f46e5', fillOpacity: 0.1, radius: 6000 }).addTo(state.map).bindPopup('<b>Port of LA</b><br>Shield Zone Active');
    L.circle([34.05, -117.45], { color: '#f59e0b', fillColor: '#f59e0b', fillOpacity: 0.1, radius: 10000 }).addTo(state.map).bindPopup('<b>IE Logistics Corridor</b><br>Shield Zone Active');
    L.circle([32.54, -117.03], { color: '#0d9488', fillColor: '#0d9488', fillOpacity: 0.1, radius: 8000 }).addTo(state.map).bindPopup('<b>San Ysidro Entry</b><br>Horizon Intel Active');
    state.layerGroups.hospitals = L.layerGroup();
    facilityData.hospitals.forEach(function(h) {
        L.marker(h.coords, { icon: L.divIcon({ className: 'hospital-marker', iconSize: [14, 14] }) }).bindPopup('<b>' + h.name + '</b><br>Trauma Center').addTo(state.layerGroups.hospitals);
    });
    state.layerGroups.fire = L.layerGroup();
    facilityData.fireStations.forEach(function(f) {
        L.marker(f.coords, { icon: L.divIcon({ className: 'fire-marker', iconSize: [14, 14] }) }).bindPopup('<b>' + f.name + '</b><br>Fire Station').addTo(state.layerGroups.fire);
    });
    if (typeof L.heatLayer === 'function') {
        state.layerGroups.heat = L.heatLayer(heatData, { radius: 30, blur: 20, maxZoom: 13 });
    }
}

function panToRegion(code) {
    var r = regions[code];
    if (!r || !state.map) return;
    state.map.flyTo(r.coords, r.zoom, { duration: 1.5 });
    logFeed('Camera refocus: ' + r.name, 'color: var(--iwin); font-weight: 700;');
    updateRadar(code);
    closeMobileNav();
}

function toggleLayer(type) {
    var btn = document.querySelector('[data-layer="' + type + '"]');
    var group = state.layerGroups[type];
    if (!group || !state.map) return;
    if (state.map.hasLayer(group)) { state.map.removeLayer(group); if (btn) btn.classList.remove('active'); }
    else { group.addTo(state.map); if (btn) btn.classList.add('active'); logFeed('Layer toggled: ' + type, 'color: var(--text-secondary);'); }
}

// ============ SIMULATION ============

function runSimulation() {
    if (state.simRunning || !state.map) return;
    state.simRunning = true;
    var scenario = breachScenarios[Math.floor(Math.random() * breachScenarios.length)];
    var breachLoc = scenario.loc;
    ['hazard','unit1','unit2','unit3','unit1_line','unit2_line','unit3_line','containment'].forEach(function(k) {
        if (state.markers[k]) { state.map.removeLayer(state.markers[k]); delete state.markers[k]; }
    });
    var feed = document.getElementById('intel-feed');
    feed.innerHTML = '';
    var timeline = document.getElementById('sim-timeline');
    timeline.classList.add('visible');
    var phases = timeline.querySelectorAll('.sim-phase');
    phases.forEach(function(p) { p.classList.remove('active', 'done'); });
    logFeed('== SIMULATION SEQUENCE INITIATED ==', 'font-weight: 900;');
    playTone(220, 0.3);
    phases[0].classList.add('active');
    setTimeout(function() {
        panToRegion(scenario.region);
        logFeed('SMART-Shield Alert: Geofence Breach', 'color: var(--shield); font-weight: 700;');
        logFeed('Loc: ' + scenario.name, 'color: var(--text-secondary);');
        logFeed('Asset: ' + scenario.asset + ' - ' + scenario.type, 'color: var(--text-secondary);');
        playTone(440, 0.2);
        state.markers.hazard = L.marker(breachLoc, { icon: L.divIcon({ className: 'hazard-marker', iconSize: [16, 16] }) }).addTo(state.map).bindPopup('Breach: ' + scenario.type).openPopup();
        phases[0].classList.remove('active'); phases[0].classList.add('done');
    }, 1500);
    setTimeout(function() {
        phases[1].classList.add('active');
        logFeed('IWIN Suite: Dispatching 3 Units', 'color: var(--iwin); font-weight: 700;');
        playTone(330, 0.15);
        var units = [
            { start: [breachLoc[0]-0.03, breachLoc[1]+0.08], id: 'unit1', label: 'Unit 7-Alpha' },
            { start: [breachLoc[0]+0.02, breachLoc[1]-0.04], id: 'unit2', label: 'Unit 3-Bravo' },
            { start: [breachLoc[0]-0.05, breachLoc[1]-0.03], id: 'unit3', label: 'Unit 12-Charlie' }
        ];
        units.forEach(function(u, i) {
            setTimeout(function() {
                var m = L.marker(u.start, { icon: L.divIcon({ className: 'unit-marker', iconSize: [16, 16] }) }).addTo(state.map);
                state.markers[u.id] = m;
                logFeed(u.label + ' en route', 'color: var(--iwin);');
                var line = L.polyline([u.start, breachLoc], { color: '#4f46e5', weight: 2, opacity: 0.5, dashArray: '6 4' }).addTo(state.map);
                state.markers[u.id + '_line'] = line;
                animateMarker(m, u.start, breachLoc, 3000);
            }, i * 600);
        });
        phases[1].classList.remove('active'); phases[1].classList.add('done');
    }, 4000);
    setTimeout(function() {
        phases[2].classList.add('active');
        logFeed('Horizon API: Pattern Match Detected', 'color: var(--horizon); font-weight: 700;');
        logFeed('Predictive Route: ' + scenario.prediction, 'color: var(--text-secondary);');
        logFeed('Alerting ' + scenario.alert, 'color: var(--text-primary);');
        playTone(550, 0.2);
        phases[2].classList.remove('active'); phases[2].classList.add('done');
    }, 8000);
    setTimeout(function() {
        phases[3].classList.add('active');
        logFeed('TARGET INTERCEPTED - Latency: 0.05s', 'color: var(--success); font-weight: 900;');
        playTone(660, 0.3);
        var cont = L.circle(breachLoc, { color: '#10b981', fillColor: '#10b981', fillOpacity: 0.15, radius: 100 }).addTo(state.map);
        state.markers.containment = cont;
        var rad = 100;
        var iv = setInterval(function() {
            rad += 200; cont.setRadius(rad);
            if (rad >= 2000) { clearInterval(iv); phases[3].classList.remove('active'); phases[3].classList.add('done'); state.simRunning = false; }
        }, 50);
    }, 10000);
}

function animateMarker(marker, start, end, duration) {
    var startTime = performance.now();
    function step(now) {
        var p = Math.min((now - startTime) / duration, 1);
        var eased = p < 0.5 ? 2*p*p : 1 - Math.pow(-2*p+2, 2)/2;
        marker.setLatLng([start[0]+(end[0]-start[0])*eased, start[1]+(end[1]-start[1])*eased]);
        if (p < 1) requestAnimationFrame(step);
        else marker.bindPopup('<b>Target Intercepted</b><br>Latency: 0.05s').openPopup();
    }
    requestAnimationFrame(step);
}

// ============ LIVE MODE ============

function toggleLiveMode() {
    state.liveMode = !state.liveMode;
    var btn = document.getElementById('live-mode-btn');
    if (state.liveMode) {
        btn.classList.add('active'); btn.textContent = 'Stop Live';
        logFeed('Live Mode: ACTIVATED', 'color: var(--success); font-weight: 700;');
        state.liveModeInterval = setInterval(spawnRandomEvent, 3000);
    } else {
        btn.classList.remove('active'); btn.textContent = '\\u25B6 Live Mode';
        logFeed('Live Mode: Deactivated', 'color: var(--text-muted);');
        clearInterval(state.liveModeInterval);
    }
}

function spawnRandomEvent() {
    var events = [
        { msg: 'Patrol check-in: Unit 4-Delta, Sector 7', style: 'color: var(--iwin);' },
        { msg: 'Shield ping: Sensor Node 842, Normal', style: 'color: var(--shield);' },
        { msg: 'Traffic flow: I-10 Corridor clear', style: 'color: var(--success);' },
        { msg: 'Speed anomaly: SR-60 Eastbound flagged', style: 'color: var(--iwin);' },
        { msg: 'Cargo scan: Port of LA Gate 3, Cleared', style: 'color: var(--shield);' }
    ];
    var e = events[Math.floor(Math.random() * events.length)];
    logFeed(e.msg, e.style);
    if (state.map) {
        var lat = 32.5+Math.random()*2, lng = -118.5+Math.random()*1.5;
        var blip = L.circleMarker([lat,lng], { radius:6, color:'#4f46e5', fillColor:'#4f46e5', fillOpacity:0.5, weight:1 }).addTo(state.map);
        setTimeout(function() { state.map.removeLayer(blip); }, 4000);
    }
}

// ============ FEED ============

function logFeed(msg, style) {
    var feed = document.getElementById('intel-feed');
    if (!feed) return;
    var ph = feed.querySelector('.feed-placeholder');
    if (ph) ph.remove();
    var div = document.createElement('div');
    var time = new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
    div.className = 'feed-item';
    if (style) div.setAttribute('style', style);
    div.innerHTML = '<span class="feed-time">[' + time + ']</span>' + msg;
    feed.prepend(div);
}

function filterFeed() {
    var query = document.getElementById('feed-search').value.toLowerCase();
    document.querySelectorAll('.feed-item').forEach(function(item) {
        item.style.display = (item.textContent.toLowerCase().indexOf(query) !== -1 || query === '') ? '' : 'none';
    });
}
"""

part3 = """
// ============ CHARTS ============

function initCharts() {
    var gridColor = 'rgba(148,163,184,0.15)';
    var labelColor = '#64748b';

    var ctxR = document.getElementById('radarChart').getContext('2d');
    state.radarChart = new Chart(ctxR, {
        type: 'radar',
        data: {
            labels: ['Logistics', 'Transit', 'Wildfire', 'Events', 'Border'],
            datasets: [{ label: 'Priority', data: regions.la.stats, backgroundColor: 'rgba(79,70,229,0.15)', borderColor: '#4f46e5', borderWidth: 2, pointBackgroundColor: '#4f46e5', pointRadius: 4 }]
        },
        options: { responsive: true, maintainAspectRatio: false, scales: { r: { beginAtZero: true, max: 100, ticks: { display: false }, grid: { color: gridColor }, pointLabels: { font: { size: 11, family: 'Inter' }, color: labelColor } } }, plugins: { legend: { display: false } } }
    });

    var ctxL = document.getElementById('latencyChart').getContext('2d');
    state.latencyChart = new Chart(ctxL, {
        type: 'line',
        data: {
            labels: ['Legacy Radio', 'Digital Dispatch', 'GPS Sync', 'GeoEvent Server', 'Unified Ecosystem'],
            datasets: [{ label: 'Latency (s)', data: [600, 300, 120, 10, 0.05], borderColor: '#0d9488', backgroundColor: 'rgba(13,148,136,0.1)', fill: true, tension: 0.4, pointRadius: 5, pointBackgroundColor: '#0d9488' }]
        },
        options: { responsive: true, maintainAspectRatio: false, scales: { y: { type: 'logarithmic', display: false }, x: { grid: { display: false }, ticks: { font: { size: 10 }, color: labelColor } } }, plugins: { legend: { display: false } } }
    });

    var ctxB = document.getElementById('barChart').getContext('2d');
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
        options: { responsive: true, maintainAspectRatio: false, scales: { y: { grid: { color: gridColor }, ticks: { font: { size: 10 }, color: labelColor } }, x: { grid: { display: false }, ticks: { font: { size: 11 }, color: labelColor } } }, plugins: { legend: { position: 'top', labels: { boxWidth: 12, font: { size: 11 }, padding: 16 } } } }
    });

    var ctxD = document.getElementById('doughnutChart').getContext('2d');
    state.doughnutChart = new Chart(ctxD, {
        type: 'doughnut',
        data: {
            labels: ['Logistics', 'Transit', 'Wildfire', 'Border', 'Events'],
            datasets: [{ data: [32, 22, 18, 16, 12], backgroundColor: ['#4f46e5', '#6366f1', '#f59e0b', '#0d9488', '#10b981'], borderWidth: 0, spacing: 3, borderRadius: 4 }]
        },
        options: { responsive: true, maintainAspectRatio: false, cutout: '65%', plugins: { legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 11 }, padding: 12 } } } }
    });
}

function updateRadar(code) {
    var data = regions[code].stats;
    state.radarChart.data.datasets[0].data = data;
    var color = '#4f46e5';
    if (code === 'ie') color = '#f59e0b';
    if (code === 'sd') color = '#0d9488';
    state.radarChart.data.datasets[0].borderColor = color;
    state.radarChart.data.datasets[0].backgroundColor = color + '26';
    state.radarChart.data.datasets[0].pointBackgroundColor = color;
    state.radarChart.update();
}

function updateLatencyRange(range) {
    var datasets = { '24h': [120,80,40,5,0.05], '7d': [300,200,100,8,0.05], '30d': [600,300,120,10,0.05] };
    state.latencyChart.data.datasets[0].data = datasets[range] || datasets['30d'];
    state.latencyChart.update();
    document.querySelectorAll('.latency-btn').forEach(function(b) { b.classList.remove('active'); });
    var activeBtn = document.querySelector('[data-range="' + range + '"]');
    if (activeBtn) activeBtn.classList.add('active');
}

// ============ KPI COUNTERS ============

function initKPIObserver() {
    var kpis = document.querySelectorAll('.kpi-value');
    var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting && !entry.target.dataset.animated) {
                entry.target.dataset.animated = 'true';
                animateCounter(entry.target);
            }
        });
    }, { threshold: 0.3 });
    kpis.forEach(function(el) { observer.observe(el); });
}

function animateCounter(el) {
    var target = parseFloat(el.dataset.target);
    var suffix = el.dataset.suffix || '';
    var prefix = el.dataset.prefix || '';
    var decimals = el.dataset.decimals ? parseInt(el.dataset.decimals) : 0;
    var duration = 1500;
    var start = performance.now();
    function step(now) {
        var p = Math.min((now - start) / duration, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        var val = (target * eased).toFixed(decimals);
        el.textContent = prefix + Number(val).toLocaleString() + suffix;
        if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
}
"""

part4 = '''
// ============ MODALS ============

function openPillarModal(type) {
    var data = pillarData[type];
    if (!data) return;
    var body = document.getElementById('modal-body');
    var featuresHtml = data.features.map(function(f) { return '<li><i class="ph-bold ph-check-circle"></i> ' + f + '</li>'; }).join('');
    var pricingHtml = data.pricing.map(function(tier) {
        var popLabel = tier.popular ? '<span style="position:absolute;top:-10px;right:16px;background:' + data.color + ';color:white;font-size:9px;font-weight:800;padding:3px 10px;border-radius:6px;text-transform:uppercase;letter-spacing:1px;">Most Popular</span>' : '';
        var hlHtml = tier.highlights.map(function(h) { return '<li style="font-size:12px;color:var(--text-secondary);padding:3px 0;display:flex;align-items:center;gap:6px;"><i class="ph-bold ph-check" style="color:' + data.color + ';font-size:12px;"></i>' + h + '</li>'; }).join('');
        var btnStyle = tier.popular ? 'background:' + data.color + ';color:white;box-shadow:0 4px 12px ' + data.color + '44;' : 'background:var(--bg-panel);border:1px solid var(--border);color:var(--text-primary);';
        return '<div style="border:' + (tier.popular ? '2px solid ' + data.color : '1px solid var(--border)') + ';border-radius:16px;padding:20px;position:relative;background:var(--bg-panel-alt);">' + popLabel + '<div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px;"><div><div style="font-size:14px;font-weight:700;">' + tier.name + '</div><div style="font-size:11px;color:var(--text-muted);">' + tier.desc + '</div></div><div style="text-align:right;"><span style="font-size:28px;font-weight:900;color:' + data.color + ';">' + tier.price + '</span><span style="font-size:11px;color:var(--text-muted);">' + tier.unit + '</span></div></div><ul style="list-style:none;padding:0;margin:12px 0;">' + hlHtml + '</ul><button onclick="addToCart(\\'' + type + '\\',\\'' + tier.name + '\\',\\'' + tier.price + '\\',\\'' + tier.unit + '\\')" style="width:100%;padding:12px;border-radius:10px;border:none;font-size:13px;font-weight:700;cursor:pointer;font-family:Inter,sans-serif;' + btnStyle + '">' + tier.cta + '</button></div>';
    }).join('');
    body.innerHTML = '<h3>' + data.title + '</h3><p class="modal-subtitle">' + data.subtitle + '</p><p class="modal-desc">' + data.desc + '</p><ul class="modal-features">' + featuresHtml + '</ul><div style="margin-top:28px;margin-bottom:8px;"><h4 style="font-size:16px;font-weight:800;margin-bottom:4px;">Choose Your Plan</h4><p style="font-size:12px;color:var(--text-muted);">All plans include a 14-day free trial.</p></div><div style="display:flex;flex-direction:column;gap:12px;">' + pricingHtml + '</div>';
    document.getElementById('modal-overlay').classList.add('open');
    logFeed('Viewing: ' + data.title + ' pricing', 'color: var(--text-muted);');
}

function openBundleModal(bundleType) {
    var data = bundleData[bundleType];
    if (!data) return;
    var body = document.getElementById('modal-body');
    var includesHtml = data.includes.map(function(inc) {
        return '<div style="display:flex;justify-content:space-between;align-items:center;padding:10px 14px;border:1px solid var(--border);border-radius:10px;margin-bottom:6px;background:var(--bg-panel-alt);"><div><div style="font-size:13px;font-weight:700;">' + inc.product + '</div><div style="font-size:11px;color:var(--text-muted);">' + inc.details + '</div></div><i class="ph-bold ph-check-circle" style="color:' + data.color + ';font-size:18px;"></i></div>';
    }).join('');
    var bonusHtml = data.bonuses.map(function(b) { return '<li style="font-size:12px;color:var(--text-secondary);padding:4px 0;display:flex;align-items:center;gap:8px;"><i class="ph-bold ph-star" style="color:' + data.color + ';font-size:11px;"></i>' + b + '</li>'; }).join('');
    body.innerHTML = '<div style="text-align:center;margin-bottom:20px;"><div style="display:inline-flex;align-items:center;gap:8px;background:' + data.color + '15;padding:6px 16px;border-radius:8px;margin-bottom:12px;"><i class="ph-fill ph-gift" style="color:' + data.color + ';"></i><span style="font-size:11px;font-weight:800;color:' + data.color + ';text-transform:uppercase;letter-spacing:1px;">Bundle Package</span></div><h3>' + data.title + '</h3><p class="modal-subtitle">' + data.subtitle + '</p></div><p class="modal-desc">' + data.desc + '</p><div style="display:flex;align-items:baseline;gap:8px;margin:20px 0 8px;flex-wrap:wrap;"><span style="font-size:36px;font-weight:900;color:' + data.color + ';">' + data.price + '</span><span style="font-size:13px;color:var(--text-muted);">' + data.unit + '</span><span style="font-size:13px;color:var(--text-muted);text-decoration:line-through;margin-left:4px;">' + data.original + '</span><span style="background:#10b98120;color:#10b981;font-size:10px;font-weight:800;padding:3px 8px;border-radius:6px;">SAVE ' + data.savings + '</span></div><div style="margin-top:20px;"><div style="font-size:12px;font-weight:800;color:var(--text-muted);text-transform:uppercase;letter-spacing:1px;margin-bottom:10px;">Included</div>' + includesHtml + '</div><div style="margin-top:20px;"><div style="font-size:12px;font-weight:800;color:var(--text-muted);text-transform:uppercase;letter-spacing:1px;margin-bottom:10px;">Bonuses</div><ul style="list-style:none;padding:0;">' + bonusHtml + '</ul></div><button onclick="addBundleToCart(\\'' + bundleType + '\\')" style="width:100%;padding:14px;background:' + data.color + ';color:white;border:none;border-radius:12px;font-size:14px;font-weight:700;cursor:pointer;font-family:Inter,sans-serif;margin-top:20px;box-shadow:0 4px 16px ' + data.color + '44;">Add to Cart</button>';
    document.getElementById('modal-overlay').classList.add('open');
    logFeed('Viewing: ' + data.title, 'color: var(--text-muted);');
}

function closeModal() { document.getElementById('modal-overlay').classList.remove('open'); }
document.addEventListener('keydown', function(e) { if (e.key === 'Escape') closeModal(); });

// ============ SHOPPING CART ============

function addToCart(productType, tierName, price, unit) {
    state.cart.push({ type: 'product', product: pillarData[productType].title, tier: tierName, price: price, unit: unit, color: pillarData[productType].color });
    updateCartBadge();
    logFeed('Added to cart: ' + pillarData[productType].title + ' ' + tierName, 'color: var(--success); font-weight: 700;');
    playTone(440, 0.1);
    closeModal();
    showCartNotification(pillarData[productType].title + ' ' + tierName + ' added to cart!');
}

function addBundleToCart(bundleType) {
    var data = bundleData[bundleType];
    state.cart.push({ type: 'bundle', product: data.title, price: data.price, unit: data.unit, color: data.color, savings: data.savings });
    updateCartBadge();
    logFeed('Added to cart: ' + data.title, 'color: var(--success); font-weight: 700;');
    playTone(440, 0.1);
    closeModal();
    showCartNotification(data.title + ' added to cart!');
}

function updateCartBadge() {
    var badge = document.getElementById('cart-count');
    if (badge) { badge.textContent = state.cart.length; badge.style.display = state.cart.length > 0 ? 'flex' : 'none'; }
}

function showCartNotification(msg) {
    var toast = document.createElement('div');
    toast.style.cssText = 'position:fixed;top:80px;right:24px;background:var(--bg-panel);border:1px solid var(--border);border-radius:12px;padding:14px 20px;box-shadow:0 10px 25px rgba(0,0,0,0.15);z-index:99999;font-size:13px;font-weight:600;display:flex;align-items:center;gap:8px;animation:feedSlide 0.3s ease-out;color:var(--text-primary);';
    toast.innerHTML = '<i class="ph-bold ph-check-circle" style="color:#10b981;font-size:18px;"></i>' + msg;
    document.body.appendChild(toast);
    setTimeout(function() { toast.style.opacity = '0'; toast.style.transition = 'opacity 0.3s'; setTimeout(function() { toast.remove(); }, 300); }, 3000);
}

function openCart() {
    var body = document.getElementById('modal-body');
    if (state.cart.length === 0) {
        body.innerHTML = '<div style="text-align:center;padding:60px 0;"><div style="width:72px;height:72px;background:var(--bg-panel-alt);border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 20px;font-size:32px;color:var(--text-muted);"><i class="ph-bold ph-shopping-cart"></i></div><h3 style="margin-bottom:8px;">Your Cart is Empty</h3><p style="font-size:14px;color:var(--text-secondary);">Browse products or bundles to add items.</p><button onclick="closeModal()" style="margin-top:20px;padding:12px 24px;background:var(--iwin);color:white;border:none;border-radius:10px;font-size:13px;font-weight:700;cursor:pointer;font-family:Inter,sans-serif;">Browse Products</button></div>';
    } else {
        var itemsHtml = state.cart.map(function(item, idx) {
            return '<div style="display:flex;justify-content:space-between;align-items:center;padding:14px;border:1px solid var(--border);border-radius:12px;margin-bottom:8px;background:var(--bg-panel-alt);"><div><div style="font-size:14px;font-weight:700;">' + item.product + (item.tier ? ' - ' + item.tier : '') + '</div><div style="font-size:13px;color:' + item.color + ';font-weight:700;">' + item.price + '<span style="font-size:11px;color:var(--text-muted);font-weight:400;">' + item.unit + '</span></div>' + (item.savings ? '<div style="font-size:11px;color:#10b981;">Save ' + item.savings + '</div>' : '') + '</div><button onclick="removeFromCart(' + idx + ')" style="width:32px;height:32px;border-radius:8px;border:1px solid var(--border);background:var(--bg-panel);cursor:pointer;color:var(--danger);display:flex;align-items:center;justify-content:center;font-size:16px;"><i class="ph-bold ph-trash"></i></button></div>';
        }).join('');
        body.innerHTML = '<div style="display:flex;align-items:center;gap:10px;margin-bottom:20px;"><i class="ph-bold ph-shopping-cart" style="font-size:24px;color:var(--iwin);"></i><h3 style="margin:0;">Your Cart (' + state.cart.length + ')</h3></div>' + itemsHtml + '<div style="margin-top:20px;padding:16px;background:var(--bg-panel-alt);border:1px solid var(--border);border-radius:12px;"><div style="display:flex;justify-content:space-between;margin-bottom:8px;"><span style="font-size:14px;font-weight:600;">Items</span><span style="font-size:14px;font-weight:700;">' + state.cart.length + '</span></div><div style="display:flex;justify-content:space-between;"><span style="font-size:14px;font-weight:600;">Trial Period</span><span style="font-size:14px;font-weight:700;">14 days free</span></div></div><button onclick="checkout()" style="width:100%;padding:14px;background:var(--iwin);color:white;border:none;border-radius:12px;font-size:14px;font-weight:700;cursor:pointer;font-family:Inter,sans-serif;margin-top:16px;box-shadow:0 4px 16px rgba(79,70,229,0.3);">Proceed to Checkout</button><button onclick="clearCart()" style="width:100%;padding:12px;background:transparent;border:1px solid var(--border);border-radius:12px;font-size:13px;font-weight:600;cursor:pointer;color:var(--text-secondary);margin-top:8px;font-family:Inter,sans-serif;">Clear Cart</button>';
    }
    document.getElementById('modal-overlay').classList.add('open');
}

function removeFromCart(idx) { state.cart.splice(idx, 1); updateCartBadge(); openCart(); }
function clearCart() { state.cart = []; updateCartBadge(); openCart(); }

function checkout() {
    var body = document.getElementById('modal-body');
    body.innerHTML = '<div style="text-align:center;padding:40px 0;"><div style="width:72px;height:72px;background:#10b98120;color:#10b981;border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 20px;font-size:36px;"><i class="ph-bold ph-check-circle"></i></div><h3 style="font-size:22px;margin-bottom:8px;">Order Confirmed!</h3><p style="font-size:14px;color:var(--text-secondary);margin-bottom:24px;">Your 14-day free trial is now active for all ' + state.cart.length + ' item(s).</p><p style="font-size:12px;color:var(--text-muted);margin-bottom:20px;">A confirmation email will be sent. Our team will contact you within 24 hours.</p><button onclick="state.cart=[];updateCartBadge();closeModal();" style="padding:14px 32px;background:var(--iwin);color:white;border:none;border-radius:12px;font-size:14px;font-weight:700;cursor:pointer;font-family:Inter,sans-serif;box-shadow:0 4px 16px rgba(79,70,229,0.3);">Return to Dashboard</button></div>';
    logFeed('ORDER CONFIRMED: ' + state.cart.length + ' item(s)', 'color: var(--success); font-weight: 900;');
    playTone(660, 0.3);
}

// ============ AUDIO ============

function playTone(freq, dur) {
    try {
        if (!state.audioCtx) state.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        var osc = state.audioCtx.createOscillator();
        var gain = state.audioCtx.createGain();
        osc.connect(gain); gain.connect(state.audioCtx.destination);
        osc.frequency.value = freq; osc.type = 'sine';
        gain.gain.setValueAtTime(0.08, state.audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, state.audioCtx.currentTime + dur);
        osc.start(); osc.stop(state.audioCtx.currentTime + dur);
    } catch (e) {}
}

// ============ PDF EXPORT ============

function exportPDF() {
    logFeed('Generating PDF report...', 'color: var(--text-secondary);');
    try {
        html2canvas(document.querySelector('.main-content'), { scale: 1, useCORS: true }).then(function(canvas) {
            var jsPDF = window.jspdf.jsPDF;
            var pdf = new jsPDF('p', 'mm', 'a4');
            var imgData = canvas.toDataURL('image/png');
            var pdfW = pdf.internal.pageSize.getWidth();
            var pdfH = (canvas.height * pdfW) / canvas.width;
            pdf.addImage(imgData, 'PNG', 0, 0, pdfW, pdfH);
            pdf.save('SoCal-SMART-Report.pdf');
            logFeed('PDF exported successfully', 'color: var(--success); font-weight: 700;');
        });
    } catch (e) {
        logFeed('PDF export requires html2canvas & jsPDF', 'color: var(--shield);');
    }
}
'''

with open(target, 'w', encoding='utf-8', newline='\n') as f:
    f.write(part1)
    f.write(part2)
    f.write(part3)
    f.write(part4)

print('Total written:', len(part1) + len(part2) + len(part3) + len(part4), 'chars')
