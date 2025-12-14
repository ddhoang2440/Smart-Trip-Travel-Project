// File: simpleMap.jsx (ví dụ)
import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

const SimpleMap = ({ center }) => {
  const marketRef = useRef(null)
  useEffect(() => {
    if (marketRef.current) {
      marketRef.current.openPopup();
    }
  })
  const googlemapUrl = `https://www.google.com/maps/dir/?api=1&destination=${center[0]},${center[1]}`;
  return (
    <MapContainer
      center={center}
      zoom={13}
      scrollWheelZoom={true}
      className="w-[70vw] h-[70vh]"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker ref={marketRef} position={center}>
        <Popup>Nhà Hàng của tôi ở Đây ! <a href={googlemapUrl} target="_blank"  className="link">Ấn Để Vào Google Map</a></Popup>
      </Marker>
    </MapContainer>
  );
};
export default SimpleMap;
