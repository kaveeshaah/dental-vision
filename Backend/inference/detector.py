import logging
import numpy as np
from ultralytics import YOLO

from config import YOLO_MODEL_PATH, YOLO_CONF_THRESHOLD

logger = logging.getLogger(__name__)

DISEASE_CLASS_IDS = {
    0: "Caries",
    6: "Missing_Teeth",
    7: "Periapical_Lesion",
    11: "Impacted_Tooth",
    13: "Bone_Loss",
}

if not YOLO_MODEL_PATH.exists():
    raise FileNotFoundError(
        f"YOLO model not found at {YOLO_MODEL_PATH}. "
        f"Check YOLO_MODEL_PATH in your .env file."
    )

_model = YOLO(str(YOLO_MODEL_PATH))

logger.info(f"Loaded YOLO model from {YOLO_MODEL_PATH}")
logger.info(f"YOLO task: {_model.task}")
if _model.task != "segment":
    logger.warning(
        f"Expected YOLO task 'segment' but got '{_model.task}' -- "
        f"confirm this is the correct model file."
    )


def run_detection(image_bgr: np.ndarray, conf_threshold: float = None) -> list:
    """
    Run YOLO segmentation on a full OPG image.

    Returns a list of dicts:
        {"bbox": [x1, y1, x2, y2], "det_confidence": float,
         "yolo_class_id": int, "yolo_class_name": str, "mask": np.ndarray | None}

    Detections below conf_threshold, or outside the 5 disease classes,
    are dropped here -- before they ever reach the classifier.
    """
    threshold = conf_threshold if conf_threshold is not None else YOLO_CONF_THRESHOLD

    results = _model.predict(image_bgr, conf=threshold, verbose=False)

    detections = []
    if not results:
        return detections

    result = results[0]

    if result.boxes is None or len(result.boxes) == 0:
        return detections

    boxes = result.boxes.xyxy.cpu().numpy()
    confidences = result.boxes.conf.cpu().numpy()
    class_ids = result.boxes.cls.cpu().numpy().astype(int)

    masks = None
    if result.masks is not None:
        masks = result.masks.data.cpu().numpy()

    skipped_non_disease = 0
    for i in range(len(boxes)):
        cls_id = int(class_ids[i])

        if cls_id not in DISEASE_CLASS_IDS:
            skipped_non_disease += 1
            continue

        detections.append({
            "bbox": boxes[i].tolist(),
            "det_confidence": float(confidences[i]),
            "yolo_class_id": cls_id,
            "yolo_class_name": DISEASE_CLASS_IDS[cls_id],
            "mask": masks[i] if masks is not None else None,
        })

    if skipped_non_disease > 0:
        logger.info(f"Filtered out {skipped_non_disease} non-disease detection(s) "
                     f"(fillings, crowns, implants, etc. -- not disease findings)")

    return detections


def health_check() -> dict:
    return {
        "loaded": _model is not None,
        "model_path": str(YOLO_MODEL_PATH),
        "task": _model.task,
    }