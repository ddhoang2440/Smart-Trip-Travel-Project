from fastapi import Query

from services.restaurantService import get_restaurant_service

# Restaurant List
def get_restaurant_control(type: str = Query(None), max_price: float = Query(None)):
    return get_restaurant_service(type, max_price)