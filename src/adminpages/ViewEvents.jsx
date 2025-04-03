import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../lib/firebase";
import { collection, getDocs, addDoc, deleteDoc, updateDoc, doc } from "firebase/firestore";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, FormControl, InputLabel, Select, MenuItem, Typography, Divider } from "@mui/material";

const ViewEvents = () => {
  const [events, setEvents] = useState([]);
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addEventModalOpen, setAddEventModalOpen] = useState(false);
  const [viewEventModalOpen, setViewEventModalOpen] = useState(false);
  const [editEvent, setEditEvent] = useState(null);
  const [eventDetailsView, setEventDetailsView] = useState(null);
  const [eventDetails, setEventDetails] = useState({
    eventName: "",
    date: "",
    startTime: "",
    endTime: "",
    eventType: "",
    customEventType: "",
    venueId: "",
    description: "",
    registrationLimit: "",
  });
  const navigate = useNavigate();

  // Fetch Events and Venues Together
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch Events
        const eventSnapshot = await getDocs(collection(db, "events"));
        const eventList = eventSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setEvents(eventList);

        // Fetch Venues
        const venueSnapshot = await getDocs(collection(db, "venues"));
        const venueList = venueSnapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name, // Ensure 'name' exists in Firestore
          capacity: doc.data().capacity,
        }));
        setVenues(venueList);
      } catch (err) {
        setError("Error fetching data: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEventDetails({ ...eventDetails, [name]: value });
  };

  const handleAddEventClick = () => {
    setEditEvent(null);
    setEventDetails({
      eventName: "",
      date: "",
      startTime: "",
      endTime: "",
      eventType: "",
      customEventType: "",
      venueId: "",
      description: "",
      registrationLimit: ""
    });
    setAddEventModalOpen(true);
  };

  const handleEdit = (event) => {
    setEditEvent(event);
    setEventDetails(event);
    setAddEventModalOpen(true);
  };

  const handleViewEvent = (event) => {
    setEventDetailsView(event);
    setViewEventModalOpen(true);
  };


  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "events", id));
      setEvents(events.filter((event) => event.id !== id));
    } catch (err) {
      setError("Error deleting event: " + err.message);
    }
  };

  const handleSave = async () => {
    if (!eventDetails.eventName || !eventDetails.date || !eventDetails.startTime || !eventDetails.endTime || !eventDetails.venueId) {
      setError("Please fill all required fields.");
      return;
    }

    try {
      let isConflict = false;

      let finalEventType = eventDetails.eventType === "Custom" ? eventDetails.customEventType : eventDetails.eventType;

      const eventData = {
        ...eventDetails,
        eventType: finalEventType,
        createdAt: new Date(),
      };

      if (!editEvent || (editEvent.date !== eventDetails.date || editEvent.startTime !== eventDetails.startTime || editEvent.endTime !== eventDetails.endTime || editEvent.venueId !== eventDetails.venueId)) {
        // Fetch existing events on the same date and venue
        const eventSnapshot = await getDocs(collection(db, "events"));
        const existingEvents = eventSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Convert times to comparable values
        const newStartTime = new Date(`1970-01-01T${eventDetails.startTime}:00`);
        const newEndTime = new Date(`1970-01-01T${eventDetails.endTime}:00`);

        // Check for time conflicts
        isConflict = existingEvents.some(event => {
          if (event.id !== (editEvent?.id || "") && event.date === eventDetails.date && event.venueId === eventDetails.venueId) {
            const existingStartTime = new Date(`1970-01-01T${event.startTime}:00`);
            const existingEndTime = new Date(`1970-01-01T${event.endTime}:00`);

            return (
              (newStartTime >= existingStartTime && newStartTime < existingEndTime) || // New start time is within an existing event
              (newEndTime > existingStartTime && newEndTime <= existingEndTime) || // New end time is within an existing event
              (newStartTime <= existingStartTime && newEndTime >= existingEndTime) // New event fully overlaps an existing one
            );
          }
          return false;
        });
      }

      if (isConflict) {
        setError("An event is already scheduled at this venue within the selected time range.");
        return;
      }

      if (editEvent) {
        // Update existing event
        const eventRef = doc(db, "events", editEvent.id);
        await updateDoc(eventRef, eventDetails);
        setEvents(events.map(event => (event.id === editEvent.id ? { ...event, ...eventDetails } : event)));
      } else {
        // Create new event
        const eventRef = await addDoc(collection(db, "events"), {
          ...eventDetails,
          createdAt: new Date(),
        });
        setEvents([...events, { id: eventRef.id, ...eventDetails }]);
      }

      setAddEventModalOpen(false);
      setError(null);
    } catch (err) {
      setError("Error saving event: " + err.message);
    }
  };



  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Events</h1>
      <Button onClick={handleAddEventClick} className="mb-4">
        Create Event
      </Button>

      {loading && <p>Loading events...</p>}

      <table className="w-full border-collapse border border-gray-300 mt-4">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 p-2">Event Name</th>
            <th className="border border-gray-300 p-2">Date</th>
            <th className="border border-gray-300 p-2">Start Time</th>
            <th className="border border-gray-300 p-2">End Time</th>
            <th className="border border-gray-300 p-2">Venue</th>
            <th className="border border-gray-300 p-2">Event Type</th>
            <th className="border border-gray-300 p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event) => (
            <tr key={event.id} className="hover:bg-gray-50">
              <td className="border border-gray-300 p-2">{event.eventName}</td>
              <td className="border border-gray-300 p-2">{event.date}</td>
              <td className="border border-gray-300 p-2">{event.startTime}</td>
              <td className="border border-gray-300 p-2">{event.endTime}</td>
              <td className="border border-gray-300 p-2">
                {venues.find((venue) => venue.id === event.venueId)?.name || "Unknown"}
              </td>
              <td className="border border-gray-300 p-2">{event.eventType}</td>
              <td className="border border-gray-300 p-2">
                <Button onClick={() => handleEdit(event)} className="bg-blue-600 hover:bg-blue-700 mr-2">
                  Edit
                </Button>
                <Button onClick={() => handleDelete(event.id)} className="bg-red-600 hover:bg-red-700">
                  Delete
                </Button>
                <Button onClick={() => handleViewEvent(event)} className="bg-green-600 hover:bg-green-700">
                  View
                </Button>

              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Floating Modal for Add/Edit Event */}
      <Dialog open={addEventModalOpen} onClose={() => setAddEventModalOpen(false)}>
        <DialogTitle>{editEvent ? "Edit Event" : "Add Event"}</DialogTitle>
        <DialogContent>
          {error && (
            <p className="text-red-500 text-sm mb-2">{error}</p>
          )}
          <TextField label="Event Name" name="eventName" value={eventDetails.eventName} onChange={handleInputChange} fullWidth margin="normal" />
          <TextField label="Date" name="date" type="date" value={eventDetails.date} onChange={handleInputChange} fullWidth margin="normal" InputProps={{ inputProps: { min: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split("T")[0] } }} />
          <TextField label="Start Time" name="startTime" type="time" value={eventDetails.startTime} onChange={handleInputChange} fullWidth margin="normal" />
          <TextField label="End Time" name="endTime" type="time" value={eventDetails.endTime} onChange={handleInputChange} fullWidth margin="normal" />
          {/* Event Type Selection */}
          <FormControl fullWidth margin="normal">
            <InputLabel>Event Type</InputLabel>
            <Select name="eventType" value={eventDetails.eventType} onChange={handleInputChange}>
              <MenuItem value="Technical">Technical</MenuItem>
              <MenuItem value="Non-Technical">Non-Technical</MenuItem>
              <MenuItem value="Sports">Sports</MenuItem>
              <MenuItem value="Custom">Other (Enter Below)</MenuItem>
            </Select>
          </FormControl>
          {eventDetails.eventType === "Custom" && (
            <TextField label="Custom Event Type" name="customEventType" value={eventDetails.customEventType} onChange={handleInputChange} fullWidth margin="normal" />
          )}
          
          {/* Venue Selection Dropdown */}
          <FormControl fullWidth margin="normal">
            <InputLabel>Select Venue</InputLabel>
            <Select
              name="venueId"
              value={eventDetails.venueId}
              onChange={handleInputChange}
            >
              {venues.map((venue) => (
                <MenuItem key={venue.id} value={venue.id}>
                  {venue.name} ({venue.capacity} seats)
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField label="Description" name="description" multiline rows={3} value={eventDetails.description} onChange={handleInputChange} fullWidth margin="normal" />
          <TextField label="Registration Limit" name="registrationLimit" type="number" value={eventDetails.registrationLimit} onChange={handleInputChange} fullWidth margin="normal" />

        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddEventModalOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={viewEventModalOpen} onClose={() => setViewEventModalOpen(false)} aria-labelledby="view-event-dialog">
        <DialogTitle>View Event</DialogTitle>
        <DialogContent>
          {eventDetailsView && (
            <>
              <Typography variant="h6">{eventDetailsView.eventName}</Typography>
              <Divider sx={{ my: 2 }} />
              <Typography><strong>Date:</strong> {eventDetailsView.date}</Typography>
              <Typography><strong>Start Time:</strong> {eventDetailsView.startTime}</Typography>
              <Typography><strong>End Time:</strong> {eventDetailsView.endTime}</Typography>
              <Typography><strong>Venue:</strong> {venues.find(venue => venue.id === eventDetailsView.venueId)?.name || "Unknown"}</Typography>
              <Typography><strong>Event Type:</strong> {eventDetailsView.eventType}</Typography>
              <Typography><strong>Fee:</strong> {eventDetailsView.feeAmount}</Typography>
              <Typography><strong>Description:</strong> {eventDetailsView.description}</Typography>
              <Typography><strong>Reg Limit:</strong> {eventDetailsView.registrationLimit}</Typography>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewEventModalOpen(false)} color="secondary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ViewEvents;
