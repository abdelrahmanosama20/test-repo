// AdminDelete.js
import React, { useState } from 'react';
import TouristAccountsList from './TouristAccountsList';
import SellerAccountsList from './SellerAccountsList';
import AdvertiserAccountsList from './AdvertiserAccountsList';
import TourGuideAccountsList from './TourGuideAccountsList';
import TourismGovernerAccountsList from './TourismGovernerAccountsList';
const AdminDelete = ({ onBack }) => {
    const [selectedOption, setSelectedOption] = useState(null); // State to hold the selected account type

    const handleOptionSelect = (option) => {
        setSelectedOption(option); // Set the selected option
    };

    // Render the appropriate component based on selected option
    const renderSelectedComponent = () => {
        switch (selectedOption) {
            case 'Tourist':
                return <TouristAccountsList onBack={() => setSelectedOption(null)} />;
            case 'Advertiser':
                return <AdvertiserAccountsList onBack={() => setSelectedOption(null)} />;
            case 'TourGuide':
                return <TourGuideAccountsList onBack={() => setSelectedOption(null)} />;
            case 'Seller':
                return <SellerAccountsList onBack={() => setSelectedOption(null)} />;
            case 'TourismGovernor':
                return <TourismGovernerAccountsList onBack={() => setSelectedOption(null)} />;
            default:
                return null;
        }
    };

    return (
        <div>
            <h2>Admin Delete Page</h2>
            <p>Welcome to the Admin Delete page!</p>
            <h3>Select an account type to delete:</h3>
            <div>
                <button onClick={() => handleOptionSelect('Tourist')}>Delete Tourist</button>
                <button onClick={() => handleOptionSelect('Advertiser')}>Delete Advertiser</button>
                <button onClick={() => handleOptionSelect('TourGuide')}>Delete Tour Guide</button>
                <button onClick={() => handleOptionSelect('Seller')}>Delete Seller</button>
                <button onClick={() => handleOptionSelect('TourismGovernor')}>Delete Tourism Governor</button>
            </div>
            {renderSelectedComponent()} {/* Conditionally render based on selection */}
            <button onClick={onBack}>Back to Admin Page</button>
        </div>
    );
};

export default AdminDelete;
