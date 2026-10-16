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
            val pkg = when (appName.lowercase()) {
                "youtube" -> "com.google.android.youtube"
                "whatsapp" -> "com.whatsapp"
                "chrome" -> "com.android.chrome"
                "gmail" -> "com.google.android.gm"
                "maps" -> "com.google.android.apps.maps"
                "camera" -> "com.google.android.GoogleCamera"
                else -> appName
            }

            val launchIntent = context.packageManager.getLaunchIntentForPackage(pkg)
            if (launchIntent != null) {
                launchIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                context.startActivity(launchIntent)
                return true
            } else {
                // Fallback: search Play Store if app not installed
                return searchPlayStore(context, appName)
            }
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
     * Dials phone number using Android native dialer with recipient validation.
     * Non-technical users do not need telecom API keys!
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
