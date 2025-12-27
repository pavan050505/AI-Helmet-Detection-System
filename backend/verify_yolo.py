import os
from ultralytics import YOLO

def verify_model():
    model_path = os.path.join(os.path.dirname(__file__), "models", "helmet_yolo.pt")
    image_path = os.path.join(os.path.dirname(__file__), "datasets", "helmet", "test", "images", "1-13-_jpg.rf.6257f0ced3e375298999a11004fd8948.jpg")

    print(f"Checking model at: {model_path}")
    if not os.path.exists(model_path):
        print("❌ Model file not found!")
        return

    print(f"Checking image at: {image_path}")
    if not os.path.exists(image_path):
        print("❌ Test image not found!")
        return

    try:
        model = YOLO(model_path)
        print("✅ Model loaded successfully.")
        print(f"Classes: {model.names}")

        print("Running inference...")
        results = model(image_path)
        
        for result in results:
            print(f"Boxes detected: {len(result.boxes)}")
            for box in result.boxes:
                cls_id = int(box.cls[0])
                label = model.names[cls_id]
                conf = float(box.conf[0])
                print(f"  - Label: {label}, Confidence: {conf:.4f}, Box: {box.xyxy[0].tolist()}")

    except Exception as e:
        print(f"❌ Error running model: {e}")

if __name__ == "__main__":
    verify_model()
