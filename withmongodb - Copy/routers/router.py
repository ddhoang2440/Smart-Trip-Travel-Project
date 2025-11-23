from fastapi import APIRouter, Depends, HTTPException, status, Query
from typing import List, Optional
from database.Database import get_db, MongoDB
from services.service import RecommendationService, SearchService, BookingService
from schemas.standard import (
    RecommendationRequest, RecommendationResponse, RestaurantResponse,
    SearchCriteria, SearchResponse, BookingCreate, BookingUpdate,
    BookingResponse, MessageResponse
)
from models.model import Weather
from bson import ObjectId

'''
Query: là một class/utility của FastAPI dùng để:

Khai báo tham số nằm trên URL Query String, kèm theo:
giá trị mặc định
ràng buộc (min, max, regex…)
mô tả
kiểu dữ liệu
validation tự động
Query là cách chuẩn, mạnh nhất và sạch nhất để định nghĩa query parameters trong FastAPI.
Query giúp FastAPI hiểu rằng:
"Tham số này lấy từ query string trên URL, không phải body.
-🔥 mô tả từng bước chính xác luồng từ frontend → URL → FastAPI → Query → Service.
khi user nhap vao input, frontend se encode thanh url vd: /api/search/keyword?keyword=nh%C3%A0%20h%C3%A0ng%20chay%20v%C3%A0%20c%C3%B3%20%C4%91%C3%A1nh%20gi%C3%A1%20cao
sau do gui cho backend, sau khi request den router, query su tu lam 3 viec: Trích input từ URL,
Chuyển kiểu dữ liệu đúng, Validate giá trị
sau khi xu ly xong → Backend nhận được dữ liệu đã sạch, không bị lỗi
→ Bạn dùng thẳng luôn trong service.'''

# Initialize routers
recommendation_router = APIRouter(prefix="/api/recommendations", tags=["Recommendations"])
search_router = APIRouter(prefix="/api/search", tags=["Search"])
booking_router = APIRouter(prefix="/api/bookings", tags=["Bookings"])

# RECOMMENDATION ENDPOINTS 

@recommendation_router.post("/trending", response_model=RecommendationResponse)
async def get_trending_restaurants(
    area: str,
    limit: int = 10,
    db: MongoDB = Depends(get_db)
):
    """Get trending restaurants in a specific area"""
    try:
        service = RecommendationService(db)
        restaurants = await service.recommend_trending(area, limit)
        
        return RecommendationResponse(
            restaurants=[RestaurantResponse(**r.model_dump(by_alias=False)) for r in restaurants],
            recommendation_type="trending",
            total_results=len(restaurants),
            message=f"Found {len(restaurants)} trending restaurants in {area}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching trending restaurants: {str(e)}"
        )

@recommendation_router.post("/by-history/{user_id}", response_model=RecommendationResponse)
async def get_history_based_recommendations(
    user_id: str,
    limit: int = 10,
    db: MongoDB = Depends(get_db)
):
    """Get recommendations based on user's dining history"""
    try:
        service = RecommendationService(db)
        restaurants = await service.recommend_by_history(user_id, limit)
        
        if not restaurants:
            return RecommendationResponse(
                restaurants=[],
                recommendation_type="history_based",
                total_results=0,
                message="No history found for this user"
            )
        
        return RecommendationResponse(
            restaurants=[RestaurantResponse(**r.model_dump(by_alias=False)) for r in restaurants],
            recommendation_type="history_based",
            total_results=len(restaurants),
            message=f"Found {len(restaurants)} recommendations based on your history"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching history-based recommendations: {str(e)}"
        )

@recommendation_router.post("/by-weather", response_model=RecommendationResponse)
async def get_weather_based_recommendations(
    location: str,
    weather_id: str,
    limit: int = 10,
    db: MongoDB = Depends(get_db)
):
    """Get recommendations based on current weather"""
    try:
        # Get weather data
        weather_collection = db.get_collection("weather")
        weather_doc = await weather_collection.find_one({"_id": ObjectId(weather_id)})
        
        if not weather_doc:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Weather data not found"
            )
        
        weather = Weather(**weather_doc)
        
        service = RecommendationService(db)
        restaurants = await service.recommend_by_weather(weather, location, limit)
        
        return RecommendationResponse(
            restaurants=[RestaurantResponse(**r.model_dump(by_alias=False)) for r in restaurants],
            recommendation_type="weather_based",
            total_results=len(restaurants),
            message=f"Found {len(restaurants)} restaurants suitable for {weather.condition} weather"
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching weather-based recommendations: {str(e)}"
        )

