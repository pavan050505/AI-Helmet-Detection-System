import os
import cv2
from ultralytics import YOLO

def load_model():
    model_path = os.path.join(os.path.dirname(__file__), "models", "helmet_yolo.pt")
    return YOLO(model_path)

def preprocess(image):
    lab = cv2.cvtColor(image, cv2.COLOR_BGR2LAB)
    l, a, b = cv2.split(lab)
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
    cl = clahe.apply(l)
    limg = cv2.merge((cl, a, b))
    return cv2.cvtColor(limg, cv2.COLOR_LAB2BGR)

def infer(model, image):
    r = model(image, conf=0.15, iou=0.45, imgsz=640, verbose=False)[0]
    if len(r.boxes) == 0:
        r = model(image, conf=0.08, iou=0.50, imgsz=640, verbose=False)[0]
    if len(r.boxes) == 0:
        r = model(image, conf=0.05, iou=0.50, imgsz=960, verbose=False)[0]
    return r

def draw_boxes(image, model, result):
    boxes = []
    for box in result.boxes:
        cls_id = int(box.cls[0])
        label = model.names[cls_id].lower().strip()
        conf = float(box.conf[0])
        is_helmet = label == "with helmet"
        x1, y1, x2, y2 = map(int, box.xyxy[0])
        boxes.append((x1, y1, x2, y2, is_helmet, conf))
    if len(boxes) == 0:
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        face_model = cv2.CascadeClassifier(os.path.join(cv2.data.haarcascades, "haarcascade_frontalface_default.xml"))
        faces = face_model.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(60, 60))
        for (fx, fy, fw, fh) in faces:
            boxes.append((fx, fy, fx+fw, fy+fh, False, 0.5))
    for x1, y1, x2, y2, is_helmet, conf in boxes:
        color = (34, 197, 94) if is_helmet else (239, 68, 68)
        cv2.rectangle(image, (x1, y1), (x2, y2), color, 2)
        text = ("Helmet Detected" if is_helmet else "Wear the Helmet") + f" {int(conf*100)}%"
        tw, th = cv2.getTextSize(text, cv2.FONT_HERSHEY_SIMPLEX, 0.6, 2)[0]
        ly = max(0, y1 - th - 6)
        cv2.rectangle(image, (x1, ly), (x1 + tw + 10, ly + th + 8), color, -1)
        cv2.putText(image, text, (x1 + 5, ly + th + 2), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 2, cv2.LINE_AA)
    return image

def main():
    model = load_model()
    cap = cv2.VideoCapture(0)
    while True:
        ok, frame = cap.read()
        if not ok:
            break
        proc = preprocess(frame)
        result = infer(model, proc)
        out = draw_boxes(frame, model, result)
        cv2.imshow("Helmet Detection Demo", out)
        key = cv2.waitKey(1) & 0xFF
        if key == ord('q'):
            break
    cap.release()
    cv2.destroyAllWindows()

if __name__ == "__main__":
    main()

# python demo_webcam.py