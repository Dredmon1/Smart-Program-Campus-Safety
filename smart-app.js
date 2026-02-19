// ========================================
// SoCal-SMART Unified Command - App Logic
// ========================================

const state = {
    currentRegion: 'la', map: null, markers: {}, layerGroups: {},
    radarChart: null, latencyChart: null, barChart: null, doughnutChart: null,
    isDark: false, liveMode: false, liveModeInterval: null, simRunning: false,
    audioCtx: null, userName: 'Operator', userRole: 'Commander', cart: []
};

const regions = {
    la: { coords: [34.0522, -118.2437], zoom: 10, stats: [90, 85, 40, 95, 50], name: 'Los Angeles Metro' },
    oc: { coords: [33.6846, -117.8265], zoom: 11, stats: [75, 90, 45, 95, 30], name: 'Orange County' },
    ie: { coords: [34.055, -117.4], zoom: 10, stats: [95, 60, 90, 40, 20], name: 'Inland Empire' },
    sd: { coords: [32.7157, -117.1611], zoom: 10, stats: [80, 50, 60, 70, 98], name: 'San Diego' }
};

const pillarData = {
    shield: {
        title: 'SMART-Shield', subtitle: 'Sensor & Logistics Layer', color: '#f59e0b',
        desc: 'A B2B private security integration platform for logistics hubs, ports, and critical infrastructure.',
        features: ['Automated geofence perimeter alerts', 'Real-time cargo tracking & manifest verification', 'Thermal & motion sensor array integration', 'Cross-dock anomaly detection AI', 'Private-to-public handoff protocols', 'Compliance-ready audit trails'],
        pricing: [
            { name: 'Starter', price: '$18', unit: '/node/month', desc: 'Up to 50 sensor nodes', highlights: ['Geofence alerts', 'Basic cargo tracking', 'Email notifications', '8x5 support'], cta: 'Start Free Trial' },
            { name: 'Professional', price: '$12', unit: '/node/month', desc: '50-500 nodes', highlights: ['Everything in Starter', 'AI anomaly detection', 'Public safety handoff', '24/7 SOC monitoring'], cta: 'Get Started', popular: true },
            { name: 'Enterprise', price: '$7', unit: '/node/month', desc: '500+ nodes', highlights: ['Everything in Professional', 'Dedicated account team', 'Custom integrations', 'SLA guarantee 99.99%'], cta: 'Contact Sales' }
        ]
    },
    iwin: {
        title: 'IWIN Tactical Suite', subtitle: 'Response & Law Enforcement Layer', color: '#4f46e5',
        desc: 'Information When It Is Needed - a law enforcement SaaS platform replacing legacy radio dispatch with tablet-based Digital Twins.',
        features: ['Digital Twin building pre-plans', '3D interior navigation for first responders', 'Cross-jurisdictional pursuit auto-handoff', 'HazMat chemical manifest lookup', 'Real-time unit positioning & dispatch', 'Body-cam integration & evidence sync'],
        pricing: [
            { name: 'Patrol', price: '$45', unit: '/seat/month', desc: 'Per officer', highlights: ['GPS dispatch & tracking', 'Digital radio replacement', 'Incident logging', 'Standard support'], cta: 'Start Free Trial' },
            { name: 'Tactical', price: '$89', unit: '/seat/month', desc: 'Per officer', highlights: ['Everything in Patrol', '3D Digital Twin access', 'HazMat manifest lookup', 'Cross-county handoff'], cta: 'Get Started', popular: true },
            { name: 'Command', price: '$149', unit: '/seat/month', desc: 'Per officer, Multi-agency', highlights: ['Everything in Tactical', 'Body-cam sync & evidence', 'Full analytics dashboard', 'Dedicated CSM + training'], cta: 'Contact Sales' }
        ]
    },
    horizon: {
        title: 'Horizon API', subtitle: 'Predictive Intelligence Layer', color: '#0d9488',
        desc: 'A Data-as-a-Service API for urban planners, autonomous logistics, and insurance actuaries.',
        features: ['Dynamic regional risk scoring API', 'Safe Path routing for autonomous vehicles', 'Predictive incident modeling (72h lookahead)', 'Urban planning heat-density analysis', 'Insurance actuary risk feeds', 'Historical trend pattern matching'],
        pricing: [
            { name: 'Developer', price: '$199', unit: '/month', desc: '10,000 API calls', highlights: ['Risk score endpoints', 'Sandbox environment', 'Community support', 'Basic rate limits'], cta: 'Start Free Trial' },
            { name: 'Growth', price: '$499', unit: '/month', desc: '100,000 API calls', highlights: ['Everything in Developer', 'Safe Path routing', 'Predictive modeling', 'Priority support'], cta: 'Get Started', popular: true },
            { name: 'Enterprise', price: '$999', unit: '/month', desc: 'Unlimited calls', highlights: ['Everything in Growth', 'Dedicated infrastructure', 'Custom model training', 'Premium SLA + CSM'], cta: 'Contact Sales' }
        ]
    },
    cyberguard: {
        title: 'CyberGuard SOC', subtitle: 'Security Operations Center', color: '#dc2626',
        desc: 'Managed 24/7 security monitoring service for agencies without in-house SOC teams. Threat detection, incident response, and compliance reporting.',
        features: ['24/7 SIEM monitoring & alerting', 'Automated threat hunting & triage', 'Incident response playbooks', 'Vulnerability scanning & patching', 'Compliance audit reports (CJIS, NIST)', 'Dark web credential monitoring'],
        pricing: [
            { name: 'Basic', price: '$299', unit: '/month', desc: 'Per agency', highlights: ['SIEM monitoring', 'Email alerts', 'Monthly reports', 'Business hours support'], cta: 'Start Free Trial' },
            { name: 'Advanced', price: '$599', unit: '/month', desc: 'Per agency', highlights: ['Everything in Basic', 'Threat hunting', 'Incident response', '24/7 monitoring'], cta: 'Get Started', popular: true },
            { name: '24/7 Elite', price: '$999', unit: '/month', desc: 'Per agency', highlights: ['Everything in Advanced', 'Dedicated analyst team', 'Pen testing quarterly', 'Compliance guarantee'], cta: 'Contact Sales' }
        ]
    },
    trainforce: {
        title: 'TrainForce Academy', subtitle: 'Training & Certification Platform', color: '#8b5cf6',
        desc: 'Online training and certification platform for all SCS products. Video courses, simulation labs, and compliance certifications with progress tracking.',
        features: ['Interactive video course library', 'Hands-on simulation labs', 'CJIS & POST compliance modules', 'Progress tracking & analytics', 'Certifications with digital badges', 'Custom agency curricula'],
        pricing: [
            { name: 'Individual', price: '$29', unit: '/user/month', desc: 'Single user', highlights: ['Full course library', 'Simulation labs', 'Basic certifications', 'Self-paced learning'], cta: 'Start Free Trial' },
            { name: 'Agency', price: '$19', unit: '/user/month', desc: '25+ users', highlights: ['Everything in Individual', 'Admin dashboard', 'Compliance tracking', 'Custom curricula'], cta: 'Get Started', popular: true },
            { name: 'Enterprise', price: '$49', unit: '/user/month', desc: 'Unlimited + LMS', highlights: ['Everything in Agency', 'White-label LMS', 'Dedicated trainer', 'On-site workshops'], cta: 'Contact Sales' }
        ]
    }
};

const facilityData = {
    hospitals: [
        { coords: [34.0628, -118.2603], name: 'LA County + USC Medical Center', type: 'Level I Trauma', beds: 600 },
        { coords: [34.0736, -118.3800], name: 'Cedars-Sinai Medical Center', type: 'Level I Trauma', beds: 886 },
        { coords: [34.0663, -118.4464], name: 'UCLA Ronald Reagan Medical', type: 'Level I Trauma', beds: 520 },
        { coords: [34.0590, -118.2009], name: 'Keck Hospital of USC', type: 'Research Hospital', beds: 401 },
        { coords: [34.1478, -118.1445], name: 'Huntington Memorial Hospital', type: 'Level II Trauma', beds: 619 },
        { coords: [34.0720, -117.3255], name: 'Loma Linda University Medical', type: 'Level I Trauma', beds: 900 },
        { coords: [34.0552, -117.1924], name: 'Community Hospital San Bernardino', type: 'Level II Trauma', beds: 373 },
        { coords: [32.7580, -117.1600], name: 'UC San Diego Health', type: 'Level I Trauma', beds: 808 },
        { coords: [33.7850, -118.1140], name: 'Long Beach Memorial Medical', type: 'Level II Trauma', beds: 462 },
        { coords: [33.6400, -117.8500], name: 'UCI Medical Center', type: 'Level I Trauma', beds: 417 },
        { coords: [33.7700, -118.1936], name: 'St. Mary Medical Center', type: 'General', beds: 389 },
        { coords: [33.8750, -117.9064], name: 'St. Joseph Hospital Orange', type: 'Level II Trauma', beds: 525 },
        { coords: [33.8361, -117.9147], name: 'CHOC Children\'s Hospital', type: 'Pediatric Trauma', beds: 334 },
        { coords: [33.7589, -117.8452], name: 'Kaiser Permanente Irvine', type: 'HMO Medical Center', beds: 300 },
        { coords: [33.9192, -118.2326], name: 'Kaiser Permanente Downey', type: 'HMO Medical Center', beds: 342 },
        { coords: [34.1390, -117.9862], name: 'Kaiser Permanente Fontana', type: 'HMO Medical Center', beds: 490 },
        { coords: [33.1959, -117.3795], name: 'Scripps Memorial Encinitas', type: 'Level III Trauma', beds: 194 },
        { coords: [32.7990, -117.1542], name: 'Sharp Memorial Hospital', type: 'Level II Trauma', beds: 457 },
        { coords: [32.7270, -117.1573], name: 'Rady Children\'s Hospital SD', type: 'Pediatric Trauma', beds: 524 },
        { coords: [33.9534, -118.3875], name: 'Centinela Hospital Medical', type: 'Level II Trauma', beds: 369 }
    ],
    fireStations: [
        { coords: [34.0553, -118.2468], name: 'LAFD Station 9', dept: 'Los Angeles FD', type: 'Engine + Truck' },
        { coords: [34.0481, -118.2588], name: 'LAFD Station 10', dept: 'Los Angeles FD', type: 'Engine + Rescue' },
        { coords: [34.0826, -118.3445], name: 'LAFD Station 27', dept: 'Los Angeles FD', type: 'Engine + Hazmat' },
        { coords: [34.0258, -118.3964], name: 'LAFD Station 59', dept: 'Los Angeles FD', type: 'Engine + ALS' },
        { coords: [33.9420, -118.4065], name: 'LAFD Station 51', dept: 'Los Angeles FD', type: 'Engine + Truck' },
        { coords: [33.9425, -118.2551], name: 'Inglewood Fire Station 1', dept: 'Inglewood FD', type: 'Engine + Ladder' },
        { coords: [33.7175, -117.8311], name: 'OCFA Station 19 Tustin', dept: 'OC Fire Authority', type: 'Engine + Medic' },
        { coords: [33.8314, -117.9261], name: 'OCFA Station 22 Orange', dept: 'OC Fire Authority', type: 'Engine + Truck' },
        { coords: [33.6536, -117.8319], name: 'OCFA Station 56 Irvine', dept: 'OC Fire Authority', type: 'Engine + Medic' },
        { coords: [33.5908, -117.8732], name: 'OCFA Station 43 Laguna Hills', dept: 'OC Fire Authority', type: 'Engine + Brush' },
        { coords: [34.1015, -117.5610], name: 'SB County Fire Station 75', dept: 'San Bernardino Co. Fire', type: 'Engine + Brush' },
        { coords: [34.0633, -117.6356], name: 'Rancho Cucamonga Fire 174', dept: 'RC Fire Protection', type: 'Engine + Ladder' },
        { coords: [34.0567, -117.1820], name: 'SB County Fire Station 232', dept: 'San Bernardino Co. Fire', type: 'Engine + Hazmat' },
        { coords: [33.9806, -117.3754], name: 'Riverside Fire Station 1', dept: 'Riverside FD', type: 'Engine + Medic' },
        { coords: [32.7270, -117.1628], name: 'SDFD Station 1 Downtown', dept: 'San Diego FD', type: 'Engine + Truck' },
        { coords: [32.7502, -117.2108], name: 'SDFD Station 8 Old Town', dept: 'San Diego FD', type: 'Engine + Brush' },
        { coords: [32.8334, -117.1390], name: 'SDFD Station 29 Kearny Mesa', dept: 'San Diego FD', type: 'Engine + ALS' },
        { coords: [32.6308, -117.0840], name: 'Chula Vista Fire Station 1', dept: 'Chula Vista FD', type: 'Engine + Truck' }
    ]
};

const freewayData = [
    { coords: [34.05, -118.24], route: 'I-5', name: 'Golden State Fwy', type: 'Interstate' },
    { coords: [34.05, -118.16], route: 'I-10', name: 'San Bernardino Fwy', type: 'Interstate' },
    { coords: [34.06, -117.40], route: 'I-15', name: 'Barstow Fwy', type: 'Interstate' },
    { coords: [33.78, -118.18], route: 'I-405', name: 'San Diego Fwy', type: 'Interstate' },
    { coords: [34.15, -118.40], route: 'US-101', name: 'Hollywood Fwy', type: 'US Highway' },
    { coords: [33.90, -118.06], route: 'I-605', name: 'San Gabriel River Fwy', type: 'Interstate' },
    { coords: [33.80, -117.90], route: 'SR-55', name: 'Costa Mesa Fwy', type: 'State Route' },
    { coords: [33.95, -117.90], route: 'SR-91', name: 'Riverside Fwy', type: 'State Route' },
    { coords: [33.88, -117.75], route: 'SR-241', name: 'Foothill/Eastern Toll', type: 'Toll Road' },
    { coords: [33.75, -117.86], route: 'I-5 South', name: 'Santa Ana Fwy', type: 'Interstate' },
    { coords: [34.07, -117.58], route: 'I-210', name: 'Foothill Fwy', type: 'Interstate' },
    { coords: [34.02, -118.30], route: 'I-110', name: 'Harbor Fwy', type: 'Interstate' },
    { coords: [33.93, -118.40], route: 'I-105', name: 'Century Fwy', type: 'Interstate' },
    { coords: [33.70, -117.80], route: 'SR-73', name: 'San Joaquin Hills Toll', type: 'Toll Road' },
    { coords: [33.62, -117.93], route: 'SR-133', name: 'Laguna Fwy', type: 'State Route' },
    { coords: [32.72, -117.16], route: 'I-5 SD', name: 'I-5 San Diego', type: 'Interstate' },
    { coords: [32.79, -117.09], route: 'I-8', name: 'Mission Valley Fwy', type: 'Interstate' },
    { coords: [32.85, -117.22], route: 'I-805', name: 'I-805 San Diego', type: 'Interstate' },
    { coords: [32.69, -117.05], route: 'SR-54', name: 'South Bay Fwy', type: 'State Route' },
    { coords: [34.07, -117.30], route: 'I-215', name: 'I-215 Inland', type: 'Interstate' },
    { coords: [33.96, -117.33], route: 'SR-60', name: 'Pomona Fwy', type: 'State Route' },
    { coords: [34.17, -118.56], route: 'US-101 W', name: 'Ventura Fwy', type: 'US Highway' }
];

const heatData = [
    [34.05, -118.24, 0.8], [34.04, -118.26, 0.6], [34.06, -118.20, 0.7], [34.02, -118.30, 0.5],
    [34.07, -118.35, 0.4], [33.95, -118.28, 0.6], [33.74, -118.28, 0.9], [33.77, -118.19, 0.7],
    [34.08, -117.45, 0.8], [34.05, -117.40, 0.7], [34.10, -117.50, 0.6], [34.02, -117.38, 0.5],
    [34.06, -117.55, 0.4], [33.98, -117.35, 0.6], [32.72, -117.16, 0.7], [32.75, -117.13, 0.5],
    [32.54, -117.03, 0.9], [32.62, -117.08, 0.6], [32.80, -117.20, 0.4],
    [33.68, -117.83, 0.7], [33.75, -117.87, 0.6], [33.62, -117.90, 0.5], [33.70, -117.76, 0.4]
];

const breachScenarios = [
    { region: 'ie', loc: [34.08, -117.48], name: 'Fontana Logistics Hub B-4', asset: 'CARGO-7741', type: 'Chemical Theft', prediction: 'Target trending to SD Border', alert: 'San Diego Border Patrol' },
    { region: 'ie', loc: [34.06, -117.35], name: 'Ontario Distribution Center C-2', asset: 'CARGO-3390', type: 'Electronics Theft', prediction: 'Target trending east toward AZ', alert: 'CHP Barstow Division' },
    { region: 'la', loc: [33.74, -118.26], name: 'Port of LA Terminal 4', asset: 'SHIP-5523', type: 'Pharmaceutical Diversion', prediction: 'Suspect vehicle heading north on I-110', alert: 'LAPD Harbor Division' },
    { region: 'la', loc: [34.07, -118.22], name: 'Downtown LA Transit Hub', asset: 'BUS-4421', type: 'Suspicious Package', prediction: 'Target moving toward Union Station', alert: 'Metro Transit Security' },
    { region: 'sd', loc: [32.54, -117.03], name: 'San Ysidro Border Crossing', asset: 'VEH-8834', type: 'Undeclared Cargo', prediction: 'Vehicle registered to flagged entity', alert: 'CBP San Diego Sector' },
    { region: 'sd', loc: [32.73, -117.18], name: 'SD Naval Base Perimeter', asset: 'DRONE-0017', type: 'Aerial Intrusion', prediction: 'UAS trajectory toward restricted airspace', alert: 'Naval Base Point Loma' },
    { region: 'oc', loc: [33.6762, -117.8675], name: 'John Wayne Airport Perimeter', asset: 'VEH-2259', type: 'Restricted Zone Breach', prediction: 'Vehicle circling secure taxiway access', alert: 'OCSD Airport Detail' },
    { region: 'oc', loc: [33.8121, -117.9190], name: 'Anaheim Resort District', asset: 'PKG-6618', type: 'Suspicious Package', prediction: 'Unattended item near main gate', alert: 'Anaheim PD Special Events' },
    { region: 'la', loc: [34.14, -118.15], name: 'Angeles National Forest Edge', asset: 'SENSOR-1190', type: 'Wildfire Ignition', prediction: 'Wind pattern pushing fire toward Pasadena', alert: 'LAFD Brush Division' },
    { region: 'ie', loc: [34.11, -117.29], name: 'San Bernardino High School', asset: 'ALERT-0091', type: 'Active Threat Alert', prediction: 'Lockdown initiated, units requested', alert: 'SBPD SWAT' },
    { region: 'sd', loc: [32.88, -117.23], name: 'Miramar Air Station', asset: 'HAZMAT-4402', type: 'Chemical Spill', prediction: 'Plume trajectory toward residential zone', alert: 'SD County HazMat Team' },
    { region: 'oc', loc: [33.74, -117.95], name: 'Irvine Tech Campus', asset: 'CYBER-7788', type: 'SCADA Cyberattack', prediction: 'Water utility SCADA breach detected', alert: 'FBI Cyber Division LA' },
    { region: 'la', loc: [33.95, -118.45], name: 'LAX International Terminal', asset: 'PAX-3310', type: 'Perimeter Breach', prediction: 'Individual entered restricted runway area', alert: 'LAX Airport Police' },
    { region: 'sd', loc: [32.63, -117.09], name: 'Chula Vista Waterfront', asset: 'WAVE-0055', type: 'Tsunami Warning', prediction: 'NOAA advisory: 6.2 offshore event detected', alert: 'SD Emergency Management' },
    { region: 'ie', loc: [33.99, -117.37], name: 'Riverside Freeway Corridor', asset: 'VEH-9921', type: 'High-Speed Pursuit', prediction: 'Suspect heading west on SR-91 at 110mph', alert: 'CHP Riverside' },
    { region: 'oc', loc: [33.65, -117.77], name: 'Laguna Beach Hillside', asset: 'SENSOR-2204', type: 'Mudslide Warning', prediction: 'Soil saturation critical after 3-day rain', alert: 'OC Public Works' }
];

const bundleData = {
    starter: {
        title: 'Regional Starter Bundle', subtitle: 'Shield + IWIN - 15% Savings', color: '#f59e0b',
        price: '$649', original: '$764', unit: '/month base', savings: '$115/mo',
        desc: 'The perfect entry point for agencies beginning their digital safety transformation.',
        includes: [{ product: 'SMART-Shield Professional', details: '100 sensor nodes included' }, { product: 'IWIN Tactical Suite (Patrol)', details: '15 officer seats included' }],
        bonuses: ['Shared analytics dashboard', 'Unified alert routing', 'Joint training session (8 hrs)', 'Dedicated onboarding specialist'],
        ideal: 'Single-county agencies, campus police, port authorities'
    },
    spectrum: {
        title: 'Full Spectrum Bundle', subtitle: 'Shield + IWIN + Horizon - 25% Savings', color: '#4f46e5',
        price: '$1,199', original: '$1,599', unit: '/month base', savings: '$400/mo',
        desc: 'Complete ecosystem coverage for multi-county operations.',
        includes: [{ product: 'SMART-Shield Professional', details: '250 sensor nodes included' }, { product: 'IWIN Tactical Suite (Tactical)', details: '25 officer seats included' }, { product: 'Horizon API (Growth)', details: '100K API calls/month included' }],
        bonuses: ['Cross-product data fusion engine', 'Predictive dispatch routing', 'Quarterly strategy review', 'Priority 4-hour support SLA'],
        ideal: 'Multi-county cooperatives, regional task forces, transit authorities'
    },
    enterprise: {
        title: 'Enterprise Command Bundle', subtitle: 'Full Suite + Premium Services - 35% Savings', color: '#0d9488',
        price: '$1,999', original: '$3,075', unit: '/month base', savings: '$1,076/mo',
        desc: 'The ultimate package for large-scale deployments.',
        includes: [{ product: 'SMART-Shield Enterprise', details: 'Unlimited sensor nodes' }, { product: 'IWIN Tactical Suite (Command)', details: 'Unlimited officer seats' }, { product: 'Horizon API (Enterprise)', details: 'Unlimited API calls + custom models' }],
        bonuses: ['Dedicated cloud infrastructure', 'Custom AI model training', '24/7 premium support + CSM', '99.99% SLA guarantee', 'Annual on-site training program'],
        ideal: 'State agencies, multi-city cooperatives, federal partnerships'
    }
};

const hardwareProducts = {
    sensorHub: {
        title: 'Shield Sensor Hub', subtitle: 'IoT Gateway Hardware', color: '#f59e0b', icon: 'ph-fill ph-cpu',
        desc: 'Ruggedized IoT gateway that aggregates data from up to 200 field sensors. Weather-resistant enclosure with cellular + satellite backhaul for remote deployments.',
        specs: ['200-sensor aggregate capacity', 'IP67 weatherproof enclosure', '4G LTE + Satellite backhaul', 'Solar-ready power input', '72-hour battery backup', 'Edge AI processing chip'],
        pricing: [
            { name: 'Single Unit', price: '$1,850', unit: '/unit', desc: 'One-time purchase', highlights: ['Hub hardware + antennas', '1-year warranty', 'Basic firmware updates', 'Self-install guide'], cta: 'Add to Cart' },
            { name: '10-Pack', price: '$1,495', unit: '/unit', desc: 'Volume discount', highlights: ['10 hub units', '2-year warranty', 'Priority firmware updates', 'On-site installation'], cta: 'Add to Cart', popular: true },
            { name: '50+ Fleet', price: '$1,195', unit: '/unit', desc: 'Enterprise fleet', highlights: ['50+ hub units', '3-year warranty', 'Dedicated support engineer', 'Custom firmware options'], cta: 'Contact Sales' }
        ]
    },
    commandTablet: {
        title: 'IWIN Command Tablet', subtitle: 'Ruggedized Field Device', color: '#4f46e5', icon: 'ph-fill ph-device-tablet',
        desc: '10" ruggedized tablet pre-loaded with the IWIN Tactical Suite. MIL-STD-810G certified with sunlight-readable display for field operations.',
        specs: ['10" sunlight-readable display', 'MIL-STD-810G drop/shock rated', 'Integrated LTE + FirstNet radio', 'Fingerprint + face unlock', '12-hour hot-swap battery', 'IWIN Suite pre-installed'],
        pricing: [
            { name: 'Single Unit', price: '$3,450', unit: '/unit', desc: 'One-time purchase', highlights: ['Tablet + protective case', '1-year hardware warranty', 'IWIN Patrol pre-loaded', 'Standard accessories'], cta: 'Add to Cart' },
            { name: '25-Pack', price: '$2,895', unit: '/unit', desc: 'Department rollout', highlights: ['25 tablets + docking stations', '2-year warranty', 'IWIN Tactical pre-loaded', 'On-site deployment team'], cta: 'Add to Cart', popular: true },
            { name: '100+ Fleet', price: '$2,395', unit: '/unit', desc: 'Agency-wide', highlights: ['100+ tablets', '3-year warranty + refresh', 'IWIN Command pre-loaded', 'MDM + fleet management'], cta: 'Contact Sales' }
        ]
    },
    drone: {
        title: 'Horizon Surveillance Drone', subtitle: 'Autonomous Aerial Platform', color: '#0d9488', icon: 'ph-fill ph-drone',
        desc: 'AI-powered autonomous drone with 4K thermal/optical cameras. 45-minute flight time with automated patrol routes and real-time Horizon API integration.',
        specs: ['4K optical + thermal cameras', '45-min flight time', 'Autonomous patrol routes', 'Real-time Horizon API link', 'Automated landing/charging pad', 'FAA Part 107 compliant'],
        pricing: [
            { name: 'Scout', price: '$6,500', unit: '/unit', desc: 'Single drone', highlights: ['Drone + controller', '1-year warranty', 'Basic patrol software', '4K optical camera only'], cta: 'Add to Cart' },
            { name: 'Tactical', price: '$12,900', unit: '/unit', desc: 'Dual-sensor', highlights: ['Drone + charging dock', '2-year warranty', 'Thermal + optical cameras', 'Horizon API integration'], cta: 'Add to Cart', popular: true },
            { name: 'Fleet (5+)', price: '$9,750', unit: '/unit', desc: 'Multi-drone ops', highlights: ['5+ drones + base station', '3-year warranty', 'Full sensor suite', 'Swarm coordination AI'], cta: 'Contact Sales' }
        ]
    },
    gpsTracker: {
        title: 'SMART GPS Tracker', subtitle: 'Asset & Personnel Tracking', color: '#e11d48', icon: 'ph-fill ph-map-pin',
        desc: 'Compact GPS tracking device for vehicles, cargo containers, and personnel. Real-time positioning with geofence alerts integrated into the Shield network.',
        specs: ['Real-time GPS + GLONASS', 'Compact 2.5" form factor', '30-day battery life', 'IP68 waterproof rating', 'Geofence alert integration', 'Tamper detection sensor'],
        pricing: [
            { name: 'Single Unit', price: '$175', unit: '/unit', desc: 'One-time purchase', highlights: ['Tracker + mount kit', '1-year warranty', '6-month data plan included', 'Basic geofence alerts'], cta: 'Add to Cart' },
            { name: '50-Pack', price: '$129', unit: '/unit', desc: 'Fleet tracking', highlights: ['50 trackers + mounts', '2-year warranty', '1-year data plan included', 'Advanced geofence zones'], cta: 'Add to Cart', popular: true },
            { name: '200+ Fleet', price: '$79', unit: '/unit', desc: 'Enterprise scale', highlights: ['200+ trackers', '3-year warranty', '2-year data plan included', 'Custom API integration'], cta: 'Contact Sales' }
        ]
    }
};

