-- ═══════════════════════════════════════════════════════
-- SoCal-SMART Command System — MySQL Database Schema
-- Run: mysql -u root -p < db/schema.sql
-- ═══════════════════════════════════════════════════════

CREATE DATABASE IF NOT EXISTS scs_command
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE scs_command;

-- ─── Users & Auth ────────────────────────────────────

CREATE TABLE users (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    first_name      VARCHAR(100) NOT NULL,
    last_name       VARCHAR(100) NOT NULL,
    email           VARCHAR(255) NOT NULL UNIQUE,
    badge_number    VARCHAR(50),
    agency          VARCHAR(200),
    role            ENUM('Commander','IT Administrator','Analyst','Field Officer','Observer') NOT NULL DEFAULT 'Observer',
    password_hash   VARCHAR(255) NOT NULL,
    is_active       TINYINT(1) NOT NULL DEFAULT 1,
    lockout_until   DATETIME DEFAULT NULL,
    failed_attempts INT NOT NULL DEFAULT 0,
    created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role (role),
    INDEX idx_badge (badge_number)
) ENGINE=InnoDB;

-- ─── Sessions ────────────────────────────────────────

CREATE TABLE sessions (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    user_id         INT NOT NULL,
    session_token   VARCHAR(255) NOT NULL UNIQUE,
    browser         VARCHAR(100),
    os              VARCHAR(100),
    screen_res      VARCHAR(50),
    language        VARCHAR(10),
    timezone        VARCHAR(100),
    ip_address      VARCHAR(45),
    login_at        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_active     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_active       TINYINT(1) NOT NULL DEFAULT 1,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_token (session_token),
    INDEX idx_user (user_id)
) ENGINE=InnoDB;

-- ─── Incidents ───────────────────────────────────────

