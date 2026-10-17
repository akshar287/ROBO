package com.robo.ai

import android.Manifest
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Build
import android.os.Bundle
import android.speech.RecognitionListener
import android.speech.RecognizerIntent
import android.speech.SpeechRecognizer
import android.speech.tts.TextToSpeech
import android.widget.Button
import android.widget.EditText
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.appcompat.widget.SwitchCompat
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import com.google.android.material.button.MaterialButton
import kotlinx.coroutines.*
import org.json.JSONObject
import java.io.OutputStreamWriter
import java.net.HttpURLConnection
import java.net.URL
import java.util.*

class MainActivity : AppCompatActivity(), TextToSpeech.OnInitListener {

    private lateinit var switchAgentState: SwitchCompat
    private lateinit var tvStatusBadge: TextView
    private lateinit var tvModeSubtitle: TextView
    private lateinit var tvVoicePrompt: TextView
    private lateinit var tvVoiceResult: TextView
    private lateinit var btnMic: MaterialButton
    private lateinit var etServerUrl: EditText
    private lateinit var btnStartService: Button
    private lateinit var btnQuickCall: Button
    private lateinit var btnQuickWhatsApp: Button
    private lateinit var btnQuickPlayStore: Button
    private lateinit var btnBatteryOpt: Button

    private var speechRecognizer: SpeechRecognizer? = null
    private var tts: TextToSpeech? = null
    private val scope = CoroutineScope(Dispatchers.Main + Job())

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        // Initialize UI bindings
        switchAgentState = findViewById(R.id.switchAgentState)
        tvStatusBadge = findViewById(R.id.tvStatusBadge)
        tvModeSubtitle = findViewById(R.id.tvModeSubtitle)
        tvVoicePrompt = findViewById(R.id.tvVoicePrompt)
        tvVoiceResult = findViewById(R.id.tvVoiceResult)
        btnMic = findViewById(R.id.btnMic)
        etServerUrl = findViewById(R.id.etServerUrl)
        btnStartService = findViewById(R.id.btnStartBackgroundService)
        btnQuickCall = findViewById(R.id.btnQuickCall)
        btnQuickWhatsApp = findViewById(R.id.btnQuickWhatsApp)
        btnQuickPlayStore = findViewById(R.id.btnQuickPlayStore)
        btnBatteryOpt = findViewById(R.id.btnBatteryOptimization)

        // Setup TTS
        tts = TextToSpeech(this, this)

        // Request runtime permissions
        requestPermissionsIfNeeded()

        // Setup Speech Recognizer
        setupSpeechRecognizer()

        // Setup Button Listeners
        btnMic.setOnClickListener {
            startListening()
        }

        btnQuickCall.setOnClickListener {
            this@MainActivity.speak("Calling Mummy on your phone.")
            ActionExecutor.dialPhone(this@MainActivity, "+919876500001")
        }

        btnQuickWhatsApp.setOnClickListener {
            this@MainActivity.speak("Drafted WhatsApp message for Rahul. Opening WhatsApp.")
            ActionExecutor.sendWhatsAppMessage(this@MainActivity, "+919876500003", "Hello Rahul! This is an automated message from ROBO AI.")
        }

        btnQuickPlayStore.setOnClickListener {
            ActionExecutor.searchPlayStore(this@MainActivity, "WhatsApp Messenger")
        }

        btnBatteryOpt.setOnClickListener {
            ActionExecutor.requestBatteryOptimizationExemption(this@MainActivity)
            Toast.makeText(this@MainActivity, "Please allow ROBO to run in background without battery restriction", Toast.LENGTH_LONG).show()
        }

        btnStartService.setOnClickListener {
            startRoboService()
        }

        switchAgentState.setOnCheckedChangeListener { _, isChecked ->
            val newState = if (isChecked) "ON" else "OFF"
            tvModeSubtitle.text = if (isChecked) "Active across connected devices" else "ROBO paused"
            tvStatusBadge.text = if (isChecked) "ONLINE" else "DISABLED"
            tvStatusBadge.setTextColor(android.graphics.Color.parseColor(if (isChecked) "#10B981" else "#EF4444"))
            updateBackendState(newState)
        }

