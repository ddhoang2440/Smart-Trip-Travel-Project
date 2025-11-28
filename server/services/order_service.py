# import uuid
# from beanie import PydanticObjectId
# from typing import List

# from bson import ObjectId
# from entities.order_entity import OrderEntity, OrderItem
# from entities.menu_entity import MenuEntity
# from entities.voucher_entity import VoucherEntity
# from datetime import datetime

# class OrderService:
#     @staticmethod
#     async def create_order(user_id: PydanticObjectId, items_req: List, voucher_code: str = None, address: str = "", contact: str = ""):
#         try:
#             if not items_req:
#                 return {"success": False, "message": "Order items cannot be empty!"}

#             # 1. Tính tổng tiền gốc từ DB
#             total_price = 0
#             order_items = []

#             for item in items_req:
#                 # Tìm món ăn để lấy giá gốc
#                 menu = await MenuEntity.get(PydanticObjectId(item.menu))
#                 if not menu: continue # Bỏ qua nếu món không tồn tại
                
#                 line_price = menu.price * item.quantity
#                 total_price += line_price
                
#                 order_items.append(OrderItem(
#                     item_id = PydanticObjectId(),
#                     restaurant_id=PydanticObjectId(item.restaurant),
#                     menu_id=menu.id,
#                     name=menu.name,
#                     price=menu.price,
#                     quantity=item.quantity,
#                     status="PENDING"
#                 ))
            
#             if not order_items:
#                 return {"success": False, "message": "Order is empty (invalid items)!"}

#             # 2. Áp dụng Voucher (Nếu có)
#             discount_amount = 0
            
#             if voucher_code:
#                 voucher = await VoucherEntity.find_one(VoucherEntity.code == voucher_code.upper())
                
#                 if not voucher:
#                      return {"success": False, "message": "Voucher not found!"}

#                 # [CHECK 1] Số lượng
#                 if voucher.limit <= 0:
#                     return {"success": False, "message": "Voucher has expired (Out of stock)!"}
                
#                 # [CHECK 2] Thời gian (Dùng utcnow nếu DB lưu UTC, hoặc now nếu lưu Local)
#                 # Ở đây giữ nguyên datetime.now() theo code cũ của bạn
#                 now = datetime.now()
#                 if not (voucher.start_date <= now <= voucher.end_date):
#                         return {"success": False, "message": "Voucher is not available at this time!"}

#                 # [CHECK 3] Giá trị tối thiểu
#                 if total_price < voucher.min_order_value:
#                         return {"success": False, "message": f"Order needs to be at least {voucher.min_order_value}!"}

#                 # [CHECK 4] Check quán (Voucher chỉ dùng cho quán cụ thể)
#                 if voucher.restaurant_id:
#                     # Lấy món đầu tiên để check quán (Giả định đơn hàng chỉ mua tại 1 quán)
#                     first_item_menu = await MenuEntity.get(PydanticObjectId(items_req[0].menu))
#                     if first_item_menu and first_item_menu.restaurant != voucher.restaurant_id:
#                             return {"success": False, "message": "This voucher is not applicable for this restaurant!"}

#                 # Tính tiền giảm
#                 if voucher.type == "PERCENT":
#                     discount_amount = total_price * (voucher.discount / 100)
#                 else:
#                     discount_amount = voucher.discount
                
#                 # Không giảm quá tổng tiền
#                 if discount_amount > total_price: 
#                     discount_amount = total_price

#                 # Trừ lượt sử dụng
#                 voucher.limit -= 1
#                 await voucher.save()

#             # Tính tổng tiền cuối cùng (Nằm ngoài if voucher_code để luôn chạy)
#             final_price = total_price - discount_amount

#             # 3. Lưu đơn hàng
#             new_order = OrderEntity(
#                 user=user_id,
#                 items=order_items,
#                 total_price=total_price,
#                 voucher_code=voucher_code,
#                 discount_amount=discount_amount,
#                 final_price=final_price,
#                 address=address, 
#                 contact=contact,
#                 status="PENDING",
#                 created_at=datetime.now()
#             )
#             await new_order.insert()

#             return {
#                 "success": True, 
#                 "message": "Order created successfully!", 
#                 "order": new_order
#             }

#         except Exception as e:
#             print(f"Order Error: {e}")
#             return {"success": False, "message": "Create Order Failed!"}
        
