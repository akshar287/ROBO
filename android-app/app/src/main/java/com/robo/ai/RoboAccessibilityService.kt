package com.robo.ai

import android.accessibilityservice.AccessibilityService
import android.util.Log
import android.view.accessibility.AccessibilityEvent
import android.view.accessibility.AccessibilityNodeInfo

class RoboAccessibilityService : AccessibilityService() {
    private val TAG = "RoboAccessibility"

    override fun onAccessibilityEvent(event: AccessibilityEvent?) {
        // Optional user-authorized accessibility handler
        // Can be used to automatically tap Send on WhatsApp if enabled by the user
        if (event == null) return
        val packageName = event.packageName?.toString() ?: ""
        
        if (packageName == "com.whatsapp") {
            val rootNode = rootInActiveWindow ?: return
            // Search for send button by viewId or content description
            val sendNodes = rootNode.findAccessibilityNodeInfosByViewId("com.whatsapp:id/send")
            if (sendNodes.isNotEmpty()) {
                Log.d(TAG, "Found WhatsApp send button. Ready for authorized interaction.")
            }
        }
    }

    override fun onInterrupt() {
        Log.d(TAG, "Accessibility service interrupted.")
    }
}
