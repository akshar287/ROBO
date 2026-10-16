import re
from typing import Dict, Any, List, Tuple

class MultilingualNLP:
    """
    Intelligent Multilingual NLP parser for Gujarati, Hindi, English, and Code-switched phrases.
    Robust against spacing, transliteration, unicode vowel variations (હ્રસ્વ/દીર્ઘ), and varied dialects.
    """

    @staticmethod
    def detect_language(text: str) -> str:
        has_gujarati = bool(re.search(r'[\u0A80-\u0AFF]', text))
        has_devanagari = bool(re.search(r'[\u0900-\u097F]', text))
        has_latin = bool(re.search(r'[a-zA-Z]', text))

        if has_gujarati and has_latin:
            return "gu-en"
        elif has_devanagari and has_latin:
            return "hi-en"
        elif has_gujarati:
            return "gu"
        elif has_devanagari:
            return "hi"
        elif has_latin:
            lower = text.lower()
            hindi_keywords = ["kholo", "bhejo", "karo", "mere", "par", "aur", "ko", "chahiye", "kar", "do"]
            gujarati_keywords = ["karo", "moklo", "maru", "tamaru", "che", "ane", "mathi", "karjo", "ma"]
            
            if any(k in lower.split() for k in gujarati_keywords):
                return "gu-roman"
            if any(k in lower.split() for k in hindi_keywords):
                return "hi-roman"
            return "en"
        return "en"

    @classmethod
    def parse_instruction(cls, prompt: str, contacts: List[Dict[str, Any]] = None) -> Dict[str, Any]:
        if contacts is None:
            contacts = []

        lang = cls.detect_language(prompt)
        p_lower = prompt.lower().strip()

        # 1. Direct Email Sending / Drafting
        email_regex = r'([a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+)'
        email_match = re.search(email_regex, prompt)

        is_email_intent = any(k in p_lower for k in [
            "mail", "email", "gmail", "ઈમેલ", "ઇમેલ", "જીમેલ", "ईमेल", "जीमेल", "ખત"
        ])

        if email_match or (is_email_intent and any(k in p_lower for k in ["bhejo", "karo", "send", "draft", "મોકલો", "ડ્રાફ્ટ", "લખો", "કરો"])):
            target_email = email_match.group(1) if email_match else "recipient@example.com"
            body = cls._extract_email_body(prompt)
            subject = cls._extract_email_subject(prompt, body)

            if not email_match and any(k in p_lower for k in ["unread", "check", "summarize", "વાંચો", "અનરીડ", "પઢો"]):
                return {
                    "intent": "gmail_summarize",
                    "target_device": "server",
                    "action": "gmail_summarize",
                    "parameters": {"query": "is:unread"},
                    "detected_language": lang,
                    "requires_approval": False,
                    "spoken_response": "તમારા Gmail ના અનરીડ ઈમેઈલ ચેક થઈ રહ્યા છે." if "gu" in lang else "Checking unread emails."
                }

            return {
                "intent": "send_email",
                "target_device": "server",
                "action": "send_email",
                "parameters": {
                    "recipient": target_email,
                    "subject": subject,
                    "body": body,
                    "auto_open": True
                },
                "detected_language": lang,
                "requires_approval": False,
                "spoken_response": f"મેં {target_email} માટે ઈમેઈલ તૈયાર કરી દીધો છે અને ખોલી રહ્યો છું." if "gu" in lang else f"Email drafted for {target_email}. Opening composer now."
            }

        # 2. YouTube & Browser & Laptop App Launching
        # Handles all Gujarati vowel variations: "યૂટ્યુબ", "યુટ્યુબ", "યૂટ્યૂબ", "યુટ્યૂબ", Hindi: "यूट्यूब", "युट्यूब", English: "youtube", "you tube"
        has_youtube = any(k in p_lower for k in [
            "youtube", "you tube", "yt", 
            "યૂટ્યુબ", "યુટ્યુબ", "યૂટ્યૂબ", "યુટ્યૂબ", "યુ ટ્યુબ", "યૂ ટ્યુબ",
            "यूट्यूब", "युट्यूब", "यू ट्यूब"
        ])

        has_chrome = any(k in p_lower for k in ["chrome", "crome", "ક્રોમ", "કોમ", "क्रोम", "browser"])
        has_notepad = any(k in p_lower for k in ["notepad", "નોટપેડ", "नोटपैड"])
        has_calc = any(k in p_lower for k in ["calculator", "calc", "કેલ્ક્યુલેટર", "कैलकुलेटर"])
        has_open_verb = any(k in p_lower for k in [
            "kholo", "open", "chalu karo", "chalu", "ખોલો", "ખુલો", "ચાલુ કરો", "ચાલુ", "ઓપન કરો", 
            "खोल", "खोलो", "चालू करो", "start", "run"
        ])

        if has_youtube or (has_chrome and has_open_verb) or (has_notepad and has_open_verb) or (has_calc and has_open_verb) or (has_open_verb and ("laptop" in p_lower or "લેપટોપ" in p_lower)):
            app_name = "chrome"
            url = "https://www.youtube.com" if has_youtube else "https://www.google.com"
            if has_notepad:
                app_name = "notepad"
                url = None
            elif has_calc:
                app_name = "calc"
                url = None

            spoken = "હા, હું તમારા માટે યૂટ્યુબ ખોલી રહ્યો છું." if (has_youtube and "gu" in lang) else (
                f"તમારા લેપટોપ પર {url or app_name} ખોલી દીધું છે." if "gu" in lang else f"Opening {url or app_name} on your laptop."
            )

            return {
                "intent": "laptop_action",
                "target_device": "laptop",
                "action": "browser_open" if url else "launch_app",
                "parameters": {
                    "app_name": app_name,
                    "url": url,
                    "auto_open": True
                },
                "detected_language": lang,
                "requires_approval": False,
                "spoken_response": spoken
            }

        # 3. WhatsApp Message Drafting / Sending
        is_whatsapp = any(k in p_lower for k in [
            "whatsapp", "whats app", "વાટ્સએપ", "વોટ્સએપ", "વૉટ્સઍપ", "વોટ્સઅપ", "વ્હોટ્સએપ", "व्हाट्सएप", "व्हाट्सअप"
        ])
        if is_whatsapp:
            target_name, phone_number = cls._extract_contact_or_number(prompt, contacts)
            message_text = cls._extract_message_content(prompt)
            return {
                "intent": "whatsapp_draft",
                "target_device": "android",
                "action": "whatsapp_draft",
                "parameters": {
                    "contact_name": target_name,
                    "phone_number": phone_number,
                    "message": message_text,
                    "auto_open": True
                },
                "detected_language": lang,
                "requires_approval": False,
                "spoken_response": f"WhatsApp પર {target_name} માટે મેસેજ તૈયાર છે અને એપ ખુલી રહી છે." if "gu" in lang else f"Opening WhatsApp for {target_name} with message ready."
            }

        # 4. Phone Calling Intent
        is_call = any(k in p_lower for k in [
            "ફોન કરો", "કોલ કરો", "કૉલ કરો", "ફોન લગાવો", "કોલ લગાવો", "કૉલ લગાવો",
            "कॉल करो", "फोन करो", "फोन लगाओ", "कॉल लगाओ",
            "call", "dial", "phone"
        ])
        if is_call and not is_whatsapp:
            target_name, phone_number = cls._extract_contact_or_number(prompt, contacts)
            return {
                "intent": "call_phone",
                "target_device": "android",
                "action": "dial_phone",
                "parameters": {
                    "contact_name": target_name,
                    "phone_number": phone_number,
                    "auto_open": True
                },
                "detected_language": lang,
                "requires_approval": False,
                "spoken_response": f"હા, હું {target_name} ને ફોન લગાવી રહ્યો છું." if "gu" in lang else f"Calling {target_name} now on phone."
            }

        # 5. Play Store Application Search
        is_playstore = any(k in p_lower for k in ["play store", "playstore", "પ્લે સ્ટોર", "પ્લેસ્ટોર", "प्ले स्टोर", "प्लेस्टोर"])
        if is_playstore:
            query = cls._extract_search_query(prompt, ["play store", "playstore", "search karo", "kholo aur", "શોધો"])
            return {
                "intent": "play_store_search",
                "target_device": "android",
                "action": "play_store_search",
                "parameters": {"query": query or "WhatsApp"},
                "detected_language": lang,
                "requires_approval": False,
                "spoken_response": "પ્લે સ્ટોર પર સર્ચ ખુલી રહ્યું છે." if "gu" in lang else "Opening Google Play Store."
            }

        # Fallback: General Assistant Query
        return {
            "intent": "general_assistant",
            "target_device": "server",
            "action": "voice_speak",
            "parameters": {"prompt": prompt},
            "detected_language": lang,
            "requires_approval": False,
            "spoken_response": f"મેં તમારો આદેશ સ્વીકાર્યો: '{prompt}'." if "gu" in lang else f"Command received: '{prompt}'."
        }

    @staticmethod
    def _extract_email_body(prompt: str) -> str:
        quoted = re.findall(r'["\'](.*?)["\']', prompt)
        if quoted:
            return quoted[0]
        
        after_email = re.sub(r'^[^\@]*[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+\s*(?:par|pe|ko|ma|no)?\s*', '', prompt, flags=re.IGNORECASE)
        cleaned = re.sub(r'\s*(?:no\s+)?(?:mail|email)\s+(?:karo|bhejo|moklo|send)$', '', after_email, flags=re.IGNORECASE).strip()
        return cleaned if cleaned else "Jay Swaminarayan"

    @staticmethod
    def _extract_email_subject(prompt: str, body: str) -> str:
        if "swaminarayan" in prompt.lower():
            return "Jay Swaminarayan"
        return "Message from ROBO Assistant"

    @staticmethod
    def _extract_contact_or_number(prompt: str, contacts: List[Dict[str, Any]]) -> Tuple[str, str]:
        p_lower = prompt.lower()
        phone_match = re.search(r'(\+?\d{10,13})', prompt)
        if phone_match:
            return "Specified Number", phone_match.group(1)

        for contact in contacts:
            name = contact.get("name", "").lower()
            aliases = contact.get("aliases", "").lower().split(",")
            aliases = [a.strip() for a in aliases if a.strip()] + [name]
            for alias in aliases:
                if alias and alias in p_lower:
                    return contact.get("name"), contact.get("phone_number")

        if any(m in p_lower for m in ["મમ્મી", "माँ", "mummy", "mom", "माताજી"]):
            return "Mummy", "+919876500001"
        if any(p in p_lower for p in ["પપ્પા", "पापा", "papa", "dad", "પિતાજી"]):
            return "Papa", "+919876500002"
        if any(r in p_lower for r in ["રાહુલ", "राहुल", "rahul"]):
            return "Rahul", "+919876500003"

        return "Contact", "+919876543210"

    @staticmethod
    def _extract_message_content(prompt: str) -> str:
        quoted = re.findall(r'["\'](.*?)["\']', prompt)
        if quoted:
            return quoted[0]
        match = re.search(r'(?:message|મેસેજ|संदेश)\s+(?:draft karo|karo|bhejo|moklo|લખો|કરો|भेजो)?\s*(.*)', prompt, re.IGNORECASE)
        if match and match.group(1).strip():
            msg = match.group(1).strip()
            msg = re.sub(r'^(draft karo|karo|bhejo|moklo)\s*', '', msg, flags=re.IGNORECASE)
            if msg:
                return msg
        return "Hello from ROBO AI Assistant!"

    @staticmethod
    def _extract_search_query(prompt: str, stop_words: List[str]) -> str:
        p_clean = prompt
        for sw in stop_words:
            p_clean = re.sub(re.escape(sw), '', p_clean, flags=re.IGNORECASE)
        p_clean = re.sub(r'(search|kholo|open|karo|ખોલો|શોધો|aur|is|application)', '', p_clean, flags=re.IGNORECASE)
        return p_clean.strip() or "WhatsApp"
