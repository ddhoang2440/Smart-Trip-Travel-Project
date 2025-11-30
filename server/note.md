# some thing need to know

## configuration

**Nhóm Core (Nền tảng chạy ứng dụng)**

- fastapi: Đây là framework chính bạn đang dùng để viết code Backend. Nó nổi tiếng vì tốc độ rất nhanh (gần bằng Go/NodeJS), dễ viết, hỗ trợ bất đồng bộ (async) và tự động tạo trang tài liệu API (Swagger UI).
- uvicorn: FastAPI chỉ là framework (bộ quy tắc code), nó cần một cái Server để chạy được. uvicorn chính là cái Server đó (ASGI Server). Nó đóng vai trò như "cái máy" để khởi chạy ứng dụng FastAPI của bạn.
  **Nhóm Xử lý dữ liệu & Cấu hình**
- pydantic: Thư viện dùng để kiểm tra dữ liệu (Data Validation). Ví dụ: Bạn quy định field age phải là số nguyên (int). Nếu frontend gửi lên chữ cái, pydantic sẽ báo lỗi ngay. FastAPI dùng cái này rất nhiều.
- pydantic-settings: Một phần mở rộng của Pydantic, chuyên dùng để quản lý Cấu hình (Settings). Nó giúp đọc các biến môi trường và đảm bảo chúng đúng kiểu dữ liệu (như file settings.py bạn đã gửi).
- .env: Đây không phải thư viện, mà là một file chứa các bí mật (biến môi trường) như mật khẩu DB, Secret Key... File này không bao giờ được up lên Git.
- python-dotenv: Thư viện giúp code Python đọc được nội dung trong file .env và nạp chúng vào hệ thống để sử dụng.
  **Nhóm Tiện ích & Upload**
- python-multipart: Thư viện này cần thiết khi bạn muốn nhận dữ liệu dạng Form (multipart/form-data). Bắt buộc phải có nếu bạn làm tính năng Upload file (ảnh, video) hoặc dùng cơ chế đăng nhập OAuth2 mặc định của FastAPI.
- cloudinary: Thư viện SDK của dịch vụ Cloudinary. Giúp bạn upload ảnh món ăn, avatar user lên mây (cloud) và lấy link về lưu vào database, thay vì lưu file trực tiếp vào server.
- email-validator: Một thư viện nhỏ giúp kiểm tra xem một chuỗi ký tự có phải là email hợp lệ hay không (ví dụ: kiểm tra có @, có tên miền gmail.com hay không).
  **Nhóm Bảo mật (Authentication)**
- passlib[bcrypt]:

* passlib: Thư viện quản lý việc băm (hashing) mật khẩu.
* [bcrypt]: Là thuật toán mã hóa cụ thể được cài kèm. Nó giúp biến mật khẩu "123456" thành một chuỗi ký tự loằng ngoằng không thể dịch ngược, đảm bảo an toàn nếu database bị lộ.

- python-jose: Thư viện xử lý JWT (JSON Web Token). Dùng để tạo ra token khi đăng nhập (encode) và kiểm tra token khi người dùng gửi request (decode).

**Nhóm Tiện ích & Upload**
python-multipart: Thư viện này cần thiết khi bạn muốn nhận dữ liệu dạng Form (multipart/form-data). Bắt buộc phải có nếu bạn làm tính năng Upload file (ảnh, video) hoặc dùng cơ chế đăng nhập OAuth2 mặc định của FastAPI.
cloudinary: Thư viện SDK của dịch vụ Cloudinary (Thư viện này chỉ là SDK để gọi API Cloudinary). Giúp bạn upload ảnh món ăn, avatar user lên mây (cloud) và lấy link về lưu vào database, thay vì lưu file trực tiếp vào server,Cloudinary: Không lưu ảnh trực tiếp vào server (tránh đầy ổ cứng) mà lưu trên cloud chuyên dụng, Cloudinary Nó là một dịch vụ online, giống như Google Drive nhưng chuyên cho ảnh/video.
email-validator: Một thư viện nhỏ giúp kiểm tra xem một chuỗi ký tự có phải là email hợp lệ hay không (ví dụ: kiểm tra có @, có tên miền gmail.com hay không).

## folder config

- Motor: là async MongoDB driver. Nó cung cấp các hàm để kết nối, đọc, ghi dữ liệu từ MongoDB nhưng là low-level, bạn thao tác với dicts/JSON trực tiếp.
- Beanie: là ODM (Object-Document Mapper) built on top of Motor. Nó giúp bạn dùng class Python để đại diện cho document, dễ thao tác, validate dữ liệu, và hỗ trợ async.
  **Beanie được xây dựng trên Motor**: Khi bạn thao tác với Beanie (CRUD, query), Beanie thực chất gọi các hàm async của Motor để giao tiếp trực tiếp với MongoDB, beanie chi quan ly cac document class ma ban dinh nghia, con thao tac truc tiep voi collection dung motor
- Document là một class Python đại diện cho một type của document trong MongoDB, Khi bạn tạo class kế thừa Document, Beanie sẽ tự động map class đó tới một collection trong MongoDB (tên collection mặc định là tên class viết thường, nhưng bạn có thể đổi).

