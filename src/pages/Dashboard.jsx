import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";

export default function Dashboard() {
    const [error, setError] = useState("");
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();

    async function handleLogout() {
        setError('');
        try {
            await logout();
            navigate('/login');
        } catch {
            setError('Failed to log out');
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-md">
                <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">Profile Dashboard</h2>

                {error && <div className="mb-4 text-red-600 text-center">{error}</div>}

                <div className="mb-4">
                    <strong className="block text-gray-600">Name:</strong>
                    <span className="text-gray-700">{currentUser.displayName || "N/A"}</span>
                </div>

                <div className="mb-4">
                    <strong className="block text-gray-600">Email:</strong>
                    <span className="text-gray-700">{currentUser.email}</span>
                </div>

                <div className="mb-4">
                    <strong className="block text-gray-600">Phone:</strong>
                    <span className="text-gray-700">{currentUser.phoneNumber || "N/A"}</span>
                </div>

                <Link to="/edit-profile" className="w-full block text-center py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4">
                    Edit Profile
                </Link>

                <div className="w-full text-center mt-4">
                    <button
                        onClick={handleLogout}
                        className="text-red-600 hover:text-red-800 focus:outline-none"
                    >
                        Log Out
                    </button>
                </div>
            </div>
        </div>
    );
}