@recommendation_router.post("/general", response_model=RecommendationResponse)
async def get_general_recommendations(
    request: RecommendationRequest,
    limit: int = 10,
    db: MongoDB = Depends(get_db)
):
    """Get general recommendations based on user preferences"""
    try:
        service = RecommendationService(db)
        restaurants = await service.recommend_general(request, limit)
        
        return RecommendationResponse(
            restaurants=[RestaurantResponse(**r.model_dump(by_alias=False)) for r in restaurants],
            recommendation_type="general",
            total_results=len(restaurants),
            message=f"Found {len(restaurants)} restaurants matching your preferences"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching recommendations: {str(e)}"
        )

# SEARCH ENDPOINTS 
'''User bấm search nhưng không nhập gì → show lại homepage list (popular/trending → bạn tùy chọn)
Giống behavior của Foody, GrabFood, Loship, ShopeeFood, v.v.'''

@search_router.post("/", response_model=SearchResponse)
async def search_restaurants(
    criteria: SearchCriteria,
    limit: int = 20,
    db: MongoDB = Depends(get_db)
):
    """Search restaurants with filters"""
    try:
        service = SearchService(db)
        restaurants_with_distance = await service.filter_restaurants_by_distance(criteria, limit)
        
        # Add distance and match score
        restaurants_response = []
        for restaurant, distance in restaurants_with_distance:
            # model_dump() là hàm của Pydantic model, no chuyen 1 pydantic model -) thanh dict python
            restaurant_dict = restaurant.model_dump(by_alias=False)
            # round la ham lam trong so , 2 la so chu so sau dau thap phan 
            restaurant_dict['distance'] = round(distance, 2)
            
            # Calculate match score
            user_data = {
                "food_preferences": criteria.cuisine_types,
                "price_range": criteria.price_range
            }
            match_score = service.calculate_match_score(restaurant, user_data)
            restaurant_dict['match_score'] = round(match_score, 2)
            
            restaurants_response.append(RestaurantResponse(**restaurant_dict))
        
        return SearchResponse(
            restaurants=restaurants_response,
            total_results=len(restaurants_response),
            filters_applied={
                "location": criteria.location,
                "cuisine_types": criteria.cuisine_types,
                "price_range": criteria.price_range,
                "min_rating": criteria.min_rating,
                "max_distance": criteria.max_distance
            }
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error searching restaurants: {str(e)}"
        )


@search_router.get("/keyword", response_model=SearchResponse)
async def search_by_keyword(
    keyword: Optional[str] = Query(None, description="Search keyword (if empty, returns trending restaurants)"),
    limit: int = Query(20, ge=1, le=50, description="Maximum number of results"),
    location: Optional[str] = Query("Ho Chi Minh City", description="Location for trending restaurants"),
    db: MongoDB = Depends(get_db)
):
    """
    Main search endpoint - mimics behavior of Foody, GrabFood, ShopeeFood
    - If keyword provided: searches by keyword
    - If keyword empty/null: returns trending/popular restaurants (homepage list)
    """
    try:
        service = SearchService(db)
        
        # Nếu không có keyword hoặc keyword rỗng → trả về trending restaurants
        if not keyword or keyword.strip() == "":
            recommendation_service = RecommendationService(db)
            restaurants = await recommendation_service.recommend_trending(
                area=location,
                limit=limit
            )
            
            # Convert to response format
            restaurants_response = []
            for restaurant in restaurants:
                restaurant_dict = restaurant.model_dump(by_alias=False)
                restaurant_dict['distance'] = 0.0
                restaurant_dict['match_score'] = 0.0
                restaurants_response.append(RestaurantResponse(**restaurant_dict))
            
            return SearchResponse(
                restaurants=restaurants_response,
                total_results=len(restaurants_response),
                filters_applied={
                    "search_type": "trending",
                    "location": location,
                    "limit": limit
                }
            )
        
        # Có keyword → tìm kiếm bình thường
        restaurants = await service.search_by_keyword(keyword, limit)
        
        # Convert to response format
        restaurants_response = []
        for restaurant in restaurants:
            restaurant_dict = restaurant.model_dump(by_alias=False)
            restaurant_dict['distance'] = 0.0
            restaurant_dict['match_score'] = 0.0
            restaurants_response.append(RestaurantResponse(**restaurant_dict))
        
        return SearchResponse(
            restaurants=restaurants_response,
            total_results=len(restaurants_response),
            filters_applied={
                "search_type": "keyword",
                "keyword": keyword,
                "limit": limit
            }
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error searching restaurants: {str(e)}"
        )


