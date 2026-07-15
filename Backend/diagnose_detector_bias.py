"""
Diagnostic: check what YOLO (best.pt) actually detects across a sample of
real OPGs, BEFORE the disease-class filter and BEFORE any confidence
threshold is applied. This tells us whether the subtler disease classes
(Caries, Bone_Loss, Periapical_Lesion, Missing_Teeth) are being detected
at all -- just at low confidence -- or are essentially never proposed by
YOLO in the first place.

Run directly: python diagnose_detector_bias.py
"""
import random
import pathlib
from collections import Counter

import cv2
from ultralytics import YOLO

YOLO_MODEL_PATH = pathlib.Path(r"D:\FYP\dental-vision\ML\data\dentaldataset01\best.pt")
TEST_IMAGES_DIR = pathlib.Path(
    r"D:\FYP\dental-vision\ML\data\dentaldataset01\YOLO\test\images"
)
SAMPLE_SIZE = 20

# Same mapping as Backend/inference/detector.py
DISEASE_CLASS_IDS = {
    0: "Caries",
    6: "Missing_Teeth",
    7: "Periapical_Lesion",
    11: "Impacted_Tooth",
    13: "Bone_Loss",
}


def main():
    print(f"Loading {YOLO_MODEL_PATH} ...")
    model = YOLO(str(YOLO_MODEL_PATH))
    print(f"Class names: {model.names}\n")

    all_images = list(TEST_IMAGES_DIR.glob("*.jpg"))
    sample = random.sample(all_images, min(SAMPLE_SIZE, len(all_images)))

    # Very low confidence threshold -- we want to see EVERYTHING YOLO is
    # willing to propose, not just what clears the production 0.25 bar.
    raw_class_counts = Counter()
    raw_class_confidences = {cid: [] for cid in DISEASE_CLASS_IDS}

    # Also track at the real production threshold, for direct comparison.
    filtered_class_counts = Counter()

    for img_path in sample:
        image = cv2.imread(str(img_path))
        results = model.predict(image, conf=0.05, verbose=False)  # very permissive
        result = results[0]

        if result.boxes is None or len(result.boxes) == 0:
            continue

        class_ids = result.boxes.cls.cpu().numpy().astype(int)
        confidences = result.boxes.conf.cpu().numpy()

        for cid, conf in zip(class_ids, confidences):
            cid = int(cid)
            class_name = model.names.get(cid, f"unknown_{cid}")
            raw_class_counts[class_name] += 1

            if cid in DISEASE_CLASS_IDS:
                raw_class_confidences[cid].append(float(conf))
                if conf >= 0.25:  # matches YOLO_CONF_THRESHOLD in config.py
                    filtered_class_counts[DISEASE_CLASS_IDS[cid]] += 1

    print("=" * 65)
    print(f"ALL DETECTIONS at conf>=0.05, ANY class ({len(sample)} images)")
    print("=" * 65)
    for name, count in raw_class_counts.most_common():
        marker = "  <-- disease class" if name in DISEASE_CLASS_IDS.values() else ""
        print(f"  {name:<25s} {count:>4d}{marker}")

    print("\n" + "=" * 65)
    print("DISEASE CLASSES ONLY -- confidence distribution (conf>=0.05)")
    print("=" * 65)
    for cid, name in DISEASE_CLASS_IDS.items():
        confs = raw_class_confidences[cid]
        if not confs:
            print(f"  {name:<20s} 0 detections at ANY confidence >= 0.05")
        else:
            print(f"  {name:<20s} {len(confs):>4d} detections, "
                  f"conf range [{min(confs):.3f} - {max(confs):.3f}], "
                  f"mean {sum(confs)/len(confs):.3f}")

    print("\n" + "=" * 65)
    print(f"DISEASE CLASSES -- what actually survives conf>=0.25 (production threshold)")
    print("=" * 65)
    for name, count in filtered_class_counts.most_common():
        print(f"  {name:<20s} {count:>4d}")

    print("\n" + "=" * 65)
    print("INTERPRETATION")
    print("=" * 65)
    print(
        "If Caries/Bone_Loss/Periapical_Lesion/Missing_Teeth show 0 or very few\n"
        "detections even at conf>=0.05, YOLO itself is essentially never proposing\n"
        "these regions in real full X-rays -- the bottleneck is Stage 1 detection,\n"
        "not the classifier. If they show many detections at low confidence (e.g.\n"
        "0.05-0.20) that just don't clear the 0.25 production threshold, lowering\n"
        "YOLO_CONF_THRESHOLD might surface them -- at some precision cost."
    )


if __name__ == "__main__":
    main()