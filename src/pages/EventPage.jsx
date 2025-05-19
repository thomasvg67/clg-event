import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { X, Star } from "lucide-react";
import Navbar from "../components/Navbar";
import { db } from "../lib/firebase";
import { doc, getDoc, collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { useAuth } from "../contexts/AuthContext";
import QRCode from "react-qr-code";
import {
  FaMapMarkerAlt, FaLocationArrow, FaCalendarAlt, FaClock, FaAlignLeft, FaCheckCircle, FaBan,
  FaTicketAlt, FaUser, FaUniversity, FaBook, FaEnvelope, FaPhone, FaRocket, FaRegSmileBeam,
  FaHourglassHalf, FaCommentDots,
} from "react-icons/fa";
import { toast } from "react-toastify";

export default function EventPage() {
  const { eventId } = useParams();
  const { currentUser } = useAuth();
  const [event, setEvent] = useState(null);
  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState(0);
  const [attended, setAttended] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    college: "",
    department: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const eventRef = doc(db, "events", eventId);
        const eventSnap = await getDoc(eventRef);
        if (eventSnap.exists()) {
          const eventData = eventSnap.data();
          setEvent(eventData);

          // Fetch venue details if venueId exists
          if (eventData.venueId) {
            const venueRef = doc(db, "venues", eventData.venueId);
            const venueSnap = await getDoc(venueRef);
            if (venueSnap.exists()) {
              setVenue(venueSnap.data());
            }
          }
        } else {
          console.error("Event not found!");
        }
      } catch (error) {
        console.error("Error fetching event details:", error);
      } finally {
        setLoading(false);
      }
    };

    const checkRegistration = async () => {
      if (!currentUser) return;

      const registrationQuery = query(
        collection(db, "eventRegistrations"),
        where("userId", "==", currentUser.uid),
        where("eventId", "==", eventId)
      );

      const registrationSnap = await getDocs(registrationQuery);

      if (!registrationSnap.empty) {
        setIsRegistered(true);

        // Check if any registration has status === "present"
        const hasAttended = registrationSnap.docs.some(doc => doc.data().status === "present");
        setAttended(hasAttended);
      }
    };

    fetchEvent();
    checkRegistration();
  }, [eventId, currentUser]);

  useEffect(() => {
    if (!event) return;

    const eventStartTime = new Date(`${event.date}T${event.startTime}`).getTime();
    const eventEndTime = new Date(`${event.date}T${event.endTime}`).getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();

      if (now >= eventEndTime) {
        setTimeRemaining(
          <span><FaRocket className="inline text-gray-600 mr-1" /> Event has ended!</span>
        );
        return;
      } else if (now >= eventStartTime) {
        setTimeRemaining(
          <span><FaRegSmileBeam className="inline text-green-600 mr-1" /> Event has started!</span>
        );
        return;
      }

      const timeLeft = eventStartTime - now;
      const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

      setTimeRemaining(
        <span>
          <FaHourglassHalf className="inline text-yellow-600 mr-1" />
          Event starts in: {days}d {hours}h {minutes}m {seconds}s
        </span>
      );

    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);

    return () => clearInterval(timer);
  }, [event]);

  const hasEventStarted = () => {
    if (!event) return false;
    const eventStartTime = new Date(`${event.date}T${event.startTime}`);
    return new Date() >= eventStartTime;
  };


  const hasEventEnded = () => {
    if (!event) return false;
    const eventEndTime = new Date(`${event.date}T${event.endTime}`);
    return new Date() > eventEndTime;
  };

  if (loading) return <div className="text-center text-lg mt-10">Loading event details...</div>;
  if (!event) return <div className="text-center text-lg mt-10 text-red-500">Event not found!</div>;


  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) return toast.error("Please log in to submit feedback.");

    const feedbackQuery = query(
      collection(db, "eventFeedback"),
      where("userId", "==", currentUser.uid),
      where("eventId", "==", eventId)
    );
    const feedbackSnap = await getDocs(feedbackQuery);
    if (!feedbackSnap.empty) {
      return toast.error("You've already submitted feedback for this event.");
    }

    try {
      await addDoc(collection(db, "eventFeedback"), {
        userId: currentUser.uid,
        eventId,
        feedback,
        rating,
        submittedAt: new Date(),
      });
      toast.success("Feedback submitted successfully!");
      setShowFeedbackModal(false);
      setFeedback("");
      setRating(0);
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast.error("Feedback submission failed. Try again.");
    }
  };


  const handleRegisterClick = async () => {
    if (!currentUser) {
      toast.error("Please log in to register for this event.");
      return;
    }

    try {
      // Fetch user data from Firestore if available
      const userRef = doc(db, "users", currentUser.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();
        setFormData({
          name: userData.displayName || "",
          college: userData.college || "",
          department: userData.department || "",
          email: userData.email || currentUser.email || "",
          phone: userData.phone || "",
        });
      } else {
        // Use whatever is available from auth
        setFormData({
          name: "",
          college: "",
          department: "",
          email: currentUser.email || "",
          phone: "",
        });
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    }

    setShowModal(true);
  };


  const handleCloseModal = () => setShowModal(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      toast.error("You must be logged in to register for this event.");
      return;
    }

    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(formData.phone)) {
      toast.error("Enter a valid 10-digit phone number starting with 6-9.");
      return;
    }

    try {
      await addDoc(collection(db, "eventRegistrations"), {
        userId: currentUser.uid,
        eventId: eventId,
        ...formData,
        registeredAt: new Date(),
      });
      setIsRegistered(true);
      setShowModal(false);
      toast.success("Registration Successful!");
    } catch (error) {
      console.error("Error registering for event:", error);
      toast.error("Registration failed. Please try again.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="pt-24 p-6 bg-gray-100 min-h-screen flex justify-center">
        <div className="max-w-2xl w-full bg-white p-8 rounded-lg shadow-lg border">
          {/* Event Details */}
          <h2 className="text-3xl font-bold text-gray-800 text-center">{event.eventName}</h2>
          <p className="text-gray-500 text-center mt-1">{event.eventType} | {event.isPaid ? "Paid Event" : "Free Event"}</p>

          <div className="mt-4 space-y-2 text-gray-700">
            <p><strong><FaMapMarkerAlt className="inline mr-1" /> Venue:</strong> {venue ? venue.name : "Loading..."}</p>
            {venue && (
              <p><strong><FaLocationArrow className="inline mr-1" /> Location:</strong> {venue.location}</p>
            )}
            <p><strong><FaCalendarAlt className="inline mr-1" /> Date:</strong> {event.date}</p>
            <p><strong><FaClock className="inline mr-1" /> Time:</strong> {event.startTime} - {event.endTime}</p>
            <p><strong><FaAlignLeft className="inline mr-1" /> Description:</strong> {event.description}</p>
          </div>


          <div className="text-center text-xl font-semibold text-red-600 mt-4">
            {timeRemaining && <p>{timeRemaining}</p>}
          </div>

          {/* Register Button */}
          <div className="mt-6 text-center">
            <button
              className={`w-full py-3 rounded-lg text-lg font-semibold transition-all ${isRegistered || hasEventStarted()
                ? "bg-gray-400 text-white cursor-not-allowed"
                : "bg-indigo-600 text-white hover:bg-indigo-700"
                }`}
              onClick={!hasEventStarted() ? handleRegisterClick : undefined}
              disabled={isRegistered || hasEventStarted()}
            >
              {isRegistered ? (
                <span><FaCheckCircle className="inline text-green-600 mr-1" /> Registered</span>
              ) : hasEventStarted() ? (
                <span><FaBan className="inline text-red-600 mr-1" /> Registration Closed</span>
              ) : (
                <span><FaTicketAlt className="inline text-blue-600 mr-1" /> Register Now</span>
              )}            </button>
          </div>
          {isRegistered && !hasEventEnded() && (() => {
            const eventStartTime = new Date(`${event.date}T${event.startTime}`).getTime();
            const now = new Date().getTime();
            const oneHourBeforeEvent = eventStartTime - 60 * 60 * 1000; // 1 hour before event

            if (now >= oneHourBeforeEvent) {
              return (
                <div className="h-64 w-64 mx-auto mt-10">
                  <QRCode
                    size={256}
                    style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                    value={`${currentUser.uid}|${eventId}`}
                    viewBox={`0 0 256 256`}
                  />

                </div>
              );
            }

            return <p className="text-center mt-4 text-gray-500">Your QR Code will be available 1 hour before the event starts.</p>;
          })()}
          {/* Feedback Button (only after event ends) */}
          {hasEventEnded() && attended && (
            <div className="mt-6 text-center">
              <button
                className="w-full py-3 rounded-lg bg-green-600 text-white hover:bg-green-700 text-lg font-semibold flex items-center justify-center gap-2"
                onClick={() => setShowFeedbackModal(true)}
              >
                <FaCommentDots className="text-xl" />
                Give Feedback
              </button>

            </div>
          )}
        </div>
      </div>

      {/* Registration Modal */}
      {showModal && (
        <div className="fixed inset-0 backdrop-blur-sm flex justify-center items-center p-4">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative animate-fadeIn">
            <button className="absolute top-2 right-2 p-2" onClick={handleCloseModal}>
              <X className="text-gray-600 hover:text-red-500" />
            </button>
            <h2 className="text-lg font-bold mb-4 text-center">
              <FaTicketAlt className="inline mr-2 text-indigo-600" />
              Event Registration
            </h2>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="space-y-4">
                <div className="flex items-center border rounded-lg p-3">
                  <FaUser className=" mr-3" />
                  <input type="text" name="name" placeholder="Student Name" value={formData.name} onChange={handleChange} required className="w-full outline-none" />
                </div>

                <div className="flex items-center border rounded-lg p-3">
                  <FaUniversity className=" mr-3" />
                  <input type="text" name="college" placeholder="College Name" value={formData.college} onChange={handleChange} required className="w-full outline-none" />
                </div>

                <div className="flex items-center border rounded-lg p-3">
                  <FaBook className=" mr-3" />
                  <select name="department" value={formData.department} onChange={handleChange} required className="w-full outline-none">
                    <option value="">Select Department</option>
                    <option value="B.Tech Computer Science">B.Tech Computer Science</option>
                    <option value="B.Tech Electronics">B.Tech Electronics</option>
                    <option value="MCA">MCA</option>
                    <option value="MBA">MBA</option>
                    {/* Add more departments as needed */}
                  </select>
                </div>

                <div className="flex items-center border rounded-lg p-3">
                  <FaEnvelope className=" mr-3" />
                  <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} readOnly required className="w-full outline-none" />
                </div>

                <div className="flex items-center border rounded-lg p-3">
                  <FaPhone className=" mr-3" />
                  <input type="tel" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} required className="w-full outline-none" />
                </div>
              </div>

              <button type="submit" className="w-full bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700 transition-all">
                Register
              </button>
            </form>
          </div>
        </div>
      )}


      {/* Feedback Modal */}
      {showFeedbackModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative animate-fadeIn">
            <button className="absolute top-2 right-2 p-2" onClick={() => setShowFeedbackModal(false)}>
              <X className="text-gray-600 hover:text-red-500" />
            </button>
            <h2 className="text-lg font-bold mb-4 text-center flex items-center justify-center gap-2">
              <FaCommentDots className="text-indigo-600 text-xl" /> Submit Feedback</h2>
            <form onSubmit={handleFeedbackSubmit} className="space-y-3">
              <textarea
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500"
                placeholder="Share your feedback..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                required
              ></textarea>
              <div className="flex justify-center space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={30}
                    className={`cursor-pointer ${rating >= star ? "text-yellow-500" : "text-gray-400"}`}
                    onClick={() => setRating(star)}
                  />
                ))}
              </div>
              <button type="submit" className="w-full bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 transition-all">
                Submit Feedback
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