@search_router.get("/keyword-smart", response_model=SearchResponse)
async def search_by_keyword_smart(
    keyword: Optional[str] = Query(None, description="Search keyword (optional)"),
    limit: int = Query(20, ge=1, le=50),
    min_results: int = Query(5, ge=1, le=20, description="Minimum results before fallback"),
    location: Optional[str] = Query("Ho Chi Minh City", description="User location"),
    cuisine_types: Optional[str] = Query(None, description="Comma-separated cuisine preferences"),
    price_range: Optional[str] = Query(None, description="Comma-separated price ranges (1,2,3)"),
    min_rating: Optional[float] = Query(None, ge=0, le=5, description="Minimum rating"),
    db: MongoDB = Depends(get_db)
):
    """
    Smart search with intelligent fallback
    - Empty keyword: returns personalized recommendations or trending
    - Has keyword but few results: adds recommendations
    - Has keyword with enough results: returns keyword results only
    """
    try:
        service = SearchService(db)
        recommendation_service = RecommendationService(db)
        
        # Build user preferences
        user_preferences = {}
        if location:
            user_preferences["location"] = location
        if cuisine_types:
            user_preferences["food_preferences"] = [c.strip() for c in cuisine_types.split(",")]
        if price_range:
            user_preferences["price_range"] = [int(p.strip()) for p in price_range.split(",")]
        if min_rating:
            user_preferences["min_rating"] = min_rating
        
        # Nếu không có keyword → trả về recommendations hoặc trending
        if not keyword or keyword.strip() == "":
            if user_preferences:
                # Có preferences → personalized recommendations
                from schemas.standard import RecommendationRequest
                rec_request = RecommendationRequest(**user_preferences)
                restaurants = await recommendation_service.recommend_general(rec_request, limit)
                search_type = "personalized"
            else:
                # Không có preferences → trending
                restaurants = await recommendation_service.recommend_trending(location, limit)
                search_type = "trending"
            
            # Convert to response
            restaurants_response = []
            for restaurant in restaurants:
                restaurant_dict = restaurant.model_dump(by_alias=False)
                restaurant_dict['distance'] = 0.0
                restaurant_dict['match_score'] = 0.0
                restaurants_response.append(RestaurantResponse(**restaurant_dict))
            
            return SearchResponse(
                restaurants=restaurants_response,
                total_results=len(restaurants_response),
                filters_applied={
                    "search_type": search_type,
                    "location": location,
                    "limit": limit
                }
            )
        
        # Có keyword → search with fallback
        restaurants = await service.search_by_keyword_with_fallback(
            keyword=keyword,
            user_preferences=user_preferences if user_preferences else None,
            min_results=min_results,
            limit=limit
        )
        
        # Convert to response format
        restaurants_response = []
        for restaurant in restaurants:
            restaurant_dict = restaurant.model_dump(by_alias=False)
            restaurant_dict['distance'] = 0.0
            restaurant_dict['match_score'] = 0.0
            restaurants_response.append(RestaurantResponse(**restaurant_dict))
        
        return SearchResponse(
            restaurants=restaurants_response,
            total_results=len(restaurants_response),
            filters_applied={
                "search_type": "keyword_smart",
                "keyword": keyword,
                "limit": limit,
                "min_results": min_results,
                "fallback_enabled": bool(user_preferences)
            }
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error in smart search: {str(e)}"
        )


@search_router.post("/advanced", response_model=SearchResponse)
async def advanced_search(
    keyword: Optional[str] = Query(None, description="Optional keyword search"),
    criteria: Optional[SearchCriteria] = None,
    limit: int = Query(20, ge=1, le=100),
    location: Optional[str] = Query("Ho Chi Minh City", description="Default location"),
    db: MongoDB = Depends(get_db)
):
    """
    Advanced search combining keyword and filters
    - Empty keyword + no criteria: returns trending restaurants
    - Empty keyword + has criteria: filter-based search
    - Has keyword + no criteria: keyword search only
    - Has keyword + has criteria: combined search
    """
    try:
        service = SearchService(db)
        recommendation_service = RecommendationService(db)
        
        # Case 1: Không có keyword và không có criteria → trending
        if (not keyword or keyword.strip() == "") and not criteria:
            restaurants = await recommendation_service.recommend_trending(location, limit)
            search_type = "trending"
        
        # Case 2: Không có keyword nhưng có criteria → filter-based
        elif (not keyword or keyword.strip() == "") and criteria:
            restaurants_with_distance = await service.filter_restaurants_by_distance(criteria, limit)
            restaurants = [r for r, _ in restaurants_with_distance]
            search_type = "filter"
        
        # Case 3: Có keyword không có criteria → keyword only
        elif keyword and keyword.strip() and not criteria:
            restaurants = await service.search_by_keyword(keyword, limit)
            search_type = "keyword"
        
        # Case 4: Có cả keyword và criteria → combined
        else:
            # Keyword search first
            restaurants = await service.search_by_keyword(keyword, limit * 2)
            
            # Apply filters
            filtered_restaurants = []
            for restaurant in restaurants:
                # Filter by cuisine types
                if criteria.cuisine_types:
                    if not any(c in restaurant.cuisine_types for c in criteria.cuisine_types):
                        continue
                
                # Filter by price range
                if criteria.price_range:
                    if restaurant.price_range not in criteria.price_range:
                        continue
                
                # Filter by rating
                if criteria.min_rating:
                    if restaurant.rating < criteria.min_rating:
                        continue
                
                # Filter by location
                if criteria.location:
                    if criteria.location.lower() not in restaurant.location.lower():
                        continue
                
                filtered_restaurants.append(restaurant)
            
            restaurants = filtered_restaurants[:limit]
            search_type = "combined"
        
        # Convert to response format
        restaurants_response = []
        for restaurant in restaurants:
            restaurant_dict = restaurant.model_dump(by_alias=False)
            restaurant_dict['distance'] = 0.0
            restaurant_dict['match_score'] = 0.0
            restaurants_response.append(RestaurantResponse(**restaurant_dict))
        
        filters_applied = {
            "search_type": search_type,
            "keyword": keyword,
            "limit": limit
        }
        if criteria:
            filters_applied.update({
                "location": criteria.location,
                "cuisine_types": criteria.cuisine_types,
                "price_range": criteria.price_range,
                "min_rating": criteria.min_rating,
                "max_distance": criteria.max_distance
            })
        
        return SearchResponse(
            restaurants=restaurants_response,
            total_results=len(restaurants_response),
            filters_applied=filters_applied
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error in advanced search: {str(e)}"
        )
        
