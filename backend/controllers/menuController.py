from services.menuService import get_menu_service, add_food_service, update_food_service, delete_food_service, filter_menu_service
from entities.Menu import Menu, MenuUpdate, MenuFilter

# Get menu items for a restaurant
def get_menu_control(restaurant_id: int):
    return get_menu_service(restaurant_id)

# Add a new food item to the menu
def add_food_control(restaurant_id: int, food_item: Menu):
    return add_food_service(restaurant_id, food_item)

# Update an existing food item in the menu
def update_food_control(restaurant_id: int, food_id: int, food_item: MenuUpdate):
    return update_food_service(restaurant_id, food_id, food_item)

# Delete a food item from the menu
def delete_food_control(restaurant_id: int, food_id: int):
    return delete_food_service(restaurant_id, food_id)

# Filter menu items based on criteria
def filter_menu_control(filters: MenuFilter):
    return filter_menu_service(filters)