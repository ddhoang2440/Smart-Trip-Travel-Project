from beanie import PydanticObjectId
from beanie.operators import In
from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta, timezone
from bson import ObjectId

from entities.user_entity import UserEntity
from entities.booking_entity import BookingEntity, BookingStatus
from entities.restaurant_entity import RestaurantEntity
from entities.voucher_entity import VoucherEntity
from models.booking_model import CreateBookingRequest, BookingUpdate

class BookingService:
    
    # =========================================================================
    # HELPER: Format Data
    # =========================================================================
    @staticmethod
    async def _format_booking(booking: BookingEntity) -> Dict[str, Any]:
        """Format booking data, fix ObjectIds, populate restaurant & user info"""
        booking_dict = booking.dict()
        
        # 1. Chuẩn hóa ID (Chuyển ObjectId thành string để không bị lỗi {})
        booking_dict["_id"] = str(booking.id)
        if "user_id" in booking_dict: 
            booking_dict["user_id"] = str(booking_dict["user_id"])
        if "restaurant_id" in booking_dict: 
            booking_dict["restaurant_id"] = str(booking_dict["restaurant_id"])
        
        # Xóa field 'id' thừa nếu có (để tránh nhầm lẫn với _id)
        if "id" in booking_dict: del booking_dict["id"]
        
        # 2. Populate Restaurant Info (Thêm ảnh, tên, địa chỉ)
        if booking.restaurant_id:
            restaurant = await RestaurantEntity.get(booking.restaurant_id)
            if restaurant:
                booking_dict["restaurant"] = {
                    "_id": str(restaurant.id),
                    "name": restaurant.name,
                    "address": restaurant.address,
                    "image": restaurant.images[0] if restaurant.images else "", # [THÊM] Ảnh
                    "phone": getattr(restaurant, 'phone', None)
                }
        
        # 3. [MỚI] Populate User Info (Để hiển thị ai đặt bàn)
        if booking.user_id:
            user = await UserEntity.get(booking.user_id)
            if user:
                booking_dict["user"] = {
                    "_id": str(user.id),
                    "username": user.username,
                    "email": user.email,
                    "contact": user.contact or "",
                    "image": user.image or ""
                }

        # 4. Format dates (ISO 8601)
        for field in ["date_time", "created_at", "updated_at"]:
            val = booking_dict.get(field)
            if val and isinstance(val, datetime):
                booking_dict[field] = val.isoformat()
            
        return booking_dict

    # =========================================================================
    # HELPER: Validate Voucher
    # =========================================================================
    @staticmethod
    async def _validate_voucher(voucher_code: str):
        if not voucher_code: return {"valid": True, "code": None}
        
        voucher = await VoucherEntity.find_one(VoucherEntity.code == voucher_code.upper())
        if not voucher: return {"valid": False, "message": "Mã không tồn tại"}
        if voucher.limit <= 0: return {"valid": False, "message": "Mã đã hết lượt"}
        
        return {"valid": True, "code": voucher.code}

    # =========================================================================
    # 1. CREATE BOOKING
    # =========================================================================
    @staticmethod
    async def create_booking(user_id: PydanticObjectId, data: CreateBookingRequest):
        try:
            if data.date_time < datetime.now(timezone.utc):
                return {"success": False, "message": "Không thể đặt thời gian trong quá khứ"}
            if data.num_people < 1:
                return {"success": False, "message": "Số người phải >= 1"}

            restaurant = await RestaurantEntity.get(PydanticObjectId(data.restaurant_id))
            if not restaurant: return {"success": False, "message": "Nhà hàng không tồn tại"}
            
            # Check full bàn
            count = await BookingEntity.find(
                BookingEntity.restaurant_id == restaurant.id,
                BookingEntity.date_time == data.date_time,
                BookingEntity.status == BookingStatus.CONFIRMED
            ).count()
            
            if count >= 20: 
                return {"success": False, "message": "Nhà hàng đã hết bàn giờ này!"}

            # Check voucher
            voucher_code = None
            if data.promotion_code:
                v_check = await BookingService._validate_voucher(data.promotion_code)
                if not v_check["valid"]:
                    return {"success": False, "message": v_check["message"]}
                voucher_code = v_check["code"]

            fee = 200000 if data.num_people <= 10 else 500000

            new_booking = BookingEntity(
                user_id=user_id,
                restaurant_id=restaurant.id,
                num_people=data.num_people,
                date_time=data.date_time,
                payment_method=data.payment_method,
                feeBooking=fee,
                promotion_code=voucher_code,
                special_requests=data.special_requests,
                status=BookingStatus.PENDING
            )
            await new_booking.insert()
            
            return {
                "success": True, 
                "message": "Đặt bàn thành công! Vui lòng đợi xác nhận.",
                "booking": await BookingService._format_booking(new_booking)
            }
        except Exception as e:
            print(f"Create Error: {e}")
            return {"success": False, "message": "Lỗi hệ thống"}

    # =========================================================================
    # 2. GET USER BOOKINGS
    # =========================================================================
    @staticmethod
    async def get_user_bookings(user_id: PydanticObjectId):
        try:
            bookings = await BookingEntity.find(BookingEntity.user_id == user_id).sort("-date_time").to_list()
            result = []
            for b in bookings:
                formatted = await BookingService._format_booking(b)
                result.append(formatted)
                
            return {"success": True, "bookings": result}
        except Exception as e:
            return {"success": False, "message": str(e)}

    # =========================================================================
    # 3. CONFIRM BOOKING
    # =========================================================================
    @staticmethod
    async def confirm_booking(booking_id: str, owner_id: PydanticObjectId):
        booking = await BookingEntity.get(PydanticObjectId(booking_id))
        if not booking: return {"success": False, "message": "Booking not found"}
        
        restaurant = await RestaurantEntity.get(booking.restaurant_id)
        if restaurant.owner != owner_id:
             return {"success": False, "message": "Permission denied"}
             
        booking.status = BookingStatus.CONFIRMED
        await booking.save()
        return {"success": True, "message": "Đã xác nhận đơn!"}

    # =========================================================================
    # 4. COMPLETE BOOKING
    # =========================================================================
    @staticmethod
    async def complete_booking(booking_id: str, owner_id: PydanticObjectId, total_bill: float):
        booking = await BookingEntity.get(PydanticObjectId(booking_id))
        if not booking: return {"success": False, "message": "Booking not found"}
        
        restaurant = await RestaurantEntity.get(booking.restaurant_id)
        if restaurant.owner != owner_id: return {"success": False, "message": "Permission denied"}

        discount = 0
        if booking.promotion_code:
            voucher = await VoucherEntity.find_one(VoucherEntity.code == booking.promotion_code)
            if voucher and voucher.limit > 0:
                discount = total_bill * (voucher.discount/100) if voucher.type == "PERCENT" else voucher.discount
                discount = min(discount, total_bill)
                
                voucher.limit -= 1
                await voucher.save()
            else:
                booking.notes = "Voucher lỗi/hết hạn khi thanh toán."

        final_pay = total_bill - discount
        
        booking.status = BookingStatus.COMPLETED
        booking.notes = f"Bill: {total_bill} - Giảm: {discount} = Thu: {final_pay}"
        await booking.save()
        
        return {
            "success": True, 
            "message": "Hoàn thành đơn!", 
            "payment": {"total": total_bill, "discount": discount, "final": final_pay}
        }

    # =========================================================================
    # 5. CANCEL BOOKING
    # =========================================================================
    @staticmethod
    async def cancel_booking(booking_id: str, user_id: PydanticObjectId):
        booking = await BookingEntity.get(PydanticObjectId(booking_id))
        if not booking: return {"success": False, "message": "Booking not found"}
        
        restaurant = await RestaurantEntity.get(booking.restaurant_id)
        # Cho phép khách hoặc chủ quán hủy
        if booking.user_id != user_id and restaurant.owner != user_id:
             return {"success": False, "message": "Permission denied"}

        if booking.status == BookingStatus.COMPLETED:
             return {"success": False, "message": "Đơn đã hoàn thành, không thể hủy"}

        booking.status = BookingStatus.CANCELLED
        await booking.save()
        return {"success": True, "message": "Đã hủy đơn đặt bàn"}