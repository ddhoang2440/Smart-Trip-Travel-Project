from typing import List, Dict, Any, Optional
from beanie import PydanticObjectId
from datetime import datetime, timedelta
from bson import ObjectId

from entities.bookingTable_entity import BookingEntity, BookingStatus
from entities.restaurant_entity import RestaurantEntity
from services.history_service import HistoryService
from entities.voucher_entity import VoucherEntity
from models.bookingTable_model import BookingCreate, BookingUpdate


class BookingService:
    
    # =========================================================================
    # HELPER: Format Booking Data with Restaurant Info
    # =========================================================================
    @staticmethod
    async def _format_booking(booking: BookingEntity) -> Dict[str, Any]:
        """Format booking data và populate restaurant info"""
        booking_dict = booking.dict()
        booking_dict["_id"] = str(booking.id)
        
        # Populate Restaurant Info
        if booking.restaurant_id:
            restaurant = await RestaurantEntity.get(booking.restaurant_id)
            if restaurant:
                booking_dict["restaurant"] = {
                    "_id": str(restaurant.id),
                    "name": restaurant.name,
                    "address": restaurant.address,
                    "phone": restaurant.phone if hasattr(restaurant, 'phone') else None
                }
        
        # Format dates
        if booking.date_time:
            booking_dict["date_time"] = booking.date_time.isoformat()
        if booking.created_at:
            booking_dict["created_at"] = booking.created_at.isoformat()
        if booking.updated_at:
            booking_dict["updated_at"] = booking.updated_at.isoformat()
            
        return booking_dict

    # =========================================================================
    # HELPER: Kiểm tra voucher có hợp lệ không (KHÔNG TRỪ LƯỢT)
    # =========================================================================
    @staticmethod
    async def _validate_voucher(voucher_code: str) -> Dict[str, Any]:
        """
        Kiểm tra voucher có tồn tại và còn lượt dùng không
        CHỈ VALIDATE - KHÔNG TRỪ LƯỢT
        """
        if not voucher_code:
            return {"valid": True, "voucher": None}
        
        voucher = await VoucherEntity.find_one(
            VoucherEntity.code == voucher_code.upper()
        )
        
        if not voucher:
            return {
                "valid": False,
                "message": "Mã khuyến mãi không tồn tại!"
            }
        
        if voucher.limit <= 0:
            return {
                "valid": False,
                "message": "Mã khuyến mãi đã hết lượt sử dụng!"
            }
        
        return {
            "valid": True,
            "voucher": voucher,
            "voucher_code": voucher_code.upper()
        }

    # =========================================================================
    # 1. CREATE BOOKING (CHỈ LƯU VOUCHER - CHƯA TRỪ LƯỢT)
    # =========================================================================
    @staticmethod
    async def create_booking(booking_data: BookingCreate, user_id: PydanticObjectId) -> Dict[str, Any]:
        """
        Tạo đơn đặt bàn mới
        - Chỉ thu phí đặt bàn cố định (200k)
        - Lưu voucher code (nếu có) nhưng CHƯA trừ lượt
        - Voucher sẽ được áp dụng khi Complete Booking (sau khi ăn xong)
        """
        try:
            # 1. Validate: Không đặt bàn trong quá khứ
            if booking_data.date_time < datetime.utcnow():
                return {
                    "success": False,
                    "message": "Không thể đặt bàn trong quá khứ!"
                }

            # 2. Validate: Nhà hàng có tồn tại không?
            restaurant = await RestaurantEntity.get(PydanticObjectId(booking_data.restaurant_id))
            if not restaurant:
                return {
                    "success": False,
                    "message": "Nhà hàng không tồn tại!"
                }
            
            # 3. Validate: Số người phải hợp lệ
            if booking_data.num_people < 1:
                return {
                    "success": False,
                    "message": "Số người phải ít nhất là 1!"
                }
            
            # 4. Check availability - Kiểm tra còn bàn không
            same_time_bookings = await BookingEntity.find(
                BookingEntity.restaurant_id == PydanticObjectId(booking_data.restaurant_id),
                BookingEntity.date_time == booking_data.date_time,
                BookingEntity.status.in_([BookingStatus.PENDING, BookingStatus.CONFIRMED])
            ).count()
            
            MAX_TABLES = 20 # cho nay co the lay tu moi nha hang 
            if same_time_bookings >= MAX_TABLES:
                return {
                    "success": False,
                    "message": "Nhà hàng đã hết chỗ vào thời gian này. Vui lòng chọn giờ khác!"
                }

            # 5. Validate Voucher (nếu có) - CHỈ KIỂM TRA, CHƯA TRỪ LƯỢT
            voucher_code = None
            if booking_data.promotion_applied:
                voucher_check = await BookingService._validate_voucher(booking_data.promotion_applied)
                if not voucher_check["valid"]:
                    return {
                        "success": False,
                        "message": voucher_check["message"]
                    }
                voucher_code = voucher_check["voucher_code"]

            # 6. Tính phí đặt bàn (Có thể tăng nếu đặt nhiều người)
            fee_booking = 200000  # Phí cố định 200k
            
            # (Optional) Tăng phí nếu đặt trên 10 người
            if booking_data.num_people > 10:
                fee_booking = 500000  # 500k cho đoàn lớn

            # 7. Tạo booking mới
            new_booking = BookingEntity(
                restaurant_id=PydanticObjectId(booking_data.restaurant_id),
                user_id=user_id,
                num_people=booking_data.num_people,
                date_time=booking_data.date_time,
                payment_method=booking_data.payment_method,
                feeBooking=fee_booking,
                promotion_applied=voucher_code,  # Lưu voucher code (chưa áp dụng)
                special_requests=booking_data.special_requests,
                status=BookingStatus.PENDING
            )
            
            await new_booking.insert()
            
            # Format response
            formatted_booking = await BookingService._format_booking(new_booking)
            
            return {
                "success": True,
                "message": "Đặt bàn thành công! Vui lòng đợi nhà hàng xác nhận.",
                "booking": formatted_booking,
                "note": "Phí đặt bàn sẽ được thu khi đến nhà hàng. Voucher (nếu có) sẽ được áp dụng sau khi ăn xong."
            }
            
        except Exception as e:
            print(f"Create booking error: {e}")
            return {
                "success": False,
                "message": "Đặt bàn thất bại!"
            }

    # =========================================================================
    # 2. CONFIRM BOOKING (Chủ nhà hàng xác nhận)
    # =========================================================================
    @staticmethod
    async def confirm_booking(booking_id: str, owner_id: PydanticObjectId) -> Dict[str, Any]:
        """Xác nhận đơn đặt bàn (Chỉ chủ nhà hàng mới được xác nhận)"""
        try:
            if not ObjectId.is_valid(booking_id):
                return {"success": False, "message": "ID đơn đặt bàn không hợp lệ!"}

            booking = await BookingEntity.get(PydanticObjectId(booking_id))
            if not booking:
                return {"success": False, "message": "Không tìm thấy đơn đặt bàn!"}

            restaurant = await RestaurantEntity.get(booking.restaurant_id)
            if not restaurant or restaurant.owner != owner_id:
                return {
                    "success": False,
                    "message": "Bạn không có quyền xác nhận đơn này!"
                }

            if booking.status != BookingStatus.PENDING:
                return {
                    "success": False,
                    "message": f"Không thể xác nhận đơn đang ở trạng thái {booking.status.value}"
                }

            booking.status = BookingStatus.CONFIRMED
            booking.updated_at = datetime.utcnow()
            await booking.save()

            formatted_booking = await BookingService._format_booking(booking)
            
            return {
                "success": True,
                "message": "Xác nhận đơn đặt bàn thành công!",
                "booking": formatted_booking
            }
            
        except Exception as e:
            print(f"Confirm booking error: {e}")
            return {"success": False, "message": "Xác nhận đơn thất bại!"}

    # =========================================================================
    # 3. CANCEL BOOKING (User hoặc Owner đều có thể hủy)
    # =========================================================================
    @staticmethod
    async def cancel_booking(booking_id: str, user_id: PydanticObjectId) -> Dict[str, Any]:
        """
        Hủy đơn đặt bàn
        - Vì voucher chưa được sử dụng nên không cần hoàn lại
        """
        try:
            if not ObjectId.is_valid(booking_id):
                return {"success": False, "message": "ID đơn đặt bàn không hợp lệ!"}

            booking = await BookingEntity.get(PydanticObjectId(booking_id))
            if not booking:
                return {"success": False, "message": "Không tìm thấy đơn đặt bàn!"}

            restaurant = await RestaurantEntity.get(booking.restaurant_id)
            is_owner = restaurant and restaurant.owner == user_id
            is_customer = booking.user_id == user_id
            
            if not (is_owner or is_customer):
                return {
                    "success": False,
                    "message": "Bạn không có quyền hủy đơn này!"
                }

            if booking.status in [BookingStatus.COMPLETED, BookingStatus.CANCELLED]:
                return {
                    "success": False,
                    "message": "Không thể hủy đơn đặt bàn này!"
                }

            if datetime.utcnow() > booking.date_time:
                return {
                    "success": False,
                    "message": "Đã quá giờ hẹn, không thể hủy!"
                }
            
            time_until_booking = booking.date_time - datetime.utcnow()
            if time_until_booking < timedelta(hours=1):
                return {
                    "success": False,
                    "message": "Đã sát giờ hẹn (dưới 1 tiếng), vui lòng liên hệ trực tiếp nhà hàng!"
                }

            # Cập nhật trạng thái (Không cần hoàn voucher vì chưa dùng)
            booking.status = BookingStatus.CANCELLED
            booking.updated_at = datetime.utcnow()
            await booking.save()

            formatted_booking = await BookingService._format_booking(booking)
            
            return {
                "success": True,
                "message": "Hủy đơn đặt bàn thành công!",
                "booking": formatted_booking
            }
            
        except Exception as e:
            print(f"Cancel booking error: {e}")
            return {"success": False, "message": "Hủy đơn thất bại!"}

    # =========================================================================
    # 4. COMPLETE BOOKING (Chủ nhà hàng đánh dấu hoàn thành + ÁP DỤNG VOUCHER)
    # =========================================================================
    @staticmethod
    # Chỉ cần sửa hàm complete_booking() trong bookingTable_service.py

    @staticmethod
    async def complete_booking(
        booking_id: str, 
        owner_id: PydanticObjectId,
        total_bill: float
    ) -> Dict[str, Any]:
        """
        Đánh dấu khách đã ăn xong và TÍNH TIỀN CUỐI CÙNG
        """
        try:
            if not ObjectId.is_valid(booking_id):
                return {"success": False, "message": "ID đơn đặt bàn không hợp lệ!"}

            booking = await BookingEntity.get(PydanticObjectId(booking_id))
            if not booking:
                return {"success": False, "message": "Không tìm thấy đơn đặt bàn!"}

            restaurant = await RestaurantEntity.get(booking.restaurant_id)
            if not restaurant or restaurant.owner != owner_id:
                return {
                    "success": False,
                    "message": "Bạn không có quyền thực hiện hành động này!"
                }

            if booking.status != BookingStatus.CONFIRMED:
                return {
                    "success": False,
                    "message": f"Chỉ có thể hoàn thành đơn đã được xác nhận!"
                }

            # Tính toán giảm giá
            discount_amount = 0
            voucher_applied = None
            
            if booking.promotion_applied:
                voucher = await VoucherEntity.find_one(
                    VoucherEntity.code == booking.promotion_applied
                )
                
                if voucher and voucher.limit > 0:
                    if voucher.type == "PERCENT":
                        discount_amount = total_bill * (voucher.discount / 100)
                    else:
                        discount_amount = voucher.discount
                    
                    if discount_amount > total_bill:
                        discount_amount = total_bill
                    
                    voucher.limit -= 1
                    await voucher.save()
                    
                    voucher_applied = booking.promotion_applied
                else:
                    booking.notes = "Voucher không áp dụng được (hết lượt hoặc không hợp lệ)"

            final_price = total_bill - discount_amount

            booking.status = BookingStatus.COMPLETED
            booking.updated_at = datetime.utcnow()
            
            if not booking.notes:
                booking.notes = f"Tổng bill: {total_bill:,.0f}đ"
            if voucher_applied:
                booking.notes += f" | Giảm: {discount_amount:,.0f}đ | Thanh toán: {final_price:,.0f}đ"
            
            await booking.save()

            formatted_booking = await BookingService._format_booking(booking)
            
            # GHI LỊCH SỬ - ĐÃ SỬA
            await HistoryService.record_booking(
                user_id=booking.user_id,
                restaurant_id=booking.restaurant_id,
                booking_id=booking.id,
                details=HistoryService._standardize_booking_details(booking, final_price)
            )
            
            return {
                "success": True,
                "message": "Hoàn thành đơn đặt bàn thành công!",
                "booking": formatted_booking,
                "payment_details": {
                    "total_bill": total_bill,
                    "discount_amount": discount_amount,
                    "final_price": final_price,
                    "voucher_applied": voucher_applied,
                    "payment_method": booking.payment_method
                }
            }
            
        except Exception as e:
            print(f"Complete booking error: {e}")
            return {"success": False, "message": "Hoàn thành đơn thất bại!"}

    # =========================================================================
    # 5. MARK NO-SHOW (Khách bùng kèo - Không áp dụng voucher)
    # =========================================================================
    @staticmethod
    async def mark_booking_no_show(booking_id: str, owner_id: PydanticObjectId) -> Dict[str, Any]:
        """
        Đánh dấu khách không đến (Bùng kèo)
        - Voucher KHÔNG được sử dụng (không trừ lượt)
        """
        try:
            if not ObjectId.is_valid(booking_id):
                return {"success": False, "message": "ID đơn đặt bàn không hợp lệ!"}

            booking = await BookingEntity.get(PydanticObjectId(booking_id))
            if not booking:
                return {"success": False, "message": "Không tìm thấy đơn đặt bàn!"}

            restaurant = await RestaurantEntity.get(booking.restaurant_id)
            if not restaurant or restaurant.owner != owner_id:
                return {
                    "success": False,
                    "message": "Bạn không có quyền thực hiện hành động này!"
                }

            if booking.status != BookingStatus.CONFIRMED:
                return {
                    "success": False,
                    "message": f"Chỉ đơn ở trạng thái {BookingStatus.CONFIRMED.value} mới có thể đánh dấu No-Show!"
                }

            if datetime.utcnow() < booking.date_time:
                return {
                    "success": False,
                    "message": "Chưa đến giờ hẹn, không thể đánh dấu No-Show sớm!"
                }

            # Đánh dấu No-Show (Voucher KHÔNG được trừ lượt)
            booking.status = BookingStatus.NOSHOW
            booking.updated_at = datetime.utcnow()
            booking.notes = "Khách không đến, không liên lạc được. Voucher (nếu có) không được sử dụng."
            await booking.save()

            formatted_booking = await BookingService._format_booking(booking)
            
            return {
                "success": True,
                "message": "Đã đánh dấu khách No-Show!",
                "booking": formatted_booking
            }
            
        except Exception as e:
            print(f"Mark no-show error: {e}")
            return {"success": False, "message": "Đánh dấu No-Show thất bại!"}

    # =========================================================================
    # 6. UPDATE BOOKING
    # =========================================================================
    @staticmethod
    async def update_booking(booking_id: str, update_data: BookingUpdate, user_id: PydanticObjectId) -> Dict[str, Any]:
        """Cập nhật thông tin đơn đặt bàn"""
        try:
            if not ObjectId.is_valid(booking_id):
                return {"success": False, "message": "ID đơn đặt bàn không hợp lệ!"}

            booking = await BookingEntity.get(PydanticObjectId(booking_id))
            if not booking:
                return {"success": False, "message": "Không tìm thấy đơn đặt bàn!"}

            if booking.user_id != user_id:
                return {
                    "success": False,
                    "message": "Bạn không có quyền sửa đơn này!"
                }

            if booking.status in [BookingStatus.CANCELLED, BookingStatus.COMPLETED]:
                return {
                    "success": False,
                    "message": "Không thể cập nhật đơn đặt bàn đã hủy hoặc đã hoàn thành!"
                }

            time_until_booking = booking.date_time - datetime.utcnow()
            if time_until_booking < timedelta(hours=2):
                return {
                    "success": False,
                    "message": "Đã sát giờ hẹn, vui lòng liên hệ trực tiếp nhà hàng!"
                }

            if update_data.num_people is not None:
                if update_data.num_people < 1:
                    return {"success": False, "message": "Số người phải ít nhất là 1!"}
                booking.num_people = update_data.num_people
                
            if update_data.date_time is not None:
                if update_data.date_time < datetime.utcnow():
                    return {
                        "success": False,
                        "message": "Không thể đổi sang thời gian trong quá khứ!"
                    }
                booking.date_time = update_data.date_time
                
            if update_data.special_requests is not None:
                booking.special_requests = update_data.special_requests
            
            booking.updated_at = datetime.utcnow()
            await booking.save()

            formatted_booking = await BookingService._format_booking(booking)
            
            return {
                "success": True,
                "message": "Cập nhật đơn đặt bàn thành công!",
                "booking": formatted_booking
            }
            
        except Exception as e:
            print(f"Update booking error: {e}")
            return {"success": False, "message": "Cập nhật đơn thất bại!"}

    # =========================================================================
    # 7. GET USER BOOKINGS
    # =========================================================================
    # User có quyền xem tất cả đơn của chính mình.
    @staticmethod
    async def get_user_bookings(user_id: PydanticObjectId) -> Dict[str, Any]:
        """Lấy danh sách đơn đặt bàn của user"""
        try:
            bookings = await BookingEntity.find(
                BookingEntity.user_id == user_id
            ).sort(-BookingEntity.date_time).to_list()
            
            formatted_bookings = []
            for booking in bookings:
                formatted = await BookingService._format_booking(booking)
                formatted_bookings.append(formatted)
            
            return {
                "success": True,
                "message": "Lấy danh sách đơn đặt bàn thành công!",
                "bookings": formatted_bookings
            }
            
        except Exception as e:
            print(f"Get user bookings error: {e}")
            return {"success": False, "message": "Lấy danh sách thất bại!"}

    # =========================================================================
    # 8. GET BOOKING BY ID
    # =========================================================================
    # User có thể xem đơn của mình, hoặc chủ nhà hàng xem đơn của nhà hàng mình.
    @staticmethod
    async def get_booking_by_id(booking_id: str, user_id: PydanticObjectId) -> Dict[str, Any]:
        """Lấy chi tiết đơn đặt bàn"""
        try:
            if not ObjectId.is_valid(booking_id):
                return {"success": False, "message": "ID đơn đặt bàn không hợp lệ!"}

            booking = await BookingEntity.get(PydanticObjectId(booking_id))
            if not booking:
                return {"success": False, "message": "Không tìm thấy đơn đặt bàn!"}

            restaurant = await RestaurantEntity.get(booking.restaurant_id)
            is_owner = restaurant and restaurant.owner == user_id
            is_customer = booking.user_id == user_id
            
            if not (is_owner or is_customer):
                return {
                    "success": False,
                    "message": "Bạn không có quyền xem đơn này!"
                }

            formatted_booking = await BookingService._format_booking(booking)
            
            return {
                "success": True,
                "message": "Lấy thông tin đơn đặt bàn thành công!",
                "booking": formatted_booking
            }
            
        except Exception as e:
            print(f"Get booking error: {e}")
            return {"success": False, "message": "Lấy thông tin đơn thất bại!"}

    # =========================================================================
    # 9. GET RESTAURANT BOOKINGS
    # =========================================================================
    # chu nha hang xem don cua minh
    @staticmethod
    async def get_restaurant_bookings(restaurant_id: str, owner_id: PydanticObjectId) -> Dict[str, Any]:
        """Lấy danh sách đơn đặt bàn của nhà hàng"""
        try:
            if not ObjectId.is_valid(restaurant_id):
                return {"success": False, "message": "ID nhà hàng không hợp lệ!"}

            restaurant = await RestaurantEntity.get(PydanticObjectId(restaurant_id))
            if not restaurant or restaurant.owner != owner_id:
                return {
                    "success": False,
                    "message": "Bạn không có quyền xem đơn của nhà hàng này!"
                }

            bookings = await BookingEntity.find(
                BookingEntity.restaurant_id == PydanticObjectId(restaurant_id)
            ).sort(-BookingEntity.date_time).to_list()
            
            formatted_bookings = []
            for booking in bookings:
                formatted = await BookingService._format_booking(booking)
                formatted_bookings.append(formatted)
            
            return {
                "success": True,
                "message": "Lấy danh sách đơn đặt bàn thành công!",
                "bookings": formatted_bookings
            }
            
        except Exception as e:
            print(f"Get restaurant bookings error: {e}")
            return {"success": False, "message": "Lấy danh sách thất bại!"}
        
        