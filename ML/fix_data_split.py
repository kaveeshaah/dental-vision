"""
fix_data_split.py — Rebuild the classifier dataset with a correct patient-level split.

The original split (01_data_prep.ipynb) had two bugs:
  1. train_test_split was called on individual crop files, so crops from the
     same X-ray ended up scattered across partitions within each disease class.
  2. The split was done independently per disease class, so the same X-ray
     could be in 'train' for Bone_Loss but 'valid' for Caries.

Fix:
  Collect ALL unique source X-ray IDs across every disease class.
  Split those IDs ONCE globally (70 / 15 / 15).
  Route every crop to whichever partition its source X-ray belongs to.
  A single panoramic X-ray always ends up in exactly one partition.

Input:   ML/data/all_crops/{disease}/*.jpg
Output:  ML/data/processed/{train|valid|test}/{disease}/*.jpg  (rebuilt)

Run:
    python ML/fix_data_split.py
"""

import pathlib
import shutil
import collections
from sklearn.model_selection import train_test_split

# ── Config ────────────────────────────────────────────────────────────────────
SEED = 42

BASE_DIR  = pathlib.Path(__file__).resolve().parent   # ML/
ALL_CROPS = BASE_DIR / "data" / "all_crops"
OUTPUT    = BASE_DIR / "data" / "processed"

CLASS_NAMES = [
    "Bone_Loss",
    "Caries",
    "Impacted_Tooth",
    "Missing_Teeth",
    "Periapical_Lesion",
]

VALID_RATIO = 0.15
TEST_RATIO  = 0.15

# ── Helper ────────────────────────────────────────────────────────────────────

def xray_stem(crop_stem: str) -> str:
    """
    Strip the trailing _{yolo_split}_{index} to get the source X-ray ID.

    Crop filenames were generated as:
        f"{image_path.stem}_{yolo_split}_{index}.jpg"
    where yolo_split in {"train","valid","test"} and index is an integer.

    rsplit('_', 2) is safe even when the stem contains underscores.

    Examples:
        "hash.rf.deadbeef_train_0"  →  "hash.rf.deadbeef"
        "hash.rf.deadbeef_valid_12" →  "hash.rf.deadbeef"
    """
    parts = crop_stem.rsplit("_", 2)
    return parts[0] if len(parts) == 3 else crop_stem


# ── Main ──────────────────────────────────────────────────────────────────────

def main():
    # ── 1. Wipe and recreate the output tree ──────────────────────────────────
    if OUTPUT.exists():
        shutil.rmtree(OUTPUT)
        print(f"Removed old: {OUTPUT}")

    for split in ("train", "valid", "test"):
        for cls in CLASS_NAMES:
            (OUTPUT / split / cls).mkdir(parents=True, exist_ok=True)

    print(f"Created fresh output at: {OUTPUT}\n")

    # ── 2. Collect ALL crops across ALL diseases, keyed by source X-ray ───────
    # xray_to_crops[xray_id] = [(cls, crop_path), ...]
    xray_to_crops: dict[str, list] = collections.defaultdict(list)

    for cls in CLASS_NAMES:
        src_dir = ALL_CROPS / cls
        if not src_dir.exists():
            print(f"WARNING: {src_dir} not found — skipping")
            continue
        for crop in sorted(src_dir.glob("*.jpg")):
            xid = xray_stem(crop.stem)
            xray_to_crops[xid].append((cls, crop))

    all_xray_ids = sorted(xray_to_crops.keys())
    print(f"Unique source X-rays (all classes combined): {len(all_xray_ids)}\n")

    # ── 3. ONE global split of X-ray IDs ──────────────────────────────────────
    train_ids, temp_ids = train_test_split(
        all_xray_ids,
        test_size=VALID_RATIO + TEST_RATIO,
        random_state=SEED,
        shuffle=True,
    )
    valid_ids, test_ids = train_test_split(
        temp_ids,
        test_size=TEST_RATIO / (VALID_RATIO + TEST_RATIO),
        random_state=SEED,
    )

    partition = (
        {xid: "train" for xid in train_ids}
        | {xid: "valid" for xid in valid_ids}
        | {xid: "test"  for xid in test_ids}
    )

    print(f"X-ray IDs assigned -> train: {len(train_ids)}  valid: {len(valid_ids)}  test: {len(test_ids)}\n")

    # ── 4. Copy crops to the correct partition ─────────────────────────────────
    counts = {cls: {"train": 0, "valid": 0, "test": 0} for cls in CLASS_NAMES}

    for xid, entries in xray_to_crops.items():
        split = partition[xid]
        for cls, crop_path in entries:
            shutil.copy(crop_path, OUTPUT / split / cls / crop_path.name)
            counts[cls][split] += 1

    # ── 5. Per-class breakdown ─────────────────────────────────────────────────
    print(f"{'Disease':25s} {'Train':>7} {'Valid':>7} {'Test':>7} {'Total':>7}")
    print("-" * 58)
    for cls in CLASS_NAMES:
        t  = counts[cls]["train"]
        v  = counts[cls]["valid"]
        ts = counts[cls]["test"]
        print(f"{cls:25s} {t:>7} {v:>7} {ts:>7} {t+v+ts:>7}")

    # ── 6. Leakage check ───────────────────────────────────────────────────────
    print("\nLeakage check (all must be 0):")

    def xray_ids_in(split_name):
        ids = set()
        for cls in CLASS_NAMES:
            for f in (OUTPUT / split_name / cls).glob("*.jpg"):
                ids.add(xray_stem(f.stem))
        return ids

    tr = xray_ids_in("train")
    va = xray_ids_in("valid")
    te = xray_ids_in("test")

    tv = len(tr & va)
    tt = len(tr & te)
    vt = len(va & te)

    print(f"  Train & Valid : {tv}  {'OK' if tv == 0 else 'LEAK'}")
    print(f"  Train & Test  : {tt}  {'OK' if tt == 0 else 'LEAK'}")
    print(f"  Valid & Test  : {vt}  {'OK' if vt == 0 else 'LEAK'}")

    if tv == tt == vt == 0:
        print("\nNo leakage — split is clean.")
        print("Re-run 02_model_train.ipynb (or train_from_scratch.py) now.")
    else:
        print("\nLeakage detected — check xray_stem() logic.")


if __name__ == "__main__":
    main()
