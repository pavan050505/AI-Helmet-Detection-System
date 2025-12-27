import base64
from flask import Blueprint, request, jsonify
from services.detection import HelmetDetector

stream_bp = Blueprint("stream", __name__, url_prefix="/stream")

try:
    import cv2
    import numpy as np
except Exception:
    cv2 = None
    np = None

@stream_bp.get("/health")
def health():
    return jsonify({"status": "ok"})

@stream_bp.post("/frame")
def frame():
    payload = request.get_json(silent=True) or {}
    data_url = payload.get("image")
    if not data_url or "," not in data_url:
        return jsonify({"error": "image data_url required"}), 400
    header, b64 = data_url.split(",", 1)
    img_bytes = base64.b64decode(b64)
    if cv2 is not None and np is not None:
        arr = np.frombuffer(img_bytes, dtype=np.uint8)
        bgr = cv2.imdecode(arr, cv2.IMREAD_COLOR)
        if bgr is None:
            return jsonify({"error": "invalid image"}), 400
        ok, enc = cv2.imencode(".jpg", bgr)
        if not ok:
            return jsonify({"error": "encode failed"}), 500
        out_b64 = base64.b64encode(enc.tobytes()).decode("utf-8")
        echo = "data:image/jpeg;base64," + out_b64
        return jsonify({"echo": echo})
    return jsonify({"echo": data_url})

_detector = None

@stream_bp.post("/detect")
def detect():
    global _detector
    if _detector is None:
        _detector = HelmetDetector()
    try:
        payload = request.get_json(silent=True) or {}
        data_url = payload.get("image")
        if not data_url or "," not in data_url:
            return jsonify({"error": "image data_url required"}), 400
        header, b64 = data_url.split(",", 1)
        img_bytes = base64.b64decode(b64)
        
        # Returns {helmet, confidence, boxes}
        result = _detector.detect(img_bytes)
        
        response = {
            "helmet": result["helmet"],
            "confidence": result["confidence"],
            "boxes": result.get("boxes", [])
        }
        return jsonify(response)
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": "internal"}), 500
