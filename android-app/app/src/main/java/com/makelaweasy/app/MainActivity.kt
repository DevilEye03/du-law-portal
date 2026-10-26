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
import android.os.Build
import android.os.Vibrator
import android.os.VibratorManager
import android.os.VibrationEffect
import android.view.InputDevice
import android.util.Base64
import androidx.core.content.FileProvider
import java.io.File
import java.io.FileOutputStream
import java.io.InputStream
import java.net.URLDecoder
import org.json.JSONArray
import org.json.JSONObject

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

        @android.webkit.JavascriptInterface
        fun hasStylus(): Boolean {
            val deviceIds = InputDevice.getDeviceIds()
            for (id in deviceIds) {
                val device = InputDevice.getDevice(id) ?: continue
                val sources = device.sources
                if ((sources and InputDevice.SOURCE_STYLUS) == InputDevice.SOURCE_STYLUS ||
                    (sources and InputDevice.SOURCE_BLUETOOTH_STYLUS) == InputDevice.SOURCE_BLUETOOTH_STYLUS
                ) {
                    return true
                }
            }
            return false
        }

        @android.webkit.JavascriptInterface
        fun saveAnnotations(pageId: String, title: String, subject: String, dataJson: String) {
            try {
                val notesDir = File(activity.filesDir, "spen_notes")
                if (!notesDir.exists()) notesDir.mkdirs()

                val safeId = pageId.replace("[^a-zA-Z0-9_-]".toRegex(), "_")
                val pageFile = File(notesDir, "$safeId.json")
                pageFile.writeText(dataJson, Charsets.UTF_8)

                val indexFile = File(notesDir, "index.json")
                val indexArray = if (indexFile.exists()) {
                    try { JSONArray(indexFile.readText(Charsets.UTF_8)) } catch (_: Exception) { JSONArray() }
                } else {
                    JSONArray()
                }

                var strokeCount = 0
                var stickyCount = 0
                try {
                    val obj = JSONObject(dataJson)
                    strokeCount = obj.optJSONArray("strokes")?.length() ?: 0
                    stickyCount = obj.optJSONArray("stickyNotes")?.length() ?: 0
                } catch (_: Exception) {}

                val newArray = JSONArray()
                for (i in 0 until indexArray.length()) {
                    val entry = indexArray.optJSONObject(i) ?: continue
                    if (entry.optString("pageId") != pageId) {
                        newArray.put(entry)
                    }
                }

                if (strokeCount > 0 || stickyCount > 0) {
                    val newEntry = JSONObject().apply {
                        put("pageId", pageId)
                        put("title", if (title.isNotBlank()) title else "Comprehensive Study Notes")
                        put("subject", if (subject.isNotBlank()) subject else "Law Subject")
                        put("timestamp", System.currentTimeMillis())
                        put("strokeCount", strokeCount)
                        put("stickyCount", stickyCount)
                    }
                    newArray.put(0, newEntry)
                }

                indexFile.writeText(newArray.toString(), Charsets.UTF_8)
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }

        @android.webkit.JavascriptInterface
        fun loadAnnotations(pageId: String): String {
            return try {
                val safeId = pageId.replace("[^a-zA-Z0-9_-]".toRegex(), "_")
                val pageFile = File(File(activity.filesDir, "spen_notes"), "$safeId.json")
                if (pageFile.exists()) pageFile.readText(Charsets.UTF_8) else ""
            } catch (_: Exception) {
                ""
            }
        }

        @android.webkit.JavascriptInterface
        fun getAllNotesIndex(): String {
            return try {
                val indexFile = File(File(activity.filesDir, "spen_notes"), "index.json")
                if (indexFile.exists()) indexFile.readText(Charsets.UTF_8) else "[]"
            } catch (_: Exception) {
                "[]"
            }
        }

        @android.webkit.JavascriptInterface
        fun deleteAnnotations(pageId: String): Boolean {
            return try {
                val notesDir = File(activity.filesDir, "spen_notes")
                val safeId = pageId.replace("[^a-zA-Z0-9_-]".toRegex(), "_")
                val pageFile = File(notesDir, "$safeId.json")
                if (pageFile.exists()) pageFile.delete()

                val indexFile = File(notesDir, "index.json")
                if (indexFile.exists()) {
                    val indexArray = try { JSONArray(indexFile.readText(Charsets.UTF_8)) } catch (_: Exception) { JSONArray() }
                    val newArray = JSONArray()
                    for (i in 0 until indexArray.length()) {
                        val entry = indexArray.optJSONObject(i) ?: continue
                        if (entry.optString("pageId") != pageId) {
                            newArray.put(entry)
                        }
                    }
                    indexFile.writeText(newArray.toString(), Charsets.UTF_8)
                }
                true
            } catch (_: Exception) {
                false
            }
        }

        @android.webkit.JavascriptInterface
        fun vibratePen(type: Int) {
            activity.runOnUiThread {
                try {
                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
                        val vm = activity.getSystemService(Context.VIBRATOR_MANAGER_SERVICE) as? VibratorManager
                        val vib = vm?.defaultVibrator
                        val effect = if (type == 2) {
                            VibrationEffect.createPredefined(VibrationEffect.EFFECT_HEAVY_CLICK)
                        } else {
                            VibrationEffect.createPredefined(VibrationEffect.EFFECT_TICK)
                        }
                        vib?.vibrate(effect)
                    } else {
                        @Suppress("DEPRECATION")
                        val vib = activity.getSystemService(Context.VIBRATOR_SERVICE) as? Vibrator
                        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                            vib?.vibrate(VibrationEffect.createOneShot(if (type == 2) 35L else 15L, VibrationEffect.DEFAULT_AMPLITUDE))
                        } else {
                            @Suppress("DEPRECATION")
                            vib?.vibrate(if (type == 2) 35L else 15L)
                        }
                    }
                } catch (_: Exception) {}
            }
        }

        @android.webkit.JavascriptInterface
        fun exportPageImage(base64Png: String, title: String) {
            activity.runOnUiThread {
                try {
                    val pureBase64 = if (base64Png.contains(",")) base64Png.substringAfter(",") else base64Png
                    val imageBytes = Base64.decode(pureBase64, Base64.DEFAULT)

                    val exportDir = File(activity.cacheDir, "exports")
                    if (!exportDir.exists()) exportDir.mkdirs()

                    val safeTitle = title.replace("[^a-zA-Z0-9_-]".toRegex(), "_")
                    val file = File(exportDir, "${safeTitle}_Notes.png")
                    FileOutputStream(file).use { it.write(imageBytes) }

                    val uri = FileProvider.getUriForFile(
                        activity,
                        "${activity.packageName}.fileprovider",
                        file
                    )

                    val shareIntent = Intent(Intent.ACTION_SEND).apply {
                        this.type = "image/png"
                        putExtra(Intent.EXTRA_STREAM, uri)
                        putExtra(Intent.EXTRA_SUBJECT, title)
                        addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
                    }
                    activity.startActivity(Intent.createChooser(shareIntent, "Share Study Notes"))
                } catch (e: Exception) {
                    Toast.makeText(activity, "Export failed: ${e.message}", Toast.LENGTH_SHORT).show()
                }
            }
        }

        @android.webkit.JavascriptInterface
        fun printOrSavePdf(title: String) {
            activity.runOnUiThread {
                try {
                    val printManager = activity.getSystemService(Context.PRINT_SERVICE) as? android.print.PrintManager
                    val jobName = "${title.ifBlank { "MakeLawEasy_StudyNotes" }}_Doc"
                    val printAdapter = activity.webView.createPrintDocumentAdapter(jobName)
                    printManager?.print(jobName, printAdapter, android.print.PrintAttributes.Builder().build())
                } catch (e: Exception) {
                    Toast.makeText(activity, "PDF Print failed: ${e.message}", Toast.LENGTH_SHORT).show()
                }
            }
        }

        @android.webkit.JavascriptInterface
        fun saveThumbnail(pageId: String, base64Png: String) {
            try {
                val thumbDir = File(activity.filesDir, "spen_thumbs")
                if (!thumbDir.exists()) thumbDir.mkdirs()
                val safeId = pageId.replace("[^a-zA-Z0-9_-]".toRegex(), "_")
                val file = File(thumbDir, "$safeId.png")
                val pure = if (base64Png.contains(",")) base64Png.substringAfter(",") else base64Png
                val bytes = Base64.decode(pure, Base64.DEFAULT)
                FileOutputStream(file).use { it.write(bytes) }
            } catch (_: Exception) {}
        }

        @android.webkit.JavascriptInterface
        fun getThumbnail(pageId: String): String {
            return try {
                val safeId = pageId.replace("[^a-zA-Z0-9_-]".toRegex(), "_")
                val file = File(File(activity.filesDir, "spen_thumbs"), "$safeId.png")
                if (file.exists()) {
                    val bytes = file.readBytes()
                    "data:image/png;base64," + Base64.encodeToString(bytes, Base64.NO_WRAP)
                } else ""
            } catch (_: Exception) {
                ""
            }
        }

        @android.webkit.JavascriptInterface
        fun exportMasterNotesBackup() {
            activity.runOnUiThread {
                try {
                    val notesDir = File(activity.filesDir, "spen_notes")
                    if (!notesDir.exists()) {
                        Toast.makeText(activity, "No saved notes found to backup", Toast.LENGTH_SHORT).show()
                        return@runOnUiThread
                    }
                    val files = notesDir.listFiles() ?: arrayOf()
                    val masterBundle = JSONObject()
                    val pagesObj = JSONObject()
                    for (f in files) {
                        if (f.name.endsWith(".json") && f.name != "index.json") {
                            val key = f.name.removeSuffix(".json")
                            try {
                                pagesObj.put(key, JSONObject(f.readText(Charsets.UTF_8)))
                            } catch (_: Exception) {}
                        }
                    }
                    val indexFile = File(notesDir, "index.json")
                    val indexData = if (indexFile.exists()) {
                        try { JSONArray(indexFile.readText(Charsets.UTF_8)) } catch (_: Exception) { JSONArray() }
                    } else JSONArray()

                    masterBundle.put("version", 2)
                    masterBundle.put("exportTime", System.currentTimeMillis())
                    masterBundle.put("index", indexData)
                    masterBundle.put("pages", pagesObj)

                    val exportDir = File(activity.cacheDir, "exports")
                    if (!exportDir.exists()) exportDir.mkdirs()
                    val exportFile = File(exportDir, "MakeLawEasy_MasterNotes_Backup.mle-notes")
                    exportFile.writeText(masterBundle.toString(2), Charsets.UTF_8)

                    val uri = FileProvider.getUriForFile(activity, "${activity.packageName}.fileprovider", exportFile)
                    val shareIntent = Intent(Intent.ACTION_SEND).apply {
                        type = "application/octet-stream"
                        putExtra(Intent.EXTRA_STREAM, uri)
                        putExtra(Intent.EXTRA_SUBJECT, "Make Law Easy - Master Notes Backup")
                        addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
                    }
                    activity.startActivity(Intent.createChooser(shareIntent, "Backup Master Notes"))
                } catch (e: Exception) {
                    Toast.makeText(activity, "Backup export failed: ${e.message}", Toast.LENGTH_SHORT).show()
                }
            }
        }

        @android.webkit.JavascriptInterface
        fun importMasterNotesBackup(jsonString: String): Boolean {
            return try {
                val root = JSONObject(jsonString)
                val pages = root.optJSONObject("pages") ?: return false
                val index = root.optJSONArray("index") ?: JSONArray()
                val notesDir = File(activity.filesDir, "spen_notes")
                if (!notesDir.exists()) notesDir.mkdirs()

                val keys = pages.keys()
                while (keys.hasNext()) {
                    val key = keys.next()
                    val pageObj = pages.getJSONObject(key)
                    val file = File(notesDir, "$key.json")
                    file.writeText(pageObj.toString(), Charsets.UTF_8)
                }
                val indexFile = File(notesDir, "index.json")
                indexFile.writeText(index.toString(), Charsets.UTF_8)
                true
            } catch (_: Exception) {
                false
            }
        }
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
                injectSpenSuite(view)
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

    private fun injectSpenSuite(view: WebView?) {
        try {
            val cssText = assets.open("css/spen_notes.css").bufferedReader().use { it.readText() }
            val jsText = assets.open("js/spen_notes_engine.js").bufferedReader().use { it.readText() }

            val quotedCss = JSONObject.quote(cssText)
            val quotedJs = JSONObject.quote(jsText)

            val injectScript = """
                (function() {
                    try {
                        if (!document.getElementById('spenSuiteStyles')) {
                            var style = document.createElement('style');
                            style.id = 'spenSuiteStyles';
                            style.textContent = $quotedCss;
                            document.head.appendChild(style);
                        }
                        if (!window.__SPEN_ENGINE_INITIALIZED__) {
                            var script = document.createElement('script');
                            script.id = 'spenEngineScript';
                            script.textContent = $quotedJs;
                            document.body.appendChild(script);
                        }
                    } catch(e) {
                        console.error('SPen injection error:', e);
                    }
                })();
            """.trimIndent()
            view?.evaluateJavascript(injectScript, null)
        } catch (e: Exception) {
            e.printStackTrace()
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

    override fun dispatchGenericMotionEvent(event: android.view.MotionEvent): Boolean {
        try {
            if (event.source and InputDevice.SOURCE_CLASS_POINTER != 0) {
                val isStylus = event.getToolType(0) == android.view.MotionEvent.TOOL_TYPE_STYLUS
                if (isStylus) {
                    if (event.action == android.view.MotionEvent.ACTION_HOVER_MOVE ||
                        event.action == android.view.MotionEvent.ACTION_HOVER_ENTER
                    ) {
                        val density = resources.displayMetrics.density
                        val x = event.x / density
                        val y = event.y / density
                        val isButtonPressed = event.isButtonPressed(android.view.MotionEvent.BUTTON_STYLUS_PRIMARY)
                        webView.evaluateJavascript("if(window.__onSpenHover) window.__onSpenHover($x, $y, $isButtonPressed);", null)
                    } else if (event.action == android.view.MotionEvent.ACTION_HOVER_EXIT) {
                        webView.evaluateJavascript("if(window.__onSpenHoverExit) window.__onSpenHoverExit();", null)
                    }
                }
            }
        } catch (_: Exception) {}
        return super.dispatchGenericMotionEvent(event)
    }

    override fun dispatchTouchEvent(event: android.view.MotionEvent): Boolean {
        try {
            val isStylus = event.getToolType(0) == android.view.MotionEvent.TOOL_TYPE_STYLUS
            if (isStylus) {
                val isButtonPressed = event.isButtonPressed(android.view.MotionEvent.BUTTON_STYLUS_PRIMARY)
                webView.evaluateJavascript("if(window.__onSpenButtonState) window.__onSpenButtonState($isButtonPressed);", null)
            }
        } catch (_: Exception) {}
        return super.dispatchTouchEvent(event)
    }

    override fun onDestroy() {
        webView.destroy()
        super.onDestroy()
    }
}
