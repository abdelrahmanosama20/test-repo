import React, { useState, useEffect } from 'react';
import '../styles/global.css';
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { fetchSellerByEmail, updateSellerByEmail } from '../RequestSendingMethods';
import SellerManagementPage from './SellerManagementPage'; // Import the new page
import Search from './Search';
import FilterProductByPrice from './FilterProductByPrice'
import DeleteSeller from '../Components/DeleteSellerAcc';
import UploadDocumentsSeller from './UploadDocumentsSeller'
import UploadingAlogoSeller from './UploadingAlogoSeller'
import FetchProducts from '../Components/uploadingAproductPicture'

const TermsAndConditionsModal = ({ onAccept }) => {
  return (
      <div className="modal-overlay">
          <div className="modal-content">
              <h2>Terms and Conditions</h2>
              <p>Please Accept The Terms and Conditions to proceed.</p>
              <button onClick={onAccept}>Accept</button>
          </div>
      </div>
  );
};
const NotAccepted = ({ onAccept }) => {
  return (
      <div className="modal-overlay">
          <div className="modal-content">
              <p>Not Accepted.</p>
              <button onClick={onAccept}>back</button>
          </div>
      </div>
  );
};



const SellerPage = ({ email }) => {
  const [sellerData, setSellerData] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({});
  const [oldEmail, setOldEmail] = useState(email);
  const [isViewingManagement, setIsViewingManagement] = useState(false); // State for conditional rendering
  const [isProductFilterActive,setIsProductFilterActive]=useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [uploadPage, setUploadPage]=useState(true); // default with true
  const [isUploadingAlogo,setIsUploadingAphoto]=useState(false);
  const [isUploadingAproductPicture,setIsUploadingAproductPicture]=useState(false);
  const navigate = useNavigate();
  const handleBackfromUploadPage = () => {
    setUploadPage(false);
  }; 
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
  const handleAcceptTerms = () => {
    setTermsAccepted(true); // Set terms as accepted
};

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditedData({ ...editedData, [name]: value });
  };
  const handleProductFilterButtonOnClick =()=>{
    setIsProductFilterActive(true);
  }
  const handleUploadPhoto =()=>{
    setIsUploadingAphoto(true);
  }
  const handleBackToSeller =()=>{
    setIsUploadingAphoto(false);
  }
  if(isProductFilterActive){
    return <FilterProductByPrice/>
  }
  const handleDeleteReq = async () => {
    try {
        // Set the 'delete' field to true for the seller
        let editedData = { delete: true };

        // Assuming 'sellerData' contains the email or ID of the seller you want to update
        const response = await updateSellerByEmail(sellerData.email, editedData);  // or sellerData._id if you're using ID instead of email
        
        // Check if the update was successful
        if (response.success) {
            console.log("Seller marked for deletion:", response);
            alert("Seller has been marked for deletion.");
            // Handle success (e.g., update UI or alert user)
        } else {
            console.error("Failed to mark seller for deletion:", response.message);
            // Handle failure (e.g., show error message)
        }
    } catch (error) {
        console.error("Error updating seller:", error);
        // Handle error (e.g., show error message)
    }
};
  const handleUploadAproductPicture = ()=>{
    setIsUploadingAproductPicture(true);
  }
  const handleUpdateProfile = async () => {
    if(!isEditing){
    const userInput = prompt("Please enter your password:");
    if( userInput !== sellerData.password){
      return
    }
  }
    setIsEditing(!isEditing);
    if (isEditing) {
      if (editedData.email !== oldEmail) {
        setOldEmail(editedData.email);
      }
      
      try {
        const response = await updateSellerByEmail(oldEmail, editedData);
        if (response) {
          console.log('Seller updated successfully:', response);
        }
        setSellerData(editedData);
      const userInput2 = prompt("Please confirm password:");
      if( userInput2 !== sellerData.password && isEditing){
        return
      }
      } catch (error) {
        console.error('Error updating seller:', error);
      }
    }
  };
  if (uploadPage){
    return <UploadDocumentsSeller onBack={handleBackfromUploadPage} email={email} />
  }
  if(isUploadingAproductPicture){
    console.log("email passed to the uploadproductpic:",email)
    return <FetchProducts sellerEmail={email}/>
  }
 
  const r1 =()=>{
    console.log("00000000000")
    navigate("/");
    
  }
  if(sellerData.isPendingAcceptance || sellerData.isAccepted==="false"){
    return <NotAccepted onAccept={()=>r1()} />
}
if (!termsAccepted && !sellerData.isPendingAcceptance && sellerData.isAccepted==="true") {
  return <TermsAndConditionsModal onAccept={handleAcceptTerms} />;
}

  if(isUploadingAlogo){
    return <UploadingAlogoSeller onBack={handleBackToSeller} email={email} />;
  }
  
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
          <button onClick={handleUploadPhoto}>Upload_A_Logo</button>
          <button onClick={handleUploadAproductPicture}>UploadProductPicture</button>
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
                <label>Password:</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="password"
                    value={editedData?.password || ''}
                    onChange={handleEditChange}
                  />
                ) : (
                  <p>{"Not Visible" || 'NA'}</p>
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
             < DeleteSeller email={sellerData?.email} />
             <button onClick={()=>handleDeleteReq()}> Send delete Request</button>
            <footer className="footer">
              <p>&copy; 2024 TravelApp. All rights reserved.</p>
            </footer>
          </>
        )}
      </div>
      <Search sellerId={sellerData._id}/>
    </div>
  );
};

export default SellerPage;
