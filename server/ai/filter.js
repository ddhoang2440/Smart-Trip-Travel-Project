import Restaurant from "../model/restaurant.js";
import Menu from "../model/food.js";

export class FilterSpec {
  constructor(field, operator, value) {
    this.field = field;
    this.operator = operator;
    this.value = value;
  }

  toMongo() {
    // SPECIAL CASE: open_now
    if (this.field === "open_now" && this.value === true) {
      return { open: true };
    }

    // LIST → $in
    if (Array.isArray(this.value)) {
      return { [this.field]: { $in: this.value } };
    }

    // STRING → regex (operator "=")
    if (typeof this.value === "string" && this.operator === "=") {
      return { [this.field]: { $regex: this.value, $options: "i" } };
    }

    // BOOL
    if (typeof this.value === "boolean" && this.operator === "=") {
      return { [this.field]: this.value };
    }

    // RANGE
    if (this.operator === "range" && typeof this.value === "object") {
      const range = {};
      if (typeof this.value.min === "number") range.$gte = this.value.min;
      if (typeof this.value.max === "number") range.$lte = this.value.max;
      // Nếu range rỗng, không thêm gì
      if (Object.keys(range).length === 0) return {};
      return { [this.field]: range };
    }

    // NORMAL OPERATOR
    const OPERATOR_MAP = {
      "<": "$lt",
      "<=": "$lte",
      ">": "$gt",
      ">=": "$gte",
      "=": "$eq",
      "!=": "$ne",
      range: "range",
      in: "$in",
    };

    const mongoOp = OPERATOR_MAP[this.operator];
    if (!mongoOp) throw new Error(`Unsupported operator ${this.operator}`);

    return { [this.field]: { [mongoOp]: this.value } };
  }
}

export const buildFilter = (filters, logic = "AND") => {
  const conds = filters.map((f) => f.toMongo());
  if (conds.length === 0) return {};

  return logic === "OR" ? { $or: conds } : { $and: conds };
};

export const buildRestaurantFilterSpecFromJson = (fields) => {
  const filters = [];

  // res_name
  if (fields.res_name?.value) {
    filters.push(new FilterSpec("name", "=", fields.res_name.value));
  }

  // open_now
  if (fields.open_now?.value === true) {
    filters.push(new FilterSpec("open_now", "=", true));
  }

  // price range
  if (fields.res_price?.value) {
    const pr = fields.res_price.value;
    filters.push(new FilterSpec("medium_price", "range", pr));
  }

  // rating
  if (fields.rating?.value !== undefined) {
    filters.push(
      new FilterSpec(
        "rating",
        fields.rating.operator,
        Number(fields.rating.value)
      )
    );
  }

  // distance
  if (fields.distance_km?.value !== undefined) {
    filters.push(new FilterSpec("distance_km", "<=", fields.distance_km.value));
  }

  // address
  if (fields.address?.canonical) {
    filters.push(new FilterSpec("address", "=", fields.address.canonical));
  }

  return filters;
};

export async function buildFoodFilterFromJson(fields) {
  const filters = [];

  // CHECK IF RESTAURANT-RELATED FILTERS EXIST
  const restFields = [
    "res_name",
    "res_price",
    "open_now",
    "rating",
    "distance_km",
    "address",
  ];

  const hasRestaurantQuery = restFields.some((f) => fields[f]);

  if (hasRestaurantQuery) {
    const resFilters = buildRestaurantFilterSpecFromJson(fields);
    const mongoResQuery = buildFilter(resFilters, "AND");

    const restaurants = await Restaurant.find(mongoResQuery).select("_id");
    const ids = restaurants.map((r) => r._id.toString());

    if (ids.length === 0) return []; // no match → return empty food list

    filters.push(new FilterSpec("restaurant", "in", ids));
  }

  // FOOD NAME
  if (fields.food_name?.value) {
    filters.push(new FilterSpec("name", "=", fields.food_name.value));
  }

  // FOOD PRICE RANGE
  if (fields.food_price?.value) {
    filters.push(new FilterSpec("price", "range", fields.food_price.value));
  }

  return filters;
}
