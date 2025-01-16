import React from 'react';

const locationOptions = [
    { name: "London", code: "LON" },
    { name: "New York City", code: "NYC" },
    { name: "Los Angeles", code: "LAX" },
    { name: "Tokyo", code: "TYO" },
    { name: "Paris", code: "CDG" },
];

const FlightSearchForm = ({ onSearch, formData, updateFormData }) => {
    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch(formData); // Call the search function provided by the parent
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Origin:</label>
                <select
                    value={formData.origin}
                    onChange={(e) => updateFormData({ ...formData, origin: e.target.value })}
                    required
                >
                    <option value="">Select Origin</option>
                    {locationOptions.map((location) => (
                        <option key={location.code} value={location.code}>
                            {location.name}
                        </option>
                    ))}
                </select>
                <input
                    type="text"
                    value={formData.originIata}
                    onChange={(e) => updateFormData({ ...formData, originIata: e.target.value })}
                    placeholder="Or enter IATA code"
                />
            </div>
            <div>
                <label>Destination:</label>
                <select
                    value={formData.destination}
                    onChange={(e) => updateFormData({ ...formData, destination: e.target.value })}
                    required
                >
                    <option value="">Select Destination</option>
                    {locationOptions.map((location) => (
                        <option key={location.code} value={location.code}>
                            {location.name}
                        </option>
                    ))}
                </select>
                <input
                    type="text"
                    value={formData.destinationIata}
                    onChange={(e) => updateFormData({ ...formData, destinationIata: e.target.value })}
                    placeholder="Or enter IATA code"
                />
            </div>
            <div>
                <label>Departure Date:</label>
                <input
                    type="date"
                    value={formData.departureDate}
                    onChange={(e) => updateFormData({ ...formData, departureDate: e.target.value })}
                    required
                />
            </div>
            <div>
                <label>Departure Time:</label>
                <input
                    type="time"
                    value={formData.departureTime}
                    onChange={(e) => updateFormData({ ...formData, departureTime: e.target.value })}
                    required
                />
            </div>
            <div>
                <label>Traveler Type:</label>
                <select
                    value={formData.travelerType}
                    onChange={(e) => updateFormData({ ...formData, travelerType: e.target.value })}
                >
                    <option value="ADULT">Adult</option>
                    <option value="CHILD">Child</option>
                    <option value="INFANT">Infant</option>
                </select>
            </div>
            <button type="submit">Search Flights</button>
        </form>
    );
};

export default FlightSearchForm;
