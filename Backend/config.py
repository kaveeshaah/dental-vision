import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent

# --- Model paths ---------------------------------------------------------
YOLO_MODEL_PATH = Path(os.getenv("YOLO_MODEL_PATH", BASE_DIR / "models" / "best.pt"))
CLASSIFIER_MODEL_PATH = Path(
    os.getenv("CLASSIFIER_MODEL_PATH", BASE_DIR / "models" / "best_model.keras")
)

YOLO_CONF_THRESHOLD = float(os.getenv("YOLO_CONF_THRESHOLD", 0.25))
CLASSIFIER_CONF_THRESHOLD = float(os.getenv("CLASSIFIER_CONF_THRESHOLD", 0.5))

IMG_SIZE = (224, 224)

CLASS_NAMES = {
    0: "Bone_Loss",
    1: "Caries",
    2: "Impacted_Tooth",
    3: "Missing_Teeth",
    4: "Periapical_Lesion",
}

# --- CORS ------------------------------------------------------------------
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173").split(",")

MAX_CONTENT_LENGTH_MB = int(os.getenv("MAX_CONTENT_LENGTH_MB", 20))
MAX_CONTENT_LENGTH = MAX_CONTENT_LENGTH_MB * 1024 * 1024

ALLOWED_EXTENSIONS = {"jpg", "jpeg", "png"}

# --- Database ---------------------------------------------------------
SQLALCHEMY_DATABASE_URI = os.getenv(
    "DATABASE_URL", "postgresql://postgres:CHANGE_ME@localhost:5432/dentalvision"
)
SQLALCHEMY_TRACK_MODIFICATIONS = False

# --- Auth --------------------------------------------------------------
JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "dev-secret-change-this")
