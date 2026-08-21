from datetime import datetime, timezone

from extensions import db

class Report(db.Model):
    __tablename__ = "reports"

    id = db.Column(db.Integer, primary_key=True)
    patient_id = db.Column(db.Integer, db.ForeignKey("patients.id"), nullable=False)
    image_id = db.Column(db.String(100), nullable=True)
    findings = db.Column(db.JSON, nullable=False) # Will store the prediction summary
    created_at = db.Column(
        db.DateTime, default=lambda: datetime.now(timezone.utc)
    )

    def to_dict(self):
        return {
            "id": self.id,
            "patient_id": self.patient_id,
            "image_id": self.image_id,
            "findings": self.findings,
            "created_at": self.created_at.isoformat(),
        }
