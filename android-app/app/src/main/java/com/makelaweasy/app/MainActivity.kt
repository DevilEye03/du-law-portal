package com.makelaweasy.app

import android.annotation.SuppressLint
import android.content.Context
import android.content.Intent
import android.graphics.Bitmap
import android.net.ConnectivityManager
import android.net.NetworkCapabilities
import android.net.Uri
import android.os.Bundle
import android.view.View
import android.webkit.CookieManager
import android.webkit.ValueCallback
import android.webkit.WebChromeClient
import android.webkit.WebResourceError
import android.webkit.WebResourceRequest
import android.webkit.WebResourceResponse
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.Button
import android.widget.ProgressBar
import android.widget.Toast
import androidx.activity.OnBackPressedCallback
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AppCompatActivity
import androidx.core.splashscreen.SplashScreen.Companion.installSplashScreen
import java.io.InputStream
import java.net.URLDecoder

class MainActivity : AppCompatActivity() {

    private lateinit var webView: WebView
    private lateinit var progressBar: ProgressBar
    private lateinit var offlineLayout: View
    private lateinit var btnRetry: Button

    private var fileChooserCallback: ValueCallback<Array<Uri>>? = null
    private var backPressedTime: Long = 0

    // File picker launcher for input[type=file] (feedback attachments, etc.)
    private val filePickerLauncher = registerForActivityResult(
        ActivityResultContracts.StartActivityForResult()
    ) { result ->
        if (result.resultCode == RESULT_OK) {
            val data = result.data
            val uris = WebChromeClient.FileChooserParams.parseResult(result.resultCode, data)
            fileChooserCallback?.onReceiveValue(uris)
        } else {
            fileChooserCallback?.onReceiveValue(null)
        }
        fileChooserCallback = null
    }

    companion object {
        const val PORTAL_URL = "https://makelaweasy.in"
        const val PORTAL_HOST = "makelaweasy.in"
        const val FIREBASE_HOST = "make-law-easy.web.app"
    }

    class WebAppInterface(private val activity: MainActivity) {
        @android.webkit.JavascriptInterface
        fun isNativeApp(): Boolean = true

        @android.webkit.JavascriptInterface
        fun isOfflineBundled(): Boolean = true
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        // Install modern Android 12+ splash screen
        installSplashScreen()

        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        webView = findViewById(R.id.webView)
        progressBar = findViewById(R.id.progressBar)
        offlineLayout = findViewById(R.id.offlineLayout)
        btnRetry = findViewById(R.id.btnRetry)

        setupWebView()
        setupOfflineRetry()
        setupBackNavigation()

        loadPortalUrl(savedInstanceState)
    }

