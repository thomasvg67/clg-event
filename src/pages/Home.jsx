import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
import { FaCalendarAlt, FaMapMarkerAlt } from "react-icons/fa";
import { db } from "../lib/firebase";
import { collection, getDocs } from "firebase/firestore";

export default function Home() {
  const [events, setEvents] = useState([]);
  const [venues, setVenues] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Events
        const eventSnapshot = await getDocs(collection(db, "events"));
        const eventList = eventSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Fetch Venues
        const venueSnapshot = await getDocs(collection(db, "venues"));
        const venueMap = {};
        venueSnapshot.docs.forEach((doc) => {
          venueMap[doc.id] = doc.data().name; // Assuming venue document has a "name" field
        });

        // Set States
        setVenues(venueMap);
        setEvents(eventList);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <Navbar />
      {/* Hero Section */}
      <section className="relative h-[80vh] flex flex-col justify-center items-center text-center px-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="absolute inset-0 bg-hero-pattern opacity-20"></div>
        <h2 className="text-lg font-semibold tracking-widest">EXPLORE EVENTS</h2>
        <h1 className="text-5xl font-bold mt-4">Unleash Your Potential</h1>
        <h1 className="text-5xl font-bold mt-1">Discover, Learn, and Connect</h1>
        <p className="text-lg mt-4 max-w-2xl">
          Join us for inspiring conferences, engaging workshops, and thrilling competitions.
        </p>
        <Link to="/events">
          <button className="mt-6 bg-white text-blue-600 px-6 py-3 rounded-full font-semibold text-lg shadow-md hover:bg-gray-200 transition duration-300">
            Explore Events
          </button>
        </Link>
      </section>

      {/* Featured Events */}
      <section className="px-8 py-16">
        <h2 className="text-3xl font-bold text-gray-800 text-center">Featured Events</h2>

        {events.length === 0 ? (
          <p className="text-center text-gray-600 mt-6 text-lg">
            No upcoming events at the moment. Stay tuned!
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
            {events.map((event) => (
              <div key={event.id} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition">
                <Link to={`/event/${event.id}`}>
                  <h3 className="text-xl font-semibold text-blue-600">{event.eventName}</h3>
                </Link>
                <p className="flex items-center text-gray-700 mt-2"><FaCalendarAlt className="mr-2" /> {event.date}</p>
                <p className="flex items-center text-gray-700 mt-1">
                  <FaMapMarkerAlt className="mr-2" /> {venues[event.venueId] || "Unknown Venue"}
                </p>
                <p className={`mt-2 font-semibold ${event.status === "Free" ? "text-green-600" : "text-blue-600"}`}>{event.eventType}</p>
              </div>
            ))}
          </div>
        )}
      </section>

    </div>
  );
}
