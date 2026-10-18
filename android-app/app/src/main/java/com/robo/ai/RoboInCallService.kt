package com.robo.ai

import android.telecom.Call
import android.telecom.InCallService
import android.util.Log

class RoboInCallService : InCallService() {
    companion object {
        private const val TAG = "RoboInCallService"
        var onCallActiveListener: (() -> Unit)? = null
        var onCallDisconnectedListener: (() -> Unit)? = null
        var activeCall: Call? = null
    }

    override fun onCallAdded(call: Call) {
        super.onCallAdded(call)
        activeCall = call
        Log.d(TAG, "Call added: $call")
        
        call.registerCallback(object : Call.Callback() {
            override fun onStateChanged(call: Call, state: Int) {
                super.onStateChanged(call, state)
                Log.d(TAG, "Call state changed: $state")
                when (state) {
                    Call.STATE_ACTIVE -> {
                        Log.d(TAG, "Call is answered and ACTIVE!")
                        onCallActiveListener?.invoke()
                    }
                    Call.STATE_DISCONNECTED -> {
                        Log.d(TAG, "Call is DISCONNECTED")
                        onCallDisconnectedListener?.invoke()
                    }
                }
            }
        })
    }

    override fun onCallRemoved(call: Call) {
        super.onCallRemoved(call)
        if (activeCall == call) {
            activeCall = null
        }
    }
}
