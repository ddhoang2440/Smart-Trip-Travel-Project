from typing import List, Optional, Union
from datetime import datetime
import math
from database.Database import MongoDB
from models.model import Restaurant, User, Booking, Weather, UserHistory, Promotion, BookingStatus
from schemas.standard import RecommendationRequest, SearchCriteria, BookingCreate, BookingUpdate
from bson import ObjectId

# async def khai bao day la ham bat dong bo, no giup server ko bi do khi phai cho database return data,important for FASTAPI and nodejs 

# can sua dung du lieu database de chay may cai ham nay 
class RecommendationService:
    def __init__(self, db: MongoDB):
        self.db = db
        self.restaurants = db.get_collection("restaurants")
        self.history = db.get_collection("history")
    
    async def recommend_trending(self, area: str, limit: int = 10) -> List[Restaurant]:
        """Recommend trending restaurants in a specific area"""
        query = {"location": {"$regex": area, "$options": "i"}}
        '''"location": Tìm kiếm trong trường (cột) location của dữ liệu.
        "$regex": area nghia la tim tuong doi vd ha noi thi ha noi city cung duoc
        "$options": "i" khong phan biet in hoa, in thuong
        - cursor la con tro, se tim nhung nha hang theo query va sort theo giam dan (-1)'''
        cursor = self.restaurants.find(query).sort("trending_score", -1).limit(limit)
        
        '''async for doc in cursor: Vì dùng thư viện async (như Motor), ta phải dùng vòng lặp async để lấy từng dòng dữ liệu (doc) ra khỏi cursor mà không chặn luồng chính. noi don gian cursor la 1 motor nen bien lap trong no cx phai co async'''
        restaurants = []
        async for doc in cursor:
            restaurants.append(Restaurant(**doc))
        
        return restaurants
    
    async def recommend_by_history(self, user_id: str, limit: int = 10) -> List[Restaurant]:
        """Recommend based on user's history"""
        # Get user's history
        history_cursor = self.history.find({"user_id": user_id}).sort("visited_at", -1).limit(limit*2)
        history_list = []
        async for h in history_cursor:
            history_list.append(h)
        
        if not history_list:
            return []
        
        # Get visited restaurant IDs
        visited_ids = [h["restaurant_id"] for h in history_list]
        
        # Get visited restaurants để lấy cuisine types
        visited_restaurants = []
        #Dùng lệnh $in trong MongoDB: tim trong res co id nay
        async for doc in self.restaurants.find({"_id": {"$in": visited_ids}}):
            visited_restaurants.append(doc)
        
        # Collect cuisine types
        cuisine_types = set() # sẽ tự đông bỏ nhà hàng lặp 
        for r in visited_restaurants:
            if "cuisine_types" in r:
                cuisine_types.update(r["cuisine_types"])
        
        if not cuisine_types:
            return []
        
        # Find similar restaurants (not visited)
        query = {
            "_id": {"$nin": visited_ids}, # nha hang chua di 
            "cuisine_types": {"$in": list(cuisine_types)} # co loai do an nam trong gu
        }
        
        cursor = self.restaurants.find(query).limit(limit * 2)
        
        # Score restaurants
        scored = []
        async for doc in cursor:
            # Dấu & là phép giao trong toán tập hợp (intersection), tìm ra những phần tử chung.
            # set(doc.get("cuisine_types", []) [] neu quan do ko co mon thi se tra ve cai nay de ko loi code
            matching = len(set(doc.get("cuisine_types", [])) & cuisine_types)
            # if cuisine_types else 0, neu cuisine_types = 0 thi gan = 0 luon
            score = matching / len(cuisine_types) if cuisine_types else 0 
            scored.append((doc, score))
        
        # sau khi sort se dua nha hang cao diem nhat len dau
        scored.sort(key=lambda x: x[1], reverse=True)
        
        restaurants = []
        for doc, _ in scored[:limit]:
            restaurants.append(Restaurant(**doc))
        
        return restaurants
    
    async def recommend_by_weather(self, weather_data: Weather, location: str, limit: int = 10) -> List[Restaurant]:
        """Recommend restaurants based on weather conditions"""
        query = {"location": {"$regex": location, "$options": "i"}}
        cursor = self.restaurants.find(query)
        
        suitable = []
        async for doc in cursor:
            amenities = doc.get("amenities", [])
            score = 1.0
            
            if weather_data.condition == "Sunny":
                if "outdoor_seating" in amenities:
                    score = 1.5
            elif weather_data.condition == "Rainy":
                if "covered_parking" in amenities or "indoor_only" in amenities:
                    score = 1.5
            
            suitable.append((doc, score * doc.get("rating", 1)))
        
        suitable.sort(key=lambda x: x[1], reverse=True)
        
        restaurants = []
        for doc, _ in suitable[:limit]:
            restaurants.append(Restaurant(**doc))
        
        return restaurants
    
    async def recommend_general(self, user_data: RecommendationRequest, limit: int = 10) -> List[Restaurant]:
        """General recommendation based on user preferences"""
        query = {}
        
        # Filter by location
        if user_data.location:
            query["location"] = {"$regex": user_data.location, "$options": "i"}
        
        # Filter by price range
        if user_data.price_range:
            query["price_range"] = {"$in": user_data.price_range}
        
        # Filter by rating
        if user_data.min_rating:
            query["rating"] = {"$gte": user_data.min_rating}
        
        # Score based on food preferences
        if user_data.food_preferences:
            query["cuisine_types"] = {"$in": user_data.food_preferences}
            
            cursor = self.restaurants.find(query)
            scored = []
            
            async for doc in cursor:
                cuisines = set(doc.get("cuisine_types", []))
                preferences = set(user_data.food_preferences)
                matching = len(cuisines & preferences)
                
                pref_score = matching / len(preferences) if preferences else 0
                total_score = pref_score * 0.6 + (doc.get("rating", 0) / 5) * 0.4
                scored.append((doc, total_score))
            
            scored.sort(key=lambda x: x[1], reverse=True)
            
            restaurants = []
            for doc, _ in scored[:limit]:
                restaurants.append(Restaurant(**doc))
            
            return restaurants
        
        # No preferences, just return sorted by rating
        cursor = self.restaurants.find(query).sort("rating", -1).limit(limit)
        restaurants = []
        async for doc in cursor:
            restaurants.append(Restaurant(**doc))
        
        return restaurants


