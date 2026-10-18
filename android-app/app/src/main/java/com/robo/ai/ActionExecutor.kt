package com.robo.ai

import android.content.Context
import android.content.Intent
import android.net.Uri
import android.os.PowerManager
import android.provider.Settings
import android.util.Log
import java.net.URLEncoder

object ActionExecutor {
    private const val TAG = "ActionExecutor"

    /**
     * Opens installed application by package name or common app name.
     */
    fun openApp(context: Context, appName: String): Boolean {
        try {
            val key = appName.lowercase().trim()
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
                "phone", "dialer" -> "com.google.android.dialer"
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

            // If exact package fails, try a fuzzy search in installed apps
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
     * No dialer shown — rings instantly like Google Assistant.
     */
    fun callPhoneDirect(context: Context, phoneNumber: String): Boolean {
        return try {
            val cleanPhone = phoneNumber.filter { it.isDigit() || it == '+' }
            // Ensure country code
            val formattedPhone = when {
                cleanPhone.length == 10 -> "+91$cleanPhone"
                cleanPhone.startsWith("0") -> "+91" + cleanPhone.substring(1)
                else -> if (cleanPhone.startsWith("+")) cleanPhone else "+$cleanPhone"
            }
            val callIntent = Intent(Intent.ACTION_CALL, Uri.parse("tel:$formattedPhone"))
            callIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            context.startActivity(callIntent)
            true
        } catch (e: SecurityException) {
            Log.e(TAG, "CALL_PHONE permission not granted — falling back to dialer")
            dialPhone(context, phoneNumber)
        } catch (e: Exception) {
            Log.e(TAG, "Error calling phone: ${e.message}")
            dialPhone(context, phoneNumber)
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
