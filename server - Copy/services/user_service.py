import cloudinary
import cloudinary.uploader
from fastapi import UploadFile
from email_validator import validate_email, EmailNotValidError
from entities.user_entity import UserEntity
from config.security import hash_password, verify_password, create_access_token
from config.settings import settings
from models.user_model import SignUpRequest, SignInRequest

# Cấu hình Cloudinary
cloudinary.config(
    cloud_name=settings.CLOUDINARY_CLOUD_NAME,
    api_key=settings.CLOUDINARY_API_KEY,
    api_secret=settings.CLOUDINARY_API_SECRET
)

class UserService:
    
    # =========================================================================
    # 1. SIGN IN (ĐĂNG NHẬP)
    # =========================================================================
    @staticmethod
    async def signin_service(data: SignInRequest):
        print("Starting signin Route:") # Log giống nodejs
        
        # 1. Validate Email
        try:
            validate_email(data.email, check_deliverability=False)
            print(f"Email is valid! {data.email}")
        except EmailNotValidError:
             print("Wrong email syntax!, return ...")
             return {"success": False, "message": "Wrong Email Syntax !"}

        # 2. Tìm user
        user = await UserEntity.find_one(UserEntity.email == data.email)
        
        if not user:
            print("User not found !, return ...")
            return {"success": False, "message": "Email not found!"}
        
        print("User founded !")

        # 3. Check Password
        if not verify_password(data.password, user.password):
            print("Wrong password !, return ...")
            return {"success": False, "message": "Password Incorrect!"}

        print("Create Token ...")
        # 4. Tạo Token
        token = create_access_token(data={"sub": str(user.id)})
        
        print(f"User {user.username} login Successfully!")

        # 5. Trả về kết quả 
        return {
            "success": True,
            "message": "Login successfully!",
            "user": {
                "username": user.username,
                "email": user.email,
                "image": user.image,
                "allergy": user.allergy,
                "contact": user.contact
            },
            "token": token
        }

    # =========================================================================
    # 2. SIGN UP (ĐĂNG KÝ)
    # =========================================================================
    @staticmethod
    async def signup_service(data: SignUpRequest):
        print("Starting signup Route: ")
        
        # 1. Check tài khoản tồn tại
        existing_user = await UserEntity.find_one(UserEntity.email == data.email)
        if existing_user:
            print("Account exist !")
            return {"success": False, "message": "Account exist!"}

        # 2. Hash Password & Tạo User
        # Logic cũ: const salt = await bcrypt.genSalt(10); const hashPass = ...
        hashed_pass = hash_password(data.password)
        
        # Logic khởi tạo: image, contact, image_url là rỗng
        new_user = UserEntity(
            username=data.username,
            email=data.email,
            password=hashed_pass,
            image="", 
            contact="", 
            image_url=""
        )
        await new_user.insert()

        # 3. Tạo Token
        token = create_access_token(data={"sub": str(new_user.id)})

        print(f"Create accout {new_user.username} successfully!")

        # 4. Trả về (Giữ nguyên lỗi chính tả 'accout' để khớp Frontend cũ)
        return {
            "success": True, 
            "message": "Create accout successfully!", 
            "user": {
                "username": new_user.username, 
                "email": new_user.email,
                "image": new_user.image
            }, 
            "token": token
        }

    # =========================================================================
    # 3. PROFILE (CẬP NHẬT THÔNG TIN)
    # =========================================================================
    @staticmethod
    async def update_profile(current_user: UserEntity, username: str, password: str, contact: str, allergy: str, file: UploadFile):
        print("Starting profile change Route:")
        try:
            print(f"Receiver Data Successfully!, email: {current_user.email}")
            
            result_cloud = None
            
            # 1. Xử lý Upload file (Nếu có)
            if file:
                print("Upload file...")
                # Upload lên folder 'users' trên Cloudinary
                result_cloud = cloudinary.uploader.upload(file.file, folder="users")
            
            # 2. Xóa ảnh cũ (Nếu có ảnh mới VÀ ảnh cũ tồn tại)
            if current_user.image_url and file:
                 print("Delete Old Image")
                 cloudinary.uploader.destroy(current_user.image_url, invalidate=True)

            # 3. Hash mật khẩu mới (Nếu có gửi lên)
            # Logic cũ: let hashPass = _user.password; if(data.password) ...
            hash_pass = current_user.password
            if password:
                print("Hass Password...")
                hash_pass = hash_password(password)

            # 4. Cập nhật thông tin (New Profile Object logic)
            
            # username: data.username || user.username
            if username:
                current_user.username = username
            
            current_user.password = hash_pass
            
            # image & image_url: result? result.secure_url : user.image
            if result_cloud:
                current_user.image = result_cloud.get("secure_url")
                current_user.image_url = result_cloud.get("public_id")

            # allergy: data.allergy ? split... : user.allergy
            if allergy is not None: # Kiểm tra khác None để cho phép xóa rỗng nếu gửi chuỗi rỗng
                if allergy.strip() == "":
                     current_user.allergy = [] # Nếu gửi chuỗi rỗng thì xóa hết
                else:
                     current_user.allergy = [a.strip() for a in allergy.split(",") if a.strip() != ""]
            
            # contact: data.contact.length === 10 ? data.contact : user.contact
            if contact and len(contact) == 10:
                current_user.contact = contact

            # Lưu vào DB
            await current_user.save()
            
            print("Replace user profile with new profile...")
            return {
                "success": True, 
                "message": "Profile changed successfully!", 
                "user": current_user # Beanie tự convert sang dict
            }
        except Exception as e:
            print(f"Profile error message: {str(e)}")
            return {"success": False, "message": "Profile changed fail!"}

    # =========================================================================
    # 4. AUTH CHECK
    # =========================================================================
    @staticmethod
    async def auth_check(current_user: UserEntity):
        print("Starting authCheck Route:")
        if not current_user:
             print("User not found !")
             return {"success": False, "message": "Auth not Found!"}
        
        print(f"User Founded! {current_user.email}")
        return {
            "success": True,
            "message": "Auth found successfully!",
            "user": {
                "username": current_user.username,
                "email": current_user.email,
                "image": current_user.image,
                "allergy": current_user.allergy
            }
        }

    # =========================================================================
    # 5. AUTH DELETE
    # =========================================================================
    @staticmethod
    async def auth_delete(current_user: UserEntity):
        print("Starting Delete Account Route: ")
        try:
            # Logic cũ: Xóa menu, restaurant trước (Tạm thời bỏ qua vì chưa có Entity Restaurant)
            # const _restaurant = await Restaurant.find({owner: _id}); ...
            
            # Xóa ảnh đại diện
            if current_user.image_url:
                await cloudinary.uploader.destroy(current_user.image_url, invalidate=True)
            
            # Xóa User
            email = current_user.email
            await current_user.delete()
            
            print(f"Delete Account {email} Successfully")
            print("End Route")
            
            return {"success": True, "message": "Delete Account Successfully !"}
        except Exception as e:
            print(f"AuthDelete error message: {str(e)}")
            print("End Route! ")
            return {"success": False, "message": "Error while Delete Account !"}