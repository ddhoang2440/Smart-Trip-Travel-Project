# overview

- there are the 3 file configuration file for a backend project (fastapi + mongodb) because have beanie, They are responsible for Environment Configuration, Database Connection, and Authentication.

**note**

- Backend không hề nhớ (không lưu trạng thái) việc user đã đăng nhập sau khi trả lời xong request đăng nhập.
- Trong lập trình Web API hiện đại (đặc biệt là FastAPI), người ta tuân thủ nguyên tắc Stateless (Phi trạng thái).
- nen moi lan lam gi do, ban phai dinh kem token nhan dang ma backend gui cho ban
  Bạn sẽ thắt mắc: "Sao không để Backend nhớ luôn đi, bắt tôi cầm thẻ làm gì cho cực?"
  Lý do là vì Hiệu năng (Tốc độ) và Khả năng mở rộng (Scaling):
  Tốn Ram: Nếu Backend phải nhớ "Anh A đang đăng nhập", "Chị B đang online"... với 1 triệu người dùng, RAM của server sẽ bị nổ tung. Va 1 token co the chay tren nhieu may chu

## setting

- File này sử dụng thư viện pydantic-settings để quản lý các biến môi trường (environment variables) của dự án.
- Tự động tải các biến từ file .env, Kiểm tra kiểu dữ liệu (Validation) để đảm bảo các biến cấu hình đúng định dạng (ex: port phai la so nguyen)

Khi bạn dùng Beanie với FastAPI, luồng dữ liệu thường như sau:
MongoDB (BSON) -> Beanie (Python Object) -> FastAPI -> JSON (Client)
