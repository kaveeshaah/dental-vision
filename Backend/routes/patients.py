from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
import random

from extensions import db
from models.patient import Patient

patients_bp = Blueprint("patients", __name__, url_prefix="/patients")


@patients_bp.route("", methods=["GET"])
@jwt_required()
def get_patients():
    current_user_id = get_jwt_identity()
    patients = Patient.query.filter_by(doctor_id=current_user_id).order_by(Patient.created_at.desc()).all()
    return jsonify([p.to_dict() for p in patients]), 200


@patients_bp.route("/<int:patient_id>", methods=["GET"])
@jwt_required()
def get_patient(patient_id):
    current_user_id = get_jwt_identity()
    patient = Patient.query.filter_by(id=patient_id, doctor_id=current_user_id).first()
    
    if not patient:
        return jsonify({"error": "Patient not found"}), 404
        
    return jsonify(patient.to_dict()), 200


@patients_bp.route("", methods=["POST"])
@jwt_required()
def create_patient():
    current_user_id = get_jwt_identity()
    data = request.get_json()
    
    full_name = data.get("full_name")
    age = data.get("age")
    custom_id = data.get("custom_id")
    status = data.get("status", "Needs Review")
    
    if not full_name or not age:
        return jsonify({"error": "Missing required fields (full_name, age)"}), 400
        
    if not custom_id:
        last_patient = Patient.query.filter_by(doctor_id=current_user_id).order_by(Patient.id.desc()).first()
        if last_patient and last_patient.custom_id and last_patient.custom_id.startswith("PT-"):
            try:
                last_num = int(last_patient.custom_id.split("-")[1])
                custom_id = f"PT-{last_num + 1}"
            except (ValueError, IndexError):
                custom_id = f"PT-{last_patient.id + 1000}"
        else:
            custom_id = "PT-1001"
    try:
        new_patient = Patient(
            doctor_id=current_user_id,
            custom_id=custom_id,
            full_name=full_name,
            age=int(age),
            status=status
        )
        db.session.add(new_patient)
        db.session.commit()
        return jsonify(new_patient.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


@patients_bp.route("/<int:patient_id>", methods=["DELETE"])
@jwt_required()
def delete_patient(patient_id):
    current_user_id = get_jwt_identity()
    patient = Patient.query.filter_by(id=patient_id, doctor_id=current_user_id).first()
    
    if not patient:
        return jsonify({"error": "Patient not found or unauthorized"}), 404
        
    try:
        db.session.delete(patient)
        db.session.commit()
        return jsonify({"message": "Patient deleted successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
