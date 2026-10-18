package com.robo.ai

import android.Manifest
import android.app.Activity
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.net.Uri
import android.os.PowerManager
import android.provider.Settings
import android.util.Log
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import java.net.URLEncoder

object ActionExecutor {
    private const val TAG = "ActionExecutor"

    /**
     * Opens installed application by package name or common app name.
     */
    fun openApp(context: Context, appName: String): Boolean {
        try {
            val key = appName.lowercase().trim()

            // 1. Direct universal system actions (avoid package-name guessing / Play Store)
            when (key) {
                "dialer", "dialpad", "phone", "call", "keypad" -> {
                    return dialPhone(context, "")
                }
                "alarm", "clock", "timer" -> {
                    try {
                        val alarmIntent = Intent(android.provider.AlarmClock.ACTION_SHOW_ALARMS).apply {
                            addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                        }
                        context.startActivity(alarmIntent)
                        return true
                    } catch (e: Exception) {
                        // fallback to package resolution below
                    }
                }
                "camera" -> {
                    try {
                        val camIntent = Intent("android.media.action.STILL_IMAGE_CAMERA").apply {
                            addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                        }
                        context.startActivity(camIntent)
                        return true
                    } catch (e: Exception) {
                        // fallback
                    }
                }
            }

            val pkg = when (key) {
                "youtube" -> "com.google.android.youtube"
                "whatsapp" -> "com.whatsapp"
                "chrome" -> "com.android.chrome"
                "gmail" -> "com.google.android.gm"
                "maps", "google maps" -> "com.google.android.apps.maps"
                "camera" -> "com.google.android.GoogleCamera"
                "playstore", "play store", "play" -> "com.android.vending"
                "alarm", "clock", "timer" -> "com.google.android.deskclock"
                "settings" -> "com.android.settings"
                "photos", "gallery" -> "com.google.android.apps.photos"
                "calendar" -> "com.google.android.calendar"
                "calculator" -> "com.google.android.calculator"
                "contacts" -> "com.google.android.contacts"
                "messages", "sms" -> "com.google.android.apps.messaging"
                "drive" -> "com.google.android.apps.docs"
                "instagram" -> "com.instagram.android"
                "spotify" -> "com.spotify.music"
                "netflix" -> "com.netflix.mediaclient"
                "telegram" -> "org.telegram.messenger"
                "twitter", "x" -> "com.twitter.android"
                "facebook" -> "com.facebook.katana"
                "zoom" -> "us.zoom.videomeetings"
                "meet" -> "com.google.android.apps.meetings"
                "docs" -> "com.google.android.apps.docs.editors.docs"
                "sheets" -> "com.google.android.apps.docs.editors.sheets"
                "slides" -> "com.google.android.apps.docs.editors.slides"
                "teams" -> "com.microsoft.teams"
                "outlook" -> "com.microsoft.office.outlook"
                "amazon" -> "com.amazon.mShop.android.shopping"
                "flipkart" -> "com.flipkart.android"
                "paytm" -> "net.one97.paytm"
                "gpay", "google pay" -> "com.google.android.apps.nbu.paisa.user"
                "phonepe" -> "com.phonepe.app"
                "swiggy" -> "in.swiggy.android"
                "zomato" -> "com.application.zomato"
                else -> key  // treat as package name directly
            }

            // Try by resolved package name first
            val launchIntent = context.packageManager.getLaunchIntentForPackage(pkg)
            if (launchIntent != null) {
                launchIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                context.startActivity(launchIntent)
                Log.d(TAG, "Opened app: $pkg")
                return true
            }

            // If exact package fails, search all installed apps on device
            val pm = context.packageManager
            val installed = pm.getInstalledApplications(android.content.pm.PackageManager.GET_META_DATA)
            val match = installed.firstOrNull { info ->
                pm.getApplicationLabel(info).toString().lowercase().contains(key) ||
                info.packageName.lowercase().contains(key)
            }
            if (match != null) {
                val intent = pm.getLaunchIntentForPackage(match.packageName)
                if (intent != null) {
                    intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                    context.startActivity(intent)
                    return true
                }
            }

            // Final fallback: search Play Store
            return searchPlayStore(context, appName)
        } catch (e: Exception) {
            Log.e(TAG, "Error opening app $appName: ${e.message}")
            return false
        }
    }

