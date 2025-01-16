import React, { useEffect, useRef, useState } from 'react';
import { GoogleMap, MarkerF } from '@react-google-maps/api';

const SimpleMapComponent = ({ location }) => {
    
    // State to hold the marker's positio

    return (
        <GoogleMap
            id="map"
            mapContainerStyle={{ height: '400px', width: '800px' }}
            center={location} // Center on markerPosition or initialCenter
            zoom={10} // Adjust zoom level as needed
        >
            
            <MarkerF position={{location}} />
        </GoogleMap>
    );
};

export default SimpleMapComponent;
