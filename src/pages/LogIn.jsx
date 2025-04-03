import { useRef, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";

export default function Login() {
    const emailRef = useRef();
    const passwordRef = useRef();
    const { login, loginWithGoogle } = useAuth();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            setError("");
            setLoading(true);
            await login(emailRef.current.value, passwordRef.current.value);
            navigate('/home');
        } catch {
            setError("Failed to log in.");
        }
        setLoading(false);
    }

    async function handleGoogleLogin() {
        try {
            setError("");
            setLoading(true);
            await loginWithGoogle();
            navigate('/home');
        } catch {
            setError("Failed to log in with Google.");
        }
        setLoading(false);
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-md">
                <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">Log In</h2>

                {error && <div className="mb-4 text-red-600 text-center">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-gray-600 font-medium">Email</label>
                        <input
                            id="email"
                            type="email"
                            ref={emailRef}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-gray-600 font-medium">Password</label>
                        <input
                            id="password"
                            type="password"
                            ref={passwordRef}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <button
                        disabled={loading}
                        type="submit"
                        className="w-full py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        {loading ? 'Logging In...' : 'Login'}
                    </button>
                </form>

                <button
                    onClick={handleGoogleLogin}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 mt-4 py-2 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300"
                >
                    <FcGoogle className="text-xl" /> Continue with Google
                </button>

                <div className="w-full text-center mt-4">
                    <Link to="/forgot-password" className="text-indigo-600 hover:text-indigo-800">Forgot Password?</Link>
                </div>

                <div className="w-full text-center mt-4">
                    <p className="text-gray-600">Don't have an account? <Link to="/signup" className="text-indigo-600 hover:text-indigo-800">Sign Up</Link></p>
                </div>
            </div>
        </div>
    );
}
