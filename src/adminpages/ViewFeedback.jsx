import React, { useState, useEffect } from "react";
import { db } from "../lib/firebase";
import { collection, getDocs, query, where, doc, getDoc, deleteDoc } from "firebase/firestore";
import {  Button,  Dialog,  DialogActions,  DialogContent,  DialogTitle,  Typography,  CircularProgress,  Table,  TableBody,  TableCell,  TableContainer,  TableHead,  TableRow,  Paper,} from "@mui/material";
import * as XLSX from "xlsx";

const ViewFeedback = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedbacks, setFeedbacks] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedEventName, setSelectedEventName] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [feedbackLoading, setFeedbackLoading] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const eventsSnapshot = await getDocs(collection(db, "events"));
        const eventList = await Promise.all(
          eventsSnapshot.docs.map(async (doc) => {
            const eventData = { id: doc.id, ...doc.data() };
  
            // Get feedback count for the event
            const feedbackQuery = query(collection(db, "eventFeedback"), where("eventId", "==", doc.id));
            const feedbackSnap = await getDocs(feedbackQuery);
            eventData.feedbackCount = feedbackSnap.size; // Count of feedbacks
  
            return eventData;
          })
        );
  
        setEvents(eventList);
      } catch (err) {
        console.error("Error fetching events:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleViewFeedback = async (eventId) => {
    setFeedbackLoading(true);
    setSelectedEvent(eventId);
    setModalOpen(true);

    try {
      const eventDoc = await getDoc(doc(db, "events", eventId));
      setSelectedEventName(eventDoc.exists() ? eventDoc.data().eventName : "Event");
      
      const feedbackQuery = query(
        collection(db, "eventFeedback"),
        where("eventId", "==", eventId)
      );
      const feedbackSnap = await getDocs(feedbackQuery);
      
      const feedbackList = await Promise.all(
        feedbackSnap.docs.map(async (docSnap) => {
          const feedbackData = docSnap.data();
          let displayName = "Anonymous";
          let email = "Not provided";
          
          if (feedbackData.userId) {
            try {
              const userDoc = await getDoc(doc(db, "users", feedbackData.userId));
              if (userDoc.exists()) {
                displayName = userDoc.data().displayName || "Anonymous";
                email = userDoc.data().email || "Not provided";
              }
            } catch (error) {
              console.error("Error fetching user display name:", error);
            }
          }
          
          return {
            id: docSnap.id,
            ...feedbackData,
            name: displayName,
            email,
          };
        })
      );
      
      setFeedbacks(feedbackList);
    } catch (err) {
      console.error("Error fetching feedback:", err);
    } finally {
      setFeedbackLoading(false);
    }
  };

  const handleDeleteFeedback = async (feedbackId) => {
    try {
      await deleteDoc(doc(db, "eventFeedback", feedbackId));
      setFeedbacks(feedbacks.filter((feedback) => feedback.id !== feedbackId));
    } catch (err) {
      console.error("Error deleting feedback:", err);
    }
  };

  const handleDownloadFeedback = () => {
    const feedbackData = feedbacks.map(({ name, email, feedback, rating }) => ({
      Name: name,
      Email: email,
      Feedback: feedback || "No comment provided",
      Rating: rating ? `${rating} / 5` : "N/A",
    }));
  
    const worksheet = XLSX.utils.json_to_sheet(feedbackData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Feedback");
    XLSX.writeFile(workbook, `Feedback_${selectedEventName}.xlsx`);
  };
  

  return (
    <div className="p-6">
      <Typography variant="h4" className="mb-4 font-bold">
        View Feedback
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-300 text-left text-sm">
          <thead className="bg-gray-100">
  <tr>
    <th className="border border-gray-300 p-3 w-1/3">Event Name</th>
    <th className="border border-gray-300 p-3 w-1/6">Feedbacks</th> {/* New Column */}
    <th className="border border-gray-300 p-3 w-1/3">Actions</th>
  </tr>
</thead>
<tbody>
  {events.map((event) => (
    <tr key={event.id} className="hover:bg-gray-50">
      <td className="border border-gray-300 p-3">{event.eventName}</td>
      <td className="border border-gray-300 p-3 text-center">{event.feedbackCount}</td> {/* Display Feedback Count */}
      <td className="border border-gray-300 p-3">
        <Button
          onClick={() => handleViewFeedback(event.id)}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          View Feedback
        </Button>
      </td>
    </tr>
  ))}
</tbody>
          </table>
        </div>
      )}

      {/* Feedback Modal */}
      <Dialog open={modalOpen} onClose={() => setModalOpen(false)} maxWidth="lg" fullWidth>
        <DialogTitle className="bg-gray-200 flex justify-between">
          <span>Feedback for {selectedEventName}</span>
          <Button onClick={handleDownloadFeedback} className="bg-green-600 hover:bg-green-700 text-white">
            Download
          </Button>
        </DialogTitle>
        <DialogContent className="p-4">
          {feedbackLoading ? (
            <CircularProgress />
          ) : feedbacks.length > 0 ? (
            <TableContainer component={Paper} className="max-h-96 overflow-y-auto">
              <Table>
                <TableHead className="bg-gray-100">
                  <TableRow>
                    <TableCell className="font-semibold w-1/5">Name</TableCell>
                    <TableCell className="font-semibold w-1/5">Email</TableCell>
                    <TableCell className="font-semibold w-2/5">Feedback</TableCell>
                    <TableCell className="font-semibold w-1/5">Rating</TableCell>
                    <TableCell className="font-semibold w-1/5">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {feedbacks.map((feedback) => (
                    <TableRow key={feedback.id} className="hover:bg-gray-50">
                      <TableCell className="p-3">{feedback.name}</TableCell>
                      <TableCell className="p-3">{feedback.email}</TableCell>
                      <TableCell className="p-3">{feedback.feedback || "No comment provided"}</TableCell>
                      <TableCell className="p-3">{feedback.rating ? `${feedback.rating} / 5` : "N/A"}</TableCell>
                      <TableCell className="p-3">
                        <Button color="error" onClick={() => handleDeleteFeedback(feedback.id)}>
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography>No feedback available.</Typography>
          )}
        </DialogContent>
        <DialogActions className="bg-gray-100">
          <Button onClick={() => setModalOpen(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ViewFeedback;
