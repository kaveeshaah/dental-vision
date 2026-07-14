import logging

from flask import Flask
from flask_cors import CORS

from config import ALLOWED_ORIGINS, MAX_CONTENT_LENGTH

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger(__name__)


def create_app() -> Flask:
    app = Flask(__name__)
    app.config["MAX_CONTENT_LENGTH"] = MAX_CONTENT_LENGTH

    CORS(app, origins=ALLOWED_ORIGINS)
    logger.info("Loading models...")
    from inference import detector, classifier  # noqa: F401
    logger.info("Models loaded successfully.")

    from routes.predict import predict_bp
    from routes.health import health_bp

    app.register_blueprint(predict_bp)
    app.register_blueprint(health_bp)

    return app


app = create_app()

if __name__ == "__main__":
    
    app.run(host="0.0.0.0", port=5000, debug=True, threaded=False)
