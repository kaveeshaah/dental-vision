import logging
from collections import Counter

import cv2
import numpy as np

from inference.detector import run_detection
from inference.classifier import classify_crop
from utils.image_utils import crop_region

logger = logging.getLogger(__name__)

DEBUG_SAVE_CROPS = False
DEBUG_CROP_DIR = "debug_crops"


def run_pipeline(image_bgr: np.ndarray) -> dict:
    h, w = image_bgr.shape[:2]

    detections = run_detection(image_bgr)

    if DEBUG_SAVE_CROPS:
        import os
        os.makedirs(DEBUG_CROP_DIR, exist_ok=True)

    predictions = []
    for i, det in enumerate(detections):
        try:
            crop = crop_region(image_bgr, det["bbox"], pad_ratio=0.0)
        except Exception as e:
            logger.warning(f"Skipping detection due to crop error: {e}")
            continue

        classification = classify_crop(crop)

        if DEBUG_SAVE_CROPS:
            ch, cw = crop.shape[:2]
            fname = (f"{DEBUG_CROP_DIR}/crop_{i}_{cw}x{ch}_"
                     f"{classification['label']}_{classification['confidence']:.2f}.jpg")
            cv2.imwrite(fname, crop)
            logger.info(f"Saved debug crop: {fname}")

        predictions.append({
            "bbox": [round(v, 1) for v in det["bbox"]],
            "disease_label": classification["label"],
            "confidence": round(classification["confidence"], 4),
            "detection_confidence": round(det["det_confidence"], 4),
            "low_confidence": classification["low_confidence"],
            "yolo_class_guess": det["yolo_class_name"],
        })

    by_class = Counter(p["disease_label"] for p in predictions)

    return {
        "image_dimensions": {"width": w, "height": h},
        "predictions": predictions,
        "summary": {
            "total_findings": len(predictions),
            "by_class": dict(by_class),
        },
    }