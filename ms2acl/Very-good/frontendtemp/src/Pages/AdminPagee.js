import React, { useState } from 'react';
import '../styles/global.css'; // Ensure to have your CSS file
import { fetchAllTags, updateTag, deleteTag, addAdmin, addTourismGoverner,fetchAllItineraries } from '../RequestSendingMethods'; // Import the addAdmin and addTourismGoverner methods
import AdminDelete from './AdminDelete'; // Import the new AdminDelete component
import AdminCategory from './AdminCategory';
import Search from './Search'
import FilterProductByPrice from './FilterProductByPrice'
import AdminCreateTag from './AdminCreateTag'
import { Link } from 'react-router-dom';



const AdminPage = () => {
    const [adminActivities, setAdminActivities] = useState([
        { id: 1, title: 'Add Admins' },
        { id: 2, title: 'View Tags' },
        { id: 3, title: 'Add Tourism Governor' }, // New activity for adding tourism governor
        { id: 4, title: 'Delete Admin' }, // New activity for deleting admin
        {id :5 ,title : 'FilterProductsByPrice' },
        {id :6,title :'Create_Tag'},
        { id: 7, title: 'View Itineraries' },


    ]);


    const [tags, setTags] = useState([]); // State to hold the tags
    const [editingTag, setEditingTag] = useState(null); // State for the tag currently being edited
    const [formData, setFormData] = useState({ name: '' }); // State for form data
    const [isAddingAdmin, setIsAddingAdmin] = useState(false); // State to manage visibility of the add admin form
    const [isAddingGovernor, setIsAddingGovernor] = useState(false); // State to manage visibility of the add tourism governor form
    const [adminData, setAdminData] = useState({ username: '', password: '', email: '' }); // State for admin form data including email
    const [governorData, setGovernorData] = useState({ username: '', email: '', password: '', mobile: '', nationality: '', dob: '' }); // State for governor form data
    const [showAdminDelete, setShowAdminDelete] = useState(false); // State to manage visibility of AdminDelete page
    const [showSearchPage,setShowSearchPage]=useState(false);
    const [showProductFilterPage,setShowProductFilterPage]=useState(false);
    const [showCreateTagPage,setshowCreateTagPage]=useState(false);
    const [itineraries, setItineraries] = useState([]);

    // Action listeners
    const handleCreateTag=()=>{
        setshowCreateTagPage(true);
    }
    if(showCreateTagPage){
       return <AdminCreateTag/>
    }
    const handleAddAdmins = () => {
        setIsAddingAdmin(true); // Show the add admin form
    };
    const handleFilterProductByPrice =() =>{
        setShowProductFilterPage(true);
    }
    if(showProductFilterPage){
        return <FilterProductByPrice />
    }

    const handleViewTags = async () => {
        const fetchedTags = await fetchAllTags();
        if (fetchedTags) {
            console.log('Retrieved tags:', fetchedTags);
    
            // Filter tags to keep only those with category 'preference'
            const filteredTags = fetchedTags.filter(tag => tag.category === 'preference');
    
            // Update the state with the filtered tags
            setTags(filteredTags);
        } else {
            console.error('Failed to retrieve tags.');
        }
    };
    

    const handleAddGovernor = () => {
        setIsAddingGovernor(true); // Show the add tourism governor form
    };


    
    

    const handleEditTag = (tag) => {
        // Set the editing tag and populate form data
        setEditingTag(tag._id);
        setFormData({ name: tag.name }); // Populate form data with tag name
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value }); // Update form data state
    };

    const handleAdminFormChange = (e) => {
        const { name, value } = e.target;
        setAdminData({ ...adminData, [name]: value }); // Update admin form data state
    };

    const handleGovernorFormChange = (e) => {
        const { name, value } = e.target;
        setGovernorData({ ...governorData, [name]: value }); // Update governor form data state
    };

    const handleAdminFormSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission
        try {
            const result = await addAdmin(adminData); // Call the addAdmin method
            console.log('Admin Data Submitted:', result); // Log the result of the request
            
            // Optionally, handle successful admin creation here
            alert(result.message || 'Admin created successfully!');

            // Reset form and close it after submission
            setAdminData({ username: '', password: '', email: '' }); // Reset email field
            setIsAddingAdmin(false); // Hide the form
        } catch (error) {
            console.error('Failed to add admin:', error.response ? error.response.data : error.message);
            alert('Error creating admin: ' + (error.response.data.message || 'An error occurred.')); // Notify the user
        }
    };

    const handleGovernorFormSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission
        try {
            const result = await addTourismGoverner(governorData); // Call the addTourismGoverner method
            console.log('Tourism Governor Data Submitted:', result); // Log the result of the request
            
            // Optionally, handle successful governor creation here
            alert(result.message || 'Tourism Governor created successfully!');

            // Reset form and close it after submission
            setGovernorData({ username: '', email: '', password: '', mobile: '', nationality: '', dob: '' }); // Reset governor data fields
            setIsAddingGovernor(false); // Hide the form
        } catch (error) {
            console.error('Failed to add tourism governor:', error.response ? error.response.data : error.message);
            alert('Error creating tourism governor: ' + (error.response.data.message || 'An error occurred.')); // Notify the user
        }
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission
        const result = await updateTag(editingTag, formData);
        if (result) {
            setTags(tags.map(tag => (tag._id === editingTag ? { ...tag, name: formData.name } : tag))); // Update the tag in the state
            setEditingTag(null); // Clear editing state
            setFormData({ name: '' }); // Clear form data
        } else {
            console.error('Failed to update tag.'); // Handle failure case
        }
    };

    const handleDeleteTag = async (tagId) => {
        const confirmed = window.confirm('Are you sure you want to delete this tag?');
        if (confirmed) {
            const result = await deleteTag(tagId);
            if (result) {
                setTags(tags.filter(tag => tag._id !== tagId)); // Remove the deleted tag from the state
            } else {
                console.error('Failed to delete tag.');
            }
        }
    };

    const handleNewButtonClick = () => {
        // Action listener for the new button
        // Add your functionality here
        // e.g., console.log('New Button Clicked');
        setShowSearchPage(true);
    };
    const handleViewItineraries = async () => {
        const fetchedItineraries = await fetchAllItineraries();
        if (fetchedItineraries) {
            setItineraries(fetchedItineraries); // Update state
            console.log('Retrieved itineraries:', fetchedItineraries);
        } else {
            console.error('Failed to retrieve itineraries.');
        }
    };
    const handleFlagItinerary = async (id, isFlagged) => {
        if (isFlagged) {
            console.log(`Itinerary ${id} is already flagged.`);
            return; // Prevent re-flagging if already flagged
        }
    
        try {
            const response = await fetch(`http://localhost:4000/api/itineraries/${id}/flag`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
    
            if (!response.ok) {
                throw new Error('Failed to flag itinerary');
            }
    
            const data = await response.json();
            console.log('Itinerary flagged:', data);
    
            // Update state to reflect that the itinerary is flagged
            setItineraries(prevItineraries =>
                prevItineraries.map(itinerary =>
                    itinerary._id === id ? { ...itinerary, flagged: !itinerary.flagged } : itinerary // Toggle the flag status in the state
                )
            );
        } catch (error) {
            console.error('Error flagging itinerary:', error);
        }
    };

    
    
    

    return (
        <div>
       <AdminCategory />
        {showSearchPage ? ( // Conditional rendering for Search page
            <Search /> // Render the Search component
        ) : showAdminDelete ? ( // Conditional rendering for AdminDelete page
            <AdminDelete onBack={() => setShowAdminDelete(false)} /> // Pass back function to return to AdminPage
        ) : (
            <>
                    <h1>Admin Page</h1>
                    <p>Welcome to the Admin Page!</p>
                    {/* Add the View Complaints button here */}
                    <Link to="/complaints" className="button">
                        View Complaints
                    </Link>
                    <div className="admin-activity-cards">
                        {adminActivities.map(activity => (
                            <div key={activity.id} className="activity-card">
                                <h3>{activity.title}</h3>
                                {activity.title === 'Add Admins' && (
                                    <button className="view-button" onClick={handleAddAdmins}>Add Admins</button>
                                )}
                                {activity.title==='FilterProductsByPrice' &&(
                                    < button className="view-button" onClick ={handleFilterProductByPrice}>Filter Products</button>
                                    )}
                                    {
                                        activity.title==='Create_Tag'&&(
                                            <button className="view-button" onClick={handleCreateTag}>Create Tag</button>
                                        )
                                    }
                                {activity.title === 'View Tags' && (
                                    <button className="view-button" onClick={handleViewTags}>View Tags</button>
                                )}
                                {activity.title === 'Add Tourism Governor' && (
                                    <button className="view-button" onClick={handleAddGovernor}>Add Tourism Governor</button>
                                )}
                                {activity.title === 'Delete Admin' && (
                                    <>
                                        <button className="view-button" onClick={() => setShowAdminDelete(true)}>Delete Admin</button>
                                        {/* New button underneath Delete Admin */}
                                        <button className="view-button" onClick={handleNewButtonClick}>Search</button>
                                    </>
                                )}
                                {activity.title === 'View Itineraries' && (
                                        <button className="view-button" onClick={handleViewItineraries}>View Itineraries</button>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Display tags in enhanced cards */}
                    <div className="tags-container">
                        {tags.length > 0 ? (
                            tags.map(tag => (
                                <div key={tag._id} className="tag-card">
                                    <h4 className="tag-title">{tag.name}</h4>
                                    <div className="tag-actions">
                                        <button className="edit-button" onClick={() => handleEditTag(tag)}>Edit</button>
                                        <button className="delete-button" onClick={() => handleDeleteTag(tag._id)}>Delete</button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>No tags available.</p>
                        )}
                    </div>
                    // Inside your return statement in AdminPage component

                    <div className="itineraries-container">
    {itineraries.length > 0 ? (
        itineraries.map(itinerary => (
            <div key={itinerary._id} className="itinerary-card">
                <h4 className="itinerary-title">
                    {itinerary.title}
                    {itinerary.flagged && <span style={{ color: 'red', marginLeft: '5px' }}>Flagged</span>}
                </h4>
                <button 
    className="flag-button" 
    onClick={() => handleFlagItinerary(itinerary._id, itinerary.flagged)}>
    {itinerary.flagged ? 'Already Flagged' : 'Flag Itinerary'}
</button>

            </div>
        ))
    ) : (
        <p>No itineraries available.</p>
    )}
</div>



                    {/* Editing Form */}
                    {editingTag && (
                        <div className="edit-form">
                            <h3>Edit Tag</h3>
                            <form onSubmit={handleFormSubmit}>
                                <label>
                                    Name:
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleFormChange}
                                        required
                                    />
                                </label>
                                <button type="submit">Update Tag</button>
                                <button type="button" onClick={() => setEditingTag(null)}>Cancel</button>
                            </form>
                        </div>
                    )}

                    

                    {/* Add Admin Form */}
                    {isAddingAdmin && (
                        <div className="add-admin-form">
                            <h3>Add Admin</h3>
                            <form onSubmit={handleAdminFormSubmit}>
                                <label>
                                    Name:
                                    <input
                                        type="text"
                                        name="username"
                                        value={adminData.username}
                                        onChange={handleAdminFormChange}
                                        required
                                    />
                                </label>
                                <label>
                                    Email:
                                    <input
                                        type="email"
                                        name="email"
                                        value={adminData.email}
                                        onChange={handleAdminFormChange}
                                        required
                                    />
                                </label>
                                <label>
                                    Password:
                                    <input
                                        type="password"
                                        name="password"
                                        value={adminData.password}
                                        onChange={handleAdminFormChange}
                                        required
                                    />
                                </label>
                                <button type="submit">Submit</button>
                                <button type="button" onClick={() => setIsAddingAdmin(false)}>Cancel</button>
                            </form>
                        </div>
                    )}

                    {/* Add Tourism Governor Form */}
                    {isAddingGovernor && (
                        <div className="add-governor-form">
                            <h3>Add Tourism Governor</h3>
                            <form onSubmit={handleGovernorFormSubmit}>
                                <label>
                                    Username:
                                    <input
                                        type="text"
                                        name="username"
                                        value={governorData.username}
                                        onChange={handleGovernorFormChange}
                                        required
                                    />
                                </label>
                                <label>
                                    Email:
                                    <input
                                        type="email"
                                        name="email"
                                        value={governorData.email}
                                        onChange={handleGovernorFormChange}
                                        required
                                    />
                                </label>
                                <label>
                                    Password:
                                    <input
                                        type="password"
                                        name="password"
                                        value={governorData.password}
                                        onChange={handleGovernorFormChange}
                                        required
                                    />
                                </label>
                                <label>
                                    Mobile:
                                    <input
                                        type="tel"
                                        name="mobile"
                                        value={governorData.mobile}
                                        onChange={handleGovernorFormChange}
                                        required
                                    />
                                </label>
                                <label>
                                    Nationality:
                                    <input
                                        type="text"
                                        name="nationality"
                                        value={governorData.nationality}
                                        onChange={handleGovernorFormChange}
                                        required
                                    />
                                </label>
                                <label>
                                    Date of Birth:
                                    <input
                                        type="date"
                                        name="dob"
                                        value={governorData.dob}
                                        onChange={handleGovernorFormChange}
                                        required
                                    />
                                </label>
                                <button type="submit">Submit</button>
                                <button type="button" onClick={() => setIsAddingGovernor(false)}>Cancel</button>
                            </form>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default AdminPage;
