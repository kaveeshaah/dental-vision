import logging
import numpy as np
import cv2
import tensorflow as tf

from config import CLASSIFIER_MODEL_PATH, CLASS_NAMES, IMG_SIZE, CLASSIFIER_CONF_THRESHOLD

logger = logging.getLogger(__name__)

if not CLASSIFIER_MODEL_PATH.exists():
    raise FileNotFoundError(
        f"Classifier model not found at {CLASSIFIER_MODEL_PATH}. "
        f"Check CLASSIFIER_MODEL_PATH in your .env file."
    )

_model = tf.keras.models.load_model(CLASSIFIER_MODEL_PATH)

logger.info(f"Loaded classifier from {CLASSIFIER_MODEL_PATH}")
logger.info(f"Classifier input shape: {_model.input_shape}")
logger.info(f"Classifier output shape: {_model.output_shape}")

_num_classes_in_model = _model.output_shape[-1]
if _num_classes_in_model != len(CLASS_NAMES):
    raise RuntimeError(
        f"Model outputs {_num_classes_in_model} classes but CLASS_NAMES in "
        f"config.py has {len(CLASS_NAMES)} entries -- these must match exactly, "
        f"or every prediction will be silently mislabeled."
    )


def preprocess_crop(crop_bgr: np.ndarray) -> np.ndarray:

    crop_rgb = cv2.cvtColor(crop_bgr, cv2.COLOR_BGR2RGB)
    resized = cv2.resize(crop_rgb, IMG_SIZE, interpolation=cv2.INTER_LINEAR)
    x = resized.astype(np.float32)  
    return np.expand_dims(x, axis=0)


def classify_crop(crop_bgr: np.ndarray, conf_threshold: float = None, det_confidence: float = None) -> dict:

    threshold = conf_threshold if conf_threshold is not None else CLASSIFIER_CONF_THRESHOLD

    x = preprocess_crop(crop_bgr)
    preds = _model.predict(x, verbose=0)[0]

    class_idx = int(np.argmax(preds))
    confidence = float(preds[class_idx])
    label = CLASS_NAMES.get(class_idx, f"UNKNOWN_CLASS_{class_idx}")

    classifier_unsure = confidence < threshold
    detection_weak = det_confidence is not None and det_confidence < 0.3

    return {
        "label": label,
        "confidence": confidence,
        "low_confidence": classifier_unsure or detection_weak,
    }


def health_check() -> dict:
    return {
        "loaded": _model is not None,
        "model_path": str(CLASSIFIER_MODEL_PATH),
        "input_shape": _model.input_shape,
        "num_classes": _num_classes_in_model,
        "class_names": CLASS_NAMES,
    }
