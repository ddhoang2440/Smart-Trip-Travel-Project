from fastapi import APIRouter, Query
from controllers.restaurantController import get_restaurant_list

restaurant_service = APIRouter()

@restaurant_service.get("/List")
def restaurant_list(
    type: str = Query(None),
    max_price: float = Query(None)
):
    return get_restaurant_list(type, max_price)