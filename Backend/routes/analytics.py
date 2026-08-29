from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
import json
from collections import defaultdict

from extensions import db
from models.patient import Patient
from models.report import Report

analytics_bp = Blueprint("analytics", __name__, url_prefix="/analytics")

@analytics_bp.route("", methods=["GET"])
@jwt_required()
def get_analytics():
    current_user_id = get_jwt_identity()

    # Total Patients
    total_patients = Patient.query.filter_by(doctor_id=current_user_id).count()

    # Patients list for current doctor
    doctor_patients = Patient.query.filter_by(doctor_id=current_user_id).all()
    patient_ids = [p.id for p in doctor_patients]

    if not patient_ids:
        return jsonify({
            "total_patients": 0,
            "total_scans": 0,
            "disease_distribution": [],
            "age_distribution": [],
            "activity_over_time": [],
            "average_findings": 0
        }), 200

    # Total Scans
    reports = Report.query.filter(Report.patient_id.in_(patient_ids)).all()
    total_scans = len(reports)

    # Age Distribution
    age_groups = {"0-20": 0, "21-40": 0, "41-60": 0, "60+": 0}
    for p in doctor_patients:
        if p.age <= 20:
            age_groups["0-20"] += 1
        elif p.age <= 40:
            age_groups["21-40"] += 1
        elif p.age <= 60:
            age_groups["41-60"] += 1
        else:
            age_groups["60+"] += 1

    # Disease Distribution & Total Findings
    disease_counts = defaultdict(int)
    total_findings_count = 0
    activity = defaultdict(int)

    for r in reports:
        # Activity over time
        date_str = r.created_at.strftime("%Y-%m-%d") if r.created_at else "Unknown"
        activity[date_str] += 1
        
        # Findings processing
        findings = r.findings
        if findings:
            if isinstance(findings, str):
                try:
                    findings = json.loads(findings)
                except:
                    continue
            
            summary = findings.get("summary", {})
            total_findings_count += summary.get("total_findings", 0)
            
            by_class = summary.get("by_class", {})
            for disease, count in by_class.items():
                disease_counts[disease] += count
                
    # Format data for recharts
    disease_distribution = [{"name": k, "value": v} for k, v in disease_counts.items() if v > 0]
    
    age_dist_formatted = [{"name": k, "value": v} for k, v in age_groups.items()]
    
    # Sort activity by date
    activity_formatted = [{"date": k, "scans": v} for k, v in sorted(activity.items())[-30:]] # last 30 active days
    
    avg_findings = round(total_findings_count / total_scans, 1) if total_scans > 0 else 0

    return jsonify({
        "total_patients": total_patients,
        "total_scans": total_scans,
        "disease_distribution": disease_distribution,
        "age_distribution": age_dist_formatted,
        "activity_over_time": activity_formatted,
        "average_findings": avg_findings
    }), 200
