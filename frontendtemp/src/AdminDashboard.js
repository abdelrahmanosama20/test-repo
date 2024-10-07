import React, { useState } from 'react';
import UserList from './UserList'; // Import UserList component
import AddTourismGovernor from './AddTourismGovernor'; // Import AddTourismGovernor form
import AddAdmin from './AddAdmin'; // Import AddAdmin form
import './styles/global.css'; // Import global styles

const AdminDashboard = () => {
    const [activePage, setActivePage] = useState(''); // Tracks which page to display

    const handlePageChange = (page) => {
        setActivePage(page); // Change the active page based on selection
    };

    return (
        <div className="admin-dashboard">
            <h1>Admin Dashboard</h1>
            
            {/* User Navigation */}
            <nav className="user-navigation">
                <button onClick={() => handlePageChange('tourists')}>Tourists</button>
                <button onClick={() => handlePageChange('advertisers')}>Advertisers</button>
                <button onClick={() => handlePageChange('sellers')}>Sellers</button>
                <button onClick={() => handlePageChange('tourGuides')}>Tour Guides</button>
                <button onClick={() => handlePageChange('tourismGovernors')}>Tourism Governors</button>
            </nav>

            {/* Buttons for Adding and Managing */}
            <div className="admin-actions">
                <button onClick={() => handlePageChange('addAdmin')}>Add New Admin</button>
                <button onClick={() => handlePageChange('addTourismGovernor')}>Add New Tourism Governor</button>
            </div>

            {/* Conditional Rendering for Forms and Lists */}
            {activePage === 'addAdmin' && <AddAdmin />} {/* Show Add Admin form */}
            {activePage === 'addTourismGovernor' && <AddTourismGovernor />} {/* Show Add Tourism Governor form */}

            {/* Render User Lists based on selected user type */}
            {activePage === 'tourists' && <UserList userType="tourists" />} {/* Show Tourists List */}
            {activePage === 'advertisers' && <UserList userType="advertisers" />} {/* Show Advertisers List */}
            {activePage === 'sellers' && <UserList userType="sellers" />} {/* Show Sellers List */}
            {activePage === 'tourGuides' && <UserList userType="tourGuides" />} {/* Show Tour Guides List */}
            {activePage === 'tourismGovernors' && <UserList userType="tourismGoverners" />}  {/* Show Tourism Governors List */}
        </div>
    );
};

export default AdminDashboard;