const serviceProducts = {
    consulting: {
        title: 'SMART Consulting', subtitle: 'Implementation & Strategy', color: '#6366f1', icon: 'ph-fill ph-chalkboard-teacher',
        desc: 'Expert consulting services for SMART ecosystem deployment. Our team designs custom integration plans, conducts gap analyses, and trains your personnel.',
        features: ['Needs assessment & gap analysis', 'Custom deployment roadmap', 'Integration architecture design', 'Stakeholder training programs', 'Regulatory compliance review', 'ROI modeling & reporting'],
        pricing: [
            { name: 'Essentials', price: '$8,500', unit: '/engagement', desc: '2-week assessment', highlights: ['Needs assessment report', 'Deployment recommendation', 'Executive presentation', '8 hrs staff training'], cta: 'Add to Cart' },
            { name: 'Professional', price: '$24,000', unit: '/engagement', desc: '6-week program', highlights: ['Everything in Essentials', 'Full integration architecture', 'Hands-on pilot deployment', '40 hrs staff training'], cta: 'Add to Cart', popular: true },
            { name: 'Enterprise', price: '$75,000', unit: '/engagement', desc: '3-month program', highlights: ['Everything in Professional', 'Multi-site rollout plan', 'Dedicated project manager', 'Unlimited training sessions'], cta: 'Contact Sales' }
        ]
    },
    maintenance: {
        title: 'SMART Maintenance', subtitle: 'Support & Warranty Plans', color: '#10b981', icon: 'ph-fill ph-wrench',
        desc: 'Comprehensive maintenance and support plans for all SMART hardware and software. Includes firmware updates, hardware replacements, and 24/7 technical support.',
        features: ['24/7 technical support hotline', 'Firmware & software updates', 'Hardware replacement program', 'Quarterly system health checks', 'Priority issue escalation', 'Annual on-site maintenance visit'],
        pricing: [
            { name: 'Basic', price: '$249', unit: '/month', desc: 'Up to 50 devices', highlights: ['Business-hours support', 'Software updates only', 'Email ticketing system', '48-hour response SLA'], cta: 'Add to Cart' },
            { name: 'Professional', price: '$649', unit: '/month', desc: 'Up to 200 devices', highlights: ['24/7 phone + chat support', 'Software + firmware updates', 'Hardware swap program', '4-hour response SLA'], cta: 'Add to Cart', popular: true },
            { name: 'Enterprise', price: '$1,199', unit: '/month', desc: 'Unlimited devices', highlights: ['24/7 dedicated support line', 'All updates + custom patches', 'Next-day hardware replacement', '1-hour response SLA'], cta: 'Contact Sales' }
        ]
    }
};

// ============ INITIALIZATION ============

document.addEventListener('DOMContentLoaded', function () {
    setTimeout(function () {
        document.getElementById('loading-screen').classList.add('hidden');
        document.getElementById('login-screen').classList.remove('hidden');
    }, 2500);
});

function handleLogin() {
    var fname = (document.getElementById('login-fname').value || '').trim();
    var lname = (document.getElementById('login-lname').value || '').trim();
    var email = (document.getElementById('login-email').value || '').trim();
    var badge = (document.getElementById('login-badge').value || '').trim();
    var agency = document.getElementById('login-agency').value;
    var role = document.getElementById('login-role').value;
    var pass = document.getElementById('login-password').value;
    var ack = document.getElementById('login-ack').checked;

    // Validation
    if (!fname || !lname) { alert('Please enter your first and last name.'); return; }
    if (!email || email.indexOf('@') === -1) { alert('Please enter a valid agency email address.'); return; }
    if (!badge) { alert('Please enter your Badge / ID number.'); return; }
    if (!agency) { alert('Please select your agency or department.'); return; }
    if (!role) { alert('Please select your access level / role.'); return; }
    if (!pass || pass.length < 4) { alert('Please enter a valid passphrase.'); return; }
    if (!ack) { alert('You must acknowledge the security terms to proceed.'); return; }

    var name = fname + ' ' + lname;
    state.userName = name;
    state.userRole = role;
    state.userAgency = agency;
    state.userBadge = badge;
    state.userEmail = email;
    document.getElementById('login-screen').classList.add('hidden');
    var badgeEl = document.getElementById('role-badge');
    if (badgeEl) { badgeEl.textContent = agency + ' \u2022 ' + role + ' \u2022 ' + name; badgeEl.classList.add('visible'); }
    initMap();
    initCharts();
    initKPIObserver();
    logFeed('SCS Unified Command online.', 'color: var(--success); font-weight: 700;');
    logFeed('Authenticated: ' + role + ' ' + name + ' [' + agency + ' / Badge #' + badge + ']', 'color: var(--iwin); font-weight: 600;');
    logFeed('Session encrypted \u2022 IP logged \u2022 Syncing 1,402 Shield Nodes...', 'color: var(--text-secondary);');
}

function togglePasswordVisibility() {
    var pw = document.getElementById('login-password');
    var icon = document.getElementById('pw-toggle-icon');
    if (pw.type === 'password') {
        pw.type = 'text';
        icon.className = 'ph-bold ph-eye-slash';
    } else {
        pw.type = 'password';
        icon.className = 'ph-bold ph-eye';
    }
}

// ============ THEME ============

