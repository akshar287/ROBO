import urllib.parse
from typing import Dict, Any

class WhatsAppZeroTokenService:
    """
    Zero-Token WhatsApp integration.
    Enables any non-technical user to send WhatsApp messages directly from Android,
    Laptop, or Website WITHOUT needing Meta Cloud API tokens, business accounts, or credit cards.
    """

    @staticmethod
    def generate_whatsapp_payload(phone_number: str, message: str) -> Dict[str, Any]:
        """
        Creates ready-to-execute payloads for Android native app and Laptop web browser.
        """
        # Clean phone number (keep digits only, default to India +91 if 10 digits)
        clean_phone = "".join(filter(str.isdigit, phone_number))
        if len(clean_phone) == 10:
            clean_phone = "91" + clean_phone
        elif clean_phone.startswith("0"):
            clean_phone = "91" + clean_phone[1:]

        encoded_text = urllib.parse.quote(message)

        # Android direct app URI: opens WhatsApp app directly to chat with message filled in
        android_uri = f"whatsapp://send?phone={clean_phone}&text={encoded_text}"
        
        # Universal web link: works on laptop, desktop browser, or mobile browser
        universal_url = f"https://api.whatsapp.com/send?phone={clean_phone}&text={encoded_text}"
        web_whatsapp_url = f"https://web.whatsapp.com/send?phone={clean_phone}&text={encoded_text}"

        return {
            "status": "ready",
            "phone_number": clean_phone,
            "message": message,
            "android_intent_uri": android_uri,
            "universal_url": universal_url,
            "web_url": web_whatsapp_url,
            "accessibility_action": "click_send_button",
            "instruction": "Open the link or intent to send message with one tap/click."
        }