    @SuppressLint("SetJavaScriptEnabled")
    private fun setupWebView() {
        // Explicit GPU hardware acceleration for smooth 60fps rendering
        webView.setLayerType(View.LAYER_TYPE_HARDWARE, null)
        webView.overScrollMode = View.OVER_SCROLL_NEVER
        webView.isVerticalScrollBarEnabled = false
        webView.isHorizontalScrollBarEnabled = false

        val settings = webView.settings

        // Enable core web APIs for PWA & modern vanilla JS portal
        settings.javaScriptEnabled = true
        settings.domStorageEnabled = true
        settings.cacheMode = WebSettings.LOAD_DEFAULT
        settings.mixedContentMode = WebSettings.MIXED_CONTENT_NEVER_ALLOW

        // Viewport and rendering optimizations (strictly honor mobile & tablet viewports)
        settings.useWideViewPort = true
        settings.loadWithOverviewMode = false
        settings.textZoom = 100
        settings.builtInZoomControls = false
        settings.displayZoomControls = false
        settings.setSupportMultipleWindows(false)
        settings.allowFileAccess = true
        settings.allowContentAccess = true
        settings.mediaPlaybackRequiresUserGesture = false
        settings.userAgentString = "${settings.userAgentString} MakeLawEasyApp/1.0"

        // Inject Native App Bridge
        webView.addJavascriptInterface(WebAppInterface(this), "AndroidApp")

        // Enable Cookies
        val cookieManager = CookieManager.getInstance()
        cookieManager.setAcceptCookie(true)
        cookieManager.setAcceptThirdPartyCookies(webView, true)

        // WebChromeClient: Progress bar & File Upload
        webView.webChromeClient = object : WebChromeClient() {
            override fun onProgressChanged(view: WebView?, newProgress: Int) {
                if (newProgress < 100) {
                    progressBar.visibility = View.VISIBLE
                    progressBar.progress = newProgress
                } else {
                    progressBar.visibility = View.GONE
                }
            }

            override fun onShowFileChooser(
                view: WebView?,
                filePathCallback: ValueCallback<Array<Uri>>?,
                fileChooserParams: FileChooserParams?
            ): Boolean {
                fileChooserCallback?.onReceiveValue(null)
                fileChooserCallback = filePathCallback

                val intent = fileChooserParams?.createIntent() ?: Intent(Intent.ACTION_GET_CONTENT).apply {
                    type = "*/*"
                    addCategory(Intent.CATEGORY_OPENABLE)
                }

                try {
                    filePickerLauncher.launch(intent)
                    return true
                } catch (e: Exception) {
                    fileChooserCallback = null
                    return false
                }
            }
        }

        // WebViewClient: Asset interception for 100% offline standalone speed & navigation
        webView.webViewClient = object : WebViewClient() {
            override fun shouldOverrideUrlLoading(view: WebView?, request: WebResourceRequest?): Boolean {
                val url = request?.url ?: return false
                val host = url.host ?: ""
                val scheme = url.scheme ?: ""

                // Handle tel:, mailto:, sms:, whatsapp: intents natively
                if (scheme.equals("mailto", ignoreCase = true) ||
                    scheme.equals("tel", ignoreCase = true) ||
                    scheme.equals("whatsapp", ignoreCase = true) ||
                    scheme.equals("sms", ignoreCase = true)
                ) {
                    try {
                        val intent = Intent(Intent.ACTION_VIEW, url)
                        startActivity(intent)
                    } catch (e: Exception) {
                        Toast.makeText(this@MainActivity, "No app available to handle this action", Toast.LENGTH_SHORT).show()
                    }
                    return true
                }

                // If inside portal domains, keep inside webView
                if (host.equals(PORTAL_HOST, ignoreCase = true) ||
                    host.equals(FIREBASE_HOST, ignoreCase = true) ||
                    host.endsWith(".makelaweasy.in", ignoreCase = true)
                ) {
                    return false
                }

                // External links open in system browser
                return try {
                    val intent = Intent(Intent.ACTION_VIEW, url)
                    startActivity(intent)
                    true
                } catch (e: Exception) {
                    false
                }
            }

            override fun shouldInterceptRequest(
                view: WebView?,
                request: WebResourceRequest?
            ): WebResourceResponse? {
                val url = request?.url ?: return null
                val host = url.host ?: ""

                // 1. Intercept portal domain requests to serve from local bundled assets (100% offline)
                if (host.equals(PORTAL_HOST, ignoreCase = true) ||
                    host.equals(FIREBASE_HOST, ignoreCase = true) ||
                    host.endsWith(".makelaweasy.in", ignoreCase = true)
                ) {
                    val assetResponse = getAssetResponse(url.path ?: "")
                    if (assetResponse != null) {
                        return assetResponse
                    }
                }

                // 2. Intercept CDN libraries to serve local bundled copies offline
                if (host.contains("cdnjs.cloudflare.com", ignoreCase = true)) {
                    val path = url.path ?: ""
                    val cdnAssetResponse = when {
                        path.contains("font-awesome") && path.endsWith("all.min.css") ->
                            getAssetResponse("lib/fontawesome/css/all.min.css")
                        path.contains("three.min.js") ->
                            getAssetResponse("lib/three.min.js")
                        path.contains("gsap.min.js") ->
                            getAssetResponse("lib/gsap.min.js")
                        path.contains("webfonts/fa-") -> {
                            val fontFile = path.substringAfterLast('/')
                            getAssetResponse("lib/fontawesome/webfonts/$fontFile")
                        }
                        else -> null
                    }
                    if (cdnAssetResponse != null) {
                        return cdnAssetResponse
                    }
                }

                return super.shouldInterceptRequest(view, request)
            }

            override fun onPageStarted(view: WebView?, url: String?, favicon: Bitmap?) {
                showOfflineScreen(false)
            }

            override fun onPageFinished(view: WebView?, url: String?) {
                progressBar.visibility = View.GONE
            }

            override fun onReceivedError(
                view: WebView?,
                request: WebResourceRequest?,
                error: WebResourceError?
            ) {
                // If main frame fails and cannot be intercepted, show offline screen only if no network
                if (request?.isForMainFrame == true && !isNetworkAvailable()) {
                    showOfflineScreen(true)
                }
            }
        }
    }

