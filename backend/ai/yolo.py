import os
import base64
import cv2
import numpy as np

class YoloHelmetDetector:
    def __init__(self):
        self.onnx_path = os.getenv("YOLO_ONNX_PATH")
        self.input_size = int(os.getenv("YOLO_INPUT_SIZE", "640"))
        self.score_th = float(os.getenv("YOLO_SCORE_THRESHOLD", "0.25"))
        self.nms_th = float(os.getenv("YOLO_NMS_THRESHOLD", "0.45"))
        names = os.getenv("YOLO_CLASS_NAMES", "no_helmet,helmet")
        self.class_names = [s.strip() for s in names.split(",") if s.strip()]
        self.net = None
        if self.onnx_path and os.path.exists(self.onnx_path):
            try:
                self.net = cv2.dnn.readNetFromONNX(self.onnx_path)
            except Exception:
                self.net = None

    def _letterbox(self, img, new_shape):
        h, w = img.shape[:2]
        r = min(new_shape[0] / h, new_shape[1] / w)
        new_unpad = (int(round(w * r)), int(round(h * r)))
        dw, dh = new_shape[1] - new_unpad[0], new_shape[0] - new_unpad[1]
        top, bottom = dh // 2, dh - dh // 2
        left, right = dw // 2, dw - dw // 2
        img = cv2.resize(img, new_unpad, interpolation=cv2.INTER_LINEAR)
        img = cv2.copyMakeBorder(img, top, bottom, left, right, cv2.BORDER_CONSTANT, value=(114, 114, 114))
        return img, r, (left, top)

    def _preprocess(self, bgr):
        size = (self.input_size, self.input_size)
        lb, r, pad = self._letterbox(bgr, (size[1], size[0]))
        blob = cv2.dnn.blobFromImage(lb, 1/255.0, size, swapRB=True, crop=False)
        return blob, r, pad, lb.shape[:2]

    def _postprocess_v5(self, out, r, pad, orig_shape):
        if out.ndim == 3 and out.shape[0] == 1:
            out = np.squeeze(out, axis=0)
        boxes = []
        if out.ndim == 2 and out.shape[1] >= 6:
            num = out.shape[0]
            for i in range(num):
                cx, cy, w, h = out[i, 0:4]
                obj = out[i, 4]
                cls_scores = out[i, 5:]
                if cls_scores.size == 0:
                    continue
                cls_id = int(np.argmax(cls_scores))
                cls_score = float(cls_scores[cls_id])
                conf = float(obj * cls_score)
                if conf < self.score_th:
                    continue
                x1 = (cx - w / 2) - pad[0]
                y1 = (cy - h / 2) - pad[1]
                x2 = (cx + w / 2) - pad[0]
                y2 = (cy + h / 2) - pad[1]
                x1 /= r
                y1 /= r
                x2 /= r
                y2 /= r
                x1 = max(0, min(orig_shape[1] - 1, x1))
                y1 = max(0, min(orig_shape[0] - 1, y1))
                x2 = max(0, min(orig_shape[1] - 1, x2))
                y2 = max(0, min(orig_shape[0] - 1, y2))
                boxes.append((int(x1), int(y1), int(x2 - x1), int(y2 - y1), cls_id, conf))
        if not boxes:
            return []
        b = np.array([box[0:4] for box in boxes])
        s = np.array([box[5] for box in boxes])
        idxs = cv2.dnn.NMSBoxes(b.tolist(), s.tolist(), self.score_th, self.nms_th)
        result = []
        if len(idxs) > 0:
            for i in idxs.flatten():
                x, y, w, h, cls_id, conf = boxes[i]
                label = self.class_names[cls_id] if cls_id < len(self.class_names) else str(cls_id)
                result.append({"x": x, "y": y, "w": w, "h": h, "label": label, "confidence": conf})
        return result

    def detect(self, img_bytes):
        arr = np.frombuffer(img_bytes, dtype=np.uint8)
        bgr = cv2.imdecode(arr, cv2.IMREAD_COLOR)
        if bgr is None:
            return {"helmet": False, "confidence": 0.0, "boxes": [], "image": None}
        if self.net is None:
            ok, enc = cv2.imencode(".jpg", bgr)
            img64 = base64.b64encode(enc.tobytes()).decode("utf-8") if ok else ""
            return {"helmet": False, "confidence": 0.0, "boxes": [], "image": "data:image/jpeg;base64," + img64}
        blob, r, pad, lb_shape = self._preprocess(bgr)
        self.net.setInput(blob)
        out = self.net.forward()
        boxes = self._postprocess_v5(out, r, pad, bgr.shape)
        helmet = any(b["label"].lower() == "helmet" for b in boxes)
        conf = max([b["confidence"] for b in boxes], default=0.0)
        draw = bgr.copy()
        for d in boxes:
            x, y, w, h = d["x"], d["y"], d["w"], d["h"]
            cv2.rectangle(draw, (x, y), (x + w, y + h), (0, 200, 255), 2)
            text = f'{d["label"]} {int(d["confidence"]*100)}%'
            cv2.putText(draw, text, (x, y - 6), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 200, 255), 2)
        ok, enc = cv2.imencode(".jpg", draw)
        img64 = base64.b64encode(enc.tobytes()).decode("utf-8") if ok else ""
        return {"helmet": helmet, "confidence": conf, "boxes": boxes, "image": "data:image/jpeg;base64," + img64}
