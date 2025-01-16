import React, { useEffect, useState } from 'react';
import { fetchActivitiesDate } from '../Services/activityServices';
import { fetchMuseums } from '../Services/museumServices';
import { useNavigate } from 'react-router-dom';
const PreferenceChoose = () => {
    const [activities, setActivities] = useState([]);
    const [historicalPlaces, setHistoricalPlaces] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showResults, setShowResults] = useState(false);
    const [savedPre, setSavedPre] = useState([]); // State for selected preferences

    // State for activity categories
    const [family, setFamily] = useState([]);
    const [nightsOut, setNightsOut] = useState([]);
    const [historic, setHistoric] = useState([]);
    const [artsy, setArtsy] = useState([]);
    const [musical, setMusical] = useState([]);
    const [sports, setSports] = useState([]);
    const [beaches, setBeaches] = useState([]);
    const [nature, setNature] = useState([]);
    const [shopping, setShopping] = useState([]);
    const [budgetFriendly, setBudgetFriendly] = useState([]);
    const [luxury, setLuxury] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const getActivities = async () => {
            try {
                const currentDate = new Date();
                const upcomingActivities = await fetchActivitiesDate();
                const filteredActivities = upcomingActivities.data.filter(activity => {
                    const activityDate = new Date(activity.date);
                    return activityDate >= currentDate;
                });
                setActivities(filteredActivities);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        const getHistoricalPlaces = async () => {
            try {
                const museumResponse = await fetchMuseums();
                setHistoricalPlaces(museumResponse.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        getActivities();
        getHistoricalPlaces();
    }, []);

    useEffect(() => {
        const categorizeActivities = () => {
            const familyActivities = [];
            const nightsOutActivities = [];
            const historicActivities = [];
            const artsyActivities = [];
            const musicalActivities = [];
            const sportsActivities = [];
            const beachesActivities = [];
            const natureActivities = [];
            const shoppingActivities = [];
            const budgetFriendlyActivities = [];
            const luxuryActivities = [];

            activities.forEach(activity => {
                activity.tags.forEach(tag => {
                    switch (tag.name) {
                        case "family-friendly":
                            familyActivities.push(activity);
                            break;
                        case "nights-out":
                            nightsOutActivities.push(activity);
                            break;
                        case "historic":
                            historicActivities.push(activity);
                            break;
                        case "artsy-places":
                            artsyActivities.push(activity);
                            break;
                        case "musical-places":
                            musicalActivities.push(activity);
                            break;
                        case "sports":
                            sportsActivities.push(activity);
                            break;
                        case "beaches":
                            beachesActivities.push(activity);
                            break;
                        case "nature-sightseeing":
                            natureActivities.push(activity);
                            break;
                        case "shopping":
                            shoppingActivities.push(activity);
                            break;
                        case "budget-friendly":
                            budgetFriendlyActivities.push(activity);
                            break;
                        case "luxury":
                            luxuryActivities.push(activity);
                            break;
                        default:
                            break;
                    }
                });
            });

            // Set categorized activities
            setFamily(familyActivities);
            setNightsOut(nightsOutActivities);
            setHistoric(historicActivities);
            setArtsy(artsyActivities);
            setMusical(musicalActivities);
            setSports(sportsActivities);
            setBeaches(beachesActivities);
            setNature(natureActivities);
            setShopping(shoppingActivities);
            setBudgetFriendly(budgetFriendlyActivities);
            setLuxury(luxuryActivities);

            // Include historical places in the historic category
            setHistoric(prev => [...prev, ...historicalPlaces]);

            // Include historical places in the artsy category if they are classified as museums
            historicalPlaces.forEach(place => {
                if (place.museum) { // Assuming the `museum` field indicates it's an artsy place
                    artsyActivities.push(place);
                }
            });

            // Set the artsy state with updated artsyActivities
            setArtsy(prev => [...prev, ...artsyActivities]); // Merge with existing artsy activities if any
        };

        if (activities.length > 0 || historicalPlaces.length > 0) {
            categorizeActivities();
        }
    }, [activities, historicalPlaces]);

    const toggleMappings = () => {
        setShowResults(prevState => !prevState);
    };

    const buttonText = showResults ? "Hide Results" : "Show Results";

    const handleCheckboxChange = (event) => {
        const { value, checked } = event.target;

        if (checked) {
            setSavedPre(prev => [...prev, value]);
        } else {
            setSavedPre(prev => prev.filter(item => item !== value));
        }
    };


    const filterResult2 = (value) => {
        const results = {};
    
        switch (value) {
            case "historic":
                results.filteredHistoricalPlaces = historic; // Historical places array
                results.filteredActivities = historic; // Assuming historic activities are in the historic array
                break;
            case "artsy-places":
                // results.filteredArtsyPlaces = artsy; // Artsy activities
                results.filteredActivities = artsy; // Assuming artsy activities are also in artsy array
                break;
            case "family-friendly":
                results.filteredActivities = family; // Family activities
                break;
            case "nights-out":
                results.filteredActivities = nightsOut; // Nights out activities
                break;
            case "musical-places":
                results.filteredActivities = musical; // Musical activities
                break;
            case "sports":
                results.filteredActivities = sports; // Sports activities
                break;
            case "beaches":
                results.filteredActivities = beaches; // Beach activities
                break;
            case "nature-sightseeing":
                results.filteredActivities = nature; // Nature activities
                break;
            case "shopping":
                results.filteredActivities = shopping; // Shopping activities
                break;
            case "budget-friendly":
                results.filteredActivities = budgetFriendly; // Budget-friendly activities
                break;
            case "luxury":
                results.filteredActivities = luxury; // Luxury activities
                break;
            default:
                break;
        }
    
        return results;
    };
    

    const ResultPer = () => {
        return (
            <div>
                {savedPre.length > 0 ? (
                    <div>
                        <h4>We suggest you look into those based on your preference:</h4>
                        <ul>
                            {savedPre.map((preference, index) => {
                                const results = filterResult2(preference); // Get filtered results based on preference
                                return (
                                    <li key={index}>
                                        <strong><em>{preference.replace(/-/g, " ")}</em></strong>
                                        <ul>
                                            {results.filteredActivities && results.filteredActivities.length > 0 ? (
                                                results.filteredActivities.map((activity, idx) => (
                                                    <li key={`${index}-${idx}`}>
                                                        <p><strong>Name:</strong> {activity.name}</p>
                                                        <p><strong>Price:</strong> {activity.price}</p>
                                                        <p><strong>Ratings:</strong> {activity.ratings || 'N/A'}</p>
                                                    </li>
                                                ))
                                            ) : (
                                                <li>No activities match this preference.</li>
                                            )}
                                        </ul>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                ) : (
                    <p>No preferences selected yet.</p>
                )}
            </div>
        );
    };
    
    
    return (
        <div className="container">
            <h2>Please Choose Your Preferences So We Could Help Plan The Perfect Vacation</h2>
            <label>Are you interested in:</label><br />
            <label><input type="checkbox" value="family-friendly" onChange={handleCheckboxChange} /> <strong><em>Family-Friendly</em></strong></label><br />
            <label><input type="checkbox" value="nights-out" onChange={handleCheckboxChange} /> <strong><em>Nights Out</em></strong></label><br />
            <label><input type="checkbox" value="historic" onChange={handleCheckboxChange} /> <strong><em>Historical Related Places</em></strong></label><br />
            <label><input type="checkbox" value="artsy-places" onChange={handleCheckboxChange} /> <strong><em>Artsy Places</em></strong></label><br />
            <label><input type="checkbox" value="musical-places" onChange={handleCheckboxChange} /> <strong><em>Musical Places</em></strong></label><br />
            <label><input type="checkbox" value="sports" onChange={handleCheckboxChange} /> <strong><em>Sports</em></strong></label><br />
            <label><input type="checkbox" value="beaches" onChange={handleCheckboxChange} /> <strong><em>Water/Aqua Related Places</em></strong></label><br />
            <label><input type="checkbox" value="nature-sightseeing" onChange={handleCheckboxChange} /> <strong><em>Nature/Sightseeing</em></strong></label><br />
            <label><input type="checkbox" value="shopping" onChange={handleCheckboxChange} /> <strong><em>Shopping</em></strong></label><br />
            <label><input type="checkbox" value="budget-friendly" onChange={handleCheckboxChange} /> <strong><em>Budget Friendly </em></strong></label><br />
            <label><input type="checkbox" value="luxury" onChange={handleCheckboxChange} /> <strong><em>Luxury </em></strong></label><br />

            <button id="show" onClick={toggleMappings}>{buttonText}</button>

            {/* Display saved preferences and results */}
            {showResults && <ResultPer />}
              {/* Back button to navigate to the previous page */}
               <button onClick={() => navigate('/tourist')}>Back to Home</button> 

{/* Display saved preferences and results */}
{/* {showResults && <ResultPer />} */}
        </div>
    );
};

export default PreferenceChoose;
