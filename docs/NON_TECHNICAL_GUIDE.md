# ROBO — Non-Technical User Guide ("2-Minute Setup")

This guide is written for anyone—even if you have never written a line of code or configured a developer account.

---

## 1. How to Log In

1. Open the ROBO website dashboard: `http://localhost:3000`
2. Enter your **Mobile Number** (e.g., `9876543210`) and **Email** (e.g., `akshar@example.com`).
3. Or simply click **"1-Click Demo Login"** to enter immediately!
4. **No API tokens or developer registrations are required.**

---

## 2. Using Voice Commands

Click the big circular microphone button in the center of the dashboard or in the Android app.

You can speak naturally in:

### Gujarati (ગુજરાતી)
* **"મમ્મીને ફોન કરો."**
  * *What ROBO does:* Opens the phone dialer with Mummy's verified number ready to call.
* **"મારા Gmail માં unread email ચેક કરીને reply draft કરો."**
  * *What ROBO does:* Reads your unread emails, drafts a polite reply, and shows it to you for 1-click approval.
* **"લેપટોપ પર ક્રોમ ખોલો અને યુટ્યુબ ચાલુ કરો."**
  * *What ROBO does:* Launches Chrome and opens YouTube on your Windows laptop.

### Hindi (हिन्दी)
* **"मम्मी को कॉल करो."**
  * *What ROBO does:* Connects to your phone and prepares the call.
* **"WhatsApp par Rahul ko message draft karo."**
  * *What ROBO does:* Opens WhatsApp directly to Rahul's chat with the drafted message filled in.
* **"Mere laptop par Chrome kholo aur YouTube open karo."**
  * *What ROBO does:* Automatically opens YouTube on your laptop browser.
* **"Play Store kholo aur is application ko search karo."**
  * *What ROBO does:* Opens Google Play Store search on your Android phone.

### English
* **"Call Mummy."**
* **"Open Gmail and summarize my unread emails."**
* **"Search Spotify on Play Store."**
* **"Open Chrome on laptop."**

---

## 3. How Auto-WhatsApp Works Without Tokens

Traditional bots require a Meta Developer Account, a verified Facebook Business Manager, and credit cards. 

**ROBO is different:**
* ROBO uses native Android and Web WhatsApp dispatch protocols (`whatsapp://send?phone=...&text=...`).
* It automatically enters the phone number and formats the message.
* When you speak the command, WhatsApp opens with the recipient selected and message pre-filled.
* You tap "Send" or let ROBO Accessibility helper send it.
* **Cost:** 100% Free. **Setup:** Zero seconds.

---

## 4. How Auto-Calling Works Without Paid Accounts

* No Twilio account or monthly phone number rental fees required.
* When you ask ROBO to call someone (e.g., "મમ્મીને ફોન કરો"), ROBO verifies the contact number from your address book.
* It sends the command to your Android phone, which brings up the native phone dialer with the number ready to place the call.

---

## 5. Master ON/OFF Switch (Jarvis Mode)

* At the top of the dashboard, there is a large switch: **ROBO ACTIVE / OFF**.
* When you turn it **OFF**, ROBO immediately stops accepting new commands across all devices and pauses background tasks.
* When you turn it **ON**, all connected devices resume listening.
* This setting is saved in the central backend. You can close your browser tab, and ROBO remembers whether it was ON or OFF!
