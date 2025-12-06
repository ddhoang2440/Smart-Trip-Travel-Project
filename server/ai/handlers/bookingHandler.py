from .base import IntentHandler
from routes.booking_route import create

class BookingHandler(IntentHandler):
    async def handle(self, type_: str, entities: str, params: dict):
        if type_ == "reply":
            return await self.booking_text(entities, params)
        elif type_ == "ui_action":
            return await self.booking_ui(entities, params)
        elif type_ == "confirm":
            # Format các biến khi gọi create
            return "done"
            return await create(params) 
        return None

    async def booking_text(self, entities, params):
        # Tạo session (Chỉ chạy lần đầu tiên message về booking sau đó chỉ cập nhật session tới lúc confirm hoặc cancel)
        # restaurant
        restaurant = None
        if params.get("restaurant") and params["restaurant"].get("value"):
            restaurant = params["restaurant"]["value"]

        # num_people
        num_people = None
        if params.get("num_people") and params["num_people"].get("value"):
            num_people = params["num_people"]["value"]

        # contact_name
        contact_name = None
        if params.get("contact_name") and params["contact_name"].get("value"):
            contact_name = params["contact_name"]["value"]

        # contact_phone
        contact_phone = None
        if params.get("contact_phone") and params["contact_phone"].get("value"):
            contact_phone = params["contact_phone"]["value"]

        # special_request
        special_request = None
        if params.get("special_request") and params["special_request"].get("value"):
            special_request = params["special_request"]["value"]

        # promotion_code
        promotion_code = None
        if params.get("promotion_code") and params["promotion_code"].get("value"):
            promotion_code = params["promotion_code"]["value"]

        # time (time không có value, chỉ có from/to)
        time = params.get("time")  # dạng { from: null, to: null }

        # date (date không có value, chỉ có day, month, year)
        date = params.get("date")  # dạng { day: null, month: null, year: null }

        # Nếu thiếu nhiều thông tin thì cho frontend hiển thị form điền

        formatted_data = {
            "action": "create_booking",
            "updated_session": {
                "flow": "booking.create",
                "restaurant": restaurant,
                "time": time,
                "date": date,
                "num_people": num_people,
                "contact_name": contact_name,
                "contact_phone": contact_phone,
                "special_request": special_request,
                "promotion_code": promotion_code
            },
            "message": "Đây là thông tin đặt bàn của bạn. Vui lòng xác nhận để hoàn tất đặt bàn."
        }
        print("Formatted booking data:", formatted_data)
        return formatted_data

    async def booking_ui(self, entities, params):
        return {
            "type": "ui-action",
            "action": "booking",
            "entity": entities,
            "params": params
        }
