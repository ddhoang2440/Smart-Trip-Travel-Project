from fastapi import APIRouter, Query
from controllers.restaurantController import get_restaurant_control

restaurant_service = APIRouter()

@restaurant_service.get("/List")
def get_restaurant(type: str = Query(None),max_price: float = Query(None)):
    return get_restaurant_control(type, max_price)