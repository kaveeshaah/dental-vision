
import logging
from flask import Flask
from flask_cors import CORS

from config import (
    ALLOWED_ORIGINS,
    MAX_CONTENT_LENGTH,
    SQLALCHEMY_DATABASE_URI,
    JWT_SECRET_KEY,
    JWT_ACCESS_TOKEN_EXPIRES,
)
from extensions import db, jwt

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger(__name__)


def create_app() -> Flask:
    app = Flask(__name__)
    app.config["MAX_CONTENT_LENGTH"] = MAX_CONTENT_LENGTH
    app.config["SQLALCHEMY_DATABASE_URI"] = SQLALCHEMY_DATABASE_URI
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["JWT_SECRET_KEY"] = JWT_SECRET_KEY
    app.config["JWT_ACCESS_TOKEN_EXPIRES"] = JWT_ACCESS_TOKEN_EXPIRES

    CORS(app, origins=ALLOWED_ORIGINS)

    db.init_app(app)
    jwt.init_app(app)

    with app.app_context():
        from models.user import User 
        from models.patient import Patient  
        from models.report import Report  
        db.create_all()  

    logger.info("Loading models...")
    from inference import detector, classifier  
    logger.info("Models loaded successfully.")

    from routes.predict import predict_bp
    from routes.health import health_bp
    from routes.auth import auth_bp
    from routes.patients import patients_bp
    from routes.report import report_bp
    from routes.chat import chat_bp

    app.register_blueprint(predict_bp)
    app.register_blueprint(health_bp)
    app.register_blueprint(auth_bp)
    app.register_blueprint(patients_bp)
    app.register_blueprint(report_bp)
    app.register_blueprint(chat_bp)

    return app


app = create_app()

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True, threaded=False)