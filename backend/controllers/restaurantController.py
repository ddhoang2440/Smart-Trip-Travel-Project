from fastapi import Query, HTTPException

from services.restaurantService import get_restaurant_service

# Restaurant List
def get_restaurant_control(type: str = Query(None), max_price: float = Query(None)):
    try:
        restaurants = get_restaurant_service(type, max_price)
        if not restaurants:
            raise HTTPException(status_code=404, detail="No restaurants found")
        return restaurants
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))