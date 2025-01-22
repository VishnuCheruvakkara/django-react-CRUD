import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../redux/authSlice';
import { setUser } from '../redux/userSlice';
import { showToast } from '../components/ToastNotifications';
import LoadingSpinner from '../components/LoadingSpinner'; // Import the LoadingSpinner component

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const response = await axios.post('http://localhost:8000/api/login/', { email, password }, {
                withCredentials: true,
            });
            const access = response.data.access;
            const userData = response.data.user;
            dispatch(setUser(userData));
            dispatch(loginSuccess({ token: access }));
            showToast(`Hello '${response.data.user.username}', Welcome to DataManager`, 'success');

            if (userData.isAdmin) {
                navigate('/adminpage');
            } else {
                navigate('/');
            }
        } catch (error) {
            if (error.response && error.response.data) {
                showToast('An error occurred. Please try again.', 'error');
                setError(error.response.data.non_field_errors ? error.response.data.non_field_errors[0] : 'An error occurred. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='flex items-center justify-center min-h-screen bg-gray-50'>
            <LoadingSpinner loading={loading} /> {/* Use the LoadingSpinner component */}
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
                    {error && <div className="text-red-500 text-sm mt-1">{error}</div>}
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        Login
                    </button>
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
