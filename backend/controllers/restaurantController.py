from fastapi import Query, HTTPException
from models.Restaurant import restaurants

def get_restaurant_list(r_type: str = Query(None), r_price: float = Query(None)):
    try:
        query = {}

        if r_type is not None:
            query["restaurant.type"] = r_type

        if r_price is not None:
            query["restaurant.details.menu"] = {
                "$elemMatch": {"price": {"$lte": r_price}}
            }

        res_list = list(restaurants.find(query, {"_id": 0}))
        return {"restaurants": res_list}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))