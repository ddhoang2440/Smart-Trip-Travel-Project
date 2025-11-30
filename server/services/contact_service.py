from entities.contact_entity import ContactEntity

class ContactService:
    @staticmethod
    async def send_contact(name: str, email: str, subject: str, message: str):
        try:
            new_contact = ContactEntity(
                name=name,
                email=email,
                subject=subject,
                message=message
            )
            await new_contact.insert()
            
            return {"success": True, "message": "Send contact successfully!"}
        except Exception as e:
            print(f"Error send contact: {e}")
            return {"success": False, "message": "Send contact failed!"}