function toggleTheme() {
    state.isDark = !state.isDark;
    document.documentElement.setAttribute('data-theme', state.isDark ? 'dark' : 'light');
    var icon = document.getElementById('theme-icon');
    if (icon) icon.className = state.isDark ? 'ph-bold ph-sun' : 'ph-bold ph-moon';
    if (state.radarChart) {
        [state.radarChart, state.latencyChart, state.barChart, state.doughnutChart].forEach(function (c) { if (c) c.update(); });
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
    L.circle([33.68, -117.83], { color: '#e11d48', fillColor: '#e11d48', fillOpacity: 0.1, radius: 8000 }).addTo(state.map).bindPopup('<b>Orange County Hub</b><br>SMART Zone Active');

    // Hospital markers with labels
    state.layerGroups.hospitals = L.layerGroup();
    facilityData.hospitals.forEach(function (h) {
        L.marker(h.coords, {
            icon: L.divIcon({
                className: 'map-label-icon',
                html: '<div class="map-hospital-marker"><span class="map-marker-dot hospital-dot">&#9769;</span><span class="map-marker-label">' + h.name + '</span></div>',
                iconSize: [160, 24],
                iconAnchor: [12, 12]
            })
        }).bindPopup(
            '<div style="min-width:200px;"><b style="font-size:14px;">' + h.name + '</b><br>' +
            '<span style="font-size:11px;color:#dc2626;font-weight:700;">' + (h.type || 'Hospital') + '</span><br>' +
            '<span style="font-size:11px;color:#666;">Beds: <b>' + (h.beds || 'N/A') + '</b></span><br>' +
            '<span style="font-size:10px;color:#999;">SCS Shield Connected</span></div>'
        ).addTo(state.layerGroups.hospitals);
    });

    // Fire station markers with labels
    state.layerGroups.fire = L.layerGroup();
    facilityData.fireStations.forEach(function (f) {
        L.marker(f.coords, {
            icon: L.divIcon({
                className: 'map-label-icon',
                html: '<div class="map-fire-marker"><span class="map-marker-dot fire-dot">&#128293;</span><span class="map-marker-label">' + f.name + '</span></div>',
                iconSize: [160, 24],
                iconAnchor: [12, 12]
            })
        }).bindPopup(
            '<div style="min-width:200px;"><b style="font-size:14px;">' + f.name + '</b><br>' +
            '<span style="font-size:11px;color:#f97316;font-weight:700;">' + (f.dept || 'Fire Department') + '</span><br>' +
            '<span style="font-size:11px;color:#666;">Unit: <b>' + (f.type || 'Engine Co.') + '</b></span><br>' +
            '<span style="font-size:10px;color:#999;">IWIN Dispatch Linked</span></div>'
        ).addTo(state.layerGroups.fire);
    });

    // Freeway / Highway number markers
    state.layerGroups.freeways = L.layerGroup();
    freewayData.forEach(function (fw) {
        var isInterstate = fw.type === 'Interstate';
        var isToll = fw.type === 'Toll Road';
        var shieldClass = isInterstate ? 'fwy-shield-interstate' : (isToll ? 'fwy-shield-toll' : 'fwy-shield-state');
        L.marker(fw.coords, {
            icon: L.divIcon({
                className: 'map-label-icon',
                html: '<div class="map-fwy-marker"><span class="fwy-shield ' + shieldClass + '">' + fw.route + '</span></div>',
                iconSize: [70, 24],
                iconAnchor: [35, 12]
            })
        }).bindPopup(
            '<div style="min-width:160px;"><b style="font-size:14px;">' + fw.route + '</b><br>' +
            '<span style="font-size:12px;color:#666;">' + fw.name + '</span><br>' +
            '<span style="font-size:10px;padding:2px 8px;border-radius:4px;background:' + (isInterstate ? '#1e40af22' : '#71717a22') + ';color:' + (isInterstate ? '#1e40af' : '#71717a') + ';font-weight:700;">' + fw.type + '</span></div>'
        ).addTo(state.layerGroups.freeways);
    });
    state.layerGroups.freeways.addTo(state.map);

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
    ['hazard', 'unit1', 'unit2', 'unit3', 'unit1_line', 'unit2_line', 'unit3_line', 'containment'].forEach(function (k) {
        if (state.markers[k]) { state.map.removeLayer(state.markers[k]); delete state.markers[k]; }
    });
    var feed = document.getElementById('intel-feed');
    feed.innerHTML = '';
    var timeline = document.getElementById('sim-timeline');
    timeline.classList.add('visible');
    var phases = timeline.querySelectorAll('.sim-phase');
    phases.forEach(function (p) { p.classList.remove('active', 'done'); });
    logFeed('== SIMULATION SEQUENCE INITIATED ==', 'font-weight: 900;');
    playTone(220, 0.3);
    phases[0].classList.add('active');
    setTimeout(function () {
        panToRegion(scenario.region);
        logFeed('SMART-Shield Alert: Geofence Breach', 'color: var(--shield); font-weight: 700;');
        logFeed('Loc: ' + scenario.name, 'color: var(--text-secondary);');
        logFeed('Asset: ' + scenario.asset + ' - ' + scenario.type, 'color: var(--text-secondary);');
        playTone(440, 0.2);
        state.markers.hazard = L.marker(breachLoc, { icon: L.divIcon({ className: 'hazard-marker', iconSize: [16, 16] }) }).addTo(state.map).bindPopup('Breach: ' + scenario.type).openPopup();
        phases[0].classList.remove('active'); phases[0].classList.add('done');
    }, 1500);
    setTimeout(function () {
        phases[1].classList.add('active');
        logFeed('IWIN Suite: Dispatching 3 Units', 'color: var(--iwin); font-weight: 700;');
        playTone(330, 0.15);
        var units = [
            { start: [breachLoc[0] - 0.03, breachLoc[1] + 0.08], id: 'unit1', label: 'Unit 7-Alpha' },
            { start: [breachLoc[0] + 0.02, breachLoc[1] - 0.04], id: 'unit2', label: 'Unit 3-Bravo' },
            { start: [breachLoc[0] - 0.05, breachLoc[1] - 0.03], id: 'unit3', label: 'Unit 12-Charlie' }
        ];
        units.forEach(function (u, i) {
            setTimeout(function () {
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
    setTimeout(function () {
        phases[2].classList.add('active');
        logFeed('Horizon API: Pattern Match Detected', 'color: var(--horizon); font-weight: 700;');
        logFeed('Predictive Route: ' + scenario.prediction, 'color: var(--text-secondary);');
        logFeed('Alerting ' + scenario.alert, 'color: var(--text-primary);');
        playTone(550, 0.2);
        phases[2].classList.remove('active'); phases[2].classList.add('done');
    }, 8000);
    setTimeout(function () {
        phases[3].classList.add('active');
        logFeed('TARGET INTERCEPTED - Latency: 0.05s', 'color: var(--success); font-weight: 900;');
        playTone(660, 0.3);
        var cont = L.circle(breachLoc, { color: '#10b981', fillColor: '#10b981', fillOpacity: 0.15, radius: 100 }).addTo(state.map);
        state.markers.containment = cont;
        var rad = 100;
        var iv = setInterval(function () {
            rad += 200; cont.setRadius(rad);
            if (rad >= 2000) { clearInterval(iv); phases[3].classList.remove('active'); phases[3].classList.add('done'); state.simRunning = false; }
        }, 50);
    }, 10000);
}

function animateMarker(marker, start, end, duration) {
    var startTime = performance.now();
    function step(now) {
        var p = Math.min((now - startTime) / duration, 1);
        var eased = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
        marker.setLatLng([start[0] + (end[0] - start[0]) * eased, start[1] + (end[1] - start[1]) * eased]);
        if (p < 1) requestAnimationFrame(step);
        else marker.bindPopup('<b>Target Intercepted</b><br>Latency: 0.05s').openPopup();
    }
    requestAnimationFrame(step);
}

// ============ LIVE MODE ============

var livePatrolMarkers = [];

function toggleLiveMode() {
    state.liveMode = !state.liveMode;
    var btn = document.getElementById('live-mode-btn');
    if (state.liveMode) {
        btn.classList.add('active');
        btn.querySelector('span').textContent = '\u25A0 Stop Live';
        btn.style.background = 'var(--danger)'; btn.style.color = 'white';
        logFeed('LIVE MODE: ACTIVATED \u2014 All feeds streaming', 'color: var(--success); font-weight: 900;');
        playTone(440, 0.15);
        spawnPatrolUnits();
        updateWeatherData();
        state.liveModeInterval = setInterval(spawnRandomEvent, 2500);
        state.weatherInterval = setInterval(updateWeatherData, 30000);
        state.patrolInterval = setInterval(movePatrolUnits, 4000);
    } else {
        btn.classList.remove('active');
        btn.querySelector('span').textContent = '\u25B6 Live Mode';
        btn.style.background = ''; btn.style.color = '';
        logFeed('LIVE MODE: Deactivated', 'color: var(--text-muted);');
        clearInterval(state.liveModeInterval);
        clearInterval(state.weatherInterval);
        clearInterval(state.patrolInterval);
        clearPatrolUnits();
        var ww = document.getElementById('weather-widget');
        if (ww) ww.style.display = 'none';
    }
}

function spawnPatrolUnits() {
    clearPatrolUnits();
    var patrols = [
        { id: 'P-Alpha', lat: 34.05, lng: -118.24, color: '#06b6d4', region: 'LA' },
        { id: 'P-Bravo', lat: 34.07, lng: -117.43, color: '#06b6d4', region: 'IE' },
        { id: 'P-Charlie', lat: 32.72, lng: -117.16, color: '#06b6d4', region: 'SD' },
        { id: 'P-Delta', lat: 33.68, lng: -117.83, color: '#06b6d4', region: 'OC' },
        { id: 'P-Echo', lat: 33.77, lng: -118.19, color: '#8b5cf6', region: 'LA' },
        { id: 'P-Foxtrot', lat: 33.95, lng: -117.40, color: '#8b5cf6', region: 'IE' }
    ];
    if (!state.map) return;
    patrols.forEach(function (p) {
        var m = L.circleMarker([p.lat, p.lng], {
            radius: 7, color: p.color, fillColor: p.color, fillOpacity: 0.8, weight: 2
        }).addTo(state.map).bindPopup('<b>' + p.id + '</b><br>Patrol Unit \u2022 ' + p.region + '<br><span style="color:#10b981;font-weight:700;">On Duty</span>');
        m._patrolData = p;
        livePatrolMarkers.push(m);
    });
    logFeed('Deployed ' + patrols.length + ' patrol units to map', 'color: #06b6d4; font-weight: 700;');
}

function movePatrolUnits() {
    livePatrolMarkers.forEach(function (m) {
        if (!m._patrolData) return;
        var pos = m.getLatLng();
        var newLat = pos.lat + (Math.random() - 0.5) * 0.015;
        var newLng = pos.lng + (Math.random() - 0.5) * 0.015;
        animateMarker(m, [pos.lat, pos.lng], [newLat, newLng], 3000);
    });
}

function clearPatrolUnits() {
    livePatrolMarkers.forEach(function (m) { if (state.map) state.map.removeLayer(m); });
    livePatrolMarkers = [];
}

function spawnRandomEvent() {
    var events = [
        { msg: 'Patrol check-in: Unit P-Alpha, Sector 7 \u2014 All clear', style: 'color: var(--iwin);' },
        { msg: 'Patrol check-in: Unit P-Bravo, IE Corridor \u2014 All clear', style: 'color: var(--iwin);' },
        { msg: 'Patrol check-in: Unit P-Charlie, SD Base \u2014 All clear', style: 'color: var(--iwin);' },
        { msg: 'Shield sensor ping: Node ' + (100 + Math.floor(Math.random() * 900)) + ' \u2014 Normal', style: 'color: var(--shield);' },
        { msg: 'Shield sensor ping: Node ' + (100 + Math.floor(Math.random() * 900)) + ' \u2014 Elevated', style: 'color: #f59e0b; font-weight: 600;' },
        { msg: 'GPS Tracker: VEH-' + (1000 + Math.floor(Math.random() * 9000)) + ' position update', style: 'color: #e11d48;' },
        { msg: 'GPS Tracker: CARGO-' + (1000 + Math.floor(Math.random() * 9000)) + ' geofence check OK', style: 'color: #e11d48;' },
        { msg: 'Drone D-' + (10 + Math.floor(Math.random() * 90)) + ': Sweep complete, returning to dock', style: 'color: var(--horizon);' },
        { msg: 'Drone D-' + (10 + Math.floor(Math.random() * 90)) + ': Thermal anomaly flagged, investigating', style: 'color: var(--horizon); font-weight: 600;' },
        { msg: 'Traffic flow: I-' + ['10', '15', '5', '405', '110', '710'][Math.floor(Math.random() * 6)] + ' Corridor \u2014 Normal', style: 'color: var(--success);' },
        { msg: 'Traffic flow: SR-' + ['60', '91', '57', '22', '55'][Math.floor(Math.random() * 5)] + ' \u2014 Congestion detected', style: 'color: #f59e0b;' },
        { msg: 'Cargo scan: Port of LA Gate ' + (1 + Math.floor(Math.random() * 8)) + ' \u2014 Cleared', style: 'color: var(--shield);' },
        { msg: 'Horizon API: Risk score update \u2014 Region ' + ['LA', 'IE', 'SD', 'OC'][Math.floor(Math.random() * 4)] + ' at ' + (20 + Math.floor(Math.random() * 60)) + '%', style: 'color: var(--horizon);' },
        { msg: 'IWIN Tablet sync: ' + (5 + Math.floor(Math.random() * 20)) + ' officers online', style: 'color: var(--iwin);' },
        { msg: 'Perimeter status: All ' + (40 + Math.floor(Math.random() * 60)) + ' geofences holding', style: 'color: var(--success);' },
        { msg: 'Body-cam upload: Officer ' + ['Martinez', 'Johnson', 'Chen', 'Williams', 'Park'][Math.floor(Math.random() * 5)] + ' \u2014 Synced', style: 'color: var(--iwin);' }
    ];
    var e = events[Math.floor(Math.random() * events.length)];
    logFeed(e.msg, e.style);
    if (state.map && Math.random() > 0.5) {
        var lat = 32.5 + Math.random() * 2, lng = -118.5 + Math.random() * 1.5;
        var colors = ['#4f46e5', '#f59e0b', '#0d9488', '#06b6d4', '#e11d48'];
        var c = colors[Math.floor(Math.random() * colors.length)];
        var blip = L.circleMarker([lat, lng], { radius: 5, color: c, fillColor: c, fillOpacity: 0.6, weight: 1 }).addTo(state.map);
        setTimeout(function () { if (state.map.hasLayer(blip)) state.map.removeLayer(blip); }, 5000);
    }
}

// ============ WEATHER (Real-Time via Open-Meteo API) ============

var weatherShowing = false;
var weatherMarkers = [];
var cachedWeather = {};

var weatherLocations = {
    la: { name: 'Los Angeles', lat: 34.05, lon: -118.24 },
    ie: { name: 'Inland Empire', lat: 34.06, lon: -117.39 },
    sd: { name: 'San Diego', lat: 32.72, lon: -117.16 },
    oc: { name: 'Orange County', lat: 33.68, lon: -117.83 }
};

var wmoIcons = {
    0: '\u2600\uFE0F', 1: '\uD83C\uDF24\uFE0F', 2: '\u26C5', 3: '\u2601\uFE0F',
    45: '\uD83C\uDF2B\uFE0F', 48: '\uD83C\uDF2B\uFE0F',
    51: '\uD83C\uDF26\uFE0F', 53: '\uD83C\uDF27\uFE0F', 55: '\uD83C\uDF27\uFE0F',
    61: '\uD83C\uDF26\uFE0F', 63: '\uD83C\uDF27\uFE0F', 65: '\uD83C\uDF27\uFE0F',
    71: '\uD83C\uDF28\uFE0F', 73: '\uD83C\uDF28\uFE0F', 75: '\uD83C\uDF28\uFE0F',
    80: '\uD83C\uDF26\uFE0F', 81: '\uD83C\uDF27\uFE0F', 82: '\u26C8\uFE0F',
    95: '\u26A1', 96: '\u26A1', 99: '\u26A1'
};

var wmoDescriptions = {
    0: 'Clear Sky', 1: 'Mainly Clear', 2: 'Partly Cloudy', 3: 'Overcast',
    45: 'Fog', 48: 'Rime Fog',
    51: 'Light Drizzle', 53: 'Moderate Drizzle', 55: 'Dense Drizzle',
    61: 'Slight Rain', 63: 'Moderate Rain', 65: 'Heavy Rain',
    71: 'Slight Snow', 73: 'Moderate Snow', 75: 'Heavy Snow',
    80: 'Slight Showers', 81: 'Moderate Showers', 82: 'Violent Showers',
    95: 'Thunderstorm', 96: 'Thunderstorm w/ Hail', 99: 'Severe Thunderstorm'
};

function fetchRealWeather() {
    var lats = [], lons = [], codes = [];
    Object.keys(weatherLocations).forEach(function (code) {
        lats.push(weatherLocations[code].lat);
        lons.push(weatherLocations[code].lon);
        codes.push(code);
    });
    var promises = codes.map(function (code, i) {
        var url = 'https://api.open-meteo.com/v1/forecast?latitude=' + lats[i] + '&longitude=' + lons[i] +
            '&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code,uv_index&temperature_unit=fahrenheit&wind_speed_unit=mph&timezone=America/Los_Angeles';
        return fetch(url).then(function (r) { return r.json(); }).then(function (data) {
            cachedWeather[code] = {
                name: weatherLocations[code].name,
                temp: Math.round(data.current.temperature_2m),
                humidity: Math.round(data.current.relative_humidity_2m),
                wind: Math.round(data.current.wind_speed_10m),
                weatherCode: data.current.weather_code,
                uv: Math.round(data.current.uv_index || 0),
                icon: wmoIcons[data.current.weather_code] || '\u2600\uFE0F',
                condition: wmoDescriptions[data.current.weather_code] || 'Clear'
            };
        }).catch(function () {
            cachedWeather[code] = { name: weatherLocations[code].name, temp: 72, humidity: 45, wind: 8, weatherCode: 0, uv: 5, icon: '\u2600\uFE0F', condition: 'Data Unavailable' };
        });
    });
    Promise.all(promises).then(function () {
        renderWeatherWidget();
        if (weatherShowing) addWeatherMarkers();
    });
}

function renderWeatherWidget() {
    var widget = document.getElementById('weather-widget');
    var dataDiv = document.getElementById('weather-data');
    if (!widget || !dataDiv) return;
    widget.style.display = 'block';
    var regionCodes = ['la', 'ie', 'sd', 'oc'];
    var html = '<div style="font-size:10px;color:var(--success);font-weight:700;margin-bottom:8px;">\u25CF LIVE \u2014 Real-time data via Open-Meteo</div>';
    regionCodes.forEach(function (code) {
        var w = cachedWeather[code];
        if (!w) return;
        html += '<div style="display:flex;justify-content:space-between;align-items:center;padding:6px 0;border-bottom:1px solid var(--border);">' +
            '<div style="display:flex;align-items:center;gap:6px;">' +
            '<span style="font-size:16px;">' + w.icon + '</span>' +
            '<span style="font-size:12px;font-weight:700;">' + w.name + '</span></div>' +
            '<div style="text-align:right;">' +
            '<span style="font-size:14px;font-weight:900;">' + w.temp + '\u00B0F</span>' +
            '<div style="font-size:10px;color:var(--text-muted);">' + w.condition + '</div>' +
            '</div></div>';
    });
    var current = cachedWeather[state.currentRegion] || cachedWeather.la;
    if (current) {
        html += '<div style="margin-top:10px;display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;text-align:center;">' +
            '<div style="background:var(--bg-panel-alt);padding:6px;border-radius:8px;"><div style="font-size:10px;color:var(--text-muted);">Wind</div><div style="font-size:13px;font-weight:800;">' + current.wind + ' mph</div></div>' +
            '<div style="background:var(--bg-panel-alt);padding:6px;border-radius:8px;"><div style="font-size:10px;color:var(--text-muted);">Humidity</div><div style="font-size:13px;font-weight:800;">' + current.humidity + '%</div></div>' +
            '<div style="background:var(--bg-panel-alt);padding:6px;border-radius:8px;"><div style="font-size:10px;color:var(--text-muted);">UV Index</div><div style="font-size:13px;font-weight:800;">' + current.uv + '</div></div>' +
            '</div>';
        html += '<div style="margin-top:8px;font-size:10px;color:var(--text-muted);text-align:right;">Updated: ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + '</div>';
    }
    dataDiv.innerHTML = html;
    if (state.liveMode && current) {
        logFeed('Weather update: ' + current.name + ' \u2014 ' + current.temp + '\u00B0F, ' + current.condition + ', Wind ' + current.wind + ' mph', 'color: #f59e0b;');
    }
}

function updateWeatherData() {
    fetchRealWeather();
}

function toggleWeatherLayer() {
    weatherShowing = !weatherShowing;
    var btn = document.querySelector('[data-layer="weather"]');
    if (weatherShowing) {
        if (btn) btn.classList.add('active');
        fetchRealWeather();
        logFeed('Weather layer: LIVE data enabled', 'color: #f59e0b; font-weight: 700;');
    } else {
        if (btn) btn.classList.remove('active');
        document.getElementById('weather-widget').style.display = 'none';
        removeWeatherMarkers();
        logFeed('Weather layer: Disabled', 'color: var(--text-muted);');
    }
}

function addWeatherMarkers() {
    removeWeatherMarkers();
    if (!state.map) return;
    Object.keys(weatherLocations).forEach(function (code) {
        var r = regions[code];
        var w = cachedWeather[code];
        if (!w) return;
        var m = L.marker(r.coords, {
            icon: L.divIcon({
                className: 'weather-map-marker',
                html: '<div style="background:rgba(255,255,255,0.92);backdrop-filter:blur(8px);border:1px solid #e2e8f0;border-radius:10px;padding:4px 10px;display:flex;align-items:center;gap:5px;box-shadow:0 2px 8px rgba(0,0,0,0.1);white-space:nowrap;"><span style="font-size:14px;">' + w.icon + '</span><span style="font-size:12px;font-weight:800;">' + w.temp + '\u00B0F</span></div>',
                iconSize: [80, 30], iconAnchor: [40, 15]
            })
        }).addTo(state.map).bindPopup('<b>' + w.name + ' Weather</b><br>' + w.icon + ' ' + w.condition + '<br>Temp: ' + w.temp + '\u00B0F<br>Wind: ' + w.wind + ' mph<br>Humidity: ' + w.humidity + '%<br>UV: ' + w.uv + '<br><i>Live data via Open-Meteo</i>');
        weatherMarkers.push(m);
    });
}

function removeWeatherMarkers() {
    weatherMarkers.forEach(function (m) { if (state.map) state.map.removeLayer(m); });
    weatherMarkers = [];
}

// ============ TRAFFIC FLOW ============

var trafficShowing = false;
var trafficLines = [];

var socalHighways = [
    { name: 'I-5 (LA to SD)', points: [[34.05, -118.24], [33.95, -118.13], [33.82, -117.95], [33.68, -117.83], [33.45, -117.60], [33.15, -117.35], [32.90, -117.20], [32.72, -117.16]], color: '#ef4444' },
    { name: 'I-10 (LA to IE)', points: [[34.05, -118.24], [34.06, -118.10], [34.06, -117.90], [34.06, -117.70], [34.06, -117.48], [34.06, -117.35]], color: '#f59e0b' },
    { name: 'I-15 (IE to SD)', points: [[34.20, -117.30], [34.10, -117.29], [33.95, -117.25], [33.55, -117.15], [33.20, -117.10], [32.90, -117.08], [32.72, -117.16]], color: '#8b5cf6' },
    { name: 'I-405 (LA Loop)', points: [[34.18, -118.45], [34.05, -118.43], [33.90, -118.39], [33.82, -118.35], [33.74, -118.05], [33.68, -117.87], [33.65, -117.83]], color: '#06b6d4' },
    { name: 'SR-91 (OC to IE)', points: [[33.80, -118.05], [33.83, -117.95], [33.86, -117.82], [33.89, -117.65], [33.93, -117.50], [33.96, -117.38]], color: '#10b981' },
    { name: 'I-710 (Port of LA)', points: [[33.78, -118.19], [33.82, -118.20], [33.88, -118.19], [33.95, -118.18], [34.02, -118.17]], color: '#e11d48' },
    { name: 'I-110 (Harbor Fwy)', points: [[33.74, -118.28], [33.82, -118.28], [33.90, -118.27], [33.98, -118.26], [34.05, -118.27]], color: '#4f46e5' },
    { name: 'SR-78 (North SD)', points: [[33.20, -117.38], [33.18, -117.25], [33.15, -117.10], [33.12, -116.95]], color: '#f97316' }
];

function getTrafficCondition() {
    var hour = new Date().getHours();
    if (hour >= 7 && hour <= 9) return { level: 'Heavy', weight: 6, opacity: 0.8, dash: null };
    if (hour >= 16 && hour <= 19) return { level: 'Heavy', weight: 6, opacity: 0.8, dash: null };
    if (hour >= 10 && hour <= 15) return { level: 'Moderate', weight: 4, opacity: 0.6, dash: '8 6' };
    if (hour >= 20 && hour <= 22) return { level: 'Light', weight: 3, opacity: 0.4, dash: '4 8' };
    return { level: 'Free Flow', weight: 2, opacity: 0.3, dash: '2 8' };
}

function toggleTrafficLayer() {
    trafficShowing = !trafficShowing;
    var btn = document.querySelector('[data-layer="traffic"]');
    if (trafficShowing) {
        if (btn) btn.classList.add('active');
        addTrafficLines();
        logFeed('Traffic layer: LIVE \u2014 showing ' + socalHighways.length + ' highways', 'color: #06b6d4; font-weight: 700;');
        state.trafficInterval = setInterval(updateTrafficLines, 30000);
    } else {
        if (btn) btn.classList.remove('active');
        removeTrafficLines();
        clearInterval(state.trafficInterval);
        logFeed('Traffic layer: Disabled', 'color: var(--text-muted);');
    }
}

function addTrafficLines() {
    removeTrafficLines();
    if (!state.map) return;
    var cond = getTrafficCondition();
    var congested = 0, moderate = 0, freeFlow = 0;
    socalHighways.forEach(function (hw) {
        var variation = Math.random();
        var segStatus, lineColor, lineWeight, lineOpacity, speed;
        if (variation > 0.75) {
            segStatus = 'Congested'; lineColor = '#ef4444'; lineWeight = cond.weight + 2; lineOpacity = 0.9; speed = Math.round(10 + Math.random() * 20); congested++;
        } else if (variation > 0.35) {
            segStatus = cond.level; lineColor = '#f59e0b'; lineWeight = cond.weight; lineOpacity = 0.7; speed = Math.round(30 + Math.random() * 25); moderate++;
        } else {
            segStatus = 'Free Flow'; lineColor = '#10b981'; lineWeight = Math.max(cond.weight - 1, 2); lineOpacity = 0.6; speed = Math.round(55 + Math.random() * 15); freeFlow++;
        }
        // Shadow/glow layer beneath
        var shadow = L.polyline(hw.points, {
            color: lineColor, weight: lineWeight + 6, opacity: lineOpacity * 0.2,
            lineCap: 'round', lineJoin: 'round'
        }).addTo(state.map);
        trafficLines.push(shadow);
        // Main line
        var line = L.polyline(hw.points, {
            color: lineColor, weight: lineWeight, opacity: lineOpacity,
            lineCap: 'round', lineJoin: 'round'
        }).addTo(state.map);
        var statusDot = segStatus === 'Congested' ? '\uD83D\uDD34' : (segStatus === 'Free Flow' ? '\uD83D\uDFE2' : '\uD83D\uDFE1');
        line.bindPopup(
            '<div style="min-width:180px;">' +
            '<b style="font-size:14px;">' + hw.name + '</b><br>' +
            '<div style="margin:6px 0;padding:6px 10px;border-radius:8px;background:' + lineColor + '22;border:1px solid ' + lineColor + '44;display:inline-block;">' +
            '<span style="font-size:16px;">' + statusDot + '</span> ' +
            '<span style="color:' + lineColor + ';font-weight:800;">' + segStatus + '</span></div><br>' +
            '<span style="font-size:12px;color:#666;">Avg Speed: <b>' + speed + ' mph</b></span><br>' +
            '<span style="font-size:12px;color:#666;">Delay: <b>' + (segStatus === 'Congested' ? '+' + Math.round(5 + Math.random() * 15) + ' min' : (segStatus === 'Free Flow' ? 'None' : '+' + Math.round(2 + Math.random() * 8) + ' min')) + '</b></span><br>' +
            '<span style="font-size:10px;color:#999;"><i>Updated: ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + '</i></span>' +
            '</div>'
        );
        trafficLines.push(line);
    });
    logFeed('Traffic: \uD83D\uDFE2 ' + freeFlow + ' free | \uD83D\uDFE1 ' + moderate + ' moderate | \uD83D\uDD34 ' + congested + ' congested \u2014 ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), 'color: #06b6d4; font-weight: 600;');
}

function updateTrafficLines() {
    if (trafficShowing) addTrafficLines();
}

function removeTrafficLines() {
    trafficLines.forEach(function (l) { if (state.map) state.map.removeLayer(l); });
    trafficLines = [];
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
    document.querySelectorAll('.feed-item').forEach(function (item) {
        item.style.display = (item.textContent.toLowerCase().indexOf(query) !== -1 || query === '') ? '' : 'none';
    });
}

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
            labels: ['LA Metro', 'Orange County', 'Inland Empire', 'San Diego'],
            datasets: [
                { label: 'Officers', data: [450, 380, 280, 320], backgroundColor: '#4f46e5', borderRadius: 6 },
                { label: 'Sensors', data: [620, 440, 510, 290], backgroundColor: '#f59e0b', borderRadius: 6 },
                { label: 'Drones', data: [35, 28, 22, 18], backgroundColor: '#0d9488', borderRadius: 6 }
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
    if (code === 'oc') color = '#e11d48';
    if (code === 'ie') color = '#f59e0b';
    if (code === 'sd') color = '#0d9488';
    state.radarChart.data.datasets[0].borderColor = color;
    state.radarChart.data.datasets[0].backgroundColor = color + '26';
    state.radarChart.data.datasets[0].pointBackgroundColor = color;
    state.radarChart.update();
}

function updateLatencyRange(range) {
    var datasets = { '24h': [120, 80, 40, 5, 0.05], '7d': [300, 200, 100, 8, 0.05], '30d': [600, 300, 120, 10, 0.05] };
    state.latencyChart.data.datasets[0].data = datasets[range] || datasets['30d'];
    state.latencyChart.update();
    document.querySelectorAll('.latency-btn').forEach(function (b) { b.classList.remove('active'); });
    var activeBtn = document.querySelector('[data-range="' + range + '"]');
    if (activeBtn) activeBtn.classList.add('active');
}

// ============ KPI COUNTERS ============

function initKPIObserver() {
    var kpis = document.querySelectorAll('.kpi-value');
    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting && !entry.target.dataset.animated) {
                entry.target.dataset.animated = 'true';
                animateCounter(entry.target);
            }
        });
    }, { threshold: 0.3 });
    kpis.forEach(function (el) { observer.observe(el); });
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

// ============ MODALS ============

function openPillarModal(type) {
    var data = pillarData[type];
    if (!data) return;
    var body = document.getElementById('modal-body');
    var featuresHtml = data.features.map(function (f) { return '<li><i class="ph-bold ph-check-circle"></i> ' + f + '</li>'; }).join('');
    var pricingHtml = data.pricing.map(function (tier) {
        var popLabel = tier.popular ? '<span style="position:absolute;top:-10px;right:16px;background:' + data.color + ';color:white;font-size:9px;font-weight:800;padding:3px 10px;border-radius:6px;text-transform:uppercase;letter-spacing:1px;">Most Popular</span>' : '';
        var hlHtml = tier.highlights.map(function (h) { return '<li style="font-size:12px;color:var(--text-secondary);padding:3px 0;display:flex;align-items:center;gap:6px;"><i class="ph-bold ph-check" style="color:' + data.color + ';font-size:12px;"></i>' + h + '</li>'; }).join('');
        var btnStyle = tier.popular ? 'background:' + data.color + ';color:white;box-shadow:0 4px 12px ' + data.color + '44;' : 'background:var(--bg-panel);border:1px solid var(--border);color:var(--text-primary);';
        return '<div style="border:' + (tier.popular ? '2px solid ' + data.color : '1px solid var(--border)') + ';border-radius:16px;padding:20px;position:relative;background:var(--bg-panel-alt);">' + popLabel + '<div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px;"><div><div style="font-size:14px;font-weight:700;">' + tier.name + '</div><div style="font-size:11px;color:var(--text-muted);">' + tier.desc + '</div></div><div style="text-align:right;"><span style="font-size:28px;font-weight:900;color:' + data.color + ';">' + tier.price + '</span><span style="font-size:11px;color:var(--text-muted);">' + tier.unit + '</span></div></div><ul style="list-style:none;padding:0;margin:12px 0;">' + hlHtml + '</ul><button onclick="addToCart(\'' + type + '\',\'' + tier.name + '\',\'' + tier.price + '\',\'' + tier.unit + '\')" style="width:100%;padding:12px;border-radius:10px;border:none;font-size:13px;font-weight:700;cursor:pointer;font-family:Inter,sans-serif;' + btnStyle + '">' + tier.cta + '</button></div>';
    }).join('');
    body.innerHTML = '<h3>' + data.title + '</h3><p class="modal-subtitle">' + data.subtitle + '</p><p class="modal-desc">' + data.desc + '</p><ul class="modal-features">' + featuresHtml + '</ul><div style="margin-top:28px;margin-bottom:8px;"><h4 style="font-size:16px;font-weight:800;margin-bottom:4px;">Choose Your Plan</h4><p style="font-size:12px;color:var(--text-muted);">All plans include a 14-day free trial.</p></div><div style="display:flex;flex-direction:column;gap:12px;">' + pricingHtml + '</div>';
    document.getElementById('modal-overlay').classList.add('open');
    logFeed('Viewing: ' + data.title + ' pricing', 'color: var(--text-muted);');
}

function openBundleModal(bundleType) {
    var data = bundleData[bundleType];
    if (!data) return;
    var body = document.getElementById('modal-body');
    var includesHtml = data.includes.map(function (inc) {
        return '<div style="display:flex;justify-content:space-between;align-items:center;padding:10px 14px;border:1px solid var(--border);border-radius:10px;margin-bottom:6px;background:var(--bg-panel-alt);"><div><div style="font-size:13px;font-weight:700;">' + inc.product + '</div><div style="font-size:11px;color:var(--text-muted);">' + inc.details + '</div></div><i class="ph-bold ph-check-circle" style="color:' + data.color + ';font-size:18px;"></i></div>';
    }).join('');
    var bonusHtml = data.bonuses.map(function (b) { return '<li style="font-size:12px;color:var(--text-secondary);padding:4px 0;display:flex;align-items:center;gap:8px;"><i class="ph-bold ph-star" style="color:' + data.color + ';font-size:11px;"></i>' + b + '</li>'; }).join('');
    body.innerHTML = '<div style="text-align:center;margin-bottom:20px;"><div style="display:inline-flex;align-items:center;gap:8px;background:' + data.color + '15;padding:6px 16px;border-radius:8px;margin-bottom:12px;"><i class="ph-fill ph-gift" style="color:' + data.color + ';"></i><span style="font-size:11px;font-weight:800;color:' + data.color + ';text-transform:uppercase;letter-spacing:1px;">Bundle Package</span></div><h3>' + data.title + '</h3><p class="modal-subtitle">' + data.subtitle + '</p></div><p class="modal-desc">' + data.desc + '</p><div style="display:flex;align-items:baseline;gap:8px;margin:20px 0 8px;flex-wrap:wrap;"><span style="font-size:36px;font-weight:900;color:' + data.color + ';">' + data.price + '</span><span style="font-size:13px;color:var(--text-muted);">' + data.unit + '</span><span style="font-size:13px;color:var(--text-muted);text-decoration:line-through;margin-left:4px;">' + data.original + '</span><span style="background:#10b98120;color:#10b981;font-size:10px;font-weight:800;padding:3px 8px;border-radius:6px;">SAVE ' + data.savings + '</span></div><div style="margin-top:20px;"><div style="font-size:12px;font-weight:800;color:var(--text-muted);text-transform:uppercase;letter-spacing:1px;margin-bottom:10px;">Included</div>' + includesHtml + '</div><div style="margin-top:20px;"><div style="font-size:12px;font-weight:800;color:var(--text-muted);text-transform:uppercase;letter-spacing:1px;margin-bottom:10px;">Bonuses</div><ul style="list-style:none;padding:0;">' + bonusHtml + '</ul></div><button onclick="addBundleToCart(\'' + bundleType + '\')" style="width:100%;padding:14px;background:' + data.color + ';color:white;border:none;border-radius:12px;font-size:14px;font-weight:700;cursor:pointer;font-family:Inter,sans-serif;margin-top:20px;box-shadow:0 4px 16px ' + data.color + '44;">Add to Cart</button>';
    document.getElementById('modal-overlay').classList.add('open');
    logFeed('Viewing: ' + data.title, 'color: var(--text-muted);');
}

function openHardwareModal(type) {
    var data = hardwareProducts[type];
    if (!data) return;
    var body = document.getElementById('modal-body');
    var specsHtml = data.specs.map(function (s) { return '<li><i class="ph-bold ph-check-circle"></i> ' + s + '</li>'; }).join('');
    var pricingHtml = data.pricing.map(function (tier) {
        var popLabel = tier.popular ? '<span style="position:absolute;top:-10px;right:16px;background:' + data.color + ';color:white;font-size:9px;font-weight:800;padding:3px 10px;border-radius:6px;text-transform:uppercase;letter-spacing:1px;">Best Value</span>' : '';
        var hlHtml = tier.highlights.map(function (h) { return '<li style="font-size:12px;color:var(--text-secondary);padding:3px 0;display:flex;align-items:center;gap:6px;"><i class="ph-bold ph-check" style="color:' + data.color + ';font-size:12px;"></i>' + h + '</li>'; }).join('');
        var btnStyle = tier.popular ? 'background:' + data.color + ';color:white;box-shadow:0 4px 12px ' + data.color + '44;' : 'background:var(--bg-panel);border:1px solid var(--border);color:var(--text-primary);';
        return '<div style="border:' + (tier.popular ? '2px solid ' + data.color : '1px solid var(--border)') + ';border-radius:16px;padding:20px;position:relative;background:var(--bg-panel-alt);">' + popLabel + '<div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px;"><div><div style="font-size:14px;font-weight:700;">' + tier.name + '</div><div style="font-size:11px;color:var(--text-muted);">' + tier.desc + '</div></div><div style="text-align:right;"><span style="font-size:28px;font-weight:900;color:' + data.color + ';">' + tier.price + '</span><span style="font-size:11px;color:var(--text-muted);">' + tier.unit + '</span></div></div><ul style="list-style:none;padding:0;margin:12px 0;">' + hlHtml + '</ul><button onclick="addHardwareToCart(\'' + type + '\',\'' + tier.name + '\',\'' + tier.price + '\',\'' + tier.unit + '\')" style="width:100%;padding:12px;border-radius:10px;border:none;font-size:13px;font-weight:700;cursor:pointer;font-family:Inter,sans-serif;' + btnStyle + '">' + tier.cta + '</button></div>';
    }).join('');
    body.innerHTML = '<div style="display:inline-flex;align-items:center;gap:8px;background:' + data.color + '15;padding:6px 16px;border-radius:8px;margin-bottom:16px;"><i class="' + data.icon + '" style="color:' + data.color + ';"></i><span style="font-size:11px;font-weight:800;color:' + data.color + ';text-transform:uppercase;letter-spacing:1px;">Hardware</span></div><h3>' + data.title + '</h3><p class="modal-subtitle">' + data.subtitle + '</p><p class="modal-desc">' + data.desc + '</p><ul class="modal-features">' + specsHtml + '</ul><div style="margin-top:28px;margin-bottom:8px;"><h4 style="font-size:16px;font-weight:800;margin-bottom:4px;">Pricing</h4></div><div style="display:flex;flex-direction:column;gap:12px;">' + pricingHtml + '</div>';
    document.getElementById('modal-overlay').classList.add('open');
    logFeed('Viewing: ' + data.title + ' pricing', 'color: var(--text-muted);');
}

function openServiceModal(type) {
    var data = serviceProducts[type];
    if (!data) return;
    var body = document.getElementById('modal-body');
    var featuresHtml = data.features.map(function (f) { return '<li><i class="ph-bold ph-check-circle"></i> ' + f + '</li>'; }).join('');
    var pricingHtml = data.pricing.map(function (tier) {
        var popLabel = tier.popular ? '<span style="position:absolute;top:-10px;right:16px;background:' + data.color + ';color:white;font-size:9px;font-weight:800;padding:3px 10px;border-radius:6px;text-transform:uppercase;letter-spacing:1px;">Most Popular</span>' : '';
        var hlHtml = tier.highlights.map(function (h) { return '<li style="font-size:12px;color:var(--text-secondary);padding:3px 0;display:flex;align-items:center;gap:6px;"><i class="ph-bold ph-check" style="color:' + data.color + ';font-size:12px;"></i>' + h + '</li>'; }).join('');
        var btnStyle = tier.popular ? 'background:' + data.color + ';color:white;box-shadow:0 4px 12px ' + data.color + '44;' : 'background:var(--bg-panel);border:1px solid var(--border);color:var(--text-primary);';
        return '<div style="border:' + (tier.popular ? '2px solid ' + data.color : '1px solid var(--border)') + ';border-radius:16px;padding:20px;position:relative;background:var(--bg-panel-alt);">' + popLabel + '<div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px;"><div><div style="font-size:14px;font-weight:700;">' + tier.name + '</div><div style="font-size:11px;color:var(--text-muted);">' + tier.desc + '</div></div><div style="text-align:right;"><span style="font-size:28px;font-weight:900;color:' + data.color + ';">' + tier.price + '</span><span style="font-size:11px;color:var(--text-muted);">' + tier.unit + '</span></div></div><ul style="list-style:none;padding:0;margin:12px 0;">' + hlHtml + '</ul><button onclick="addServiceToCart(\'' + type + '\',\'' + tier.name + '\',\'' + tier.price + '\',\'' + tier.unit + '\')" style="width:100%;padding:12px;border-radius:10px;border:none;font-size:13px;font-weight:700;cursor:pointer;font-family:Inter,sans-serif;' + btnStyle + '">' + tier.cta + '</button></div>';
    }).join('');
    body.innerHTML = '<div style="display:inline-flex;align-items:center;gap:8px;background:' + data.color + '15;padding:6px 16px;border-radius:8px;margin-bottom:16px;"><i class="' + data.icon + '" style="color:' + data.color + ';"></i><span style="font-size:11px;font-weight:800;color:' + data.color + ';text-transform:uppercase;letter-spacing:1px;">Service</span></div><h3>' + data.title + '</h3><p class="modal-subtitle">' + data.subtitle + '</p><p class="modal-desc">' + data.desc + '</p><ul class="modal-features">' + featuresHtml + '</ul><div style="margin-top:28px;margin-bottom:8px;"><h4 style="font-size:16px;font-weight:800;margin-bottom:4px;">Choose Your Plan</h4></div><div style="display:flex;flex-direction:column;gap:12px;">' + pricingHtml + '</div>';
    document.getElementById('modal-overlay').classList.add('open');
    logFeed('Viewing: ' + data.title + ' pricing', 'color: var(--text-muted);');
}

function closeModal() { document.getElementById('modal-overlay').classList.remove('open'); }
document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeModal(); });

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

function addHardwareToCart(productType, tierName, price, unit) {
    state.cart.push({ type: 'hardware', product: hardwareProducts[productType].title, tier: tierName, price: price, unit: unit, color: hardwareProducts[productType].color });
    updateCartBadge();
    logFeed('Added to cart: ' + hardwareProducts[productType].title + ' ' + tierName, 'color: var(--success); font-weight: 700;');
    playTone(440, 0.1);
    closeModal();
    showCartNotification(hardwareProducts[productType].title + ' ' + tierName + ' added to cart!');
}

function addServiceToCart(productType, tierName, price, unit) {
    state.cart.push({ type: 'service', product: serviceProducts[productType].title, tier: tierName, price: price, unit: unit, color: serviceProducts[productType].color });
    updateCartBadge();
    logFeed('Added to cart: ' + serviceProducts[productType].title + ' ' + tierName, 'color: var(--success); font-weight: 700;');
    playTone(440, 0.1);
    closeModal();
    showCartNotification(serviceProducts[productType].title + ' ' + tierName + ' added to cart!');
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
    setTimeout(function () { toast.style.opacity = '0'; toast.style.transition = 'opacity 0.3s'; setTimeout(function () { toast.remove(); }, 300); }, 3000);
}

function openCart() {
    var body = document.getElementById('modal-body');
    if (state.cart.length === 0) {
        body.innerHTML = '<div style="text-align:center;padding:60px 0;"><div style="width:72px;height:72px;background:var(--bg-panel-alt);border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 20px;font-size:32px;color:var(--text-muted);"><i class="ph-bold ph-shopping-cart"></i></div><h3 style="margin-bottom:8px;">Your Cart is Empty</h3><p style="font-size:14px;color:var(--text-secondary);">Browse products or bundles to add items.</p><button onclick="closeModal()" style="margin-top:20px;padding:12px 24px;background:var(--iwin);color:white;border:none;border-radius:10px;font-size:13px;font-weight:700;cursor:pointer;font-family:Inter,sans-serif;">Browse Products</button></div>';
    } else {
        var itemsHtml = state.cart.map(function (item, idx) {
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
    } catch (e) { }
}

// ============ PDF EXPORT ============

function exportPDF() {
    logFeed('Generating PDF report...', 'color: var(--text-secondary);');
    addAuditEntry('Export', 'PDF report generation initiated');
    try {
        html2canvas(document.querySelector('.main-content'), { scale: 1, useCORS: true }).then(function (canvas) {
            var jsPDF = window.jspdf.jsPDF;
            var pdf = new jsPDF('p', 'mm', 'a4');
            var imgData = canvas.toDataURL('image/png');
            var pdfW = pdf.internal.pageSize.getWidth();
            var pdfH = (canvas.height * pdfW) / canvas.width;
            pdf.addImage(imgData, 'PNG', 0, 0, pdfW, pdfH);
            pdf.save('SCS-Dashboard-Report.pdf');
            logFeed('PDF exported successfully', 'color: var(--success); font-weight: 700;');
        });
    } catch (e) {
        logFeed('PDF export requires html2canvas & jsPDF', 'color: var(--shield);');
    }
}

// ============ 1. EMERGENCY ALERT BROADCAST ============

function openEmergencyAlert() {
    addAuditEntry('Alert', 'Emergency alert panel opened');
    var html = '<div style="text-align:center;margin-bottom:16px;">' +
        '<div style="background:linear-gradient(135deg,#dc2626,#991b1b);color:white;font-size:10px;font-weight:800;letter-spacing:2px;padding:6px 16px;border-radius:8px;display:inline-block;">EMERGENCY BROADCAST SYSTEM</div></div>' +
        '<h2 style="font-size:22px;font-weight:900;margin-bottom:4px;">Send Regional Alert</h2>' +
        '<p style="font-size:12px;color:var(--text-muted);margin-bottom:16px;">This will notify all connected agencies, officers, and field devices.</p>' +
        '<select id="alert-severity" style="width:100%;padding:12px;border:1px solid var(--border);border-radius:10px;margin-bottom:10px;background:var(--bg-panel-alt);color:var(--text-primary);font-size:14px;">' +
        '<option value="advisory">Advisory \u2014 Low Priority</option>' +
        '<option value="warning">Warning \u2014 Elevated Threat</option>' +
        '<option value="critical" selected>Critical \u2014 Immediate Response</option>' +
        '<option value="lockdown">Lockdown \u2014 All Units</option></select>' +
        '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:10px;">' +
        '<label style="display:flex;align-items:center;gap:6px;font-size:12px;cursor:pointer;"><input type="checkbox" checked value="la"> LA Metro</label>' +
        '<label style="display:flex;align-items:center;gap:6px;font-size:12px;cursor:pointer;"><input type="checkbox" checked value="oc"> Orange County</label>' +
        '<label style="display:flex;align-items:center;gap:6px;font-size:12px;cursor:pointer;"><input type="checkbox" checked value="ie"> Inland Empire</label>' +
        '<label style="display:flex;align-items:center;gap:6px;font-size:12px;cursor:pointer;"><input type="checkbox" checked value="sd"> San Diego</label></div>' +
        '<textarea id="alert-message" placeholder="Alert message..." rows="3" style="width:100%;padding:12px;border:1px solid var(--border);border-radius:10px;margin-bottom:12px;background:var(--bg-panel-alt);color:var(--text-primary);font-size:13px;resize:vertical;font-family:Inter,sans-serif;"></textarea>' +
        '<button onclick="sendEmergencyAlert()" style="width:100%;padding:14px;background:linear-gradient(135deg,#dc2626,#991b1b);color:white;border:none;border-radius:12px;font-size:14px;font-weight:800;cursor:pointer;"><i class="ph-bold ph-siren" style="margin-right:6px;"></i>BROADCAST ALERT</button>';
    document.getElementById('modal-body').innerHTML = html;
    document.getElementById('modal-overlay').classList.add('active');
}

function sendEmergencyAlert() {
    var severity = document.getElementById('alert-severity').value;
    var message = document.getElementById('alert-message').value || 'Emergency alert issued by SCS Command';
    playTone(880, 0.3); playTone(660, 0.3);
    logFeed('\u26A0\uFE0F EMERGENCY ALERT [' + severity.toUpperCase() + ']: ' + message, 'color: #dc2626; font-weight: 900; font-size: 13px;');
    addAuditEntry('Alert', 'Emergency broadcast sent: ' + severity + ' \u2014 ' + message);
    closeModal();
    logFeed('Alert dispatched to all connected agencies and ' + (120 + Math.floor(Math.random() * 80)) + ' field devices', 'color: #dc2626;');
}

// ============ 2. SESSION TIMER & AUTO-LOGOUT ============

var sessionSeconds = 1800;
var sessionTimerInterval = null;

function startSessionTimer() {
    sessionSeconds = 1800;
    var el = document.getElementById('session-timer');
    if (el) el.style.display = 'inline';
    updateSessionTimerDisplay();
    sessionTimerInterval = setInterval(function () {
        sessionSeconds--;
        updateSessionTimerDisplay();
        if (sessionSeconds <= 0) {
            clearInterval(sessionTimerInterval);
            addAuditEntry('Security', 'Session auto-locked due to timeout');
            alert('Session expired. You will be returned to the login screen.');
            location.reload();
        }
        if (sessionSeconds === 300) {
            logFeed('\u26A0\uFE0F Session timeout in 5 minutes', 'color: #f59e0b; font-weight: 700;');
        }
    }, 1000);
}

function updateSessionTimerDisplay() {
    var el = document.getElementById('session-timer');
    if (!el) return;
    var m = Math.floor(sessionSeconds / 60);
    var s = sessionSeconds % 60;
    el.textContent = (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s;
    if (sessionSeconds <= 300) el.style.color = '#dc2626';
    else if (sessionSeconds <= 600) el.style.color = '#f59e0b';
    else el.style.color = 'var(--text-muted)';
}

function resetSessionTimer() { sessionSeconds = 1800; }

document.addEventListener('click', resetSessionTimer);
document.addEventListener('keydown', resetSessionTimer);

// ============ 3. AUDIT ACTIVITY LOG ============

var auditLog = [];

function addAuditEntry(type, description) {
    auditLog.push({
        time: new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        date: new Date().toLocaleDateString(),
        user: (state.userName || 'System'),
        role: (state.userRole || 'System'),
        agency: (state.userAgency || ''),
        type: type,
        desc: description
    });
}

function openAuditLog() {
    var html = '<h2 style="font-size:20px;font-weight:900;margin-bottom:4px;"><i class="ph-bold ph-clipboard-text" style="margin-right:8px;"></i>Audit Activity Log</h2>' +
        '<p style="font-size:12px;color:var(--text-muted);margin-bottom:16px;">' + auditLog.length + ' entries recorded this session</p>' +
        '<div style="max-height:400px;overflow-y:auto;">' +
        '<table style="width:100%;font-size:11px;border-collapse:collapse;">' +
        '<tr style="background:var(--bg-panel-alt);"><th style="padding:8px;text-align:left;border-bottom:1px solid var(--border);">Time</th><th style="padding:8px;text-align:left;border-bottom:1px solid var(--border);">User</th><th style="padding:8px;text-align:left;border-bottom:1px solid var(--border);">Type</th><th style="padding:8px;text-align:left;border-bottom:1px solid var(--border);">Description</th></tr>';
    auditLog.slice().reverse().forEach(function (e) {
        html += '<tr><td style="padding:6px 8px;border-bottom:1px solid var(--border);white-space:nowrap;font-family:JetBrains Mono,monospace;font-size:10px;">' + e.time + '</td>' +
            '<td style="padding:6px 8px;border-bottom:1px solid var(--border);">' + e.user + '</td>' +
            '<td style="padding:6px 8px;border-bottom:1px solid var(--border);"><span style="background:var(--bg-panel-alt);padding:2px 8px;border-radius:6px;font-weight:700;">' + e.type + '</span></td>' +
            '<td style="padding:6px 8px;border-bottom:1px solid var(--border);">' + e.desc + '</td></tr>';
    });
    html += '</table></div>';
    document.getElementById('modal-body').innerHTML = html;
    document.getElementById('modal-overlay').classList.add('active');
}

// ============ 4. INCIDENT REPORT FORM ============

function openIncidentReport() {
    addAuditEntry('Report', 'Incident report form opened');
    var html = '<h2 style="font-size:20px;font-weight:900;margin-bottom:4px;"><i class="ph-bold ph-warning-octagon" style="margin-right:8px;color:#f59e0b;"></i>File Incident Report</h2>' +
        '<p style="font-size:12px;color:var(--text-muted);margin-bottom:16px;">Submit a new incident for review and tracking.</p>' +
        '<select id="inc-type" style="width:100%;padding:12px;border:1px solid var(--border);border-radius:10px;margin-bottom:10px;background:var(--bg-panel-alt);color:var(--text-primary);font-size:13px;">' +
        '<option value="" disabled selected>Incident Type</option>' +
        '<option>Theft / Burglary</option><option>Assault</option><option>Traffic Accident</option>' +
        '<option>Suspicious Activity</option><option>Fire / Hazmat</option><option>Medical Emergency</option>' +
        '<option>Infrastructure Failure</option><option>Cyber Threat</option><option>Natural Disaster</option><option>Other</option></select>' +
        '<select id="inc-severity" style="width:100%;padding:12px;border:1px solid var(--border);border-radius:10px;margin-bottom:10px;background:var(--bg-panel-alt);color:var(--text-primary);font-size:13px;">' +
        '<option value="" disabled selected>Severity Level</option>' +
        '<option value="Low">Low \u2014 Informational</option><option value="Medium">Medium \u2014 Moderate Urgency</option>' +
        '<option value="High">High \u2014 Immediate Attention</option><option value="Critical">Critical \u2014 Life Threatening</option></select>' +
        '<select id="inc-region" style="width:100%;padding:12px;border:1px solid var(--border);border-radius:10px;margin-bottom:10px;background:var(--bg-panel-alt);color:var(--text-primary);font-size:13px;">' +
        '<option value="" disabled selected>Region</option>' +
        '<option>LA Metro</option><option>Orange County</option><option>Inland Empire</option><option>San Diego</option></select>' +
        '<input id="inc-location" placeholder="Specific location / address" style="width:100%;padding:12px;border:1px solid var(--border);border-radius:10px;margin-bottom:10px;background:var(--bg-panel-alt);color:var(--text-primary);font-size:13px;">' +
        '<textarea id="inc-desc" placeholder="Describe the incident..." rows="3" style="width:100%;padding:12px;border:1px solid var(--border);border-radius:10px;margin-bottom:12px;background:var(--bg-panel-alt);color:var(--text-primary);font-size:13px;resize:vertical;font-family:Inter,sans-serif;"></textarea>' +
        '<button onclick="submitIncidentReport()" style="width:100%;padding:14px;background:linear-gradient(135deg,#4f46e5,#6366f1);color:white;border:none;border-radius:12px;font-size:14px;font-weight:700;cursor:pointer;">Submit Report</button>';
    document.getElementById('modal-body').innerHTML = html;
    document.getElementById('modal-overlay').classList.add('active');
}

function submitIncidentReport() {
    var type = document.getElementById('inc-type').value;
    var severity = document.getElementById('inc-severity').value;
    var region = document.getElementById('inc-region').value;
    var location = document.getElementById('inc-location').value;
    var desc = document.getElementById('inc-desc').value;
    if (!type || !severity || !region) { alert('Please fill in all required fields.'); return; }
    var id = 'INC-' + (10000 + Math.floor(Math.random() * 90000));
    logFeed('\uD83D\uDCCB Incident ' + id + ': ' + type + ' [' + severity + '] at ' + region, 'color: #f59e0b; font-weight: 700;');
    addAuditEntry('Incident', 'Report filed: ' + id + ' \u2014 ' + type + ' at ' + region + ' (' + severity + ')');
    closeModal();
    logFeed('Incident ' + id + ' routed to ' + region + ' dispatch', 'color: var(--text-secondary);');
}

// ============ 5. RESOURCE ALLOCATION PANEL ============

function updateResourcePanel() {
    var resources = {
        patrol: { val: 8 + Math.floor(Math.random() * 20), max: 40 },
        drones: { val: 2 + Math.floor(Math.random() * 8), max: 15 },
        sensors: { val: 1200 + Math.floor(Math.random() * 300), max: 1600 },
        gps: { val: 150 + Math.floor(Math.random() * 100), max: 350 },
        officers: { val: 15 + Math.floor(Math.random() * 30), max: 60 }
    };
    Object.keys(resources).forEach(function (key) {
        var el = document.getElementById('res-' + key);
        var bar = document.getElementById('res-' + key + '-bar');
        if (el) el.textContent = resources[key].val;
        if (bar) bar.style.width = Math.round(resources[key].val / resources[key].max * 100) + '%';
    });
}

// ============ 6. KEYBOARD SHORTCUTS ============

function showKeyboardShortcuts() {
    var shortcuts = [
        ['L', 'Toggle Live Mode'],
        ['S', 'Run Simulation'],
        ['T', 'Toggle Theme'],
        ['W', 'Toggle Weather Layer'],
        ['F', 'Toggle Traffic Layer'],
        ['E', 'Emergency Alert'],
        ['I', 'File Incident Report'],
        ['A', 'Open Audit Log'],
        ['?', 'Show This Help']
    ];
    var html = '<h2 style="font-size:20px;font-weight:900;margin-bottom:16px;"><i class="ph-bold ph-keyboard" style="margin-right:8px;"></i>Keyboard Shortcuts</h2>';
    shortcuts.forEach(function (s) {
        html += '<div style="display:flex;align-items:center;gap:12px;padding:8px 0;border-bottom:1px solid var(--border);">' +
            '<kbd style="background:var(--bg-panel-alt);border:1px solid var(--border);border-radius:6px;padding:4px 12px;font-family:JetBrains Mono,monospace;font-weight:700;font-size:14px;min-width:30px;text-align:center;">' + s[0] + '</kbd>' +
            '<span style="font-size:13px;color:var(--text-primary);">' + s[1] + '</span></div>';
    });
    document.getElementById('modal-body').innerHTML = html;
    document.getElementById('modal-overlay').classList.add('active');
}

document.addEventListener('keydown', function (e) {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') return;
    var key = e.key.toLowerCase();
    if (key === 'l') toggleLiveMode();
    else if (key === 's') runSimulation();
    else if (key === 't') toggleTheme();
    else if (key === 'w') toggleWeatherLayer();
    else if (key === 'f') toggleTrafficLayer();
    else if (key === 'e') openEmergencyAlert();
    else if (key === 'i') openIncidentReport();
    else if (key === 'a') openAuditLog();
    else if (key === '?') showKeyboardShortcuts();
});

// ============ 7. EXPORT DASHBOARD REPORT ============

function exportDashboardReport() {
    addAuditEntry('Export', 'Dashboard print report initiated');
    var timer = document.getElementById('session-timer');
    var report = '===================================================\\n' +
        '  SCS (SoCal-SMART) DASHBOARD REPORT\\n' +
        '  Generated: ' + new Date().toLocaleString() + '\\n' +
        '  Operator: ' + (state.userName || 'N/A') + ' | Role: ' + (state.userRole || 'N/A') + '\\n' +
        '  Agency: ' + (state.userAgency || 'N/A') + ' | Badge: ' + (state.userBadge || 'N/A') + '\\n' +
        '  Session Remaining: ' + (timer ? timer.textContent : 'N/A') + '\\n' +
        '===================================================\\n\\n';
    report += 'RESOURCE STATUS:\\n';
    ['patrol', 'drones', 'sensors', 'gps', 'officers'].forEach(function (r) {
        var el = document.getElementById('res-' + r);
        report += '  ' + r.charAt(0).toUpperCase() + r.slice(1) + ': ' + (el ? el.textContent : '0') + '\\n';
    });
    report += '\\nAUDIT LOG (' + auditLog.length + ' entries):\\n';
    auditLog.forEach(function (e) {
        report += '  [' + e.time + '] ' + e.type + ': ' + e.desc + ' (' + e.user + ')\\n';
    });
    var blob = new Blob([report], { type: 'text/plain' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'SCS-Dashboard-Report-' + new Date().toISOString().slice(0, 10) + '.txt';
    a.click();
    logFeed('Dashboard report exported', 'color: var(--success); font-weight: 700;');
}

// ============ 8. ROI & RESPONSE TIME CHARTS ============

function initCostBenefitCharts() {
    var roiCtx = document.getElementById('roiChart');
    var respCtx = document.getElementById('responseChart');
    if (!roiCtx || !respCtx) return;

    new Chart(roiCtx, {
        type: 'bar',
        data: {
            labels: ['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5'],
            datasets: [
                { label: 'Investment ($K)', data: [850, 420, 380, 350, 320], backgroundColor: '#ef4444aa', borderRadius: 8 },
                { label: 'Savings ($K)', data: [200, 680, 1100, 1450, 1800], backgroundColor: '#10b981aa', borderRadius: 8 }
            ]
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { color: '#94a3b8', usePointStyle: true } } }, scales: { y: { ticks: { color: '#94a3b8', callback: function (v) { return '$' + v + 'K'; } }, grid: { color: '#1e293b33' } }, x: { ticks: { color: '#94a3b8' }, grid: { display: false } } } }
    });

    new Chart(respCtx, {
        type: 'line',
        data: {
            labels: ['Before SCS', 'Month 3', 'Month 6', 'Month 12', 'Month 18', 'Month 24'],
            datasets: [
                { label: 'Response Time (min)', data: [14.2, 11.5, 8.8, 6.3, 4.7, 3.1], borderColor: '#4f46e5', backgroundColor: '#4f46e522', fill: true, tension: 0.4, pointRadius: 5, pointBackgroundColor: '#4f46e5' },
                { label: 'National Avg (min)', data: [14, 14, 14, 14, 14, 14], borderColor: '#ef444466', borderDash: [5, 5], pointRadius: 0, fill: false }
            ]
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { color: '#94a3b8', usePointStyle: true } } }, scales: { y: { ticks: { color: '#94a3b8', callback: function (v) { return v + ' min'; } }, grid: { color: '#1e293b33' } }, x: { ticks: { color: '#94a3b8' }, grid: { display: false } } } }
    });
}

// ============ UPDATE handleLogin TO START ALL FEATURES ============

var _origHandleLogin = handleLogin;
handleLogin = function () {
    _origHandleLogin();
    startSessionTimer();
    updateResourcePanel();
    setInterval(updateResourcePanel, 15000);
    initCostBenefitCharts();
    updateSystemHealth();
    setInterval(updateSystemHealth, 20000);
    startChatSimulation();
    pushNotification('System', 'Welcome to SCS Command — all systems operational');
    pushNotification('Security', 'Session encrypted and IP logged');
    addAuditEntry('Auth', 'User authenticated: ' + state.userName + ' [' + state.userAgency + ' / ' + state.userRole + ']');
    addAuditEntry('System', 'All subsystems initialized');
};

// ============ 1. THREAT LEVEL INDICATOR ============

var threatLevels = [
    { name: 'LOW', color: '#10b981', icon: '\uD83D\uDFE2', bg: 'linear-gradient(90deg,#10b981,#059669)' },
    { name: 'GUARDED', color: '#3b82f6', icon: '\uD83D\uDD35', bg: 'linear-gradient(90deg,#3b82f6,#2563eb)' },
    { name: 'ELEVATED', color: '#f59e0b', icon: '\uD83D\uDFE1', bg: 'linear-gradient(90deg,#f59e0b,#d97706)' },
    { name: 'HIGH', color: '#f97316', icon: '\uD83D\uDFE0', bg: 'linear-gradient(90deg,#f97316,#ea580c)' },
    { name: 'SEVERE', color: '#dc2626', icon: '\uD83D\uDD34', bg: 'linear-gradient(90deg,#dc2626,#b91c1c)' }
];
var currentThreatLevel = 0;

function cycleThreatLevel() {
    currentThreatLevel = (currentThreatLevel + 1) % threatLevels.length;
    var t = threatLevels[currentThreatLevel];
    var bar = document.getElementById('threat-level-bar');
    var txt = document.getElementById('threat-level-text');
    if (bar) bar.style.background = t.bg;
    if (txt) txt.textContent = 'THREAT LEVEL: ' + t.name;
    bar.querySelector('span').textContent = t.icon;
    logFeed('Threat level changed to ' + t.name, 'color: ' + t.color + '; font-weight: 700;');
    pushNotification('Security', 'Threat level updated: ' + t.name);
    addAuditEntry('Threat', 'Level set to ' + t.name);
}

// ============ 2. NOTIFICATION CENTER ============

var notifications = [];
var notifOpen = false;

function pushNotification(type, message) {
    notifications.unshift({
        type: type,
        msg: message,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        read: false
    });
    updateNotifBadge();
}

function updateNotifBadge() {
    var unread = notifications.filter(function (n) { return !n.read; }).length;
    var badge = document.getElementById('notif-badge');
    if (badge) {
        badge.textContent = unread;
        badge.style.display = unread > 0 ? 'flex' : 'none';
    }
}

function toggleNotificationCenter() {
    notifOpen = !notifOpen;
    var dd = document.getElementById('notif-dropdown');
    dd.style.display = notifOpen ? 'block' : 'none';
    if (notifOpen) {
        notifications.forEach(function (n) { n.read = true; });
        updateNotifBadge();
        renderNotifications();
    }
}

function renderNotifications() {
    var list = document.getElementById('notif-list');
    if (notifications.length === 0) {
        list.innerHTML = '<div style="color:var(--text-muted);text-align:center;padding:20px;">No notifications</div>';
        return;
    }
    var icons = { System: '\u2699\uFE0F', Security: '\uD83D\uDD12', Alert: '\u26A0\uFE0F', Threat: '\uD83D\uDEE1\uFE0F', Chat: '\uD83D\uDCAC', Incident: '\uD83D\uDCCB' };
    list.innerHTML = notifications.slice(0, 20).map(function (n) {
        return '<div style="padding:8px 10px;border-bottom:1px solid var(--border);display:flex;gap:8px;align-items:flex-start;">' +
            '<span style="font-size:14px;">' + (icons[n.type] || '\uD83D\uDD14') + '</span>' +
            '<div style="flex:1;"><div style="font-size:11px;font-weight:600;">' + n.msg + '</div>' +
            '<div style="font-size:9px;color:var(--text-muted);margin-top:2px;">' + n.type + ' \u2022 ' + n.time + '</div></div></div>';
    }).join('');
}

function clearNotifications() {
    notifications = [];
    updateNotifBadge();
    renderNotifications();
}

document.addEventListener('click', function (e) {
    var dd = document.getElementById('notif-dropdown');
    if (notifOpen && dd && !dd.contains(e.target) && !e.target.closest('[aria-label="Notifications"]')) {
        notifOpen = false;
        dd.style.display = 'none';
    }
});

// ============ 3. INTERAGENCY CHAT / DISPATCH ============

var chatOpen = false;
var chatSimInterval = null;

var dispatchMessages = [
    { sender: 'LAPD Dispatch', msg: 'All units, code 6 at Wilshire and Western. Requesting backup.', color: '#4f46e5' },
    { sender: 'CHP Central', msg: 'Traffic incident on I-10 westbound near La Cienega. Two lanes blocked.', color: '#06b6d4' },
    { sender: 'SDPD South', msg: 'Missing person alert: Female, 34, last seen Gaslamp Quarter.', color: '#e11d48' },
    { sender: 'LASD Comms', msg: 'Welfare check requested at 1400 block of Temple Ave.', color: '#f59e0b' },
    { sender: 'SCS Control', msg: 'Shield Node 847 offline momentarily. Auto-restart initiated.', color: '#0d9488' },
    { sender: 'CHP South', msg: 'Pursuit terminated safely on SR-91 near Tyler. Suspect in custody.', color: '#06b6d4' },
    { sender: 'LAPD Air', msg: 'Air unit overhead Hollywood div. Thermal sweep negative.', color: '#4f46e5' },
    { sender: 'OCSD Dispatch', msg: 'Structure fire reported Anaheim Hills. FD en route.', color: '#f97316' },
    { sender: 'SCS Horizon', msg: 'Predictive risk: elevated for Orange County next 2 hours.', color: '#8b5cf6' },
    { sender: 'SBCSD Dispatch', msg: 'Traffic stop on I-15 at Cajon Pass. Requesting K-9 unit.', color: '#f59e0b' },
    { sender: 'Port of LA Sec', msg: 'Container scan complete at Gate 4. All clear.', color: '#0d9488' },
    { sender: 'Campus PD', msg: 'Lockdown drill concluded at Cal State LA. All clear.', color: '#10b981' }
];

function toggleChatPanel() {
    chatOpen = !chatOpen;
    var panel = document.getElementById('chat-panel');
    panel.style.right = chatOpen ? '0' : '-380px';
}

function addChatMessage(sender, msg, color, isUser) {
    var container = document.getElementById('chat-messages');
    var div = document.createElement('div');
    div.style.cssText = isUser ?
        'background:linear-gradient(135deg,#4f46e5,#6366f1);color:white;padding:10px 14px;border-radius:14px 14px 4px 14px;max-width:85%;align-self:flex-end;font-size:12px;' :
        'background:var(--bg-panel-alt);padding:10px 14px;border-radius:14px 14px 14px 4px;max-width:85%;align-self:flex-start;font-size:12px;';
    div.innerHTML = (isUser ? '' : '<div style="font-size:10px;font-weight:800;color:' + (color || 'var(--iwin)') + ';margin-bottom:4px;">' + sender + '</div>') +
        '<div>' + msg + '</div>' +
        '<div style="font-size:9px;opacity:0.6;margin-top:4px;text-align:right;">' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + '</div>';
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
}

function sendChatMessage() {
    var input = document.getElementById('chat-input');
    var msg = input.value.trim();
    if (!msg) return;
    addChatMessage('You', msg, '#4f46e5', true);
    input.value = '';
    addAuditEntry('Chat', 'Dispatch message sent: ' + msg);
    setTimeout(function () {
        var reply = dispatchMessages[Math.floor(Math.random() * dispatchMessages.length)];
        addChatMessage(reply.sender, 'Copy that. ' + reply.msg, reply.color, false);
    }, 1500 + Math.random() * 2000);
}

function startChatSimulation() {
    addChatMessage('SCS Control', 'Dispatch channel active. All agencies connected.', '#0d9488', false);
    chatSimInterval = setInterval(function () {
        var m = dispatchMessages[Math.floor(Math.random() * dispatchMessages.length)];
        addChatMessage(m.sender, m.msg, m.color, false);
        pushNotification('Chat', m.sender + ': ' + m.msg.substring(0, 50) + '...');
    }, 12000 + Math.random() * 8000);
}

// ============ 4. GEOFENCE ZONE MANAGER ============

var geofenceZones = [
    { name: 'Cal State LA Campus', type: 'Campus', radius: '500m', status: 'Active', color: '#4f46e5' },
    { name: 'Port of LA Terminal', type: 'Critical Infrastructure', radius: '1.2km', status: 'Active', color: '#dc2626' },
    { name: 'USC Campus Perimeter', type: 'Campus', radius: '800m', status: 'Active', color: '#4f46e5' },
    { name: 'I-710 Cargo Corridor', type: 'Transportation', radius: '2km', status: 'Active', color: '#f59e0b' },
    { name: 'LAX Security Zone', type: 'Aviation', radius: '3km', status: 'Active', color: '#dc2626' },
    { name: 'SD Naval Base Buffer', type: 'Military', radius: '1.5km', status: 'Active', color: '#10b981' },
    { name: 'Gaslamp Quarter', type: 'Entertainment District', radius: '600m', status: 'Monitoring', color: '#8b5cf6' },
    { name: 'OC Fairgrounds', type: 'Event Venue', radius: '700m', status: 'Standby', color: '#f97316' }
];

function openGeofenceManager() {
    addAuditEntry('Geofence', 'Geofence manager opened');
    var html = '<h2 style="font-size:20px;font-weight:900;margin-bottom:4px;"><i class="ph-bold ph-polygon" style="margin-right:8px;color:#4f46e5;"></i>Geofence Zone Manager</h2>' +
        '<p style="font-size:12px;color:var(--text-muted);margin-bottom:16px;">' + geofenceZones.length + ' zones configured across SoCal</p>' +
        '<div style="max-height:400px;overflow-y:auto;">';
    geofenceZones.forEach(function (z, i) {
        html += '<div style="display:flex;align-items:center;gap:12px;padding:10px;border-bottom:1px solid var(--border);">' +
            '<div style="width:10px;height:10px;border-radius:50%;background:' + z.color + ';flex-shrink:0;"></div>' +
            '<div style="flex:1;"><div style="font-size:13px;font-weight:700;">' + z.name + '</div>' +
            '<div style="font-size:10px;color:var(--text-muted);">' + z.type + ' \u2022 Radius: ' + z.radius + '</div></div>' +
            '<span style="font-size:10px;font-weight:700;padding:3px 10px;border-radius:6px;background:' + (z.status === 'Active' ? '#10b98122' : '#f59e0b22') + ';color:' + (z.status === 'Active' ? '#10b981' : '#f59e0b') + ';">' + z.status + '</span></div>';
    });
    html += '</div><button onclick="addNewGeofence()" style="width:100%;padding:12px;margin-top:12px;background:linear-gradient(135deg,#4f46e5,#6366f1);color:white;border:none;border-radius:10px;font-weight:700;cursor:pointer;font-size:13px;"><i class="ph-bold ph-plus" style="margin-right:6px;"></i>Add New Zone</button>';
    document.getElementById('modal-body').innerHTML = html;
    document.getElementById('modal-overlay').classList.add('active');
}

function addNewGeofence() {
    var name = prompt('Enter geofence zone name:');
    if (!name) return;
    geofenceZones.push({ name: name, type: 'Custom', radius: '500m', status: 'Active', color: '#6366f1' });
    logFeed('Geofence added: ' + name, 'color: #4f46e5; font-weight: 700;');
    addAuditEntry('Geofence', 'New zone created: ' + name);
    pushNotification('System', 'Geofence zone "' + name + '" activated');
    openGeofenceManager();
}

// ============ 5. OFFICER PROFILE CARDS ============

var officerProfiles = {
    'P-Alpha': { name: 'Sgt. Martinez', badge: 'LAPD-4821', shift: 'Day Watch', cam: 'Online', since: '06:00' },
    'P-Bravo': { name: 'Ofc. Johnson', badge: 'LASD-7733', shift: 'Day Watch', cam: 'Online', since: '06:00' },
    'P-Charlie': { name: 'Det. Chen', badge: 'SDPD-2290', shift: 'Swing', cam: 'Buffering', since: '14:00' },
    'P-Delta': { name: 'Ofc. Williams', badge: 'CHP-5510', shift: 'Day Watch', cam: 'Online', since: '07:00' },
    'P-Echo': { name: 'Sgt. Park', badge: 'OCSD-8845', shift: 'Swing', cam: 'Online', since: '14:00' },
    'P-Foxtrot': { name: 'Ofc. Garcia', badge: 'SBCSD-3367', shift: 'Graveyard', cam: 'Offline', since: '22:00' }
};

function showOfficerProfile(callsign) {
    var p = officerProfiles[callsign];
    if (!p) return;
    var camColor = p.cam === 'Online' ? '#10b981' : (p.cam === 'Buffering' ? '#f59e0b' : '#dc2626');
    var html = '<div style="text-align:center;margin-bottom:16px;">' +
        '<div style="width:64px;height:64px;background:linear-gradient(135deg,#4f46e5,#0d9488);border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 10px;font-size:24px;color:white;"><i class="ph-bold ph-user-circle"></i></div>' +
        '<h3 style="font-size:18px;font-weight:900;">' + p.name + '</h3>' +
        '<div style="font-size:12px;color:var(--text-muted);">Callsign: <strong>' + callsign + '</strong></div></div>' +
        '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;font-size:12px;">' +
        '<div style="background:var(--bg-panel-alt);padding:10px;border-radius:10px;"><div style="font-weight:800;margin-bottom:2px;">Badge</div><div style="color:var(--text-muted);">' + p.badge + '</div></div>' +
        '<div style="background:var(--bg-panel-alt);padding:10px;border-radius:10px;"><div style="font-weight:800;margin-bottom:2px;">Shift</div><div style="color:var(--text-muted);">' + p.shift + '</div></div>' +
        '<div style="background:var(--bg-panel-alt);padding:10px;border-radius:10px;"><div style="font-weight:800;margin-bottom:2px;">On Duty Since</div><div style="color:var(--text-muted);">' + p.since + '</div></div>' +
        '<div style="background:var(--bg-panel-alt);padding:10px;border-radius:10px;"><div style="font-weight:800;margin-bottom:2px;">Body Cam</div><div style="color:' + camColor + ';font-weight:700;">\u25CF ' + p.cam + '</div></div></div>';
    document.getElementById('modal-body').innerHTML = html;
    document.getElementById('modal-overlay').classList.add('active');
}

// ============ 6. SPANISH LANGUAGE TOGGLE ============

var isSpanish = false;
var translations = {
    'Open Command Deck': 'Abrir Centro de Mando',
    'Shield Active': 'Escudo Activo',
    'IWIN Ready': 'IWIN Listo',
    'Horizon Online': 'Horizonte En L\u00EDnea',
    'One Region.': 'Una Regi\u00F3n.',
    'Zero Latency.': 'Cero Latencia.',
    'SCS Live Operations: Southern California Sector': 'SCS Operaciones en Vivo: Sector Sur de California',
    'Simulate Breach': 'Simular Brecha',
    'Report Incident': 'Reportar Incidente',
    'Live Resource Allocation': 'Asignaci\u00F3n de Recursos en Vivo',
    'Cost-Benefit Analysis': 'An\u00E1lisis Costo-Beneficio',
    'Compliance & Standards': 'Cumplimiento y Est\u00E1ndares',
    'System Health Monitor': 'Monitor de Salud del Sistema',
    'Export PDF': 'Exportar PDF',
    'Print Report': 'Imprimir Reporte',
    'Export CSV': 'Exportar CSV',
    'Audit Log': 'Registro de Auditor\u00EDa',
    'Toggle Theme': 'Cambiar Tema',
    'Geofences': 'Geocercas'
};

function toggleLanguage() {
    isSpanish = !isSpanish;
    var btn = document.getElementById('lang-toggle-text');
    btn.textContent = isSpanish ? 'ES' : 'EN';

    var keys = Object.keys(translations);
    var allText = document.querySelectorAll('h1, h2, h3, h4, span, button, p, div');
    allText.forEach(function (el) {
        if (el.children.length > 0 && el.tagName !== 'BUTTON') return;
        keys.forEach(function (en) {
            var es = translations[en];
            if (isSpanish && el.textContent.trim() === en) {
                el.setAttribute('data-original', en);
                el.textContent = es;
            } else if (!isSpanish && el.getAttribute('data-original') === en) {
                el.textContent = en;
                el.removeAttribute('data-original');
            }
        });
    });
    logFeed(isSpanish ? 'Idioma cambiado a Espa\u00F1ol' : 'Language switched to English', 'color: var(--iwin);');
}

// ============ 7. SYSTEM HEALTH MONITOR ============

function updateSystemHealth() {
    var latency = 15 + Math.floor(Math.random() * 35);
    var bw = (1.5 + Math.random() * 3.5).toFixed(1);
    var uptime = (99.9 + Math.random() * 0.09).toFixed(2);
    var el = document.getElementById('health-latency');
    if (el) {
        el.textContent = latency + 'ms';
        el.style.color = latency > 40 ? '#f59e0b' : '#10b981';
    }
    var bwEl = document.getElementById('health-bw');
    if (bwEl) {
        bwEl.textContent = bw + ' Gbps';
        bwEl.style.color = parseFloat(bw) > 4 ? '#f59e0b' : '#10b981';
    }
    var upEl = document.getElementById('health-uptime');
    if (upEl) upEl.textContent = uptime + '%';
}

// ============ 8. CSV EXPORT ============

function exportCSV() {
    addAuditEntry('Export', 'CSV export initiated');
    var csv = 'Category,Metric,Value\n';
    ['patrol', 'drones', 'sensors', 'gps', 'officers'].forEach(function (r) {
        var el = document.getElementById('res-' + r);
        csv += 'Resources,' + r + ',' + (el ? el.textContent : '0') + '\n';
    });
    csv += '\nTime,User,Type,Description\n';
    auditLog.forEach(function (e) {
        csv += '"' + e.time + '","' + e.user + '","' + e.type + '","' + e.desc.replace(/"/g, '""') + '"\n';
    });
    csv += '\nZone Name,Type,Radius,Status\n';
    geofenceZones.forEach(function (z) {
        csv += '"' + z.name + '","' + z.type + '","' + z.radius + '","' + z.status + '"\n';
    });
    var blob = new Blob([csv], { type: 'text/csv' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'SCS-Data-Export-' + new Date().toISOString().slice(0, 10) + '.csv';
    a.click();
    logFeed('CSV data exported successfully', 'color: var(--success); font-weight: 700;');
}

// ============ 9. SKELETON LOADERS ============

function showSkeletons() {
    document.querySelectorAll('.kpi-value').forEach(function (el) {
        el.setAttribute('data-orig', el.textContent);
        el.innerHTML = '<div class="skeleton-line"></div>';
    });
    setTimeout(function () {
        document.querySelectorAll('.kpi-value').forEach(function (el) {
            var orig = el.getAttribute('data-orig');
            if (orig) el.textContent = orig;
        });
    }, 1200);
}

// ============ FEATURE 1: TWO-FACTOR AUTHENTICATION SIMULATION ============

var tfaPending = false;

function show2FAModal() {
    tfaPending = true;
    var overlay = document.createElement('div');
    overlay.id = 'tfa-overlay';
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.6);backdrop-filter:blur(8px);z-index:99999;display:flex;align-items:center;justify-content:center;';
    overlay.innerHTML =
        '<div style="background:var(--bg-panel);border-radius:20px;padding:32px;max-width:380px;width:90%;text-align:center;border:1px solid var(--border);box-shadow:0 25px 50px rgba(0,0,0,0.3);">' +
        '<div style="width:64px;height:64px;background:linear-gradient(135deg,#4f46e5,#0d9488);border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 16px;font-size:28px;color:white;"><i class="ph-bold ph-shield-check"></i></div>' +
        '<h3 style="font-size:20px;font-weight:900;margin-bottom:4px;">Two-Factor Verification</h3>' +
        '<p style="font-size:12px;color:var(--text-muted);margin-bottom:20px;">A 6-digit code has been sent to your registered device.</p>' +
        '<div style="display:flex;gap:8px;justify-content:center;margin-bottom:16px;" id="tfa-digits">' +
        '<input type="text" maxlength="1" class="tfa-digit" style="width:42px;height:50px;text-align:center;font-size:22px;font-weight:900;border:2px solid var(--border);border-radius:10px;background:var(--bg-panel-alt);color:var(--text-primary);outline:none;font-family:JetBrains Mono,monospace;">' +
        '<input type="text" maxlength="1" class="tfa-digit" style="width:42px;height:50px;text-align:center;font-size:22px;font-weight:900;border:2px solid var(--border);border-radius:10px;background:var(--bg-panel-alt);color:var(--text-primary);outline:none;font-family:JetBrains Mono,monospace;">' +
        '<input type="text" maxlength="1" class="tfa-digit" style="width:42px;height:50px;text-align:center;font-size:22px;font-weight:900;border:2px solid var(--border);border-radius:10px;background:var(--bg-panel-alt);color:var(--text-primary);outline:none;font-family:JetBrains Mono,monospace;">' +
        '<input type="text" maxlength="1" class="tfa-digit" style="width:42px;height:50px;text-align:center;font-size:22px;font-weight:900;border:2px solid var(--border);border-radius:10px;background:var(--bg-panel-alt);color:var(--text-primary);outline:none;font-family:JetBrains Mono,monospace;">' +
        '<input type="text" maxlength="1" class="tfa-digit" style="width:42px;height:50px;text-align:center;font-size:22px;font-weight:900;border:2px solid var(--border);border-radius:10px;background:var(--bg-panel-alt);color:var(--text-primary);outline:none;font-family:JetBrains Mono,monospace;">' +
        '<input type="text" maxlength="1" class="tfa-digit" style="width:42px;height:50px;text-align:center;font-size:22px;font-weight:900;border:2px solid var(--border);border-radius:10px;background:var(--bg-panel-alt);color:var(--text-primary);outline:none;font-family:JetBrains Mono,monospace;">' +
        '</div>' +
        '<div id="tfa-status" style="font-size:11px;color:var(--text-muted);margin-bottom:16px;"><i class="ph-bold ph-hourglass-medium" style="margin-right:4px;"></i>Sending verification code...</div>' +
        '<button id="tfa-verify-btn" onclick="verify2FA()" disabled style="width:100%;padding:14px;background:#94a3b8;color:white;border:none;border-radius:12px;font-size:14px;font-weight:700;cursor:not-allowed;font-family:Inter,sans-serif;">Waiting for code...</button>' +
        '<p style="font-size:10px;color:var(--text-muted);margin-top:12px;">SCS Command access requires multi-factor verification</p>' +
        '</div>';
    document.body.appendChild(overlay);

    // Auto-fill OTP after 3 seconds
    var code = '847291';
    setTimeout(function () {
        var digits = document.querySelectorAll('.tfa-digit');
        for (var i = 0; i < digits.length; i++) {
            digits[i].value = code[i];
            digits[i].style.borderColor = '#4f46e5';
        }
        document.getElementById('tfa-status').innerHTML = '<i class="ph-bold ph-check-circle" style="color:#10b981;margin-right:4px;"></i>Code received via SMS';
        var btn = document.getElementById('tfa-verify-btn');
        btn.disabled = false;
        btn.style.background = 'linear-gradient(135deg,#4f46e5,#6366f1)';
        btn.style.cursor = 'pointer';
        btn.textContent = 'Verify & Access';
    }, 3000);

    // Auto-advance on digit input
    setTimeout(function () {
        var digits = document.querySelectorAll('.tfa-digit');
        digits.forEach(function (d, i) {
            d.addEventListener('input', function () {
                if (d.value && i < digits.length - 1) digits[i + 1].focus();
            });
        });
    }, 100);
}

function verify2FA() {
    var overlay = document.getElementById('tfa-overlay');
    if (overlay) overlay.remove();
    tfaPending = false;
    addAuditEntry('Security', '2FA verification successful');
    logFeed('\u2705 Two-factor authentication verified', 'color: #10b981; font-weight: 700;');
    pushNotification('Security', 'MFA verification successful');
}

// ============ FEATURE 2: ROLE-BASED ACCESS CONTROL (RBAC) ============

var rbacPermissions = {
    'Commander': { emergency: true, incidents: true, geofences: true, export: true, audit: true, simulation: true, liveMode: true, chat: true, cart: true },
    'Analyst': { emergency: false, incidents: true, geofences: false, export: true, audit: true, simulation: true, liveMode: true, chat: false, cart: false },
    'Field Officer': { emergency: true, incidents: true, geofences: false, export: false, audit: false, simulation: true, liveMode: true, chat: true, cart: false },
    'Observer': { emergency: false, incidents: false, geofences: false, export: false, audit: false, simulation: false, liveMode: false, chat: false, cart: false }
};

function applyRBAC() {
    var role = state.userRole;
    var perms = rbacPermissions[role];
    if (!perms) return;

    var rbacRules = [
        { selector: '[onclick*="openEmergencyAlert"]', perm: 'emergency' },
        { selector: '[onclick*="openIncidentReport"]', perm: 'incidents' },
        { selector: '[onclick*="openGeofenceManager"]', perm: 'geofences' },
        { selector: '[onclick*="exportPDF"], [onclick*="exportCSV"], [onclick*="exportDashboardReport"]', perm: 'export' },
        { selector: '[onclick*="openAuditLog"]', perm: 'audit' },
        { selector: '[onclick*="runSimulation"]', perm: 'simulation' },
        { selector: '#live-mode-btn', perm: 'liveMode' },
        { selector: '#chat-toggle-btn', perm: 'chat' },
        { selector: '[onclick*="openCart"]', perm: 'cart' }
    ];

    rbacRules.forEach(function (rule) {
        if (!perms[rule.perm]) {
            document.querySelectorAll(rule.selector).forEach(function (el) {
                el.style.opacity = '0.35';
                el.style.pointerEvents = 'none';
                el.title = 'Restricted — requires elevated access';
            });
        }
    });

    if (role === 'Observer') {
        var notice = document.createElement('div');
        notice.style.cssText = 'position:fixed;bottom:60px;left:50%;transform:translateX(-50%);background:#f59e0b;color:#92400e;font-size:11px;font-weight:700;padding:6px 20px;border-radius:8px;z-index:9999;box-shadow:0 4px 12px rgba(0,0,0,0.15);';
        notice.innerHTML = '<i class="ph-bold ph-eye" style="margin-right:6px;"></i>OBSERVER MODE — Read-only access';
        document.body.appendChild(notice);
    }

    logFeed('RBAC applied: ' + role + ' permissions loaded', 'color: var(--text-secondary);');
    addAuditEntry('Security', 'RBAC permissions applied for role: ' + role);
}

// ============ FEATURE 3: WEBSOCKET-STYLE STREAMING FEED ============

var wsSimInterval = null;
var wsStreamActive = false;

var wsEventTemplates = [
    { type: 'sensor', msgs: ['Shield Node #{N} heartbeat OK', 'Sensor cluster #{N} reporting normal', 'IoT gateway #{N} synced — {V}ms latency'] },
    { type: 'patrol', msgs: ['Unit P-{C} position updated ({LAT}, {LON})', 'Patrol {C} status: 10-8 in service', 'Unit P-{C} speed: {V}mph on I-{R}'] },
    { type: 'intel', msgs: ['Horizon risk score updated: {V}% for sector {S}', 'Predictive model recalculated — {V} anomalies', 'Data fusion: {V} streams consolidated'] },
    { type: 'system', msgs: ['Bandwidth: {V} Gbps / 10 Gbps capacity', 'API response: {V}ms avg across {N} endpoints', 'Encryption handshake: TLS 1.3 verified'] },
    { type: 'alert', msgs: ['Geofence #{N} proximity alert — asset within 100m', 'Camera #{N} motion detected — zone {S}', 'Body cam #{N} — stream buffering'] }
];

var wsCallsigns = ['Alpha', 'Bravo', 'Charlie', 'Delta', 'Echo', 'Foxtrot'];
var wsSectors = ['LA-Central', 'LA-West', 'LA-East', 'OC-North', 'OC-South', 'IE-West', 'IE-East', 'SD-Central', 'SD-South'];

function generateWSEvent() {
    var template = wsEventTemplates[Math.floor(Math.random() * wsEventTemplates.length)];
    var msg = template.msgs[Math.floor(Math.random() * template.msgs.length)];
    msg = msg.replace('{N}', Math.floor(Math.random() * 1400) + 1);
    msg = msg.replace('{V}', (Math.random() * 100).toFixed(1));
    msg = msg.replace('{C}', wsCallsigns[Math.floor(Math.random() * wsCallsigns.length)]);
    msg = msg.replace('{LAT}', (33.5 + Math.random() * 1.5).toFixed(4));
    msg = msg.replace('{LON}', (-118.5 + Math.random() * 1.5).toFixed(4));
    msg = msg.replace('{R}', ['5', '10', '15', '405', '710', '110', '91'][Math.floor(Math.random() * 7)]);
    msg = msg.replace('{S}', wsSectors[Math.floor(Math.random() * wsSectors.length)]);

    var colors = { sensor: 'var(--shield)', patrol: 'var(--iwin)', intel: 'var(--horizon)', system: 'var(--text-secondary)', alert: '#f97316' };
    var icons = { sensor: '\uD83D\uDCE1', patrol: '\uD83D\uDE93', intel: '\uD83E\uDDE0', system: '\u2699\uFE0F', alert: '\u26A0\uFE0F' };
    logFeed(icons[template.type] + ' [WS] ' + msg, 'color: ' + colors[template.type] + ';');
}

function startWSStream() {
    if (wsStreamActive) return;
    wsStreamActive = true;
    logFeed('\uD83D\uDD0C WebSocket stream connected', 'color: #10b981; font-weight: 700;');
    wsSimInterval = setInterval(function () {
        generateWSEvent();
    }, 3000 + Math.random() * 5000);
}

function stopWSStream() {
    wsStreamActive = false;
    if (wsSimInterval) clearInterval(wsSimInterval);
    wsSimInterval = null;
    logFeed('\u274C WebSocket stream disconnected', 'color: var(--text-muted);');
}

// ============ FEATURE 4: HEATMAP LEGEND ============

function showHeatmapLegend() {
    var existing = document.getElementById('heatmap-legend');
    if (existing) { existing.remove(); return; }
    var legend = document.createElement('div');
    legend.id = 'heatmap-legend';
    legend.className = 'heatmap-legend';
    legend.innerHTML =
        '<div style="font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px;color:var(--text-muted);">Incident Density</div>' +
        '<div style="display:flex;align-items:center;gap:6px;">' +
        '<span style="font-size:9px;color:var(--text-muted);">Low</span>' +
        '<div style="flex:1;height:8px;border-radius:4px;background:linear-gradient(90deg,#10b981,#f59e0b,#ef4444);"></div>' +
        '<span style="font-size:9px;color:var(--text-muted);">High</span></div>' +
        '<div style="display:flex;gap:4px;margin-top:8px;">' +
        '<button onclick="filterHeatmapTime(\'all\')" class="heatmap-time-btn active" style="flex:1;padding:4px;font-size:9px;font-weight:700;border:1px solid var(--border);border-radius:6px;background:var(--bg-panel-alt);cursor:pointer;color:var(--text-primary);">All</button>' +
        '<button onclick="filterHeatmapTime(\'day\')" class="heatmap-time-btn" style="flex:1;padding:4px;font-size:9px;font-weight:700;border:1px solid var(--border);border-radius:6px;background:var(--bg-panel);cursor:pointer;color:var(--text-muted);">Day</button>' +
        '<button onclick="filterHeatmapTime(\'night\')" class="heatmap-time-btn" style="flex:1;padding:4px;font-size:9px;font-weight:700;border:1px solid var(--border);border-radius:6px;background:var(--bg-panel);cursor:pointer;color:var(--text-muted);">Night</button>' +
        '<button onclick="filterHeatmapTime(\'weekend\')" class="heatmap-time-btn" style="flex:1;padding:4px;font-size:9px;font-weight:700;border:1px solid var(--border);border-radius:6px;background:var(--bg-panel);cursor:pointer;color:var(--text-muted);">Wknd</button></div>';
    var mapContainer = document.querySelector('.map-container');
    if (mapContainer) mapContainer.appendChild(legend);
}

function filterHeatmapTime(period) {
    document.querySelectorAll('.heatmap-time-btn').forEach(function (b) {
        b.style.background = 'var(--bg-panel)';
        b.style.color = 'var(--text-muted)';
    });
    event.target.style.background = 'var(--bg-panel-alt)';
    event.target.style.color = 'var(--text-primary)';
    logFeed('Heatmap filter: ' + period + ' incidents', 'color: var(--text-secondary);');
}

// ============ FEATURE 5: ENHANCED PDF EXPORT ============

function exportEnhancedPDF() {
    logFeed('Generating enhanced PDF report...', 'color: var(--text-secondary);');
    addAuditEntry('Export', 'Enhanced PDF report generation initiated');
    try {
        var jsPDF = window.jspdf.jsPDF;
        var pdf = new jsPDF('p', 'mm', 'a4');
        var w = pdf.internal.pageSize.getWidth();

        // Cover page
        pdf.setFillColor(30, 41, 59);
        pdf.rect(0, 0, w, 297, 'F');
        pdf.setTextColor(255);
        pdf.setFontSize(32);
        pdf.text('SCS Dashboard Report', w / 2, 100, { align: 'center' });
        pdf.setFontSize(14);
        pdf.setTextColor(148, 163, 184);
        pdf.text('SoCal-SMART Unified Command', w / 2, 115, { align: 'center' });
        pdf.setFontSize(11);
        pdf.text('Generated: ' + new Date().toLocaleString(), w / 2, 140, { align: 'center' });
        pdf.text('Operator: ' + (state.userName || 'N/A') + ' | ' + (state.userRole || 'N/A'), w / 2, 150, { align: 'center' });
        pdf.text('Agency: ' + (state.userAgency || 'N/A') + ' | Badge: ' + (state.userBadge || 'N/A'), w / 2, 160, { align: 'center' });
        pdf.setTextColor(79, 70, 229);
        pdf.text('CONFIDENTIAL — LAW ENFORCEMENT SENSITIVE', w / 2, 250, { align: 'center' });

        // Page 2: KPI Summary
        pdf.addPage();
        pdf.setTextColor(30, 41, 59);
        pdf.setFontSize(20);
        pdf.text('Key Performance Indicators', 14, 20);
        pdf.setFontSize(11);
        pdf.setTextColor(100, 116, 139);

        var yPos = 35;
        var kpiData = [
            ['Shield Nodes', '1,402', 'Active across SoCal'],
            ['System Uptime', '98.7%', 'Last 30 days'],
            ['Avg Latency', '0.05s', 'Cross-network'],
            ['Active Units', '23', 'Currently deployed']
        ];
        kpiData.forEach(function (row) {
            pdf.setFontSize(12);
            pdf.setTextColor(30, 41, 59);
            pdf.text(row[0] + ': ' + row[1], 14, yPos);
            pdf.setFontSize(9);
            pdf.setTextColor(148, 163, 184);
            pdf.text(row[2], 14, yPos + 5);
            yPos += 15;
        });

        // Resource snapshot
        yPos += 10;
        pdf.setFontSize(16);
        pdf.setTextColor(30, 41, 59);
        pdf.text('Resource Allocation', 14, yPos);
        yPos += 10;
        ['patrol', 'drones', 'sensors', 'gps', 'officers'].forEach(function (r) {
            var el = document.getElementById('res-' + r);
            pdf.setFontSize(10);
            pdf.text(r.charAt(0).toUpperCase() + r.slice(1) + ': ' + (el ? el.textContent : '0'), 20, yPos);
            yPos += 7;
        });

        // Page 3: Dashboard screenshot
        pdf.addPage();
        pdf.setFontSize(16);
        pdf.text('Dashboard Capture', 14, 15);
        html2canvas(document.querySelector('.main-content'), { scale: 0.8, useCORS: true }).then(function (canvas) {
            var imgData = canvas.toDataURL('image/png');
            var imgW = w - 20;
            var imgH = (canvas.height * imgW) / canvas.width;
            if (imgH > 260) imgH = 260;
            pdf.addImage(imgData, 'PNG', 10, 25, imgW, imgH);
            pdf.save('SCS-Enhanced-Report-' + new Date().toISOString().slice(0, 10) + '.pdf');
            logFeed('\u2705 Enhanced PDF exported (3 pages)', 'color: var(--success); font-weight: 700;');
        });
    } catch (e) {
        logFeed('PDF export error: ' + e.message, 'color: var(--danger);');
    }
}

// ============ FEATURE 6: TREND FORECASTING CHART ============

function initForecastChart() {
    var ctx = document.getElementById('forecastChart');
    if (!ctx) return;

    // Historical data with simple linear regression forecast
    var historical = [42, 38, 45, 51, 47, 39, 35, 41, 44, 48, 52, 46];
    var labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var forecastLabels = ['Jan+', 'Feb+', 'Mar+', 'Apr+', 'May+', 'Jun+'];

    // Simple linear regression
    var n = historical.length;
    var sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
    for (var i = 0; i < n; i++) { sumX += i; sumY += historical[i]; sumXY += i * historical[i]; sumX2 += i * i; }
    var slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    var intercept = (sumY - slope * sumX) / n;

    var forecast = [];
    for (var j = 0; j < 6; j++) {
        forecast.push(Math.round(intercept + slope * (n + j)));
    }

    var allLabels = labels.concat(forecastLabels);
    var histDataset = historical.concat(Array(6).fill(null));
    var forecastDataset = Array(n - 1).fill(null).concat([historical[n - 1]]).concat(forecast);

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: allLabels,
            datasets: [
                { label: 'Historical Incidents', data: histDataset, borderColor: '#4f46e5', backgroundColor: '#4f46e522', fill: true, tension: 0.4, pointRadius: 4, pointBackgroundColor: '#4f46e5' },
                { label: 'Forecast (Regression)', data: forecastDataset, borderColor: '#0d9488', backgroundColor: '#0d948822', fill: true, tension: 0.4, borderDash: [8, 4], pointRadius: 4, pointBackgroundColor: '#0d9488', pointStyle: 'triangle' }
            ]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { position: 'bottom', labels: { color: '#94a3b8', usePointStyle: true } } },
            scales: {
                y: { ticks: { color: '#94a3b8' }, grid: { color: '#1e293b11' }, title: { display: true, text: 'Incidents', color: '#94a3b8' } },
                x: { ticks: { color: '#94a3b8' }, grid: { display: false } }
            }
        }
    });
}

// ============ FEATURE 9: PAGE LOAD PERFORMANCE BADGE ============

var _pageLoadStart = performance.now();

function showPerformanceBadge() {
    var loadTime = ((performance.now() - _pageLoadStart) / 1000).toFixed(2);
    var score = loadTime < 2 ? 'A+' : loadTime < 3 ? 'A' : loadTime < 4 ? 'B' : 'C';
    var scoreColor = score === 'A+' || score === 'A' ? '#10b981' : score === 'B' ? '#f59e0b' : '#ef4444';

    var badge = document.createElement('div');
    badge.id = 'perf-badge';
    badge.className = 'perf-badge';
    badge.innerHTML =
        '<div style="display:flex;align-items:center;gap:8px;">' +
        '<div style="width:28px;height:28px;border-radius:50%;background:' + scoreColor + '22;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:900;color:' + scoreColor + ';">' + score + '</div>' +
        '<div><div style="font-size:10px;font-weight:700;color:var(--text-primary);">' + loadTime + 's load</div>' +
        '<div style="font-size:8px;color:var(--text-muted);">Performance</div></div></div>';
    document.body.appendChild(badge);

    // Auto-hide after 8 seconds
    setTimeout(function () {
        badge.style.opacity = '0';
        badge.style.transition = 'opacity 0.5s';
        setTimeout(function () { badge.style.display = 'none'; }, 500);
    }, 8000);
}

// ============ FEATURE 11: ARCHITECTURE DIAGRAM INTERACTIONS ============

function highlightArchNode(pillar) {
    document.querySelectorAll('.arch-node').forEach(function (n) {
        n.style.opacity = '0.3';
        n.style.transform = 'scale(0.95)';
    });
    document.querySelectorAll('.arch-arrow').forEach(function (a) {
        a.style.opacity = '0.15';
    });
    var active = document.querySelector('.arch-node[data-pillar="' + pillar + '"]');
    if (active) {
        active.style.opacity = '1';
        active.style.transform = 'scale(1.05)';
    }
    document.querySelectorAll('.arch-arrow[data-from="' + pillar + '"], .arch-arrow[data-to="' + pillar + '"]').forEach(function (a) {
        a.style.opacity = '1';
    });
}

function resetArchDiagram() {
    document.querySelectorAll('.arch-node').forEach(function (n) {
        n.style.opacity = '1';
        n.style.transform = 'scale(1)';
    });
    document.querySelectorAll('.arch-arrow').forEach(function (a) {
        a.style.opacity = '1';
    });
}

// ============ FEATURE 12: USE CASE SCENARIO WALKTHROUGHS ============

var scenarioData = [
    {
        title: 'Cargo Theft Response',
        icon: 'ph-fill ph-truck',
        color: '#f59e0b',
        desc: 'A high-value container is flagged by Shield sensors after leaving a geofenced zone at the Port of LA.',
        steps: [
            { pillar: 'Shield', action: 'GPS tracker on container CARGO-7741 triggers geofence exit alert at Port of LA Terminal B.', time: 'T+0s' },
            { pillar: 'IWIN', action: 'Alert routed to LAPD Harbor Division. Nearest unit P-Alpha dispatched with real-time tracking.', time: 'T+12s' },
            { pillar: 'Horizon', action: 'Predictive model calculates probable route: I-710 N → I-10 E toward Inland Empire.', time: 'T+18s' },
            { pillar: 'IWIN', action: 'CHP units alerted on I-710 corridor. Coordinated pursuit handoff initiated.', time: 'T+45s' },
            { pillar: 'Shield', action: 'Container recovered at Fontana interchange. Asset integrity confirmed.', time: 'T+22min' }
        ]
    },
    {
        title: 'Wildfire Evacuations',
        icon: 'ph-fill ph-fire',
        color: '#ef4444',
        desc: 'A fast-moving brush fire in the Inland Empire threatens residential areas and highway corridors.',
        steps: [
            { pillar: 'Shield', action: 'Thermal sensors in San Bernardino foothills detect 420\u00B0F anomaly. Fire confirmed.', time: 'T+0s' },
            { pillar: 'Horizon', action: 'Wind model projects fire spread northeast at 15mph. Evacuation zones calculated.', time: 'T+30s' },
            { pillar: 'IWIN', action: 'Automated evacuation alerts pushed to 12,000 registered residents in 3 zones.', time: 'T+45s' },
            { pillar: 'IWIN', action: 'Traffic management: I-15 contraflow initiated. CHP units deployed to intersections.', time: 'T+3min' },
            { pillar: 'Horizon', action: 'Hospital capacity updated: Loma Linda at 78%, Arrowhead at 65%. Triage routing active.', time: 'T+8min' }
        ]
    },
    {
        title: 'Cross-County Pursuit',
        icon: 'ph-fill ph-police-car',
        color: '#4f46e5',
        desc: 'A suspect vehicle flees from Orange County into LA County during a pursuit, requiring seamless handoff.',
        steps: [
            { pillar: 'IWIN', action: 'OCSD units initiate pursuit on SR-91 westbound. Suspect vehicle: Silver sedan, plate 8XYZ123.', time: 'T+0s' },
            { pillar: 'Shield', action: 'ALPR cameras on SR-91 confirm vehicle match. Speed: 95mph heading toward LA County line.', time: 'T+2min' },
            { pillar: 'Horizon', action: 'Pursuit risk score: ELEVATED. Recommended: aerial tracking, ground unit stand-down.', time: 'T+3min' },
            { pillar: 'IWIN', action: 'Automated handoff to CHP South. LAPD Air Support dispatched. County line crossed.', time: 'T+5min' },
            { pillar: 'IWIN', action: 'Suspect vehicle disabled via authorized tire deflation on I-605. Arrest by CHP.', time: 'T+18min' }
        ]
    }
];

function toggleScenario(idx) {
    var details = document.getElementById('scenario-steps-' + idx);
    if (!details) return;
    var isOpen = details.style.maxHeight !== '0px' && details.style.maxHeight !== '';
    if (isOpen) {
        details.style.maxHeight = '0px';
        details.style.opacity = '0';
    } else {
        // Close others
        document.querySelectorAll('.scenario-steps').forEach(function (s) {
            s.style.maxHeight = '0px';
            s.style.opacity = '0';
        });
        details.style.maxHeight = details.scrollHeight + 'px';
        details.style.opacity = '1';
        logFeed('Viewing scenario: ' + scenarioData[idx].title, 'color: var(--text-secondary);');
    }
}

function playScenarioAnimation(idx) {
    var steps = document.querySelectorAll('#scenario-steps-' + idx + ' .scenario-step');
    steps.forEach(function (s) { s.style.opacity = '0.2'; });
    var i = 0;
    var interval = setInterval(function () {
        if (i > 0) steps[i - 1].style.opacity = '0.5';
        if (i < steps.length) {
            steps[i].style.opacity = '1';
            steps[i].style.transition = 'opacity 0.4s';
            i++;
        } else {
            clearInterval(interval);
            steps.forEach(function (s) { s.style.opacity = '1'; });
        }
    }, 1200);
}

// ============ UPDATED handleLogin WRAPPER (v3) ============

var _origHandleLoginV2 = handleLogin;
handleLogin = function () {
    _origHandleLoginV2();

    // Feature 1: 2FA for all logins
    show2FAModal();

    // Feature 2: RBAC
    setTimeout(function () { applyRBAC(); }, 500);

    // Feature 3: WebSocket streaming
    startWSStream();

    // Feature 6: Forecast chart
    initForecastChart();

    // Feature 9: Performance badge
    showPerformanceBadge();

    // Feature 4: Show heatmap legend when heatmap is toggled
    var origToggleLayer = window.toggleLayer;
    window.toggleLayer = function (type) {
        origToggleLayer(type);
        if (type === 'heat') showHeatmapLegend();
    };
};

// ============ BATCH 3: QUICK WINS ============

// --- Feature B3-1: Real-Time Clock ---
function initNavClock() {
    var el = document.getElementById('nav-clock');
    if (!el) {
        el = document.createElement('span');
        el.id = 'nav-clock';
        el.style.cssText = 'font-size:11px;font-weight:700;color:var(--text-muted);font-family:"JetBrains Mono",monospace;white-space:nowrap;';
        var timer = document.getElementById('session-timer');
        if (timer && timer.parentNode) timer.parentNode.insertBefore(el, timer);
    }
    function tick() {
        var d = new Date();
        var opts = { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
        el.textContent = d.toLocaleDateString('en-US', opts);
    }
    tick();
    setInterval(tick, 1000);
}

// --- Feature B3-2: Print-friendly (JS helper) ---
function printDashboard() {
    window.print();
}

// --- Feature B3-3: Data Persistence via localStorage ---
function initLocalStorage() {
    // Restore audit log
    var saved = localStorage.getItem('scs_audit_log');
    if (saved) {
        try {
            var entries = JSON.parse(saved);
            if (window.auditLog && Array.isArray(entries)) {
                window.auditLog = entries;
            }
        } catch (e) { /* ignore */ }
    }
    // Persist on changes by wrapping addAuditEntry
    if (typeof addAuditEntry === 'function') {
        var _origAudit = addAuditEntry;
        addAuditEntry = function (action) {
            _origAudit(action);
            try { localStorage.setItem('scs_audit_log', JSON.stringify(window.auditLog || [])); } catch (e) { }
        };
    }
}

// ============ BATCH 3: BIGGER ADDITIONS ============

// --- Feature B3-4: User Profile Modal ---
function openUserProfile() {
    var now = new Date();
    var loginTime = window._loginTimestamp || now;
    var elapsed = Math.floor((now - loginTime) / 60000);
    var auditCount = (window.auditLog || []).length;
    var role = (window.state && window.state.userRole) || 'Unknown';
    var fname = (window.state && window.state.userFirstName) || '';
    var lname = (window.state && window.state.userLastName) || '';
    var agency = (window.state && window.state.userAgency) || '';
    var badge = (window.state && window.state.userBadge) || '';
    var fp = getSessionFingerprint();

    var overlay = document.createElement('div');
    overlay.id = 'profile-overlay';
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.6);backdrop-filter:blur(6px);z-index:99999;display:flex;align-items:center;justify-content:center;';
    overlay.onclick = function (e) { if (e.target === overlay) overlay.remove(); };
    overlay.innerHTML =
        '<div style="background:var(--bg-panel);border:1px solid var(--border);border-radius:20px;padding:28px 32px;max-width:420px;width:90%;box-shadow:0 20px 60px rgba(0,0,0,0.3);">' +
        '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">' +
        '<h3 style="font-size:18px;font-weight:800;"><i class="ph-bold ph-user-circle" style="margin-right:8px;color:var(--iwin);"></i>User Profile</h3>' +
        '<button onclick="this.closest(\'#profile-overlay\').remove()" style="background:none;border:none;font-size:20px;cursor:pointer;color:var(--text-muted);">&times;</button>' +
        '</div>' +
        '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:20px;">' +
        '<div style="background:var(--bg-panel-alt);padding:12px;border-radius:12px;"><div style="font-size:9px;font-weight:800;color:var(--text-muted);text-transform:uppercase;">Name</div><div style="font-size:14px;font-weight:700;margin-top:4px;">' + fname + ' ' + lname + '</div></div>' +
        '<div style="background:var(--bg-panel-alt);padding:12px;border-radius:12px;"><div style="font-size:9px;font-weight:800;color:var(--text-muted);text-transform:uppercase;">Badge</div><div style="font-size:14px;font-weight:700;margin-top:4px;">' + badge + '</div></div>' +
        '<div style="background:var(--bg-panel-alt);padding:12px;border-radius:12px;"><div style="font-size:9px;font-weight:800;color:var(--text-muted);text-transform:uppercase;">Agency</div><div style="font-size:14px;font-weight:700;margin-top:4px;">' + agency + '</div></div>' +
        '<div style="background:var(--bg-panel-alt);padding:12px;border-radius:12px;"><div style="font-size:9px;font-weight:800;color:var(--text-muted);text-transform:uppercase;">Role</div><div style="font-size:14px;font-weight:700;margin-top:4px;color:var(--iwin);">' + role + '</div></div>' +
        '</div>' +
        '<div style="border-top:1px solid var(--border);padding-top:14px;">' +
        '<div style="font-size:10px;font-weight:800;color:var(--text-muted);text-transform:uppercase;margin-bottom:8px;">Session Details</div>' +
        '<div style="font-size:12px;line-height:2;color:var(--text-secondary);">' +
        '<div><i class="ph-bold ph-clock" style="margin-right:6px;color:var(--iwin);"></i>Login: ' + loginTime.toLocaleTimeString() + '</div>' +
        '<div><i class="ph-bold ph-timer" style="margin-right:6px;color:#f59e0b;"></i>Duration: ' + elapsed + ' min</div>' +
        '<div><i class="ph-bold ph-list-checks" style="margin-right:6px;color:#10b981;"></i>Actions logged: ' + auditCount + '</div>' +
        '<div><i class="ph-bold ph-fingerprint" style="margin-right:6px;color:#8b5cf6;"></i>' + fp.browser + ' / ' + fp.os + '</div>' +
        '<div><i class="ph-bold ph-monitor" style="margin-right:6px;color:#0d9488;"></i>' + fp.screen + '</div>' +
        '</div></div>' +
        (role === 'Commander' || role === 'IT Administrator' ? '<button onclick="openAdminSecurityPanel();this.closest(\'#profile-overlay\').remove();" style="width:100%;margin-top:16px;padding:12px;background:linear-gradient(135deg,#dc2626,#991b1b);color:white;border:none;border-radius:12px;font-size:12px;font-weight:800;cursor:pointer;font-family:Inter,sans-serif;"><i class="ph-bold ph-shield-warning" style="margin-right:6px;"></i>Admin Security Panel</button>' : '') +
        '</div>';
    document.body.appendChild(overlay);
}

// --- Feature B3-5: (Map drawing deferred — requires Leaflet.Draw plugin) ---

// --- Feature B3-6: Daily Briefing Modal ---
function showDailyBriefing() {
    var threats = ['Low', 'Guarded', 'Elevated'];
    var todayThreat = threats[Math.floor(Math.random() * threats.length)];
    var colors = { Low: '#10b981', Guarded: '#f59e0b', Elevated: '#ef4444' };
    var items = [
        'Cargo theft attempt reported near Port of LA at 0340h',
        'ALPR flagged stolen vehicle on I-710 northbound',
        'Wildfire watch advisory active for San Bernardino foothills',
        'Multi-agency drill scheduled at 1400h — Sector 7',
        'New geofence zone "USC Campus Perimeter" approved',
        'BWC compliance at 94.2% — 3 units pending upload',
        'Suspicious package cleared at Union Station — all clear',
        'CHP reporting elevated traffic incidents on SR-91'
    ];
    var picked = [];
    var copy = items.slice();
    for (var i = 0; i < 4; i++) {
        var idx = Math.floor(Math.random() * copy.length);
        picked.push(copy.splice(idx, 1)[0]);
    }
    var overlay = document.createElement('div');
    overlay.id = 'briefing-overlay';
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.65);backdrop-filter:blur(8px);z-index:99998;display:flex;align-items:center;justify-content:center;';
    overlay.onclick = function (e) { if (e.target === overlay) overlay.remove(); };
    var d = new Date();
    overlay.innerHTML =
        '<div style="background:var(--bg-panel);border:1px solid var(--border);border-radius:20px;padding:28px;max-width:460px;width:92%;box-shadow:0 20px 60px rgba(0,0,0,0.3);">' +
        '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">' +
        '<h3 style="font-size:17px;font-weight:800;"><i class="ph-bold ph-newspaper" style="margin-right:8px;color:var(--iwin);"></i>Morning Intel Briefing</h3>' +
        '<button onclick="this.closest(\'#briefing-overlay\').remove()" style="background:none;border:none;font-size:20px;cursor:pointer;color:var(--text-muted);">&times;</button></div>' +
        '<div style="font-size:11px;color:var(--text-muted);margin-bottom:16px;">' + d.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) + ' — ' + d.toLocaleTimeString() + '</div>' +
        '<div style="display:flex;gap:12px;margin-bottom:18px;">' +
        '<div style="flex:1;background:var(--bg-panel-alt);padding:12px;border-radius:12px;text-align:center;"><div style="font-size:9px;font-weight:800;color:var(--text-muted);text-transform:uppercase;">Threat Level</div><div style="font-size:16px;font-weight:900;color:' + colors[todayThreat] + ';margin-top:4px;">' + todayThreat.toUpperCase() + '</div></div>' +
        '<div style="flex:1;background:var(--bg-panel-alt);padding:12px;border-radius:12px;text-align:center;"><div style="font-size:9px;font-weight:800;color:var(--text-muted);text-transform:uppercase;">Active Units</div><div style="font-size:16px;font-weight:900;color:var(--iwin);margin-top:4px;">' + (30 + Math.floor(Math.random() * 12)) + '</div></div>' +
        '<div style="flex:1;background:var(--bg-panel-alt);padding:12px;border-radius:12px;text-align:center;"><div style="font-size:9px;font-weight:800;color:var(--text-muted);text-transform:uppercase;">Open Incidents</div><div style="font-size:16px;font-weight:900;color:#f59e0b;margin-top:4px;">' + (2 + Math.floor(Math.random() * 6)) + '</div></div>' +
        '</div>' +
        '<div style="font-size:10px;font-weight:800;color:var(--text-muted);text-transform:uppercase;margin-bottom:8px;">Key Items</div>' +
        picked.map(function (item, i) {
            return '<div style="display:flex;gap:8px;padding:8px 0;border-bottom:1px solid var(--border);font-size:12px;"><span style="font-size:9px;font-weight:800;color:var(--iwin);min-width:20px;">' + (i + 1) + '.</span><span>' + item + '</span></div>';
        }).join('') +
        '<button onclick="this.closest(\'#briefing-overlay\').remove()" style="width:100%;margin-top:18px;padding:12px;background:var(--iwin);color:white;border:none;border-radius:12px;font-size:13px;font-weight:700;cursor:pointer;font-family:Inter,sans-serif;"><i class="ph-bold ph-check" style="margin-right:6px;"></i>Acknowledged</button>' +
        '</div>';
    document.body.appendChild(overlay);
}