        // Auto start background service
        startRoboService()
    }

    private fun startRoboService() {
        val serverUrl = etServerUrl.text.toString().trim()
        val serviceIntent = Intent(this, RoboBackgroundService::class.java).apply {
            putExtra("SERVER_URL", serverUrl)
        }
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            startForegroundService(serviceIntent)
        } else {
            startService(serviceIntent)
        }
        Toast.makeText(this, "ROBO Background Service Started", Toast.LENGTH_SHORT).show()
    }

    private fun setupSpeechRecognizer() {
        if (SpeechRecognizer.isRecognitionAvailable(this)) {
            speechRecognizer = SpeechRecognizer.createSpeechRecognizer(this).apply {
                setRecognitionListener(object : RecognitionListener {
                    override fun onReadyForSpeech(params: Bundle?) {
                        tvVoicePrompt.text = "Listening... Speak in Gujarati, Hindi, or English"
                        btnMic.backgroundTintList = ContextCompat.getColorStateList(this@MainActivity, android.R.color.holo_red_light)
                    }

                    override fun onResults(results: Bundle?) {
                        val matches = results?.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION)
                        if (!matches.isNullOrEmpty()) {
                            val recognizedText = matches[0]
                            tvVoicePrompt.text = "Heard: \"$recognizedText\""
                            processVoiceInput(recognizedText)
                        }
                        btnMic.backgroundTintList = ContextCompat.getColorStateList(this@MainActivity, android.R.color.holo_blue_light)
                    }

                    override fun onError(error: Int) {
                        tvVoicePrompt.text = "Microphone ready. Tap to speak."
                        btnMic.backgroundTintList = ContextCompat.getColorStateList(this@MainActivity, android.R.color.holo_blue_light)
                    }

                    override fun onBeginningOfSpeech() {}
                    override fun onRmsChanged(rmsdB: Float) {}
                    override fun onBufferReceived(buffer: ByteArray?) {}
                    override fun onEndOfSpeech() {}
                    override fun onPartialResults(partialResults: Bundle?) {}
                    override fun onEvent(eventType: Int, params: Bundle?) {}
                })
            }
        }
    }

    private fun startListening() {
        val intent = Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH).apply {
            putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL, RecognizerIntent.LANGUAGE_MODEL_FREE_FORM)
            putExtra(RecognizerIntent.EXTRA_LANGUAGE, "gu-IN") // Can also accept hi-IN or en-IN
            putExtra(RecognizerIntent.EXTRA_LANGUAGE_PREFERENCE, "gu-IN")
            putExtra(RecognizerIntent.EXTRA_ONLY_RETURN_LANGUAGE_PREFERENCE, false)
            putExtra(RecognizerIntent.EXTRA_PROMPT, "Speak in Gujarati, Hindi, or English")
        }
        speechRecognizer?.startListening(intent)
    }

    private fun processVoiceInput(text: String) {
        scope.launch(Dispatchers.IO) {
            try {
                // Post to Backend
                val httpUrl = etServerUrl.text.toString().replace("ws://", "http://").replace("/ws/android", "")
                val url = URL("$httpUrl/api/v1/voice/command")
                val conn = (url.openConnection() as HttpURLConnection).apply {
                    requestMethod = "POST"
                    setRequestProperty("Content-Type", "application/json")
                    doOutput = true
                    connectTimeout = 5000
                }

                val payload = JSONObject().apply {
                    put("transcript", text)
                    put("user_id", 1)
                }

                OutputStreamWriter(conn.outputStream).use { it.write(payload.toString()) }

                val responseCode = conn.responseCode
                if (responseCode == 200) {
                    val responseStr = conn.inputStream.bufferedReader().use { it.readText() }
                    val jsonResponse = JSONObject(responseStr)
                    val spokenResponse = jsonResponse.optString("spoken_response", "Task dispatched.")
                    val action = jsonResponse.optString("action", "")

                    withContext(Dispatchers.Main) {
                        tvVoiceResult.text = "ROBO: $spokenResponse"
                        this@MainActivity.speak(spokenResponse)

                        // Execute local action if returned
                        if (action == "dial_phone") {
                            val params = jsonResponse.optJSONObject("parameters")
                            val phone = params?.optString("phone_number") ?: "+919876543210"
                            ActionExecutor.dialPhone(this@MainActivity, phone)
                        } else if (action == "whatsapp_draft") {
                            val params = jsonResponse.optJSONObject("parameters")
                            val phone = params?.optString("phone_number") ?: "+919876543210"
                            val msg = params?.optString("message") ?: "Hello!"
                            ActionExecutor.sendWhatsAppMessage(this@MainActivity, phone, msg)
                        }
                        Unit
                    }
                }
            } catch (e: Exception) {
                withContext(Dispatchers.Main) {
                    // Offline fallback: parse locally
                    val lower = text.lowercase()
                    if (lower.contains("ફોન") || lower.contains("call") || lower.contains("કૉલ") || lower.contains("फोन")) {
                        this@MainActivity.speak("Calling Mummy now.")
                        ActionExecutor.dialPhone(this@MainActivity, "+919876500001")
                    } else if (lower.contains("whatsapp") || lower.contains("મેસેજ") || lower.contains("मैसेज")) {
                        this@MainActivity.speak("Drafting WhatsApp message for Rahul.")
                        ActionExecutor.sendWhatsAppMessage(this@MainActivity, "+919876500003", "Hello from ROBO!")
                    }
                    Unit
                }
            }
        }
    }

    private fun updateBackendState(state: String) {
        scope.launch(Dispatchers.IO) {
            try {
                val httpUrl = etServerUrl.text.toString().replace("ws://", "http://")
                val url = URL("$httpUrl/api/v1/state/")
                val conn = (url.openConnection() as HttpURLConnection).apply {
                    requestMethod = "POST"
                    setRequestProperty("Content-Type", "application/json")
                    doOutput = true
                }
                val payload = JSONObject().apply { put("state", state) }
                OutputStreamWriter(conn.outputStream).use { it.write(payload.toString()) }
                conn.responseCode
            } catch (e: Exception) {}
        }
    }

    fun speak(text: String) {
        tts?.speak(text, TextToSpeech.QUEUE_FLUSH, null, "robo_speech")
    }

    override fun onInit(status: Int) {
        if (status == TextToSpeech.SUCCESS) {
            tts?.language = Locale("gu", "IN")
            if (tts?.isLanguageAvailable(Locale("gu", "IN")) != TextToSpeech.LANG_AVAILABLE) {
                tts?.language = Locale("hi", "IN")
            }
        }
    }

    private fun requestPermissionsIfNeeded() {
        val permissions = mutableListOf(
            Manifest.permission.RECORD_AUDIO,
            Manifest.permission.CALL_PHONE
        )
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            permissions.add(Manifest.permission.POST_NOTIFICATIONS)
        }

        val needed = permissions.filter {
            ContextCompat.checkSelfPermission(this, it) != PackageManager.PERMISSION_GRANTED
        }
        if (needed.isNotEmpty()) {
            ActivityCompat.requestPermissions(this, needed.toTypedArray(), 100)
        }
    }

    override fun onDestroy() {
        super.onDestroy()
        speechRecognizer?.destroy()
        tts?.stop()
        tts?.shutdown()
        scope.cancel()
    }
}
