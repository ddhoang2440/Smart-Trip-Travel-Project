from dotenv import load_dotenv
import google.generativeai as genai
import os

# Bạn chỉ cần tạo KEY tại:
# https://aistudio.google.com/app/apikey
# → Miễn phí

load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

def get_model():
    models = genai.list_models()

    for m in models:
        if "flash-latest" in m.name and "generateContent" in m.supported_generation_methods:
            return m.name
        
    for m in models:
        if "flash" in m.name and "generateContent" in m.supported_generation_methods:
            return m.name

    for m in models:
        if "pro" in m.name and "generateContent" in m.supported_generation_methods:
            return m.name

    return "gemini-flash-latest"

def call_gemini(prompt):
    model = get_model()
    ai = genai.GenerativeModel(model)
    response = ai.generate_content(prompt)
    return response.text
