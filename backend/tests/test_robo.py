import pytest
from backend.app.services.multilingual_nlp import MultilingualNLP
from backend.app.services.whatsapp_service import WhatsAppZeroTokenService
from backend.app.services.calling_service import CallingZeroTokenService
from backend.app.services.email_service import EmailZeroTokenService

def test_language_detection():
    assert MultilingualNLP.detect_language("મમ્મીને ફોન કરો.") == "gu"
    assert MultilingualNLP.detect_language("मम्मी को कॉल करो.") == "hi"
    assert MultilingualNLP.detect_language("Open Gmail and summarize my unread emails.") == "en"

def test_user_email_command():
    # User exact command from dashboard screenshot
    res = MultilingualNLP.parse_instruction('thakkarkrina157@gmail.com par "Jay swaminarayan" no mail karo')
    assert res["action"] == "send_email"
    assert res["target_device"] == "server"
    assert res["parameters"]["recipient"] == "thakkarkrina157@gmail.com"
    assert "Jay swaminarayan" in res["parameters"]["body"]

def test_user_youtube_command():
    # "you tube kholo"
    res1 = MultilingualNLP.parse_instruction("you tube kholo")
    assert res1["target_device"] == "laptop"
    assert "youtube.com" in res1["parameters"]["url"]

    # "laptop mayou tube kholo crome mathi"
    res2 = MultilingualNLP.parse_instruction("laptop mayou tube kholo crome mathi")
    assert res2["target_device"] == "laptop"
    assert "youtube.com" in res2["parameters"]["url"]

def test_gujarati_call_parsing():
    res = MultilingualNLP.parse_instruction("મમ્મીને ફોન કરો.")
    assert res["intent"] == "call_phone"
    assert res["target_device"] == "android"
    assert res["action"] == "dial_phone"

def test_whatsapp_message_parsing():
    res = MultilingualNLP.parse_instruction("ROBO, WhatsApp par Rahul ko message draft karo")
    assert res["target_device"] == "android"
    assert res["action"] == "whatsapp_draft"
    assert res["parameters"]["contact_name"] == "Rahul"

def test_email_service():
    payload = EmailZeroTokenService.prepare_email_action("thakkarkrina157@gmail.com", "Jay Swaminarayan", "Jay Swaminarayan")
    assert "mailto:thakkarkrina157@gmail.com" in payload["mailto_url"]
    assert "mail.google.com" in payload["web_gmail_url"]
    assert "Jay%20Swaminarayan" in payload["web_gmail_url"]
