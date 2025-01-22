import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUserEdit } from "react-icons/fa";
import { FaSignOutAlt } from "react-icons/fa";
import { FaUserCircle } from "react-icons/fa";
import { logout } from '../redux/authSlice'
import { clearUser } from '../redux/userSlice'
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import axios from 'axios';
import {persistor} from '../redux/store'

const HomePage = () => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector(state => state.user.user);
    
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const handleLogout = async () => {
        try {
            const response = await axios.post('http://localhost:8000/api/logout/', null, {
                withCredentials: true,
            });

            if (response.status === 200) {
                dispatch(logout());
                dispatch(clearUser());
                await persistor.purge(); // Clear persisted state
                setTimeout(() => {
                    localStorage.removeItem('persist:root'); // Remove leftover keys manually
                }, 500); 
                navigate('/login');
            }
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            {/* Navigation Bar */}
            <nav className="bg-white shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        {/* Logo */}
                        <div className="flex-shrink-0 flex items-center">
                            <Link to="/" className="text-2xl font-bold text-blue-500">
                                DataManager
                            </Link>
                        </div>

                        {/* User Profile Dropdown */}
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={toggleDropdown}
                                className="flex items-center space-x-2 text-gray-700 hover:text-blue-500 transition duration-300 ease-in-outfocus:outline-none"
                            >
                                <FaUserCircle className="text-3xl" />
                                <span className="hidden md:block font-bold"></span>
                            </button>

                            {/* Dropdown Menu */}
                            {isOpen && (
                                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                                    {/* Profile Option */}
                                    <button className="w-full px-4 py-2 text-left flex items-center space-x-2 hover:bg-gray-100 text-gray-700 hover:text-blue-500 transition duration-300 ease-in-out">
                                        <FaUserEdit className="text-xl" />
                                        <Link to="/userprofile"><span className="font-bold">Edit Profile</span></Link>
                                    </button>

                                    {/* Logout Option */}
                                    <button onClick={handleLogout} className="w-full px-4 py-2 text-left flex items-center space-x-2 hover:bg-gray-100 text-gray-700 hover:text-red-500 transition duration-300 ease-in-out">
                                        <FaSignOutAlt className="text-xl" />
                                        <span className="font-bold">Logout</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="flex-grow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="bg-white rounded-lg shadow-lg p-8">
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">
                            Welcome to DataManager
                        </h1>
                        <p className="text-3xl text-gray-600 mb-8">
                            Hello, <span className="font-bold">{user && user.username ? user.username : 'User'}!</span>
                          
                        </p>


                        {/* Sample Data Section */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                            <div className="bg-blue-50 p-6 rounded-lg">
                                <h3 className="text-lg font-semibold text-blue-900 mb-2">
                                    Quick Stats
                                </h3>
                                <p className="text-blue-600">View your data analytics</p>
                            </div>

                            <div className="bg-green-50 p-6 rounded-lg">
                                <h3 className="text-lg font-semibold text-green-900 mb-2">
                                    Recent Activity
                                </h3>
                                <p className="text-green-600">Check your latest updates</p>
                            </div>

                            <div className="bg-purple-50 p-6 rounded-lg">
                                <h3 className="text-lg font-semibold text-purple-900 mb-2">
                                    Data Reports
                                </h3>
                                <p className="text-purple-600">Access your reports</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-white shadow-lg mt-auto">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex justify-center items-center">
                        <p className="text-gray-500 text-sm">
                            © {new Date().getFullYear()} DataManager. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default HomePage;