    /**
     * Opens official Google Play Store listing or search.
     */
    fun searchPlayStore(context: Context, query: String): Boolean {
        return try {
            val encodedQuery = URLEncoder.encode(query, "UTF-8")
            val marketIntent = Intent(Intent.ACTION_VIEW, Uri.parse("market://search?q=$encodedQuery"))
            marketIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            context.startActivity(marketIntent)
            true
        } catch (e: Exception) {
            // Web fallback if Play Store app is unavailable
            val webIntent = Intent(Intent.ACTION_VIEW, Uri.parse("https://play.google.com/store/search?q=$query&c=apps"))
            webIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            context.startActivity(webIntent)
            true
        }
    }

    /**
     * Dials phone number using Android native dialer (user taps Call to confirm).
     * If phoneNumber is empty, opens blank dialpad.
     */
    fun dialPhone(context: Context, phoneNumber: String): Boolean {
        return try {
            val cleanPhone = phoneNumber.filter { it.isDigit() || it == '+' }
            val dialIntent = Intent(Intent.ACTION_DIAL, Uri.parse("tel:$cleanPhone"))
            dialIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            context.startActivity(dialIntent)
            true
        } catch (e: Exception) {
            Log.e(TAG, "Error dialing phone: ${e.message}")
            false
        }
    }

    /**
     * Places a DIRECT phone call immediately (requires CALL_PHONE runtime permission).
     * Rings directly on cellular network without requiring manual button tap.
     */
    fun callPhoneDirect(context: Context, phoneNumber: String): Boolean {
        return try {
            val cleanDigits = phoneNumber.filter { it.isDigit() || it == '+' }
            if (cleanDigits.length < 7) {
                Log.e(TAG, "callPhoneDirect: Invalid phone number: '$phoneNumber'")
                dialPhone(context, phoneNumber)
                return false
            }

            // Guard against calling fake demo dummy numbers
            if (cleanDigits.contains("987650000")) {
                Log.e(TAG, "callPhoneDirect: Dummy number detected ($cleanDigits), opening dialpad instead")
                dialPhone(context, "")
                return false
            }

            val formattedPhone = when {
                cleanDigits.length == 10 -> "+91$cleanDigits"
                cleanDigits.startsWith("0") -> "+91" + cleanDigits.substring(1)
                cleanDigits.startsWith("+") -> cleanDigits
                else -> "+$cleanDigits"
            }

            // Check CALL_PHONE permission
            if (ContextCompat.checkSelfPermission(context, Manifest.permission.CALL_PHONE) != PackageManager.PERMISSION_GRANTED) {
                Log.w(TAG, "CALL_PHONE permission not granted at runtime! Requesting on Activity...")
                if (context is Activity) {
                    ActivityCompat.requestPermissions(context, arrayOf(Manifest.permission.CALL_PHONE), 102)
                }
                dialPhone(context, formattedPhone)
                return false
            }

            Log.d(TAG, "Placing ACTUAL direct cellular call to: $formattedPhone")
            val callIntent = Intent(Intent.ACTION_CALL, Uri.parse("tel:$formattedPhone"))
            callIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            context.startActivity(callIntent)
            true
        } catch (e: SecurityException) {
            Log.e(TAG, "CALL_PHONE permission denied by system: ${e.message} — falling back to dialer")
            dialPhone(context, phoneNumber)
            false
        } catch (e: Exception) {
            Log.e(TAG, "Error placing direct call: ${e.message}")
            dialPhone(context, phoneNumber)
            false
        }
    }

