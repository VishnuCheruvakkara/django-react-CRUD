import React, { useState, useEffect } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { FaSignOutAlt } from 'react-icons/fa';
import { FaSearch } from 'react-icons/fa';
import { FaUserPlus } from 'react-icons/fa';
import { FaEdit } from 'react-icons/fa';
import { FaTrash } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { persistor } from '../redux/store';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { logout } from '../redux/authSlice';
import { clearUser } from '../redux/userSlice';
import DefaultUserImage from '../assets/default-user.jpg';
import { useSelector } from 'react-redux';
import { setAuthData } from '../redux/authDataSlice';

function AdminPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const users = useSelector((state) => state.authData.authData);
    const [searchQuery,setSearchQuery]=useState('')

    const filteredUsers = users.filter((user) =>
        user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
    

    const [isModalOpen, setModalOpen] = useState(false);  // State to manage modal visibility
    const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const accessToken = useSelector((state) => state.auth.token);

    const openModal = () => setModalOpen(true);
    const closeModal = () => setModalOpen(false);


    const openEditModal = (user) => {
        setSelectedUser(user);  // Set the selected user to be edited
        setUsername(user.username);  // Pre-fill the username
        setEmail(user.email);  // Pre-fill the email
        setPassword('');  // Clear the password field
        setIsEditUserModalOpen(true);  // Open the modal
    };

    const closeEditModal = () => {
        setIsEditUserModalOpen(false);
        setSelectedUser(null);
        setUsername('');
        setEmail('');
        setPassword('');
    };



    useEffect(() => {
        const fetchUsers = async () => {
            try {
                if (!accessToken) {
                    console.error('No access token available.');
                    return;
                }

                const response = await axios.get('http://localhost:8000/api/users/', {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                    withCredentials: true,
                });

                dispatch(setAuthData(response.data));
                console.log('Fetched users successfully!', response.data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
    }, [accessToken]);

    const deleteUserHandler = async (userId) => {
        try {
            const response = await axios.delete(`http://localhost:8000/api/user/delete/${userId}/`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                withCredentials: true,
            });
            console.log('User deleted successfully!', response.data);
            setUsers((prevUsers) => prevUsers.filter(user => user.id !== userId));
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    const handleLogout = async () => {
        try {
            const response = await axios.post('http://localhost:8000/api/logout/', null, {
                withCredentials: true,
            });
            if (response.status === 200) {
                dispatch(logout());
                dispatch(clearUser());
                await persistor.purge();
                setTimeout(() => {
                    localStorage.removeItem('persist:root');
                }, 500);
                navigate('/login');
            }
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

    const handleAddUser = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(
                'http://localhost:8000/api/register/',
                { username, email, password },  // Added password here
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                    withCredentials: true,
                }
            );
            console.log('User created successfully!', response.data);
            setUsers((prevUsers) => [...prevUsers, response.data.user]);
            setModalOpen(false);  // Close the modal after submitting
            setUsername('');
            setEmail('');
            setPassword('');  // Reset password field
        } catch (error) {
            console.error('Error adding user:', error);
        }
    };

    const handleAdminEditUser = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(
                `http://localhost:8000/api/admin/user/edit/${selectedUser.id}/`,
                { username, email },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,  // Ensure the admin token is passed
                    },
                    withCredentials: true,
                }
            );
            console.log('User updated successfully!', response.data);
            closeEditModal();  // Close the modal after successful update
            // Optionally, update the users list with the updated data
            setUsers((prevUsers) =>
                prevUsers.map(user =>
                    user.id === selectedUser.id ? { ...user, username, email } : user
                )
            );
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };
    


    return (
        <div>
            <div className="min-h-screen flex flex-col bg-gray-50">
                <nav className="bg-white shadow-lg">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between h-16 items-center">
                            <div className="text-2xl font-bold text-blue-500">Admin Dashboard</div>
                            <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-2">
                                    <FaUserCircle className="text-2xl text-gray-600" />
                                    <span className="font-semibold text-gray-700">Admin Name</span>
                                </div>
                                <button onClick={handleLogout} className="flex items-center space-x-2 text-red-500 hover:text-red-600">
                                    <FaSignOutAlt />
                                    <span>Logout</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </nav>

                <main className="flex-grow p-6">
                    <div className="max-w-7xl mx-auto">
                        <div className="bg-white p-4 rounded-lg shadow-md mb-6 flex justify-between items-center">
                            <div className="flex items-center flex-1 mr-4">
                                <FaSearch className="text-gray-400 mr-2" />
                                <input
                                    type="text"
                                    placeholder="Search users..."
                                    value={searchQuery}
                                    onChange={(e)=>setSearchQuery(e.target.value)}
                                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <button onClick={openModal} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 flex items-center transition duration-300">
                                <FaUserPlus className="mr-2" />
                                Add User
                            </button>
                        </div>

                        <div className="bg-white rounded-lg shadow-md overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Edit</th>
                                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Delete</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {filteredUsers.filter((user) => !user.is_staff).map((user) => (
                                            <tr key={user.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                                    <img
                                                        src={user.profile_image ? `http://localhost:8000${user.profile_image}` : DefaultUserImage}
                                                        alt="Profile"
                                                        className="h-16 w-16 object-cover border-2 rounded-full border-blue-500 mx-auto"
                                                    />
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-center">{user.username}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-center">{user.email}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-center">{user.is_staff ? 'Admin' : 'User'}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                                    <button onClick={() => openEditModal(user)} className="text-2xl text-lime-500 hover:text-lime-600 mr-3 transition duration-300">
                                                        <FaEdit />
                                                    </button>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                                    <button onClick={() => deleteUserHandler(user.id)} className="text-xl text-red-500 hover:text-red-600 transition duration-300">
                                                        <FaTrash />
                                                    </button>
                                                </td>
                                            </tr>

                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </main>
                {/* Edit User Modal */}
                {isEditUserModalOpen && (
                    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg w-80">
                            <h2 className="text-xl font-semibold mb-4">Edit User</h2>
                            <form onSubmit={handleAdminEditUser}>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">Username</label>
                                    <input
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        required
                                        className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">Email</label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                {/* Optional: Password field can be left out or added */}
                                <div className="flex justify-end">
                                    <button
                                        type="button"
                                        onClick={closeEditModal}  // Close modal
                                        className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500 mr-2"
                                    >
                                        Cancel
                                    </button>
                                    <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                                        Save Changes
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}


                {/* Add User Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg w-80">
                            <h2 className="text-xl font-semibold mb-4">Add New User</h2>
                            <form onSubmit={handleAddUser}>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">Username</label>
                                    <input
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        required
                                        className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">Email</label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">Password</label>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div className="flex justify-end">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500 mr-2"
                                    >
                                        Cancel
                                    </button>
                                    <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                                        Add User
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AdminPage;
