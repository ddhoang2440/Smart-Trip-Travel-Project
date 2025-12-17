import Restaurant from "../../model/restaurant.js";
import Menu from "../../model/food.js";

import IntentHandler from "./base.js";
import {
  buildFilter,
  buildFoodFilterFromJson,
  buildRestaurantFilterSpecFromJson,
} from "../utils/filter.js";
import { suggestRestaurant } from "../utils/suggest.js";

const ENTITY_MAP = {
  restaurant: Restaurant,
  menu: Menu,
  food: Menu, // food dùng chung schema menu
};

export default class SearchHandler extends IntentHandler {
  async handle(type, entity, params, center) {
    const EntityModel = ENTITY_MAP[entity];

    if (!EntityModel) {
      throw new Error(`Unknown entity: ${entity}`);
    }

    if (type === "reply") {
      return await this.searchText(EntityModel, params, center);
    } else if (type === "ui_action") {
      return await this.searchUI(EntityModel, params);
    }

    return null;
  }

  async searchText(EntityModel, params, center = null) {
    const Restaurant = ENTITY_MAP["restaurant"];
    const Menu = ENTITY_MAP["menu"];
    const Food = ENTITY_MAP["food"];

    let pipeline = null;

    if (!params.is_suggestion) {
      let filters = [];
      let geoFilter = null;
      // --- BUILD FILTERS ---
      if (EntityModel === Restaurant) {
        console.log("Building restaurant filters");
        const res = await buildRestaurantFilterSpecFromJson(params, center);
        filters = res.filters;
        geoFilter = res.geoFilter;
      }

      if (EntityModel === Menu || EntityModel === Food) {
        console.log("Building food filters");
        const res = await buildFoodFilterFromJson(params, center);
        filters = res.filters;
        geoFilter = res.geoFilter;
      }

      // Convert to final MongoDB filter
      pipeline = buildFilter(filters, geoFilter, "AND");
    } else {
      pipeline = await suggestRestaurant(center);
    }
    console.dir(pipeline, { depth: null });

    // Query DB
    const results = await EntityModel.aggregate(pipeline);
    console.log("Results:", results.length);

    // ------------------------
    // FORMAT RESTAURANT RESULT
    // ------------------------
    if (EntityModel === Restaurant) {
      const formatted = results.map((item) => ({
        id: String(item._id),
        name: item.name,
        review: item.review,
        address: item.address,
        ratingSum: item.ratingSum,
        medium_price: item.medium_price,
        open: item.open,
        from: item.from,
        to: item.to,
        type: item.type,
        images: item.images || [],
        description: item.description || "",
        location: item.location,
        distance: item.distance,
      }));

      return {
        type: "restaurant-list",
        restaurants: formatted,
        message: `Tìm thấy ${formatted.length} nhà hàng phù hợp`,
      };
    }

    // ------------------------
    // FORMAT FOOD / MENU RESULT
    // ------------------------
    if ((EntityModel === Menu || EntityModel === Food) && results.length > 0) {
      const restaurantIds = [
        ...new Set(results.map((r) => r.restaurant).filter(Boolean)),
      ];

      let resMap = {};
      if (restaurantIds.length > 0) {
        const restaurants = await Restaurant.find({
          _id: { $in: restaurantIds },
        }).lean();
        resMap = Object.fromEntries(
          restaurants.map((r) => [String(r._id), r.name])
        );
      }

      const formattedFood = results.map((item) => ({
        id: String(item._id),
        name: item.name,
        price: item.price ?? null,
        description: item.description || "",
        restaurant_id: item.restaurant ? String(item.restaurant) : null,
        restaurant_name: resMap[item.restaurant] || "Unknown",
      }));

      return {
        type: "food-list",
        food: formattedFood,
        message: `Tìm thấy ${formattedFood.length} món ăn phù hợp`,
      };
    }

    // ------------------------
    // NO RESULTS
    // ------------------------
    return {
      type: "no-results",
      message: "Không tìm thấy kết quả phù hợp",
      restaurants: EntityModel === Restaurant ? [] : undefined,
      items: EntityModel === Menu || EntityModel === Food ? [] : undefined,
    };
  }
}
