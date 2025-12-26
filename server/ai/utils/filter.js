import Restaurant from "../../model/restaurant.js";
import Menu from "../../model/food.js";

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

    // TIME RANGE (for restaurant from-to)
    if (this.field === "time_range" && typeof this.value === "object") {
      const { from, to } = this.value;
      const time = {};
      if (from) time.from = { $lte: from };
      if (to) time.to = { $gte: to };
      return time;
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

export class GeoFilterSpec {
  constructor(center, maxDistance = 5000) {
    this.center = center;
    this.maxDistance = maxDistance;
  }

  toGeoNear() {
    if (!this.center) return null;

    return {
      $geoNear: {
        near: {
          type: "Point",
          coordinates: [this.center.lng, this.center.lat],
        },
        distanceField: "distance",
        maxDistance: this.maxDistance,
        spherical: true,
      },
    };
  }
}

export const buildFilter = (filters, geoFilter = null, logic = "AND") => {
  const pipeline = [];

  const geoStage = geoFilter?.toGeoNear();
  if (geoStage) pipeline.push(geoStage);

  const conds = filters
    .map((f) => f.toMongo())
    .filter((f) => Object.keys(f).length > 0);

  if (conds.length > 0) {
    const match = logic === "OR" ? { $or: conds } : { $and: conds };
    pipeline.push({ $match: match });
  }

  return pipeline;
};

export const buildRestaurantFilterSpecFromJson = async (fields, center) => {
  const filters = [];
  let geoFilter = null;

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

  // address
  if (fields.address?.value) {
    filters.push(new FilterSpec("address", "=", fields.address.value));
  }

  // time
  if (fields.time?.from || fields.time?.to) {
    filters.push(
      new FilterSpec("time_range", "range", {
        from: fields.time?.from,
        to: fields.time?.to,
      })
    );
  }

  // distance
  if (center) {
    geoFilter = new GeoFilterSpec(center, fields.distance_m?.value ?? 2000);
  }

  return { filters, geoFilter };
};

export const buildFoodFilterFromJson = async (fields, center) => {
  const foodFilters = [];
  let geoFilter = null;

  // CHECK IF RESTAURANT-RELATED FILTERS EXIST
  const restFields = [
    "res_name",
    "res_price",
    "open_now",
    "distance_m",
    "address",
    "location",
  ];

  const hasRestaurantQuery = restFields.some((f) => fields[f]);

  if (hasRestaurantQuery) {
    const { filters, geoFilter } = await buildRestaurantFilterSpecFromJson(
      fields,
      center
    );
    const pipeline = buildFilter(filters, geoFilter, "AND");

    const restaurants = await Restaurant.aggregate([
      ...pipeline,
      { $project: { _id: 1 } },
    ]);
    const ids = restaurants.map((r) => r._id.toString());

    if (ids.length === 0) return []; // no match → return empty food list

    foodFilters.push(new FilterSpec("restaurant", "in", ids));
  }

  // FOOD NAME
  if (fields.food_name?.value) {
    foodFilters.push(new FilterSpec("name", "=", fields.food_name.value));
  }

  // FOOD PRICE RANGE
  if (fields.food_price?.value) {
    foodFilters.push(new FilterSpec("price", "range", fields.food_price.value));
  }

  return { foodFilters, geoFilter };
};
