import React, { useEffect, useState } from 'react';
import {
    deletAdvertiser, 
    deleteTourGuide, 
    deleteSeller,
    fetchAdvertisers,
    fetchSellers,
    fetchTourGuides,
    fetchTourists
} from '../RequestSendingMethods';
import { deleteTourist } from '../Services/TouristService';
import { fetchActivities } from '../Services/activityServices';
import { fetchItineraries } from '../Services/itineraryServices';
import { fetchProductsNoID } from '../Services/productServices'; // Assuming this service is for fetching products

const Deletion = () => {
    const [entities, setEntities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch all entities (Advertisers, Tourists, Tour Guides, Sellers) with delete flag set to true
    const fetchEntitiesToDelete = async () => {
        try {
            setLoading(true);

            const advertisersResponse = await fetchAdvertisers();
            const advertisersToDelete = advertisersResponse.data.filter(ad => ad.delete === true);

            const touristsResponse = await fetchTourists();
            const touristsToDelete = touristsResponse.data.filter(tourist => tourist.delete === true);

            const tourGuidesResponse = await fetchTourGuides();
            const tourGuidesToDelete = tourGuidesResponse.data.filter(guide => guide.delete === true);

            const sellersResponse = await fetchSellers();
            const sellersToDelete = sellersResponse.data.filter(seller => seller.delete === true);

            const allEntities = [
                ...advertisersToDelete.map(ad => ({ ...ad, role: 'Advertiser' })),
                ...touristsToDelete.map(tourist => ({ ...tourist, role: 'Tourist' })),
                ...tourGuidesToDelete.map(guide => ({ ...guide, role: 'Tour Guide' })),
                ...sellersToDelete.map(seller => ({ ...seller, role: 'Seller' })),
            ];

            setEntities(allEntities);
        } catch (err) {
            console.error("Error fetching entities:", err);
            setError("Failed to fetch entities.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEntitiesToDelete();
    }, []);

    // Helper function to determine if an entity has bookings and count them
    const getBookingCount = async (entity) => {
        let itineraryCount = 0;
        let activityCount = 0;
        let productCount = 0;

        if (entity.role === 'Tourist') {
            itineraryCount = entity.bookedItineraries?.length || 0;
            activityCount = entity.bookedActivities?.length || 0;
        } else if (entity.role === 'Advertiser') {
            const activities = await fetchActivities(entity._id);
            activityCount = activities.length;
        } else if (entity.role === 'Tour Guide') {
            const itineraries = await fetchItineraries(entity._id);
            itineraryCount = itineraries.length;
        } else if (entity.role === 'Seller') {
            const products = await fetchProductsNoID();
            // Filter products by sellerId
            const sellerProducts = products.data.filter(product => product.sellerId === entity._id);
            productCount = sellerProducts.length;
        }

        return { itineraryCount, activityCount, productCount };
    };

    // Store the counts for each entity
    const [counts, setCounts] = useState({});

    // Fetch counts for each entity and update state
    const fetchCounts = async () => {
        let updatedCounts = {};

        for (let entity of entities) {
            const { itineraryCount, activityCount, productCount } = await getBookingCount(entity);
            updatedCounts[entity._id] = { itineraryCount, activityCount, productCount };
        }

        setCounts(updatedCounts);
    };

    // Call fetchCounts after entities have been fetched
    useEffect(() => {
        if (entities.length > 0) {
            fetchCounts();
        }
    }, [entities]);

    // Handle delete action (both frontend and backend)
    const handleDelete = async (entity) => {
        try {
            const { itineraryCount, activityCount, productCount } = counts[entity._id] || {};

            // Check if there are bookings or products to prevent deletion
            if (entity.role === 'Tourist' && (itineraryCount > 0 || activityCount > 0)) {
                alert(`Cannot delete Tourist with ${itineraryCount} itineraries and ${activityCount} activities.`);
                return;
            } else if (entity.role === 'Advertiser' && activityCount > 0) {
                alert(`Cannot delete Advertiser with ${activityCount} active activities.`);
                return;
            } else if (entity.role === 'Tour Guide' && itineraryCount > 0) {
                alert(`Cannot delete Tour Guide with ${itineraryCount} active itineraries.`);
                return;
            } else if (entity.role === 'Seller' && productCount > 0) {
                alert(`Cannot delete Seller with ${productCount} products.`);
                return;
            }

            // Delete from backend based on role
            if (entity.role === 'Advertiser') {
                await deletAdvertiser(entity._id);
            } else if (entity.role === 'Tour Guide') {
                await deleteTourGuide(entity._id);
            } else if (entity.role === 'Tourist') {
                await deleteTourist(entity._id);
            } else if (entity.role === 'Seller') {
                await deleteSeller(entity._id);
            }

            // Remove from frontend list
            setEntities(prevEntities => prevEntities.filter(e => e._id !== entity._id));
            alert(`${entity.role} deleted successfully.`);
        } catch (err) {
            console.error(`Error deleting ${entity.role}:`, err);
            setError(`Failed to delete ${entity.role}.`);
        }
    };

    // Handle ignore action (frontend only)
    const handleIgnore = (entityId) => {
        setEntities(prevEntities => prevEntities.filter(entity => entity._id !== entityId));
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return (
        <div>
            <h2>Entities Marked for Deletion</h2>
            {entities.length === 0 ? (
                <p>No entities marked for deletion.</p>
            ) : (
                entities.map(entity => {
                    const { itineraryCount, activityCount, productCount } = counts[entity._id] || {};

                    return (
                        <div key={entity._id} style={{ borderBottom: '1px solid #ccc', padding: '10px 0' }}>
                            <p>Role: {entity.role}</p>
                            <p>Email: {entity.email}</p>
                            <p>Name: {entity.name}</p>

                            {/* Show counts based on role */}
                            {entity.role === 'Tourist' && (
                                <p>Bookings: {itineraryCount + activityCount || 0}</p>
                            )}
                            {entity.role === 'Advertiser' && (
                                <p>Activities Count: {activityCount || 0}</p>
                            )}
                            {entity.role === 'Tour Guide' && (
                                <p>Itinerary Count: {itineraryCount || 0}</p>
                            )}
                            {entity.role === 'Seller' && (
                                <p>Product Count: {productCount || 0}</p>
                            )}

                            <button onClick={() => handleDelete(entity)} style={{ marginRight: '10px' }}>
                                Delete
                            </button>
                            <button onClick={() => handleIgnore(entity._id)}>Ignore</button>
                        </div>
                    );
                })
            )}
        </div>
    );
};

export default Deletion;
