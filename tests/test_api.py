"""
Unit tests for the SoCal-SMART API Server.
Run: python -m pytest tests/test_api.py -v
  or: python -m unittest tests.test_api -v
"""

import unittest
import json
import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from api_server import app


class TestHealthEndpoint(unittest.TestCase):
    """Tests for GET /api/health"""

    def setUp(self):
        self.client = app.test_client()
        app.testing = True

    def test_health_returns_200(self):
        response = self.client.get('/api/health')
        self.assertEqual(response.status_code, 200)

    def test_health_has_status(self):
        response = self.client.get('/api/health')
        data = json.loads(response.data)
        self.assertEqual(data['status'], 'healthy')

    def test_health_has_version(self):
        response = self.client.get('/api/health')
        data = json.loads(response.data)
        self.assertIn('version', data)

    def test_health_has_services(self):
        response = self.client.get('/api/health')
        data = json.loads(response.data)
        self.assertIn('services', data)
        self.assertEqual(data['services']['database'], 'connected')


class TestIncidentsEndpoint(unittest.TestCase):
    """Tests for GET/POST /api/incidents"""

    def setUp(self):
        self.client = app.test_client()
        app.testing = True

    def test_get_incidents_returns_200(self):
        response = self.client.get('/api/incidents')
        self.assertEqual(response.status_code, 200)

    def test_get_incidents_has_count(self):
        response = self.client.get('/api/incidents')
        data = json.loads(response.data)
        self.assertIn('count', data)
        self.assertIn('incidents', data)
        self.assertIsInstance(data['incidents'], list)

    def test_get_incidents_filter_by_status(self):
        response = self.client.get('/api/incidents?status=Active')
        data = json.loads(response.data)
        for incident in data['incidents']:
            self.assertEqual(incident['status'], 'Active')

    def test_get_incidents_filter_by_severity(self):
        response = self.client.get('/api/incidents?severity=High')
        data = json.loads(response.data)
        for incident in data['incidents']:
            self.assertEqual(incident['severity'], 'High')

    def test_create_incident_success(self):
        new_incident = {
            "title": "Test Incident",
            "type": "Test",
            "severity": "Low"
        }
        response = self.client.post(
            '/api/incidents',
            data=json.dumps(new_incident),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 201)
        data = json.loads(response.data)
        self.assertEqual(data['incident']['title'], 'Test Incident')

    def test_create_incident_missing_fields(self):
        response = self.client.post(
            '/api/incidents',
            data=json.dumps({"title": "Incomplete"}),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 400)

    def test_create_incident_no_body(self):
        response = self.client.post('/api/incidents')
        self.assertEqual(response.status_code, 400)


class TestUnitsEndpoint(unittest.TestCase):
    """Tests for GET /api/units"""

    def setUp(self):
        self.client = app.test_client()
        app.testing = True

    def test_get_units_returns_200(self):
        response = self.client.get('/api/units')
        self.assertEqual(response.status_code, 200)

    def test_get_units_has_count(self):
        response = self.client.get('/api/units')
        data = json.loads(response.data)
        self.assertIn('count', data)
        self.assertGreater(data['count'], 0)

    def test_get_units_filter_by_region(self):
        response = self.client.get('/api/units?region=Los Angeles')
        data = json.loads(response.data)
        for unit in data['units']:
            self.assertEqual(unit['region'], 'Los Angeles')

    def test_get_units_filter_by_status(self):
        response = self.client.get('/api/units?status=Available')
        data = json.loads(response.data)
        for unit in data['units']:
            self.assertEqual(unit['status'], 'Available')


class TestStatsEndpoint(unittest.TestCase):
    """Tests for GET /api/stats"""

    def setUp(self):
        self.client = app.test_client()
        app.testing = True

    def test_stats_returns_200(self):
        response = self.client.get('/api/stats')
        self.assertEqual(response.status_code, 200)

    def test_stats_has_required_fields(self):
        response = self.client.get('/api/stats')
        data = json.loads(response.data)
        required_fields = ['totalIncidents', 'activeIncidents', 'totalUnits',
                           'availableUnits', 'avgResponseTime', 'systemUptime']
        for field in required_fields:
            self.assertIn(field, data)


class TestErrorHandling(unittest.TestCase):
    """Tests for error responses"""

    def setUp(self):
        self.client = app.test_client()
        app.testing = True

    def test_404_on_unknown_endpoint(self):
        response = self.client.get('/api/nonexistent')
        self.assertEqual(response.status_code, 404)

    def test_405_on_wrong_method(self):
        response = self.client.delete('/api/incidents')
        self.assertEqual(response.status_code, 405)


if __name__ == '__main__':
    unittest.main()
