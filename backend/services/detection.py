import os
import cv2
import numpy as np
from ultralytics import YOLO


class HelmetDetector:
    """
    Helmet Detection using custom YOLOv8 model.

    Dataset classes (IMPORTANT):
      0 -> With Helmet
      1 -> Without Helmet
    """

    def __init__(self):
        model_path = os.path.join(
            os.path.dirname(__file__),
            "..", "models", "helmet_yolo.pt"
        )

        if not os.path.exists(model_path):
            raise FileNotFoundError(f"[ERROR] Model not found: {model_path}")

        print(f"[INFO] Loading YOLO model: {model_path}")
        self.model = YOLO(model_path)

        self.face_model = cv2.CascadeClassifier(os.path.join(cv2.data.haarcascades, "haarcascade_frontalface_default.xml"))
        # Normalize model class names once
        self.class_names = {
            idx: name.lower().strip()
            for idx, name in self.model.names.items()
        }

        print("[INFO] Model classes:", self.class_names)

    def preprocess(self, image):
        lab = cv2.cvtColor(image, cv2.COLOR_BGR2LAB)
        l, a, b = cv2.split(lab)
        clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
        cl = clahe.apply(l)
        limg = cv2.merge((cl, a, b))
        return cv2.cvtColor(limg, cv2.COLOR_LAB2BGR)

    def infer(self, image):
        r = self.model(image, conf=0.15, iou=0.45, imgsz=640, verbose=False)[0]
        if len(r.boxes) == 0:
            r = self.model(image, conf=0.08, iou=0.50, imgsz=640, verbose=False)[0]
        if len(r.boxes) == 0:
            r = self.model(image, conf=0.05, iou=0.50, imgsz=960, verbose=False)[0]
        return r

    def detect(self, img_bytes):
        """
        Detect helmet from image bytes.
        Returns:
        {
          helmet: bool,
          confidence: float,
          boxes: list
        }
        """

        # -------------------------------
        # Decode image
        # -------------------------------
        img_array = np.frombuffer(img_bytes, np.uint8)
        image = cv2.imdecode(img_array, cv2.IMREAD_COLOR)

        if image is None:
            return {"helmet": False, "confidence": 0.0, "boxes": []}

        image_proc = self.preprocess(image)

        result = self.infer(image_proc)

        print(f"[DEBUG] Boxes detected: {len(result.boxes)}")

        boxes = []
        has_helmet = False
        has_no_helmet = False

        # -------------------------------
        # Parse detections
        # -------------------------------
        for box in result.boxes:
            cls_id = int(box.cls[0])
            label = self.class_names.get(cls_id, "unknown")
            conf = float(box.conf[0])
            is_helmet = label == "with helmet"
            is_no_helmet = label == "without helmet"

            if is_helmet:
                has_helmet = True
            if is_no_helmet:
                has_no_helmet = True

            x1, y1, x2, y2 = map(int, box.xyxy[0])

            boxes.append({
                "x": x1,
                "y": y1,
                "w": x2 - x1,
                "h": y2 - y1,
                "label": "With Helmet" if is_helmet else "Without Helmet",
                "confidence": round(conf, 3),
                "is_helmet": is_helmet,
                "color": [34, 197, 94] if is_helmet else [239, 68, 68]
            })

        if len(boxes) == 0:
            gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
            faces = self.face_model.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(60, 60))
            for (x, y, w, h) in faces:
                boxes.append({
                    "x": int(x),
                    "y": int(y),
                    "w": int(w),
                    "h": int(h),
                    "label": "Wear the Helmet",
                    "confidence": 0.5,
                    "is_helmet": False,
                    "color": [239, 68, 68]
                })
                has_no_helmet = True

        # -------------------------------
        # FINAL FRAME DECISION (SAFETY LOGIC)
        # -------------------------------
        if has_no_helmet:
            helmet_detected = False
            confs = [b["confidence"] for b in boxes if not b["is_helmet"]]
            max_conf = max(confs) if confs else 0.0

        elif has_helmet:
            helmet_detected = True
            confs = [b["confidence"] for b in boxes if b["is_helmet"]]
            max_conf = max(confs) if confs else 0.0

        else:
            helmet_detected = False
            max_conf = 0.0

        return {
            "helmet": helmet_detected,
            "confidence": round(max_conf, 3),
            "boxes": boxes
        }
