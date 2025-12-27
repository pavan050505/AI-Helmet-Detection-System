import React, { useEffect, useMemo, useRef, useState } from "react"
import { useAuth } from "../auth/AuthContext.jsx"

export default function WebcamFeed() {
  const videoRef = useRef(null)
  const captureCanvasRef = useRef(null)
  const overlayRef = useRef(null)
  const { token } = useAuth()

  const [running, setRunning] = useState(false)
  const [useServerStream, setUseServerStream] = useState(true)
  const [helmet, setHelmet] = useState(null)
  const [confidence, setConfidence] = useState(0)
  const [error, setError] = useState("")

  const origin = useMemo(
    () => import.meta.env.VITE_API_ORIGIN || "http://127.0.0.1:5000",
    []
  )

  const isProcessing = useRef(false)

  useEffect(() => {
    let stream
    let intervalId

    // Ensure client ID exists
    let clientId = localStorage.getItem("helmet_client_id")
    if (!clientId) {
      clientId = "user_" + Math.random().toString(36).substring(2, 15)
      localStorage.setItem("helmet_client_id", clientId)
    }

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" }, audio: false })
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          await videoRef.current.play()
        }

        // Process frame every 500ms (2 FPS) - Good balance for detection
        intervalId = setInterval(captureFrame, 500)
      } catch (err) {
        console.error("Camera Error:", err)
        setError("Camera permission denied or unavailable")
        setRunning(false)
      }
    }

    const captureFrame = async () => {
      if (useServerStream) return
      if (!running || isProcessing.current) return
      if (!videoRef.current || videoRef.current.readyState !== 4) return

      isProcessing.current = true

      try {
        const video = videoRef.current
        const captureCanvas = captureCanvasRef.current
        const overlay = overlayRef.current

        const vw = video.videoWidth
        const vh = video.videoHeight

        // Set capture canvas to fixed width 640 for consistency with backend
        captureCanvas.width = 640
        captureCanvas.height = Math.round((vh / vw) * 640)

        const ctx = captureCanvas.getContext("2d")
        ctx.drawImage(video, 0, 0, captureCanvas.width, captureCanvas.height)

        const dataUrl = captureCanvas.toDataURL("image/jpeg", 0.92)

        // Debug: Log that we are sending a request
        // console.log("Sending frame to backend...")

        const res = await fetch(origin + "/api/detect", {
          method: "POST",
          headers: { "Content-Type": "application/json", ...(token ? { "Authorization": "Bearer " + token } : {}) },
          body: JSON.stringify({ image: dataUrl, client_id: clientId })
        })

        const json = await res.json()
        
        console.log("Detection response:", json)

        setHelmet(json.helmet)
        setConfidence(json.confidence || 0)

        // -------- DRAW BOXES (DEBUG, NO MIRROR) --------
        const rect = video.getBoundingClientRect()
        overlay.width = Math.round(rect.width)
        overlay.height = Math.round(rect.height)
        
        const octx = overlay.getContext("2d")
        octx.clearRect(0, 0, overlay.width, overlay.height)

        // 🔴 FORCE TEST BOX
        octx.strokeStyle = "lime"
        octx.lineWidth = 6
        octx.strokeRect(50, 50, 200, 200)
        octx.fillStyle = "lime"
        octx.font = "20px Arial"
        octx.fillText("TEST BOX", 50, 40)

        // 🔴 DEBUG BORDER
        octx.strokeStyle = "yellow"
        octx.lineWidth = 4
        octx.strokeRect(10, 10, overlay.width - 20, overlay.height - 20)

        const scaleX = overlay.width / captureCanvas.width
        const scaleY = overlay.height / captureCanvas.height

        const boxes = json.boxes || []
        console.log("Boxes received:", boxes)
        console.log(`Drawing ${boxes.length} boxes`)

        boxes.forEach(box => {
          const x = box.x * scaleX
          const y = box.y * scaleY
          const w = box.w * scaleX
          const h = box.h * scaleY

          const color = box.is_helmet ? "#22c55e" : "#ef4444"

          // Draw box
          octx.strokeStyle = color
          octx.lineWidth = 4
          octx.strokeRect(x, y, w, h)

          // Label
          const text = `${box.label} ${Math.round(box.confidence * 100)}%`
          octx.font = "bold 16px system-ui"
          const tw = octx.measureText(text).width
          const th = 24
          const ly = Math.max(0, y - th)

          octx.fillStyle = color
          octx.fillRect(x, ly, tw + 10, th)

          octx.fillStyle = "#fff"
          octx.fillText(text, x + 5, ly + 17)
        })

        // No mirroring restore during debug

      } catch (e) {
        console.error("Detection Loop Error:", e)
      } finally {
        isProcessing.current = false
      }
    }

    if (running) {
        if (!useServerStream) startCamera()
    } else {
        // Clear overlay when stopped
        if (overlayRef.current) {
            const ctx = overlayRef.current.getContext("2d")
            ctx.clearRect(0, 0, overlayRef.current.width, overlayRef.current.height)
        }
    }

    return () => {
      clearInterval(intervalId)
      if (stream) {
          stream.getTracks().forEach(t => t.stop())
      }
      if (videoRef.current) {
          videoRef.current.srcObject = null
      }
    }
  }, [running, origin])

  const toggleDetection = async () => {
    const willStop = running
    try {
      await fetch(origin + "/api/timer/control", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: willStop ? "stop" : "start" })
      })
    } catch (err) {
      console.error("Failed to update timer:", err)
    }
    setRunning(!running)
    if (willStop) {
      setHelmet(null)
      setConfidence(0)
      if (overlayRef.current) {
        const ctx = overlayRef.current.getContext("2d")
        ctx.clearRect(0, 0, overlayRef.current.width, overlayRef.current.height)
      }
      const media = videoRef.current ? videoRef.current.srcObject : null
      if (media && typeof media.getTracks === "function") {
        media.getTracks().forEach(t => t.stop())
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null
      }
    }
  }

  return (
    <div>
      <div className="relative border border-green-500/30 bg-slate-900/50 rounded-2xl overflow-hidden shadow-[0_0_20px_rgba(34,197,94,0.1)]">
        {/* Scan line effect */}
        {running && (
          <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
            <div className="w-full h-[2px] bg-green-500/50 shadow-[0_0_10px_rgba(34,197,94,0.8)] animate-[scan_2s_linear_infinite]" />
          </div>
        )}
        
        {running && useServerStream ? (
          <img
            src={origin + "/api/demo_stream"}
            alt="Helmet Detection Stream"
            className="w-full h-auto block object-cover"
          />
        ) : (
          <div className="relative aspect-video bg-black/50 flex items-center justify-center">
            <video ref={videoRef} className="w-full h-full object-cover" muted playsInline />
            <canvas ref={overlayRef} className="absolute inset-0 pointer-events-none" />
            <canvas ref={captureCanvasRef} className="hidden" />
            
            {!running && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500 bg-slate-900/80 backdrop-blur-sm">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mb-2 opacity-50"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
                <span className="text-sm font-medium">Camera Feed Inactive</span>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-3 items-center justify-between">
        <div className="flex gap-3">
          <button
            className={`px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg ${
                running 
                ? 'bg-red-500/10 text-red-400 border border-red-500/50 hover:bg-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.2)]' 
                : 'bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white shadow-[0_0_15px_rgba(6,182,212,0.4)] border border-cyan-400/30'
            }`}
            onClick={toggleDetection}
          >
            {running ? "Stop Detection" : "Start Detection"}
          </button>
          <button
            className="px-4 py-2.5 rounded-xl font-medium text-slate-300 bg-slate-800/50 border border-slate-700 hover:bg-slate-700/50 hover:border-slate-600 transition-all"
            onClick={() => setUseServerStream(v => !v)}
          >
            {useServerStream ? "Use Browser Overlay" : "Use Server Stream"}
          </button>
        </div>

        <div className="flex items-center gap-3">
          <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border shadow-lg ${
            helmet === null
              ? "bg-slate-800 text-slate-400 border-slate-700"
              : helmet
                ? "bg-green-500/10 text-green-400 border-green-500/50 shadow-[0_0_10px_rgba(34,197,94,0.2)]"
                : "bg-red-500/10 text-red-400 border-red-500/50 shadow-[0_0_10px_rgba(239,68,68,0.2)]"
          }`}>
            {helmet === null ? "Idle" : helmet ? "Helmet Detected" : "No Helmet"}
          </span>

          {confidence > 0 && (
            <span className="text-xs font-bold text-cyan-400 bg-cyan-900/30 px-2 py-1 rounded border border-cyan-500/30">
              {Math.round(confidence * 100)}%
            </span>
          )}
        </div>
      </div>

      {helmet === false && running && (
        <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-3 animate-pulse shadow-[0_0_20px_rgba(239,68,68,0.1)]">
           <div className="p-2 bg-red-500/20 rounded-full">
             <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
           </div>
           <span className="text-red-200 font-medium">Safety Alert: Please wear a helmet immediately!</span>
        </div>
      )}

      {error && <div className="mt-4 p-4 bg-red-900/50 border border-red-700 rounded-xl text-red-200">{error}</div>}
    </div>
  )
}
