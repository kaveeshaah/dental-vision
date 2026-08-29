import pathlib
import shutil
import collections
from sklearn.model_selection import train_test_split

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


def xray_stem(crop_stem: str) -> str:
    parts = crop_stem.rsplit("_", 2)
    return parts[0] if len(parts) == 3 else crop_stem


def main():

    if OUTPUT.exists():
        shutil.rmtree(OUTPUT)
        print(f"Removed old: {OUTPUT}")

    for split in ("train", "valid", "test"):
        for cls in CLASS_NAMES:
            (OUTPUT / split / cls).mkdir(parents=True, exist_ok=True)

    print(f"Created fresh output at: {OUTPUT}\n")

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

    counts = {cls: {"train": 0, "valid": 0, "test": 0} for cls in CLASS_NAMES}

    for xid, entries in xray_to_crops.items():
        split = partition[xid]
        for cls, crop_path in entries:
            shutil.copy(crop_path, OUTPUT / split / cls / crop_path.name)
            counts[cls][split] += 1

    print(f"{'Disease':25s} {'Train':>7} {'Valid':>7} {'Test':>7} {'Total':>7}")
    print("-" * 58)
    for cls in CLASS_NAMES:
        t  = counts[cls]["train"]
        v  = counts[cls]["valid"]
        ts = counts[cls]["test"]
        print(f"{cls:25s} {t:>7} {v:>7} {ts:>7} {t+v+ts:>7}")

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
