import React, { useState, useEffect, useRef } from 'react';
import { FaCamera } from 'react-icons/fa';
import { FaHome } from 'react-icons/fa';
import { FaUser } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../redux/authSlice';
import { setUser } from '../redux/userSlice';



const UserProfile = () => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user.user);
    const accessToken = useSelector((state) => state.auth.token);

    const [formData, setFormData] = useState({
        fullName: user?.username,
        email: user?.email,
        password: '',
        profileImage: null,
    });
    const [errors, setErrors] = useState({});

    const [isEditing, setIsEditing] = useState(false); // State to toggle edit mode
    const fileInputRef = useRef(null);

    // Trigger file input when profile image area is clicked
    const handleImageClick = () => {
        fileInputRef.current.click();
    };

    // Handle file input change to read the selected image
    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setFormData(prev => ({
                    ...prev,
                    profileImage: e.target.result // Set the selected image as profile image
                }));
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Define headers outside of try block to be accessed inside the catch block
        let headers = {
            Authorization: `Bearer ${accessToken}`, // Send the access token in the Authorization header
        };
        // Create a new FormData object
        const formDataToSend = new FormData();
        // Append form data
        formDataToSend.append('username', formData.fullName);
        formDataToSend.append('email', formData.email);
        formDataToSend.append('password', formData.password);

        // Check if there's a profile image and append it
        if (formData.profileImage) {
            // Convert the base64 string to a Blob and append it as a file
            const blob = dataURItoBlob(formData.profileImage);
            formDataToSend.append('profile_image', blob, 'profile_image.jpg'); // or 'profile_image.png' depending on the file format
        }

        try {
            // Attempt the profile update request
            let response = await axios.put(
                'http://localhost:8000/api/profile/update/', // API endpoint to update the profile
                formDataToSend,
                { headers }
            );

            if (response.status === 200) {
                console.log("Profile updated successfully");
                const { fullName, email, profileImage } = formData;
                dispatch(setUser({ username: fullName, email: email, profileImage: profileImage }));
                setIsEditing(false);
                setErrors({}); 
            }
        } catch (error) {
            // If access token has expired, attempt to refresh it
            if (error.response.status === 400) {
                setErrors(error.response.data)
            }
            if (error.response && error.response.status === 401) {


                console.log("Access token expired, attempting to refresh!");

                try {
                    const refreshResponse = await axios.post(
                        'http://localhost:8000/api/token/refresh/', // Token refresh endpoint
                        null,
                        { withCredentials: true } // Send cookies with the request
                    );

                    if (refreshResponse.status === 200) {
                        const newAccessToken = refreshResponse.data.access;
                        dispatch(loginSuccess({ token: newAccessToken }));
                        // Update headers with the new access token
                        headers.Authorization = `Bearer ${newAccessToken}`;

                        // Retry the profile update request with the new access token
                        const retryResponse = await axios.put(
                            'http://localhost:8000/api/profile/update/', // API endpoint to update the profile
                            updatedData, // Now accessible after the token refresh
                            { headers }
                        );

                        if (retryResponse.status === 200) {
                            console.log("Profile updated successfully after token refresh!");
                            const { fullName, email, profileImage } = formData;
                            dispatch(setUser({ username: fullName, email: email, profileImage: profileImage }));
                            setIsEditing(false);
                            setErrors({}); 
                        }
                    }
                } catch (refreshError) {
                    if (error.response.status === 400) {
                        setErrors(error.response.data)
                    }

                    console.error("Error refreshing token:", refreshError);
                    console.log("Session expired. Please log in again.");
                }
            } else {
                console.error("Error updating profile:", error);
            }
        }
    };

    // Helper function to convert base64 to Blob
    const dataURItoBlob = (dataURI) => {
        const byteString = atob(dataURI.split(',')[1]);
        const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
        const arrayBuffer = new ArrayBuffer(byteString.length);
        const uintArray = new Uint8Array(arrayBuffer);

        for (let i = 0; i < byteString.length; i++) {
            uintArray[i] = byteString.charCodeAt(i);
        }

        return new Blob([uintArray], { type: mimeString });
    };




    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <div className="w-64 bg-white shadow-lg">
                <div className="flex flex-col h-full">
                    <div className="p-4 border-b">
                        <h2 className="text-xl font-bold text-gray-800">User Settings</h2>
                    </div>
                    <nav className="flex-1 p-4">
                        <Link to="/home" className="flex items-center space-x-3 text-gray-700 hover:text-blue-500 p-2 rounded-lg hover:bg-gray-100">
                            <FaHome className="text-xl" />
                            <span>Back to Home</span>
                        </Link>
                        <a href="/profile" className="flex items-center space-x-3 text-blue-500 bg-blue-50 p-2 rounded-lg mt-2">
                            <FaUser className="text-xl" />
                            <span>Edit Profile</span>
                        </a>
                    </nav>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-8">
                <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
                    <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Profile</h1>

                    <form className="space-y-6" >
                        {/* Profile Image Section */}
                        <div className="flex flex-col items-center mb-8">


                            <div
                                className={`relative w-32 h-32 rounded-full bg-gray-200 overflow-hidden cursor-pointer hover:opacity-90 transition-all`}
                                onClick={isEditing ? handleImageClick : null} // Trigger file input click only in edit mode
                            >
                                {/* Show the selected image or the user's profile image */}
                                {formData.profileImage ? (
                                    <img
                                        src={formData.profileImage} // Show the selected image
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                    />
                                ) : user?.profileImage ? (
                                    <img
                                        src={`http://localhost:8000${user.profileImage}`} // Show the profile image from Redux
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <FaCamera className="text-3xl text-gray-400" />
                                    </div>
                                )}
                            </div>




                            {isEditing && (
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleImageChange}
                                    accept="image/*"
                                    className="hidden" // Hide the input field
                                />
                            )}
                            <p className="text-sm text-gray-500 mt-2">Click <b>Edit Profile</b> button</p>
                            {errors.profile_image && <p className="text-red-500 text-sm mt-1 text-center">{errors.profile_image}</p>} {/* Display error */}

                        </div>

                        {/* Form Fields */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">User Name</label>
                                <input
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName}

                                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                    className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="John Doe"
                                    disabled={!isEditing} // Disable input if not in edit mode
                                />
                                {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>} {/* Display error */}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="john@example.com"
                                    disabled={!isEditing} // Disable input if not in edit mode
                                />
                                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>} {/* Display error */}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="••••••••"
                                    disabled={!isEditing} // Disable input if not in edit mode
                                />


                                {errors.password && (
                                    <div className="text-red-500 text-sm mt-1">
                                        {errors.password.map((error, index) => (
                                            <p key={index}>{error}</p>
                                        ))}
                                    </div>
                                )}

                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-end space-x-4 pt-4">
                            {isEditing ? (
                                <>
                                    <button
                                        onClick={handleSubmit}
                                        type="button"
                                        className="inline-flex justify-center rounded-md bg-blue-600 px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors"
                                    >
                                        Save Changes
                                    </button>
                                    <button
                                        type='button'
                                        onClick={() => setIsEditing(false)} // Cancel edit mode
                                        className="inline-flex justify-center rounded-md bg-gray-100 px-6 py-2 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-200 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </>
                            ) : (
                                <button
                                    type='button'
                                    onClick={(e) => {
                                        e.preventDefault;
                                        setIsEditing(true);
                                    }} // Enable edit mode
                                    className="inline-flex justify-center rounded-md bg-blue-600 px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors"
                                >
                                    Edit Profile
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
