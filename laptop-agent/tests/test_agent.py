import pytest
from tools import DesktopToolExecutor
from config import APP_ALLOWLIST, SANDBOX_DIR

def test_app_allowlist_enforcement():
    # Dangerous or unpermitted app should fail
    res = DesktopToolExecutor.execute("launch_app", {"app_name": "malicious_script.bat"})
    assert res["success"] is False
    assert "not in the safe allowlist" in res["error"]

    # Permitted app should have safe name recognized
    res_allowed = DesktopToolExecutor.execute("launch_app", {"app_name": "chrome"})
    assert res_allowed["success"] is True

def test_file_sandbox_security():
    # Attempt directory traversal outside sandbox
    traversal_res = DesktopToolExecutor.execute("file_write", {
        "filename": "../../Windows/System32/evil.txt",
        "content": "hacked"
    })
    assert traversal_res["success"] is False
    assert "Security restriction" in traversal_res["error"]

    # Writing inside sandbox should succeed
    write_res = DesktopToolExecutor.execute("file_write", {
        "filename": "test_robo_note.txt",
        "content": "Hello from ROBO AI Assistant!"
    })
    assert write_res["success"] is True
    assert (SANDBOX_DIR / "test_robo_note.txt").exists()

    # Reading file
    read_res = DesktopToolExecutor.execute("file_read", {
        "filename": "test_robo_note.txt"
    })
    assert read_res["success"] is True
    assert "Hello from ROBO AI Assistant!" in read_res["content"]

    # Clean up test note
    (SANDBOX_DIR / "test_robo_note.txt").unlink(missing_ok=True)
