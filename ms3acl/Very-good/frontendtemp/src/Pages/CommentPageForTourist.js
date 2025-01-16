import React, { useState, useEffect } from 'react';
import { fetchPastbookedbytouristItineraries, fetchPastbookedbytouristItinerariesItneraryComment, fetchPastActivities } from '../RequestSendingMethods';
import { addCommentToItinerary,addCommentToActivity,addCommentToTourGuide } from '../Services/commentServices';
import '../styles/global.css';

const CommentPageForTourist = ({ onBackClick, email, touristId }) => {
  const [commentType, setCommentType] = useState(null);
  const [tourGuides, setTourGuides] = useState([]);
  const [itineraries, setItineraries] = useState([]);
  const [activities, setActivities] = useState([]); // New state for activities
  const [selectedItem, setSelectedItem] = useState(null);
  const [comment, setComment] = useState('');
  const [commenttani,setcommenttani]=useState('');

  useEffect(() => {
    if (commentType === 'tourGuide') {
      loadTourGuides();
    }
    if (commentType === 'itinerary') {
      loadItinerariesWithTourGuideName();
    }
    if (commentType === 'activity') {
      loadActivities();
    }
  }, [commentType]);

  const loadTourGuides = async () => {
    try {
      const response = await fetchPastbookedbytouristItineraries(email);
      if (response && Array.isArray(response.data)) {
        setTourGuides(response.data);
      }
    } catch (error) {
      console.error('Error fetching tour guides:', error);
    }
  };

  const loadItinerariesWithTourGuideName = async () => {
    try {
      const response = await fetchPastbookedbytouristItinerariesItneraryComment(email);
      if (response && Array.isArray(response.data)) {
        setItineraries(response.data);
      }
    } catch (error) {
      console.error('Error fetching itineraries:', error);
    }
  };

  const loadActivities = async () => {
    try {
      const response = await fetchPastActivities(email);
     // console.log(response)
      if (response) {
        console.log(response)
        setActivities(response.pastActivities);
      }
    } catch (error) {
      console.error('Error fetching activities:', error);
    }
  };

  const handleTourGuideSelection = () => {
  setCommentType('tourGuide') 
   setcommenttani('tourGuide')
  };

  const handleActivitySelection = () => {
  setCommentType('activity')
  setcommenttani('activity')
};

  const handleItinerarySelection = () => 
  {setCommentType('itinerary')
  setcommenttani('itinerary')
};

  const handleItemClick = (item) => {
    setSelectedItem(item);
    setCommentType('writeComment');
  };

  const handleCommentChange = (e) => setComment(e.target.value);

  const handleDoneClick = async () => {
    console.log("selected item:",selectedItem);
    console.log("selected item id:",selectedItem.id);
    console.log("commentType:",commentType);
    if (selectedItem && selectedItem.id && commenttani ==='itinerary') {
      try {
        await addCommentToItinerary(selectedItem.id, touristId, comment);
        console.log(`Comment for ${selectedItem.title || selectedItem.email || selectedItem.activityTitle}:`, comment);
      } catch (error) {
        console.error('Error adding comment:', error);
      }
      setComment('');
      setSelectedItem(null);
      setCommentType(null);
    };

    if (selectedItem && selectedItem.id && commenttani ==='activity') {

      try {
        await addCommentToActivity(selectedItem.id, touristId, comment);
        console.log(`Comment for ${selectedItem.title || selectedItem.email || selectedItem.activityTitle}:`, comment);
      } catch (error) {
        console.error('Error adding comment:', error);
      }
      setComment('');
      setSelectedItem(null);
      setCommentType(null);
    };
    if (selectedItem && selectedItem.id && commenttani ==='tourGuide') {
      try {
        await addCommentToTourGuide(selectedItem.id, touristId, comment);
        console.log(`Comment for ${selectedItem.title || selectedItem.email || selectedItem.activityTitle}:`, comment);
      } catch (error) {
        console.error('Error adding comment:', error);
      }
      setComment('');
      setSelectedItem(null);
      setCommentType(null);
    };

    
  };

  return (
    <div className="container">
      {!commentType ? (
        <div>
          <p>What would you like to comment on?</p>
          <button onClick={handleTourGuideSelection} className="button">Tour Guide</button>
          <button onClick={handleActivitySelection} className="button">Activity Attended</button>
          <button onClick={handleItinerarySelection} className="button">Itinerary</button>
        </div>
      ) : commentType === 'tourGuide' && !selectedItem ? (
        <div>
          <h3>Select a Tour Guide to Comment On</h3>
          <table className="table">
            <thead>
              <tr>
                <th>Email</th>
                <th>ID</th>
                <th>Select</th>
              </tr>
            </thead>
            <tbody>
              {tourGuides.map((tourguide, index) => (
                <tr key={index}>
                  <td>{tourguide.email}</td>
                  <td>{tourguide.id}</td>
                  <td>
                    <button onClick={() => handleItemClick(tourguide)}>Select</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : commentType === 'itinerary' && !selectedItem ? (
        <div>
          <h3>Select an Itinerary to Comment On</h3>
          <table className="table">
            <thead>
              <tr>
                <th>Itinerary Title</th>
                <th>Tour Guide Name</th>
                <th>Rating</th>
                <th>ID</th>
                <th>Select</th>
              </tr>
            </thead>
            <tbody>
              {itineraries.map((itinerary, index) => (
                <tr key={index}>
                  <td>{itinerary.itineraryTitle}</td>
                  <td>{itinerary.tourGuideName}</td>
                  <td>{itinerary.ratings}</td>
                  <td>{itinerary.id}</td>
                  <td>
                    <button onClick={() => handleItemClick(itinerary)}>Select</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : commentType === 'activity' && !selectedItem ? (
        <div>
          <h3>Select an Activity to Comment On</h3>
          <table className="table">
            <thead>
              <tr>
                <th>Activity Title</th>
                <th>ID</th>
                <th>Select</th>
              </tr>
            </thead>
            <tbody>
              {activities.map((activity, index) => (
                <tr key={index}>
                  <td>{activity?.name}</td>
                  <td>{activity?.id}</td>
                  <td>
                    <button onClick={() => handleItemClick(activity)}>Select</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div>
          <h3>Leave a Comment for {selectedItem.title || selectedItem.email || selectedItem.activityTitle}</h3>
          <textarea
            value={comment}
            onChange={handleCommentChange}
            placeholder="Write your comment here..."
            className="comment-textarea"
          />
          <button onClick={handleDoneClick} className="done-button">Done</button>
        </div>
      )}
      <button onClick={onBackClick} className="back-button">Back</button>
    </div>
  );
};

export default CommentPageForTourist;
