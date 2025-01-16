import React, { useEffect, useRef, useState } from 'react';
import { GoogleMap, MarkerF } from '@react-google-maps/api';

const MapComponent = ({ initialLocation, allowMarkerChange, onLocationSelect }) => {
    const mapRef = useRef(null);

    // State to hold the marker's position
    const [markerPosition, setMarkerPosition] = useState(initialLocation);

    // Set the initial center of the map
    const initialCenter = { lat: 30.745, lng: 30.523 }; // Adjust to your preferred center location

    // Handle the click event on the map to get the selected location
    const handleMapClick = (event) => {
        const lat = event.latLng.lat();
        const lng = event.latLng.lng();
        
        // Update the marker position
        setMarkerPosition({ lat, lng });
        
        // Call the function with selected coordinates if marker changes are allowed
        if (allowMarkerChange) {
            onLocationSelect({ lat, lng });
        }
    };

    useEffect(() => {
        // Update marker position when initialLocation prop changes
        setMarkerPosition(initialLocation);
    }, [initialLocation]);

    return (
        <GoogleMap
            id="map"
            mapContainerStyle={{ height: '400px', width: '800px' }}
            center={markerPosition || initialCenter} // Center on markerPosition or initialCenter
            zoom={10} // Adjust zoom level as needed
            onClick={handleMapClick} // Set up the click event handler
            onLoad={map => (mapRef.current = map)} // Store the map instance if needed
        >
            {/* Render the marker at the current marker position */}
            
            <MarkerF position={markerPosition} />
            
        </GoogleMap>
    );
};

export default MapComponent;
