from typing import List, Dict, Any
from datetime import datetime

OPERATOR_MAP = {
    "<": "$lt",
    "<=": "$lte",
    ">": "$gt",
    ">=": "$gte",
    "=": "$eq",
    "!=": "$ne",
    "range": "range"
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
                    {"open_hour": {"$gte": current}},
                    {"close_hour": {"$lte": current}}
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

def build_filterspec_from_ai_json(fields: Dict) -> List[FilterSpec]:
    """
    Convert AI JSON (intent: search) directly to list of FilterSpec
    """
    filters: List[FilterSpec] = []
    # --- res_name ---
    if fields.get("res_name") and fields["res_name"].get("value"):
        filters.append(FilterSpec("name", "=", fields["res_name"]["value"]))

    # --- cuisine / tags / utils ---
    tags = []
    for key in ["cuisine", "tags"]:
        if fields.get(key) and fields[key].get("value"):
            val = fields[key]["value"]
            tags.extend(val if isinstance(val, list) else [val])
    for t in tags:
        filters.append(FilterSpec("type", "=", t))

    # --- open_now ---
    if fields.get("open_now") and fields["open_now"].get("value") is True:
        filters.append(FilterSpec("open_now", "=", True))

    # --- price_range ---
    if fields.get("price_range") and fields["price_range"].get("value"):
        pr = fields["price_range"]["value"]
        if pr.get("min") is not None or pr.get("max") is not None:
            filters.append(FilterSpec("price", "range", {"min": pr.get("min"), "max": pr.get("max")}))

    # --- rating_min ---
    if fields.get("rating") and fields["rating"].get("value") is not None:
        filters.append(FilterSpec("rating", fields["rating"]["operator"], float(fields["rating"]["value"])))

    # --- distance_km ---
    if fields.get("distance_km") and fields["distance_km"].get("value") is not None:
        filters.append(FilterSpec("distance_km", "<=", fields["distance_km"]["value"]))

    # --- location ---
    if fields.get("location") and fields["location"].get("canonical"):
        loc = fields["location"]["canonical"]
        if loc.get("district"):
            filters.append(FilterSpec("district", "=", loc["district"]))

    # --- extra filters ---
    if fields.get("filters"):
        for k, v in fields["filters"].items():
            if v is None:
                continue
            if isinstance(v, dict) and "operator" in v and "value" in v:
                filters.append(FilterSpec(k, v["operator"], v["value"]))
            else:
                filters.append(FilterSpec(k, "=", v))
    return filters
