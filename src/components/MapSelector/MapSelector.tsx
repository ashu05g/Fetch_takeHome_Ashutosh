import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { api } from '../../services/api';
import 'leaflet/dist/leaflet.css';
import './MapSelector.css';

interface MapSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onZipCodesSelected: (zipCodes: string[]) => void;
}

interface Location {
  zip_code: string;
  latitude: number;
  longitude: number;
  city: string;
  state: string;
}

const MapSelector: React.FC<MapSelectorProps> = ({ isOpen, onClose, onZipCodesSelected }) => {
  const mapRef = useRef<L.Map | null>(null);
  const rectangleRef = useRef<L.Rectangle | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    // Initialize map
    const map = L.map('map').setView([39.8283, -98.5795], 4); // Center of USA
    mapRef.current = map;

    // Add tile layer (map imagery)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Create a fixed-size rectangle
    const bounds = calculateRectangleBounds(map);
    const rectangle = L.rectangle(bounds, {
      color: '#7C3AED',
      weight: 2,
      fillOpacity: 0.2
    }).addTo(map);
    rectangleRef.current = rectangle;

    // Update rectangle on map move
    map.on('move', () => {
      if (rectangleRef.current) {
        const newBounds = calculateRectangleBounds(map);
        rectangleRef.current.setBounds(newBounds);
      }
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [isOpen]);

  const calculateRectangleBounds = (map: L.Map): L.LatLngBounds => {
    const center = map.getCenter();
    const zoom = map.getZoom();
    
    // Calculate offset based on zoom level
    const latOffset = 1 / Math.pow(2, zoom - 4);
    const lngOffset = 2 / Math.pow(2, zoom - 4);

    return L.latLngBounds(
      [center.lat - latOffset, center.lng - lngOffset],
      [center.lat + latOffset, center.lng + lngOffset]
    );
  };

  const handleSearch = async () => {
    if (!rectangleRef.current) return;

    setLoading(true);
    setError(null);

    const bounds = rectangleRef.current.getBounds();
    
    try {
      const response = await api.searchLocations({
        geoBoundingBox: {
          top: bounds.getNorth(),
          bottom: bounds.getSouth(),
          left: bounds.getWest(),
          right: bounds.getEast()
        }
      });

      const zipCodes = response.results.map((location: Location) => location.zip_code);
      onZipCodesSelected(zipCodes);
      onClose();
    } catch (err) {
      setError('Failed to fetch locations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="map-selector-overlay">
      <div className="map-selector-container">
        <div className="map-selector-header">
          <h2>Select Area on Map</h2>
          <button onClick={onClose} className="close-button">×</button>
        </div>
        
        <div id="map" className="map-container"></div>
        
        <div className="map-selector-footer">
          {error && <p className="error-message">{error}</p>}
          <button 
            onClick={handleSearch}
            disabled={loading}
            className="search-button"
          >
            {loading ? 'Searching...' : 'Use Selected Area'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MapSelector; 