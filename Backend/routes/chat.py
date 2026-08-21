import json
import logging
import urllib.request
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from config import GEMINI_API_KEY

logger = logging.getLogger(__name__)

chat_bp = Blueprint("chat", __name__, url_prefix="/chat")

SYSTEM_INSTRUCTION = (
    "You are an expert AI dental assistant named 'Dental Vision AI'. "
    "Your sole purpose is to provide professional, accurate information about dental diseases, "
    "treatments, radiology, and oral hygiene. "
    "You are assisting a dentist/radiologist. "
    "If a user asks about anything unrelated to dentistry (e.g., sports, general programming, history), "
    "you must politely decline and remind them you can only assist with dental topics. "
    "Be concise, professional, and do not provide definitive medical diagnoses, only educational information."
)

@chat_bp.route("", methods=["POST"])
@jwt_required()
def chat_endpoint():
    if not GEMINI_API_KEY:
        return jsonify({"error": "Chatbot is not configured on the server (missing API key)."}), 503

    data = request.get_json(silent=True)
    if not data or "message" not in data:
        return jsonify({"error": "No 'message' provided."}), 400

    user_message = data.get("message", "").strip()
    history = data.get("history", [])

    if not user_message:
        return jsonify({"error": "Empty message."}), 400

    try:
        # Build contents array for Gemini REST API
        contents = []
        for msg in history:
            role = "model" if msg.get("role") == "assistant" else "user"
            contents.append({
                "role": role,
                "parts": [{"text": msg.get("content")}]
            })
        
        # Add the new message
        contents.append({
            "role": "user",
            "parts": [{"text": user_message}]
        })

        payload = {
            "system_instruction": {
                "parts": [{"text": SYSTEM_INSTRUCTION}]
            },
            "contents": contents
        }

        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={GEMINI_API_KEY}"
        req = urllib.request.Request(url, data=json.dumps(payload).encode('utf-8'), headers={'Content-Type': 'application/json'}, method='POST')
        
        with urllib.request.urlopen(req) as response:
            result = json.loads(response.read().decode('utf-8'))
            
            try:
                ai_text = result["candidates"][0]["content"]["parts"][0]["text"]
            except (KeyError, IndexError):
                ai_text = "I encountered an unexpected response format."
            
            return jsonify({"response": ai_text}), 200

    except Exception as e:
        logger.exception("Error in /chat endpoint")
        return jsonify({"error": "Failed to generate AI response. Please try again later."}), 500

