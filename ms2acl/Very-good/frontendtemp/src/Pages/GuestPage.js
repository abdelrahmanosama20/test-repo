import React, { useState, useEffect } from 'react';
import '../styles/global.css'; // Keep your existing global styles
import FilterActivitiesPage from './FilterActivitiesPage';
import FilterItenaryPage from './FilterItenaryPage';
import FilterHistoricalPage from './FilterHistoricalPage';
import FilterProductByPrice from './FilterProductByPrice';
import ActivityHistoricalList from '../Components/UpcomingSort.js';
import { fetchCategories } from '../Services/activityServices'; // Import fetchCategories service
import { searchactivity } from '../Services/activityServices'; // Import searchactivity service

const GuestPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showFilterPage, setShowFilterPage] = useState(false);
  const [showItenaryPage, setShowItenaryPage] = useState(false); // Corrected variable name
  const [showHistoricalPlace, setShowFilterHistoricalPage] = useState(false);
  const [showProductFilterPage, setShowProductFilterPage] = useState(false);
  const [ShowViewPage, setShowViewPage] = useState(false);
  const [categories, setCategories] = useState([]); // Store all categories
  const [selectedActivities, setSelectedActivities] = useState([]); // To store activities for the selected category
  const [loadingActivities, setLoadingActivities] = useState(false);
  const [activityError, setActivityError] = useState(null);

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

  const handleViewUpcomingActivitiesitenarieshistroicalplaces = () => {
    setShowViewPage(true);
  };

  const handleCategoryClick = async (categoryName) => {
    setLoadingActivities(true);
    setActivityError(null);

    try {
      const activityResults = await searchactivity({ category: categoryName }); // Fetch activities by category
      setSelectedActivities(activityResults); // Set the activities to display
    } catch (error) {
      setActivityError('Error fetching activities for this category');
    } finally {
      setLoadingActivities(false);
    }
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

  if (ShowViewPage) {
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
          <button onClick={handleViewUpcomingActivitiesitenarieshistroicalplaces}>
            View Upcoming Activities/Itineraries/Historical Places
          </button>
        </div>
      </div>

      <div className={`container ${isSidebarOpen ? 'shifted' : ''}`}>
        <header className="header">
          <h1>Welcome, Guest!</h1>
        </header>

        {/* Category Buttons */}
        <div className="category-buttons">
          <h2>Available Categories:</h2>
          {categories.map((category, index) => (
            <button
              key={index}
              onClick={() => handleCategoryClick(category.name)} // Fetch activities for the selected category
              style={{ margin: '5px', padding: '10px', cursor: 'pointer' }} // Inline styles for button
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Loading Indicator */}
        {loadingActivities && <p>Loading activities...</p>}

        {/* Error Message */}
        {activityError && <p className="error">{activityError}</p>}

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