#BOOKING ENDPOINTS 

@booking_router.post("/", response_model=BookingResponse, status_code=status.HTTP_201_CREATED)
async def create_booking(
    booking_data: BookingCreate,
    db: MongoDB = Depends(get_db)
):
    """Create a new restaurant booking"""
    try:
        service = BookingService(db)
        booking = await service.create_booking(booking_data)
        
        return BookingResponse(**booking.model_dump(by_alias=False))
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error creating booking: {str(e)}"
        )

@booking_router.get("/user/{user_id}", response_model=List[BookingResponse])
async def get_user_bookings(
    user_id: str,
    db: MongoDB = Depends(get_db)
):
    """Get all bookings for a specific user"""
    try:
        service = BookingService(db)
        bookings = await service.get_user_bookings(user_id)
        
        return [BookingResponse(**b.model_dump(by_alias=False)) for b in bookings]
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching user bookings: {str(e)}"
        )

@booking_router.get("/{booking_id}", response_model=BookingResponse)
async def get_booking(
    booking_id: str,
    db: MongoDB = Depends(get_db)
):
    """Get a specific booking by ID"""
    try:
        service = BookingService(db)
        booking = await service.get_booking_by_id(booking_id)
        
        if not booking:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Booking not found"
            )
        
        return BookingResponse(**booking.model_dump(by_alias=False))
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching booking: {str(e)}"
        )

@booking_router.patch("/{booking_id}", response_model=BookingResponse)
async def update_booking(
    booking_id: str,
    update_data: BookingUpdate,
    db: MongoDB = Depends(get_db)
):
    """Update booking details"""
    try:
        service = BookingService(db)
        booking = await service.update_booking(booking_id, update_data)
        
        return BookingResponse(**booking.model_dump(by_alias=False))
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error updating booking: {str(e)}"
        )

@booking_router.post("/{booking_id}/confirm", response_model=MessageResponse)
async def confirm_booking(
    booking_id: str,
    db: MongoDB = Depends(get_db)
):
    """Confirm a pending booking"""
    try:
        service = BookingService(db)
        booking = await service.confirm_booking(booking_id)
        
        return MessageResponse(
            message=f"Booking {booking_id} confirmed successfully",
            success=True,
            data={"booking_id": str(booking.id), "status": booking.status.value}
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error confirming booking: {str(e)}"
        )

@booking_router.post("/{booking_id}/cancel", response_model=MessageResponse)
async def cancel_booking(
    booking_id: str,
    db: MongoDB = Depends(get_db)
):
    """Cancel a booking"""
    try:
        service = BookingService(db)
        booking = await service.cancel_booking(booking_id)
        
        return MessageResponse(
            message=f"Booking {booking_id} cancelled successfully",
            success=True,
            data={"booking_id": str(booking.id), "status": booking.status.value}
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error cancelling booking: {str(e)}"
        )

@booking_router.post("/{booking_id}/apply-promotion", response_model=MessageResponse)
async def apply_promotion_to_booking(
    booking_id: str,
    promotion_code: str,
    db: MongoDB = Depends(get_db)
):
    """Apply a promotion code to a booking"""
    try:
        service = BookingService(db)
        booking = await service.apply_promotion(booking_id, promotion_code)
        
        return MessageResponse(
            message=f"Promotion '{promotion_code}' applied successfully",
            success=True,
            data={
                "booking_id": str(booking.id),
                "promotion_code": promotion_code
            }
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error applying promotion: {str(e)}"
        )