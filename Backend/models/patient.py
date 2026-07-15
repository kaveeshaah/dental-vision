from datetime import datetime, timezone

from extensions import db


class Patient(db.Model):
    __tablename__ = "patients"

    id = db.Column(db.Integer, primary_key=True)
    doctor_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    custom_id = db.Column(db.String(20), nullable=False)
    full_name = db.Column(db.String(150), nullable=False)
    age = db.Column(db.Integer, nullable=False)
    status = db.Column(db.String(50), default="Needs Review")
    created_at = db.Column(
        db.DateTime, default=lambda: datetime.now(timezone.utc)
    )

    def to_dict(self):
        return {
            "id": self.id,
            "custom_id": self.custom_id,
            "full_name": self.full_name,
            "age": self.age,
            "status": self.status,
            "created_at": self.created_at.isoformat(),
        }
