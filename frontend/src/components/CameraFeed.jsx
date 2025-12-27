import React, { useEffect, useRef, useState } from "react"

export default function CameraFeed({ apiOrigin, clientId, onResult }) {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const overlayRef = useRef(null) // Added overlay ref
  const [running, setRunning] = useState(false)
  const [helmet, setHelmet] = useState(null)
  const [confidence, setConfidence] = useState(0)

  useEffect(() => {
    let stream
    const start = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" }, audio: false })
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          await videoRef.current.play()
        }
      } catch (e) {
        console.error("Camera start error:", e)
        setRunning(false)
      }
    }
    if (running) {
        start()
    } else {
        if (videoRef.current) videoRef.current.srcObject = null
    }
    return () => {
      if (stream) {
        stream.getTracks().forEach(t => t.stop())
      }
    }
  }, [running])

  useEffect(() => {
    let timer
    if (running && clientId) {
      timer = setInterval(async () => {
        if (!videoRef.current || !canvasRef.current) return
        const v = videoRef.current
        const c = canvasRef.current
        
        // Consistent capture size
        const targetWidth = 640
        const scale = targetWidth / v.videoWidth
        const targetHeight = v.videoHeight * scale
        
        c.width = targetWidth
        c.height = targetHeight
        const ctx = c.getContext("2d")
        ctx.drawImage(v, 0, 0, targetWidth, targetHeight)
        
        const dataUrl = c.toDataURL("image/jpeg", 0.7)
        try {
          const res = await fetch((apiOrigin || "http://127.0.0.1:5000") + "/api/detect", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ image: dataUrl, client_id: clientId })
          })
          const json = await res.json()
          setHelmet(json.helmet)
          setConfidence(json.confidence)
          onResult && onResult(json)

          // Draw boxes
          if (overlayRef.current) {
              const ov = overlayRef.current
              const displayedW = v.clientWidth || v.videoWidth
              const displayedH = v.clientHeight || v.videoHeight
              ov.width = displayedW
              ov.height = displayedH
              
              const oCtx = ov.getContext("2d")
              oCtx.clearRect(0, 0, ov.width, ov.height)
              
              const scaleX = displayedW / targetWidth
              const scaleY = displayedH / targetHeight
              
              const boxes = json.boxes || []
              boxes.forEach(box => {
                const bx = box.x * scaleX
                const by = box.y * scaleY
                const bw = box.w * scaleX
                const bh = box.h * scaleY

                let color = "#ef4444"
                if (box.color) {
                    color = `rgb(${box.color[0]}, ${box.color[1]}, ${box.color[2]})`
                } else {
                    color = box.is_helmet ? "#22c55e" : "#ef4444"
                }

                oCtx.strokeStyle = color
                oCtx.lineWidth = 4
                oCtx.strokeRect(bx, by, bw, bh)

                const text = box.label || (box.is_helmet ? "Helmet Detected" : "Wear the Helmet")
                const confText = `${text} ${Math.round((box.confidence || 0) * 100)}%`
                
                oCtx.font = "bold 16px system-ui, -apple-system, Segoe UI, Roboto, sans-serif"
                const textMetrics = oCtx.measureText(confText)
                const textWidth = textMetrics.width
                const textHeight = 24
                
                const labelY = Math.max(0, by - textHeight)

                oCtx.fillStyle = color
                oCtx.fillRect(bx, labelY, textWidth + 12, textHeight)

                oCtx.fillStyle = "#ffffff"
                oCtx.fillText(confText, bx + 6, labelY + 17)
              })
          }

        } catch (e) {
            console.error("Detect error:", e)
        }
      }, 700)
    }
    return () => {
      if (timer) clearInterval(timer)
    }
  }, [running, clientId, apiOrigin, onResult])

  return (
    <div>
      <div className="relative">
        <video ref={videoRef} className="w-full h-auto block rounded-lg border border-slate-800" muted playsInline />
        <canvas ref={overlayRef} className="absolute inset-0 pointer-events-none w-full h-full" />
        <canvas ref={canvasRef} className="hidden" />
      </div>
      <div className="mt-3 flex items-center justify-between">
        <button
          className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-500 disabled:opacity-50"
          onClick={() => setRunning(v => !v)}
          disabled={!clientId}
        >
          {running ? "Stop" : "Start"}
        </button>
        <div className="text-sm">
          <span className={helmet ? "text-green-400" : helmet === false ? "text-red-400" : "text-slate-400"}>
            {helmet === null ? "Idle" : helmet ? "Helmet On" : "Wear the Helmet"}
          </span>
          <span className="ml-2 text-slate-400">Confidence {Math.round(confidence * 100)}%</span>
        </div>
      </div>
    </div>
  )
}
