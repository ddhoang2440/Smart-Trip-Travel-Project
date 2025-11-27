from fastapi import APIRouter, Depends, Request
from services.voucher_service import VoucherService
from entities.user_entity import UserEntity
from routes.user_route import get_current_user 

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
    limit = None
    
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

    # Chỉ bắt buộc discount, type, limit. Code có thể để trống (None)
    if not all([discount, type_, limit]):
        # Debug: In ra để biết thiếu cái gì
        print(f"Missing Data: discount={discount}, type={type_}, limit={limit}")
        return {"success": False, "message": "Missing input data (discount, type, limit)"}

    return await VoucherService.create_voucher(
        code=str(code) if code else None, # Nếu không có code thì truyền None
        discount=float(discount),
        type=str(type_),
        limit=int(limit)
    )

# =========================================================================
# 2. Check Voucher (POST /voucher/check)
# =========================================================================
@router.post("/check")
async def check_voucher(request: Request):
    code = None
    sources = []
    try: sources.append(await request.json())
    except: pass
    try: sources.append(await request.form())
    except: pass
    sources.append(request.query_params)

    for src in sources:
        if not code: code = src.get("code")

    if not code:
        return {"success": False, "message": "Missing voucher code"}

    return await VoucherService.check_voucher(code)

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