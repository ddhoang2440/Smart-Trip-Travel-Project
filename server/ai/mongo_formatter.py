# ai/mongo_formatter.py
from datetime import datetime
from typing import List, Dict, Any

class MongoFormatter:
    """Formatter for MongoDB data to frontend format"""
    
    @staticmethod
    def format_object_id(id_val):
        """Format ObjectId to string"""
        if not id_val:
            return ""
        if hasattr(id_val, 'toString'):
            return id_val.toString()
        return str(id_val)
    
    @staticmethod
    def format_price(price):
        """Format price to Vietnamese currency"""
        if price is None:
            return "Liên hệ"
        try:
            formatted = f"{int(price):,}".replace(',', '.')
            return f"{formatted} ₫"
        except (ValueError, TypeError):
            return "Liên hệ"
    
    @staticmethod
    def format_rating(rating):
        """Format rating to 1 decimal place"""
        if rating is None:
            return "0.0"
        try:
            return f"{float(rating):.1f}"
        except (ValueError, TypeError):
            return "0.0"
    
    @staticmethod
    def format_cooking_time(minutes):
        """Format cooking time"""
        if not minutes:
            return None
        if minutes < 60:
            return f"{minutes} phút"
        hours = minutes // 60
        mins = minutes % 60
        if mins == 0:
            return f"{hours} giờ"
        return f"{hours} giờ {mins} phút"
    
    @staticmethod
    def get_spicy_info(level):
        """Get spicy level information"""
        levels = {
            0: {"label": "Không cay", "emoji": "", "color": "text-green-600", "bgColor": "bg-green-100"},
            1: {"label": "Hơi cay", "emoji": "🌶️", "color": "text-yellow-600", "bgColor": "bg-yellow-100"},
            2: {"label": "Cay vừa", "emoji": "🌶️🌶️", "color": "text-orange-600", "bgColor": "bg-orange-100"},
            3: {"label": "Cay", "emoji": "🌶️🌶️🌶️", "color": "text-red-600", "bgColor": "bg-red-100"},
            4: {"label": "Rất cay", "emoji": "🌶️🌶️🌶️🌶️", "color": "text-red-700", "bgColor": "bg-red-200"},
            5: {"label": "Cực cay", "emoji": "🌶️🌶️🌶️🌶️🌶️", "color": "text-purple-600", "bgColor": "bg-purple-100"}
        }
        return levels.get(level, levels[0])
    
    @staticmethod
    def get_dietary_tag_info(tag):
        """Get dietary tag information"""
        tag_config = {
            'vegetarian': {"label": "Chay", "icon": "🥬", "color": "text-green-700", "bgColor": "bg-green-50"},
            'vegan': {"label": "Thuần chay", "icon": "🌱", "color": "text-green-800", "bgColor": "bg-green-100"},
            'gluten-free': {"label": "Không gluten", "icon": "🌾❌", "color": "text-blue-600", "bgColor": "bg-blue-50"},
            'dairy-free': {"label": "Không sữa", "icon": "🥛❌", "color": "text-blue-700", "bgColor": "bg-blue-100"},
            'nut-free': {"label": "Không hạt", "icon": "🥜❌", "color": "text-amber-700", "bgColor": "bg-amber-50"},
            'halal': {"label": "Halal", "icon": "🕌", "color": "text-teal-600", "bgColor": "bg-teal-50"},
            'kosher': {"label": "Kosher", "icon": "✡️", "color": "text-purple-600", "bgColor": "bg-purple-50"},
            'spicy': {"label": "Cay", "icon": "🌶️", "color": "text-red-600", "bgColor": "bg-red-50"},
            'popular': {"label": "Phổ biến", "icon": "🔥", "color": "text-amber-600", "bgColor": "bg-amber-50"},
            'new': {"label": "Mới", "icon": "🆕", "color": "text-blue-600", "bgColor": "bg-blue-50"},
            'chef_special': {"label": "Đặc biệt", "icon": "👨‍🍳", "color": "text-purple-600", "bgColor": "bg-purple-50"}
        }
        
        tag_lower = tag.lower().replace(' ', '_')
        if tag_lower in tag_config:
            return tag_config[tag_lower]
        
        return {
            "label": tag,
            "icon": "🏷️",
            "color": "text-gray-600",
            "bgColor": "bg-gray-100"
        }
    
    @staticmethod
    def transform_food_data(food_item, restaurant_info=None):
        """Transform food item data for frontend"""
        if not food_item:
            return None
        
        # Get restaurant info
        restaurant_id = getattr(food_item, 'restaurant', None)
        restaurant_name = "Không rõ"
        restaurant_rating = None
        restaurant_address = ""
        restaurant_delivery_fee = 0
        
        if restaurant_info and restaurant_id:
            if isinstance(restaurant_info, dict):
                rest_info = restaurant_info.get(str(restaurant_id)) or restaurant_info.get(restaurant_id)
                if rest_info:
                    restaurant_name = rest_info.get("name", "Không rõ")
                    restaurant_rating = rest_info.get("rating")
                    restaurant_address = rest_info.get("address", "")
                    restaurant_delivery_fee = rest_info.get("delivery_fee", 0)
            elif isinstance(restaurant_info, str):
                restaurant_name = restaurant_info
        
        # Calculate discount
        original_price = getattr(food_item, 'original_price', None)
        price = getattr(food_item, 'price', None)
        discount_percent = None
        
        if original_price and price and original_price > price:
            discount_percent = int(((original_price - price) / original_price) * 100)
        
        # Format spicy level
        spicy_level = getattr(food_item, 'spicy_level', 0)
        spicy_info = MongoFormatter.get_spicy_info(spicy_level)
        
        # Format dietary tags
        dietary_tags = getattr(food_item, 'dietary_tags', [])
        formatted_tags = [MongoFormatter.get_dietary_tag_info(tag) for tag in dietary_tags]
        
        # Check if vegetarian
        is_vegetarian = any(tag.lower() in ['vegetarian', 'vegan'] for tag in dietary_tags)
        
        # Get images
        images = getattr(food_item, 'images', [])
        main_image = images[0] if images else "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&h=300&fit=crop"
        
        # Format nutrition info
        nutrition_info = {
            "calories": getattr(food_item, 'calories', None),
            "protein": getattr(food_item, 'protein', None),
            "carbs": getattr(food_item, 'carbs', None),
            "fat": getattr(food_item, 'fat', None),
            "fiber": getattr(food_item, 'fiber', None)
        }
        
        return {
            "id": MongoFormatter.format_object_id(getattr(food_item, 'id', None) or getattr(food_item, '_id', None)),
            "name": getattr(food_item, 'name', "Không có tên"),
            "price": price,
            "priceDisplay": MongoFormatter.format_price(price),
            "originalPrice": original_price,
            "originalPriceDisplay": MongoFormatter.format_price(original_price) if original_price else None,
            "discountPercent": discount_percent,
            "currency": "VND",
            "description": getattr(food_item, 'description', ''),
            "category": getattr(food_item, 'category', 'Món chính'),
            "dietaryTags": formatted_tags,
            "spicyLevel": spicy_info,
            "isSpicy": spicy_level > 2,
            "isVegetarian": is_vegetarian,
            "rating": MongoFormatter.format_rating(getattr(food_item, 'rating', None)),
            "reviewCount": getattr(food_item, 'review_count', 0),
            "image": main_image,
            "images": images,
            "isAvailable": getattr(food_item, 'is_available', True),
            "calories": getattr(food_item, 'calories', None),
            "cookingTime": MongoFormatter.format_cooking_time(getattr(food_item, 'cooking_time', None)),
            "nutritionInfo": nutrition_info,
            "restaurant": {
                "id": MongoFormatter.format_object_id(restaurant_id),
                "name": restaurant_name,
                "rating": MongoFormatter.format_rating(restaurant_rating),
                "address": restaurant_address,
                "deliveryFee": MongoFormatter.format_price(restaurant_delivery_fee),
                "deliveryFeeRaw": restaurant_delivery_fee,
            },
            "tags": formatted_tags,
            "createdAt": None,  # You can add datetime formatting if needed
            "updatedAt": None,
            "rawData": {k: v for k, v in food_item.__dict__.items() if not k.startswith('_')} if hasattr(food_item, '__dict__') else food_item
        }
    
    @staticmethod
    def transform_food_list(food_items, restaurant_map=None):
        """Transform list of food items"""
        if not food_items:
            return []
        
        transformed_items = []
        for item in food_items:
            transformed = MongoFormatter.transform_food_data(item, restaurant_map)
            if transformed:
                transformed_items.append(transformed)
        
        return transformed_items
    
    @staticmethod
    def group_by_restaurant(food_items, restaurant_map=None):
        """Group food items by restaurant"""
        transformed_items = MongoFormatter.transform_food_list(food_items, restaurant_map)
        
        # Group by restaurant
        grouped_by_restaurant = {}
        for item in transformed_items:
            rest_id = item["restaurant"]["id"]
            if rest_id not in grouped_by_restaurant:
                grouped_by_restaurant[rest_id] = {
                    "restaurant": item["restaurant"],
                    "items": []
                }
            grouped_by_restaurant[rest_id]["items"].append(item)
        
        return list(grouped_by_restaurant.values())
    
    @staticmethod
    def calculate_stats(food_items, restaurant_map=None):
        """Calculate statistics for food list"""
        transformed_items = MongoFormatter.transform_food_list(food_items, restaurant_map)
        
        if not transformed_items:
            return {
                "minPrice": 0,
                "maxPrice": 0,
                "avgRating": "0.0",
                "vegetarianCount": 0,
                "spicyCount": 0
            }
        
        # Calculate stats
        prices = [item["price"] for item in transformed_items if item["price"]]
        ratings = [float(item["rating"]) for item in transformed_items if item["rating"] != "0.0"]
        vegetarian_count = len([item for item in transformed_items if item["isVegetarian"]])
        spicy_count = len([item for item in transformed_items if item["isSpicy"]])
        
        return {
            "minPrice": min(prices) if prices else 0,
            "maxPrice": max(prices) if prices else 0,
            "avgRating": f"{sum(ratings) / len(ratings):.1f}" if ratings else "0.0",
            "vegetarianCount": vegetarian_count,
            "spicyCount": spicy_count
        }