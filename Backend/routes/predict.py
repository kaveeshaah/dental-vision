import logging
import uuid

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

import os
from flask import send_from_directory
from config import ALLOWED_EXTENSIONS, UPLOAD_FOLDER
from utils.image_utils import decode_image_bytes, allowed_file, InvalidImageError
from inference.pipeline import run_pipeline

logger = logging.getLogger(__name__)
predict_bp = Blueprint("predict", __name__)


@predict_bp.route("/predict", methods=["POST"])
@jwt_required()
def predict():
    current_user_id = get_jwt_identity()

    if "image" not in request.files:
        return jsonify({"error": "No 'image' file field in request."}), 400

    file = request.files["image"]

    if file.filename == "":
        return jsonify({"error": "Empty filename."}), 400

    if not allowed_file(file.filename, ALLOWED_EXTENSIONS):
        return jsonify({
            "error": f"Unsupported file type. Allowed: {sorted(ALLOWED_EXTENSIONS)}"
        }), 400

    try:
        file_bytes = file.read()
        image_bgr = decode_image_bytes(file_bytes)
    except InvalidImageError as e:
        logger.warning(f"Invalid image uploaded: {e}")
        return jsonify({"error": str(e)}), 400

    try:
        result = run_pipeline(image_bgr)
    except Exception:
        logger.exception("Pipeline failed during /predict")
        return jsonify({"error": "Inference failed. Please try again or contact support."}), 500

    file_ext = os.path.splitext(file.filename)[1]
    image_id = f"{uuid.uuid4()}{file_ext}"
    
    filepath = os.path.join(UPLOAD_FOLDER, image_id)
    with open(filepath, "wb") as f:
        f.write(file_bytes)

    result["image_id"] = image_id

    return jsonify(result), 200

@predict_bp.route("/images/<image_id>", methods=["GET"])
@jwt_required()
def get_image(image_id):
    # Verify the file exists
    filepath = os.path.join(UPLOAD_FOLDER, image_id)
    if not os.path.exists(filepath):
        return jsonify({"error": "Image not found"}), 404
        
    return send_from_directory(UPLOAD_FOLDER, image_id)
