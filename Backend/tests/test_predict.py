import io
import pathlib

import pytest

from app import app as flask_app
from config import CLASS_NAMES

SAMPLE_IMAGE_PATH = pathlib.Path(__file__).parent / "sample_opg.jpg"


@pytest.fixture
def client():
    flask_app.config["TESTING"] = True
    with flask_app.test_client() as client:
        yield client


def test_health(client):
    resp = client.get("/health")
    assert resp.status_code == 200
    data = resp.get_json()
    assert data["ready"] is True


@pytest.mark.skipif(not SAMPLE_IMAGE_PATH.exists(), reason="No sample OPG image provided")
def test_predict_valid_image(client):
    with open(SAMPLE_IMAGE_PATH, "rb") as f:
        data = {"image": (io.BytesIO(f.read()), "sample_opg.jpg")}
        resp = client.post("/predict", data=data, content_type="multipart/form-data")

    assert resp.status_code == 200
    body = resp.get_json()

    assert "predictions" in body
    assert "summary" in body
    assert isinstance(body["predictions"], list)

    for pred in body["predictions"]:
        assert pred["disease_label"] in CLASS_NAMES.values()
        assert 0.0 <= pred["confidence"] <= 1.0
        assert len(pred["bbox"]) == 4


def test_predict_no_file(client):
    resp = client.post("/predict", data={}, content_type="multipart/form-data")
    assert resp.status_code == 400


def test_predict_invalid_file_type(client):
    data = {"image": (io.BytesIO(b"not an image"), "notes.txt")}
    resp = client.post("/predict", data=data, content_type="multipart/form-data")
    assert resp.status_code == 400
