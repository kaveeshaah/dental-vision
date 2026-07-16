from flask import Blueprint, jsonify

from inference.detector import health_check as detector_health
from inference.classifier import health_check as classifier_health
from config import YOLO_CONF_THRESHOLD, CLASSIFIER_CONF_THRESHOLD

health_bp = Blueprint("health", __name__)


@health_bp.route("/health", methods=["GET"])
def health():
    try:
        detector_status = detector_health()
        classifier_status = classifier_health()
        ready = detector_status["loaded"] and classifier_status["loaded"]
    except Exception as e:
        return jsonify({"ready": False, "error": str(e)}), 500

    return jsonify({
        "ready": ready,
        "detector": detector_status,
        "classifier": classifier_status,
        "thresholds": {
            "yolo_conf_threshold": YOLO_CONF_THRESHOLD,
            "classifier_conf_threshold": CLASSIFIER_CONF_THRESHOLD,
        },
        "model_accuracy": MODEL_ACCURACY,
    }), 200
