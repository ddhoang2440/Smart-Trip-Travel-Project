from fastapi import HTTPException
from models.Restaurant import restaurants
from pydantic import BaseModel
from typing import List, Optional

class MenuItem(BaseModel):
    food_name: str
    description: Optional[str] = None
    price: int
    signature_dish: Optional[bool] = False
    allergy_info: Optional[List[str]] = []

class MenuItemUpdate(BaseModel):
    food_name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[int] = None
    signature_dish: Optional[bool] = False
    allergy_info: Optional[List[str]] = []

class MenuFilter(BaseModel):
    food_name: Optional[str]
    min_price: Optional[int]
    max_price: Optional[int]
    signature_dish: Optional[bool]
    exclude_allergens: Optional[List[str]] = []

def get_menu_items(restaurant_id: int):
    try:
        menu = restaurants.find_one(
            {"restaurant.restaurant_id": restaurant_id},
            {"_id": 0, "restaurant.details.menu": 1}
        )
        if not menu:
            raise HTTPException(status_code=404, detail="Restaurant not found")
        return menu["restaurant"]["details"]["menu"]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

def add_food_item(restaurant_id: int, food_item: MenuItem):
    try:
        restaurant = restaurants.find_one({"restaurant.restaurant_id": restaurant_id})
        if not restaurant:
            raise HTTPException(status_code=404, detail="Restaurant not found")
        menu = restaurant["restaurant"]["details"]["menu"]
        for item in menu:
            if item["food_name"].lower() == food_item.food_name.lower():
                raise HTTPException(status_code=400, detail="Food item already exists")
        id = len(menu) + 1
        data = food_item.dict()
        data["food_id"] = id
        food = restaurants.update_one(
            {"restaurant.restaurant_id": restaurant_id},
            {"$push": {"restaurant.details.menu": data}}
        )
        if food.matched_count == 0:
            raise HTTPException(status_code=404, detail="Restaurant not found")
        return {"message": "Food item added successfully"}, 201
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

def update_food_item(restaurant_id: int, food_id: int, food_item: MenuItemUpdate):
    try:
        update_data = {f"restaurant.details.menu.$.{key}": val for key, val in food_item.dict(exclude_unset=True).items()}
        if not update_data:
            raise HTTPException(status_code=400, detail="No fields to update")
        result = restaurants.update_one(
            {"restaurant.restaurant_id": restaurant_id, "restaurant.details.menu.food_id": food_id},
            {"$set": update_data}
        )
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Food item not found")
        return {"message": "Food item updated successfully"}, 200
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

def delete_food_item(restaurant_id: int, food_id: int):
    try:
        result = restaurants.update_one(
            {"restaurant.restaurant_id": restaurant_id},
            {"$pull": {"restaurant.details.menu": {"food_id": food_id}}}
        )
        if result.modified_count == 0:
            raise HTTPException(status_code=404, detail="Food item not found")
        return {"message": "Food item deleted successfully"}, 200
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
def filter_menu_items(filters: MenuFilter):
    try:
        element_match = {}
        if filters.food_name:
            element_match["food_name"] = {"$regex": filters.food_name, "$options": "i"}
        if filters.min_price is not None or filters.max_price is not None:
            price_filter = {}
            if filters.min_price is not None:
                price_filter["$gte"] = filters.min_price
            if filters.max_price is not None:
                price_filter["$lte"] = filters.max_price
            element_match["price"] = price_filter
        if filters.signature_dish is not None:
            element_match["signature_dish"] = filters.signature_dish
        if filters.exclude_allergens:
            element_match["allergy_info"] = {"$nin": filters.exclude_allergens}
        
        query = {"restaurant.details.menu": {"$elemMatch": element_match}}
        restaurants_list = list(restaurants.find(query, {"_id": 0, "restaurant.details.menu.$": 1, 
                                                         "restaurant.name": 1, "restaurant.restaurant_id": 1}))
        filtered_items = []
        for res in restaurants_list:
            filtered_items.extend(res["restaurant"]["details"]["menu"])
        return {"filtered_menu_items": filtered_items}, 200
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))