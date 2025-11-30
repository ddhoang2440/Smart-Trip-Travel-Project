import random
import string
from entities.voucher_entity import VoucherEntity

class VoucherService:

    # =========================================================================
    # HELPER: Sinh mã ngẫu nhiên (VD: PROMO-X7Z9A)
    # =========================================================================
    @staticmethod
    def _generate_code(length=8, prefix="VCH"):
        # Tạo chuỗi gồm chữ in hoa và số
        chars = string.ascii_uppercase + string.digits
        random_str = ''.join(random.choice(chars) for _ in range(length))
        return f"{prefix}-{random_str}"

    # =========================================================================
    # 1. CREATE VOUCHER
    # =========================================================================
    @staticmethod
    async def create_voucher(discount: float, type: str, limit: int, code: str = None):
        try:
            final_code = code
            
            # TRƯỜNG HỢP 1: Người dùng KHÔNG gửi mã -> Hệ thống tự sinh
            if not final_code:
                is_unique = False
                while not is_unique:
                    # Sinh mã ngẫu nhiên
                    temp_code = VoucherService._generate_code()
                    # Kiểm tra xem có trùng trong DB không
                    existing = await VoucherEntity.find_one(VoucherEntity.code == temp_code)
                    if not existing:
                        final_code = temp_code
                        is_unique = True
            else:
                # TRƯỜNG HỢP 2: Người dùng tự đặt mã -> Kiểm tra trùng
                final_code = final_code.upper() # Chuyển về in hoa
                existing = await VoucherEntity.find_one(VoucherEntity.code == final_code)
                if existing:
                    return {"success": False, "message": f"Voucher code '{final_code}' already exists!"}

            # Tạo Voucher mới
            new_voucher = VoucherEntity(
                code=final_code,
                discount=discount,
                type=type,
                limit=limit
            )
            await new_voucher.insert()

            return {
                "success": True, 
                "message": "Create Voucher Successfully!", 
                "voucher": new_voucher # Trả về voucher để người dùng biết mã vừa tạo là gì
            }

        except Exception as e:
            print(f"Error create voucher: {e}")
            return {"success": False, "message": "Create Voucher Failed!"}

    # =========================================================================
    # 2. CHECK VOUCHER (Giữ nguyên)
    # =========================================================================
    @staticmethod
    async def check_voucher(code: str):
        try:
            voucher = await VoucherEntity.find_one(VoucherEntity.code == code.upper())
            
            if not voucher:
                return {"success": False, "message": "Voucher not found!"}

            if voucher.limit <= 0:
                return {"success": False, "message": "Voucher has expired (limit 0)!"}

            return {
                "success": True, 
                "message": "Voucher is valid!", 
                "voucher": {
                    "code": voucher.code,
                    "discount": voucher.discount,
                    "type": voucher.type
                }
            }

        except Exception as e:
            print(f"Error check voucher: {e}")
            return {"success": False, "message": "Check Voucher Failed!"}
        
# =========================================================================
    # 3. CREATE BATCH (Tạo hàng loạt)
    # =========================================================================
    @staticmethod
    async def create_batch(quantity: int, discount: float, type: str, limit: int):
        created_list = []
        try:
            for _ in range(quantity):
                # Sinh mã duy nhất
                is_unique = False
                final_code = ""
                while not is_unique:
                    temp_code = VoucherService._generate_code()
                    existing = await VoucherEntity.find_one(VoucherEntity.code == temp_code)
                    if not existing:
                        final_code = temp_code
                        is_unique = True
                
                # Tạo voucher
                new_voucher = VoucherEntity(
                    code=final_code,
                    discount=discount,
                    type=type,
                    limit=limit
                )
                await new_voucher.insert()
                created_list.append(final_code)
                
            return {
                "success": True, 
                "message": f"Successfully created {len(created_list)} vouchers", 
                "codes": created_list
            }
        except Exception as e:
            print(f"Batch error: {e}")
            return {"success": False, "message": "Batch create failed"}