#     # =========================================================================
#     # 2. GET USER ORDERS (Lấy lịch sử đơn hàng)
#     # =========================================================================
#     @staticmethod
#     async def get_user_orders(user_id: PydanticObjectId):
#         try:
#             # Tìm tất cả đơn hàng của user, sắp xếp mới nhất trước
#             orders = await OrderEntity.find(
#                 OrderEntity.user == user_id
#             ).sort("-created_at").to_list()
            
#             # Trả về danh sách rỗng nếu không có đơn, thay vì báo lỗi
#             if not orders:
#                 return {"success": True, "message": "No orders found", "orders": []}

#             # Format dữ liệu trả về
#             order_list = []
#             for order in orders:
#                 order_dict = order.dict()
#                 order_dict["_id"] = str(order.id) # Frontend cần _id dạng string
                
#                 # Format ngày đẹp
#                 if order.created_at:
#                     order_dict["created_at"] = order.created_at.strftime("%d/%m/%Y %H:%M")
                
#                 order_list.append(order_dict)
            
#             print("user id", user_id, type(user_id))
#             return {
#                 "success": True, 
#                 "message": "Get user orders successfully!", 
#                 "orders": order_list
#             }
#         except Exception as e:
#             print(f"Get orders error: {e}")
#             return {"success": False, "message": "Get user orders failed!"}

#     @staticmethod
#     async def get_orders_by_restaurant(restaurant_id: str):
#         try:
#             orders = await OrderEntity.find(
#                 OrderEntity.items.restaurant_id == PydanticObjectId(restaurant_id)
#             ).to_list()

#             result_items = []
#             for order in orders:
#                 for item in order.items:
#                     if str(item.restaurant_id) == restaurant_id:
#                         result_items.append({
#                             "name": item.name,
#                             "price": item.price,
#                             "quantity": item.quantity,
#                             "status": order.status,
#                             "restaurant_id": str(item.restaurant_id),
#                             "id": str(item.item_id),
#                         })

#             return {
#                 "success": True,
#                 "items": result_items
#             }

#         except Exception as e:
#             print("Get order items error:", e)
#             return {"success": False, "message": "Get failed!"}
        
#     @staticmethod
#     async def update_order_item_status(item_id: str, status: str):
#         try:

#             # Tìm order chứa item này
#             order = await OrderEntity.find_one(
#                 {"items.item_id": PydanticObjectId(item_id)}
#             )
#             print(order)
#             if not order:
#                 return {"success": False, "message": "Order not found"}

#             # Update item
#             for item in order.items:
#                 if item.item_id == PydanticObjectId(item_id):
#                     item.status = status

#             # Nếu tất cả item đều SUCCESS -> cập nhật order thành SUCCESS
#             if all(i.status == "COMPLETED" for i in order.items):
#                 order.status = "COMPLETED"
#             if all(i.status == "CANCELED" for i in order.items):
#                 order.status = "CANCELED"
#             await order.save()

#             return {"success": True, "message": "Item updated!"}
#         except Exception as e:
#             print(e)
#             return {"success": False, "message": "Update failed!"}
from typing import List
from beanie import PydanticObjectId
from datetime import datetime

from entities.order_entity import OrderEntity, OrderItem
from entities.menu_entity import MenuEntity
from entities.voucher_entity import VoucherEntity

