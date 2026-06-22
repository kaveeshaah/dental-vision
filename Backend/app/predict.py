import json
import numpy as np
import tensorflow as tf
from PIL import Image

MODEL_PATH = r"D:\FYP\dental-vision\ML\Models\dental_model_v3_focal.keras"
LABELS_PATH = r"D:\FYP\dental-vision\ML\Models\class_names.json"

model = tf.keras.models.load_model(MODEL_PATH, compile=False)

with open(LABELS_PATH, "r") as f:
    class_names = json.load(f)

img = Image.open(
    r"D:\FYP\dental-vision\ML\data\dentaldataset01\YOLO\train\images\5c63f52f-Keshish_Khachik_70yo_31052021_122056_jpg.rf.ab8fed0195eaeaa23e44a260623b69f9.jpg"
)

img = img.convert("RGB")
img = img.resize((224, 224))

x = np.array(img, dtype=np.float32) / 255.0
x = np.expand_dims(x, axis=0)

preds = model.predict(x, verbose=0)[0]

top_indices = np.argsort(preds)[::-1][:3]

print("\nTop Predictions:")
for i in top_indices:
    print(
        f"{class_names[i]:20s} "
        f"{preds[i]*100:.2f}%"
    )