    /**
     * Looks up contact in device phonebook by name or dials number directly.
     * Always initiates actual direct cellular call when found.
     */
    fun callOrDialContact(context: Context, target: String): String {
        return try {
            val trimmed = target.trim()
            val digitsOnly = trimmed.filter { it.isDigit() || it == '+' }

            // 1. If input is already a phone number (e.g. 9876543210)
            if (digitsOnly.length >= 7 && !digitsOnly.contains("987650000")) {
                callPhoneDirect(context, digitsOnly)
                return digitsOnly
            }

            // 2. If target explicitly asks for dialpad/dialer
            if (trimmed.lowercase() in listOf("dialer", "dialpad", "phone", "keypad")) {
                dialPhone(context, "")
                return ""
            }

            // 3. Search real device contacts
            val foundNumber = getPhoneNumber(context, target)
            if (foundNumber.isNotBlank() && !foundNumber.contains("987650000")) {
                Log.d(TAG, "Found contact $target ($foundNumber), dialing actual call directly")
                callPhoneDirect(context, foundNumber)
                return foundNumber
            }

            // 4. Contact not found, open dialpad as last resort
            Log.d(TAG, "Contact '$trimmed' not found in device contacts, opening dialpad")
            dialPhone(context, "")
            ""
        } catch (e: Exception) {
            Log.e(TAG, "Error in callOrDialContact: ${e.message}")
            dialPhone(context, "")
            ""
        }
    }

    /**
     * Looks up real phone number from Android ContactsContract.
     * Handles relations aliases (Mummy/Mom/Maa, Papa/Dad), case-insensitivity, and fallback.
     */
    fun getPhoneNumber(context: Context, target: String): String {
        return try {
            val trimmed = target.trim()
            val digitsOnly = trimmed.filter { it.isDigit() || it == '+' }
            if (digitsOnly.length >= 7 && !digitsOnly.contains("987650000")) return digitsOnly

            val lower = trimmed.lowercase()
            val searchTerms = when {
                lower in listOf("mummy", "mom", "mother", "maa", "mataji", "ba", "ammi") ->
                    listOf("mummy", "mom", "mother", "maa", "mataji", "ba", "ammi")
                lower in listOf("papa", "dad", "father", "bapuji", "pita", "abbu", "pappa") ->
                    listOf("papa", "dad", "father", "bapuji", "pita", "abbu", "pappa")
                lower in listOf("bhai", "brother", "bro") ->
                    listOf("bhai", "brother", "bro")
                lower in listOf("ben", "sister", "sis") ->
                    listOf("ben", "sister", "sis")
                else -> listOf(lower)
            }

            var foundNumber: String? = null

            val cursor = context.contentResolver.query(
                android.provider.ContactsContract.CommonDataKinds.Phone.CONTENT_URI,
                arrayOf(
                    android.provider.ContactsContract.CommonDataKinds.Phone.DISPLAY_NAME,
                    android.provider.ContactsContract.CommonDataKinds.Phone.NUMBER
                ),
                null, null,
                null
            )

            cursor?.use { c ->
                val nameIdx = c.getColumnIndex(android.provider.ContactsContract.CommonDataKinds.Phone.DISPLAY_NAME)
                val numIdx = c.getColumnIndex(android.provider.ContactsContract.CommonDataKinds.Phone.NUMBER)

                // 1. Pass: Match aliases or exact substring
                while (c.moveToNext()) {
                    val name = c.getString(nameIdx)?.lowercase() ?: ""
                    val num = c.getString(numIdx) ?: ""
                    val clean = num.filter { it.isDigit() }
                    if (clean.length >= 7 && !clean.contains("987650000")) {
                        for (term in searchTerms) {
                            if (name.contains(term)) {
                                foundNumber = num
                                break
                            }
                        }
                    }
                    if (foundNumber != null) break
                }

                // 2. Pass: Multi-word query (e.g. "call mummy and talk")
                if (foundNumber == null && trimmed.contains(" ")) {
                    val words = trimmed.lowercase().split("\\s+".toRegex()).filter {
                        it.length >= 3 && it !in listOf("call", "dial", "talk", "with", "phone", "and", "the", "her", "him", "tell")
                    }
                    c.moveToPosition(-1)
                    while (c.moveToNext()) {
                        val name = c.getString(nameIdx)?.lowercase() ?: ""
                        val num = c.getString(numIdx) ?: ""
                        val clean = num.filter { it.isDigit() }
                        if (clean.length >= 7 && !clean.contains("987650000")) {
                            for (w in words) {
                                if (name.contains(w)) {
                                    foundNumber = num
                                    break
                                }
                            }
                        }
                        if (foundNumber != null) break
                    }
                }

                // 3. Pass: Generic fallback (e.g. user just said "call and talk")
                if (foundNumber == null && (trimmed.isEmpty() || lower in listOf("call", "dial", "talk", "someone", "contact"))) {
                    c.moveToPosition(-1)
                    if (c.moveToFirst()) {
                        val num = c.getString(numIdx) ?: ""
                        if (num.filter { it.isDigit() }.length >= 7 && !num.contains("987650000")) {
                            foundNumber = num
                        }
                    }
                }
            }

            foundNumber ?: ""
        } catch (e: Exception) {
            Log.e(TAG, "Error looking up phone number for '$target': ${e.message}")
            ""
        }
    }

