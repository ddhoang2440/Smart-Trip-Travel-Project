import getCoordinates from "../utils/centerPlace.js";

export default class IntentHandler {
  async run(payload = {}, lat, lng) {
    const type = payload.type;
    const entity = payload.entity || {};
    const params = payload.fields || {};

    let center = null;
    // location
    if (params.location?.type === "place") {
      center = await getCoordinates(params.location.value);
    } else if (params.location?.type === "geo") {
      center = params.location.value; // {lat,lng}
    } else {
      center = { lat, lng }; // {lat,lng} từ frontend
    }

    // Nếu không có center, fallback mặc định (quận 1)
    if (!center) center = { lat: 10.7769, lng: 106.7009 };
    return await this.handle(type, entity, params, center);
  }

  async handle(type, entity, params, center) {
    throw new Error("handle() must be implemented by subclasses");
  }
}