class SearchService:
    def __init__(self, db: MongoDB):
        self.db = db
        self.restaurants = db.get_collection("restaurants")
    
    async def filter_restaurants_by_distance(
        self, criteria: SearchCriteria, limit: int = 20
    ) -> List[tuple[Restaurant, Union[float,str]]]:
        """Filter restaurants by distance and other criteria"""
        query = {} # dictionary empty
        # if user enter 1 condition, query have 1 condition, else user two query two 
        # Filter by cuisine types
        if criteria.cuisine_types:
            query["cuisine_types"] = {"$in": criteria.cuisine_types}
        
        # Filter by price range
        if criteria.price_range:
            query["price_range"] = {"$in": criteria.price_range}
        
        # Filter by rating
        if criteria.min_rating: # will return restaurant which have rating >= min rating 
            query["rating"] = {"$gte": criteria.min_rating} # $gte = "greater than or equal to" va do la toan tu MongoDB
        
        cursor = self.restaurants.find(query)
        
        # Calculate distances
        restaurants_with_distance = [] # list empty
        async for doc in cursor:
            '''Dấu \ trong Python là line continuation → dùng để nối một câu lệnh dài sang dòng tiếp theo mà không bị lỗi cú pháp, noi chung la lenh if chua het, xuong dong con nua'''
            if criteria.latitude and criteria.longitude and \
               doc.get("latitude") and doc.get("longitude"):
                distance = self._calculate_distance(
                    criteria.latitude, criteria.longitude,
                    doc["latitude"], doc["longitude"]
                )
                # when user not write max_distance 
                if criteria.max_distance is not None:
                    if distance <= criteria.max_distance:
                        restaurants_with_distance.append((Restaurant(**doc), distance))
                else:
                    restaurants_with_distance.append((Restaurant(**doc), distance))
            else: # user ko cho dinh vi vi tri
                 restaurants_with_distance.append((Restaurant(**doc), doc["location"]))
        
        restaurants_with_distance.sort(key=lambda x: x[1]) # sort tu gan den xa 
        return restaurants_with_distance[:limit]
    

    async def flexible_search(
        self,
        keyword: Optional[str] = None,
        name: Optional[str] = None,
        location: Optional[str] = None,
        cuisine_types: Optional[List[str]] = None,
        amenities: Optional[List[str]] = None,
        price_range: Optional[str] = None,
        min_rating: Optional[float] = None,
        max_distance: Optional[float] = None,
        latitude: Optional[float] = None,
        longitude: Optional[float] = None,
        limit: int = 20
    ) -> List[tuple[Restaurant, Union[float, str], float, dict]]:
        """
        Tìm kiếm linh hoạt: Càng khớp nhiều điều kiện thì điểm càng cao
        
        LOGIC:
        - Mỗi điều kiện khớp = +1 điểm
        - Không yêu cầu TẤT CẢ điều kiện phải đúng
        - Sắp xếp theo điểm khớp cao nhất
        
        VÍ DỤ: User tìm "chay, Vạn Phú, TP HCM, outdoor, medium"
        - Nhà hàng A: Khớp 5/5 → 5 điểm (đứng đầu)
        - Nhà hàng B: Khớp 3/5 → 3 điểm
        - Nhà hàng C: Khớp 1/5 → 1 điểm
        
        Returns:
            List[(Restaurant, distance/location, match_score, matched_criteria)]
        """
        
        # ===== BƯỚC 1: Lấy TẤT CẢ nhà hàng (hoặc lọc theo location để giảm data) =====
        base_query = {}
        # neu nguoi dung ko nhap vao dia diem thi phai xin lay gps cua nguoi dung 
        if location:
            base_query["location"] = {"$regex": location, "$options": "i"}
        
        cursor = self.restaurants.find(base_query)
        
        # ===== BƯỚC 2: Tính điểm cho từng nhà hàng =====
        scored_restaurants = []
        
        async for doc in cursor:
            match_score = 0.0
            matched_criteria = {}
            total_criteria = 0
            
            # 1. Name matching (weight: 2.0)
            if name:
                total_criteria += 1
                if name.lower() in doc.get("name", "").lower():
                    match_score += 2.0
                    matched_criteria["name"] = True
                else:
                    matched_criteria["name"] = False
            
            # 2. Keyword matching (weight: 1.5)
            if keyword:
                total_criteria += 1
                keyword_lower = keyword.lower()
                found = False
                
                if keyword_lower in doc.get("name", "").lower():
                    match_score += 1.5
                    found = True
                elif keyword_lower in doc.get("description", "").lower():
                    match_score += 1.0
                    found = True
                else:
                    for cuisine in doc.get("cuisine_types", []):
                        if keyword_lower in cuisine.lower():
                            match_score += 1.2
                            found = True
                            break
                
                matched_criteria["keyword"] = found
            
            # 3. Cuisine types matching (weight: 2.0)
            if cuisine_types:
                total_criteria += 1
                doc_cuisines = set(c.lower() for c in doc.get("cuisine_types", []))
                user_cuisines = set(c.lower() for c in cuisine_types)
                
                matching = len(doc_cuisines & user_cuisines)
                if matching > 0:
                    # Điểm tăng theo số lượng món khớp
                    match_score += 2.0 * (matching / len(user_cuisines))
                    matched_criteria["cuisine_types"] = True
                else:
                    matched_criteria["cuisine_types"] = False
            
            # 4. Amenities matching (weight: 1.5)
            if amenities:
                total_criteria += 1
                doc_amenities = set(a.lower() for a in doc.get("amenities", []))
                user_amenities = set(a.lower() for a in amenities)
                
                matching = len(doc_amenities & user_amenities)
                if matching > 0:
                    match_score += 1.5 * (matching / len(user_amenities))
                    matched_criteria["amenities"] = True
                else:
                    matched_criteria["amenities"] = False
            
            # 5. Price range matching (weight: 1.0)
            if price_range:
                total_criteria += 1
                if doc.get("price_range", "").lower() == price_range.lower():
                    match_score += 1.0
                    matched_criteria["price_range"] = True
                else:
                    matched_criteria["price_range"] = False
            
            # 6. Rating matching (weight: 1.0)
            if min_rating:
                total_criteria += 1
                if doc.get("rating", 0) >= min_rating:
                    match_score += 1.0
                    matched_criteria["min_rating"] = True
                else:
                    matched_criteria["min_rating"] = False
            
            # 7. Distance matching (weight: 2.0)
            distance_value = None
            if latitude and longitude and doc.get("latitude") and doc.get("longitude"):
                distance_value = self._calculate_distance(
                    latitude, longitude,
                    doc["latitude"], doc["longitude"]
                )
                
                if max_distance:
                    total_criteria += 1
                    if distance_value <= max_distance:
                        # Điểm tăng khi càng gần
                        distance_score = 2.0 * (1 - distance_value / max_distance)
                        match_score += distance_score
                        matched_criteria["max_distance"] = True
                    else:
                        matched_criteria["max_distance"] = False
            else:
                distance_value = doc.get("location", "")
            
            # Bonus: Rating multiplier (tăng điểm nếu rating cao)
            rating_bonus = doc.get("rating", 0) / 5  # 0.0 -> 1.0
            match_score *= (1 + rating_bonus * 0.2)  # Tăng tối đa 20%
            
            # Normalize score (chia cho tổng số điều kiện để có điểm từ 0-1)
            if total_criteria > 0:
                normalized_score = match_score / (total_criteria * 2.0)  # Max score per criteria = 2.0
            else:
                normalized_score = 0.0
            
            scored_restaurants.append((
                Restaurant(**doc),
                distance_value,
                normalized_score,
                matched_criteria
            ))
        
        # ===== BƯỚC 3: Sắp xếp theo điểm =====
        scored_restaurants.sort(key=lambda x: x[2], reverse=True)
        
        return scored_restaurants[:limit]
    
    # ...existing code...
    # aim : match score giua 1 res and 1 input user -) return 0.0 -) 1 
    def calculate_match_score(self, restaurant: Restaurant, user_data: dict) -> float:
        """Calculate overall match score for a restaurant"""
        score = 0.0
        weights_sum = 0.0 # extent of priority of input
        
        # Rating score (weight: 0.3)
        score += (restaurant.rating / 5) * 0.3
        weights_sum += 0.3
        
        # Cuisine match (weight: 0.4)
        if user_data.get("food_preferences") and restaurant.cuisine_types:
            preferences = set(user_data["food_preferences"])
            cuisines = set(restaurant.cuisine_types)
            match_ratio = len(preferences & cuisines) / len(preferences) if preferences else 0
            score += match_ratio * 0.4
            weights_sum += 0.4
        
        # Price match (weight: 0.2), trong data se co 1 2 3
        '''1 la re, 2 la trung binh, 3 la mac  va res be hon price of user even take'''
        if user_data.get("price_range") and restaurant.price_range:
            price_order = {
                "cheap": 1,
                "medium": 2,
                "expensive": 3
            }
            user_max_price = user_data["price_range"]

            if price_order[restaurant.price_range] <= price_order[user_max_price]:
                score += 0.2
                weights_sum += 0.2
        
        # Trending score (weight: 0.1)
        score += (restaurant.trending_score / 100) * 0.1
        weights_sum += 0.1
        
        return (score / weights_sum) if weights_sum > 0 else 0.0
    
    def _calculate_distance(self, lat1: float, lon1: float, lat2: float, lon2: float) -> float:
        """Calculate distance using Haversine formula"""
        R = 6371  # Earth's radius in km
        
        lat1_rad = math.radians(lat1)
        lat2_rad = math.radians(lat2)
        delta_lat = math.radians(lat2 - lat1)
        delta_lon = math.radians(lon2 - lon1)
        
        a = math.sin(delta_lat/2)**2 + \
            math.cos(lat1_rad) * math.cos(lat2_rad) * math.sin(delta_lon/2)**2
        c = 2 * math.asin(math.sqrt(a))
        
        return R * c
    async def search_by_keyword(self, keyword: str, limit: int = 10) -> List[Restaurant]:
        """
        Search restaurants by keyword matching in name, description, cuisine types, and location
        Args:
            keyword: Search keyword from user input
            limit: Maximum number of results to return
        Returns:
            List of matching restaurants sorted by relevance score
        """
        if not keyword or keyword.strip() == "":
            return []
        
        # Normalize keyword: lowercase and strip whitespace
        keyword_lower = keyword.lower().strip()
        
        # Build MongoDB query with multiple field matching
        query = {
            "$or": [
                {"name": {"$regex": keyword, "$options": "i"}},
                {"description": {"$regex": keyword, "$options": "i"}},
                {"cuisine_types": {"$regex": keyword, "$options": "i"}},
                {"location": {"$regex": keyword, "$options": "i"}},
                {"amenities": {"$regex": keyword, "$options": "i"}},
                {"price_range": {"$regex": keyword,"$options":"i"}},
                {"rating": {"$gte": float(keyword)}} ,
                {"review_count": {"$gte": float(keyword)}}
            ]
        }
        
        cursor = self.restaurants.find(query)
        
        # Score each restaurant based on keyword relevance
        scored_restaurants = []
        async for doc in cursor:
            score = 0.0
            
            # Name matching (highest weight: 3.0)
            name_lower = doc.get("name", "").lower()
            if keyword_lower in name_lower:
                if name_lower.startswith(keyword_lower):
                    score += 3.0  # Exact start match
                else:
                    score += 2.5  # Contains match
            
            # Cuisine types matching (weight: 2.0)
            cuisine_types = doc.get("cuisine_types", [])
            for cuisine in cuisine_types:
                if keyword_lower in cuisine.lower():
                    score += 2.0
                    break
            
            # Description matching (weight: 1.5)
            description_lower = doc.get("description", "").lower()
            if keyword_lower in description_lower:
                score += 1.5
            
            # Location matching (weight: 1.0)
            location_lower = doc.get("location", "").lower()
            if keyword_lower in location_lower:
                score += 1.0
            
            # Amenities matching (weight: 0.5)
            amenities = doc.get("amenities", [])
            for amenity in amenities:
                if keyword_lower in amenity.lower():
                    score += 0.5
                    break
            price_want= doc.get("price_range",[])
            if keyword_lower in price_want :
                score+=0.1
            # Boost by rating (bonus multiplier)
            rating = doc.get("rating", 0)
            score *= (1 + rating / 10)
            
            # Boost by trending score (bonus multiplier)
            trending = doc.get("trending_score", 0)
            score *= (1 + trending / 200)
            
            scored_restaurants.append((doc, score))
        
        # Sort by score descending
        scored_restaurants.sort(key=lambda x: x[1], reverse=True)
        
        # Convert to Restaurant objects
        restaurants = []
        for doc, _ in scored_restaurants[:limit]:
            restaurants.append(Restaurant(**doc))
        
        return restaurants

    async def search_by_keyword_with_fallback(
        self, 
        keyword: str, 
        user_preferences: Optional[dict] = None,
        min_results: int = 5,
        limit: int = 10
    ) -> List[Restaurant]:
        """
        Search by keyword with fallback to general recommendations if results are insufficient
        Args:
            keyword: Search keyword
            user_preferences: Optional user preferences for fallback recommendations
            min_results: Minimum number of results before triggering fallback
            limit: Maximum total results to return
        Returns:
            List of restaurants from keyword search + fallback recommendations
        """
        # First try keyword search
        results = await self.search_by_keyword(keyword, limit)
        
        # If insufficient results, add recommendations as fallback
        if len(results) < min_results and user_preferences:
            # Create recommendation request from user preferences
            from schemas.standard import RecommendationRequest
            
            rec_request = RecommendationRequest(
                location=user_preferences.get("location"),
                food_preferences=user_preferences.get("food_preferences"),
                price_range=user_preferences.get("price_range"),
                min_rating=user_preferences.get("min_rating")
            )
            
            # Get additional recommendations
            recommendation_service = RecommendationService(self.db)
            additional = await recommendation_service.recommend_general(
                rec_request, 
                limit=limit - len(results)
            )
            
            # Combine results, avoiding duplicates
            existing_ids = {r.restaurant_id for r in results}
            for restaurant in additional:
                if restaurant.restaurant_id not in existing_ids:
                    results.append(restaurant)
                    if len(results) >= limit:
                        break
        
        return results[:limit]


