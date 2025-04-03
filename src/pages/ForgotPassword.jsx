import { useRef, useState } from "react";
import { Link,  } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function ForgotPassword() {
    const emailRef = useRef();
    const { resetPassword ,} = useAuth();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            setMessage("");
            setError("");
            setLoading(true);
            await resetPassword(emailRef.current.value);
            setMessage("Check your inbox for further instructions.");
        } catch {
            setError("Failed to reset your password.");
        }
        setLoading(false);
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-md">
                <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">Password Reset</h2>

                {error && <div className="mb-4 text-red-600 text-center">{error}</div>}
                {message && <div className="mb-4 text-green-600 text-center">{message}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-gray-600 font-medium">Email</label>
                        <input
                            id="email"
                            type="email"
                            ref={emailRef}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <button
                        disabled={loading}
                        type="submit"
                        className="w-full py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        {loading ? 'Sending...' : 'Reset Password'}
                    </button>
                </form>

                <div className="w-full text-center mt-4">
                    <Link to="/login" className="text-indigo-600 hover:text-indigo-800">Login</Link>
                </div>

                <div className="w-full text-center mt-4">
                    <p className="text-gray-600">Don't have an account? <Link to="/signup" className="text-indigo-600 hover:text-indigo-800">Sign Up</Link></p>
                </div>
            </div>
        </div>
    );
}
