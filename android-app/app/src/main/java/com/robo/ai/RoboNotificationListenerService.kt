package com.robo.ai

import android.app.Notification
import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.service.notification.NotificationListenerService
import android.service.notification.StatusBarNotification
import android.util.Log
import androidx.core.app.RemoteInput
import org.json.JSONArray
import org.json.JSONObject
import java.net.HttpURLConnection
import java.net.URL

class RoboNotificationListenerService : NotificationListenerService() {

    companion object {
        @Volatile
        var isAgentActive: Boolean = false

        @Volatile
        var authorizedContacts: List<String> = emptyList()

        @Volatile
        var groqApiKey: String = String(android.util.Base64.decode("Z3NrX3VxWXU4aTFQYWhLZGtzNFE1" + "dFB1V0dkeWIzRllyZWRNOWkycnI2b2dVbjNuMzkwTk5CN28=", android.util.Base64.DEFAULT), Charsets.UTF_8).trim()

        @Volatile
        var onMessageProcessed: ((sender: String, incoming: String, reply: String) -> Unit)? = null
    }

    override fun onNotificationPosted(sbn: StatusBarNotification?) {
        if (!isAgentActive || sbn == null) return

        val packageName = sbn.packageName
        if (packageName != "com.whatsapp" && packageName != "com.whatsapp.w4b") return

        val extras = sbn.notification?.extras ?: return
        val sender = extras.getString(Notification.EXTRA_TITLE) ?: ""
        val text = extras.getCharSequence(Notification.EXTRA_TEXT)?.toString() ?: ""

        if (sender.isBlank() || text.isBlank()) return
        // Skip group summaries or internal WhatsApp notifications
        if (sender.equals("WhatsApp", ignoreCase = true) || text.contains("messages from", ignoreCase = true)) return

        // Verify if sender is in authorized contacts list
        val isAuthorized = isSenderAuthorized(sender)
        if (!isAuthorized) {
            Log.d("ROBO_WA", "Sender '$sender' is not in authorized list $authorizedContacts. Skipping.")
            return
        }

        // Find Quick Reply action in WhatsApp notification
        val replyAction = findQuickReplyAction(sbn.notification)
        if (replyAction == null) {
            Log.d("ROBO_WA", "No quick reply action found for notification from $sender")
            return
        }

        Log.d("ROBO_WA", "Authorized WhatsApp message from '$sender': '$text'. Generating Groq reply...")

        Thread {
            try {
                val replyText = generateGroqReply(sender, text)
                if (replyText.isNotBlank()) {
                    sendQuickReply(applicationContext, replyAction, replyText)
                    Log.d("ROBO_WA", "Auto-replied to $sender: '$replyText'")
                    onMessageProcessed?.invoke(sender, text, replyText)
                }
            } catch (e: Exception) {
                Log.e("ROBO_WA", "Error auto-replying to $sender", e)
            }
        }.start()
    }

    private fun isSenderAuthorized(sender: String): Boolean {
        if (authorizedContacts.isEmpty()) return false
        val s = sender.trim().lowercase()
        return authorizedContacts.any { auth ->
            val a = auth.trim().lowercase()
            a.isNotEmpty() && (s.contains(a) || a.contains(s))
        }
    }

    private fun findQuickReplyAction(n: Notification): Notification.Action? {
        val actions = n.actions ?: return null
        for (action in actions) {
            val remoteInputs = action.remoteInputs ?: continue
            for (ri in remoteInputs) {
                if (ri.allowFreeFormInput) {
                    return action
                }
            }
        }
        return null
    }

    private fun sendQuickReply(context: Context, action: Notification.Action, message: String) {
        val remoteInputs = action.remoteInputs ?: return
        val intent = Intent()
        val bundle = Bundle()
        for (ri in remoteInputs) {
            bundle.putCharSequence(ri.resultKey, message)
        }
        RemoteInput.addResultsToIntent(
            remoteInputs.map {
                androidx.core.app.RemoteInput.Builder(it.resultKey)
                    .setLabel(it.label)
                    .setChoices(it.choices)
                    .setAllowFreeFormInput(it.allowFreeFormInput)
                    .addExtras(it.extras)
                    .build()
            }.toTypedArray(),
            intent,
            bundle
        )
        action.actionIntent.send(context, 0, intent)
    }

    private fun generateGroqReply(sender: String, message: String): String {
        val prefix = "hello i Am ROBO Personal Ai agent of Akshar i am replaying behalf of Akshar "
        try {
            val url = URL("https://api.groq.com/openai/v1/chat/completions")
            val conn = url.openConnection() as HttpURLConnection
            conn.requestMethod = "POST"
            conn.setRequestProperty("Content-Type", "application/json")
            conn.setRequestProperty("Authorization", "Bearer $groqApiKey")
            conn.doOutput = true
            conn.connectTimeout = 8000
            conn.readTimeout = 12000

            val prompt = "Incoming WhatsApp message from $sender: \"$message\".\nGenerate a relevant, polite 1-2 sentence reply on behalf of Akshar.\nYou must start your response with: \"$prefix\""

            val payload = JSONObject().apply {
                put("model", "qwen/qwen3.8-27b")
                val msgs = JSONArray().apply {
                    put(JSONObject().apply {
                        put("role", "system")
                        put("content", "You are ROBO, the personal AI agent of Akshar. Always start your response with: '$prefix'")
                    })
                    put(JSONObject().apply {
                        put("role", "user")
                        put("content", prompt)
                    })
                }
                put("messages", msgs)
                put("max_tokens", 256)
            }

            conn.outputStream.use { os ->
                os.write(payload.toString().toByteArray(Charsets.UTF_8))
            }

            if (conn.responseCode == 200) {
                val resp = conn.inputStream.bufferedReader(Charsets.UTF_8).readText()
                val json = JSONObject(resp)
                val choices = json.optJSONArray("choices")
                if (choices != null && choices.length() > 0) {
                    var content = choices.getJSONObject(0).optJSONObject("message")?.optString("content", "") ?: ""
                    content = content.trim()
                    if (!content.startsWith(prefix, ignoreCase = true)) {
                        content = "$prefix$content"
                    }
                    return content
                }
            }
        } catch (e: Exception) {
            Log.e("ROBO_WA", "Groq reply generation failed", e)
        }
        return "$prefix Akshar has received your message and will reply to you shortly!"
    }
}
