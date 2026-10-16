package com.robo.ai

import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.os.BatteryManager
import android.util.Log
import com.google.gson.Gson
import com.google.gson.JsonObject
import kotlinx.coroutines.*
import okhttp3.*
import java.util.concurrent.TimeUnit

class WebSocketClientManager(
    private val context: Context,
    private val serverUrl: String,
    private val deviceId: String = "android-phone-main"
) {
    private val TAG = "RoboWebSocket"
    private val client = OkHttpClient.Builder()
        .pingInterval(10, TimeUnit.SECONDS)
        .connectTimeout(10, TimeUnit.SECONDS)
        .build()

    private var webSocket: WebSocket? = null
    private val gson = Gson()
    private val scope = CoroutineScope(Dispatchers.IO + SupervisorJob())
    private var isConnected = false
    private var shouldReconnect = true

    fun connect() {
        shouldReconnect = true
        val fullUrl = "$serverUrl/ws/android/$deviceId"
        val request = Request.Builder().url(fullUrl).build()

        webSocket = client.newWebSocket(request, object : WebSocketListener() {
            override fun onOpen(ws: WebSocket, response: Response) {
                isConnected = true
                Log.d(TAG, "Connected to ROBO Backend: $fullUrl")
                startHeartbeat()
            }

            override fun onMessage(ws: WebSocket, text: String) {
                try {
                    val json = gson.fromJson(text, JsonObject::class.java)
                    val type = json.get("type")?.asString

                    if (type == "execute_task") {
                        val taskId = json.get("task_id")?.asString ?: ""
                        val stepId = json.get("step_id")?.asString ?: ""
                        val action = json.get("action")?.asString ?: ""
                        val params = json.getAsJsonObject("parameters")

                        handleTaskExecution(taskId, stepId, action, params)
                    }
                } catch (e: Exception) {
                    Log.e(TAG, "Error handling message: ${e.message}")
                }
            }

            override fun onClosed(ws: WebSocket, code: Int, reason: String) {
                isConnected = false
                scheduleReconnect()
            }

            override fun onFailure(ws: WebSocket, t: Throwable, response: Response?) {
                isConnected = false
                scheduleReconnect()
            }
        })
    }

    private fun handleTaskExecution(taskId: String, stepId: String, action: String, params: JsonObject) {
        scope.launch(Dispatchers.Main) {
            var success = false
            when (action) {
                "dial_phone" -> {
                    val phone = params.get("phone_number")?.asString ?: ""
                    success = ActionExecutor.dialPhone(context, phone)
                }
                "whatsapp_draft" -> {
                    val phone = params.get("phone_number")?.asString ?: ""
                    val msg = params.get("message")?.asString ?: "Hello!"
                    success = ActionExecutor.sendWhatsAppMessage(context, phone, msg)
                }
                "play_store_search" -> {
                    val query = params.get("query")?.asString ?: ""
                    success = ActionExecutor.searchPlayStore(context, query)
                }
                "open_app" -> {
                    val app = params.get("app_name")?.asString ?: ""
                    success = ActionExecutor.openApp(context, app)
                }
                "send_sms_draft" -> {
                    val phone = params.get("phone_number")?.asString ?: ""
                    val msg = params.get("message")?.asString ?: ""
                    success = ActionExecutor.draftSms(context, phone, msg)
                }
            }

            // Report task completion back to backend
            val resultPayload = JsonObject().apply {
                addProperty("type", "task_result")
                addProperty("task_id", taskId)
                addProperty("step_id", stepId)
                addProperty("status", if (success) "completed" else "failed")
            }
            webSocket?.send(gson.toJson(resultPayload))
        }
    }

    private fun startHeartbeat() {
        scope.launch {
            while (isConnected && shouldReconnect) {
                try {
                    val (battery, isCharging) = getBatteryInfo()
                    val hb = JsonObject().apply {
                        addProperty("type", "heartbeat")
                        addProperty("battery_level", battery)
                        addProperty("is_charging", isCharging)
                    }
                    webSocket?.send(gson.toJson(hb))
                    delay(15000)
                } catch (e: Exception) {
                    break
                }
            }
        }
    }

    private fun getBatteryInfo(): Pair<Float, Boolean> {
        return try {
            val filter = IntentFilter(Intent.ACTION_BATTERY_CHANGED)
            val batteryStatus = context.registerReceiver(null, filter)
            val level = batteryStatus?.getIntExtra(BatteryManager.EXTRA_LEVEL, -1) ?: -1
            val scale = batteryStatus?.getIntExtra(BatteryManager.EXTRA_SCALE, -1) ?: -1
            val batteryPct = if (level >= 0 && scale > 0) (level * 100 / scale.toFloat()) else 85f
            val status = batteryStatus?.getIntExtra(BatteryManager.EXTRA_STATUS, -1) ?: -1
            val isCharging = status == BatteryManager.BATTERY_STATUS_CHARGING || status == BatteryManager.BATTERY_STATUS_FULL
            Pair(batteryPct, isCharging)
        } catch (e: Exception) {
            Pair(80f, false)
        }
    }

    private fun scheduleReconnect() {
        if (!shouldReconnect) return
        scope.launch {
            delay(5000)
            connect()
        }
    }

    fun disconnect() {
        shouldReconnect = false
        webSocket?.close(1000, "App closed")
        scope.cancel()
    }
}
