import React, { useState } from 'react';
import { GoogleMap, LoadScript, Marker, DirectionsService, DirectionsRenderer } from '@react-google-maps/api';

interface PartnerMapProps {
  partnerLocation: { lat: number, lng: number };
  userLocation?: { lat: number, lng: number };
}

const PartnerMap: React.FC<PartnerMapProps> = ({ partnerLocation, userLocation }) => {
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);

  const handleDirectionsService = (result: google.maps.DirectionsResult | null) => {
    if (result) {
      setDirections(result);
    }
  };

  return (
    <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
      <GoogleMap
        mapContainerStyle={{ width: '100%', height: '400px' }}
        center={partnerLocation}
        zoom={15}
      >
        <Marker position={partnerLocation} title="Partner Location" />
        
        {userLocation && (
          <>
            <Marker position={userLocation} title="Your Location" icon="http://maps.google.com/mapfiles/ms/icons/blue-dot.png" />
            
            <DirectionsService
              options={{
                destination: partnerLocation,
                origin: userLocation,
                travelMode: google.maps.TravelMode.DRIVING
              }}
              callback={handleDirectionsService}
            />
          </>
        )}

        {directions && (
          <DirectionsRenderer
            directions={directions}
            options={{
              polylineOptions: {
                strokeColor: '#5483D3',
                strokeOpacity: 0.8,
                strokeWeight: 5
              }
            }}
          />
        )}
      </GoogleMap>
    </LoadScript>
  );
};

export default PartnerMap;
