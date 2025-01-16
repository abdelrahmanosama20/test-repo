import React, { useState, useEffect } from 'react';
import '../styles/global.css';
import { fetchTouristByEmail, updateTouristByEmail ,bookItem} from '../RequestSendingMethods';
import ActivityHistoricalList from '../Components/UpcomingSort.js';
import ProductSort from './SortProductRate.js';
import FilterActivitiesPage from './FilterActivitiesPage';
import FilterItenaryPage from './FilterItenaryPage';
import ActivityItinerarySort from '../Components/SortRatePrice.js';
import MuseumSearch from './MuseumSearch';
import { useParams } from 'react-router-dom';


import FilterHistoricalPage from './FilterHistoricalPage';
import FilterProductByPrice from './FilterProductByPrice';
import FlightBookingPage from './FlightBookingPage';
import { fetchCategories, searchactivity } from '../Services/activityServices'; // Combined imports
import { useNavigate } from 'react-router-dom';
import ActivityDisplayFilterWise from '../Components/ActivityDisplayFilterWise.js';
import PreferenceChoose from '../Components/Preference.js';
import { Link } from 'react-router-dom';
import DeleteTourist from '../Components/DeleteTouristAcc.js';
import TouristService from '../Services/TouristService';


import CommentPageForTourist from './CommentPageForTourist';
import TouristComplaint from './TouristComplaint';
import ViewMyComplaint  from './ViewMyComplaint';
import Booking from '../Components/booking.js';
import RatePageForTourist from './RatePageForTourist';
const TouristPage = ({ email }) => {
  const navigate = useNavigate();
  //
  //const { touristIdFromURL } = useParams(); // Get touristId from URL (if passed in URL)
  const [touristData, setTouristData] = useState(null);
  const [wallet, setWallet] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({});
  const [oldEmail, setOldEmail] = useState(email);
  const [showProfileInfo, setShowProfileInfo] = useState(false);
  const [showFilterPage, setShowFilterPage] = useState(false);
  const [ShowItenaryPage, setShowFilterItenaryPage] = useState(false);
  const [showHistoricalPlace, setShowFilterHistoricalPage] = useState(false);
  const [showProductFilterPage, setShowProductFilterPage] = useState(false);
  const [activities, setActivities] = useState([]); // To store activities for the selected category
  const [categories, setCategories] = useState([]); // Store all the categories
  const [loadingActivities, setLoadingActivities] = useState(false);
  const [activityError, setActivityError] = useState(null);
  //const [touristId, setTouristId] = useState(null);
  const [ShowBookFlightPage, setShowBookFlightPage] = useState(false);
  const [showCommentPage,setShowCommentPage]=useState(false);
  const [showComplaintPage,setShowComplaintPage]=useState(false);
  const [showViewComplaintsPage,SetshowviewComplaintsPage]=useState(false);
  const [ShowBookingPage,SetShowBookingPage]=useState(false);
  const [showRatePage, setShowRatePage] = useState(false);
  //const [touristId, setTouristId] = useState(touristIdFromURL || null); // Use touristId from URL or state
  const touristIdFromURL = new URLSearchParams(window.location.search).get('touristId'); // get touristId from query params
  const [touristId, setTouristId] = useState(null);

  useEffect(() => {
    const getCategories = async () => {
      try {
        const fetchedCategories = await fetchCategories(); // Fetch all categories
        setCategories(fetchedCategories); // Set the categories in state
      } catch (error) {
        setActivityError('Error fetching categories');
      }
    };

    getCategories();
  }, []);

  useEffect(() => {
    const getTouristData = async () => {
      const response = await fetchTouristByEmail({ email });
      if (response) {
        setTouristData(response.data);
        setEditedData(response.data);
        setTouristId(response.data._id);
        setWallet(response.data.wallet);
      }
    };
    getTouristData();
  }, [email]);

  useEffect(() => {
    setTouristId(touristIdFromURL);
  }, [touristIdFromURL]);

  useEffect(() => {
    // Fetch tourist data and wallet information if touristId is available
    if (touristId) {
      fetchTouristData(touristId);
    }
  }, [touristId]);

  const fetchTouristData = async (id) => {
    const response = await fetch(`/api/tourists/${id}`);
    const data = await response.json();
    setTouristData(data);
  };

  const handleAddAddressClick = () => {
    const idToUse = touristId || touristIdFromURL; // Use touristId from state or URL
    if (idToUse) {
      navigate(`/tourist/add-address/${idToUse}`);
    } else {
      console.log('touristId is not available yet');
    }
  };

  const handleChooseDeliveryAddressClick = () => {
    const idToUse = touristId || touristIdFromURL; // Use touristId from state or URL
    if (idToUse) {
      navigate(`/tourist/choose-delivery-address/${idToUse}`);
      console.log('Navigating to delivery address with touristId:', idToUse);
    } else {
      console.log('touristId is not available yet');
    }
  };
 
  const handleViewMyOrderClick = (touristId) => {
    navigate(`/tourist/view-my-orders/${touristId}`);
  };
  
  
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditedData({ ...editedData, [name]: value });
  };

  const handleUpdateProfile = () => {
    setIsEditing(!isEditing);
    setShowProfileInfo(!showProfileInfo);
    if(!isEditing){
      const userInput = prompt("Please enter your password:");
      if( userInput !== touristData.password){
        return
      }
      
    } // Toggle profile info

    if (isEditing) {
      if (editedData.email !== oldEmail) {
        setOldEmail(editedData.email);
      }
      setTouristData(editedData);
      updateTouristByEmail(oldEmail, editedData);
      const userInput2 = prompt("Please confirm password:");
      if( userInput2 !== touristData.password && isEditing){
        return
      }
    }
  };
  const handleDeleteReq = async () => {
    try {
        // Set the 'delete' field to true for the seller
        let editedData = { delete : true };

        // Assuming 'sellerData' contains the email or ID of the seller you want to update
        const response = await updateTouristByEmail(touristData.email,editedData );  // or sellerData._id if you're using ID instead of email
       
        // Check if the update was successful
        if (response.success) {
            console.log("tourist marked for deletion:", response);
            alert("tourist has been marked for deletion.");
            // Handle success (e.g., update UI or alert user)
        } else {
            console.error("Failed to mark tourist for deletion:", response.message);
            // Handle failure (e.g., show error message)
        }
        console.log("resp" ,response)
    } catch (error) {
        console.error("Error updating tourist:", error);
        // Handle error (e.g., show error message)
    }
};

  const navigateToActivitySorted = () => {
    navigate('/tourist/activities');
  }

  const navigateToupcoming = () => {
    navigate('/tourist/upcoming');
  }

  const navigateToSearch = () => {
    navigate('/tourist/search');
  }

  const handleViewBookedFlightsPageClick = () => {
    console.log("touristdata ahe :", touristData.bookedFlightOffers);
    navigate('/tourist/viewBookedFlights', { state: { bookedFlightsIds : touristData.bookedFlightOffers } });
  };

  const handleBookTransportationPageClick = (touristEmail) => {
    navigate('/tourist/bookTransportation', { state: { email: touristEmail } });
  };

  const handleViewTransportation = (touristEmail) => {
    navigate('/tourist/viewBookedTransportation', { state: { email: touristEmail } });
  };

  const handleViewBookedHotels = () => {
    navigate('/tourist/viewBookedHotels', { state: { bookedHotelsIds : touristData.bookedHotelOffers } });
  };

  const handleHotelFlightPageClick = (touristId) =>{
    navigate('/tourist/SearchHotel', {state : {touristId : touristId}})
  }

  const handleViewMyBalance = async (email) => {
    try {
      
      const response = await fetchTouristByEmail({ email });
      if (response) {
        setTouristData(response.data);  // Update the state with the response data
        setEditedData(response.data);    // Update the edited data
        setTouristId(response.data._id); // Update the tourist ID
        navigate('/tourist/viewBalance', { state: { touristData: response.data } }); // Pass the updated data directly
      }
    } catch (error) {
      console.error('Error fetching tourist data:', error);
    }
  };

  const handleCategoryClick = async (categoryName) => {
    setLoadingActivities(true); // Show loading indicator
    setActivityError(null); // Reset error

    try {
      const activityResults = await searchactivity({ category: categoryName }); // Fetch activities by category
      setActivities(activityResults); // Set the activities to display
    } catch (error) {
      setActivityError('Error fetching activities for this category');
    } finally {
      setLoadingActivities(false); // Stop loading
    }
  };

  const handleFilterActivitiesClick = () => setShowFilterPage(true);
  const handleBackToTouristPage = () => setShowFilterPage(false);
  const handleFilterItenariesClick = () => setShowFilterItenaryPage(true);
  const handleBackToTouristPageFromItenaryFilterPage = () => setShowFilterItenaryPage(false);
  const handleFilterHistoricalPlacesClick = () => setShowFilterHistoricalPage(true);
  const handleBackToTouristPageFromFilterHistoricalPlacesPage = () => setShowFilterHistoricalPage(false);
  const handleFilterProductPageClick = () => setShowProductFilterPage(true);
  const handleBackToTouristPageFromFilterProductPage = () => setShowProductFilterPage(false);
  const handleBookFlightPageClick = () => setShowBookFlightPage(true);
  const handleBackToTouristPageFromBookFlightPage = () => setShowBookFlightPage(false);
  const handleCommentClick =()=>setShowCommentPage(true);
  const handleBackToTouristPageFromCommentPage =()=>setShowCommentPage(false);
 const handleComplaintpageClick =()=>setShowComplaintPage(true);
 const handleComplaintViewPageClick =()=>SetshowviewComplaintsPage(true);
 const handleBookingPageClick =()=>SetShowBookingPage(true);
 const handleRateClick =()=>setShowRatePage(true);
 const handleBackToTouristPageFromRatePage =()=>setShowRatePage(false);
  if (showFilterPage) return <FilterActivitiesPage onBack={handleBackToTouristPage} />;
  if (ShowItenaryPage) return <FilterItenaryPage onBack={handleBackToTouristPageFromItenaryFilterPage} />;
  if (showHistoricalPlace) return <FilterHistoricalPage onBack={handleBackToTouristPageFromFilterHistoricalPlacesPage} />;
  if (showProductFilterPage) return <FilterProductByPrice onBack={handleBackToTouristPageFromFilterProductPage} />;
  if (ShowBookFlightPage) return <FlightBookingPage onBack={handleBackToTouristPageFromBookFlightPage} touristId={touristId}/>
  if (showCommentPage)return <CommentPageForTourist onBackClick = {handleBackToTouristPageFromCommentPage} email={email} touristId={touristId}/>
  if (showViewComplaintsPage)return <ViewMyComplaint email ={email}/>;
  if(showComplaintPage)return <TouristComplaint email ={email}/>;
  if(ShowBookingPage)return <Booking touristId={touristId} wallet={wallet}/>;
  if (showRatePage)return <RatePageForTourist onBackClick = {handleBackToTouristPageFromRatePage} email={email} touristId={touristId}/>
  return (
    <div className="tourist-page">
      <button className="toggle-btn" onClick={toggleSidebar}>
        {isSidebarOpen ? 'Close' : 'Menu'}
      </button>
  
      <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-content">
          <h3>Quick Links</h3>
          <button onClick={handleFilterActivitiesClick}>Filter Activities</button>
          <button onClick={handleFilterItenariesClick}>Filter Itineraries</button>
          <button onClick={handleFilterHistoricalPlacesClick}>Filter Historical Places</button>
          <button onClick={handleFilterProductPageClick}>Filter Products</button>
          <button onClick={handleBookFlightPageClick}>Book a Flight</button>
          <button onClick={handleCommentClick}>Comment</button>
          <button onClick={handleRateClick}>Rate</button>
          <button onClick={handleComplaintpageClick}>Complaint</button>
          <button onClick={handleComplaintViewPageClick}>View_My_Complaints</button>
          <button onClick={handleBookingPageClick}>Book itineraries/activities</button>
          <button onClick={handleViewBookedFlightsPageClick}>View my Booked Flights</button>
          <button onClick={() => handleHotelFlightPageClick(touristId)}>Book a Hotel</button>
          <button onClick={() => handleViewBookedHotels(touristId)}>View my Booked Hotels</button>
          <button onClick={() => handleBookTransportationPageClick(touristData?.email)}>Book a Transportation</button>
          <button onClick={() => handleViewTransportation(touristData?.email)}>View my Transportations</button>
          <button onClick={() => handleViewMyBalance(email)}>View my Balance</button>
          <button onClick={handleAddAddressClick}>Add Address</button>
          <button onClick={handleChooseDeliveryAddressClick} disabled={!touristId && !touristIdFromURL}>
        Choose Delivery Address
      </button>
          <button onClick={() => handleViewMyOrderClick(touristId)}>View My Order</button>
        </div>
      </div>
  
      <div className={`container ${isSidebarOpen ? 'shifted' : ''}`}>
        <header className="header">
          <h1>Welcome, Tourist!</h1>
        </header>
  
        <button className="btn" onClick={handleUpdateProfile}>
          {isEditing ? 'Save Changes' : 'Update Profile'}
        </button>

        {/* Display Categories as Buttons */}
        <div className="category-buttons">
          <h2>Choose a Category:</h2>
          {categories.length > 0 ? (
            categories.map((category, index) => (
              <button
                key={index}
                onClick={() => handleCategoryClick(category.name)} // Use category name here
                className="category-btn"
              >
                {category.name}
              </button>
            ))
          ) : (
            <p>No categories available.</p>
          )}
        </div>
  
        {/* Loading Indicator */}
        {loadingActivities && <p>Loading activities...</p>}
  
        {/* Error Message */}
        {activityError && <p className="error">{activityError}</p>}
  
        {/* Display Selected Activities */}
        {activities.length > 0 && (
          <div className="activities-list">
            <h2>Available Activities:</h2>
            <ul>
              {activities.map((activity, index) => (
                <ActivityDisplayFilterWise activity={activity}/> // Assuming activity has a 'name' field
              ))}
            </ul>
          </div>
        )}
  
        {showProfileInfo && (
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
                <p>{touristData?.name || 'NA'}</p>
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
                <p>{touristData?.password || 'NA'}</p>
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
                <p>{touristData?.email || 'NA'}</p>
              )}
            </div>
            <div className="profile-info">
              <label>Mobile:</label>
              {isEditing ? (
                <input
                  type="text"
                  name="mobile"
                  value={editedData?.mobile || ''}
                  onChange={handleEditChange}
                />
              ) : (
                <p>{touristData?.mobile || 'NA'}</p>
              )}
            </div>
            <div className="profile-info">
              <label>Nationality:</label>
              {isEditing ? (
                <input
                  type="text"
                  name="nationality"
                  value={editedData?.nationality || ''}
                  onChange={handleEditChange}
                />
              ) : (
                <p>{touristData?.nationality || 'NA'}</p>
              )}
            </div>
            <div className="profile-info">
              <label>Job:</label>
              {isEditing ? (
                <input
                  type="text"
                  name="job"
                  value={editedData?.job || ''}
                  onChange={handleEditChange}
                />
              ) : (
                <p>{touristData?.job || 'NA'}</p>
              )}
            </div>
            <div className="profile-info">
              <label>Date of Birth:</label>
              <p>{touristData?.dob || 'NA'}</p>
            </div>
            <div className="profile-info">
              <label>Wallet Balance:</label>
              <p>${touristData?.wallet || 'NA'}</p>
            </div>
          </div>
        )}
  
        <button onClick={navigateToupcoming}>show upcoming activities / itineraries</button>

        <button onClick={navigateToActivitySorted}>show activity sorted</button>

        <button onClick={navigateToSearch}> search activity / musuem / itinerary </button>
        
        <br></br> <br>
        </br>
        {/* <PreferenceChoose/> */}
           <button onClick={() => navigate('/tourist/preference')}>
                Choose Preferences
            </button>

        <ProductSort email ={email} touristId = {touristId} />
      

        <DeleteTourist email={email }/>
        <button onClick={()=>handleDeleteReq()}> send delete request</button>
        <div>
            <h1>Welcome to the Activity Planner</h1>
           
        </div>
        <footer className="footer">
          <p>&copy; 2024 TravelApp. All rights reserved.</p>
        </footer>
         
      </div>
      
    </div>
  );
};

export default TouristPage;
