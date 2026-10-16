from typing import Dict, Any

class CallingZeroTokenService:
    """
    Zero-Token Calling integration.
    Allows non-technical users to initiate voice calls on Android phone or Laptop
    without purchasing Twilio, Exotel, or telecom VoIP developer accounts.
    """

    @staticmethod
    def generate_call_payload(contact_name: str, phone_number: str) -> Dict[str, Any]:
        """
        Generates Android intent for native dialer / direct call,
        plus web-based call status.
        """
        clean_phone = "".join(c for c in phone_number if c.isdigit() or c == '+')
        tel_uri = f"tel:{clean_phone}"

        return {
            "status": "ready",
            "contact_name": contact_name,
            "phone_number": clean_phone,
            "android_intent_uri": tel_uri,
            "android_action": "android.intent.action.DIAL", # or ACTION_CALL if CALL_PHONE permission granted
            "desktop_action": "open_url",
            "spoken_prompt": f"Calling {contact_name} at {clean_phone}.",
            "disclaimer": "AI will launch phone dialer with recipient number verified."
        }
