import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Fix for default marker icons in Leaflet + React
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

let DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

function RecenterMap({ coords }) {
  const map = useMap();
  map.setView(coords, map.getZoom());
  return null;
}

export default function MapComponent({ lat, lng, zoom = 13 }) {
  const position = [lat || 10.3157, lng || 123.8854] // Default to Cebu City

  return (
    <MapContainer 
      center={position} 
      zoom={zoom} 
      style={{ height: '100%', width: '100%', borderRadius: '1.5rem' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={position}>
        <Popup>
          Pet Tag Scanned Here!
        </Popup>
      </Marker>
      <RecenterMap coords={position} />
    </MapContainer>
  )
}