```bash
    class User(Document):
        name: str
        age: int
User là Document class.
Beanie sẽ tạo collection tên là "user" trong MongoDB (mặc định) để lưu các document instances của User.
```

# cau truc code

Dựa trên các đoạn code bạn cung cấp, hệ thống này được xây dựng theo kiến trúc Layered Architecture (Kiến trúc phân lớp) sử dụng FastAPI (Python web framework) và MongoDB (cơ sở dữ liệu NoSQL) thông qua thư viện Beanie (ODM).
Hệ thống chia thành 3 lớp chính:
Data Layer (Entity/Model): Định nghĩa cấu trúc dữ liệu lưu trong MongoDB (menu_entity.py, database.py).
Service Layer (Logic): Xử lý nghiệp vụ logic, tính toán, gọi database, xử lý ảnh (menu_service.py).
Controller Layer (Route): Tiếp nhận request từ người dùng (Frontend/App), gọi Service và trả về kết quả (menu_route.py)

```bash
Ví dụ 1: Khi tạo mới một món ăn (POST /menu/create)
Client gửi Request (Tên món, giá, file ảnh...) tới menu_route.py.
Route kiểm tra current_user. Nếu hợp lệ, chuyển dữ liệu sang MenuService.create_menu.
Service:
Gửi file ảnh lên Cloudinary -> Nhận về URL ảnh.
Tạo MenuEntity với URL ảnh và ID nhà hàng.
Gọi Beanie để lưu xuống MongoDB.
Database: Lưu document mới vào collection menus.
Service trả về kết quả {"success": True, ...} cho Route -> Route trả về cho Client.
Ví dụ 2: Khi lấy danh sách món ăn của một quán (GET /menu/restaurant/{id})
Client gọi API kèm ID quán (ví dụ: .../restaurant/65a1b2...).
Route nhận ID, gọi MenuService.get_restaurant_menu(id).
Service:
Dùng Beanie tìm trong collection menus các món có restaurant == id.
Lấy danh sách kết quả.
Chạy hàm _format_menu_list để chuyển đổi _id thành string và thêm thông tin tên quán vào từng món.
Service trả về danh sách JSON đã format cho Client.

Vì bạn đã public password trong .env, nên nên đổi password MongoDB Atlas ngay:

Vào MongoDB Atlas → Database Access
Edit user admin → Change password
Update lại trong .env

```

##

`cloud`
Cloud (điện toán đám mây) là mô hình công nghệ cho phép truy cập tài nguyên máy tính như lưu trữ, máy chủ, mạng và ứng dụng thông qua internet, thay vì sử dụng phần cứng vật lý tại chỗ. ￼

Đặc điểm chính
• Lưu trữ và xử lý dữ liệu: Dữ liệu được lưu trữ và xử lý trên máy chủ từ xa, giúp truy cập từ bất kỳ thiết bị nào có kết nối internet. ￼

• Tính linh hoạt: Người dùng có thể mở rộng hoặc thu hẹp tài nguyên dễ dàng theo nhu cầu. ￼

• Tiết kiệm chi phí: Không cần đầu tư vào phần cứng vật lý, giảm chi phí bảo trì và nâng cấp. ￼

Ứng dụng

• Dịch vụ cá nhân: Lưu trữ dữ liệu như Google Drive, iCloud; xem phim qua Netflix. ￼

• Doanh nghiệp: Quản lý cơ sở dữ liệu, triển khai phần mềm qua các mô hình như IaaS, PaaS, SaaS. ￼

• Giải pháp chuyên biệt: Cloud PC cho phép sử dụng máy tính ảo từ xa, Cloud Phone hỗ trợ tạo thiết bị ảo. ￼

## some note about mongodb atlas

**MongoDB Atlas = MongoDB chay tren cloud, san sang dung, ko can lam gi**

- "Cloud" = máy chủ (server) đặt ở trung tâm dữ liệu của các công ty lớn như Google, Amazon, MongoDB…
  Bạn không nhìn thấy, không chạm vào, nhưng bạn có thể truy cập qua Internet, Cloud = máy tính của người khác, chạy 24/7, cực mạnh, bạn dùng qua Internet.

- Kết nối bản Cloud nghĩa là không cài MongoDB trên máy, mà dùng MongoDB chạy trên máy chủ của MongoDB Atlas (dịch vụ đám mây do MongoDB cung cấp).
  → Bạn chỉ cần tạo 1 tài khoản, tạo 1 database online, rồi lấy connection string để kết nối.
- cloud ko luu anh truc tiep ma luu theo link hoac file binary, mongodb campuss chi la phan mem de xem du lieu, nhung that chat compass ket noi toi 2 loại database thật: local (mongodb://localhost:27017) va . Kết nối CLOUD (Atlas) → mongodb+srv://...

```bash
MongoDB Atlas là gì?
MongoDB Atlas = dịch vụ miễn phí/ trả phí dùng để:
Lưu dữ liệu trên cloud
Kết nối từ backend FastAPI, NodeJS, Python
Không cần tự cài đặt MongoDB
Miễn phí 500 MB (đủ cho học và làm project nhỏ)
```
