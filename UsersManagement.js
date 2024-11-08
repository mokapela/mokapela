import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UsersManagement.css';

const UsersManagement = () => {
    const [users, setUsers] = useState([]);
    const [newUser, setNewUser] = useState({ username: '', password: '' });
    const [updateUser, setUpdateUser] = useState({ oldUsername: '', newUsername: '', newPassword: '' });
    const [deleteUsername, setDeleteUsername] = useState('');

    // Fetch users from the database
    const fetchUsers = async () => {
        try {
            const response = await axios.get('http://localhost:5300/users');
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // Add a new user
    const addUser = async (e) => {
        e.preventDefault();
        if(!newUser.username || !newUser.password) {
            alert("Both fields are required");
            return;
        }
        try {
            await axios.post('http://localhost:5300/users', newUser);
            fetchUsers(); // Refresh user list
            alert('User added');
            setNewUser({ username: '', password: '' });
        } catch (error) {
            alert(error.response?.data?.error || 'Error adding user');
        }
    };

    // Update an existing user
    const updateExistingUser = async (e) => {
        e.preventDefault();
        if (!updateUser.oldUsername || !updateUser.newUsername || !updateUser.newPassword) {
            alert('All fields are required');
            return;
        }
        try {
            await axios.put('http://localhost:5300/users', updateUser);
            fetchUsers(); // Refresh user list
            alert('User updated');
            setUpdateUser({ oldUsername: '', newUsername: '', newPassword: '' });
        } catch (error) {
            alert(error.response?.data?.error || 'Error updating user');
        }
    };

    // Delete a user
    const deleteUser = async (e) => {
        e.preventDefault();
        if (!deleteUsername) {
            alert('Username is required to delete a user');
            return;
        }
        try {
            await axios.delete('http://localhost:5300/users', { data: { username: deleteUsername } });
            fetchUsers(); // Refresh user list
            alert('User deleted');
            setDeleteUsername('');
        } catch (error) {
            alert(error.response?.data?.error || 'Error deleting user');
        }
    };

    return (
        <section id="usersManagement">
            <h2>USERS MANAGEMENT</h2>

            {/* Add User Form */}
            <form id="addUserForm" onSubmit={addUser}>
                <label htmlFor="username">Username:</label>
                <input 
                    type="text" 
                    id="username" 
                    value={newUser.username} 
                    onChange={(e) => setNewUser({ ...newUser, username: e.target.value })} 
                    required 
                />
                <label htmlFor="password">Password:</label>
                <input 
                    type="password" 
                    id="password" 
                    value={newUser.password} 
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} 
                    required 
                />
                <button type="submit">Add User</button>
            </form>

            {/* Update User Form */}
            <form id="updateUserForm" onSubmit={updateExistingUser}>
                <label htmlFor="oldUsername">Old Username:</label>
                <input 
                    type="text" 
                    id="oldUsername" 
                    value={updateUser.oldUsername} 
                    onChange={(e) => setUpdateUser({ ...updateUser, oldUsername: e.target.value })} 
                    required 
                />
                <label htmlFor="newUsername">New Username:</label>
                <input 
                    type="text" 
                    id="newUsername" 
                    value={updateUser.newUsername} 
                    onChange={(e) => setUpdateUser({ ...updateUser, newUsername: e.target.value })} 
                    required 
                />
                <label htmlFor="newPassword">New Password:</label>
                <input 
                    type="password" 
                    id="newPassword" 
                    value={updateUser.newPassword} 
                    onChange={(e) => setUpdateUser({ ...updateUser, newPassword: e.target.value })} 
                    required 
                />
                <button type="submit">Update User</button>
            </form>

            {/* Delete User Form */}
            <form id="deleteUserForm" onSubmit={deleteUser}>
                <label htmlFor="deleteUsername">Username to delete:</label>
                <input 
                    type="text" 
                    id="deleteUsername" 
                    value={deleteUsername} 
                    onChange={(e) => setDeleteUsername(e.target.value)} 
                    required 
                />
                <button type="submit">Delete User</button>
            </form>

            {/* User List as Table */}
            <h3>Users List:</h3>
            <table id="usersList">
                <thead>
                    <tr>
                        <th>Username</th>
                    </tr>
                </thead>
                <tbody>
                    {users.length === 0 ? (
                        <tr>
                            <td>No users available</td>
                        </tr>
                    ) : (
                        users.map((user, index) => (
                            <tr key={index}>
                                <td>{user.username}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </section>
    );
};

export default UsersManagement;