import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import LoginForm from './pages/LoginForm';
import RegisterForm from './pages/RegisterForm';
import RecipeGenerator from './pages/RecipeGenerator';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={
            <div 
              className="flex items-center justify-center min-h-screen bg-cover bg-center"
              style={{ backgroundImage: 'url(/images/bg.jpg)' }} // Path relative to public folder
            >
              <div className="text-center">
                <h1 className="text-4xl font-bold text-white">
                  Welcome to Recipe Generator
                </h1>
                {/* Login and Register Buttons */}
                <div className="mt-8">
                  <Link to="/login">
                    <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:shadow-md mr-4">Login</button>
                  </Link>
                  <Link to="/register">
                    <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:shadow-md">Register</button>
                  </Link>
                </div>
              </div>
            </div>
          } 
        />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/dashboard" element={<RecipeGenerator />} />  {/* This is the key route */}
      </Routes>
    </Router>
  );
};

export default App;