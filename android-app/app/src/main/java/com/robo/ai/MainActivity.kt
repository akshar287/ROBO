package com.robo.ai

import android.Manifest
import android.annotation.SuppressLint
import android.content.Intent
import android.content.pm.PackageManager
import android.net.Uri
import android.os.Build
import android.os.Bundle
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
import java.util.*

class MainActivity : AppCompatActivity(), TextToSpeech.OnInitListener {

    private lateinit var webView: WebView
    private var speechRecognizer: SpeechRecognizer? = null
    private var tts: TextToSpeech? = null
    private val scope = CoroutineScope(Dispatchers.Main + Job())
    private lateinit var assetLoader: WebViewAssetLoader

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
    }

    @SuppressLint("SetJavaScriptEnabled")
    private fun configureWebView() {
        // Initialize modern WebViewAssetLoader mapped to root www directory
        assetLoader = WebViewAssetLoader.Builder()
            .addPathHandler("/", WebViewAssetLoader.AssetsPathHandler(this, "www"))
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

        webView.webViewClient = object : WebViewClient() {
            override fun shouldInterceptRequest(
                view: WebView,
                request: WebResourceRequest
            ): WebResourceResponse? {
                val path = request.url.path ?: ""
                val cleanPath = path.trimStart('/')
                val assetPath = if (cleanPath.isEmpty()) "www/index.html" else "www/$cleanPath"

                try {
                    val stream = assets.open(assetPath)
                    val mime = when {
                        cleanPath.endsWith(".html") || cleanPath.isEmpty() -> "text/html"
                        cleanPath.endsWith(".css") -> "text/css"
                        cleanPath.endsWith(".js") -> "application/javascript"
                        cleanPath.endsWith(".json") -> "application/json"
                        cleanPath.endsWith(".svg") -> "image/svg+xml"
                        cleanPath.endsWith(".png") -> "image/png"
                        else -> "application/octet-stream"
                    }
                    val headers = mapOf(
                        "Access-Control-Allow-Origin" to "*",
                        "Cache-Control" to "no-cache"
                    )
                    return WebResourceResponse(mime, "UTF-8", 200, "OK", headers, stream)
                } catch (e: Exception) {
                    return assetLoader.shouldInterceptRequest(request.url)
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
    }

    inner class AndroidBridge {
        @JavascriptInterface
        fun dialPhone(phoneNumber: String) {
            runOnUiThread {
                ActionExecutor.dialPhone(this@MainActivity, phoneNumber)
            }
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
                                val escaped = recognizedText.replace("'", "\\'")
                                webView.evaluateJavascript("if (window.onSpeechResult) window.onSpeechResult('$escaped');", null)
                            }
                            this@MainActivity.speak("Understood: $recognizedText")
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

    private fun startListening() {
        val intent = Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH).apply {
            putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL, RecognizerIntent.LANGUAGE_MODEL_FREE_FORM)
            putExtra(RecognizerIntent.EXTRA_LANGUAGE, "gu-IN")
            putExtra(RecognizerIntent.EXTRA_LANGUAGE_PREFERENCE, "gu-IN")
            putExtra(RecognizerIntent.EXTRA_ONLY_RETURN_LANGUAGE_PREFERENCE, false)
            putExtra(RecognizerIntent.EXTRA_PROMPT, "Speak in Gujarati, Hindi, or English")
        }
        speechRecognizer?.startListening(intent)
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
            Manifest.permission.RECORD_AUDIO
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
