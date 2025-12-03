import json

def session_prompt(message: str, session: dict):
    session_json = json.dumps(session, ensure_ascii=False)
    prompt =  """
You are a session-aware assistant.
CURRENT_SESSION = {session_json}

User says: "{message}"

Your task:
1. Determine action: "modify_booking", "confirm_booking", "cancel_booking", "no_action"
2. Update session if needed.
3. Return EXACTLY this JSON:
{
    "action": "...",
    "updated_session": {...},
    "reply": "..."
}
"""
    return prompt.format(session_json=session_json, message=message)
