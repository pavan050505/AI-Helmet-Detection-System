# cd frontend
# npm run dev

# cd backend
# venv\Scripts\activate
# python -m flask run

# ..\.venv\Scripts\python -m flask run
# d:/OGProjects2/helmate-detectation/.venv/Scripts/Activate.ps1

import os
import base64
import datetime
import time
from flask import Flask, request, jsonify, Response
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import func
from services.detection import HelmetDetector
import cv2
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
try:
    from dotenv import load_dotenv
    load_dotenv()
except Exception:
    pass

def create_app():
    app = Flask(__name__)
    db_url = os.getenv("DATABASE_URL", "sqlite:///helmet.db")
    app.config["SQLALCHEMY_DATABASE_URI"] = db_url
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", "change-this")
    app.config["JWT_ACCESS_TOKEN_EXPIRES"] = datetime.timedelta(minutes=15)
    app.config["JWT_REFRESH_TOKEN_EXPIRES"] = datetime.timedelta(days=30)
    CORS(app, supports_credentials=True, resources={
        r"/api/*": {
            "origins": [
                "http://localhost:5173",
                "http://127.0.0.1:5173",
                "http://localhost:5174",
                "http://127.0.0.1:5174",
            ],
            "allow_headers": ["Content-Type", "Authorization"],
            "expose_headers": ["Authorization"]
        },
        r"/stream/*": {
            "origins": [
                "http://localhost:5173",
                "http://127.0.0.1:5173",
                "http://localhost:5174",
                "http://127.0.0.1:5174",
            ]
        }
    })
    db = SQLAlchemy(app)
    jwt = JWTManager(app)

    class User(db.Model):
        __tablename__ = "users"
        id = db.Column(db.Integer, primary_key=True)
        client_id = db.Column(db.String(128), unique=True, nullable=False)
        created_at = db.Column(db.DateTime, server_default=func.now(), nullable=False)

    class AuthUser(db.Model):
        __tablename__ = "auth_users"
        id = db.Column(db.Integer, primary_key=True)
        email = db.Column(db.String(255), unique=True, index=True, nullable=False)
        password_hash = db.Column(db.String(255), nullable=False)
        created_at = db.Column(db.DateTime, server_default=func.now(), nullable=False)

    class Streak(db.Model):
        __tablename__ = "streaks"
        id = db.Column(db.Integer, primary_key=True)
        user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False, unique=True)
        current_streak = db.Column(db.Integer, nullable=False, default=0)
        last_detected_date = db.Column(db.Date, nullable=True)
        total_rewards = db.Column(db.Integer, nullable=False, default=0)

    class DetectionLog(db.Model):
        __tablename__ = "detection_logs"
        id = db.Column(db.Integer, primary_key=True)
        user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
        timestamp = db.Column(db.DateTime, server_default=func.now(), nullable=False)
        result = db.Column(db.Boolean, nullable=False)
        confidence = db.Column(db.Float, nullable=False)

    with app.app_context():
        db.create_all()

    detector = HelmetDetector()

    # Global timer state for the demo stream
    timer_state = {
        "accumulated_time": 0.0,
        "running": False,
        "last_request_time": 0.0
    }

    def get_or_create_user(client_id):
        u = User.query.filter_by(client_id=client_id).first()
        if u is None:
            u = User(client_id=client_id)
            db.session.add(u)
            db.session.commit()
            s = Streak(user_id=u.id, current_streak=0, last_detected_date=None, total_rewards=0)
            db.session.add(s)
            db.session.commit()
        return u

    def update_streak(user_id, helmet_on):
        s = Streak.query.filter_by(user_id=user_id).first()
        today = datetime.date.today()
        if helmet_on:
            if s.last_detected_date == today:
                pass
            else:
                if s.last_detected_date == today - datetime.timedelta(days=1):
                    s.current_streak += 1
                else:
                    s.current_streak = 1
                s.last_detected_date = today
                reward = 0
                if s.current_streak in [3, 7, 30]:
                    reward = 10 if s.current_streak == 3 else 25 if s.current_streak == 7 else 100
                    s.total_rewards += reward
                db.session.commit()
                return {"streak": s.current_streak, "reward": reward}
        return {"streak": s.current_streak, "reward": 0}

    def generate_demo_stream():
        cap = cv2.VideoCapture(0)
        # Reset timer on new stream connection (optional, or keep persistent)
        timer_state["accumulated_time"] = 0.0
        timer_state["running"] = False
        last_time = time.time()

        try:
            while True:
                ok, frame = cap.read()
                if not ok:
                    break

                current_time = time.time()
                dt = current_time - last_time
                last_time = current_time

                ok2, buf = cv2.imencode(".jpg", frame, [cv2.IMWRITE_JPEG_QUALITY, 92])
                if not ok2:
                    continue
                img_bytes = buf.tobytes()
                result = detector.detect(img_bytes)
                boxes = result.get("boxes", [])

                helmet_count = sum(1 for b in boxes if b.get("is_helmet"))
                no_helmet_count = sum(1 for b in boxes if not b.get("is_helmet"))

                if helmet_count > 0 and no_helmet_count == 0:
                    timer_state["running"] = True
                else:
                    timer_state["running"] = False

                if timer_state["running"]:
                    timer_state["accumulated_time"] += dt

                minutes = int(timer_state["accumulated_time"] // 60)
                seconds = int(timer_state["accumulated_time"] % 60)
                timer_text = f"Time: {minutes:02}:{seconds:02}"
                
                # Display timer in top-left
                cv2.putText(frame, timer_text, (20, 50), cv2.FONT_HERSHEY_SIMPLEX, 1.0, (255, 255, 0), 2, cv2.LINE_AA)

                for b in boxes:
                    x, y, w, h = b["x"], b["y"], b["w"], b["h"]
                    is_helmet = b.get("is_helmet", False)
                    conf = int((b.get("confidence", 0.0)) * 100)
                    color = (34, 197, 94) if is_helmet else (239, 68, 68)
                    label = b.get("label") or ("Helmet Detected" if is_helmet else "Wear the Helmet")
                    cv2.rectangle(frame, (x, y), (x + w, y + h), color, 2)
                    text = f"{label} {conf}%"
                    (tw, th), _ = cv2.getTextSize(text, cv2.FONT_HERSHEY_SIMPLEX, 0.6, 2)
                    ly = max(0, y - th - 6)
                    cv2.rectangle(frame, (x, ly), (x + tw + 10, ly + th + 8), color, -1)
                    cv2.putText(frame, text, (x + 5, ly + th + 2), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 2, cv2.LINE_AA)
                ok3, jpg = cv2.imencode(".jpg", frame, [cv2.IMWRITE_JPEG_QUALITY, 85])
                if not ok3:
                    continue
                yield (b"--frame\r\nContent-Type: image/jpeg\r\n\r\n" + jpg.tobytes() + b"\r\n")
        finally:
            cap.release()

    @app.get("/api/demo_stream")
    def api_demo_stream():
        return Response(generate_demo_stream(), mimetype="multipart/x-mixed-replace; boundary=frame")

    @app.get("/api/timer_status")
    def api_timer_status():
        return jsonify(timer_state)

    @app.post("/api/timer/control")
    def api_timer_control():
        data = request.get_json(silent=True) or {}
        action = data.get("action")
        if action == "stop":
            timer_state["running"] = False
        elif action == "start":
            timer_state["running"] = True
            timer_state["last_request_time"] = time.time()
        elif action == "reset":
            timer_state["accumulated_time"] = 0.0
            timer_state["running"] = False
        return jsonify(timer_state)

    @app.post("/api/auth/signup")
    def api_auth_signup():
        data = request.get_json(silent=True) or {}
        email = (data.get("email") or "").strip().lower()
        password = data.get("password") or ""
        if not email or not password:
            return jsonify({"error": "email and password required"}), 400
        if len(password) < 6:
            return jsonify({"error": "weak password"}), 400
        if AuthUser.query.filter_by(email=email).first():
            return jsonify({"error": "email already exists"}), 409
        pw_hash = generate_password_hash(password)
        u = AuthUser(email=email, password_hash=pw_hash)
        db.session.add(u)
        db.session.commit()
        return jsonify({"message": "account_created"}), 201

    @app.post("/api/auth/login")
    def api_auth_login():
        data = request.get_json(silent=True) or {}
        email = (data.get("email") or "").strip().lower()
        password = data.get("password") or ""
        if not email or not password:
            return jsonify({"error": "email and password required"}), 400
        u = AuthUser.query.filter_by(email=email).first()
        if not u or not check_password_hash(u.password_hash, password):
            return jsonify({"error": "invalid credentials"}), 401
        token = create_access_token(identity=str(u.id), additional_claims={"email": u.email})
        return jsonify({"token": token, "user": {"id": u.id, "email": u.email}})

    @app.get("/api/auth/me")
    @jwt_required()
    def api_auth_me():
        uid = get_jwt_identity()
        u = AuthUser.query.get(int(uid))
        if not u:
            return jsonify({"error": "not found"}), 404
        return jsonify({"id": u.id, "email": u.email, "created_at": u.created_at.isoformat()})

    @app.post("/api/user")
    def api_user():
        data = request.get_json(silent=True) or {}
        client_id = data.get("client_id")
        if not client_id:
            return jsonify({"error": "client_id required"}), 400
        u = get_or_create_user(client_id)
        s = Streak.query.filter_by(user_id=u.id).first()
        return jsonify({"user_id": u.id, "client_id": u.client_id, "streak": s.current_streak, "last_detected_date": str(s.last_detected_date) if s.last_detected_date else None, "total_rewards": s.total_rewards})

    @app.get("/api/streak")
    def api_streak():
        client_id = request.args.get("client_id")
        if not client_id:
            return jsonify({"error": "client_id required"}), 400
        u = get_or_create_user(client_id)
        s = Streak.query.filter_by(user_id=u.id).first()
        return jsonify({"streak": s.current_streak, "last_detected_date": str(s.last_detected_date) if s.last_detected_date else None, "total_rewards": s.total_rewards})

    @app.get("/api/history")
    def api_history():
        client_id = request.args.get("client_id")
        if not client_id:
            return jsonify({"error": "client_id required"}), 400
        u = get_or_create_user(client_id)
        since = datetime.datetime.utcnow() - datetime.timedelta(days=30)
        logs = DetectionLog.query.filter(DetectionLog.user_id == u.id, DetectionLog.timestamp >= since).order_by(DetectionLog.timestamp.asc()).all()
        items = [{"timestamp": l.timestamp.isoformat(), "result": l.result, "confidence": l.confidence} for l in logs]
        return jsonify({"items": items})

    @app.post("/api/detect")
    @jwt_required()
    def api_detect():
        payload = request.get_json(silent=True) or {}
        data_url = payload.get("image")
        client_id = payload.get("client_id")
        if not data_url or not client_id:
            return jsonify({"error": "image and client_id required"}), 400
        try:
            header, b64 = data_url.split(",", 1)
            img_bytes = base64.b64decode(b64)
        except Exception:
            return jsonify({"error": "invalid image"}), 400
        
        # detector.detect now returns a dict {helmet, confidence, image}
        result = detector.detect(img_bytes)
        helmet_on = result["helmet"]
        confidence = result["confidence"]
        
        u = get_or_create_user(client_id)
        log = DetectionLog(user_id=u.id, result=helmet_on, confidence=confidence)
        db.session.add(log)
        db.session.commit()

        # Update timer state
        current_time = time.time()
        if helmet_on:
            if timer_state["running"]:
                # Calculate delta, but limit it to avoid huge jumps if connection lost
                dt = current_time - timer_state["last_request_time"]
                # Assume max 2 seconds gap for continuous detection
                if 0 < dt < 2.0:
                    timer_state["accumulated_time"] += dt
            else:
                timer_state["running"] = True
            timer_state["last_request_time"] = current_time
        else:
            timer_state["running"] = False

        streak_info = update_streak(u.id, helmet_on)
        return jsonify({"helmet": helmet_on, "confidence": confidence, "streak": streak_info["streak"], "reward": streak_info["reward"], "boxes": result.get("boxes", [])})

    @app.get("/api/health")
    def api_health():
        return jsonify({"status": "ok"})

    # from stream import stream_bp
    # app.register_blueprint(stream_bp)
    return app

app = create_app()

if __name__ == "__main__":
    app.run(debug=True, port=5000)