// ============ BATCH 3: SECURITY ENHANCEMENTS ============

// --- Feature B3-7: Password Strength Meter ---
function initPasswordStrength() {
    var pw = document.getElementById('login-password');
    if (!pw) return;
    // Create meter bar
    var container = document.getElementById('pw-strength-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'pw-strength-container';
        container.style.cssText = 'margin-top:6px;display:none;';
        container.innerHTML =
            '<div style="display:flex;gap:4px;margin-bottom:4px;">' +
            '<div id="pw-bar-1" class="pw-bar"></div><div id="pw-bar-2" class="pw-bar"></div><div id="pw-bar-3" class="pw-bar"></div><div id="pw-bar-4" class="pw-bar"></div></div>' +
            '<div id="pw-strength-label" style="font-size:10px;font-weight:700;color:var(--text-muted);"></div>';
        pw.parentNode.insertAdjacentElement('afterend', container);
    }
    pw.addEventListener('input', function () {
        var val = pw.value;
        container.style.display = val.length > 0 ? 'block' : 'none';
        var score = 0;
        if (val.length >= 6) score++;
        if (val.length >= 10) score++;
        if (/[A-Z]/.test(val) && /[a-z]/.test(val)) score++;
        if (/[0-9]/.test(val) && /[^a-zA-Z0-9]/.test(val)) score++;
        var levels = ['Weak', 'Fair', 'Strong', 'Very Strong'];
        var colors = ['#ef4444', '#f59e0b', '#10b981', '#059669'];
        var label = document.getElementById('pw-strength-label');
        label.textContent = levels[Math.max(0, score - 1)] || 'Weak';
        label.style.color = colors[Math.max(0, score - 1)] || colors[0];
        for (var i = 1; i <= 4; i++) {
            var bar = document.getElementById('pw-bar-' + i);
            bar.style.background = i <= score ? colors[score - 1] : 'var(--border)';
        }
    });
}

