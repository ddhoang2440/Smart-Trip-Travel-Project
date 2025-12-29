import fetch from "node-fetch";

export const getCoordinates = async (place) => {
  if (!place) return null;

  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
    place
  )}&format=json&limit=1`;
  const res = await fetch(url);
  const data = await res.json();

  if (data.length > 0) {
    return {
      lat: parseFloat(data[0].lat),
      lng: parseFloat(data[0].lon),
    };
  }
  return null;
};
export default getCoordinates;
