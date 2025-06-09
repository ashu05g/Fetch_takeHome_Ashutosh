import React, { useState } from 'react';
import MapSelector from '../components/MapSelector/MapSelector';

const MapTest: React.FC = () => {
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [selectedZipCodes, setSelectedZipCodes] = useState<string[]>([]);

  const handleZipCodesSelected = (zipCodes: string[]) => {
    setSelectedZipCodes(zipCodes);
    console.log('Selected zip codes:', zipCodes);
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Map Selector Test</h1>
      
      <button
        onClick={() => setIsMapOpen(true)}
        style={{
          backgroundColor: '#7C3AED',
          color: 'white',
          padding: '0.5rem 1rem',
          borderRadius: '6px',
          border: 'none',
          cursor: 'pointer',
          marginBottom: '1rem'
        }}
      >
        Open Map Selector
      </button>

      {selectedZipCodes.length > 0 && (
        <div>
          <h2>Selected Zip Codes:</h2>
          <ul>
            {selectedZipCodes.map(zipCode => (
              <li key={zipCode}>{zipCode}</li>
            ))}
          </ul>
        </div>
      )}

      <MapSelector
        isOpen={isMapOpen}
        onClose={() => setIsMapOpen(false)}
        onZipCodesSelected={handleZipCodesSelected}
      />
    </div>
  );
};

export default MapTest; 