import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

// Fix Leaflet marker icon bug
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapPickerModalProps {
  initialLat: number;
  initialLng: number;
  onClose: () => void;
  onConfirm: (lat: number, lng: number) => void;
}

const CITIES = [
  { name: 'San Francisco', lat: 37.7749, lng: -122.4194 },
  { name: 'Los Angeles', lat: 34.0522, lng: -118.2437 },
  { name: 'San Diego', lat: 32.7157, lng: -117.1611 },
  { name: 'Sacramento', lat: 38.5816, lng: -121.4944 },
  { name: 'San Jose', lat: 37.3382, lng: -121.8863 },
  { name: 'Fresno', lat: 36.7468, lng: -119.7726 },
  { name: 'Oakland', lat: 37.8044, lng: -122.2712 },
  { name: 'Long Beach', lat: 33.7701, lng: -118.1937 },
  { name: 'Bakersfield', lat: 35.3733, lng: -119.0187 },
  { name: 'Anaheim', lat: 33.8366, lng: -117.9143 }
];

const CALIFORNIA_BOUNDS = L.latLngBounds(
  L.latLng(32.0, -125.0),
  L.latLng(42.0, -114.0)
);

function MapController({ position, setPosition }: { position: L.LatLng, setPosition: (pos: L.LatLng) => void }) {
  const map = useMap();

  useMapEvents({
    click(e) {
      if (CALIFORNIA_BOUNDS.contains(e.latlng)) {
        setPosition(e.latlng);
      }
    }
  });

  return (
    <Marker 
      position={position} 
      draggable={true} 
      eventHandlers={{
        dragend: (e) => {
          const marker = e.target;
          const pos = marker.getLatLng();
          if (CALIFORNIA_BOUNDS.contains(pos)) {
            setPosition(pos);
          } else {
            marker.setLatLng(position); // Revert if outside bounds
          }
        }
      }}
    >
      <Popup>
        Lat: {position.lat.toFixed(4)}<br/>
        Lng: {position.lng.toFixed(4)}
      </Popup>
    </Marker>
  );
}

const MapPickerModal: React.FC<MapPickerModalProps> = ({ initialLat, initialLng, onClose, onConfirm }) => {
  const [position, setPosition] = useState<L.LatLng>(L.latLng(initialLat, initialLng));
  const mapRef = useRef<L.Map>(null);

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const city = CITIES.find(c => c.name === e.target.value);
    if (city && mapRef.current) {
      const pos = L.latLng(city.lat, city.lng);
      setPosition(pos);
      mapRef.current.flyTo(pos, 10);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.6)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1rem'
    }}>
      <div className="card" style={{
        width: '100%',
        maxWidth: '800px',
        background: 'var(--bg-card)',
        borderRadius: '12px',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, color: 'var(--text-heading)' }}>Select Location in California</h3>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--text-hint)' }}>&times;</button>
        </div>

        <div style={{ padding: '1rem', borderBottom: '1px solid var(--border)', background: 'var(--bg-page)' }}>
          <select onChange={handleCityChange} defaultValue="" style={{
            padding: '0.5rem',
            borderRadius: '6px',
            border: '1px solid var(--border)',
            width: '100%',
            maxWidth: '300px'
          }}>
            <option value="" disabled>Jump to major city...</option>
            {CITIES.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
          </select>
        </div>

        <div style={{ height: '500px', width: '100%' }}>
          <MapContainer 
            center={[initialLat, initialLng]} 
            zoom={6} 
            minZoom={5} 
            maxZoom={12}
            maxBounds={CALIFORNIA_BOUNDS}
            style={{ height: '100%', width: '100%' }}
            ref={mapRef}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapController position={position} setPosition={setPosition} />
          </MapContainer>
        </div>

        <div style={{ padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-page)' }}>
          <div>
            <span style={{ color: 'var(--text-hint)', fontSize: '0.9rem' }}>Selected:</span>
            <span style={{ marginLeft: '10px', fontWeight: 600, color: 'var(--text-heading)' }}>
              {position.lat.toFixed(4)}, {position.lng.toFixed(4)}
            </span>
          </div>
          <button 
            onClick={() => onConfirm(position.lat, position.lng)}
            style={{
              background: 'var(--primary)',
              color: 'white',
              border: 'none',
              padding: '0.75rem 2rem',
              borderRadius: '6px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Confirm Location
          </button>
        </div>
      </div>
    </div>
  );
};

export default MapPickerModal;