class BookingService:
    def __init__(self, db: MongoDB):
        self.db = db
        self.bookings = db.get_collection("bookings")
        self.promotions = db.get_collection("promotions")
    
    async def create_booking(self, booking_data: BookingCreate) -> Booking:
        """Create a new booking"""
        booking = Booking(
            restaurant_id=booking_data.restaurant_id,
            user_id=booking_data.user_id,
            num_people=booking_data.num_people,
            date_time=booking_data.date_time,
            payment_method=booking_data.payment_method,
            promotion_applied=booking_data.promotion_applied,
            special_requests=booking_data.special_requests,
            status=BookingStatus.PENDING
        )
        
        # Convert to dict and insert
        booking_dict = booking.to_dict()
        result = await self.bookings.insert_one(booking_dict)
        
        # Fetch and return created booking
        created_booking = await self.bookings.find_one({"_id": result.inserted_id})
        return Booking(**created_booking)
    
    async def confirm_booking(self, booking_id: str) -> Booking:
        """Confirm a booking"""
        result = await self.bookings.update_one(
            {"_id": ObjectId(booking_id)},
            {
                "$set": {
                    "status": BookingStatus.CONFIRMED.value,
                    "updated_at": datetime.utcnow()
                }
            }
        )
        
        if result.matched_count == 0:
            raise ValueError("Booking not found")
        
        doc = await self.bookings.find_one({"_id": ObjectId(booking_id)})
        return Booking(**doc)
    
    async def cancel_booking(self, booking_id: str) -> Booking:
        """Cancel a booking"""
        result = await self.bookings.update_one(
            {"_id": ObjectId(booking_id)},
            {
                "$set": {
                    "status": BookingStatus.CANCELLED.value,
                    "updated_at": datetime.utcnow()
                }
            }
        )
        
        if result.matched_count == 0:
            raise ValueError("Booking not found")
        
        doc = await self.bookings.find_one({"_id": ObjectId(booking_id)})
        return Booking(**doc)
    
    async def apply_promotion(self, booking_id: str, promotion_code: str) -> Booking:
        """Apply promotion to a booking"""
        booking_doc = await self.bookings.find_one({"_id": ObjectId(booking_id)})
        if not booking_doc:
            raise ValueError("Booking not found")
        
        promotion_doc = await self.promotions.find_one({"code": promotion_code})
        if not promotion_doc:
            raise ValueError("Invalid promotion code")
        
        # Validate promotion
        now = datetime.utcnow()
        if not (promotion_doc["valid_from"] <= now <= promotion_doc["valid_until"]):
            raise ValueError("Promotion is not valid at this time")
        
        if promotion_doc.get("min_people") and booking_doc["num_people"] < promotion_doc["min_people"]:
            raise ValueError(f"Promotion requires at least {promotion_doc['min_people']} people")
        
        await self.bookings.update_one(
            {"_id": ObjectId(booking_id)},
            {
                "$set": {
                    "promotion_applied": promotion_code,
                    "updated_at": datetime.utcnow()
                }
            }
        )
        
        doc = await self.bookings.find_one({"_id": ObjectId(booking_id)})
        return Booking(**doc)
    
    async def get_user_bookings(self, user_id: str) -> List[Booking]:
        """Get all bookings for a user"""
        cursor = self.bookings.find({"user_id": user_id}).sort("date_time", -1)
        
        bookings = []
        async for doc in cursor:
            bookings.append(Booking(**doc))
        
        return bookings
    
    async def get_booking_by_id(self, booking_id: str) -> Optional[Booking]:
        """Get booking by ID"""
        doc = await self.bookings.find_one({"_id": ObjectId(booking_id)})
        if doc:
            return Booking(**doc)
        return None
    
    async def update_booking(self, booking_id: str, update_data: BookingUpdate) -> Booking:
        """Update booking details"""
        update_dict = {"updated_at": datetime.utcnow()}
        
        if update_data.num_people is not None:
            update_dict["num_people"] = update_data.num_people
        if update_data.date_time is not None:
            update_dict["date_time"] = update_data.date_time
        if update_data.special_requests is not None:
            update_dict["special_requests"] = update_data.special_requests
        
        result = await self.bookings.update_one(
            {"_id": ObjectId(booking_id)},
            {"$set": update_dict}
        )
        
        if result.matched_count == 0:
            raise ValueError("Booking not found")
        
        doc = await self.bookings.find_one({"_id": ObjectId(booking_id)})
        return Booking(**doc)