// --- Feature B3-8: Login Lockout with Admin Override ---
var LOCKOUT_MAX = 3;
var LOCKOUT_DURATION = 60; // seconds
var MASTER_OVERRIDE = 'SCS-OVERRIDE-2026';

function checkLockout() {
    var attempts = parseInt(sessionStorage.getItem('scs_login_attempts') || '0');
    var lockUntil = parseInt(sessionStorage.getItem('scs_lock_until') || '0');
    var now = Date.now();
    if (lockUntil > now) {
        var remaining = Math.ceil((lockUntil - now) / 1000);
        return { locked: true, remaining: remaining, attempts: attempts };
    }
    if (lockUntil > 0 && lockUntil <= now) {
        sessionStorage.removeItem('scs_lock_until');
        sessionStorage.setItem('scs_login_attempts', '0');
    }
    return { locked: false, remaining: 0, attempts: attempts };
}

function recordFailedAttempt() {
    var attempts = parseInt(sessionStorage.getItem('scs_login_attempts') || '0') + 1;
    sessionStorage.setItem('scs_login_attempts', String(attempts));
    if (attempts >= LOCKOUT_MAX) {
        sessionStorage.setItem('scs_lock_until', String(Date.now() + LOCKOUT_DURATION * 1000));
        showLockoutWarning(LOCKOUT_DURATION);
    }
    return attempts;
}

