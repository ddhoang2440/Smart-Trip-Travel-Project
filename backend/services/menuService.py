from models.restaurantModel import restaurants
from entities.Menu import Menu, MenuUpdate, MenuFilter

def get_menu_service(restaurant_id: int):
    try:
        menu = restaurants.find_one(
            {"restaurant.restaurant_id": restaurant_id},
            {"_id": 0, "restaurant.details.menu": 1}
        )
        if not menu:
            return None
        return menu["restaurant"]["details"]["menu"]
    except Exception as e:
        raise e

def add_food_service(restaurant_id: int, food_item: Menu):
    try:
        menu = get_menu_service(restaurant_id)
        if menu is None:
            return None
        for item in menu:
            if item["food_name"].lower() == food_item.food_name.lower():
                return "exists"
            
        id = max([item.get("food_id", 0) for item in menu] or [0]) + 1
        data = food_item.dict()
        data["food_id"] = id

        restaurants.update_one(
            {"restaurant.restaurant_id": restaurant_id},
            {"$push": {"restaurant.details.menu": data}}
        )
        updated_menu = get_menu_service(restaurant_id)
        return updated_menu
    except Exception as e:
        raise e

def update_food_service(restaurant_id: int, food_id: int, food_item: MenuUpdate):
    try:
        update_data = {f"restaurant.details.menu.$.{key}": val 
                       for key, val in food_item.dict(exclude_unset=True).items()}
        if not update_data:
            return "nofields"
        result = restaurants.update_one(
            {"restaurant.restaurant_id": restaurant_id, "restaurant.details.menu.food_id": food_id},
            {"$set": update_data}
        )
        if result.matched_count == 0:
            return "notfound"
        updated_menu = get_menu_service(restaurant_id)
        if updated_menu is None:
            return None
        return updated_menu
    except Exception as e:
        raise e

def delete_food_service(restaurant_id: int, food_id: int):
    try:
        delete = restaurants.update_one(
            {"restaurant.restaurant_id": restaurant_id},
            {"$pull": {"restaurant.details.menu": {"food_id": food_id}}}
        )
        if delete.modified_count == 0:
            return "notfound"
        updated_menu = get_menu_service(restaurant_id)
        if updated_menu is None:
            return None
        return updated_menu
    except Exception as e:
        raise e
    
def filter_menu_service(filters: MenuFilter):
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
        filtered_items = [
            Menu(**item)
            for restaurant in restaurants_list
            for item in restaurant["restaurant"]["details"]["menu"]
        ]
        return filtered_items
    except Exception as e:
        raise e