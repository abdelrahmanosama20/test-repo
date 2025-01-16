import React, { useState, useEffect } from 'react';
import '../styles/global.css';
import { fetchSellerByEmail, updateSellerByEmail } from '../RequestSendingMethods';
import SellerManagementPage from './SellerManagementPage'; // Import the new page
import Search from './Search';
import FilterProductByPrice from './FilterProductByPrice'
const SellerPage = ({ email }) => {
  const [sellerData, setSellerData] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({});
  const [oldEmail, setOldEmail] = useState(email);
  const [isViewingManagement, setIsViewingManagement] = useState(false); // State for conditional rendering
  const [isProductFilterActive,setIsProductFilterActive]=useState(false);
  useEffect(() => {
    const getSellerData = async () => {
      const response = await fetchSellerByEmail(email);
      if (response) {
        setSellerData(response.seller);
        setEditedData(response.seller);
      }
    };

    getSellerData();
  }, [email]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditedData({ ...editedData, [name]: value });
  };
  const handleProductFilterButtonOnClick =()=>{
    setIsProductFilterActive(true);
  }
  if(isProductFilterActive){
    return <FilterProductByPrice/>
  }

  const handleUpdateProfile = async () => {
    setIsEditing(!isEditing);
    if (isEditing) {
      if (editedData.email !== oldEmail) {
        setOldEmail(editedData.email);
      }
      setSellerData(editedData);
      try {
        const response = await updateSellerByEmail(oldEmail, editedData);
        if (response) {
          console.log('Seller updated successfully:', response);
        }
      } catch (error) {
        console.error('Error updating seller:', error);
      }
    }
  };

  return (
    <div className="seller-page">
      {/* Sidebar Toggle Button */}
      <button className="toggle-btn" onClick={toggleSidebar}>
        {isSidebarOpen ? 'Close' : 'Menu'}
      </button>

      {/* Sidebar */}
      <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-content">
          <h3>Quick Links</h3>
          <button onClick={() => setIsViewingManagement(true)}>SellerProduct</button> {/* New button */}
          <button onClick={handleProductFilterButtonOnClick}>
            Filter Product by Price
          </button> {/* New button with commented action listener */}
        </div>
      </div>

      {/* Conditional Rendering */}
      <div className={`container ${isSidebarOpen ? 'shifted' : ''}`}>
        {isViewingManagement ? (
          <SellerManagementPage  /> // {/* Pass seller's ID to SellerManagementPage id={sellerData?.id} */}
        ) : (
          <>
            <header className="header">
              <h1>Welcome, Seller!</h1>
            </header>

            <div className="profile">
              <h2 className="form-header">Your Profile</h2>
              <div className="profile-info">
                <label>Name:</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={editedData?.name || ''}
                    onChange={handleEditChange}
                  />
                ) : (
                  <p>{sellerData?.name || 'NA'}</p>
                )}
              </div>
              <div className="profile-info">
                <label>Email:</label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={editedData?.email || ''}
                    onChange={handleEditChange}
                  />
                ) : (
                  <p>{sellerData?.email || 'NA'}</p>
                )}
              </div>
              <div className="profile-info">
                <label>Description:</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="description"
                    value={editedData?.description || ''}
                    onChange={handleEditChange}
                  />
                ) : (
                  <p>{sellerData?.description || 'NA'}</p>
                )}
              </div>

              <button className="btn" onClick={handleUpdateProfile}>
                {isEditing ? 'Save Changes' : 'Update Profile'}
              </button>
            </div>

            <footer className="footer">
              <p>&copy; 2024 TravelApp. All rights reserved.</p>
            </footer>
          </>
        )}
      </div>
      <Search/>
    </div>
  );
};

export default SellerPage;
