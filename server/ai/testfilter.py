from typing import List, Dict, Any
from datetime import datetime

from entities.restaurant_entity import RestaurantEntity
from entities.menu_entity import MenuEntity

OPERATOR_MAP = {
    "<": "$lt",
    "<=": "$lte",
    ">": "$gt",
    ">=": "$gte",
    "=": "$eq",
    "!=": "$ne",
    "range": "range",
    "in": "$in"
}

class FilterSpec:
    def __init__(self, field: str, operator: str, value: Any):
        self.field = field
        self.operator = operator
        self.value = value

    def to_mongo(self) -> Dict:
        # --- SPECIAL CASE: "open_now" ---
        if self.field == "open_now" and self.value is True:
            current = datetime.now().strftime("%H:%M")
            return {
                "$and": [
                    {"open_hour": {"$lte": current}},
                    {"close_hour": {"$gte": current}}
                ]
            }

        # --- LIST: use $in ---
        if isinstance(self.value, list):
            return {self.field: {"$in": self.value}}

        # --- STRING: regex match ---
        if isinstance(self.value, str) and self.operator == "=":
            return {self.field: {"$regex": self.value, "$options": "i"}}

        # --- BOOL match ---
        if isinstance(self.value, bool) and self.operator == "=":
            return {self.field: self.value}

        # --- RANGE SPECIAL CASE ---
        if self.operator == "range" and isinstance(self.value, dict):
            rng = {}
            if "min" in self.value and self.value["min"] is not None:
                rng["$gte"] = self.value["min"]
            if "max" in self.value and self.value["max"] is not None:
                rng["$lte"] = self.value["max"]
            return {self.field: rng}

        mongo_op = OPERATOR_MAP.get(self.operator)
        if mongo_op is None:
            raise ValueError(f"Unsupported operator {self.operator}")
        return {self.field: {mongo_op: self.value}}

def build_filter(filters: List[FilterSpec], logic: str = "AND") -> Dict:
    conds = [f.to_mongo() for f in filters]
    if not conds:
        return {}
    if logic.upper() == "OR":
        return {"$or": conds}
    return {"$and": conds}

def build_restaurant_filterspec_from_json(fields: Dict) -> List[FilterSpec]:
    """
    Convert AI JSON (intent: search) directly to list of FilterSpec
    """
    res_filters: List[FilterSpec] = []
    # --- res_name ---
    if fields.get("res_name") and fields["res_name"].get("value"):
        res_filters.append(FilterSpec("name", "=", fields["res_name"]["value"]))

    # --- cuisine / tags / utils ---
    tags = []
    for key in ["cuisine", "tags"]:
        if fields.get(key) and fields[key].get("value"):
            val = fields[key]["value"]
            tags.extend(val if isinstance(val, list) else [val])
    for t in tags:
        res_filters.append(FilterSpec("type", "=", t))

    # --- open_now ---
    if fields.get("open_now") and fields["open_now"].get("value") is True:
        res_filters.append(FilterSpec("open_now", "=", True))

    # --- res_price ---
    if fields.get("res_price") and fields["res_price"].get("value"):
        pr = fields["res_price"]["value"]
        if pr.get("min") is not None or pr.get("max") is not None:
            res_filters.append(FilterSpec("medium_price", "range", {"min": pr.get("min"), "max": pr.get("max")}))

    # --- rating_min ---
    if fields.get("rating") and fields["rating"].get("value") is not None:
        res_filters.append(FilterSpec("rating", fields["rating"]["operator"], float(fields["rating"]["value"])))

    # --- distance_km ---
    if fields.get("distance_km") and fields["distance_km"].get("value") is not None:
        res_filters.append(FilterSpec("distance_km", "<=", fields["distance_km"]["value"]))

    # --- location ---
    if fields.get("location") and fields["location"].get("canonical"):
        loc = fields["location"]["canonical"]
        if loc.get("district"):
            res_filters.append(FilterSpec("district", "=", loc["district"]))

    # --- extra filters ---
    if fields.get("filters"):
        for k, v in fields["filters"].items():
            if v is None:
                continue
            if isinstance(v, dict) and "operator" in v and "value" in v:
                res_filters.append(FilterSpec(k, v["operator"], v["value"]))
            else:
                res_filters.append(FilterSpec(k, "=", v))
    return res_filters

async def build_food_filter_from_json(fields: Dict) -> List[FilterSpec]:
    """
    Convert AI JSON (intent: search) directly to list of FilterSpec
    """
    food_filters: List[FilterSpec] = []
    # CHECK RESTAURANT FIELDS

    restaurant_fields = [
        "res_name",
        "cuisine",
        "tags",
        "open_now",
        "rating",
        "distance_km",
        "location",
    ]
    res_field = any(fields.get(f) for f in restaurant_fields)
    if res_field:
        res_filters = build_restaurant_filterspec_from_json(fields)
        mongo_res_filter = build_filter(res_filters, logic="AND")

        print("Mongo Restaurant Filter:", mongo_res_filter)
        cursor = RestaurantEntity.find(mongo_res_filter)
        restaurants = await cursor.to_list()

        res_ids = [r.id for r in restaurants]

        if res_ids:
            food_filters.append(FilterSpec("restaurant", "in", res_ids))
        else:
            print("Hello")
            return []  # No matching restaurants, so no food results


    # FOOD FILTERS"

    # --- food_name ---
    if fields.get("food_name") and fields["food_name"].get("value"):
        food_filters.append(FilterSpec("name", "=", fields["food_name"]["value"]))

    # --- food_price ---
    if fields.get("food_price") and fields["food_price"].get("value"):
        pr = fields["food_price"]["value"]
        if pr.get("min") is not None or pr.get("max") is not None:
            food_filters.append(FilterSpec("price", "range", {"min": pr.get("min"), "max": pr.get("max")}))

    # --- dietary_preferences filters ---
    if fields.get("dietary_preferences") and fields["dietary_preferences"].get("value"):
        prefs = fields["dietary_preferences"]["value"]
        prefs_list = prefs if isinstance(prefs, list) else [prefs]
        for pref in prefs_list:
            food_filters.append(FilterSpec("dietary_tags", "=", pref))
    return food_filters