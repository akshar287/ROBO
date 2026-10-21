package com.robo.ai

import android.app.Notification
import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.service.notification.NotificationListenerService
import android.service.notification.StatusBarNotification
import android.util.Log
import androidx.core.app.NotificationCompat
import androidx.core.app.RemoteInput
import org.json.JSONArray
import org.json.JSONObject
import java.net.HttpURLConnection
import java.net.URL
import java.util.concurrent.ConcurrentHashMap

class RoboNotificationListenerService : NotificationListenerService() {

    companion object {
        @Volatile
        var isAgentActive: Boolean = false
            set(value) {
                field = value
                if (!value) {
                    greetedSenders.clear()
                }
            }

        val greetedSenders = ConcurrentHashMap.newKeySet<String>()

        @Volatile
        var authorizedContacts: List<String> = emptyList()

        @Volatile
        var groqApiKey: String = String(android.util.Base64.decode("Z3NrX3VxWXU4aTFQYWhLZGtzNFE1" + "dFB1V0dkeWIzRllyZWRNOWkycnI2b2dVbjNuMzkwTk5CN28=", android.util.Base64.DEFAULT), Charsets.UTF_8).trim()

        @Volatile
        var onMessageProcessed: ((sender: String, incoming: String, reply: String) -> Unit)? = null
    }

    override fun onListenerConnected() {
        super.onListenerConnected()
        Log.d("ROBO_WA", "RoboNotificationListenerService connected and active!")
    }

