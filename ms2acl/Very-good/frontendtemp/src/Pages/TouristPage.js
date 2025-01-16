import React, { useState, useEffect } from 'react';
import '../styles/global.css';
import { fetchTouristByEmail, updateTouristByEmail } from '../RequestSendingMethods';
import ActivityHistoricalList from '../Components/UpcomingSort.js';
import ProductSort from '../Components/SortProductRate.js';
import FilterActivitiesPage from './FilterActivitiesPage';
import FilterItenaryPage from './FilterItenaryPage';
import ActivityItinerarySort from '../Components/SortRatePrice.js';
import MuseumSearch from './MuseumSearch';
import FilterHistoricalPage from './FilterHistoricalPage';
import FilterProductByPrice from './FilterProductByPrice';
import FlightBookingPage from './FlightBookingPage';
import { fetchCategories, searchactivity } from '../Services/activityServices'; // Combined imports
import { useNavigate } from 'react-router-dom';
import ActivityDisplayFilterWise from '../Components/ActivityDisplayFilterWise.js';
//import TouristComplaint from '../pages/TouristComplaint';
import TouristComplaint from './TouristComplaint'; // Importing the component directly
import ViewMyComplaint from './ViewMyComplaint.js';


const TouristPage = ({ email }) => {
  const navigate = useNavigate();
  const [touristData, setTouristData] = useState(null);
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
  const [ShowBookFlightPage, setShowBookFlightPage] = useState(false);

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
        // Save the registered email to localStorage
        localStorage.setItem("userEmail", response.data.email); // Ensure this line is closed properly
      }
    };
    getTouristData();
  }, [email]);
  

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditedData({ ...editedData, [name]: value });
  };

  const handleUpdateProfile = () => {
    setIsEditing(!isEditing);
    setShowProfileInfo(!showProfileInfo); // Toggle profile info

    if (isEditing) {
      if (editedData.email !== oldEmail) {
        setOldEmail(editedData.email);
      }
      setTouristData(editedData);
      updateTouristByEmail(oldEmail, editedData);
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

  const navigateToComplaint = () => {
    navigate('/tourist/complaint'); // Navigate to the complaint page
  };

  const navigateToViewMyComplaints = () => {
    navigate('/tourist/view-my-complaints', { state: { email: oldEmail } });
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


  if (showFilterPage) return <FilterActivitiesPage onBack={handleBackToTouristPage} />;
  if (ShowItenaryPage) return <FilterItenaryPage onBack={handleBackToTouristPageFromItenaryFilterPage} />;
  if (showHistoricalPlace) return <FilterHistoricalPage onBack={handleBackToTouristPageFromFilterHistoricalPlacesPage} />;
  if (showProductFilterPage) return <FilterProductByPrice onBack={handleBackToTouristPageFromFilterProductPage} />;
  if (ShowBookFlightPage) return <FlightBookingPage onBack={handleBackToTouristPageFromBookFlightPage}/>

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
        </div>
      </div>
  
      <div className={`container ${isSidebarOpen ? 'shifted' : ''}`}>
        <header className="header">
          <h1>Welcome, Tourist!</h1>
        </header>
  
        <button className="btn" onClick={handleUpdateProfile}>
          {isEditing ? 'Save Changes' : 'Update Profile'}
        </button>


        {/* Button to navigate to the complaint page */}
        <button className="btn" onClick={navigateToComplaint}>
          File a Complaint
        </button>

        {/* New Button to view complaints */}
      <button className="btn" onClick={navigateToViewMyComplaints}>
        View My Complaints
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


        <ProductSort />
  
        <footer className="footer">
          <p>&copy; 2024 TravelApp. All rights reserved.</p>
        </footer>
      </div>
  
    </div>
  );
};

export default TouristPage;
