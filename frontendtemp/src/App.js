import React from 'react';
import AdminDashboard from './AdminDashboard'; // Import your AdminDashboard component

function App() {
    return (
        <div className="container">
            <AdminDashboard /> {/* Only load the Admin Dashboard */}
        </div>
    );
}

export default App;