class OrderService:
    @staticmethod
    async def create_order(user_id: PydanticObjectId, items_req: List, voucher_code: str = None, address: str = "", contact: str = ""):
        try:
            if not items_req:
                return {"success": False, "message": "Order items cannot be empty!"}

            # 1. Tính tổng tiền gốc từ DB
            total_price = 0
            order_items = []
            restaurant_id = None

            for item in items_req:
                # Tìm món ăn để lấy giá gốc
                menu = await MenuEntity.get(PydanticObjectId(item.menu))
                if not menu: 
                    continue  # Bỏ qua nếu món không tồn tại

                # Kiểm tra nhà hàng (chỉ cho phép 1 nhà hàng)
                if restaurant_id is None:
                    restaurant_id = menu.restaurant
                elif restaurant_id != menu.restaurant:
                    return {"success": False, "message": "All items must belong to the same restaurant!"}

                line_price = menu.price * item.quantity
                total_price += line_price

                order_items.append(OrderItem(
                    item_id=PydanticObjectId(),
                    menu_id=menu.id,
                    name=menu.name,
                    price=menu.price,
                    quantity=item.quantity
                ))

            if not order_items:
                return {"success": False, "message": "Order is empty (invalid items)!"}

            # 2. Áp dụng Voucher (Nếu có)
            discount_amount = 0

            if voucher_code:
                voucher = await VoucherEntity.find_one(VoucherEntity.code == voucher_code.upper())
                if not voucher:
                    return {"success": False, "message": "Voucher not found!"}

                # Check số lượng
                if voucher.limit <= 0:
                    return {"success": False, "message": "Voucher has expired (Out of stock)!"}

                now = datetime.now()
                if not (voucher.start_date <= now <= voucher.end_date):
                    return {"success": False, "message": "Voucher is not available at this time!"}

                # Check giá trị tối thiểu
                if total_price < voucher.min_order_value:
                    return {"success": False, "message": f"Order needs to be at least {voucher.min_order_value}!"}

                # Check quán
                if voucher.restaurant_id and voucher.restaurant_id != restaurant_id:
                    return {"success": False, "message": "This voucher is not applicable for this restaurant!"}

                # Tính tiền giảm
                if voucher.type == "PERCENT":
                    discount_amount = total_price * (voucher.discount / 100)
                else:
                    discount_amount = voucher.discount

                # Không giảm quá tổng tiền
                discount_amount = min(discount_amount, total_price)

                # Trừ lượt sử dụng
                voucher.limit -= 1
                await voucher.save()

            final_price = total_price - discount_amount

            # 3. Lưu đơn hàng
            new_order = OrderEntity(
                user=user_id,
                restaurant_id=restaurant_id,
                items=order_items,
                total_price=total_price,
                voucher_code=voucher_code,
                discount_amount=discount_amount,
                final_price=final_price,
                address=address,
                contact=contact,
                status="PENDING",
                created_at=datetime.now()
            )
            await new_order.insert()

            return {"success": True, "message": "Order created successfully!", "order": new_order}

        except Exception as e:
            print(f"Order Error: {e}")
            return {"success": False, "message": "Create Order Failed!"}

    # =========================================================================
    # Lấy lịch sử đơn hàng
    # =========================================================================
    @staticmethod
    async def get_user_orders(user_id: PydanticObjectId):
        try:
            # Tìm tất cả đơn hàng của user, sắp xếp mới nhất trước
            orders = await OrderEntity.find(
                OrderEntity.user == user_id
            ).sort("-created_at").to_list()
            # print(orders)
            # Trả về danh sách rỗng nếu không có đơn, thay vì báo lỗi
            if not orders:
                return {"success": True, "message": "No orders found", "orders": []}

            # Format dữ liệu trả về
            order_list = []
            for order in orders:
                order_dict = order.dict()
                order_dict["_id"] = str(order.id) # Frontend cần _id dạng string
                
                # Format ngày đẹp
                if order.created_at:
                    order_dict["created_at"] = order.created_at.strftime("%d/%m/%Y %H:%M")
                
                order_list.append(order_dict)
            
            print("user id", user_id, type(user_id))
            return {
                "success": True, 
                "message": "Get user orders successfully!", 
                "orders": order_list
            }
        except Exception as e:
            print(f"Get orders error: {e}")
            return {"success": False, "message": "Get user orders failed!"}
    @staticmethod
    async def get_orders_by_restaurant(restaurant_id: str):
        try:
            orders = await OrderEntity.find(OrderEntity.restaurant_id == PydanticObjectId(restaurant_id)).to_list()
            result = []
            for order in orders:
                order_dict = order.dict()
                order_dict["_id"] = str(order.id)
                order_dict["restaurant_id"] = str(order.restaurant_id)
                if order.created_at:
                    order_dict["created_at"] = order.created_at.strftime("%d/%m/%Y %H:%M")
                result.append(order_dict)

            return {"success": True, "orders": result}
        except Exception as e:
            print("Get order items error:", e)
            return {"success": False, "message": "Get failed!"}

    @staticmethod
    async def update_order_status(order_id: str, status: str):
        try:
            order = await OrderEntity.get(PydanticObjectId(order_id))
            if not order:
                return {"success": False, "message": "Order not found"}

            order.status = status
            await order.save()

            return {"success": True, "message": "Order status updated!"}
        except Exception as e:
            print(e)
            return {"success": False, "message": "Update failed!"}