function showLockoutWarning(seconds) {
    var existing = document.getElementById('lockout-banner');
    if (existing) existing.remove();
    var banner = document.createElement('div');
    banner.id = 'lockout-banner';
    banner.style.cssText = 'position:fixed;top:0;left:0;right:0;background:linear-gradient(135deg,#dc2626,#991b1b);color:white;text-align:center;padding:14px;font-size:13px;font-weight:700;z-index:999999;';
    banner.innerHTML = '<i class="ph-bold ph-lock" style="margin-right:6px;"></i>Account locked. Too many failed attempts. Try again in <span id="lockout-countdown">' + seconds + '</span>s ' +
        '<span style="margin-left:12px;font-size:11px;opacity:0.8;">| Admin override: <input id="lockout-override" type="text" placeholder="Override code" style="background:rgba(255,255,255,0.2);border:1px solid rgba(255,255,255,0.3);border-radius:6px;padding:4px 8px;font-size:11px;color:white;width:140px;font-family:Inter,sans-serif;"> <button onclick="attemptOverride()" style="background:white;color:#dc2626;border:none;border-radius:6px;padding:4px 10px;font-size:10px;font-weight:800;cursor:pointer;margin-left:4px;">Unlock</button></span>';
    document.body.appendChild(banner);
    var cd = seconds;
    var intv = setInterval(function () {
        cd--;
        var el = document.getElementById('lockout-countdown');
        if (el) el.textContent = cd;
        if (cd <= 0) {
            clearInterval(intv);
            banner.remove();
            sessionStorage.removeItem('scs_lock_until');
            sessionStorage.setItem('scs_login_attempts', '0');
        }
    }, 1000);
}

