from typing import List, Optional
from fastapi import Query, HTTPException

from models.restaurantModel import restaurants
from entities.Restaurant import Restaurant

# Get list of restaurants
def get_restaurant_service(r_type: Optional[str] = Query(None), r_price: Optional[float] = Query(None)):
    try:
        query = {}

        if r_type is not None:
            query["restaurant.type"] = r_type

        if r_price is not None:
            query["restaurant.details.menu"] = {
                "$elemMatch": {"price": {"$lte": r_price}}
            }

        raw_restaurants = list(restaurants.find(query, {"_id": 0, "restaurant": 1}))
        restaurant_list = []
        for item in raw_restaurants:
            restaurant_data = item.get("restaurant", {})
            restaurant_obj = Restaurant(**restaurant_data)
            restaurant_list.append(restaurant_obj)
        return {"restaurants": restaurant_list}, 200
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))