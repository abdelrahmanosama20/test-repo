import React, { useEffect, useState } from 'react';

const UserList = ({ userType }) => {
    const [users, setUsers] = useState([]);

    // Fetch users based on user type when the component mounts or the userType changes
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/${userType}`);
                const data = await response.json();
                console.log('Data from API:', data);
                setUsers(data.data); // Set users from the backend response
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
    }, [userType]);

    // Function to handle deleting a user
    const handleDeleteUser = async (userId) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this user?');
        if (!confirmDelete) return;

        try {
            const response = await fetch(`http://localhost:5000/api/${userType}/${userId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                alert('User deleted successfully');
                // Filter out the deleted user from the state
                setUsers(users.filter(user => user._id !== userId));
            } else {
                alert('Error deleting user');
            }
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    return (
        <div>
            <h2>{userType.charAt(0).toUpperCase() + userType.slice(1)} List</h2>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Mobile</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                {users.length > 0 ? (
                        users.map(user => (
                            <tr key={user._id}>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.mobile}</td>
                                <td>
                                    <button onClick={() => handleDeleteUser(user._id)}>Delete</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr><td colSpan="4">No users found</td></tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default UserList;