    /**
     * Drafts SMS in default messaging app.
     */
    fun draftSms(context: Context, phoneNumber: String, message: String): Boolean {
        return try {
            val smsIntent = Intent(Intent.ACTION_SENDTO, Uri.parse("smsto:$phoneNumber"))
            smsIntent.putExtra("sms_body", message)
            smsIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            context.startActivity(smsIntent)
            true
        } catch (e: Exception) {
            Log.e(TAG, "Error drafting SMS: ${e.message}")
            false
        }
    }

    /**
     * Direct WhatsApp zero-token message dispatch using deep link.
     * Works on any Android phone with WhatsApp installed without any developer account!
     */
    fun sendWhatsAppMessage(context: Context, phoneNumber: String, message: String): Boolean {
        return try {
            val cleanPhone = phoneNumber.filter { it.isDigit() }
            val formattedPhone = when {
                cleanPhone.length == 10 -> "91$cleanPhone"
                cleanPhone.startsWith("0") -> "91" + cleanPhone.substring(1)
                else -> cleanPhone
            }
            val encoded = URLEncoder.encode(message, "UTF-8")
            val uri = Uri.parse("whatsapp://send?phone=$formattedPhone&text=$encoded")
            val waIntent = Intent(Intent.ACTION_VIEW, uri)
            waIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            context.startActivity(waIntent)
            true
        } catch (e: Exception) {
            // Web fallback
            val webUri = Uri.parse("https://api.whatsapp.com/send?phone=$phoneNumber&text=${URLEncoder.encode(message, "UTF-8")}")
            val webIntent = Intent(Intent.ACTION_VIEW, webUri)
            webIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            context.startActivity(webIntent)
            true
        }
    }

    /**
     * Guidance to exempt ROBO from Android battery optimization,
     * ensuring it stays alive in background even when screen is locked.
     */
    fun requestBatteryOptimizationExemption(context: Context) {
        try {
            val powerManager = context.getSystemService(Context.POWER_SERVICE) as PowerManager
            if (!powerManager.isIgnoringBatteryOptimizations(context.packageName)) {
                val optIntent = Intent(Settings.ACTION_REQUEST_IGNORE_BATTERY_OPTIMIZATIONS)
                optIntent.data = Uri.parse("package:${context.packageName}")
                optIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                context.startActivity(optIntent)
            }
        } catch (e: Exception) {
            Log.e(TAG, "Could not open battery optimization settings: ${e.message}")
        }
    }
}
