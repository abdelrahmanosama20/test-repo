import React, { useState, useEffect } from 'react';
import { fetchPastbookedbytouristItineraries, fetchPastbookedbytouristItinerariesItneraryComment, fetchPurchasedProducts, rateTourGuide, rateItinerary, rateProduct, fetchPastActivities ,rateactivity} from '../RequestSendingMethods';
import {addReviewToProduct} from '../Services/commentServices'
import '../styles/global.css';

const RatePageForTourist = ({ onBackClick, email, touristId }) => {
    const [tourGuides, setTourGuides] = useState([]);
    const [itineraries, setItineraries] = useState([]);
    const [activities, setActivities] = useState([]);
    const [products, setProducts] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [ratetype, setratetype] = useState(null);
    const [comment, setComment] = useState('');
    const [rate, setrate] = useState(0);

    useEffect(() => {
        if (ratetype === 'tourGuide') {
            loadTourGuides();
        } else if (ratetype === 'itinerary') {
            loaditinerariesWithTourGuideName();
        } else if (ratetype === 'product') {
            loadPurchasedProducts();
        } else if (ratetype === 'activity') {
            loadActivities();
        }
    }, [ratetype]);

    const handleCommentChange = (e) => setComment(e.target.value);

    const handleReviewClick = async () => {
        console.log("s:",selectedItem._id)
        console.log("t:",touristId)
        console.log("c:",comment)

          try {
            await addReviewToProduct(selectedItem._id, touristId, comment);
          } catch (error) {
            console.error('Error adding review:', error);
          }
        };
    

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

    const loaditinerariesWithTourGuideName = async () => {
        try {
            const response = await fetchPastbookedbytouristItinerariesItneraryComment(email);
            if (response && Array.isArray(response.data)) {
                setItineraries(response.data);
            }
        } catch (error) {
            console.error('Error fetching itineraries:', error);
        }
    };

    const loadPurchasedProducts = async () => {
        try {
            const response = await fetchPurchasedProducts(email);  // Fetch purchased products
            if (response && Array.isArray(response.data)) {
                setProducts(response.data);
            }
        } catch (error) {
            console.error('Error fetching purchased products:', error);
        }
    };

    const loadActivities = async () => {
        try {
            const response = await fetchPastActivities(email); 
            console.log("Response from fetchPastActivities:", response);
            
            // Check if pastActivities exists in the response and is an array
            if (response && Array.isArray(response.pastActivities)) {
                setActivities(response.pastActivities);  // Set the activities state
                console.log("Activities set:", response.pastActivities);  // Log the data
            } else {
                console.log("No past activities found or incorrect response format");
            }
        } catch (error) {
            console.error('Error fetching purchased activities:', error);
        }
    };
    

    const handleTourGuideSelection = () => setratetype('tourGuide');
    const handleProductSelection = () => setratetype('product');
    const handleItinerarySelection = () => setratetype('itinerary');
    const handleActivitySelection = () => setratetype('activity');

    const handleItemClick = (item) => {
        console.log("Item selected:", item);
        setSelectedItem(item);
    };

    const handleStarClick = (star) => {
        setrate(star);
    };

    const handleDoneClick = async () => {
        try {
            if (ratetype === 'tourGuide') {
                await rateTourGuide(selectedItem.email, rate);
                console.log(`Tour guide ${selectedItem.email} rated with ${rate} stars.`);
            } else if (ratetype === 'itinerary') {
                await rateItinerary(selectedItem.id, rate);
                console.log(`Itinerary ${selectedItem.itineraryTitle} rated with ${rate} stars.`);
            } else if (ratetype === 'product' && selectedItem._id) {
                await rateProduct(selectedItem._id, rate);
                console.log(`Product ${selectedItem.name} rated with ${rate} stars.`);
            } else if (ratetype === 'activity') {
                console.log(selectedItem.name);
                // Implement activity rating logic here if needed
                await rateactivity(selectedItem.name,rate);
            }

            setrate(0);
            setSelectedItem(null);
            setratetype(null);
        } catch (error) {
            console.error('Error submitting rating:', error);
        }
    };

    return (
        <div className="container">
            {!ratetype ? (
                <div>
                    <p>What would you like to rate?</p>
                    <button onClick={handleTourGuideSelection} className="button">
                        Tour Guide
                    </button>
                    <button onClick={handleProductSelection} className="button">
                        Product
                    </button>
                    <button onClick={handleItinerarySelection} className="button">
                        Itinerary
                    </button>
                    <button onClick={handleActivitySelection} className="button">
                        Activity
                    </button>
                </div>
            ) : ratetype === 'tourGuide' && !selectedItem ? (
                <div>
                    <h3>Select a Tour Guide to Rate</h3>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Email</th>
                                <th>Rating</th>
                                <th>Select</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tourGuides.map((guide, index) => (
                                <tr key={index}>
                                    <td>{guide.email}</td>
                                    <td>{guide.rating}</td>
                                    <td>
                                        <button onClick={() => handleItemClick(guide)}>Select</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : ratetype === 'itinerary' && !selectedItem ? (
                <div>
                    <h3>Select an Itinerary to Rate</h3>
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
            ) : ratetype === 'product' && !selectedItem ? (
                <div>
                    <h3>Select a Product to Rate</h3>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Product Title</th>
                                <th>Price</th>
                                <th>Select</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product, index) => (
                                <tr key={index}>
                                    <td>{product.name}</td>
                                    <td>${product.price}</td>
                                    <td>
                                        <button onClick={() => handleItemClick(product)}>Select</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                </div>
            ) : ratetype === 'activity' && !selectedItem ? (
                <div>
                    <h3>Select an Activity to Rate</h3>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Activity Title</th>
                                <th>Rating</th>
                                <th>Select</th>
                            </tr>
                        </thead>
                        <tbody>
                {activities.length > 0 ? (
                    activities.map((activity, index) => (
                        <tr key={index}>
                            <td>{activity.name}</td>
                            <td>{activity.ratings}</td>
                            <td><button onClick={() => handleItemClick(activity)}>Select</button></td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="3">No activities found</td>
                    </tr>
                )}
            </tbody>
                    </table>
                </div>
            ) : (
                <div>
                    <h3>Rate {selectedItem.title ? selectedItem.title : selectedItem.email}</h3>
                    <div className="star-rating">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <span
                                key={star}
                                className={`star ${star <= rate ? 'filled' : ''}`}
                                onClick={() => handleStarClick(star)}
                            >
                                ★
                            </span>
                        ))}
                    </div>
                    <button onClick={handleDoneClick} className="done-button">Done</button>
                    <div>
          <h3>Leave a Review</h3>
          <textarea
            value={comment}
            onChange={handleCommentChange}
            placeholder="Write your Review here..."
            className="comment-textarea"
          />
          <button onClick={handleReviewClick} className="done-button">Done</button>
        </div>
                </div>

            )}
            <button onClick={onBackClick} className="back-button">Back</button>
        </div>
    );
};

export default RatePageForTourist;
