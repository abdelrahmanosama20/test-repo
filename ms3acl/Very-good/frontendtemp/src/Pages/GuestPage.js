import React, { useState, useEffect } from 'react';
import '../styles/global.css'; // Keep your existing global styles
import FilterActivitiesPage from './FilterActivitiesPage';
import UploadDocumentsTourGuide from './UploadDocumentsTourGuide'
import FilterItenaryPage from './FilterItenaryPage';
import FilterHistoricalPage from './FilterHistoricalPage';
import FilterProductByPrice from './FilterProductByPrice';
import ActivityHistoricalList from '../Components/UpcomingSort.js';
import { fetchCategories } from '../Services/activityServices'; // Import fetchCategories service
import { searchactivity } from '../Services/activityServices'; // Import searchactivity service
import { useNavigate } from 'react-router-dom';
import ActivityDisplayFilterWise from '../Components/ActivityDisplayFilterWise.js';

const GuestPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showFilterPage, setShowFilterPage] = useState(false);
  const [showItenaryPage, setShowItenaryPage] = useState(false); // Corrected variable name
  const [showHistoricalPlace, setShowFilterHistoricalPage] = useState(false);
  const [showProductFilterPage, setShowProductFilterPage] = useState(false);
  const [showViewPage, setShowViewPage] = useState(false);
  const [categories, setCategories] = useState([]); // Store all categories
  const [selectedActivities, setSelectedActivities] = useState([]); // To store activities for the selected category
  const [loadingActivities, setLoadingActivities] = useState(false);
  const [activityError, setActivityError] = useState(null);
  const [showSignInDropdown, setShowSignInDropdown] = useState(false); // Control dropdown visibility
  const [UploadTourGuide, setShowUploadTourGuide] = useState(false);
  const [activities, setActivities] = useState([]); // To store activities for the selected category

  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleFilterActivitiesClick = () => {
    setShowFilterPage(true);
  };

  const handleBackToGuestPage = () => {
    setShowFilterPage(false);
  };

  const handleFilterItenariesClick = () => {
    setShowItenaryPage(true);
  };

  const handleBackToGuestPageFromItenaryFilterPage = () => {
    setShowItenaryPage(false);
  };

  const handleFilterHistoricalPlacesClick = () => {
    setShowFilterHistoricalPage(true);
  };

  const handleBackToGuestPageFromFilterHistoricalPlacesPage = () => {
    setShowFilterHistoricalPage(false);
  };

  const handleFilterProductPageClick = () => {
    setShowProductFilterPage(true);
  };

  const handleBackToGuestPageFromFilterProductPage = () => {
    setShowProductFilterPage(false);
  };

  const handleViewUpcomingActivitiesItenariesHistoricalPlaces = () => {
    setShowViewPage(true);
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

  const handleSignInClick = () => {
    setShowSignInDropdown(!showSignInDropdown); // Toggle dropdown visibility
  };


  const handleSignInonClickTourist=()=>{
    setShowSignInDropdown(false);
    // should go to the tourist page 
    // should we open the form of uploading documents right away ? 
    // A7sn 3lshan nb3d 3n el form registration el fl app .js 
    // so here we should transform to the registration page , take the email from the data sent , somehow connect it to the other page we 
    // will do called uploading documents 
  };

  const handleSignInonClickTourguide=()=>{
    setShowSignInDropdown(false);
    // should head to the tourguide page 
    // we should go to the registration first then we should from there go to the uploadPage and from the Uploadpage to the tourguide home page  
    //setShowUploadTourGuide(true);
    // this gets us to the registration 
   navigate("/", { state: { role: "tourGuide" } });
  };
  const handleSignInonClickAdvertiser=()=>{
    setShowSignInDropdown(false);
    // should head over to the advertisers page 
    navigate("/", { state: { role: "advertiser" } });
  };
  const handleSignInonClickSeller=()=>{
    setShowSignInDropdown(false);
    // should head over to the seller page , 
    navigate("/", { state: { role: "seller" } });
    
  };






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

  if (showViewPage) {
    return <ActivityHistoricalList />;
  }

  if (showFilterPage) {
    return <FilterActivitiesPage onBack={handleBackToGuestPage} />;
  }

  if (showItenaryPage) {
    return <FilterItenaryPage onBack={handleBackToGuestPageFromItenaryFilterPage} />;
  }

  if (showHistoricalPlace) {
    return <FilterHistoricalPage onBack={handleBackToGuestPageFromFilterHistoricalPlacesPage} />;
  }

  if (showProductFilterPage) {
    return <FilterProductByPrice onBack={handleBackToGuestPageFromFilterProductPage} />;
  }
  if(UploadTourGuide){
    return <UploadDocumentsTourGuide/>;
  }

  return (
    <div className="guest-page">
      {/* Sidebar Toggle Button */}
      <button className="toggle-btn" onClick={toggleSidebar}>
        {isSidebarOpen ? 'Close' : 'Menu'}
      </button>

      {/* Sidebar */}
      <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-content">
          <h3>Quick Links</h3>
          <button onClick={handleFilterActivitiesClick}>Filter Activities</button>
          <button onClick={handleFilterItenariesClick}>Filter Itineraries</button>
          <button onClick={handleFilterHistoricalPlacesClick}>Filter Historical Places</button>
          <button onClick={handleViewUpcomingActivitiesItenariesHistoricalPlaces}>
            View Upcoming Activities/Itineraries/Historical Places
          </button>
          
          <button onClick={handleSignInClick}>Sign In</button>

          {/* Sign In Dropdown */}
          {showSignInDropdown && (
            <div className="sign-in-dropdown">
              <button onClick={handleSignInonClickTourist}>Tourist</button>
              <button onClick={handleSignInonClickTourguide}>Tour Guide</button>
              <button onClick={handleSignInonClickAdvertiser}>Advertiser</button>
              <button onClick={handleSignInonClickSeller}>Seller</button>
            </div>
          )}
        </div>
      </div>

      <div className={`container ${isSidebarOpen ? 'shifted' : ''}`}>
        <header className="header">
          <h1>Welcome, Guest!</h1>
        </header>

        {/* Category Buttons */}
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
        {/* Display Activities */}
        {selectedActivities.length > 0 && (
          <div className="activities-list">
            <h2>Activities:</h2>
            {selectedActivities.map((activity, index) => (
              <div key={index} className="activity-item">
                <h3>{activity.name}</h3>
                <p>{activity.description}</p>
                {/* Add more activity details as needed */}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GuestPage;
