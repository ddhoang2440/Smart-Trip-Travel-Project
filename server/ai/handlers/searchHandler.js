import Restaurant from "../../model/restaurant.js";
import Menu from "../../model/food.js";

import IntentHandler from "./base.js";
import {
  buildFilter,
  buildFoodFilterFromJson,
  buildRestaurantFilterSpecFromJson,
} from "../filter.js";

const ENTITY_MAP = {
  restaurant: Restaurant,
  menu: Menu,
  food: Menu, // food dùng chung schema menu
};

export default class SearchHandler extends IntentHandler {
  async handle(type, entity, params) {
    const EntityModel = ENTITY_MAP[entity];

    if (!EntityModel) {
      throw new Error(`Unknown entity: ${entity}`);
    }

    if (type === "reply") {
      return await this.searchText(EntityModel, params);
    } else if (type === "ui_action") {
      return await this.searchUI(EntityModel, params);
    }

    return null;
  }

  async searchText(EntityModel, params) {
    const Restaurant = ENTITY_MAP["restaurant"];
    const Menu = ENTITY_MAP["menu"];
    const Food = ENTITY_MAP["food"];

    let filters = [];

    // --- BUILD FILTERS ---
    if (EntityModel === Restaurant) {
      console.log("Building restaurant filters");
      filters = buildRestaurantFilterSpecFromJson(params);
    }

    if (EntityModel === Menu || EntityModel === Food) {
      console.log("Building food filters");
      filters = await buildFoodFilterFromJson(params);
    }

    // Convert to final MongoDB filter
    const mongoFilter = buildFilter(filters, "AND");
    console.dir(mongoFilter, { depth: null });

    // Query DB
    const results = await EntityModel.find(mongoFilter).lean();
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
        rating: item.rating,
        medium_price: item.medium_price,
        open: item.open,
        from: item.from,
        to: item.to,
        type: item.type,
        images: item.images || [],
        description: item.description || "",
        location: item.location,
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

  async searchUI(entity, params) {
    return {
      type: "ui-action",
      action: "search",
      entity,
      params,
    };
  }
}
