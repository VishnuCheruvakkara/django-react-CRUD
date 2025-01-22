import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../redux/authSlice';
import { GridLoader } from 'react-spinners';
import { setUser } from '../redux/userSlice'

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true)
        setError('');
        try {
            const response = await axios.post('http://localhost:8000/api/login/', { email, password }, {
                withCredentials: true,
            });
            // Extract access token from the response
            const access = response.data.access;
            const userData = response.data.user;
            console.log("data : ", response.data); // Check if userData exists in the response
            console.log("user data : ", response.data.user)

            dispatch(setUser(userData))
            // Dispatching the loginSuccess action with access and refresh tokens
            dispatch(loginSuccess({ token: access }));

            // Redirect user based on admin status
            if (userData.isAdmin) {
                // Redirect admin to the admin page
                navigate('/adminpage');
            } else {
                // Redirect regular user to the home page
                navigate('/');
            }
        } catch (error) {
            if (error.response && error.response.data) {
                // Capture the error message from backend response
                if (error.response.data.non_field_errors) {
                    setError(error.response.data.non_field_errors[0]); // Get the first error message
                } else {
                    setError('An error occurred. Please try again.');
                }
            }
        }
        finally {
            setLoading(false); // Stop loading once the request is complete
        }

    };

    return (
        <div className='flex items-center justify-center min-h-screen bg-gray-50'>
            {loading && (
                <div className="absolute bg-white inset-0 opacity-90 z-10"></div>
            )}
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
                <h2 className='text-2xl font-bold text-center mb-4'>Login</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="email" className='block text-sm font-medium text-gray-700'>Email</label>
                        <input
                            type="email"
                            id="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            id="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Show error here */}
                    {error && <div className="text-red-500 text-sm mt-1">{error}</div>}

                    {/* Show spinner when loading */}
                    {loading ? (
                        <div className="absolute inset-0 flex justify-center items-center z-30">
                            <GridLoader color="#3b82f6" loading={loading} size={15} />
                        </div>
                    ) : (
                        <button
                            type="submit"
                            className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            Login
                        </button>
                    )}

                    <div className="text-center mt-4">
                        <p>
                            Don't have an account?{' '}
                            <Link to="/register" className="text-blue-500">Sign Up</Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