CREATE TABLE incidents (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    title           VARCHAR(255) NOT NULL,
    type            ENUM('Theft','Traffic','Fire','Suspicious Activity','Assault','Vandalism','Medical','HazMat','Pursuit','Other') NOT NULL,
    severity        ENUM('Low','Medium','High','Critical') NOT NULL,
    status          ENUM('Active','Responding','Cleared','Closed') NOT NULL DEFAULT 'Active',
    lat             DECIMAL(10, 6) NOT NULL,
    lng             DECIMAL(10, 6) NOT NULL,
    description     TEXT,
    reported_by     INT,
    assigned_unit   VARCHAR(50),
    region          ENUM('Los Angeles','Orange County','Inland Empire','San Diego') NOT NULL,
    created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    resolved_at     DATETIME DEFAULT NULL,
    FOREIGN KEY (reported_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_status (status),
    INDEX idx_severity (severity),
    INDEX idx_region (region),
    INDEX idx_type (type),
    INDEX idx_created (created_at)
) ENGINE=InnoDB;

-- ─── Units ───────────────────────────────────────────

CREATE TABLE units (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    unit_id         VARCHAR(50) NOT NULL UNIQUE,
    callsign        VARCHAR(50) NOT NULL,
    type            ENUM('Patrol','Traffic','Tactical','K9','Fire','SWAT','Medical','Air Support') NOT NULL,
    status          ENUM('Available','Dispatched','On Scene','Standby','Off Duty') NOT NULL DEFAULT 'Available',
    region          ENUM('Los Angeles','Orange County','Inland Empire','San Diego') NOT NULL,
    lat             DECIMAL(10, 6),
    lng             DECIMAL(10, 6),
    officer_name    VARCHAR(200),
    last_updated    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_unit_id (unit_id),
    INDEX idx_status (status),
    INDEX idx_region (region)
) ENGINE=InnoDB;

-- ─── Audit Log ───────────────────────────────────────

CREATE TABLE audit_log (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id         INT,
    action          VARCHAR(500) NOT NULL,
    details         TEXT,
    ip_address      VARCHAR(45),
    created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_user (user_id),
    INDEX idx_created (created_at)
) ENGINE=InnoDB;

-- ─── Geofence Zones ─────────────────────────────────

CREATE TABLE geofence_zones (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    name            VARCHAR(200) NOT NULL,
    region          ENUM('Los Angeles','Orange County','Inland Empire','San Diego') NOT NULL,
    lat_center      DECIMAL(10, 6) NOT NULL,
    lng_center      DECIMAL(10, 6) NOT NULL,
    radius_meters   INT NOT NULL DEFAULT 500,
    alert_level     ENUM('Low','Medium','High','Critical') NOT NULL DEFAULT 'Medium',
    is_active       TINYINT(1) NOT NULL DEFAULT 1,
    created_by      INT,
    created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_region (region),
    INDEX idx_active (is_active)
) ENGINE=InnoDB;

-- ─── Sensor Telemetry ───────────────────────────────

CREATE TABLE sensor_data (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    sensor_id       VARCHAR(100) NOT NULL,
    sensor_type     ENUM('Thermal','ALPR','Motion','Gunshot','BWC','GPS') NOT NULL,
    lat             DECIMAL(10, 6),
    lng             DECIMAL(10, 6),
    payload         JSON,
    created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_sensor (sensor_id),
    INDEX idx_type (sensor_type),
    INDEX idx_created (created_at)
) ENGINE=InnoDB;

-- ═══════════════════════════════════════════════════════
-- Seed Data
-- ═══════════════════════════════════════════════════════

-- Default admin user (password: SCS-Admin-2026!)
INSERT INTO users (first_name, last_name, email, badge_number, agency, role, password_hash) VALUES
('System', 'Administrator', 'admin@scs.gov', 'SCS-001', 'SoCal-SMART Command', 'Commander',
 '$2b$12$placeholder_hash_replace_in_production');

-- Sample units
INSERT INTO units (unit_id, callsign, type, status, region, lat, lng, officer_name) VALUES
('UNIT-03', 'Alpha-3',    'Patrol',   'Available',  'Los Angeles',   34.0522, -118.2437, 'Sgt. Martinez'),
('UNIT-07', 'Bravo-7',    'Traffic',  'Dispatched', 'Los Angeles',   33.8500, -118.2100, 'Off. Chen'),
('UNIT-12', 'Charlie-12', 'Tactical', 'On Scene',   'Los Angeles',   33.7405, -118.2723, 'Det. Williams'),
('UNIT-15', 'Delta-15',   'K9',       'Available',  'Inland Empire', 34.0555, -117.1825, 'Off. Garcia'),
('UNIT-18', 'Echo-18',    'Patrol',   'Available',  'Orange County', 33.6846, -117.8265, 'Off. Thompson'),
('UNIT-22', 'Foxtrot-22', 'Fire',     'On Scene',   'Inland Empire', 34.1083, -117.2898, 'Cap. Anderson'),
('UNIT-25', 'Golf-25',    'Patrol',   'Available',  'San Diego',     32.7157, -117.1611, 'Off. Rodriguez'),
('UNIT-30', 'Hotel-30',   'SWAT',     'Standby',    'Los Angeles',   34.0195, -118.4912, 'Lt. Brooks');

-- Sample incidents
INSERT INTO incidents (title, type, severity, status, lat, lng, description, assigned_unit, region) VALUES
('Cargo Theft — Port of LA',           'Theft',               'High',     'Active',     33.7405, -118.2723, 'Suspicious individuals observed near container yard B-7. Three containers breached.', 'UNIT-12', 'Los Angeles'),
('Traffic Collision — I-710 NB',       'Traffic',             'Medium',   'Responding', 33.8500, -118.2100, 'Multi-vehicle collision blocking northbound lanes. Minor injuries reported.',           'UNIT-07', 'Los Angeles'),
('Suspicious Package — Union Station', 'Suspicious Activity', 'High',     'Cleared',    34.0562, -118.2365, 'Unattended backpack reported by transit security. K9 unit cleared scene.',              'UNIT-03', 'Los Angeles'),
('Wildfire Spot — SB Foothills',       'Fire',                'Critical', 'Active',     34.1083, -117.2898, 'Brush fire spotted. 2 acres, zero containment. Wind gusts to 45mph.',                  'UNIT-22', 'Inland Empire');

-- Sample geofence zones
INSERT INTO geofence_zones (name, region, lat_center, lng_center, radius_meters, alert_level, created_by) VALUES
('Port of Los Angeles',     'Los Angeles',   33.7405, -118.2723, 2000, 'High', 1),
('LAX Airport Perimeter',   'Los Angeles',   33.9425, -118.4081, 3000, 'Critical', 1),
('USC Campus Perimeter',    'Los Angeles',   34.0224, -118.2851, 800,  'Medium', 1),
('Disneyland Resort',       'Orange County', 33.8121, -117.9190, 1000, 'Medium', 1),
('Camp Pendleton Gate',     'San Diego',     33.2200, -117.3900, 5000, 'High', 1);
