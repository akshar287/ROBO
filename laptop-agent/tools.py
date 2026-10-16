import os
import subprocess
import webbrowser
import platform
from pathlib import Path
from typing import Dict, Any, List

try:
    from config import APP_ALLOWLIST, SANDBOX_DIR
except ImportError:
    from laptop_agent.config import APP_ALLOWLIST, SANDBOX_DIR

class DesktopToolExecutor:
    """
    Safe, permission-controlled tool executor for Windows desktop.
    Executes real application launches, browser actions, sandboxed file operations,
    and desktop notifications.
    """

    @classmethod
    def execute(cls, action: str, parameters: Dict[str, Any]) -> Dict[str, Any]:
        handler = getattr(cls, f"action_{action}", None)
        if not handler:
            return {"success": False, "error": f"Unknown action: {action}"}
        try:
            return handler(parameters)
        except Exception as e:
            return {"success": False, "error": str(e)}

    @classmethod
    def action_launch_app(cls, params: Dict[str, Any]) -> Dict[str, Any]:
        raw_name = params.get("app_name", "").lower().strip()
        cmd = APP_ALLOWLIST.get(raw_name)
        if not cmd:
            return {
                "success": False,
                "error": f"Application '{raw_name}' is not in the safe allowlist. Permitted apps: {list(APP_ALLOWLIST.keys())}"
            }
        
        # Start application non-blocking
        if platform.system() == "Windows":
            subprocess.Popen(["cmd.exe", "/c", "start", cmd], shell=True)
        else:
            subprocess.Popen([cmd])

        return {"success": True, "message": f"Successfully launched {raw_name}"}

    @classmethod
    def action_close_app(cls, params: Dict[str, Any]) -> Dict[str, Any]:
        raw_name = params.get("app_name", "").lower().strip()
        cmd = APP_ALLOWLIST.get(raw_name)
        if not cmd:
            return {"success": False, "error": f"Application '{raw_name}' is not permitted."}

        if platform.system() == "Windows":
            exe_name = f"{cmd}.exe" if not cmd.endswith(".exe") else cmd
            subprocess.run(["taskkill", "/IM", exe_name, "/F"], capture_output=True)

        return {"success": True, "message": f"Closed application {raw_name}"}

    @classmethod
    def action_browser_open(cls, params: Dict[str, Any]) -> Dict[str, Any]:
        url = params.get("url", "https://www.google.com")
        if not url.startswith("http://") and not url.startswith("https://"):
            url = f"https://{url}"
        
        webbrowser.open(url)
        return {"success": True, "url": url, "message": f"Opened {url} in default browser"}

    @classmethod
    def action_browser_search(cls, params: Dict[str, Any]) -> Dict[str, Any]:
        query = params.get("query", "")
        search_url = f"https://www.google.com/search?q={query}"
        webbrowser.open(search_url)
        return {"success": True, "query": query, "message": f"Searched for '{query}'"}

    @classmethod
    def action_file_write(cls, params: Dict[str, Any]) -> Dict[str, Any]:
        filename = params.get("filename", "note.txt")
        content = params.get("content", "")
        # Enforce sandbox constraint
        target_path = (SANDBOX_DIR / filename).resolve()
        if not str(target_path).startswith(str(SANDBOX_DIR.resolve())):
            return {"success": False, "error": "Security restriction: Path must be inside Desktop/RoboFiles"}

        target_path.write_text(content, encoding="utf-8")
        return {"success": True, "path": str(target_path), "message": f"Saved file to {target_path}"}

    @classmethod
    def action_file_read(cls, params: Dict[str, Any]) -> Dict[str, Any]:
        filename = params.get("filename", "")
        target_path = (SANDBOX_DIR / filename).resolve()
        if not str(target_path).startswith(str(SANDBOX_DIR.resolve())):
            return {"success": False, "error": "Security restriction: Path must be inside Desktop/RoboFiles"}

        if not target_path.exists():
            return {"success": False, "error": f"File '{filename}' does not exist."}

        text = target_path.read_text(encoding="utf-8")
        return {"success": True, "content": text, "message": f"Read file {filename}"}

    @classmethod
    def action_file_list(cls, params: Dict[str, Any]) -> Dict[str, Any]:
        files = [f.name for f in SANDBOX_DIR.iterdir() if f.is_file()]
        return {"success": True, "files": files, "count": len(files)}

    @classmethod
    def action_desktop_notify(cls, params: Dict[str, Any]) -> Dict[str, Any]:
        title = params.get("title", "ROBO Assistant")
        message = params.get("message", "Task completed!")
        
        if platform.system() == "Windows":
            ps_script = f'''
            [Windows.UI.Notifications.ToastNotificationManager, Windows.UI.Notifications, ContentType = WindowsRuntime] > $null
            $template = [Windows.UI.Notifications.ToastNotificationManager]::GetTemplateContent([Windows.UI.Notifications.ToastTemplateType]::ToastText02)
            $textNodes = $template.GetElementsByTagName("text")
            $textNodes.Item(0).AppendChild($template.CreateTextNode("{title}")) > $null
            $textNodes.Item(1).AppendChild($template.CreateTextNode("{message}")) > $null
            $notifier = [Windows.UI.Notifications.ToastNotificationManager]::CreateToastNotifier("ROBO AI")
            $notification = [Windows.UI.Notifications.ToastNotification]::new($template)
            $notifier.Show($notification)
            '''
            subprocess.Popen(["powershell", "-Command", ps_script], shell=True)

        return {"success": True, "message": "Notification dispatched"}
