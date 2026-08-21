import numpy as np
import cv2


class InvalidImageError(Exception):
    pass


def allowed_file(filename: str, allowed_extensions: set) -> bool:
    if "." not in filename:
        return False
    ext = filename.rsplit(".", 1)[1].lower()
    return ext in allowed_extensions


def decode_image_bytes(file_bytes: bytes) -> np.ndarray:
    np_arr = np.frombuffer(file_bytes, dtype=np.uint8)
    image = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

    if image is None:
        raise InvalidImageError("Could not decode image -- file may be corrupt or an unsupported format.")

    return image


def crop_region(image_bgr: np.ndarray, bbox: list, pad_ratio: float = 0.0) -> np.ndarray:
    
    h, w = image_bgr.shape[:2]
    x1, y1, x2, y2 = bbox

    if pad_ratio > 0:
        bw, bh = x2 - x1, y2 - y1
        x1 -= bw * pad_ratio
        x2 += bw * pad_ratio
        y1 -= bh * pad_ratio
        y2 += bh * pad_ratio

    x1 = int(max(0, x1))
    y1 = int(max(0, y1))
    x2 = int(min(w, x2))
    y2 = int(min(h, y2))

    if x2 <= x1 or y2 <= y1:
        raise InvalidImageError(f"Degenerate crop region from bbox {bbox}")

    return image_bgr[y1:y2, x1:x2]
