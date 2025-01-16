import React, { useState } from 'react';
import { fetchHotelsByCity, createHotelOffer,  addHotelOfferToTourist} from '../Services/BookingFlightServices';
import HotelOffersDisplay from './HotelOffersDisplay';
import { useLocation } from 'react-router-dom';

const locationOptions = [
    { name: "London", code: "LON" },
    { name: "New York City", code: "NYC" },
    { name: "Los Angeles", code: "LAX" },
    { name: "Tokyo", code: "TYO" },
    { name: "Paris", code: "CDG" },
];

const chainOptions = [
    { name: "None", code: "" },
    { name: "InterContinental Hotels Group", code: "IH" },
    { name: "Marriott International", code: "MC" },
    { name: "Hilton Hotels", code: "HG" },
    { name: "Hyatt Hotels", code: "HY" },
    { name: "Wyndham Hotels", code: "WD" },
    { name: "Radisson Hotels", code: "RC" },
];

const ratings = [1, 2, 3, 4, 5];

const SearchHotel = () => {
    const location = useLocation();
    const { touristId } = location.state || {};
    const [formData, setFormData] = useState({
        cityCode: '',
        radius: 5,
        radiusUnit: 'KM',
        /*chainCodes: '',
        amenities: [],
        ratings: [],
        hotelSource: 'ALL',*/
    });
    
    const [hotels, setHotels] = useState(null);
    const [error, setError] = useState(null);

    const onBookHotel = async (offer) => {
        console.log("el offer aho",offer);
        const newOffer = await createHotelOffer(offer);
        const offerId = newOffer.data._id;
        await addHotelOfferToTourist(touristId, offerId);
        return offerId;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Destructure the necessary fields from formData
            const { cityCode, radius, radiusUnit, chainCodes, amenities, ratings, hotelSource } = formData;
    
            // Call the fetchHotelsByCity function with the destructured fields
            const hotelResponse = await fetchHotelsByCity({
                cityCode,
                radius,
                radiusUnit,
                /*chainCodes: chainCodes.split(',').map(code => code.trim()), // Convert comma-separated string to array
                amenities,
                ratings,
                hotelSource,*/
            });
    
            if (hotelResponse) {
                console.log("el hote;s :", hotelResponse)
                setHotels(hotelResponse.data); // Save the response to state
                setError(null); // Clear any previous errors
            } else {
                setError('No hotels found or an error occurred.');
            }
        } catch (err) {
            console.error('Error in hotel search:', err);
            setError('Failed to fetch hotels. Please try again.');
        }
    };

    const updateFormData = (newData) => {
        setFormData((prev) => ({ ...prev, ...newData }));
    };

    return (
        <div className="search-hotel-container">
            <h2>Search Hotels</h2>
            <form className="search-hotel-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>City:</label>
                    <select
                        value={formData.cityCode}
                        onChange={(e) => updateFormData({ cityCode: e.target.value })}
                        required
                        className="form-select"
                    >
                        <option value="">Select City</option>
                        {locationOptions.map((location) => (
                            <option key={location.code} value={location.code}>
                                {location.name}
                            </option>
                        ))}
                    </select>
                    <input
                        type="text"
                        value={formData.cityCode}
                        onChange={(e) => updateFormData({ cityCode: e.target.value })}
                        placeholder="Or enter IATA code"
                        className="form-input"
                    />
                </div>
                <div className="form-group">
                    <label>Radius :</label>
                    <input
                        type="number"
                        value={formData.radius}
                        onChange={(e) => updateFormData({ radius: e.target.value })}
                        min="1"
                        className="form-input"
                    />
                </div>
                <div className="form-group">
                    <label>Radius Unit:</label>
                    <select
                        value={formData.radiusUnit}
                        onChange={(e) => updateFormData({ radiusUnit: e.target.value })}
                        className="form-select"
                    >
                        <option value="KM">Kilometers</option>
                        <option value="MILE">Miles</option>
                    </select>
                </div>
                <button type="submit" className="submit-button">Search Hotels</button>
            </form>
            {error && <div className="error-message">{error}</div>}
            {hotels && (
                <div className="hotel-results">
                    <HotelOffersDisplay hotels={hotels} onBookHotel={onBookHotel}/>
                </div>
            )}
        </div>
    );
};

export default SearchHotel;
