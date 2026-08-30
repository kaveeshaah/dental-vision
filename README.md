# DentalVision

AI-Powered Dental Disease Detection and Diagnostic Support System

BSc (Hons) Software Engineering — Final Year Project
ICBT Campus, affiliated with Cardiff Metropolitan University
Author: Milani Kaveesha Kumari (Student ID: 20306071, CL/BSCSD/33/122)
Supervisor: Mr. Priyanga Siriwardhana

---

## Overview

DentalVision analyses panoramic dental X-rays (OPGs) and detects five disease categories using a two-stage, self-contained AI pipeline:

1. **Detection** — YOLOv8 (instance segmentation) locates regions of interest on the uploaded X-ray.
2. **Classification** — EfficientNetB0, trained entirely from scratch (no pretrained weights), assigns each detected region one of five disease labels with a confidence score.

Detected classes: Dental Caries, Missing Teeth, Periapical Lesion, Impacted Tooth, Bone Loss.

The core diagnostic pipeline performs all inference locally, with no third-party AI API dependency. The system separately includes an optional AI chat assistant (see "AI Chat Assistant" below), which does use an external API and is documented as a distinct feature, not part of the diagnostic guarantee above.

---

## Technology Stack

**Machine Learning**
- TensorFlow 2.21.0 / Keras 3.14.1
- Ultralytics YOLOv8 8.4.83
- OpenCV 4.13.0.92

**Backend**
- Flask 3.1.3, organised into Blueprints per resource
- SQLAlchemy ORM
- PostgreSQL (local)
- flask-jwt-extended (JWT authentication)
- bcrypt (password hashing)

**Frontend**
- React 19, Vite, TypeScript
- TailwindCSS v4
- TanStack Query (server state)
- Zustand (`authStore`, `patientStore`)
- Axios
- Recharts (Analytics dashboard)

---

## Setup

### Backend

```bash
cd Backend
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Create a `.env` file in `Backend/` with at minimum:

```
DATABASE_URL=postgresql://<user>:<password>@localhost:5432/dentalvision
JWT_SECRET_KEY=<a real random value — do not leave unset>
YOLO_MODEL_PATH=<path to trained YOLOv8 weights>
CLASSIFIER_MODEL_PATH=<path to trained EfficientNetB0 weights>
GEMINI_API_KEY=<your Gemini API key, required only for the chat assistant>
```

Run the backend:

```bash
python app.py
```

### Frontend

```bash
cd Frontend
npm install
npm run dev
```

---

## Configuration Notes

- `MAX_CONTENT_LENGTH` defaults to 20MB; uploads over this limit are rejected by Flask with a 413 response before reaching the inference pipeline.
- `YOLO_CONF_THRESHOLD` (default 0.2) and `CLASSIFIER_CONF_THRESHOLD` (default 0.5) control detection and classification confidence cutoffs respectively.
- `/predict` responses include a `low_confidence` flag for findings below the classifier threshold.
- `JWT_SECRET_KEY` has a development fallback in `config.py` — this must be overridden with a real value in `.env` before any use beyond local development.

---

## API Endpoints

| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| POST | `/register` | No | Create a doctor account |
| POST | `/login` | No | Authenticate, returns JWT |
| GET | `/health` | No | Confirms API and model availability |
| POST | `/predict` | Yes | Runs detection + classification on an uploaded X-ray; returns findings only, does not persist to the database |
| POST | `/report/save` | Yes | Persists findings from a completed analysis to a patient's record |
| GET | `/report/history/<patient_id>` | Yes | Returns a patient's saved report history |
| POST | `/report` | Yes | Generates and returns a downloadable PDF report |
| GET | `/patients` | Yes | Lists the authenticated doctor's patients |
| POST | `/patients` | Yes | Creates a new patient record |
| DELETE | `/patients/<patient_id>` | Yes | Deletes a patient record; cascades to remove associated reports |
| GET | `/analytics` | Yes | Returns aggregated statistics for the authenticated doctor's patients and scans |
| POST | `/chat` | Yes | Conversational dental guidance via an external AI API (see below) |

`/predict` and `/report/save` are deliberately separate operations: analysis does not automatically persist to a patient's record, so a doctor can review AI-generated findings before committing them.

---

## AI Chat Assistant

`/chat` provides conversational dental guidance, powered by Google Gemini 1.5 Flash.

This is a distinct, optional feature, separate from the core diagnostic pipeline. It is **not** covered by the project's offline-inference guarantee: unlike detection and classification, which run entirely on local model files with no external dependency, the chat assistant calls an external API. This distinction is intentional and documented as such in the project report (see Requirements, FR18 and NFR2).

---

## Database Schema

Three tables, managed via SQLAlchemy:

- **users** — doctor accounts (`id`, `username`, `email`, `password_hash`, `created_at`)
- **patients** — patient records, scoped to a doctor (`id`, `doctor_id` FK, `custom_id`, `full_name`, `age`, `status`, `created_at`)
- **reports** — saved analysis results (`id`, `patient_id` FK, `image_id`, `findings` JSON, `created_at`)

`patient_id` custom identifiers are generated globally unique across the entire table (not per doctor). Deleting a patient cascades to delete their associated reports.

All patient and report queries are scoped to the authenticated doctor's account.

---

## Model Evaluation

Reported metrics (aggregate, all five classes combined):

- Accuracy: 86.05%
- Precision (weighted): 87.07%
- Recall (weighted): 86.05%
- F1-score (weighted): 86.41%


---

## Testing

The system has been tested against structured test cases spanning authentication, patient management, AI detection, report handling, security, database integrity, analytics, and the frontend end-to-end flow. Full test cases and results are documented in the accompanying project report (Chapter 7).

---

## Evaluating This Project

A suggested walkthrough for reviewing the system directly:

1. Register a new account and log in.
2. Create a patient record.
3. Upload a panoramic X-ray and run analysis — review the returned findings (bounding boxes, labels, confidence scores). Note that nothing is saved to the database at this point.
4. Click "Save to Records" to persist the findings against the selected patient.
5. View the patient's report history and download a generated PDF report.
6. Open the Analytics dashboard to view aggregated statistics.
7. Optionally, try the AI chat assistant for a general dental guidance query.

---

## Known Limitations

- Model evaluation is aggregate-only; no per-class precision/recall breakdown.
- Single user role (doctor) — no distinct administrator account.
- No patient-facing access to their own records.
- Runs on Flask's development server, not a production WSGI deployment.
- No formal database backup or migration strategy.
