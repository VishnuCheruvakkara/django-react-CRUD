import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { GridLoader } from 'react-spinners';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFieldErrors({});
    try {
      const response = await axios.post('http://localhost:8000/api/register/', {
        email,
        password,
        username,
      });

      if (response.status === 201) {
        navigate('/login');
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setFieldErrors(error.response.data);
      } else {
        setFieldErrors({ general: ['Something went wrong!'] });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      {loading && (
        <div className="absolute bg-white inset-0 opacity-90 z-10 flex items-center justify-center">
          <GridLoader color="#3b82f6" loading={loading} size={15} />
        </div>
      )}
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
        <h2 className="text-2xl font-bold text-center mb-4">Sign Up</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Username</label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {fieldErrors.username && (
              <p className="text-red-500 text-sm mt-1">{fieldErrors.username[0]}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {fieldErrors.email && (
              <p className="text-red-500 text-sm mt-1">{fieldErrors.email[0]}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {fieldErrors.password && (
              <div className="text-red-500 text-sm mt-1">
                {fieldErrors.password.map((error, index) => (
                  <p key={index}>{error}</p>
                ))}
              </div>
            )}
          </div>

          {fieldErrors.general && (
            <p className="text-red-500 text-sm mt-1">{fieldErrors.general[0]}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full p-2 rounded-md focus:outline-none ${loading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
          >
            {loading ? 'Signing Up...' : 'Sign Up'}
          </button>
          <div className="text-center mt-4">
            <p>
              Already have an account?{' '}
              <Link to="/login" className="text-blue-500">
                Login
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
