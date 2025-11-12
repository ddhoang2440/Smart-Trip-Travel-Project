from fastapi import APIRouter

from controllers.menuController import get_menu_control, add_food_control, update_food_control, delete_food_control, filter_menu_control
from entities.Menu import Menu, MenuUpdate, MenuFilter

menu_service = APIRouter()

@menu_service.get("/{restaurant_id}/items")
def get_menu(restaurant_id: int):
    return get_menu_control(restaurant_id)

@menu_service.post("/{restaurant_id}/add")
def add_food(restaurant_id: int, food_item: Menu):
    return add_food_control(restaurant_id, food_item)

@menu_service.put("/{restaurant_id}/update/{food_id}")
def update_food(restaurant_id: int, food_id: int, food_item: MenuUpdate):
    return update_food_control(restaurant_id, food_id, food_item)

@menu_service.delete("/{restaurant_id}/delete/{food_id}")
def delete_food(restaurant_id: int, food_id: int):
    return delete_food_control(restaurant_id, food_id)

@menu_service.post("/filter")
def filter_menu(filters: MenuFilter):
    return filter_menu_control(filters)