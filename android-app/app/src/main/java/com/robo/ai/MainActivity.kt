package com.robo.ai

import android.Manifest
import android.annotation.SuppressLint
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.database.Cursor
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.provider.ContactsContract
import android.speech.RecognitionListener
import android.speech.RecognizerIntent
import android.speech.SpeechRecognizer
import android.speech.tts.TextToSpeech
import android.util.Log
import android.webkit.*
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import androidx.webkit.WebViewAssetLoader
import kotlinx.coroutines.*
import org.json.JSONArray
import org.json.JSONObject
import java.util.*

class MainActivity : AppCompatActivity(), TextToSpeech.OnInitListener {

    private lateinit var webView: WebView
    private var speechRecognizer: SpeechRecognizer? = null
    private var tts: TextToSpeech? = null
    private val scope = CoroutineScope(Dispatchers.Main + Job())
    private lateinit var assetLoader: WebViewAssetLoader
    private var inCallSpeechJob: Job? = null
    private var activeCallTarget: String = "Mummy"
    private var activeCallGoal: String = ""
    private var isCallInProgress: Boolean = false
    private var hasGreetedCaller: Boolean = false
    private val CALL_NOTIFICATION_ID = 2002
    private val CALL_CHANNEL_ID = "robo_call_channel"

    override fun onNewIntent(intent: Intent?) {
        super.onNewIntent(intent)
        if (intent?.action == "com.robo.ai.ACTION_GREET_NOW") {
            Log.d("ROBO_CALL", "ACTION_GREET_NOW received from notification tap")
            triggerGreetingNow()
        }
    }

