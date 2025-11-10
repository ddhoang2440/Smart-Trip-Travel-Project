from fastapi import APIRouter
from controllers.menuController import get_menu_items, add_food_item, update_food_item, delete_food_item, filter_menu_items
from controllers.menuController import MenuItem, MenuItemUpdate, MenuFilter

menu_service = APIRouter()

@menu_service.get("/{restaurant_id}/items")
def menu_items(restaurant_id: int):
    return get_menu_items(restaurant_id)

@menu_service.post("/{restaurant_id}/add")
def add_food(restaurant_id: int, food_item: MenuItem):
    return add_food_item(restaurant_id, food_item)

@menu_service.put("/{restaurant_id}/update/{food_id}")
def update_food(restaurant_id: int, food_id: int, food_item: MenuItemUpdate):
    return update_food_item(restaurant_id, food_id, food_item)

@menu_service.delete("/{restaurant_id}/delete/{food_id}")
def delete_food(restaurant_id: int, food_id: int):
    return delete_food_item(restaurant_id, food_id)

@menu_service.post("/filter")
def filter_menu(filters: MenuFilter):
    return filter_menu_items(filters)