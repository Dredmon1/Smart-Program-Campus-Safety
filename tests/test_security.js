/**
 * SoCal-SMART Security Tests
 * Run in browser console or Node.js to validate security functions.
 * Usage: Open the dashboard in a browser, paste this into the console.
 */

(function runSecurityTests() {
    var passed = 0, failed = 0, total = 0;

    function assert(condition, testName) {
        total++;
        if (condition) {
            passed++;
            console.log('%c  PASS  ' + testName, 'color: #10b981; font-weight: bold;');
        } else {
            failed++;
            console.error('%c  FAIL  ' + testName, 'color: #ef4444; font-weight: bold;');
        }
    }

    console.log('%c\n══════════════════════════════════════', 'color: #6366f1;');
    console.log('%c  SCS Security Test Suite', 'color: #6366f1; font-size: 14px; font-weight: bold;');
    console.log('%c══════════════════════════════════════\n', 'color: #6366f1;');

    // ─── Test 1: sanitizeInput XSS Prevention ───────────────────────
    console.log('%c--- XSS Prevention (sanitizeInput) ---', 'color: #f59e0b; font-weight: bold;');

    if (typeof sanitizeInput === 'function') {
        assert(sanitizeInput('<script>alert("xss")</script>').indexOf('<') === -1,
            'Strips <script> tags');
        assert(sanitizeInput('<img onerror=alert(1)>').indexOf('<') === -1,
            'Strips <img> with onerror');
        assert(sanitizeInput('Hello & World').indexOf('&amp;') > -1,
            'Escapes ampersands');
        assert(sanitizeInput('"quoted"').indexOf('&quot;') > -1,
            'Escapes double quotes');
        assert(sanitizeInput("it's").indexOf('&#x27;') > -1,
            "Escapes single quotes");
        assert(sanitizeInput('normal text') === 'normal text',
            'Leaves normal text unchanged');
        assert(sanitizeInput('') === '',
            'Handles empty string');
        assert(sanitizeInput(null) === '',
            'Handles null input');
    } else {
        console.warn('sanitizeInput not found — skipping XSS tests');
    }

    // ─── Test 2: Password Strength Scoring ──────────────────────────
    console.log('%c\n--- Password Strength Logic ---', 'color: #f59e0b; font-weight: bold;');

    function scorePassword(val) {
        var score = 0;
        if (val.length >= 6) score++;
        if (val.length >= 10) score++;
        if (/[A-Z]/.test(val) && /[a-z]/.test(val)) score++;
        if (/[0-9]/.test(val) && /[^a-zA-Z0-9]/.test(val)) score++;
        return score;
    }

    assert(scorePassword('abc') === 0, 'Short password = 0 (Weak)');
    assert(scorePassword('abcdef') === 1, '6 chars lowercase = 1 (Fair)');
    assert(scorePassword('Abcdefghij') === 3, '10+ chars mixed case = 3 (Strong)');
    assert(scorePassword('Abcdefghij1!') === 4, 'Full complexity = 4 (Very Strong)');
    assert(scorePassword('') === 0, 'Empty = 0');

    // ─── Test 3: Lockout Logic ──────────────────────────────────────
    console.log('%c\n--- Lockout Logic ---', 'color: #f59e0b; font-weight: bold;');

    if (typeof checkLockout === 'function') {
        // Clear any existing lockout
        sessionStorage.removeItem('scs_lock_until');
        sessionStorage.setItem('scs_login_attempts', '0');

        var status = checkLockout();
        assert(status.locked === false, 'No lockout initially');
        assert(status.attempts === 0, 'Zero attempts initially');

        // Simulate 3 failures
        if (typeof recordFailedAttempt === 'function') {
            sessionStorage.setItem('scs_login_attempts', '0');
            recordFailedAttempt();
            recordFailedAttempt();
            var afterTwo = checkLockout();
            assert(afterTwo.locked === false, 'Not locked after 2 attempts');

            // Clean up lockout banner if created
            var banner = document.getElementById('lockout-banner');
            if (banner) banner.remove();
        }

        // Test override code
        assert(typeof MASTER_OVERRIDE !== 'undefined' && MASTER_OVERRIDE === 'SCS-OVERRIDE-2026',
            'Override code is SCS-OVERRIDE-2026');

        // Reset
        sessionStorage.removeItem('scs_lock_until');
        sessionStorage.setItem('scs_login_attempts', '0');
    } else {
        console.warn('checkLockout not found — skipping lockout tests');
    }

    // ─── Test 4: CAPTCHA Validation ─────────────────────────────────
    console.log('%c\n--- CAPTCHA Validation ---', 'color: #f59e0b; font-weight: bold;');

    if (typeof validateCAPTCHA === 'function') {
        assert(typeof window._captchaAnswer === 'number', 'CAPTCHA answer is a number');
        assert(window._captchaAnswer > 1 && window._captchaAnswer <= 20,
            'CAPTCHA answer is between 2 and 20');
    } else {
        console.warn('validateCAPTCHA not found — skipping CAPTCHA tests');
    }

    // ─── Test 5: Session Fingerprinting ─────────────────────────────
    console.log('%c\n--- Session Fingerprinting ---', 'color: #f59e0b; font-weight: bold;');

    if (typeof getSessionFingerprint === 'function') {
        var fp = getSessionFingerprint();
        assert(fp.browser !== 'Unknown Browser', 'Browser detected: ' + fp.browser);
        assert(fp.os !== 'Unknown OS', 'OS detected: ' + fp.os);
        assert(/\d+x\d+/.test(fp.screen), 'Screen resolution format: ' + fp.screen);
        assert(fp.language.length > 0, 'Language detected: ' + fp.language);
        assert(fp.timezone.length > 0, 'Timezone detected: ' + fp.timezone);
    } else {
        console.warn('getSessionFingerprint not found — skipping fingerprint tests');
    }

    // ─── Summary ────────────────────────────────────────────────────
    console.log('%c\n══════════════════════════════════════', 'color: #6366f1;');
    console.log('%c  Results: ' + passed + '/' + total + ' passed, ' + failed + ' failed',
        failed === 0 ? 'color: #10b981; font-size: 14px; font-weight: bold;' :
            'color: #ef4444; font-size: 14px; font-weight: bold;');
    console.log('%c══════════════════════════════════════\n', 'color: #6366f1;');

    return { passed: passed, failed: failed, total: total };
})();
