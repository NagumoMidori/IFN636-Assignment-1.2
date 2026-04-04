import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix default marker icon issue with webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const completedIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const pendingIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

// Default stops for display when no real data is provided
const defaultStops = [
  { _id: 'default-1', address: 'Central Station', city: 'Brisbane CBD', lat: -27.4660, lng: 153.0260, completed: true },
  { _id: 'default-2', address: 'South Bank Parklands', city: 'South Brisbane', lat: -27.4805, lng: 153.0234, completed: true },
  { _id: 'default-3', address: 'Fortitude Valley', city: 'Fortitude Valley', lat: -27.4575, lng: 153.0366, completed: false },
  { _id: 'default-4', address: 'Woolloongabba', city: 'Woolloongabba', lat: -27.4920, lng: 153.0380, completed: false },
  { _id: 'default-5', address: 'Toowong Village', city: 'Toowong', lat: -27.4840, lng: 152.9830, completed: false },
];

const MapView = ({ stops = [] }) => {
  // Use real stops if they have coordinates, otherwise show defaults
  const stopsWithCoords = stops.filter((s) => s.lat && s.lng);
  const displayStops = stopsWithCoords.length > 0 ? stopsWithCoords : defaultStops;

  const center = [
    displayStops.reduce((sum, s) => sum + s.lat, 0) / displayStops.length,
    displayStops.reduce((sum, s) => sum + s.lng, 0) / displayStops.length,
  ];

  return (
    <div className="rounded-xl overflow-hidden border border-gray-200" style={{ height: '350px' }}>
      <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {displayStops.map((stop) => (
          <Marker
            key={stop._id}
            position={[stop.lat, stop.lng]}
            icon={stop.completed ? completedIcon : pendingIcon}
          >
            <Popup>
              <div className="text-sm">
                <p className="font-medium">{stop.city}</p>
                <p className="text-gray-500">{stop.address}</p>
                <p className={stop.completed ? 'text-green-600' : 'text-red-500'}>
                  {stop.completed ? 'Completed' : 'Pending'}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapView;
