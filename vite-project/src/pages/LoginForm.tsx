import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginForm: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate inputs
    if (!username || !password) {
      setError('Username and Password are required.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      // Call the backend API for login
      const response = await login(username, password);

      if (response.message === 'Login successful!') {
        // Show success message and redirect to the dashboard
        setError('Login successful!');
        setTimeout(() => {
          navigate('/dashboard'); // Redirect to dashboard page
        }, 1000); // Wait 1 second before redirecting
      } else {
        setError('Invalid username or password.');
      }
    } catch (error) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Login API function to call the backend
  const login = async (username: string, password: string) => {
    const response = await fetch('http://localhost:5000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Login failed');
    }

    const data = await response.json();
    return data; // Return the response data
  };

  return (
    <div className="bg-login-register flex justify-center items-center min-h-screen">
      <div className="w-full max-w-lg mx-auto p-6 bg-gray-100 shadow-lg rounded-lg">
        <h2 className="text-4xl font-bold text-center mb-8 text-blue-600">Login</h2>

        {/* Error or success message */}
        {error && (
          <div className={`font-medium mb-4 ${error === 'Login successful!' ? 'text-green-600' : 'text-red-600'}`}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
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

          {/* Centering the Submit Button */}
          <div className="flex justify-center mt-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-2 rounded-lg hover:shadow-md transition-all disabled:opacity-50"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </div>
        </form>

        {/* Links */}
        <div className="mt-4 text-center">
          <p className="text-sm">Don't have an account? <a href="/register" className="text-blue-500 hover:underline">Register</a></p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