function attemptOverride() {
    var input = document.getElementById('lockout-override');
    if (input && input.value === MASTER_OVERRIDE) {
        sessionStorage.removeItem('scs_lock_until');
        sessionStorage.setItem('scs_login_attempts', '0');
        var banner = document.getElementById('lockout-banner');
        if (banner) banner.remove();
        if (typeof showToast === 'function') showToast('Admin override accepted. Lockout cleared.', 'success');
    } else {
        if (typeof showToast === 'function') showToast('Invalid override code.', 'error');
    }
}

// --- Feature B3-9: CAPTCHA Simulation ---
function initCAPTCHA() {
    var loginCard = document.querySelector('.login-card');
    if (!loginCard || document.getElementById('captcha-section')) return;
    var a = Math.floor(Math.random() * 10) + 1;
    var b = Math.floor(Math.random() * 10) + 1;
    window._captchaAnswer = a + b;
    var section = document.createElement('div');
    section.id = 'captcha-section';
    section.style.cssText = 'margin:8px 0;';
    section.innerHTML =
        '<div style="display:flex;align-items:center;gap:10px;">' +
        '<div style="background:linear-gradient(135deg,#1e293b,#334155);padding:8px 14px;border-radius:8px;font-size:14px;font-weight:900;color:white;font-family:JetBrains Mono,monospace;letter-spacing:2px;">' + a + ' + ' + b + ' = ?</div>' +
        '<input type="text" id="captcha-input" placeholder="Answer" style="flex:1;padding:10px;border:1px solid var(--border);border-radius:10px;font-size:13px;font-family:Inter,sans-serif;background:var(--bg-panel);color:var(--text-primary);" autocomplete="off">' +
        '</div>' +
        '<div id="captcha-error" style="font-size:10px;color:#ef4444;margin-top:4px;display:none;">Incorrect. Try again.</div>';
    // Insert before the login button
    var loginBtn = loginCard.querySelector('.login-btn');
    if (loginBtn) loginBtn.parentNode.insertBefore(section, loginBtn);
}

function validateCAPTCHA() {
    var input = document.getElementById('captcha-input');
    if (!input) return true; // no captcha present
    var answer = parseInt(input.value);
    if (answer !== window._captchaAnswer) {
        var err = document.getElementById('captcha-error');
        if (err) err.style.display = 'block';
        input.style.borderColor = '#ef4444';
        return false;
    }
    return true;
}

// --- Feature B3-10: Session Fingerprinting ---
function getSessionFingerprint() {
    var ua = navigator.userAgent;
    var browser = 'Unknown Browser';
    if (ua.indexOf('Edg') > -1) browser = 'Microsoft Edge';
    else if (ua.indexOf('Chrome') > -1) browser = 'Google Chrome';
    else if (ua.indexOf('Firefox') > -1) browser = 'Mozilla Firefox';
    else if (ua.indexOf('Safari') > -1) browser = 'Safari';
    var os = 'Unknown OS';
    if (ua.indexOf('Windows') > -1) os = 'Windows';
    else if (ua.indexOf('Mac') > -1) os = 'macOS';
    else if (ua.indexOf('Linux') > -1) os = 'Linux';
    else if (ua.indexOf('Android') > -1) os = 'Android';
    else if (ua.indexOf('iPhone') > -1) os = 'iOS';
    return {
        browser: browser,
        os: os,
        screen: screen.width + 'x' + screen.height,
        language: navigator.language || 'en',
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'Unknown'
    };
}

function logSessionFingerprint() {
    var fp = getSessionFingerprint();
    if (typeof addAuditEntry === 'function') {
        addAuditEntry('Session fingerprint: ' + fp.browser + ' / ' + fp.os + ' / ' + fp.screen + ' / ' + fp.language + ' / ' + fp.timezone);
    }
}

// --- Feature B3-11: Encryption Indicator in Nav ---
function showEncryptionIndicator() {
    var actions = document.querySelector('.nav-actions');
    if (!actions || document.getElementById('encryption-indicator')) return;
    var el = document.createElement('div');
    el.id = 'encryption-indicator';
    el.style.cssText = 'display:flex;align-items:center;gap:6px;padding:6px 12px;background:rgba(16,185,129,0.1);border:1px solid rgba(16,185,129,0.2);border-radius:8px;cursor:default;';
    el.innerHTML = '<i class="ph-fill ph-lock-key" style="font-size:14px;color:#10b981;animation:encryptPulse 3s infinite;"></i><span style="font-size:10px;font-weight:700;color:#10b981;">AES-256 / TLS 1.3</span>';
    el.title = 'End-to-end encryption active. All data in transit and at rest is encrypted using AES-256 with TLS 1.3.';
    var timer = document.getElementById('session-timer');
    if (timer && timer.parentNode) timer.parentNode.insertBefore(el, timer);
}

// --- Feature B3-12: CSP Badge ---
function showCSPBadge() {
    var footer = document.querySelector('.footer-copy');
    if (!footer || document.getElementById('csp-badge')) return;
    var badge = document.createElement('div');
    badge.id = 'csp-badge';
    badge.style.cssText = 'display:inline-flex;align-items:center;gap:6px;margin-top:10px;padding:6px 14px;background:rgba(79,70,229,0.1);border:1px solid rgba(79,70,229,0.2);border-radius:8px;font-size:10px;font-weight:700;color:var(--iwin);cursor:pointer;';
    badge.innerHTML = '<i class="ph-bold ph-shield-check" style="font-size:13px;"></i>CSP Enforced &bull; XSS Protected &bull; Frame Denied';
    badge.title = 'Content Security Policy is active. Script injection, cross-site scripting, and frame embedding are blocked.';
    badge.onclick = function () {
        if (typeof showToast === 'function') showToast('CSP Active: default-src self; script-src self cdn; style-src self unsafe-inline; frame-ancestors none;', 'info');
    };
    footer.appendChild(badge);
}

// --- Feature B3-13: Privacy Policy / Terms Modal ---
function showPrivacyPolicy() {
    var overlay = document.createElement('div');
    overlay.id = 'privacy-overlay';
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.6);backdrop-filter:blur(6px);z-index:99999;display:flex;align-items:center;justify-content:center;';
    overlay.onclick = function (e) { if (e.target === overlay) overlay.remove(); };
    overlay.innerHTML =
        '<div style="background:var(--bg-panel);border:1px solid var(--border);border-radius:20px;padding:28px 32px;max-width:560px;width:92%;max-height:80vh;overflow-y:auto;box-shadow:0 20px 60px rgba(0,0,0,0.3);">' +
        '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">' +
        '<h3 style="font-size:18px;font-weight:800;"><i class="ph-bold ph-file-text" style="margin-right:8px;color:var(--iwin);"></i>Privacy Policy & Terms of Use</h3>' +
        '<button onclick="this.closest(\'#privacy-overlay\').remove()" style="background:none;border:none;font-size:20px;cursor:pointer;color:var(--text-muted);">&times;</button></div>' +
        '<div style="font-size:12px;color:var(--text-secondary);line-height:1.8;">' +
        '<h4 style="font-size:13px;font-weight:800;color:var(--text-primary);margin:16px 0 6px;">1. Data Collection</h4>' +
        '<p>The SCS platform collects operational data including but not limited to: login credentials, session metadata, geolocation data, incident reports, and communication logs. All data is classified as Law Enforcement Sensitive (LES) and handled per CJIS Security Policy v5.9.3.</p>' +
        '<h4 style="font-size:13px;font-weight:800;color:var(--text-primary);margin:16px 0 6px;">2. Data Usage</h4>' +
        '<p>Collected data is used exclusively for: public safety operations, crime analysis and prediction, resource allocation optimization, interagency coordination, and compliance reporting. Data is never sold or shared with non-authorized entities.</p>' +
        '<h4 style="font-size:13px;font-weight:800;color:var(--text-primary);margin:16px 0 6px;">3. Data Retention</h4>' +
        '<p>Operational data is retained for 7 years per California Government Code §34090. Audit logs are retained indefinitely. Users may request data review through their agency\'s designated CJIS officer.</p>' +
        '<h4 style="font-size:13px;font-weight:800;color:var(--text-primary);margin:16px 0 6px;">4. Security Measures</h4>' +
        '<p>All data is encrypted at rest (AES-256) and in transit (TLS 1.3). Multi-factor authentication is enforced. Session fingerprinting and anomaly detection are active. The platform undergoes quarterly penetration testing.</p>' +
        '<h4 style="font-size:13px;font-weight:800;color:var(--text-primary);margin:16px 0 6px;">5. User Responsibilities</h4>' +
        '<p>Users must not: share credentials, access data beyond their authorization level, export data to unauthorized systems, or disable security controls. Violations are subject to disciplinary action and may be prosecuted under 18 U.S.C. §1030 (Computer Fraud and Abuse Act).</p>' +
        '<h4 style="font-size:13px;font-weight:800;color:var(--text-primary);margin:16px 0 6px;">6. Contact</h4>' +
        '<p>For privacy concerns or data requests, contact: SCS Privacy Office — privacy@socal-smart.gov — (213) 555-0142</p>' +
        '</div>' +
        '<button onclick="this.closest(\'#privacy-overlay\').remove()" style="width:100%;margin-top:18px;padding:12px;background:var(--iwin);color:white;border:none;border-radius:12px;font-size:13px;font-weight:700;cursor:pointer;font-family:Inter,sans-serif;">I Understand</button>' +
        '</div>';
    document.body.appendChild(overlay);
}

// --- Feature B3-14: Input Sanitization (XSS Prevention) ---
function sanitizeInput(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#x27;').replace(/\//g, '&#x2F;');
}

// Wrap submitIncidentReport to sanitize
(function () {
    if (typeof submitIncidentReport === 'function') {
        var _origSubmit = submitIncidentReport;
        submitIncidentReport = function () {
            // Sanitize all text inputs in the incident form before submitting
            var fields = ['incidentTitle', 'incidentDescription', 'incidentLocation'];
            fields.forEach(function (id) {
                var el = document.getElementById(id);
                if (el && el.value) el.value = sanitizeInput(el.value);
            });
            _origSubmit();
        };
    }
})();

// --- Feature B3-15: Admin Security Panel (Commander only) ---
function openAdminSecurityPanel() {
    var attempts = sessionStorage.getItem('scs_login_attempts') || '0';
    var lockUntil = sessionStorage.getItem('scs_lock_until');
    var isLocked = lockUntil && parseInt(lockUntil) > Date.now();
    var fp = getSessionFingerprint();

    var overlay = document.createElement('div');
    overlay.id = 'admin-security-overlay';
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.65);backdrop-filter:blur(8px);z-index:99999;display:flex;align-items:center;justify-content:center;';
    overlay.onclick = function (e) { if (e.target === overlay) overlay.remove(); };
    overlay.innerHTML =
        '<div style="background:var(--bg-panel);border:1px solid var(--border);border-radius:20px;padding:28px;max-width:480px;width:92%;box-shadow:0 20px 60px rgba(0,0,0,0.3);">' +
        '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:18px;">' +
        '<h3 style="font-size:17px;font-weight:800;"><i class="ph-bold ph-shield-warning" style="margin-right:8px;color:#dc2626;"></i>Admin Security Panel</h3>' +
        '<button onclick="this.closest(\'#admin-security-overlay\').remove()" style="background:none;border:none;font-size:20px;cursor:pointer;color:var(--text-muted);">&times;</button></div>' +
        '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:16px;">' +
        '<div style="background:var(--bg-panel-alt);padding:12px;border-radius:12px;text-align:center;"><div style="font-size:9px;font-weight:800;color:var(--text-muted);text-transform:uppercase;">Failed Attempts</div><div style="font-size:22px;font-weight:900;color:' + (parseInt(attempts) > 0 ? '#ef4444' : '#10b981') + ';margin-top:4px;">' + attempts + '</div></div>' +
        '<div style="background:var(--bg-panel-alt);padding:12px;border-radius:12px;text-align:center;"><div style="font-size:9px;font-weight:800;color:var(--text-muted);text-transform:uppercase;">Lockout Status</div><div style="font-size:14px;font-weight:900;color:' + (isLocked ? '#ef4444' : '#10b981') + ';margin-top:6px;">' + (isLocked ? '🔒 LOCKED' : '🟢 Clear') + '</div></div></div>' +
        '<div style="font-size:10px;font-weight:800;color:var(--text-muted);text-transform:uppercase;margin-bottom:8px;">Security Controls</div>' +
        '<div style="display:flex;flex-direction:column;gap:8px;">' +
        '<button onclick="sessionStorage.removeItem(\'scs_lock_until\');sessionStorage.setItem(\'scs_login_attempts\',\'0\');document.getElementById(\'lockout-banner\')&&document.getElementById(\'lockout-banner\').remove();showToast(\'All lockouts cleared.\',\'success\');this.closest(\'#admin-security-overlay\').remove();" style="padding:12px;background:#10b981;color:white;border:none;border-radius:10px;font-size:12px;font-weight:700;cursor:pointer;font-family:Inter,sans-serif;"><i class="ph-bold ph-lock-open" style="margin-right:6px;"></i>Clear All Lockouts</button>' +
        '<button onclick="sessionStorage.clear();showToast(\'Session data cleared.\',\'success\');this.closest(\'#admin-security-overlay\').remove();" style="padding:12px;background:#f59e0b;color:white;border:none;border-radius:10px;font-size:12px;font-weight:700;cursor:pointer;font-family:Inter,sans-serif;"><i class="ph-bold ph-trash" style="margin-right:6px;"></i>Clear Session Data</button>' +
        '<button onclick="localStorage.clear();showToast(\'All persistent data cleared.\',\'success\');this.closest(\'#admin-security-overlay\').remove();" style="padding:12px;background:#ef4444;color:white;border:none;border-radius:10px;font-size:12px;font-weight:700;cursor:pointer;font-family:Inter,sans-serif;"><i class="ph-bold ph-database" style="margin-right:6px;"></i>Purge All Local Data</button></div>' +
        '<div style="margin-top:14px;padding-top:14px;border-top:1px solid var(--border);font-size:10px;color:var(--text-muted);line-height:1.6;">' +
        '<i class="ph-bold ph-info" style="margin-right:4px;"></i>Master override code: <code style="background:var(--bg-panel-alt);padding:2px 6px;border-radius:4px;font-family:JetBrains Mono,monospace;font-weight:700;">SCS-OVERRIDE-2026</code><br>' +
        '<i class="ph-bold ph-fingerprint" style="margin-right:4px;"></i>Current session: ' + fp.browser + ' / ' + fp.os + ' / ' + fp.screen +
        '</div></div>';
    document.body.appendChild(overlay);
}

// ============ UPDATED handleLogin WRAPPER (v4 — with security) ============

var _origHandleLoginV3 = handleLogin;
handleLogin = function () {
    // Check lockout first
    var lockStatus = checkLockout();
    if (lockStatus.locked) {
        showLockoutWarning(lockStatus.remaining);
        return;
    }

    // Validate CAPTCHA
    if (!validateCAPTCHA()) {
        recordFailedAttempt();
        return;
    }

    // Check required fields (passphrase)
    var pw = document.getElementById('login-password');
    if (pw && pw.value.length < 1) return;

    // Record login timestamp
    window._loginTimestamp = new Date();

    // Call original handler
    _origHandleLoginV3();

    // Reset attempts on success
    sessionStorage.setItem('scs_login_attempts', '0');

    // Post-login initializations
    setTimeout(function () {
        initNavClock();
        initLocalStorage();
        showEncryptionIndicator();
        logSessionFingerprint();
        showCSPBadge();
        showDailyBriefing();
    }, 800);
};

// ============ INITIALIZE PRE-LOGIN FEATURES ============
(function initPreLoginFeatures() {
    initPasswordStrength();
    initCAPTCHA();
})();

// ============ ENHANCEMENT FEATURES ============

// --- Feature E-1: PWA Registration ---
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
        navigator.serviceWorker.register('/sw.js').then(function (reg) {
            console.log('[PWA] Service Worker registered, scope:', reg.scope);
        }).catch(function (err) {
            console.log('[PWA] SW registration failed:', err);
        });
    });
}

// --- Feature E-2: Global Search ---
function initGlobalSearch() {
    // Add search icon to nav
    var nav = document.querySelector('.nav-actions');
    if (!nav) return;
    var btn = document.createElement('button');
    btn.className = 'nav-btn';
    btn.id = 'global-search-btn';
    btn.title = 'Search (Ctrl+K)';
    btn.innerHTML = '<i class="ph-bold ph-magnifying-glass"></i>';
    btn.onclick = function () { toggleSearchOverlay(); };
    nav.insertBefore(btn, nav.firstChild);

    // Keyboard shortcut
    document.addEventListener('keydown', function (e) {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            toggleSearchOverlay();
        }
        if (e.key === 'Escape') {
            var ov = document.getElementById('search-overlay');
            if (ov) ov.remove();
        }
    });
}

function toggleSearchOverlay() {
    var existing = document.getElementById('search-overlay');
    if (existing) { existing.remove(); return; }

    var searchData = [
        { cat: 'Incidents', items: ['Cargo Theft — Port of LA', 'Traffic Collision — I-710', 'Suspicious Package — Union Station', 'Wildfire — SB Foothills'] },
        { cat: 'Units', items: ['UNIT-03 Alpha-3 (Patrol)', 'UNIT-07 Bravo-7 (Traffic)', 'UNIT-12 Charlie-12 (Tactical)', 'UNIT-15 Delta-15 (K9)', 'UNIT-22 Foxtrot-22 (Fire)', 'UNIT-30 Hotel-30 (SWAT)'] },
        { cat: 'Products', items: ['SMART-Shield', 'IWIN Tactical Suite', 'Horizon API', 'CyberGuard SOC', 'TrainForce Academy'] },
        { cat: 'Pages', items: ['Command Map', 'Analytics Dashboard', 'Audit Log', 'Resource Allocation', 'API Documentation', 'User Profile', 'Admin Security Panel'] },
        { cat: 'Geofences', items: ['Port of Los Angeles', 'LAX Airport Perimeter', 'USC Campus Perimeter', 'Disneyland Resort', 'Camp Pendleton Gate'] }
    ];

    var ov = document.createElement('div');
    ov.id = 'search-overlay';
    ov.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.7);backdrop-filter:blur(10px);z-index:99999;display:flex;align-items:flex-start;justify-content:center;padding-top:15vh;';
    ov.onclick = function (e) { if (e.target === ov) ov.remove(); };

    var box = document.createElement('div');
    box.style.cssText = 'background:var(--bg-panel);border:1px solid var(--border);border-radius:20px;width:92%;max-width:560px;box-shadow:0 24px 80px rgba(0,0,0,0.4);overflow:hidden;';

    var header = '<div style="padding:16px 20px;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:12px;">' +
        '<i class="ph-bold ph-magnifying-glass" style="font-size:18px;color:var(--text-muted);"></i>' +
        '<input id="search-input" type="text" placeholder="Search incidents, units, products…" style="flex:1;background:none;border:none;outline:none;font-size:15px;font-family:Inter,sans-serif;color:var(--text-primary);">' +
        '<kbd style="font-size:10px;background:var(--bg-panel-alt);padding:3px 8px;border-radius:6px;color:var(--text-muted);font-family:JetBrains Mono,monospace;">ESC</kbd></div>';

    var results = '<div id="search-results" style="max-height:50vh;overflow-y:auto;padding:12px 16px;">';
    searchData.forEach(function (group) {
        results += '<div class="search-group" style="margin-bottom:12px;"><div style="font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:1.5px;color:var(--text-muted);margin-bottom:6px;">' + group.cat + '</div>';
        group.items.forEach(function (item) {
            results += '<div class="search-item" data-text="' + item.toLowerCase() + '" style="padding:8px 12px;border-radius:10px;font-size:13px;cursor:pointer;transition:background 0.15s;" onmouseover="this.style.background=\'var(--bg-panel-alt)\'" onmouseout="this.style.background=\'none\'" onclick="document.getElementById(\'search-overlay\').remove()"><i class="ph-bold ph-caret-right" style="font-size:10px;color:var(--iwin);margin-right:8px;"></i>' + item + '</div>';
        });
        results += '</div>';
    });
    results += '</div>';

    box.innerHTML = header + results;
    ov.appendChild(box);
    document.body.appendChild(ov);
    setTimeout(function () {
        var inp = document.getElementById('search-input');
        if (inp) {
            inp.focus();
            inp.oninput = function () {
                var q = this.value.toLowerCase();
                var items = document.querySelectorAll('.search-item');
                items.forEach(function (el) {
                    el.style.display = el.getAttribute('data-text').indexOf(q) > -1 ? '' : 'none';
                });
                document.querySelectorAll('.search-group').forEach(function (g) {
                    var visible = g.querySelectorAll('.search-item[style*="display: none"]');
                    var total = g.querySelectorAll('.search-item');
                    g.style.display = visible.length === total.length ? 'none' : '';
                });
            };
        }
    }, 50);
}

// --- Feature E-3: Multi-language (i18n) ---
var i18n = {
    en: { dashboard: 'Command Dashboard', incidents: 'Incidents', units: 'Active Units', map: 'Command Map', analytics: 'Analytics', products: 'Products', search: 'Search', profile: 'User Profile', login: 'Access Command Deck', logout: 'Logout', settings: 'Settings', threat: 'Threat Level', uptime: 'System Uptime', latency: 'Avg Latency', welcome: 'Welcome to SCS', weather: 'Weather', schedule: 'Schedule', messages: 'Messages' },
    es: { dashboard: 'Panel de Comando', incidents: 'Incidentes', units: 'Unidades Activas', map: 'Mapa de Comando', analytics: 'Analíticas', products: 'Productos', search: 'Buscar', profile: 'Perfil de Usuario', login: 'Acceder al Deck', logout: 'Cerrar Sesión', settings: 'Configuración', threat: 'Nivel de Amenaza', uptime: 'Tiempo Activo', latency: 'Latencia Prom.', welcome: 'Bienvenido a SCS', weather: 'Clima', schedule: 'Horario', messages: 'Mensajes' },
    fr: { dashboard: 'Tableau de Bord', incidents: 'Incidents', units: 'Unités Actives', map: 'Carte de Commande', analytics: 'Analytique', products: 'Produits', search: 'Rechercher', profile: 'Profil Utilisateur', login: 'Accéder au Deck', logout: 'Déconnexion', settings: 'Paramètres', threat: 'Niveau de Menace', uptime: 'Disponibilité', latency: 'Latence Moy.', welcome: 'Bienvenue à SCS', weather: 'Météo', schedule: 'Horaire', messages: 'Messages' },
    zh: { dashboard: '指挥仪表板', incidents: '事件', units: '活跃单位', map: '指挥地图', analytics: '分析', products: '产品', search: '搜索', profile: '用户资料', login: '进入指挥台', logout: '退出', settings: '设置', threat: '威胁等级', uptime: '运行时间', latency: '平均延迟', welcome: '欢迎使用SCS', weather: '天气', schedule: '排班', messages: '消息' }
};

var currentLang = 'en';
function setLanguage(lang) {
    currentLang = lang;
    var strings = i18n[lang] || i18n.en;
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
        var key = el.getAttribute('data-i18n');
        if (strings[key]) el.textContent = strings[key];
    });
    if (typeof addAuditEntry === 'function') addAuditEntry('Language changed to ' + lang.toUpperCase());
}

// Wire up existing language selector
(function wireLanguageSelector() {
    var sel = document.getElementById('lang-select');
    if (sel) {
        sel.addEventListener('change', function () {
            setLanguage(this.value);
        });
    }
})();

