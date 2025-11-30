import requests
import json

# 1. CẤU HÌNH
API_URL = "http://localhost:3000/voucher/create"
# Dán token của Admin vào đây (Lấy từ Swagger/Login)
TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2OTIxZTg3YjQwM2MxMmNkMDVmMzdiNjkiLCJleHAiOjE3NjY0MzI2MzF9._WrjQeT-h-Zrp7Ab_plWcd_mXvAm7N2z94Th_Pht7C4" 

# Cấu hình Voucher muốn tạo
VOUCHER_CONFIG = {
    "discount": 10000,      # Giảm 10k
    "type": "AMOUNT",       # Giảm tiền trực tiếp
    "limit": 1,             # Mỗi mã chỉ dùng 1 lần
    # Không gửi 'code' để server tự sinh ngẫu nhiên
}

# Số lượng muốn tạo
QUANTITY = 10

def generate():
    headers = {
        "Authorization": f"Bearer {TOKEN}",
        "Content-Type": "application/json"
    }
    
    success_count = 0
    created_codes = []

    print(f"Bắt đầu tạo {QUANTITY} mã giảm giá...")

    for i in range(QUANTITY):
        try:
            response = requests.post(API_URL, headers=headers, json=VOUCHER_CONFIG)
            if response.status_code == 200:
                data = response.json()
                if data.get("success"):
                    code = data['voucher']['code']
                    print(f"[{i+1}/{QUANTITY}] Tạo thành công: {code}")
                    created_codes.append(code)
                    success_count += 1
                else:
                    print(f"[{i+1}/{QUANTITY}] Lỗi: {data.get('message')}")
            else:
                print(f"[{i+1}/{QUANTITY}] HTTP Error: {response.status_code}")
        except Exception as e:
            print(f"Lỗi kết nối: {e}")

    print("\n" + "="*30)
    print(f"Hoàn tất! Đã tạo {success_count}/{QUANTITY} mã.")
    print("Danh sách mã:", created_codes)

if __name__ == "__main__":
    generate()