    /**
     * Resolves and streams local bundled assets from inside the APK
     * Providing instant 0ms latency and 100% offline study access across all 18 subjects
     */
    private fun getAssetResponse(rawPath: String): WebResourceResponse? {
        try {
            var path = rawPath
            val queryIdx = path.indexOf('?')
            if (queryIdx != -1) path = path.substring(0, queryIdx)
            val hashIdx = path.indexOf('#')
            if (hashIdx != -1) path = path.substring(0, hashIdx)

            path = URLDecoder.decode(path, "UTF-8")
            path = path.trim().replace('\\', '/')
            while (path.startsWith("/")) {
                path = path.substring(1)
            }

            if (path.isEmpty()) {
                path = "index.html"
            }

            val inputStream: InputStream = try {
                assets.open(path)
            } catch (_: Exception) {
                // If path has no extension, try appending .html or /index.html
                try {
                    assets.open("$path.html")
                } catch (_: Exception) {
                    try {
                        val trailing = if (path.endsWith("/")) "${path}index.html" else "$path/index.html"
                        assets.open(trailing)
                    } catch (_: Exception) {
                        return null
                    }
                }
            }

            val lowerPath = path.lowercase()
            val mimeType = when {
                lowerPath.endsWith(".html") || lowerPath.endsWith(".htm") -> "text/html"
                lowerPath.endsWith(".css") -> "text/css"
                lowerPath.endsWith(".js") || lowerPath.endsWith(".mjs") -> "application/javascript"
                lowerPath.endsWith(".json") -> "application/json"
                lowerPath.endsWith(".svg") -> "image/svg+xml"
                lowerPath.endsWith(".png") -> "image/png"
                lowerPath.endsWith(".jpg") || lowerPath.endsWith(".jpeg") -> "image/jpeg"
                lowerPath.endsWith(".webp") -> "image/webp"
                lowerPath.endsWith(".gif") -> "image/gif"
                lowerPath.endsWith(".ico") -> "image/x-icon"
                lowerPath.endsWith(".woff2") -> "font/woff2"
                lowerPath.endsWith(".woff") -> "font/woff"
                lowerPath.endsWith(".ttf") -> "font/ttf"
                lowerPath.endsWith(".otf") -> "font/otf"
                lowerPath.endsWith(".xml") -> "application/xml"
                lowerPath.endsWith(".txt") -> "text/plain"
                else -> "application/octet-stream"
            }

            val encoding = if (mimeType.startsWith("text/") ||
                mimeType.contains("javascript") ||
                mimeType.contains("json") ||
                mimeType.contains("xml")
            ) "UTF-8" else null

            val response = WebResourceResponse(mimeType, encoding, inputStream)
            response.responseHeaders = mapOf(
                "Access-Control-Allow-Origin" to "*",
                "Cache-Control" to "public, max-age=86400"
            )
            return response
        } catch (_: Exception) {
            return null
        }
    }

    private fun setupOfflineRetry() {
        btnRetry.setOnClickListener {
            showOfflineScreen(false)
            webView.loadUrl(PORTAL_URL)
        }
    }

    private fun setupBackNavigation() {
        onBackPressedDispatcher.addCallback(this, object : OnBackPressedCallback(true) {
            override fun handleOnBackPressed() {
                // 1. Check if the reader modal or an in-page modal is active via JS
                webView.evaluateJavascript(
                    "(function() { if (window.isReaderOpen && window.isReaderOpen()) { window.closeNotesReader(); return true; } if (window.history.state && window.history.state.view === 'reader') { window.history.back(); return true; } return false; })()"
                ) { handled ->
                    val isHandled = handled?.trim('"', '\'') == "true"
                    if (!isHandled) {
                        if (webView.canGoBack()) {
                            webView.goBack()
                        } else {
                            handleExitPress()
                        }
                    }
                }
            }
        })
    }

    private fun handleExitPress() {
        if (System.currentTimeMillis() - backPressedTime < 2000) {
            finish()
        } else {
            backPressedTime = System.currentTimeMillis()
            Toast.makeText(this, R.string.exit_prompt, Toast.LENGTH_SHORT).show()
        }
    }

    private fun loadPortalUrl(savedInstanceState: Bundle?) {
        if (savedInstanceState != null) {
            webView.restoreState(savedInstanceState)
        } else {
            val deepLink = intent?.data?.toString()
            val targetUrl = if (!deepLink.isNullOrBlank() && deepLink.contains(PORTAL_HOST)) {
                deepLink
            } else {
                PORTAL_URL
            }

            showOfflineScreen(false)
            webView.loadUrl(targetUrl)
        }
    }

    private fun showOfflineScreen(show: Boolean) {
        if (show) {
            offlineLayout.visibility = View.VISIBLE
            webView.visibility = View.GONE
        } else {
            offlineLayout.visibility = View.GONE
            webView.visibility = View.VISIBLE
        }
    }

    private fun isNetworkAvailable(): Boolean {
        val cm = getSystemService(Context.CONNECTIVITY_SERVICE) as ConnectivityManager
        val network = cm.activeNetwork ?: return false
        val caps = cm.getNetworkCapabilities(network) ?: return false
        return caps.hasCapability(NetworkCapabilities.NET_CAPABILITY_INTERNET)
    }

    override fun onSaveInstanceState(outState: Bundle) {
        super.onSaveInstanceState(outState)
        webView.saveState(outState)
    }

    override fun onResume() {
        super.onResume()
        webView.onResume()
    }

    override fun onPause() {
        super.onPause()
        webView.onPause()
    }

    override fun onDestroy() {
        webView.destroy()
        super.onDestroy()
    }
}