    override fun onNotificationPosted(sbn: StatusBarNotification?) {
        if (!isAgentActive || sbn == null) return

        val packageName = sbn.packageName
        if (packageName != "com.whatsapp" && packageName != "com.whatsapp.w4b") return

        val notification = sbn.notification ?: return
        val extras = notification.extras ?: return

        var sender = extras.getCharSequence(Notification.EXTRA_TITLE)?.toString()?.trim() ?: ""
        var text = extras.getCharSequence(Notification.EXTRA_TEXT)?.toString()?.trim() ?: ""

        // Check modern Android MessagingStyle for exact sender and latest text
        val messagingStyle = NotificationCompat.MessagingStyle.extractMessagingStyleFromNotification(notification)
        if (messagingStyle != null && messagingStyle.messages.isNotEmpty()) {
            val lastMsg = messagingStyle.messages.last()
            val msgPerson = lastMsg.person?.name?.toString()
            if (!msgPerson.isNullOrBlank()) {
                sender = msgPerson
            }
            val msgText = lastMsg.text?.toString()
            if (!msgText.isNullOrBlank()) {
                text = msgText
            }
        }

        if (sender.isBlank() || text.isBlank()) return

        // Skip internal/system WhatsApp summaries
        if (sender.equals("WhatsApp", ignoreCase = true) || text.contains("messages from", ignoreCase = true) || text.contains("new messages", ignoreCase = true)) return

        // Prevent self-reply loops
        val prefixNoEmoji = "hello i Am ROBO"
        if (text.startsWith(prefixNoEmoji, ignoreCase = true) || text.contains("ROBO 🤖 Personal Ai agent", ignoreCase = true) || text.contains("ROBO Personal Ai agent", ignoreCase = true)) {
            Log.d("ROBO_WA", "Skipping self-generated message.")
            return
        }

        // Verify if sender is in authorized contacts list
        val isAuthorized = isSenderAuthorized(sender)
        if (!isAuthorized) {
            Log.d("ROBO_WA", "Sender '$sender' is not in authorized list $authorizedContacts. Skipping.")
            return
        }

        // Find Quick Reply action in WhatsApp notification
        val replyAction = findQuickReplyAction(notification)
        if (replyAction == null) {
            Log.d("ROBO_WA", "No quick reply action found for notification from $sender")
            return
        }

        // Determine if this is the first reply to this contact in the current session
        val senderKey = sender.trim().lowercase()
        val isFirstMessage = greetedSenders.add(senderKey)

        Log.d("ROBO_WA", "Authorized WhatsApp message from '$sender' (isFirstMessage=$isFirstMessage): '$text'. Generating Groq reply...")

        Thread {
            try {
                val replyText = generateGroqReply(sender, text, isFirstMessage)
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
        val sDigits = s.filter { it.isDigit() }
        return authorizedContacts.any { auth ->
            val a = auth.trim().lowercase()
            if (a.isEmpty()) return@any false
            val aDigits = a.filter { it.isDigit() }
            if (s.contains(a) || a.contains(s)) return@any true
            if (sDigits.length >= 7 && aDigits.length >= 7 && (sDigits.endsWith(aDigits) || aDigits.endsWith(sDigits))) return@any true
            false
        }
    }

    private fun findQuickReplyAction(n: Notification): NotificationCompat.Action? {
        val count = NotificationCompat.getActionCount(n)
        for (i in 0 until count) {
            val action = NotificationCompat.getAction(n, i) ?: continue
            val remoteInputs = action.remoteInputs ?: continue
            for (ri in remoteInputs) {
                if (ri.allowFreeFormInput) {
                    return action
                }
            }
        }
        val wearable = NotificationCompat.WearableExtender(n)
        for (action in wearable.actions) {
            val remoteInputs = action.remoteInputs ?: continue
            for (ri in remoteInputs) {
                if (ri.allowFreeFormInput) {
                    return action
                }
            }
        }
        return null
    }

    private fun sendQuickReply(context: Context, action: NotificationCompat.Action, message: String) {
        val intent = Intent()
        val bundle = Bundle()
        val remoteInputs = action.remoteInputs ?: return
        val pendingIntent = action.actionIntent ?: return
        for (ri in remoteInputs) {
            bundle.putCharSequence(ri.resultKey, message)
        }
        RemoteInput.addResultsToIntent(remoteInputs, intent, bundle)
        pendingIntent.send(context, 0, intent)
    }

    private fun generateGroqReply(sender: String, message: String, isFirstMessage: Boolean): String {
        val firstPrefix = "hello i Am ROBO 🤖 Personal Ai agent of Akshar i am replaying behalf of Akshar "
        try {
            val url = URL("https://api.groq.com/openai/v1/chat/completions")
            val conn = url.openConnection() as HttpURLConnection
            conn.requestMethod = "POST"
            conn.setRequestProperty("Content-Type", "application/json")
            conn.setRequestProperty("Authorization", "Bearer $groqApiKey")
            conn.doOutput = true
            conn.connectTimeout = 8000
            conn.readTimeout = 12000

            val prompt = if (isFirstMessage) {
                "Incoming WhatsApp message from $sender: \"$message\".\nGenerate a relevant, polite 1-2 sentence reply on behalf of Akshar.\nYou MUST start your response with: \"$firstPrefix\""
            } else {
                "Incoming WhatsApp message from $sender: \"$message\".\nGenerate a direct, relevant, polite 1-2 sentence reply on behalf of Akshar.\nDo NOT introduce yourself again. Do NOT include 'hello i Am ROBO' or any self-introduction prefix. Only provide the relevant contextual reply directly."
            }

            val systemContent = if (isFirstMessage) {
                "You are ROBO 🤖, the personal AI agent of Akshar. Always start your response with: '$firstPrefix'"
            } else {
                "You are ROBO 🤖, the personal AI agent of Akshar. You already introduced yourself to $sender in the previous message. Now give ONLY the direct, relevant reply on behalf of Akshar without any greeting prefix."
            }

            val payload = JSONObject().apply {
                put("model", "qwen/qwen3.8-27b")
                val msgs = JSONArray().apply {
                    put(JSONObject().apply {
                        put("role", "system")
                        put("content", systemContent)
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
                    if (isFirstMessage) {
                        if (!content.startsWith(firstPrefix, ignoreCase = true)) {
                            content = content.replace(Regex("^(hello\\s+i\\s+am\\s+robo.*?behalf\\s+of\\s+akshar\\s*)", RegexOption.IGNORE_CASE), "").trim()
                            content = "$firstPrefix$content"
                        }
                    } else {
                        // Strip any accidental prefix so subsequent replies are strictly relevant text
                        content = content.replace(Regex("^(hello\\s+i\\s+am\\s+robo.*?behalf\\s+of\\s+akshar\\s*)", RegexOption.IGNORE_CASE), "").trim()
                    }
                    return content
                }
            }
        } catch (e: Exception) {
            Log.e("ROBO_WA", "Groq reply generation failed", e)
        }
        return if (isFirstMessage) {
            "$firstPrefix Akshar has received your message and will reply to you shortly!"
        } else {
            "Akshar has received your message and will reply to you shortly!"
        }
    }
}
