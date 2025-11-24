from beanie import PydanticObjectId
from typing import List

from entities.order_entity import OrderEntity, OrderItem
from entities.menu_entity import MenuEntity
from entities.voucher_entity import VoucherEntity

class OrderService:
    @staticmethod
    async def create_order(user_id: PydanticObjectId, items_req: List, voucher_code: str = None, address = "", contact = ""):
        try:
            # 1. Tính tổng tiền gốc từ DB
            total_price = 0
            order_items = []

            for item in items_req:
                # Tìm món ăn để lấy giá gốc
                menu = await MenuEntity.get(PydanticObjectId(item.menu))
                if not menu: continue # Bỏ qua nếu món không tồn tại
                
                line_price = menu.price * item.quantity
                total_price += line_price
                
                order_items.append(OrderItem(
                    menu_id=menu.id,
                    name=menu.name,
                    price=menu.price,
                    quantity=item.quantity
                ))
            
            if not order_items:
                return {"success": False, "message": "Order is empty!"}

            # 2. Áp dụng Voucher (Nếu có)
            discount_amount = 0
            
            if voucher_code:
                # Tìm mã (chuyển về chữ hoa)
                voucher = await VoucherEntity.find_one(VoucherEntity.code == voucher_code.upper())
                
                # Check điều kiện: Có tồn tại và Còn lượt dùng
                if voucher and voucher.limit > 0:
                    # Tính tiền giảm
                    if voucher.type == "PERCENT":
                        discount_amount = total_price * (voucher.discount / 100)
                    else: # AMOUNT
                        discount_amount = voucher.discount
                    
                    # Không giảm quá số tiền gốc (tránh âm tiền)
                    if discount_amount > total_price:
                        discount_amount = total_price

                    # [QUAN TRỌNG] Trừ 1 lượt dùng
                    voucher.limit -= 1
                    await voucher.save()
                else:
                    return {"success": False, "message": "Voucher invalid or expired!"}

            final_price = total_price - discount_amount

            # 3. Lưu đơn hàng
            new_order = OrderEntity(
                user=user_id,
                items=order_items,
                total_price=total_price,
                voucher_code=voucher_code,
                discount_amount=discount_amount,
                final_price=final_price,
                address=address, 
                contact=contact
            )
            await new_order.insert()

            return {
                "success": True, 
                "message": "Order created successfully!", 
                "order": new_order
            }

        except Exception as e:
            print(f"Order Error: {e}")
            return {"success": False, "message": "Create Order Failed!"}