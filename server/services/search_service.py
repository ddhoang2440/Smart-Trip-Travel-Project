import math
import traceback
from typing import List, Optional, Union, Dict, Tuple, Set
import asyncio
from beanie import PydanticObjectId
from beanie.operators import In
from entities.restaurant_entity import RestaurantEntity
from entities.menu_entity import MenuEntity
from utils.nlu_engine import RuleBasedNLU
from thefuzz import fuzz


class SortType:
    NONE = "none"
    DISTANCE = "distance"
    RATING = "rating"
    PRICE_LOW = "price_low"
    PRICE_HIGH = "price_high"
    REVIEW_COUNT = "review_count"


class SearchService:
    nlu = RuleBasedNLU()

    # Adjustable parameters
    FUZZY_THRESHOLD = 65  # lower threshold to increase recall; tune by traffic
    MAX_CANDIDATES_PER_KEYWORD = 500  # how many regex results to fetch per keyword
    MAX_MENUS_RETURN = 50
    MAX_RESTAURANTS_RETURN = 20

    # ------------------------- Helpers -------------------------
    @staticmethod
    def _calculate_distance(lat1: Optional[float], lng1: Optional[float], lat2: Optional[float], lng2: Optional[float]) -> Optional[float]:
        try:
            if None in (lat1, lng1, lat2, lng2):
                return None
            R = 6371.0
            lat1_rad = math.radians(float(lat1))
            lng1_rad = math.radians(float(lng1))
            lat2_rad = math.radians(float(lat2))
            lng2_rad = math.radians(float(lng2))
            dlat = lat2_rad - lat1_rad
            dlng = lng2_rad - lng1_rad
            a = math.sin(dlat / 2) ** 2 + math.cos(lat1_rad) * math.cos(lat2_rad) * math.sin(dlng / 2) ** 2
            c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
            return round(R * c, 2)
        except Exception:
            return None

    @staticmethod
    async def _fetch_menus_by_keyword_regex(keyword: str, limit: int) -> List[MenuEntity]:
        # Use a case-insensitive regex search to prune candidate set before fuzzy
        try:
            if not keyword or not keyword.strip():
                return []
            # Escape keyword for regex-ish safety (basic)
            q = keyword.strip()
            cursor = MenuEntity.find({"name": {"$regex": q, "$options": "i"}}).limit(limit)
            return await cursor.to_list()
        except Exception:
            return []

    @staticmethod
    async def _fetch_restaurants_by_ids(rids: List[PydanticObjectId]) -> List[RestaurantEntity]:
        if not rids:
            return []
        try:
            return await RestaurantEntity.find(In(RestaurantEntity.id, rids)).to_list()
        except Exception:
            return []

    @staticmethod
    async def _format_restaurant_with_menus(
        restaurant: RestaurantEntity,
        menus: List[MenuEntity],
        user_lat: Optional[float] = None,
        user_lng: Optional[float] = None,
        menu_score_map: Dict[str, float] = None,
    ) -> dict:
        r_dict = restaurant.dict()
        r_dict["_id"] = str(restaurant.id)
        r_lat = getattr(restaurant, "latitude", None)
        r_lng = getattr(restaurant, "longitude", None)
        r_dict["distance"] = SearchService._calculate_distance(user_lat, user_lng, r_lat, r_lng)

        formatted_menus = []
        prices = []
        total_score = 0

        for m in menus:
            m_dict = m.dict()
            m_dict["_id"] = str(m.id)
            if getattr(m, "created_at", None):
                m_dict["createdAt"] = m.created_at.isoformat()

            score = 0
            if menu_score_map and str(m.id) in menu_score_map:
                score = menu_score_map[str(m.id)]
                m_dict["match_score"] = score

            # collect prices safely
            if getattr(m, "price", None) is not None:
                try:
                    prices.append(float(m.price))
                except Exception:
                    pass

            total_score += score
            formatted_menus.append(m_dict)

        # sort menus by match_score desc
        formatted_menus.sort(key=lambda x: x.get("match_score", 0), reverse=True)

        # compute average price robustly
        avg_price = round(sum(prices) / len(prices), 2) if prices else None

        # compute restaurant-level match score: combine sum of scores + bonus for count
        match_score = total_score + len(formatted_menus) * 3

        r_dict.update({
            "matched_menus": formatted_menus,
            "menu_count": len(formatted_menus),
            "avg_price": avg_price,
            "match_score": match_score,
        })
        return r_dict

    # ------------------------- Core: Optimized Dish Search -------------------------
    @staticmethod
    async def search_dish_and_sort(
        dish_names: Union[str, List[str]],
        user_lat: Optional[float] = None,
        user_lng: Optional[float] = None,
        sort_by: str = SortType.NONE,
        fuzzy_threshold: Optional[int] = None,
        candidate_limit_per_keyword: Optional[int] = None,
    ) -> dict:
        # Defensive params
        fuzzy_threshold = fuzzy_threshold or SearchService.FUZZY_THRESHOLD
        candidate_limit_per_keyword = candidate_limit_per_keyword or SearchService.MAX_CANDIDATES_PER_KEYWORD

        try:
            # normalize input
            keywords = [dish_names] if isinstance(dish_names, str) else (dish_names or [])
            keywords = [k.strip() for k in keywords if isinstance(k, str) and k.strip()]
            if not keywords:
                return {"success": False, "message": "Keywords cannot be empty!"}

            # Step 1: prune menu candidates using regex per keyword (concurrent)
            fetch_tasks = [SearchService._fetch_menus_by_keyword_regex(k, candidate_limit_per_keyword) for k in keywords]
            results = await asyncio.gather(*fetch_tasks)

            # flatten and deduplicate candidate menus (by id)
            candidates: Dict[str, MenuEntity] = {}
            for sub in results:
                for m in sub:
                    candidates[str(m.id)] = m

            # If regex pruning returns nothing, fallback to a small sample of all menus
            if not candidates:
                # try a small global sample to avoid full table scan
                sample_limit = min(1000, SearchService.MAX_CANDIDATES_PER_KEYWORD)
                all_sample = await MenuEntity.find_all().limit(sample_limit).to_list()
                for m in all_sample:
                    candidates[str(m.id)] = m

            # Step 2: Fuzzy scoring on reduced candidate set
            menu_score_map: Dict[str, float] = {}
            scored_items: List[Tuple[MenuEntity, float]] = []

            for m in candidates.values():
                m_name = m.name or ""
                best = 0
                for kw in keywords:
                    try:
                        score = fuzz.token_set_ratio(kw, m_name)
                    except Exception:
                        score = 0
                    if score > best:
                        best = score
                if best >= fuzzy_threshold:
                    menu_score_map[str(m.id)] = float(best)
                    scored_items.append((m, best))

            # sort by score desc and limit
            scored_items.sort(key=lambda x: x[1], reverse=True)
            menus_selected = [it[0] for it in scored_items[: SearchService.MAX_MENUS_RETURN]]

            if not menus_selected:
                return {"success": True, "message": "No dishes found!", "restaurants": []}

            # Step 3: fetch restaurants associated
            restaurant_ids_set: Set[PydanticObjectId] = set()
            for m in menus_selected:
                if getattr(m, "restaurant", None):
                    try:
                        restaurant_ids_set.add(PydanticObjectId(m.restaurant))
                    except Exception:
                        pass

            restaurant_ids = list(restaurant_ids_set)
            restaurants = await SearchService._fetch_restaurants_by_ids(restaurant_ids)

            # Step 4: group menus by restaurant
            restaurant_menu_map: Dict[str, List[MenuEntity]] = {str(r.id): [] for r in restaurants}
            for m in menus_selected:
                rid = str(getattr(m, "restaurant", ""))
                if rid in restaurant_menu_map:
                    restaurant_menu_map[rid].append(m)

            # Step 5: format each restaurant result
            formatted_results = []
            for r in restaurants:
                r_menus = restaurant_menu_map.get(str(r.id), [])
                if not r_menus:
                    continue
                formatted = await SearchService._format_restaurant_with_menus(r, r_menus, user_lat, user_lng, menu_score_map)
                formatted_results.append(formatted)

            # Step 6: final sorting
            if sort_by == SortType.PRICE_LOW:
                formatted_results.sort(key=lambda x: (x.get("avg_price") is None, x.get("avg_price", 0)))
            elif sort_by == SortType.PRICE_HIGH:
                formatted_results.sort(key=lambda x: (x.get("avg_price") is None, - (x.get("avg_price") or 0)))
            elif sort_by == SortType.RATING:
                formatted_results.sort(key=lambda x: x.get("rating", 0), reverse=True)
            elif sort_by == SortType.DISTANCE and user_lat is not None and user_lng is not None:
                formatted_results.sort(key=lambda x: (x.get("distance") is None, x.get("distance", 99999)))
            else:
                # default: match_score desc
                formatted_results.sort(key=lambda x: x.get("match_score", 0), reverse=True)

            return {
                "success": True,
                "message": f"Found {len(formatted_results)} restaurants",
                "restaurants": formatted_results[: SearchService.MAX_RESTAURANTS_RETURN],
                "detected_food": keywords[0] if keywords else "",
            }

        except Exception as e:
            traceback.print_exc()
            return {"success": False, "message": f"Search failed: {str(e)}"}

    # ------------------------- Smart Search (uses NLU fallback) -------------------------
    @staticmethod
    async def search_smart(query_text: str, limit: int = 20):
        try:
            # First try dish search (keeps caller defaults)
            dish_results = await SearchService.search_dish_and_sort(query_text)
            if dish_results.get("success") and dish_results.get("restaurants"):
                return dish_results

            # Fallback: parse structured query and call flexible search
            parsed = SearchService.nlu.parse(query_text)
            # flexible_search should be implemented elsewhere; pass limit
            return await SearchService.flexible_search(
                keyword=parsed.name or query_text,
                location=parsed.location,
                cuisine=parsed.type,
                price_range=parsed.price_range,
                limit=limit,
            )
        except Exception:
            return {"success": False, "message": "Smart search failed"}

    # ------------------------- Placeholder: flexible_search -------------------------
    @staticmethod
    async def flexible_search(keyword: str = None, location: str = None, cuisine: str = None, price_range: str = None, limit: int = 20):
        # Implement according to your data model. This method is intentionally left as a stub.
        return {"success": True, "message": "Flexible search not implemented", "restaurants": []}
