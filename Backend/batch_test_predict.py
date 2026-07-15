"""
Batch-test the running Flask backend against a random sample of real OPGs,
tally the disease_label distribution across all findings, and compare it
to the dataset's actual natural class proportions -- to check whether
Impacted_Tooth dominance in live predictions is a real skew in the data
or an artifact of small sample size / a systematic model bias.

Requires the backend already running locally (python app.py) before
running this script.

Usage: python batch_test_predict.py
"""
import random
import pathlib
from collections import Counter

import requests

# --- Config -- adjust if your paths differ ---
BACKEND_URL = "http://localhost:5000/predict"
TEST_IMAGES_DIR = pathlib.Path(
    r"D:\FYP\dental-vision\ML\data\dentaldataset01\YOLO\test\images"
)
PROCESSED_TEST_DIR = pathlib.Path(
    r"D:\FYP\dental-vision\ML\data\processed\test"
)
SAMPLE_SIZE = 20


def get_natural_class_proportions():
    """Real crop counts per class in the classifier's actual test set --
    this is the 'ground truth' distribution to compare live results against."""
    counts = {}
    for class_dir in sorted(PROCESSED_TEST_DIR.iterdir()):
        if class_dir.is_dir():
            counts[class_dir.name] = len(list(class_dir.glob("*.jpg")))
    total = sum(counts.values())
    return counts, total


def run_batch_test():
    all_images = list(TEST_IMAGES_DIR.glob("*.jpg"))
    if len(all_images) < SAMPLE_SIZE:
        print(f"Only {len(all_images)} images found, using all of them.")
        sample = all_images
    else:
        sample = random.sample(all_images, SAMPLE_SIZE)

    print(f"Testing {len(sample)} random OPGs against {BACKEND_URL}...\n")

    label_counts = Counter()
    agreement_count = 0
    total_findings = 0
    failed_images = []

    for i, img_path in enumerate(sample, 1):
        try:
            with open(img_path, "rb") as f:
                response = requests.post(
                    BACKEND_URL,
                    files={"image": (img_path.name, f, "image/jpeg")},
                    timeout=60,
                )
            response.raise_for_status()
            data = response.json()
        except Exception as e:
            print(f"  [{i}/{len(sample)}] FAILED: {img_path.name} -- {e}")
            failed_images.append(img_path.name)
            continue

        predictions = data.get("predictions", [])
        print(f"  [{i}/{len(sample)}] {img_path.name}: {len(predictions)} finding(s)")

        for p in predictions:
            label_counts[p["disease_label"]] += 1
            total_findings += 1
            if p.get("disease_label") == p.get("yolo_class_guess"):
                agreement_count += 1

    print("\n" + "=" * 60)
    print(f"LIVE PREDICTION RESULTS  ({len(sample)} images, {total_findings} total findings)")
    print("=" * 60)

    if total_findings == 0:
        print("No findings returned across the whole sample -- check the backend is running.")
        return

    for label, count in label_counts.most_common():
        pct = 100 * count / total_findings
        print(f"  {label:<20s} {count:>4d}  ({pct:5.1f}%)")

    agreement_pct = 100 * agreement_count / total_findings
    print(f"\nClassifier / YOLO class agreement: {agreement_count}/{total_findings} ({agreement_pct:.1f}%)")

    if failed_images:
        print(f"\n{len(failed_images)} image(s) failed to process: {failed_images}")

    # --- Compare against natural dataset proportions ---
    natural_counts, natural_total = get_natural_class_proportions()

    print("\n" + "=" * 60)
    print("NATURAL DATASET PROPORTIONS  (processed/test/ crop counts)")
    print("=" * 60)
    for label, count in sorted(natural_counts.items(), key=lambda x: -x[1]):
        pct = 100 * count / natural_total
        print(f"  {label:<20s} {count:>4d}  ({pct:5.1f}%)")

    print("\n" + "=" * 60)
    print("INTERPRETATION")
    print("=" * 60)
    print(
        "If the live prediction percentages are roughly in line with the natural\n"
        "dataset proportions above, Impacted_Tooth dominance is a real feature of\n"
        "the data (it's genuinely your most common finding), not a model bias.\n"
        "If live predictions show Impacted_Tooth far ABOVE its natural ~53% share\n"
        "while other classes are far BELOW their natural shares, that's worth\n"
        "investigating further as a real skew."
    )


if __name__ == "__main__":
    run_batch_test()