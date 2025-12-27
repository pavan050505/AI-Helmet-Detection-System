from ultralytics import YOLO

def main():
    model = YOLO("yolov8n.pt")  # base pretrained model

    model.train(
        data="datasets/helmet/data.yaml",
        epochs=100,          # MORE LEARNING
        imgsz=640,
        batch=16,            # better gradients
        patience=20,         # early stopping
        hsv_h=0.015,
        hsv_s=0.7,
        hsv_v=0.4,
        degrees=10,
        translate=0.1,
        scale=0.5,
        fliplr=0.5,
        device="cpu"
    )

if __name__ == "__main__":
    main()

