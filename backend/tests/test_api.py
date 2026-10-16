import pytest
from starlette.testclient import TestClient
from backend.app.main import app
from backend.app.db.session import init_db

def test_api_health_and_state():
    init_db()
    with TestClient(app) as client:
        # Test health
        res = client.get("/health")
        assert res.status_code == 200
        assert res.json()["status"] == "healthy"

        # Test state
        res = client.get("/api/v1/state/")
        assert res.status_code == 200
        assert res.json()["agent_state"] == "ON"

        # Toggle state to OFF
        res = client.post("/api/v1/state/", json={"state": "OFF"})
        assert res.status_code == 200
        assert res.json()["agent_state"] == "OFF"

        # Toggle state back to ON
        res = client.post("/api/v1/state/", json={"state": "ON"})
        assert res.status_code == 200
        assert res.json()["agent_state"] == "ON"

def test_task_execution_flow():
    init_db()
    with TestClient(app) as client:
        # 1. Execute Gujarati Phone Call Command
        res = client.post("/api/v1/tasks/execute", json={"prompt": "મમ્મીને ફોન કરો.", "user_id": 1})
        assert res.status_code == 200
        data = res.json()
        assert data["success"] is True
        assert data["target_device"] == "android"
        assert data["action"] == "dial_phone"
        assert "Mummy" in data["parameters"]["contact_name"]

        # 2. Execute Hindi Laptop Command
        res = client.post("/api/v1/tasks/execute", json={"prompt": "Mere laptop par Chrome kholo aur YouTube open karo", "user_id": 1})
        assert res.status_code == 200
        data = res.json()
        assert data["success"] is True
        assert data["target_device"] == "laptop"
        assert "youtube.com" in data["parameters"]["url"]

        # 3. List tasks
        res = client.get("/api/v1/tasks/")
        assert res.status_code == 200
        tasks = res.json()
        assert len(tasks) >= 2