// --- Feature E-4: Weather Integration ---
function initWeatherPanel() {
    var conditions = [
        { icon: 'ph-sun', label: 'Clear Skies', temp: 72, wind: '5 mph SW', humidity: '35%', risk: 'Low', color: '#10b981' },
        { icon: 'ph-cloud-sun', label: 'Partly Cloudy', temp: 68, wind: '8 mph W', humidity: '42%', risk: 'Low', color: '#10b981' },
        { icon: 'ph-wind', label: 'High Winds', temp: 78, wind: '35 mph NE', humidity: '15%', risk: 'High — Fire Risk', color: '#ef4444' },
        { icon: 'ph-cloud-rain', label: 'Rain Advisory', temp: 58, wind: '12 mph S', humidity: '85%', risk: 'Medium — Flooding', color: '#f59e0b' },
        { icon: 'ph-thermometer-hot', label: 'Extreme Heat', temp: 105, wind: '3 mph', humidity: '8%', risk: 'High — Heat Alert', color: '#ef4444' }
    ];
    var w = conditions[Math.floor(Math.random() * conditions.length)];

    var nav = document.querySelector('.nav-actions');
    if (!nav) return;
    var weatherBtn = document.createElement('button');
    weatherBtn.className = 'nav-btn';
    weatherBtn.title = 'Weather Conditions';
    weatherBtn.innerHTML = '<i class="ph-bold ' + w.icon + '" style="color:' + w.color + ';"></i>';
    weatherBtn.onclick = function () {
        var existing = document.getElementById('weather-panel');
        if (existing) { existing.remove(); return; }
        var panel = document.createElement('div');
        panel.id = 'weather-panel';
        panel.style.cssText = 'position:fixed;top:60px;right:16px;width:280px;background:var(--bg-panel);border:1px solid var(--border);border-radius:16px;padding:20px;box-shadow:0 16px 48px rgba(0,0,0,0.3);z-index:9999;';
        panel.innerHTML =
            '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">' +
            '<h4 style="font-size:14px;font-weight:800;"><i class="ph-bold ' + w.icon + '" style="margin-right:6px;color:' + w.color + ';"></i>Weather</h4>' +
            '<button onclick="document.getElementById(\'weather-panel\').remove()" style="background:none;border:none;color:var(--text-muted);cursor:pointer;font-size:16px;">&times;</button></div>' +
            '<div style="text-align:center;margin-bottom:16px;"><div style="font-size:42px;font-weight:900;color:' + w.color + ';">' + w.temp + '°F</div><div style="font-size:13px;color:var(--text-muted);">' + w.label + '</div></div>' +
            '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">' +
            '<div style="background:var(--bg-panel-alt);padding:10px;border-radius:10px;"><div style="font-size:9px;font-weight:800;color:var(--text-muted);text-transform:uppercase;">Wind</div><div style="font-size:13px;font-weight:700;margin-top:2px;">' + w.wind + '</div></div>' +
            '<div style="background:var(--bg-panel-alt);padding:10px;border-radius:10px;"><div style="font-size:9px;font-weight:800;color:var(--text-muted);text-transform:uppercase;">Humidity</div><div style="font-size:13px;font-weight:700;margin-top:2px;">' + w.humidity + '</div></div>' +
            '</div>' +
            '<div style="margin-top:12px;padding:10px;border-radius:10px;background:rgba(' + (w.risk.indexOf('High') > -1 ? '239,68,68' : w.risk.indexOf('Medium') > -1 ? '245,158,11' : '16,185,129') + ',0.1);text-align:center;">' +
            '<div style="font-size:9px;font-weight:800;text-transform:uppercase;color:var(--text-muted);">Operations Risk</div>' +
            '<div style="font-size:14px;font-weight:800;color:' + w.color + ';margin-top:4px;">' + w.risk + '</div></div>';
        document.body.appendChild(panel);
        setTimeout(function () { document.addEventListener('click', function closeW(e) { if (!panel.contains(e.target) && e.target !== weatherBtn) { panel.remove(); document.removeEventListener('click', closeW); } }); }, 100);
    };
    nav.insertBefore(weatherBtn, nav.children[1]);
}

// --- Feature E-5: Shift Scheduling Panel ---
function openShiftScheduler() {
    var existing = document.getElementById('shift-overlay');
    if (existing) { existing.remove(); return; }

    var days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    var shifts = [
        { name: 'Sgt. Martinez', unit: 'Alpha-3', shifts: [1, 1, 1, 0, 0, 1, 1] },
        { name: 'Off. Chen', unit: 'Bravo-7', shifts: [0, 1, 1, 1, 1, 0, 0] },
        { name: 'Det. Williams', unit: 'Charlie-12', shifts: [1, 1, 0, 0, 1, 1, 1] },
        { name: 'Off. Garcia', unit: 'Delta-15', shifts: [1, 0, 1, 1, 1, 0, 0] },
        { name: 'Off. Thompson', unit: 'Echo-18', shifts: [0, 0, 1, 1, 1, 1, 0] },
        { name: 'Cap. Anderson', unit: 'Foxtrot-22', shifts: [1, 1, 1, 1, 0, 0, 1] },
        { name: 'Lt. Brooks', unit: 'Hotel-30', shifts: [0, 1, 0, 1, 1, 1, 1] }
    ];

    var ov = document.createElement('div');
    ov.id = 'shift-overlay';
    ov.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.65);backdrop-filter:blur(8px);z-index:99998;display:flex;align-items:center;justify-content:center;';
    ov.onclick = function (e) { if (e.target === ov) ov.remove(); };

    var html = '<div style="background:var(--bg-panel);border:1px solid var(--border);border-radius:20px;padding:24px;max-width:640px;width:94%;box-shadow:0 20px 60px rgba(0,0,0,0.3);">' +
        '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">' +
        '<h3 style="font-size:17px;font-weight:800;"><i class="ph-bold ph-calendar-check" style="margin-right:8px;color:var(--iwin);"></i>Shift Schedule — This Week</h3>' +
        '<button onclick="document.getElementById(\'shift-overlay\').remove()" style="background:none;border:none;font-size:20px;cursor:pointer;color:var(--text-muted);">&times;</button></div>';

    html += '<div style="overflow-x:auto;"><table style="width:100%;border-collapse:collapse;font-size:13px;">';
    html += '<tr><th style="text-align:left;padding:8px;color:var(--text-muted);font-size:11px;">OFFICER</th><th style="padding:8px;color:var(--text-muted);font-size:11px;">UNIT</th>';
    days.forEach(function (d) { html += '<th style="padding:8px;text-align:center;color:var(--text-muted);font-size:11px;">' + d + '</th>'; });
    html += '</tr>';

    shifts.forEach(function (s) {
        html += '<tr style="border-top:1px solid var(--border);"><td style="padding:10px 8px;font-weight:600;">' + s.name + '</td><td style="padding:10px 8px;font-size:11px;color:var(--text-muted);font-family:JetBrains Mono,monospace;">' + s.unit + '</td>';
        s.shifts.forEach(function (on) {
            html += '<td style="padding:10px 8px;text-align:center;">' + (on ? '<span style="display:inline-block;width:28px;height:28px;line-height:28px;background:rgba(79,70,229,0.15);color:var(--iwin);border-radius:8px;font-size:11px;font-weight:800;">ON</span>' : '<span style="display:inline-block;width:28px;height:28px;line-height:28px;background:var(--bg-panel-alt);color:var(--text-muted);border-radius:8px;font-size:10px;">—</span>') + '</td>';
        });
        html += '</tr>';
    });

    html += '</table></div>';
    var onCount = 0; shifts.forEach(function (s) { s.shifts.forEach(function (v) { onCount += v; }); });
    html += '<div style="display:flex;gap:12px;margin-top:16px;">' +
        '<div style="flex:1;background:var(--bg-panel-alt);padding:10px;border-radius:10px;text-align:center;"><div style="font-size:9px;font-weight:800;color:var(--text-muted);text-transform:uppercase;">Total Shifts</div><div style="font-size:18px;font-weight:900;color:var(--iwin);margin-top:2px;">' + onCount + '</div></div>' +
        '<div style="flex:1;background:var(--bg-panel-alt);padding:10px;border-radius:10px;text-align:center;"><div style="font-size:9px;font-weight:800;color:var(--text-muted);text-transform:uppercase;">Officers</div><div style="font-size:18px;font-weight:900;color:#10b981;margin-top:2px;">' + shifts.length + '</div></div>' +
        '<div style="flex:1;background:var(--bg-panel-alt);padding:10px;border-radius:10px;text-align:center;"><div style="font-size:9px;font-weight:800;color:var(--text-muted);text-transform:uppercase;">Coverage</div><div style="font-size:18px;font-weight:900;color:#f59e0b;margin-top:2px;">' + Math.round(onCount / (shifts.length * 7) * 100) + '%</div></div></div>';
    html += '</div>';
    ov.innerHTML = html;
    document.body.appendChild(ov);
}

// --- Feature E-6: In-App Messaging Panel ---
function openMessaging() {
    var existing = document.getElementById('msg-overlay');
    if (existing) { existing.remove(); return; }

    var messages = [
        { from: 'Dispatch', time: '14:22', text: 'UNIT-12 requesting backup at Port of LA. Possible armed suspects.', urgent: true },
        { from: 'Sgt. Martinez', time: '14:18', text: 'Alpha-3 clear from Union Station. Returning to patrol.', urgent: false },
        { from: 'Cap. Anderson', time: '14:15', text: 'Fire containment at 20%. Requesting additional engine company.', urgent: true },
        { from: 'ALPR System', time: '14:10', text: 'Stolen vehicle flagged on I-710 NB. Plate: 7ABC123. Auto-dispatched.', urgent: false },
        { from: 'Off. Chen', time: '14:05', text: 'Traffic collision cleared. Lanes reopening. Tow truck en route.', urgent: false },
        { from: 'Watch Commander', time: '13:55', text: 'Shift change reminder: 1800h briefing in Sector 3 ready room.', urgent: false }
    ];

    var ov = document.createElement('div');
    ov.id = 'msg-overlay';
    ov.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.65);backdrop-filter:blur(8px);z-index:99998;display:flex;align-items:center;justify-content:center;';
    ov.onclick = function (e) { if (e.target === ov) ov.remove(); };

    var html = '<div style="background:var(--bg-panel);border:1px solid var(--border);border-radius:20px;padding:24px;max-width:480px;width:94%;box-shadow:0 20px 60px rgba(0,0,0,0.3);max-height:80vh;display:flex;flex-direction:column;">' +
        '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">' +
        '<h3 style="font-size:17px;font-weight:800;"><i class="ph-bold ph-chat-circle-dots" style="margin-right:8px;color:var(--iwin);"></i>Messages <span style="font-size:12px;background:var(--iwin);color:white;padding:2px 8px;border-radius:10px;margin-left:8px;">' + messages.length + '</span></h3>' +
        '<button onclick="document.getElementById(\'msg-overlay\').remove()" style="background:none;border:none;font-size:20px;cursor:pointer;color:var(--text-muted);">&times;</button></div>';

    html += '<div style="flex:1;overflow-y:auto;margin-bottom:12px;">';
    messages.forEach(function (m) {
        html += '<div style="padding:12px;border-radius:12px;margin-bottom:8px;background:' + (m.urgent ? 'rgba(239,68,68,0.08)' : 'var(--bg-panel-alt)') + ';border-left:3px solid ' + (m.urgent ? '#ef4444' : 'var(--border)') + ';">' +
            '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">' +
            '<span style="font-size:12px;font-weight:800;color:' + (m.urgent ? '#ef4444' : 'var(--iwin)') + ';">' + m.from + (m.urgent ? ' <span style="font-size:9px;background:#ef4444;color:white;padding:1px 6px;border-radius:4px;margin-left:6px;">URGENT</span>' : '') + '</span>' +
            '<span style="font-size:10px;color:var(--text-muted);">' + m.time + '</span></div>' +
            '<div style="font-size:13px;line-height:1.5;color:var(--text-secondary);">' + m.text + '</div></div>';
    });
    html += '</div>';

    html += '<div style="display:flex;gap:8px;"><input id="msg-input" type="text" placeholder="Type a message…" style="flex:1;padding:10px 14px;border:1px solid var(--border);border-radius:10px;background:var(--bg-panel-alt);color:var(--text-primary);font-size:13px;font-family:Inter,sans-serif;outline:none;">' +
        '<button onclick="var inp=document.getElementById(\'msg-input\');if(inp.value.trim()){alert(\'Message sent: \'+inp.value);inp.value=\'\';}" style="padding:10px 16px;background:var(--iwin);color:white;border:none;border-radius:10px;cursor:pointer;font-weight:700;font-size:13px;"><i class="ph-bold ph-paper-plane-tilt"></i></button></div>';
    html += '</div>';
    ov.innerHTML = html;
    document.body.appendChild(ov);
}

// --- Feature E-7: Voice Commands ---
function initVoiceCommands() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) return;

    var nav = document.querySelector('.nav-actions');
    if (!nav) return;
    var btn = document.createElement('button');
    btn.className = 'nav-btn';
    btn.id = 'voice-btn';
    btn.title = 'Voice Commands';
    btn.innerHTML = '<i class="ph-bold ph-microphone"></i>';
    btn.style.cssText = 'transition:all 0.3s;';

    var listening = false;
    var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    var recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = 'en-US';

    recognition.onresult = function (event) {
        var text = event.results[0][0].transcript.toLowerCase();
        btn.style.color = '';
        listening = false;

        if (text.indexOf('search') > -1) toggleSearchOverlay();
        else if (text.indexOf('profile') > -1) openUserProfile();
        else if (text.indexOf('weather') > -1) document.querySelector('#weather-panel') ? null : document.querySelector('[title="Weather Conditions"]').click();
        else if (text.indexOf('schedule') > -1 || text.indexOf('shift') > -1) openShiftScheduler();
        else if (text.indexOf('message') > -1 || text.indexOf('chat') > -1) openMessaging();
        else if (text.indexOf('print') > -1) printDashboard();
        else if (text.indexOf('dark') > -1 || text.indexOf('theme') > -1 || text.indexOf('light') > -1) { if (typeof toggleTheme === 'function') toggleTheme(); }
        else if (text.indexOf('briefing') > -1) showDailyBriefing();
        else if (text.indexOf('analytics') > -1) openAdminAnalytics();
        else alert('Voice command: "' + text + '"\n\nAvailable: search, profile, weather, schedule, messages, print, dark/light, briefing, analytics');

        if (typeof addAuditEntry === 'function') addAuditEntry('Voice command: ' + text);
    };

    recognition.onend = function () { btn.style.color = ''; listening = false; };

    btn.onclick = function () {
        if (listening) { recognition.stop(); return; }
        listening = true;
        btn.style.color = '#ef4444';
        recognition.start();
    };
    nav.insertBefore(btn, nav.children[2]);
}

// --- Feature E-8: Loading Skeletons ---
function showLoadingSkeletons() {
    var style = document.createElement('style');
    style.textContent = '@keyframes shimmer{0%{background-position:-200px 0}100%{background-position:200px 0}}' +
        '.skeleton{background:linear-gradient(90deg,var(--bg-panel-alt) 25%,rgba(255,255,255,0.05) 50%,var(--bg-panel-alt) 75%);background-size:400px 100%;animation:shimmer 1.5s infinite;border-radius:10px;min-height:40px;}' +
        '.skeleton-text{height:14px;margin:8px 0;border-radius:6px;}.skeleton-circle{width:40px;height:40px;border-radius:50%;}';
    document.head.appendChild(style);
}

// --- Feature E-9: Accessibility (WCAG) ---
function initAccessibility() {
    // Skip-to-content link
    var skip = document.createElement('a');
    skip.href = '#main-content';
    skip.textContent = 'Skip to main content';
    skip.style.cssText = 'position:fixed;top:-100px;left:16px;background:var(--iwin);color:white;padding:10px 20px;border-radius:0 0 10px 10px;z-index:999999;font-weight:700;font-size:13px;text-decoration:none;transition:top 0.3s;';
    skip.onfocus = function () { this.style.top = '0'; };
    skip.onblur = function () { this.style.top = '-100px'; };
    document.body.insertBefore(skip, document.body.firstChild);

    // Add aria-labels to buttons without labels
    document.querySelectorAll('button:not([aria-label])').forEach(function (btn) {
        var text = btn.textContent.trim() || btn.title || 'Button';
        btn.setAttribute('aria-label', text);
    });

    // Focus styles
    var focusStyle = document.createElement('style');
    focusStyle.textContent = '*:focus-visible{outline:2px solid var(--iwin);outline-offset:2px;border-radius:4px;}';
    document.head.appendChild(focusStyle);

    // Announce to screen readers
    var live = document.createElement('div');
    live.id = 'sr-announce';
    live.setAttribute('aria-live', 'polite');
    live.setAttribute('aria-atomic', 'true');
    live.style.cssText = 'position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0);';
    document.body.appendChild(live);
}

function announceToSR(message) {
    var el = document.getElementById('sr-announce');
    if (el) el.textContent = message;
}

// --- Feature E-10: Animated Page Transitions ---
function initPageTransitions() {
    var style = document.createElement('style');
    style.textContent =
        '.section-gap{opacity:0;transform:translateY(24px);transition:opacity 0.6s ease,transform 0.6s ease;}' +
        '.section-gap.visible{opacity:1;transform:translateY(0);}' +
        '.fade-in{animation:fadeSlideIn 0.5s ease forwards;}' +
        '@keyframes fadeSlideIn{from{opacity:0;transform:translateY(16px);}to{opacity:1;transform:translateY(0);}}';
    document.head.appendChild(style);

    // Intersection Observer for scroll animations
    if ('IntersectionObserver' in window) {
        var obs = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.section-gap').forEach(function (el) {
            obs.observe(el);
        });
    } else {
        document.querySelectorAll('.section-gap').forEach(function (el) {
            el.classList.add('visible');
        });
    }
}

// --- Feature E-11: Admin Analytics Dashboard ---
function openAdminAnalytics() {
    var existing = document.getElementById('analytics-overlay');
    if (existing) { existing.remove(); return; }

    var months = ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb'];
    var logins = [145, 178, 192, 210, 234, 251];
    var incidents = [32, 28, 41, 35, 22, 18];
    var responseMs = [4.2, 3.8, 4.5, 3.2, 3.9, 3.1];

    var ov = document.createElement('div');
    ov.id = 'analytics-overlay';
    ov.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.65);backdrop-filter:blur(8px);z-index:99998;display:flex;align-items:center;justify-content:center;';
    ov.onclick = function (e) { if (e.target === ov) ov.remove(); };

    var maxLogin = Math.max.apply(null, logins);
    var maxInc = Math.max.apply(null, incidents);

    var barsHTML = '';
    months.forEach(function (m, i) {
        var h = Math.round(logins[i] / maxLogin * 80);
        barsHTML += '<div style="text-align:center;flex:1;"><div style="height:80px;display:flex;align-items:flex-end;justify-content:center;"><div style="width:100%;max-width:32px;height:' + h + 'px;background:linear-gradient(180deg,var(--iwin),rgba(79,70,229,0.3));border-radius:6px 6px 0 0;"></div></div><div style="font-size:10px;color:var(--text-muted);margin-top:4px;">' + m + '</div><div style="font-size:11px;font-weight:700;">' + logins[i] + '</div></div>';
    });

    var incBarsHTML = '';
    months.forEach(function (m, i) {
        var h = Math.round(incidents[i] / maxInc * 60);
        incBarsHTML += '<div style="text-align:center;flex:1;"><div style="height:60px;display:flex;align-items:flex-end;justify-content:center;"><div style="width:100%;max-width:28px;height:' + h + 'px;background:linear-gradient(180deg,#f59e0b,rgba(245,158,11,0.3));border-radius:5px 5px 0 0;"></div></div><div style="font-size:10px;color:var(--text-muted);margin-top:4px;">' + m + '</div></div>';
    });

    ov.innerHTML = '<div style="background:var(--bg-panel);border:1px solid var(--border);border-radius:20px;padding:24px;max-width:600px;width:94%;box-shadow:0 20px 60px rgba(0,0,0,0.3);max-height:85vh;overflow-y:auto;">' +
        '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">' +
        '<h3 style="font-size:17px;font-weight:800;"><i class="ph-bold ph-chart-bar" style="margin-right:8px;color:var(--iwin);"></i>Admin Analytics</h3>' +
        '<button onclick="document.getElementById(\'analytics-overlay\').remove()" style="background:none;border:none;font-size:20px;cursor:pointer;color:var(--text-muted);">&times;</button></div>' +
        '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:20px;">' +
        '<div style="background:var(--bg-panel-alt);padding:12px;border-radius:12px;text-align:center;"><div style="font-size:9px;font-weight:800;color:var(--text-muted);text-transform:uppercase;">Total Logins</div><div style="font-size:22px;font-weight:900;color:var(--iwin);margin-top:4px;">1,210</div></div>' +
        '<div style="background:var(--bg-panel-alt);padding:12px;border-radius:12px;text-align:center;"><div style="font-size:9px;font-weight:800;color:var(--text-muted);text-transform:uppercase;">Incidents</div><div style="font-size:22px;font-weight:900;color:#f59e0b;margin-top:4px;">176</div></div>' +
        '<div style="background:var(--bg-panel-alt);padding:12px;border-radius:12px;text-align:center;"><div style="font-size:9px;font-weight:800;color:var(--text-muted);text-transform:uppercase;">Avg Response</div><div style="font-size:22px;font-weight:900;color:#10b981;margin-top:4px;">3.8m</div></div>' +
        '<div style="background:var(--bg-panel-alt);padding:12px;border-radius:12px;text-align:center;"><div style="font-size:9px;font-weight:800;color:var(--text-muted);text-transform:uppercase;">Uptime</div><div style="font-size:22px;font-weight:900;color:#0d9488;margin-top:4px;">99.97%</div></div></div>' +
        '<div style="margin-bottom:20px;"><div style="font-size:11px;font-weight:800;color:var(--text-muted);text-transform:uppercase;margin-bottom:10px;">User Logins (6-month)</div><div style="display:flex;gap:4px;align-items:flex-end;">' + barsHTML + '</div></div>' +
        '<div><div style="font-size:11px;font-weight:800;color:var(--text-muted);text-transform:uppercase;margin-bottom:10px;">Incidents by Month</div><div style="display:flex;gap:4px;align-items:flex-end;">' + incBarsHTML + '</div></div>' +
        '</div>';
    document.body.appendChild(ov);
}

// --- Feature E-12: Drag-and-Drop Dashboard ---
function initDragDrop() {
    var sections = document.querySelectorAll('.section-gap');
    sections.forEach(function (sec) {
        sec.setAttribute('draggable', 'true');
        sec.style.cursor = 'grab';

        sec.addEventListener('dragstart', function (e) {
            e.dataTransfer.effectAllowed = 'move';
            this.style.opacity = '0.4';
            window._dragSrc = this;
        });
        sec.addEventListener('dragover', function (e) {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            this.style.borderTop = '3px solid var(--iwin)';
        });
        sec.addEventListener('dragleave', function () {
            this.style.borderTop = '';
        });
        sec.addEventListener('drop', function (e) {
            e.preventDefault();
            this.style.borderTop = '';
            if (window._dragSrc && window._dragSrc !== this) {
                this.parentNode.insertBefore(window._dragSrc, this);
            }
        });
        sec.addEventListener('dragend', function () {
            this.style.opacity = '1';
            document.querySelectorAll('.section-gap').forEach(function (s) { s.style.borderTop = ''; });
        });
    });
}

// --- Feature E-13: 3D Map Visualization Toggle ---
function init3DMapToggle() {
    if (!state.map) return;

    var mapContainer = document.getElementById('map');
    if (!mapContainer) return;

    var btn = document.createElement('button');
    btn.style.cssText = 'position:absolute;top:10px;right:10px;z-index:1000;background:var(--bg-panel);border:1px solid var(--border);border-radius:10px;padding:8px 12px;cursor:pointer;font-size:11px;font-weight:800;font-family:Inter,sans-serif;color:var(--text-primary);box-shadow:0 4px 12px rgba(0,0,0,0.2);display:flex;align-items:center;gap:6px;';
    btn.innerHTML = '<i class="ph-bold ph-cube"></i>3D View';
    btn.title = 'Toggle 3D perspective';
    var is3D = false;
    btn.onclick = function () {
        is3D = !is3D;
        if (is3D) {
            mapContainer.style.transition = 'transform 0.8s ease';
            mapContainer.style.transform = 'perspective(1200px) rotateX(45deg) scale(0.85)';
            mapContainer.style.transformOrigin = 'center center';
            btn.innerHTML = '<i class="ph-bold ph-map-trifold"></i>2D View';
        } else {
            mapContainer.style.transform = 'none';
            btn.innerHTML = '<i class="ph-bold ph-cube"></i>3D View';
        }
    };
    mapContainer.style.position = 'relative';
    mapContainer.appendChild(btn);
}

// --- Feature E-14: Nav Buttons for Schedule, Messages, Analytics ---
function addNavEnhancements() {
    var nav = document.querySelector('.nav-actions');
    if (!nav) return;

    // Schedule button
    var schedBtn = document.createElement('button');
    schedBtn.className = 'nav-btn';
    schedBtn.title = 'Shift Schedule';
    schedBtn.innerHTML = '<i class="ph-bold ph-calendar-check"></i>';
    schedBtn.onclick = function () { openShiftScheduler(); };

    // Messages button
    var msgBtn = document.createElement('button');
    msgBtn.className = 'nav-btn';
    msgBtn.title = 'Messages';
    msgBtn.innerHTML = '<i class="ph-bold ph-chat-circle-dots"></i>';
    msgBtn.style.position = 'relative';
    msgBtn.onclick = function () { openMessaging(); };
    var badge = document.createElement('span');
    badge.style.cssText = 'position:absolute;top:-2px;right:-2px;width:16px;height:16px;background:#ef4444;color:white;font-size:9px;font-weight:900;border-radius:50%;display:flex;align-items:center;justify-content:center;';
    badge.textContent = '3';
    msgBtn.appendChild(badge);

    // Analytics button
    var anlBtn = document.createElement('button');
    anlBtn.className = 'nav-btn';
    anlBtn.title = 'Admin Analytics';
    anlBtn.innerHTML = '<i class="ph-bold ph-chart-bar"></i>';
    anlBtn.onclick = function () { openAdminAnalytics(); };

    // API Docs link
    var apiBtn = document.createElement('button');
    apiBtn.className = 'nav-btn';
    apiBtn.title = 'API Documentation';
    apiBtn.innerHTML = '<i class="ph-bold ph-code"></i>';
    apiBtn.onclick = function () { window.open('api-docs.html', '_blank'); };

    nav.insertBefore(apiBtn, nav.children[nav.children.length - 1]);
    nav.insertBefore(anlBtn, apiBtn);
    nav.insertBefore(msgBtn, anlBtn);
    nav.insertBefore(schedBtn, msgBtn);
}

// ============ LOGIN WRAPPER v5 — Initialize All Enhancement Features ============
var _origHandleLoginV4 = handleLogin;
handleLogin = function () {
    _origHandleLoginV4();

    setTimeout(function () {
        // Enhancement features
        initGlobalSearch();
        initWeatherPanel();
        initVoiceCommands();
        addNavEnhancements();
        initPageTransitions();
        initDragDrop();
        init3DMapToggle();
        showLoadingSkeletons();
        initAccessibility();
    }, 1200);
};
