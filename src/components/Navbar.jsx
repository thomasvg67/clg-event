import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useState, useEffect } from "react";
import { db } from "../lib/firebase";
import { doc, getDoc, collection, addDoc } from "firebase/firestore";
import react from "../assets/react.svg";
import {
  FaRegUser,
  FaSignOutAlt,
  FaTh,
  FaUserCog,
  FaCalendarCheck,
  FaTimes,
} from "react-icons/fa";

export default function Navbar() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [role, setRole] = useState(null);
  const [requestSent, setRequestSent] = useState(false);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (currentUser) {
        try {
          const userDoc = await getDoc(doc(db, "users", currentUser.uid));
          if (userDoc.exists()) {
            setRole(userDoc.data().role);
          }
        } catch (err) {
          console.error("Error fetching user role:", err);
        }
      }
    };

    fetchUserRole();
  }, [currentUser]);

  const handleHostRequest = async () => {
    try {
      await addDoc(collection(db, "hostRequests"), {
        userId: currentUser.uid,
        name: currentUser.displayName || currentUser.email,
        email: currentUser.email,
        status: "Pending",
        createdAt: new Date(),
      });
      setRequestSent(true);
    } catch (error) {
      console.error("Error sending host request:", error);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
    setSidebarOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 w-full flex justify-between items-center px-8 py-4 shadow-md bg-white z-50">
      <h1 className="text-2xl font-bold text-blue-700">EVENTHUB</h1>

      <div className="relative flex gap-4">
        {role === "host" ? (
          <Link to="/hostdash/my-events">
            <button className="border px-4 py-2 rounded-md hover:bg-gray-100">
              Host an Event
            </button>
          </Link>
        ) : role === "user" && (
          <button
            onClick={handleHostRequest}
            disabled={requestSent}
            className={`border px-4 py-2 rounded-md ${requestSent ? "bg-gray-300 cursor-not-allowed" : "hover:bg-gray-100"
              }`}
          >
            {requestSent ? "Request Sent" : "Host Request"}
          </button>
        )}

        {currentUser ? (
          <button
            onClick={() => setSidebarOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-gray-100"
          >
            <img
              src={currentUser?.photoURL || react}
              alt="Avatar"
              className="w-8 h-8 rounded-full"
            />
            <span>{currentUser?.displayName || currentUser?.email?.split("@")[0]}</span>
          </button>
        ) : (
          <Link to="/login">
            <button className="text-blue-600 border px-4 py-2 rounded-md">
              Log in
            </button>
          </Link>
        )}
      </div>

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg transform ${sidebarOpen ? "translate-x-0" : "translate-x-full"
          } transition-transform duration-300 ease-in-out z-50`}
      >
        <div className="p-4 flex justify-between items-center border-b">
          <h2 className="text-lg font-semibold">User Menu</h2>
          <button onClick={() => setSidebarOpen(false)} className="text-gray-500 hover:text-gray-700">
            <FaTimes size={20} />
          </button>
        </div>

        {currentUser ? (
          <>
            <div className="p-4 text-center">
              <img
                src={currentUser?.photoURL || react}
                alt="Avatar"
                className="w-16 h-16 rounded-full mx-auto"
              />
              <p className="font-semibold mt-2">
                {currentUser?.displayName || currentUser?.email?.split("@")[0]}
              </p>
              <p className="text-gray-500 text-sm">{currentUser?.email}</p>
            </div>

            <div className="py-2">
              {role === "host" && (
                <Link to="/hostdash" className="flex items-center gap-2 px-6 py-3 hover:bg-gray-100">
                  <FaTh /> Dashboard
                </Link>
              )}
              {role === "admin" && (
                <Link to="/admindash" className="flex items-center gap-2 px-6 py-3 hover:bg-gray-100">
                  <FaTh /> Dashboard
                </Link>
              )}
              <Link to="/manage-profile" className="flex items-center gap-2 px-6 py-3 hover:bg-gray-100">
                <FaUserCog /> Manage Profile
              </Link>
              <Link to="/bookings" className="flex items-center gap-2 px-6 py-3 hover:bg-gray-100">
                <FaCalendarCheck /> My Events
              </Link>
            </div>

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-6 py-3 text-red-600 hover:bg-gray-100"
            >
              <FaSignOutAlt /> Logout
            </button>
          </>
        ) : (
          <div className="p-4 text-center">
            <p className="text-gray-500">Not logged in</p>
            <Link to="/login">
              <button className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-md">
                Log in
              </button>
            </Link>
          </div>
        )}
      </div>

      {/* Overlay with Blur Effect */}
      {sidebarOpen && (
        <div
          className="fixed top-0 left-0 w-full h-full backdrop-blur-md bg-black/10 z-40"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </header>
  );
}
