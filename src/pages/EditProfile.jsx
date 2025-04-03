import { useRef, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";

export default function EditProfile() {
    const emailRef = useRef();
    const currentPasswordRef = useRef();
    const newPasswordRef = useRef();
    const newPasswordConfirmRef = useRef();
    const { currentUser, updateUserEmail, updateUserPassword, reauthenticateUser } = useAuth();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    function handleSubmit(e) {
        e.preventDefault();

        const promises = [];
        setLoading(true);
        setError("");
        promises.push(reauthenticateUser(currentPasswordRef.current.value));
        if (emailRef.current.value !== currentUser.email) {
            promises.push(updateUserEmail(emailRef.current.value).then(() => {
                alert("A verification email has been sent to your new email. Please verify to complete the update.");
            }));
        }
        if (newPasswordConfirmRef.current.value !== newPasswordRef.current.value) {
            setLoading(false);
            return setError("Passwords do not match");
        }
        if (newPasswordConfirmRef.current.value !== currentPasswordRef.current.value) promises.push(updateUserPassword(newPasswordRef.current.value));

        Promise.all(promises).then(() => {
            return currentUser.reload();
        }).then(() => {
            navigate('/');
        }).catch((e) => {
            setError("Failed to update your account");
            console.log(e);
        }).finally(() => setLoading(false));
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-md">
                <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">Edit Profile</h2>
                
                {error && <div className="mb-4 text-red-600 text-center">{error}</div>}
                
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-gray-600 font-medium">Email</label>
                        <input
                            id="email"
                            type="email"
                            ref={emailRef}
                            required
                            defaultValue={currentUser.email}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="current-password" className="block text-gray-600 font-medium">Current Password</label>
                        <input
                            id="current-password"
                            type="password"
                            ref={currentPasswordRef}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="new-password" className="block text-gray-600 font-medium">New Password</label>
                        <input
                            id="new-password"
                            type="password"
                            ref={newPasswordRef}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="new-password-confirm" className="block text-gray-600 font-medium">Confirm New Password</label>
                        <input
                            id="new-password-confirm"
                            type="password"
                            ref={newPasswordConfirmRef}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <button
                        disabled={loading}
                        type="submit"
                        className="w-full py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        {loading ? 'Updating...' : 'Update Profile'}
                    </button>
                </form>

                <div className="w-full text-center mt-4">
                    <Link to="/" className="text-indigo-600 hover:text-indigo-800">Cancel</Link>
                </div>
            </div>
        </div>
    );
}
