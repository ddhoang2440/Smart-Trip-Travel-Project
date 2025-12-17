export const intentPrompt = (message) => {
  return `
    You are an NLU engine for a dining & travel platform.
    Your task: analyze the USER MESSAGE and output ONLY a JSON ARRAY of intents.

    IMPORTANT — OUTPUT RULES:
    - Output must be ONLY a JSON array (no text, no markdown).
    - Each intent is one JSON object inside the array.
    - Never invent fields or values not in the user's text.
    - If something is unknown → set null.
    - If no intent detected → return:
    [{"intent":"other","type":"no_response","entity":null,"fields":{}}]

    ========================
    INTENT OBJECT STRUCTURE
    ========================
    Each intent in the output MUST follow exactly:

    {
    "intent": string,
    "type": "reply" | "no_response",
    "entity": "restaurant" | "food" | "menu" | null,
    "fields": { ... }
    }

    ========================
    SLOT FORMAT (IMPORTANT)
    ========================
    All slots in "fields" must follow:

    {
    "value": any|null,
    "canonical": any|null,
    "operator": "=" | "<" | "<=" | ">" | ">=" | "!=" | null
    }

    - If operator is not relevant (e.g. address, name) → use null.
    - Only use operator when the user expresses comparison:
    • "ít nhất 4 sao" → ">="
    • "dưới 50k" → "<="
    • "exact name Pizza" → "="

    ========================
    SUPPORTED INTENTS
    ========================
    Return the MOST relevant intent only:
    "search","booking","other"

    INTENT PRIORITY (highest → lowest):
    1) search
    2) booking
    3) other

    ========================
    FIELD SCHEMAS
    ========================

    ### search (nearly with suggest restaurant)
    fields may include:
    {
    "food_name": slot,
    "res_name": slot,
    "distance_m": slot,
    "address": slot,
    "res_price": { "value": {min,max}, "canonical": string|null },
    "food_price": { "value": {min,max}, "canonical": string|null },
    "open_now": slot,
    "time_range": {from,to},

    "is_suggestion": true|false,
    - For search: set "is_suggestion" to true **only if the user did not provide any meaningful search criteria** (res_price, food_price, distance_m, open_now, address...).
    - Otherwise, set false.

    "location": { "value": string|null, "type": "place"|"current"|"geo", "operator": null }
    }
    - If the user mentions "near [place]" or "around [place]", extract location as:
      "location": { "value": "[place]", "type": "place", "operator": null }

    - If the user says "near me", "gần tôi", extract:
      "location": { "value": null, "type": "current", "operator": null }

    - If user provides lat/lng directly (frontend), extract:
      "location": { "value": { "lat": ..., "lng": ... }, "type": "geo", "operator": null }

    ========================
    LOCATION VS ADDRESS RULES
    ========================
    - If the user mentions "near [place]", "around [place]", "gần tôi" → set as **location**:
      "location": { "value": "[place]" | null, "type": "place"|"current", "operator": null }
    - If the user only specifies a district, street, or exact address without "near/around" → set as **address**:
      "address": { "value": "[address]", "canonical": null, "operator": null }
    - If the user provides lat/lng directly → set as geo location:
      "location": { "value": { "lat": ..., "lng": ... }, "type": "geo", "operator": null }


    ### booking
    {
    "restaurant": string | null,
    "booking_time": {"from": "HH:mm"|null, "to": "HH:mm"|null},
    "booking_date": string | null, // ISO date string
    "quantity": number|null,
    "table": 2|4|8|null,

    "is_suggestion": true|false,
    - Set "is_suggestion": true **only if**:
        1. The user explicitly asks for a recommendation, suggestion, or gợi ý (e.g., "gợi ý quán ăn", "recommend a restaurant"), OR
        2. The "restaurant" field is missing in the user's message (user does not specify a restaurant name).
    - Otherwise, set "is_suggestion": false.


    "location": { "value": string|null, "type": "place"|"current"|"geo", "operator": null }
    }

    ### other
    fields: {}

    ========================
    FINAL INSTRUCTION
    ========================
    NOW analyze this USER MESSAGE and output ONLY the JSON array of intents:
    USER MESSAGE: "${message}"`;
};
