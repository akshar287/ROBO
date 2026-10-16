import urllib.parse
from typing import List, Dict, Any

class EmailZeroTokenService:
    """
    Zero-Token Email service.
    Enables creating direct web Gmail compose links, native mailto links,
    and unread email summaries.
    """

    _MOCK_INBOX = [
        {
            "id": "msg_001",
            "sender": "Rahul Sharma <rahul@example.com>",
            "subject": "Project Robo Update",
            "date": "Today, 10:15 AM",
            "snippet": "Is the new voice pipeline for Gujarati and Hindi ready for review?",
            "is_unread": True
        }
    ]

    @classmethod
    def get_unread_emails(cls) -> List[Dict[str, Any]]:
        return [msg for msg in cls._MOCK_INBOX if msg["is_unread"]]

    @classmethod
    def summarize_unread(cls) -> Dict[str, Any]:
        unread = cls.get_unread_emails()
        count = len(unread)
        return {
            "count": count,
            "summary": f"You have {count} unread email from Rahul regarding project update.",
            "emails": unread
        }

    @classmethod
    def prepare_email_action(cls, recipient: str, subject: str, body: str) -> Dict[str, Any]:
        """
        Creates ready-to-execute payloads for Web Gmail composer and Native Mail client.
        """
        encoded_subject = urllib.parse.quote(subject)
        encoded_body = urllib.parse.quote(body)
        encoded_recipient = urllib.parse.quote(recipient)

        # 1. Native OS mail client (Windows Mail / Outlook / Android Mail)
        mailto_url = f"mailto:{recipient}?subject={encoded_subject}&body={encoded_body}"

        # 2. Direct Web Gmail composer (opens Gmail in Chrome with everything pre-filled!)
        web_gmail_url = f"https://mail.google.com/mail/?view=cm&fs=1&to={encoded_recipient}&su={encoded_subject}&body={encoded_body}"

        return {
            "status": "ready",
            "recipient": recipient,
            "subject": subject,
            "body": body,
            "mailto_url": mailto_url,
            "web_gmail_url": web_gmail_url,
            "auto_open": True,
            "message": f"Drafted email to {recipient}. Opening Gmail composer."
        }

    @classmethod
    def draft_reply(cls, email_id: str, prompt: str = "") -> Dict[str, Any]:
        target = cls._MOCK_INBOX[0]
        reply_subject = f"Re: {target['subject']}"
        reply_body = (
            "Hi Rahul,\n\n"
            "Yes, the multilingual ROBO agent is fully functional with native support for "
            "Gujarati, Hindi, and English voice commands, zero-token WhatsApp, and auto-calling.\n\n"
            "Best regards,\nAkshar"
        )
        return cls.prepare_email_action(target["sender"], reply_subject, reply_body)
