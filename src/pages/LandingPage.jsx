import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

function LandingPage() {
    return (
        <div>
            <Navbar />
            <div className="min-h-screen bg-gradient-to-r from-blue-500 to-indigo-600 flex flex-col items-center justify-center text-white">

                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold mb-4">College Event Management System</h1>
                    <p className="text-lg font-medium">
                        Manage events effortlessly and keep everything organized!
                    </p>
                </div>

                {/* Call-to-Action Buttons */}
                <div className="space-x-4">
                    <Link to="/signup" className="bg-white text-blue-600 font-semibold px-6 py-3 rounded-lg shadow-lg hover:bg-gray-200 transition duration-300">
                        Sign Up
                    </Link>
                    <Link to="/login" className="bg-white text-indigo-600 font-semibold px-6 py-3 rounded-lg shadow-lg hover:bg-gray-200 transition duration-300">
                        Log In
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default LandingPage;
