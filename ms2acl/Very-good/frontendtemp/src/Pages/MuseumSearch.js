// TouristPage.js
import React, { useState } from 'react';
import { searchactivity } from '../Services/activityServices'; // Adjust the import path as needed
import {searchforHP} from '../Services/museumServices';
import { searchforitinerary } from '../Services/itineraryServices';
import {searchbyname} from '../Services/productServices';
import {getavailableProducts} from '../Services/productServices';
import ItineraryDisplay2 from '../Components/ItineraryDisplay2';
import ActivityDisplayFilterWise from '../Components/ActivityDisplayFilterWise';
import ItineraryDisplayFilterWise from '../Components/ItineraryDisplayFilterWise';


const MuseumSearch = () => {
    const [activitySearchTerm, setActivitySearchTerm] = useState('');
    const [museumSearchTerm, setMuseumSearchTerm] = useState('');
    const [itinerarySearchTerm, setItinerarySearchTerm] = useState('');
    const [productSearchTerm, setProductSearchTerm] = useState('');
    const [loadingItinerary, setLoadingItinerary] = useState(false);
    const [itineraryError, setItineraryError] = useState(null);
    const [loadingActivities, setLoadingActivities] = useState(false);
    const [loadingMuseums, setLoadingMuseums] = useState(false);
    const [loadingProducts, setLoadingProducts] = useState(false);
    const [loadingAvailableProducts, setLoadingAvailableProducts] = useState(false);
    const [activityError, setActivityError] = useState(null);
    const [museumError, setMuseumError] = useState(null);
    const [productError, setProductError] = useState(null);
    const [availableproductError, setAvailableProductError] = useState(null)
    const [activities, setActivities] = useState([]);
    const [museums, setMuseums] = useState([]);
    const [itineraries, setItineraries] = useState([]);
    const [products, setProducts] = useState([]);
    const [Availableproducts, setAvailableProducts] = useState([]);
    const [showProducts, setShowProducts] = useState(false); // State to control the visibility of products


    // Handle activity search
    const handleSearchActivitybyname = async () => {
        setLoadingActivities(true);
        setActivityError(null);
        try {
            const activityResults = await searchactivity({name : activitySearchTerm} ); // Search for activities
            setActivities(activityResults);
        } catch (err) {
            setActivityError('Failed to fetch activities');
        } finally {
            setLoadingActivities(false);
        }
    };
    const handleSearchActivitybycat = async () => {
        setLoadingActivities(true);
        setActivityError(null);
        try {
            const activityResults = await searchactivity({category : activitySearchTerm} ); // Search for activities
            setActivities(activityResults);
        } catch (err) {
            setActivityError('Failed to fetch activities');
        } finally {
            setLoadingActivities(false);
        }
    };
    const handleSearchActivitybytag = async () => {
        setLoadingActivities(true);
        setActivityError(null);
        try {
            const activityResults = await searchactivity({tag : activitySearchTerm} ); // Search for activities
            setActivities(activityResults);
        } catch (err) {
            setActivityError('Failed to fetch activities');
        } finally {
            setLoadingActivities(false);
        }
    };

    // Handle museum search
    const handleSearchMuseumbyname = async () => {
        setLoadingMuseums(true);
        setMuseumError(null);
        try {
            const museumResults = await searchforHP({ name: museumSearchTerm }); // Pass name as query
            setMuseums(museumResults);
        } catch (err) {
            setMuseumError('Failed to fetch museums by name');
        } finally {
            setLoadingMuseums(false);
        }
    };
    
    const handleSearchMuseumbytag = async () => {
        setLoadingMuseums(true);
        setMuseumError(null);
        try {
            const museumResults = await searchforHP({ tag: museumSearchTerm }); // Pass tag as query
            setMuseums(museumResults);
        } catch (err) {
            setMuseumError('Failed to fetch museums by tag');
        } finally {
            setLoadingMuseums(false);
        }
    };
    
    const handleSearchItinerarybytitle = async () => {
        setLoadingItinerary(true);
        setItineraryError(null);
        try {
            const Results = await searchforitinerary({title : itinerarySearchTerm} ); // Search for activities
            setItineraries(Results);
        } catch (err) {
            setItineraryError('Failed to fetch itineraries');
        } finally {
            setLoadingItinerary(false);
        }
    };

    const handleSearchProductbyname = async () => {
        setLoadingProducts(true);
        setProductError(null);
        try {
            const productsResults = await searchbyname({name : productSearchTerm} ); // Search for activities
            setProducts(productsResults);
        } catch (err) {
            setProductError('Failed to fetch activities');
        } finally {
            setLoadingProducts(false);
        }
    };

    const fetchProducts = async () => {
        setLoadingAvailableProducts(true); // Set loading state correctly
        setAvailableProductError(null); // Reset the error state
        try {
            const products = await getavailableProducts(); // Fetch the available products
            setAvailableProducts(products); // Update the state with the fetched products
        } catch (error) {
            setAvailableProductError(error.message); // Handle errors
        } finally {
            setLoadingAvailableProducts(false); // Reset loading state
        }
    };
    
    // Handle button click to show available products
    const handleShowProducts = () => {
        fetchProducts();
        setShowProducts(true); // Show products when button is clicked
    };


    return (
        <div>
            <h1>Welcome, Tourist!</h1>

            {/* Search box for activities */}
        <div>
            <h2>Search Activities</h2>
            <input
                type="text"
                value={activitySearchTerm}
                onChange={(e) => setActivitySearchTerm(e.target.value)}
                placeholder="Search activities by name, category or tag"
            />
            <button onClick={handleSearchActivitybyname}>Search Activities by name</button>
            <button onClick={handleSearchActivitybytag}>Search Activities by tag</button>
            <button onClick={handleSearchActivitybycat}>Search Activities by category</button>
            {loadingActivities && <p>Loading activities...</p>}
            {activityError && <p>{activityError}</p>}
            <div>
                {activities.length > 0 ? (
                    activities.map((activity) => (
                        <ActivityDisplayFilterWise activity={activity}/>
                    ))
                ) : (
                    !loadingActivities && <p>No activities found.</p>
                )}
            </div>
        </div>

        {/* Search box for museums/historical places */}
        <div>
            <h2>Search Museums or Historical Places</h2>
            <input
                type="text"
                value={museumSearchTerm}
                onChange={(e) => setMuseumSearchTerm(e.target.value)}
                placeholder="Search museums or historical places by name or tag"
            />
            <button onClick={handleSearchMuseumbyname}>Search Museums or Historical Places by name</button>
            <button onClick={handleSearchMuseumbytag}>Search Museums or Historical Places by tag</button>
            {loadingMuseums && <p>Loading museums or historical places...</p>}
            {museumError && <p>{museumError}</p>}
            <div>
                {museums.length > 0 ? (
                    museums.map((museum) => (
                        <div key={museum._id} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
                            <h3>{museum.name}</h3>
                            {museum.description && <p><strong>Description:</strong> {museum.description}</p>}
                            {museum.pictures && museum.pictures.length > 0 && (
                                <div>
                                    <strong>Pictures:</strong>
                                    <ul>
                                        {museum.pictures.map((picture, index) => (
                                            <li key={index}>
                                                <img src={picture} alt={`Picture of ${museum.name}`} style={{ width: '100px' }} />
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            <p><strong>Location:</strong> {museum.location.city}, {museum.location.country}</p>
                            {museum.location.address && <p><strong>Address:</strong> {museum.location.address}</p>}
                            <div>
                                <strong>Opening Hours:</strong>
                                <ul>
                                    <li>Monday: {museum.openingHours.monday}</li>
                                    <li>Tuesday: {museum.openingHours.tuesday}</li>
                                    <li>Wednesday: {museum.openingHours.wednesday}</li>
                                    <li>Thursday: {museum.openingHours.thursday}</li>
                                    <li>Friday: {museum.openingHours.friday}</li>
                                    <li>Saturday: {museum.openingHours.saturday}</li>
                                    <li>Sunday: {museum.openingHours.sunday}</li>
                                </ul>
                            </div>
                            <div>
                                <strong>Ticket Prices:</strong>
                                <ul>
                                    <li>Foreigner: ${museum.ticketPrices.foreigner}</li>
                                    <li>Native: ${museum.ticketPrices.native}</li>
                                    <li>Student: ${museum.ticketPrices.student}</li>
                                </ul>
                            </div>
                            <p><strong>Museum:</strong> {museum.museum ? 'Yes' : 'No'}</p>
                            {museum.tourismGovernerId && <p><strong>Tourism Governer:</strong> {museum.tourismGovernerId.name}</p>}
                            <p><strong>Tags:</strong> {museum.tags.length > 0 ? museum.tags.map(tag => tag.name).join(', ') : 'No tags available'}</p>
                        </div>
                    ))
                ) : (
                    !loadingMuseums && <p>No museums or historical places found.</p>
                )}
            </div>
        </div>
        <div>
            {/* Search box for Itineraries */}
            <h2>Search Itineraries</h2>
            <input
                type="text"
                value={itinerarySearchTerm}
                onChange={(e) => setItinerarySearchTerm(e.target.value)}
                placeholder="Search itineraries by title"
            />
            <button onClick={handleSearchItinerarybytitle}>Search Itinerary by Title</button>

            {loadingItinerary && <p>Loading itineraries...</p>}
            {itineraryError && <p>{itineraryError}</p>}
            
            <div>
                {itineraries.length > 0 ? (
                    itineraries.map((itinerary) => (
                        <div key={itinerary._id} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
                            <h3>{itinerary.title}</h3>
                            <ItineraryDisplayFilterWise itinerary={itinerary}/>
                        </div>
                    ))
                ) : (
                    !loadingItinerary && <p>No itineraries found.</p>
                )}
            </div>
        </div>
            {/* Search box for products */}
            <div>
            <h2>Search products</h2>
            <input
                type="text"
                value={productSearchTerm}
                onChange={(e) => setProductSearchTerm(e.target.value)}
                placeholder="Search products by name"
            />
            <button onClick={handleSearchProductbyname}>Search Products by name</button>
            {loadingProducts && <p>Loading Products...</p>}
            {productError && <p>{productError}</p>}
            <div>
            {products.length > 0 ? (
        products.map((product) => (
            <div key={product._id} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
                <h3>{product.name}</h3>
                <p><strong>Price:</strong> ${product.price}</p>
                {product.description && <p><strong>Description:</strong> {product.description}</p>}
                <p><strong>Stock:</strong> {product.stock} units</p>
                <p><strong>Rating:</strong> {product.rating}/5</p>
                {product.sellerId && <p><strong>Seller:</strong> {product.sellerId.name}</p>} {/* Ensure sellerId has a 'name' field in your data */}
                {product.pictures && product.pictures.length > 0 && (
                    <div>
                        <strong>Pictures:</strong>
                        <ul>
                            {product.pictures.map((picture, index) => (
                                <li key={index}>
                                    <img src={picture} alt={`Picture of ${product.name}`} style={{ width: '100px' }} />
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        ))
    ) : (
        !loadingProducts && <p>No products found.</p>
    )}
            </div>
        </div>
        <div>
    <h2>Available Products</h2>
    <button onClick={handleShowProducts}>Show Available Products</button>
    {loadingAvailableProducts && <p>Loading available products...</p>}
    {availableproductError && <p>{availableproductError}</p>}
    <div>
        {Availableproducts.length > 0 ? ( // Use Availableproducts instead of products
            Availableproducts.map((product) => ( // Map over the correct state variable
                <div key={product._id} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
                    <h3>{product.name}</h3>
                    <p><strong>Price:</strong> ${product.price}</p>
                    <p><strong>Description:</strong> {product.description}</p>
                    <p><strong>Stock:</strong> {product.stock} available</p>
                    <p><strong>Rating:</strong> {product.rating}/5</p>
                    {product.sellerId && <p><strong>Seller:</strong> {product.sellerId.name}</p>}
                    {product.pictures && product.pictures.length > 0 && (
                        <div>
                            <strong>Pictures:</strong>
                            <ul>
                                {product.pictures.map((picture, index) => (
                                    <li key={index}>
                                        <img src={picture} alt={`Picture of ${product.name}`} style={{ width: '100px' }} />
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            ))
        ) : (
            !loadingAvailableProducts && <p>No products available.</p>
        )}
                </div>
            </div>
        </div>
);
};

export default MuseumSearch;