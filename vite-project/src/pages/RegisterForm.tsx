import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Import Link from react-router-dom

const RegisterForm: React.FC = () => {
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate inputs
    if (!firstName || !lastName || !username || !password) {
      setError('All fields are required.');
      return;
    }

    setError('');
    setLoading(true);
    setSuccessMessage(''); // Clear any previous success message

    try {
      // Send registration request to backend
      const response = await fetch('http://localhost:5000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ firstName, lastName, username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Show success message
        setSuccessMessage('Registration successful!');

        // After showing the success message, navigate to the login page immediately
        setTimeout(() => {
          navigate('/login'); // Redirect to the login page using the relative path
        }, 2000); // Navigate after 2 seconds
      } else {
        setError(data.message || 'Registration failed. Please try again.');
      }
    } catch (error) {
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-login-register flex justify-center items-center min-h-screen">
      <div className="w-full max-w-lg mx-auto p-6 bg-gray-100 shadow-lg rounded-lg">
        <h2 className="text-4xl font-bold text-center mb-8 text-blue-600">Register</h2>

        {/* Error message */}
        {error && <div className="text-red-600 font-medium mb-4">{error}</div>}

        {/* Success message */}
        {successMessage && (
          <div className="text-green-600 font-medium mb-4">{successMessage}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="firstName" className="block text-lg font-medium mb-2">First Name</label>
            <input
              type="text"
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none shadow-sm"
            />
          </div>

          <div>
            <label htmlFor="lastName" className="block text-lg font-medium mb-2">Last Name</label>
            <input
              type="text"
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none shadow-sm"
            />
          </div>

          <div>
            <label htmlFor="username" className="block text-lg font-medium mb-2">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none shadow-sm"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-lg font-medium mb-2">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none shadow-sm"
            />
          </div>

          {/* Centering the Register Button */}
          <div className="flex justify-center mt-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-2 rounded-lg hover:shadow-md transition-all disabled:opacity-50"
            >
              {loading ? 'Registering...' : 'Register'}
            </button>
          </div>
        </form>

        {/* Links */}
        <div className="mt-4 text-center">
          <p className="text-sm">Already have an account? <Link to="/login" className="text-blue-500 hover:underline">Login</Link></p>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
