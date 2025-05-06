import React, { useEffect, useState } from "react";
import { db } from "../lib/firebase";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { FaCalendarAlt, FaClock } from "react-icons/fa";

export default function Bookings() {
  const { currentUser } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      if (!currentUser) return;

      try {
        const registrationsQuery = query(
          collection(db, "eventRegistrations"),
          where("userId", "==", currentUser.uid)
        );
        const registrationSnap = await getDocs(registrationsQuery);

        const eventPromises = registrationSnap.docs.map(async (registration) => {
          const eventRef = doc(db, "events", registration.data().eventId);
          const eventSnap = await getDoc(eventRef);
          if (eventSnap.exists()) {
            return { id: eventSnap.id, ...eventSnap.data() };
          }
          return null;
        });

        const events = await Promise.all(eventPromises);
        setBookings(events.filter(event => event !== null));
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [currentUser]);

  if (loading) return <div className="text-center text-lg mt-10">Loading bookings...</div>;
  if (bookings.length === 0) return <div className="text-center text-lg mt-10 text-gray-500">No bookings found.</div>;

  return (
    <>
      <Navbar />
      <div className="pt-24 p-6 bg-gray-100 min-h-screen flex justify-center">
        <div className="max-w-2xl w-full bg-white p-8 rounded-lg shadow-lg border">
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">My Bookings</h2>
          <ul className="space-y-4">
            {bookings.map((event) => (
              <li
                key={event.id}
                className="p-4 border rounded-lg shadow-sm bg-gray-50 cursor-pointer hover:bg-gray-200 transition"
                onClick={() => navigate(`/event/${event.id}`)}
              >
                <h3 className="text-xl font-semibold text-gray-800">{event.eventName}</h3>
                <p className="text-gray-600 flex items-center gap-2">
                  <FaCalendarAlt className="text-indigo-600" />{event.date} |
                  <FaClock className="text-indigo-600" />{event.startTime} - {event.endTime}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}