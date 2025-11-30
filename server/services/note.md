# note cach hoat dong ve ham search

```bash
Search không phải là một đối tượng cần lưu trữ trong database, mà chỉ là một chức năng xử lý logic để:

Tìm kiếm dữ liệu từ các Entity có sẵn (MenuEntity, RestaurantEntity)
Xử lý và sắp xếp kết quả
Trả về cho người dùng
Client → Route → Service → Đọc MenuEntity & RestaurantEntity
                         → Xử lý logic (filter, sort)
                         → Trả kết quả → Route → Client
```

vi du cach hoat dong:
Nếu bạn search cụ thể từ khóa "com ga" (hoặc "cơm gà" - tùy vào dữ liệu lưu có dấu hay không), code sẽ hoạt động theo luồng sau đây.
Mình sẽ lấy ví dụ cụ thể để bạn dễ hình dung:
Giả sử dữ liệu trong Database
Quán A (Chuyên Cơm):
Món 1: "Cơm sườn" (40k)
Món 2: "Cơm gà xối mỡ" (50k) -> Chứa từ "com ga"
Món 3: "Cơm gà luộc" (40k) -> Chứa từ "com ga"
Quán B (Chuyên Gà Rán):
Món 1: "Gà rán KFC" (35k) -> Không có chữ "com", chỉ có "ga"
Món 2: "Khoai tây chiên" (20k)
Quán C (Quán Phở):
Món 1: "Phở bò" (45k)
Luồng chạy của Code với input dish_name = "com ga"
Bước 1: Tìm món ăn (Query Database)
Lệnh: MenuEntity.find({"name": {"$regex": "com ga", "$options": "i"}})
Logic: Nó quét toàn bộ menu của tất cả các quán, tìm những tên món có chứa cụm từ liên tiếp "com ga".
Kết quả:
Quán A: Nhặt được "Cơm gà xối mỡ", "Cơm gà luộc".
Quán B: Bị loại. Dù có bán "Gà" nhưng tên món là "Gà rán KFC" (không có chữ "Cơm" đi kèm liền kề hoặc không khớp chuỗi regex tùy vào cách bạn viết regex, thường tìm cụm từ thì phải dính nhau). Lưu ý: Nếu regex lỏng hơn thì có thể dính, nhưng giả sử tìm chính xác cụm từ.
Quán C: Bị loại.
=> Danh sách menus thu được: [Món A2, Món A3].
Bước 2 & 3: Lấy danh sách nhà hàng
Từ danh sách 2 món trên, code thấy cả 2 đều thuộc Quán A.
Danh sách restaurant_ids = [ID_Quan_A].
Code gọi DB lấy thông tin chi tiết của Quán A. Các quán B và C bị bỏ qua hoàn toàn.
Bước 4: Nhóm món (Grouping)
Code tạo ra một cái map:
Quán A => Danh sách món: [Cơm gà xối mỡ, Cơm gà luộc].
Lưu ý: Món "Cơm sườn" của Quán A không xuất hiện ở đây vì nó đã bị lọc từ Bước 1 rồi.
Bước 5: Tính giá trung bình & Format
Hàm tính toán sẽ chạy trên danh sách món đã lọc của Quán A:
Giá Món A2 = 50k
Giá Món A3 = 40k
avg_price = (50 + 40) / 2 = 45k.
Thông tin trả về của Quán A sẽ có matched_menus chỉ chứa 2 món gà này.
Bước 6: Sắp xếp & Trả về
Vì chỉ tìm thấy 1 Quán A, nên nó đứng đầu danh sách.
Kết quả JSON trả về cho người dùng:
code
JSON
{
"success": True,
"message": "Found 1 restaurants with 'com ga'",
"restaurants": [
{
"name": "Quán A (Chuyên Cơm)",
"avg_price": 45000,
"matched_menus": [
{"name": "Cơm gà xối mỡ", "price": 50000},
{"name": "Cơm gà luộc", "price": 40000}
],
"menu_count": 2 // Tìm thấy 2 món khớp
}
]
}

User: Gõ "Bún bo" vào ô tìm kiếm.
App: Gửi POST /search/match_name?keyword=Bún bo.
Server: Quét nhanh bảng Menu -> Trả về: mon an tuong ung voi nha hang khop voi bún bo

User: thấy nhiều quá ko bt chọn cái nào nên app gui request
App: Gửi POST /search/wantSort?sort_by=distance&l
Server: Lúc này mới chạy logic sort list nha hang tren
Sắp xếp.
Trả về danh sách quán.
