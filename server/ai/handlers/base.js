export default class IntentHandler {
  async run(payload = {}) {
    const type = payload.type;
    const entity = payload.entity || {};
    const params = payload.fields || {};

    return await this.handle(type, entity, params);
  }

  async handle(type, entity, params) {
    throw new Error("handle() must be implemented by subclasses");
  }
}
