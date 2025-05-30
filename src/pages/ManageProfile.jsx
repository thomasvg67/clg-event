import { useState, useEffect } from "react";
import { FaCamera, FaUser, FaBell, FaCog } from "react-icons/fa";
import { useAuth } from "../contexts/AuthContext";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import Navbar from "@/components/Navbar";

export default function ManageProfile() {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const db = getFirestore();

  useEffect(() => {
    const fetchUserData = async () => {
      if (currentUser) {
        const userRef = doc(db, "users", currentUser.uid);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setFormData({
            name: userData.displayName || currentUser.displayName || "",
            email: currentUser.email || "",
            phone: userData.phone || currentUser.phone || "",
          });
        }
      }
    };
    fetchUserData();
  }, [currentUser, db]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (currentUser) {
      const userRef = doc(db, "users", currentUser.uid);
      try {
        await updateDoc(userRef, {
          displayName: formData.name,
          phone: formData.phone,
        });
        toast.success("Profile updated successfully!");
      } catch (error) {
        console.error("Error updating profile:", error);
        toast.error("Error updating profile.");
      }
    }
  };

  return (
    <>
    <Navbar />
      <div className="pt-24 p-6 min-h-screen bg-gray-100 flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-md p-6">
          <h2 className="text-xl font-semibold mb-6">User Settings</h2>
          <ul className="space-y-4">
            <li
              className={`flex items-center gap-3 p-3 rounded-md cursor-pointer ${activeTab === "profile" ? "bg-blue-100 text-blue-700" : "text-gray-600"
                }`}
              onClick={() => setActiveTab("profile")}
            >
              <FaUser /> Manage Profile
            </li>
            <li
              className={`flex items-center gap-3 p-3 rounded-md cursor-pointer ${activeTab === "notifications" ? "bg-blue-100 text-blue-700" : "text-gray-600"
                }`}
              onClick={() => setActiveTab("notifications")}
            >
              <FaBell /> Notification Preferences
            </li>
            <li
              className={`flex items-center gap-3 p-3 rounded-md cursor-pointer ${activeTab === "settings" ? "bg-blue-100 text-blue-700" : "text-gray-600"
                }`}
              onClick={() => setActiveTab("settings")}
            >
              <FaCog /> Account Settings
            </li>
          </ul>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8 bg-white shadow-md rounded-md">
          {activeTab === "profile" && (
            <div>
              <h1 className="text-2xl font-bold mb-6">Manage Profile</h1>
              <div className="flex flex-col items-center mb-6">
                <div className="relative">
                  <img
                    src={currentUser?.photoURL || "/avatar-placeholder.png"}
                    alt="Profile"
                    className="w-24 h-24 rounded-full border shadow"
                  />
                  <button className="absolute bottom-0 right-0 bg-white border p-2 rounded-full shadow">
                    <FaCamera className="text-gray-600" />
                  </button>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="font-medium block">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full border p-3 rounded-md"
                    placeholder="Enter your name"
                  />
                </div>
                <div>
                  <label className="font-medium block">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    className="w-full border p-3 rounded-md bg-gray-100 cursor-not-allowed"
                    readOnly
                  />
                </div>
                <div>
                  <label className="font-medium block">Phone Number</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full border p-3 rounded-md"
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-4 mt-8">
                <button className="border px-6 py-2 rounded-md">Cancel</button>
                <button
                  onClick={handleSave}
                  className="bg-blue-600 text-white px-6 py-2 rounded-md"
                >
                  Save
                </button>
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div>
              <h1 className="text-2xl font-bold mb-6">Notification Preferences</h1>
              <p className="text-gray-600">Manage your email and push notification settings.</p>
            </div>
          )}

          {activeTab === "settings" && (
            <div>
              <h1 className="text-2xl font-bold mb-6">Account Settings</h1>
              <p className="text-gray-600">Manage your account details and security settings.</p>
            </div>
          )}
        </main>
      </div>
    </>

  );
}
