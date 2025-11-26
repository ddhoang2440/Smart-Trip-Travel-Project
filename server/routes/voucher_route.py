from fastapi import APIRouter, Depends, Request
from services.voucher_service import VoucherService
from entities.user_entity import UserEntity
from routes.user_route import get_current_user 
from datetime import datetime
router = APIRouter(prefix="/voucher", tags=["Voucher"])

# =========================================================================
# 1. Create Voucher (POST /voucher/create)
# =========================================================================
@router.post("/create")
async def create_voucher(
    request: Request,
    current_user: UserEntity = Depends(get_current_user)
):
    if not current_user:
         return {"success": False, "message": "Auth not Found!"}

    code = None
    discount = None
    type_ = None
    start_date = None
    end_date = None
    limit = None
    min_order = 0
    # Lấy dữ liệu từ JSON hoặc Form
    sources = []
    try: sources.append(await request.json())
    except: pass
    try: sources.append(await request.form())
    except: pass
    
    for src in sources:
        if not code: code = src.get("code")
        if not discount: discount = src.get("discount")
        if not type_: type_ = src.get("type")
        if not limit: limit = src.get("limit")
        if not start_date: start_date = src.get("start_date") # Format: YYYY-MM-DDTHH:MM
        if not end_date: end_date = src.get("end_date")
        if not min_order: min_order = src.get("min_order_value")

    # Chỉ bắt buộc discount, type, limit. Code có thể để trống (None)
    if not all([discount, type_, limit, start_date, end_date]):
        # Debug: In ra để biết thiếu cái gì
        print(f"Missing Data: discount={discount}, type={type_}, limit={limit}, start_date={start_date}, end_date={end_date}")
        return {"success": False, "message": "Missing input data (discount, type, limit, dates)"}
        # Convert string sang datetime

    try:
        # Giả sử frontend gửi ISO string: "2024-12-25T00:00:00"
        dt_start = datetime.fromisoformat(str(start_date).replace('Z', '+00:00'))
        dt_end = datetime.fromisoformat(str(end_date).replace('Z', '+00:00'))
    except:
        return {"success": False, "message": "Invalid date format (Use ISO format)"}
    
    return await VoucherService.create_voucher(
        code=str(code) if code else None, # Nếu không có code thì truyền None
        discount=float(discount),
        type=str(type_),
        limit=int(limit),
        start_date=dt_start,
        end_date=dt_end,   
        min_order_value=float(min_order) if min_order else 0
    )

# =========================================================================
# 2. Check Voucher (POST /voucher/check)
# =========================================================================
@router.post("/check")
async def check_voucher(request: Request):
    code = None
    total_price = 0
    sources = []
    try: sources.append(await request.json())
    except: pass
    try: sources.append(await request.form())
    except: pass
    sources.append(request.query_params)

    for src in sources:
        if not code: code = src.get("code")
        if not total_price: total_price = src.get("total_price")

    if not code:
        return {"success": False, "message": "Missing voucher code"}

    return await VoucherService.check_voucher(code, float(total_price) if total_price else 0)

# =========================================================================
# 3. Create Batch (POST /voucher/create-batch)
# =========================================================================
@router.post("/create-batch")
async def create_batch(
    request: Request,
    current_user: UserEntity = Depends(get_current_user)
):
    if not current_user:
         return {"success": False, "message": "Auth not Found!"}

    data = await request.json()
    quantity = data.get("quantity", 1)
    discount = data.get("discount")
    type_ = data.get("type")
    limit = data.get("limit")

    if not all([discount, type_, limit]):
        return {"success": False, "message": "Missing input data"}

    return await VoucherService.create_batch(
        quantity=int(quantity),
        discount=float(discount),
        type=str(type_),
        limit=int(limit)
    )