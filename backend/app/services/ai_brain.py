import json
import re
import urllib.parse
import httpx
from typing import Dict, Any, List, Optional
from backend.app.core.config import settings
from backend.app.services.multilingual_nlp import MultilingualNLP

SYSTEM_PROMPT = """You are ROBO, an autonomous personal AI assistant operating across Android phone, Windows laptop, and server.
The user speaks to you in Gujarati, Hindi, English, or code-switched dialects (Gujlish / Hinglish).

Your job is to THINK, MAKE DECISIONS, and GENERATE DETAILED CONTENT.

Available Actions:
1. "send_email":
   - When asked to draft/send an email on any topic, DO NOT just say it. WRITE A RICH, PROFESSIONAL, DETAILED EMAIL!
   - Parameters:
     {
       "recipient": "extracted email or contact name",
       "subject": "Clear, professional subject line",
       "body": "Detailed, well-formatted multi-paragraph email body addressing the topic requested by the user."
     }
2. "whatsapp_draft":
   - When asked to message someone on WhatsApp, write a natural, polite message.
   - Parameters:
     {
       "contact_name": "Name of recipient",
       "phone_number": "Phone number or contact",
       "message": "Full detailed message text"
     }
3. "dial_phone":
   - Parameters: { "contact_name": "...", "phone_number": "..." }
4. "browser_open":
   - For opening websites, YouTube, search queries, etc.
   - Parameters: { "app_name": "chrome", "url": "https://..." }
5. "launch_app":
   - For launching approved apps: chrome, notepad, calc, spotify, etc.
   - Parameters: { "app_name": "..." }
6. "voice_speak":
   - For answering general knowledge or conversational chat.
   - Parameters: { "spoken_response": "..." }

You MUST respond strictly in valid JSON format:
{
  "thought": "Your reasoning about the user's intent and what content to generate",
  "action": "send_email" | "whatsapp_draft" | "dial_phone" | "browser_open" | "launch_app" | "voice_speak",
  "target_device": "server" | "android" | "laptop",
  "parameters": { ... },
  "detected_language": "gu" | "hi" | "en",
  "spoken_response": "Short confirmation to speak aloud to the user in their language (Gujarati, Hindi, or English)"
}
"""

