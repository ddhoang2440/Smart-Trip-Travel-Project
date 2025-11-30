from fastapi import APIRouter, Request
from services.contact_service import ContactService

router = APIRouter(prefix="/contact", tags=["Contact"])

@router.post("/send")
async def send_contact(request: Request):
    # Khởi tạo biến
    name = None
    email = None
    subject = None
    message = None
    
    # Thu thập dữ liệu từ JSON và Form
    sources = []
    try: sources.append(await request.json())
    except: pass
    try: sources.append(await request.form())
    except: pass
    
    # Duyệt tìm dữ liệu
    for src in sources:
        if not name: name = src.get("name")
        if not email: email = src.get("email")
        if not subject: subject = src.get("subject")
        if not message: message = src.get("message")
        
    # Kiểm tra dữ liệu đầu vào
    if not all([name, email, subject, message]):
        return {"success": False, "message": "Missing input data (name, email, subject, message)"}

    return await ContactService.send_contact(name, email, subject, message)