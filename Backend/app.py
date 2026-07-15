"""
DentalVision Flask backend entrypoint.
"""
import logging

from flask import Flask
from flask_cors import CORS

from config import (
    ALLOWED_ORIGINS,
    MAX_CONTENT_LENGTH,
    SQLALCHEMY_DATABASE_URI,
    JWT_SECRET_KEY,
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

    CORS(app, origins=ALLOWED_ORIGINS)

    db.init_app(app)
    jwt.init_app(app)

    with app.app_context():
        from models.user import User  # noqa: F401 -- registers model with SQLAlchemy
        db.create_all()  # creates the users table if it doesn't exist yet

    logger.info("Loading models...")
    from inference import detector, classifier  # noqa: F401
    logger.info("Models loaded successfully.")

    from routes.predict import predict_bp
    from routes.health import health_bp
    from routes.auth import auth_bp

    app.register_blueprint(predict_bp)
    app.register_blueprint(health_bp)
    app.register_blueprint(auth_bp)

    return app


app = create_app()

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True, threaded=False)