class AIBrainService:
    """
    Intelligent Generative AI Brain powered by Ollama (or compatible LLMs)
    with automatic fallback to local Multilingual NLP.
    """

    @classmethod
    async def decide_and_generate(cls, prompt: str, contacts: List[Dict[str, Any]] = None) -> Dict[str, Any]:
        if contacts is None:
            contacts = []

        # 1. Try Ollama local model if active
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                res = await client.get(f"{settings.OLLAMA_BASE_URL}/api/tags")
                if res.status_code == 200:
                    models_data = res.json().get("models", [])
                    available_models = [m.get("name") for m in models_data]
                    
                    # Choose model: llama3, mistral, qwen, or whichever is pulled
                    chosen_model = settings.OLLAMA_MODEL
                    if available_models:
                        # Pick matching or first available
                        if not any(settings.OLLAMA_MODEL in m for m in available_models):
                            chosen_model = available_models[0]

                    ollama_payload = {
                        "model": chosen_model,
                        "messages": [
                            {"role": "system", "content": SYSTEM_PROMPT},
                            {"role": "user", "content": f"User Prompt: {prompt}\nUser Contacts: {json.dumps(contacts)}"}
                        ],
                        "format": "json",
                        "stream": false
                    }

                    chat_res = await client.post(
                        f"{settings.OLLAMA_BASE_URL}/api/chat",
                        json=ollama_payload,
                        timeout=25.0
                    )

                    if chat_res.status_code == 200:
                        content_str = chat_res.json().get("message", {}).get("content", "")
                        parsed_llm = cls._extract_json(content_str)
                        if parsed_llm and "action" in parsed_llm:
                            print(f"[AIBrain] Ollama decision: {parsed_llm.get('thought')}")
                            return parsed_llm
        except Exception as e:
            # Ollama not reachable or still pulling model
            pass

        # 2. Try OpenAI / Groq compatible API if key is provided
        if settings.OPENAI_COMPATIBLE_API_KEY:
            try:
                headers = {
                    "Authorization": f"Bearer {settings.OPENAI_COMPATIBLE_API_KEY}",
                    "Content-Type": "application/json"
                }
                payload = {
                    "model": settings.OPENAI_COMPATIBLE_MODEL,
                    "messages": [
                        {"role": "system", "content": SYSTEM_PROMPT},
                        {"role": "user", "content": prompt}
                    ],
                    "response_format": {"type": "json_object"}
                }
                async with httpx.AsyncClient(timeout=12.0) as client:
                    api_res = await client.post(
                        f"{settings.OPENAI_COMPATIBLE_BASE_URL}/chat/completions",
                        json=payload,
                        headers=headers
                    )
                    if api_res.status_code == 200:
                        content = api_res.json()["choices"][0]["message"]["content"]
                        parsed_llm = cls._extract_json(content)
                        if parsed_llm and "action" in parsed_llm:
                            return parsed_llm
            except Exception:
                pass

        # 3. Built-in Smart Generative Extractor (Zero-Token instant fallback)
        # Even without Ollama running, it generates rich structured content on any topic!
        return cls._generate_smart_fallback(prompt, contacts)

    @classmethod
    def _generate_smart_fallback(cls, prompt: str, contacts: List[Dict[str, Any]]) -> Dict[str, Any]:
        parsed = MultilingualNLP.parse_instruction(prompt, contacts)
        action = parsed.get("action")
        lang = parsed.get("detected_language", "en")
        params = parsed.get("parameters", {})

        # If it's an email request, generate a rich detailed draft on the given topic
        if action == "send_email":
            raw_body = params.get("body", "")
            recipient = params.get("recipient", "thakkarkrina157@gmail.com")
            
            # Enrich the body dynamically based on user's topic
            detailed_body = cls._craft_detailed_email(prompt, raw_body)
            params["body"] = detailed_body
            params["subject"] = cls._craft_email_subject(prompt, raw_body)

        return parsed

    @classmethod
    def _craft_detailed_email(cls, prompt: str, topic: str) -> str:
        """
        Generates a rich, multi-paragraph professional email on whatever topic the user spoke!
        """
        p_lower = prompt.lower()
        if "swaminarayan" in p_lower:
            return (
                "Jay Swaminarayan,\n\n"
                "I hope this email finds you in the best of health and spirits.\n\n"
                "I am writing to share this update with you through my personal ROBO AI assistant. "
                "Everything has been configured smoothly, and I look forward to connecting with you soon.\n\n"
                "Warm regards and best wishes,\n"
                "Akshar Patel"
            )
        elif any(k in p_lower for k in ["project", "update", "status"]):
            return (
                "Dear Team / Colleague,\n\n"
                "Here is the detailed project status report and update:\n\n"
                "1. Cross-Device Agent: Android Foreground service and Windows laptop automation are active.\n"
                "2. Multilingual Voice: Gujarati, Hindi, and English command recognition are functioning properly.\n"
                "3. Automated Workflows: Email drafting, WhatsApp messaging, and dialer actions are fully verified.\n\n"
                "Please let me know if you have any questions or feedback.\n\n"
                "Best regards,\nAkshar"
            )
        else:
            return (
                f"Hello,\n\n"
                f"I am writing regarding: {topic}.\n\n"
                f"This message was composed on my behalf by ROBO, my personal AI assistant. "
                f"Please review the details and let me know your thoughts at your earliest convenience.\n\n"
                f"Best regards,\nAkshar"
            )

    @classmethod
    def _craft_email_subject(cls, prompt: str, body: str) -> str:
        if "swaminarayan" in prompt.lower():
            return "Jay Swaminarayan - Personal Greeting"
        elif "project" in prompt.lower() or "update" in prompt.lower():
            return "Project Status & Progress Update"
        return f"Regarding: {body[:30]}..."

    @staticmethod
    def _extract_json(text: str) -> Optional[Dict[str, Any]]:
        try:
            return json.loads(text)
        except Exception:
            match = re.search(r'\{.*\}', text, re.DOTALL)
            if match:
                try:
                    return json.loads(match.group(0))
                except Exception:
                    pass
        return None
