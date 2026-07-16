import io
import datetime
from flask import Blueprint, request, send_file, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.patient import Patient

from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
from reportlab.lib.enums import TA_CENTER, TA_RIGHT

report_bp = Blueprint("report", __name__, url_prefix="/report")

@report_bp.route("", methods=["POST"])
@jwt_required()
def generate_report():
    data = request.get_json()
    if not data or "patient_id" not in data:
        return jsonify({"error": "Missing patient_id in request"}), 400
        
    patient_id = data.get("patient_id")
    current_user_id = get_jwt_identity()
    
    patient = Patient.query.filter_by(id=patient_id, doctor_id=current_user_id).first()
    if not patient:
        return jsonify({"error": "Patient not found or access denied"}), 403

    predictions_data = data.get("data", {})
    summary_data = predictions_data.get("summary", {})
    by_class = summary_data.get("by_class", {})

    buffer = io.BytesIO()
    
    # Setup document
    doc = SimpleDocTemplate(
        buffer, 
        pagesize=letter,
        rightMargin=50, leftMargin=50,
        topMargin=50, bottomMargin=50
    )
    
    styles = getSampleStyleSheet()
    
    # Custom Styles
    title_style = ParagraphStyle(
        'MainTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=24,
        textColor=colors.HexColor("#2C4C3B"), # Moss green
        alignment=TA_CENTER,
        spaceAfter=20
    )
    
    subtitle_style = ParagraphStyle(
        'Subtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        textColor=colors.HexColor("#7F8C8D"),
        alignment=TA_CENTER,
        spaceAfter=30
    )

    section_heading = ParagraphStyle(
        'SectionHeading',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=14,
        textColor=colors.HexColor("#2C4C3B"),
        spaceBefore=20,
        spaceAfter=10
    )
    
    normal_text = styles['Normal']
    normal_text.fontSize = 11
    normal_text.textColor = colors.HexColor("#34495E")

    elements = []
    
    # Header
    elements.append(Paragraph("DENTAL VISION", title_style))
    elements.append(Paragraph(f"AI Diagnostic Analysis Report &bull; Generated {datetime.date.today().strftime('%B %d, %Y')}", subtitle_style))
    elements.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor("#E2E8F0"), spaceAfter=20))
    
    # Patient Info Table
    patient_info_data = [
        [Paragraph("<b>Patient Name:</b>", normal_text), Paragraph(patient.full_name, normal_text), 
         Paragraph("<b>Date of Birth:</b>", normal_text), Paragraph("N/A", normal_text)],
        [Paragraph("<b>Patient ID:</b>", normal_text), Paragraph(patient.custom_id, normal_text),
         Paragraph("<b>Age:</b>", normal_text), Paragraph(str(patient.age), normal_text)],
        [Paragraph("<b>Status:</b>", normal_text), Paragraph(patient.status, normal_text),
         Paragraph("<b>Report ID:</b>", normal_text), Paragraph(predictions_data.get("image_id", "N/A")[:8], normal_text)]
    ]
    
    info_table = Table(patient_info_data, colWidths=[100, 150, 100, 150])
    info_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#F8FAFC")),
        ('PADDING', (0,0), (-1,-1), 8),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#E2E8F0")),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))
    
    elements.append(info_table)
    elements.append(Spacer(1, 20))
    
    # Findings Section
    elements.append(Paragraph("Diagnostic Findings", section_heading))
    
    if by_class and any(count > 0 for count in by_class.values()):
        findings_data = [["Condition", "Detections", "Severity/Note"]]
        
        for condition, count in by_class.items():
            if count > 0:
                formatted_cond = condition.replace("_", " ").title()
                note = "Requires Review" if count > 0 else "Normal"
                findings_data.append([formatted_cond, str(count), note])
                
        # Style the findings table
        findings_table = Table(findings_data, colWidths=[200, 100, 200])
        findings_table.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#2C4C3B")),
            ('TEXTCOLOR', (0,0), (-1,0), colors.white),
            ('ALIGN', (0,0), (-1,-1), 'LEFT'),
            ('ALIGN', (1,0), (1,-1), 'CENTER'),
            ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
            ('FONTSIZE', (0,0), (-1,0), 11),
            ('BOTTOMPADDING', (0,0), (-1,0), 10),
            ('TOPPADDING', (0,0), (-1,0), 10),
            ('BACKGROUND', (0,1), (-1,-1), colors.white),
            ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#E2E8F0")),
            ('FONTNAME', (0,1), (-1,-1), 'Helvetica'),
            ('FONTSIZE', (0,1), (-1,-1), 10),
            ('PADDING', (0,1), (-1,-1), 8),
        ]))
        
        elements.append(findings_table)
    else:
        elements.append(Paragraph("No significant findings detected in this analysis.", normal_text))
        
    elements.append(Spacer(1, 40))
    
    # Disclaimer
    disclaimer_text = """<b>Disclaimer:</b> This report is generated by an Artificial Intelligence model (Dental Vision) 
    and is intended to assist dental professionals in their diagnostic process. It does not constitute a definitive medical 
    diagnosis. All findings must be clinically correlated and verified by a licensed dentist or radiologist."""
    
    disclaimer_style = ParagraphStyle(
        'Disclaimer',
        parent=styles['Normal'],
        fontName='Helvetica-Oblique',
        fontSize=8,
        textColor=colors.HexColor("#7F8C8D"),
        leading=12
    )
    
    elements.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor("#E2E8F0"), spaceAfter=10))
    elements.append(Paragraph(disclaimer_text, disclaimer_style))
    
    # Build PDF
    doc.build(elements)
    
    buffer.seek(0)
    
    return send_file(
        buffer,
        as_attachment=True,
        download_name=f"report_{patient.custom_id}.pdf",
        mimetype="application/pdf"
    )

@report_bp.route("/save", methods=["POST"])
@jwt_required()
def save_report():
    from extensions import db
    from models.report import Report
    
    data = request.get_json()
    if not data or "patient_id" not in data or "data" not in data:
        return jsonify({"error": "Missing patient_id or data in request"}), 400
        
    patient_id = data.get("patient_id")
    current_user_id = get_jwt_identity()
    
    # Verify patient ownership
    patient = Patient.query.filter_by(id=patient_id, doctor_id=current_user_id).first()
    if not patient:
        return jsonify({"error": "Patient not found or access denied"}), 403

    predictions_data = data.get("data", {})
    image_id = predictions_data.get("image_id")
    
    # Create the report record
    new_report = Report(
        patient_id=patient.id,
        image_id=image_id,
        findings=predictions_data
    )
    
    db.session.add(new_report)
    db.session.commit()
    
    return jsonify({"message": "Report saved successfully", "report": new_report.to_dict()}), 201

@report_bp.route("/history/<int:patient_id>", methods=["GET"])
@jwt_required()
def get_report_history(patient_id):
    from models.report import Report
    
    current_user_id = get_jwt_identity()
    
    patient = Patient.query.filter_by(id=patient_id, doctor_id=current_user_id).first()
    if not patient:
        return jsonify({"error": "Patient not found or access denied"}), 403
        
    # Fetch all reports for this patient, ordered by newest first
    reports = Report.query.filter_by(patient_id=patient.id).order_by(Report.created_at.desc()).all()
    
    return jsonify([r.to_dict() for r in reports]), 200