    private fun createCallNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = android.app.NotificationChannel(
                CALL_CHANNEL_ID,
                "ROBO Call Status",
                android.app.NotificationManager.IMPORTANCE_HIGH
            ).apply {
                description = "Shows live status and controls for active phone calls"
            }
            val manager = getSystemService(android.app.NotificationManager::class.java)
            manager?.createNotificationChannel(channel)
        }
    }

    fun showInCallNotification(title: String, text: String, showGreetAction: Boolean) {
        createCallNotificationChannel()

        val openAppIntent = android.app.PendingIntent.getActivity(
            this,
            0,
            Intent(this, MainActivity::class.java),
            android.app.PendingIntent.FLAG_IMMUTABLE or android.app.PendingIntent.FLAG_UPDATE_CURRENT
        )

        val greetIntent = Intent(this, MainActivity::class.java).apply {
            action = "com.robo.ai.ACTION_GREET_NOW"
        }
        val greetPendingIntent = android.app.PendingIntent.getActivity(
            this,
            1,
            greetIntent,
            android.app.PendingIntent.FLAG_IMMUTABLE or android.app.PendingIntent.FLAG_UPDATE_CURRENT
        )

        val builder = androidx.core.app.NotificationCompat.Builder(this, CALL_CHANNEL_ID)
            .setContentTitle(title)
            .setContentText(text)
            .setSmallIcon(android.R.drawable.stat_sys_phone_call)
            .setContentIntent(openAppIntent)
            .setOngoing(true)
            .setPriority(androidx.core.app.NotificationCompat.PRIORITY_HIGH)

        if (showGreetAction) {
            builder.addAction(
                android.R.drawable.ic_btn_speak_now,
                "🟢 Answered - Greet Now",
                greetPendingIntent
            )
        }

        val manager = getSystemService(Context.NOTIFICATION_SERVICE) as? android.app.NotificationManager
        manager?.notify(CALL_NOTIFICATION_ID, builder.build())
    }

    fun cancelInCallNotification() {
        val manager = getSystemService(Context.NOTIFICATION_SERVICE) as? android.app.NotificationManager
        manager?.cancel(CALL_NOTIFICATION_ID)
    }

    fun triggerGreetingNow(customGreeting: String = "") {
        if (hasGreetedCaller && customGreeting.isBlank()) return
        hasGreetedCaller = true
        inCallSpeechJob?.cancel()
        enableSpeakerphone(true)

        val cName = if (activeCallTarget.isBlank()) "Mummy" else activeCallTarget
        val note = if (activeCallGoal.isNotBlank()) activeCallGoal else "Akshar asked me to talk with you"
        val greeting = if (customGreeting.isNotBlank()) {
            customGreeting
        } else {
            "Jay Swaminarayan $cName! I am ROBO. I am talking to you on behalf of Akshar. $note. Kem cho, how are you doing today?"
        }

        showInCallNotification("🗣️ ROBO Speaking on Call", "Talking with $cName on behalf of Akshar", false)
        speak(greeting, "in_call_greeting")
        webView.evaluateJavascript("if (window.onCallAnswered) window.onCallAnswered();", null)
    }

    fun enableSpeakerphone(enable: Boolean) {
        runOnUiThread {
            try {
                val am = getSystemService(Context.AUDIO_SERVICE) as android.media.AudioManager
                am.isSpeakerphoneOn = enable
                if (enable) {
                    am.mode = android.media.AudioManager.MODE_IN_COMMUNICATION
                } else {
                    am.mode = android.media.AudioManager.MODE_NORMAL
                }
                Log.d("ROBO_AUDIO", "Speakerphone toggled: $enable")
            } catch (e: Exception) {
                Log.e("ROBO_AUDIO", "Error setting speakerphone: ${e.message}")
            }
        }
    }

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        webView = findViewById(R.id.webView)

        // Setup TTS
        tts = TextToSpeech(this, this)

        // Request runtime permissions
        requestPermissionsIfNeeded()

        // Setup Speech Recognizer
        setupSpeechRecognizer()

        // Configure WebView
        configureWebView()

        // Auto start background service
        startRoboService()

        // Listen for phone call state changes
        setupCallStateListener()
    }

    private fun setupCallStateListener() {
        try {
            val tm = getSystemService(Context.TELEPHONY_SERVICE) as? android.telephony.TelephonyManager
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
                tm?.registerTelephonyCallback(
                    mainExecutor,
                    object : android.telephony.TelephonyCallback(), android.telephony.TelephonyCallback.CallStateListener {
                        override fun onCallStateChanged(state: Int) {
                            handleCallState(state)
                        }
                    }
                )
            } else {
                @Suppress("DEPRECATION")
                tm?.listen(
                    object : android.telephony.PhoneStateListener() {
                        @Deprecated("Deprecated in Java")
                        override fun onCallStateChanged(state: Int, phoneNumber: String?) {
                            handleCallState(state)
                        }
                    },
                    android.telephony.PhoneStateListener.LISTEN_CALL_STATE
                )
            }
        } catch (e: Exception) {
            Log.w("ROBO_CALL", "Failed to register TelephonyCallback: ${e.message}")
        }
    }

    private fun handleCallState(state: Int) {
        runOnUiThread {
            when (state) {
                android.telephony.TelephonyManager.CALL_STATE_OFFHOOK -> {
                    Log.d("ROBO_CALL", "Telephony state: OFFHOOK (outgoing call dialing or active)")
                    isCallInProgress = true
                    enableSpeakerphone(true)
                    showInCallNotification(
                        "📞 Calling $activeCallTarget...",
                        "Waiting for answer... Tap [Answered] or ROBO will greet automatically",
                        true
                    )

                    // Start pickup waiting job:
                    // Indian cellular ring duration is ~3-4 seconds per ring.
                    // 9.5 seconds gives enough time for 2-3 rings before greeting, or user can tap "Answered - Greet Now" anytime!
                    inCallSpeechJob?.cancel()
                    inCallSpeechJob = scope.launch {
                        delay(9500)
                        if (isCallInProgress && !hasGreetedCaller) {
                            Log.d("ROBO_CALL", "Ring wait elapsed, auto-triggering greeting now")
                            triggerGreetingNow()
                        }
                    }
                }
                android.telephony.TelephonyManager.CALL_STATE_IDLE -> {
                    Log.d("ROBO_CALL", "Telephony state: IDLE (call ended/hung up)")
                    isCallInProgress = false
                    hasGreetedCaller = false
                    inCallSpeechJob?.cancel()
                    enableSpeakerphone(false)
                    cancelInCallNotification()
                    webView.evaluateJavascript("if (window.onCallEnded) window.onCallEnded();", null)
                }
            }
        }
    }

    @SuppressLint("SetJavaScriptEnabled")
    private fun configureWebView() {
        assetLoader = WebViewAssetLoader.Builder()
            .addPathHandler("/assets/", WebViewAssetLoader.AssetsPathHandler(this))
            .build()

        webView.settings.apply {
            javaScriptEnabled = true
            domStorageEnabled = true
            allowFileAccess = true
            allowContentAccess = true
            allowFileAccessFromFileURLs = true
            allowUniversalAccessFromFileURLs = true
            databaseEnabled = true
            useWideViewPort = true
            loadWithOverviewMode = true
            mediaPlaybackRequiresUserGesture = false
            cacheMode = WebSettings.LOAD_DEFAULT
        }

        webView.addJavascriptInterface(AndroidBridge(), "AndroidBridge")

        val corsHeaders = mapOf(
            "Access-Control-Allow-Origin" to "*",
            "Cache-Control" to "no-cache"
        )

        webView.webViewClient = object : WebViewClient() {
            override fun shouldInterceptRequest(
                view: WebView,
                request: WebResourceRequest
            ): WebResourceResponse? {
                val path = request.url.path ?: ""
                val cleanPath = path.trimStart('/')
                val assetPath = if (cleanPath.isEmpty()) "www/index.html" else "www/$cleanPath"

                fun mimeFor(p: String) = when {
                    p.endsWith(".html") || p.isEmpty() -> "text/html"
                    p.endsWith(".css")  -> "text/css"
                    p.endsWith(".js")   -> "application/javascript"
                    p.endsWith(".json") -> "application/json"
                    p.endsWith(".svg")  -> "image/svg+xml"
                    p.endsWith(".png")  -> "image/png"
                    else                -> "application/octet-stream"
                }

                // 1️⃣ OTA: check internal storage first (downloaded update)
                val localFile = java.io.File(filesDir, assetPath)
                if (localFile.exists()) {
                    return WebResourceResponse(
                        mimeFor(cleanPath), "UTF-8", 200, "OK",
                        corsHeaders, localFile.inputStream()
                    )
                }

                // 2️⃣ Fall back to bundled assets
                return try {
                    val stream = assets.open(assetPath)
                    WebResourceResponse(mimeFor(cleanPath), "UTF-8", 200, "OK", corsHeaders, stream)
                } catch (e: Exception) {
                    assetLoader.shouldInterceptRequest(request.url)
                }
            }

            override fun onPageFinished(view: WebView?, url: String?) {
                super.onPageFinished(view, url)
                scope.launch(Dispatchers.IO) {
                    val json = loadDeviceContacts()
                    withContext(Dispatchers.Main) {
                        val escaped = json.replace("\\", "\\\\").replace("'", "\\'")
                        webView.evaluateJavascript("if (window.onContactsLoaded) window.onContactsLoaded('$escaped');", null)
                    }
                }
            }
        }

        webView.webChromeClient = object : WebChromeClient() {
            override fun onConsoleMessage(consoleMessage: ConsoleMessage?): Boolean {
                Log.d("ROBO_WEBVIEW", "${consoleMessage?.message()} [line ${consoleMessage?.lineNumber()}]")
                return true
            }
        }

        // Load root index.html
        webView.loadUrl("https://appassets.androidplatform.net/index.html")

        // OTA: fetch latest HTML from GitHub in background and cache it
        fetchOtaUpdate()
    }

    /**
     * OTA Self-Update: Downloads the latest index.html from GitHub and stores it in
     * internal storage. On the NEXT app launch it will be served automatically —
     * no reinstall ever needed!
     */
    private fun fetchOtaUpdate() {
        val OTA_URL = "https://raw.githubusercontent.com/akshar287/ROBO/main/android-app/app/src/main/assets/www/index.html"
        scope.launch(Dispatchers.IO) {
            try {
                val connection = java.net.URL(OTA_URL).openConnection() as java.net.HttpURLConnection
                connection.connectTimeout = 8000
                connection.readTimeout = 15000
                connection.setRequestProperty("Cache-Control", "no-cache")
                val responseCode = connection.responseCode
                if (responseCode == 200) {
                    val content = connection.inputStream.bufferedReader(Charsets.UTF_8).readText()
                    connection.disconnect()
                    // Save to internal storage: filesDir/www/index.html
                    val file = java.io.File(filesDir, "www/index.html")
                    file.parentFile?.mkdirs()
                    file.writeText(content, Charsets.UTF_8)
                    Log.d("ROBO_OTA", "OTA update downloaded (${content.length} bytes). Reloading...")
                    withContext(Dispatchers.Main) {
                        webView.reload()
                        // Notify JS
                        webView.evaluateJavascript(
                            "if(window.AndroidBridge) AndroidBridge.showToast('ROBO updated to latest version!');",
                            null
                        )
                    }
                } else {
                    connection.disconnect()
                    Log.d("ROBO_OTA", "No update available (HTTP $responseCode)")
                }
            } catch (e: Exception) {
                Log.d("ROBO_OTA", "OTA check failed (offline?): ${e.message}")
            }
        }
    }


    inner class AndroidBridge {
        @JavascriptInterface
        fun dialPhone(phoneNumber: String) {
            // Shows the dialer (user must tap Call button)
            runOnUiThread {
                ActionExecutor.dialPhone(this@MainActivity, phoneNumber)
            }
        }

        @JavascriptInterface
        fun callPhone(phoneNumber: String) {
            // DIRECT call — no dialer shown, rings immediately
            runOnUiThread {
                ActionExecutor.callPhoneDirect(this@MainActivity, phoneNumber)
            }
        }

        @JavascriptInterface
        fun callOrDial(target: String, messageToSpeak: String) {
            runOnUiThread {
                activeCallTarget = if (target.isBlank()) "Mummy" else target
                activeCallGoal = messageToSpeak
                isCallInProgress = true
                hasGreetedCaller = false
                enableSpeakerphone(true)

                // Dials real cellular call directly or opens native dialpad
                ActionExecutor.callOrDialContact(this@MainActivity, activeCallTarget)
            }
        }

        @JavascriptInterface
        fun triggerGreetingNow(message: String) {
            runOnUiThread {
                this@MainActivity.triggerGreetingNow(message)
            }
        }

        @JavascriptInterface
        fun getPhoneNumber(target: String): String {
            return ActionExecutor.getPhoneNumber(this@MainActivity, target)
        }

        @JavascriptInterface
        fun sendWhatsApp(phoneNumber: String, message: String) {
            runOnUiThread {
                ActionExecutor.sendWhatsAppMessage(this@MainActivity, phoneNumber, message)
            }
        }

        @JavascriptInterface
        fun searchPlayStore(query: String) {
            runOnUiThread {
                ActionExecutor.searchPlayStore(this@MainActivity, query)
            }
        }

        @JavascriptInterface
        fun openApp(appName: String) {
            runOnUiThread {
                ActionExecutor.openApp(this@MainActivity, appName)
            }
        }

        @JavascriptInterface
        fun speak(text: String) {
            this@MainActivity.speak(text)
        }

        @JavascriptInterface
        fun startVoice() {
            runOnUiThread {
                startListening()
            }
        }

        @JavascriptInterface
        fun showToast(msg: String) {
            runOnUiThread {
                Toast.makeText(this@MainActivity, msg, Toast.LENGTH_SHORT).show()
            }
        }

        @JavascriptInterface
        fun enableSpeakerphone(enable: Boolean) {
            this@MainActivity.enableSpeakerphone(enable)
        }

        /**
         * Returns contacts as JSON string synchronously.
         * Also fires window.onContactsLoaded for async update.
         */
        @JavascriptInterface
        fun getContacts(): String {
            return loadDeviceContacts()
        }

        /**
         * Async-friendly: loads contacts then calls back into JS.
         */
        @JavascriptInterface
        fun loadContacts() {
            scope.launch(Dispatchers.IO) {
                val json = loadDeviceContacts()
                withContext(Dispatchers.Main) {
                    val escaped = json.replace("\\", "\\\\").replace("'", "\\'")
                    webView.evaluateJavascript(
                        "if (window.onContactsLoaded) window.onContactsLoaded('$escaped');",
                        null
                    )
                }
            }
        }

        /**
         * Returns list of installed app package names as JSON array.
         */
        @JavascriptInterface
        fun getInstalledApps(): String {
            return try {
                val pm = packageManager
                val apps = pm.getInstalledApplications(PackageManager.GET_META_DATA)
                val arr = JSONArray()
                apps.filter { pm.getLaunchIntentForPackage(it.packageName) != null }
                    .forEach { info ->
                        val obj = JSONObject()
                        obj.put("package", info.packageName)
                        obj.put("name", pm.getApplicationLabel(info).toString())
                        arr.put(obj)
                    }
                arr.toString()
            } catch (e: Exception) {
                "[]"
            }
        }



        @JavascriptInterface
        fun speakInCall(text: String) {
            runOnUiThread {
                this@MainActivity.speak(text, "in_call_speech")
            }
        }

        @JavascriptInterface
        fun queryOllama(endpoint: String, model: String, prompt: String, callbackId: String) {
            scope.launch(Dispatchers.IO) {
                try {
                    val targetEndpoint = if (endpoint.isBlank()) "http://10.0.2.2:11434" else endpoint.trim().trimEnd('/')
                    val targetModel = if (model.isBlank()) "llama3" else model.trim()
                    val url = java.net.URL("$targetEndpoint/api/generate")
                    val conn = url.openConnection() as java.net.HttpURLConnection
                    conn.requestMethod = "POST"
                    conn.setRequestProperty("Content-Type", "application/json")
                    conn.doOutput = true
                    conn.connectTimeout = 5000
                    conn.readTimeout = 12000

                    val payload = JSONObject().apply {
                        put("model", targetModel)
                        put("prompt", prompt)
                        put("stream", false)
                    }
                    conn.outputStream.use { os ->
                        os.write(payload.toString().toByteArray(Charsets.UTF_8))
                    }

                    if (conn.responseCode == 200) {
                        val resp = conn.inputStream.bufferedReader(Charsets.UTF_8).readText()
                        val json = JSONObject(resp)
                        val responseText = json.optString("response", "")
                        withContext(Dispatchers.Main) {
                            val escaped = responseText.replace("\\", "\\\\").replace("'", "\\'").replace("\n", " ")
                            webView.evaluateJavascript("if (window.onOllamaResult) window.onOllamaResult('$callbackId', '$escaped');", null)
                        }
                    } else {
                        withContext(Dispatchers.Main) {
                            webView.evaluateJavascript("if (window.onOllamaError) window.onOllamaError('$callbackId', 'HTTP ${conn.responseCode}');", null)
                        }
                    }
                    conn.disconnect()
                } catch (e: Exception) {
                    withContext(Dispatchers.Main) {
                        val escaped = (e.message ?: "Failed").replace("'", "\\'")
                        webView.evaluateJavascript("if (window.onOllamaError) window.onOllamaError('$callbackId', '$escaped');", null)
                    }
                }
            }
        }
    }

    private fun startRoboService() {
        val serviceIntent = Intent(this, RoboBackgroundService::class.java).apply {
            putExtra("SERVER_URL", "ws://10.0.2.2:8000")
        }
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            startForegroundService(serviceIntent)
        } else {
            startService(serviceIntent)
        }
    }

    private fun setupSpeechRecognizer() {
        if (SpeechRecognizer.isRecognitionAvailable(this)) {
            speechRecognizer = SpeechRecognizer.createSpeechRecognizer(this).apply {
                setRecognitionListener(object : RecognitionListener {
                    override fun onReadyForSpeech(params: Bundle?) {
                        runOnUiThread {
                            webView.evaluateJavascript("if (window.onSpeechState) window.onSpeechState('listening');", null)
                        }
                    }

                    override fun onResults(results: Bundle?) {
                        val matches = results?.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION)
                        if (!matches.isNullOrEmpty()) {
                            val recognizedText = matches[0]
                            runOnUiThread {
                                val escaped = recognizedText.replace("\\", "\\\\").replace("'", "\\'").replace("\n", " ")
                                webView.evaluateJavascript("if (window.onSpeechResult) window.onSpeechResult('$escaped');", null)
                            }
                        }
                    }

                    override fun onError(error: Int) {
                        runOnUiThread {
                            webView.evaluateJavascript("if (window.onSpeechState) window.onSpeechState('ready');", null)
                        }
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

    companion object {
        private const val REQUEST_CODE_SPEECH = 101
    }

    private fun startListening() {
        if (ContextCompat.checkSelfPermission(this, Manifest.permission.RECORD_AUDIO) != PackageManager.PERMISSION_GRANTED) {
            ActivityCompat.requestPermissions(this, arrayOf(Manifest.permission.RECORD_AUDIO), 100)
            Toast.makeText(this, "Microphone permission required for voice commands", Toast.LENGTH_SHORT).show()
            return
        }

        runOnUiThread {
            webView.evaluateJavascript("if (window.onSpeechState) window.onSpeechState('listening');", null)
            val intent = Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH).apply {
                putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL, RecognizerIntent.LANGUAGE_MODEL_FREE_FORM)
                putExtra(RecognizerIntent.EXTRA_PROMPT, "Speak to ROBO (Gujarati, Hindi, English)")
                putExtra(RecognizerIntent.EXTRA_MAX_RESULTS, 3)
            }
            if (speechRecognizer != null) {
                try {
                    speechRecognizer?.startListening(intent)
                    return@runOnUiThread
                } catch (e: Exception) {
                    Log.e("ROBO_VOICE", "speechRecognizer.startListening failed: ${e.message}, falling back to activity")
                }
            }
            try {
                startActivityForResult(intent, REQUEST_CODE_SPEECH)
            } catch (e: Exception) {
                Log.e("ROBO_VOICE", "Speech activity failed: ${e.message}")
                Toast.makeText(this, "Voice recognition not available. Please install Google Speech.", Toast.LENGTH_SHORT).show()
                webView.evaluateJavascript("if (window.onSpeechState) window.onSpeechState('ready');", null)
            }
        }
    }

    @Deprecated("Deprecated in Java")
    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)
        if (requestCode == REQUEST_CODE_SPEECH) {
            webView.evaluateJavascript("if (window.onSpeechState) window.onSpeechState('ready');", null)
            if (resultCode == RESULT_OK && data != null) {
                val matches = data.getStringArrayListExtra(RecognizerIntent.EXTRA_RESULTS)
                if (!matches.isNullOrEmpty()) {
                    val recognizedText = matches[0]
                    Log.d("ROBO_VOICE", "Recognized speech from dialog: $recognizedText")
                    val escaped = recognizedText.replace("\\", "\\\\").replace("'", "\\'").replace("\n", " ")
                    webView.evaluateJavascript("if (window.onSpeechResult) window.onSpeechResult('$escaped');", null)
                }
            }
        }
    }

    fun speak(text: String, utteranceId: String = "robo_speech") {
        tts?.speak(text, TextToSpeech.QUEUE_FLUSH, null, utteranceId)
    }

    override fun onInit(status: Int) {
        if (status == TextToSpeech.SUCCESS) {
            tts?.language = Locale("gu", "IN")
            if (tts?.isLanguageAvailable(Locale("gu", "IN")) != TextToSpeech.LANG_AVAILABLE) {
                tts?.language = Locale("hi", "IN")
            }
            tts?.setOnUtteranceProgressListener(object : android.speech.tts.UtteranceProgressListener() {
                override fun onStart(utteranceId: String?) {}
                override fun onDone(utteranceId: String?) {
                    runOnUiThread {
                        webView.evaluateJavascript("if (window.onTtsFinished) window.onTtsFinished('$utteranceId');", null)
                        if (isCallInProgress && (utteranceId == "in_call_greeting" || utteranceId == "in_call_speech")) {
                            // Give brief audio clearance, then start listening for Mummy's response
                            scope.launch {
                                delay(400)
                                if (isCallInProgress) {
                                    startListening()
                                }
                            }
                        }
                    }
                }
                override fun onError(utteranceId: String?) {}
            })
        }
    }

    private fun requestPermissionsIfNeeded() {
        val permissions = mutableListOf(
            Manifest.permission.RECORD_AUDIO,
            Manifest.permission.READ_CONTACTS,
            Manifest.permission.CALL_PHONE,
            Manifest.permission.MODIFY_AUDIO_SETTINGS,
            Manifest.permission.READ_PHONE_STATE
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

    override fun onRequestPermissionsResult(
        requestCode: Int,
        permissions: Array<out String>,
        grantResults: IntArray
    ) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults)
        // Auto-reload real device contacts as soon as permissions are granted
        scope.launch(Dispatchers.IO) {
            val json = loadDeviceContacts()
            withContext(Dispatchers.Main) {
                val escaped = json.replace("\\", "\\\\").replace("'", "\\'")
                webView.evaluateJavascript("if (window.onContactsLoaded) window.onContactsLoaded('$escaped');", null)
            }
        }
    }

    /**
     * Reads real device contacts from ContentProvider.
     * Returns JSON array: [{"name":"...","phone":"..."}]
     */
    private fun loadDeviceContacts(): String {
        return try {
            val arr = JSONArray()
            val cursor: Cursor? = contentResolver.query(
                ContactsContract.CommonDataKinds.Phone.CONTENT_URI,
                arrayOf(
                    ContactsContract.CommonDataKinds.Phone.DISPLAY_NAME,
                    ContactsContract.CommonDataKinds.Phone.NUMBER
                ),
                null, null,
                ContactsContract.CommonDataKinds.Phone.DISPLAY_NAME + " ASC"
            )
            val seen = mutableSetOf<String>()
            cursor?.use { c ->
                val nameIdx = c.getColumnIndex(ContactsContract.CommonDataKinds.Phone.DISPLAY_NAME)
                val phoneIdx = c.getColumnIndex(ContactsContract.CommonDataKinds.Phone.NUMBER)
                while (c.moveToNext()) {
                    val name = c.getString(nameIdx) ?: continue
                    val phone = c.getString(phoneIdx)?.replace("\\s".toRegex(), "") ?: continue
                    val key = name + phone
                    if (key in seen) continue
                    seen.add(key)
                    val obj = JSONObject()
                    obj.put("name", name)
                    obj.put("phone", phone)
                    arr.put(obj)
                }
            }
            arr.toString()
        } catch (e: Exception) {
            Log.e("ROBO_CONTACTS", "Error loading contacts: ${e.message}")
            "[]"
        }
    }

    @Deprecated("Deprecated in Java")
    override fun onBackPressed() {
        if (webView.canGoBack()) {
            webView.goBack()
        } else {
            super.onBackPressed()
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
