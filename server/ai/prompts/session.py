import json

def session_prompt(message: str, session: dict):
    session_json = json.dumps(session, ensure_ascii=False)
    prompt =  """
You are a session-aware assistant.
CURRENT_SESSION = "{session_json}"

User says: "{message}"

Your task:
1. Determine action: "update_booking", "confirm_booking", "cancel_booking", "no_action"
2. Update session if needed.
3. Return EXACTLY this JSON:
{{
    "action": "...",
    "updated_session": {{
        "flow": "booking.update", "booking.confirm", "booking.cancel", null,
        "num_people": number,
        "time": {{
            "from": "...", null, 
            "to": "...", null
        }},
        "date": {{
            "day": number, null, 
            "month": number, null, 
            "year": number, null
        }},
        "restaurant": "string", null,
        "table": number, null,
        "contact_name": "string", null,
        "contact_phone": "string", null,
        "special_request": "string", null,
        "promotion_code": "string", null
    }},
    "reply": "..."
}}
Return ONLY VALID JSON. Do NOT explain.
If missing field → return null.
"""
    return prompt.format(session_json=session_json, message=message)
