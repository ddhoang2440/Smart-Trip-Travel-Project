from fastapi import HTTPException

from services.menuService import get_menu_service, add_food_service, update_food_service, delete_food_service, filter_menu_service
from entities.Menu import Menu, MenuUpdate, MenuFilter

# Get menu items for a restaurant
def get_menu_control(restaurant_id: int):
    try:
        result = get_menu_service(restaurant_id)
        if result is None:
            raise HTTPException(status_code=404, detail="Restaurant not found")
        return {
            "message": "Get menu successfully",
            "menu": result
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Add a new food item to the menu
def add_food_control(restaurant_id: int, food_item: Menu):
    try:
        result = add_food_service(restaurant_id, food_item)
        if result is None:
            raise HTTPException(status_code=404, detail="Restaurant not found")
        if result == "exists":
            raise HTTPException(status_code=400, detail="Food item already exists")
        return {
            "message": "Food item added successfully",
            "menu": result
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Update an existing food item in the menu
def update_food_control(restaurant_id: int, food_id: int, food_item: MenuUpdate):
    try:
        result = update_food_service(restaurant_id, food_id, food_item)
        if result is None:
            raise HTTPException(status_code=404, detail="Restaurant not found")
        if result == "notfound":
            raise HTTPException(status_code=404, detail="Food item not found")
        if result == "nofields":
            raise HTTPException(status_code=400, detail="No fields to update")
        return {
            "message": "Food item updated successfully",
            "menu": result
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Delete a food item from the menu
def delete_food_control(restaurant_id: int, food_id: int):
    try:
        result = delete_food_service(restaurant_id, food_id)
        if result is None:
            raise HTTPException(status_code=404, detail="Restaurant not found")
        if result == "notfound":
            raise HTTPException(status_code=404, detail="Food item not found")
        return {
            "message": "Food item deleted successfully",
            "menu": result
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Filter menu items based on criteria
def filter_menu_control(filters: MenuFilter):
    try:
        filtered_items = filter_menu_service(filters)
        if not filtered_items:
            raise HTTPException(status_code=404, detail="No menu items found matching the criteria")
        return {
            "message": "Menu items filtered successfully",
            "menu_items": filtered_items
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))