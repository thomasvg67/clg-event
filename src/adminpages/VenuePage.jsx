import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../lib/firebase";
import { collection, getDocs, addDoc, deleteDoc, updateDoc, doc } from "firebase/firestore";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography, Divider, TextField } from "@mui/material";

const VenuePage = () => {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editVenue, setEditVenue] = useState(null);
  const [addVenueModalOpen, setAddVenueModalOpen] = useState(false); // State for Add Venue Modal
  const [viewVenueModalOpen, setViewVenueModalOpen] = useState(false); // State for View Venue Modal
  const [venueDetails, setVenueDetails] = useState({
    name: "",
    location: "",
    capacity: "",
    roomNo: "",
    details: "",
  });
  const [isEditMode, setIsEditMode] = useState(false); // Track if in edit mode
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const venueSnapshot = await getDocs(collection(db, "venues"));
        const venueList = venueSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setVenues(venueList);
      } catch (err) {
        setError("Error fetching venues: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVenues();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "venues", id));
      setVenues(venues.filter((venue) => venue.id !== id));
    } catch (err) {
      setError("Error deleting venue: " + err.message);
    }
  };

  const handleEdit = (venue) => {
    setEditVenue(venue);
    setVenueDetails(venue);
    setIsEditMode(true);
    setAddVenueModalOpen(true);
  };

  const handleView = (venue) => {
    setVenueDetails(venue);
    setViewVenueModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setVenueDetails({ ...venueDetails, [name]: value });
  };

  const handleSave = async () => {
    if (isEditMode) {
      try {
        const venueRef = doc(db, "venues", editVenue.id);
        await updateDoc(venueRef, venueDetails);
        setVenues(venues.map((venue) =>
          venue.id === editVenue.id ? { ...venue, ...venueDetails } : venue
        ));
        setIsEditMode(false);
        setAddVenueModalOpen(false);
      } catch (err) {
        setError("Error updating venue: " + err.message);
      }
    } else {
      // Create new venue
      try {
        const venueRef = await addDoc(collection(db, "venues"), {
          name: venueDetails.name,
          location: venueDetails.location,
          capacity: venueDetails.capacity,
          roomNo: venueDetails.roomNo,
          details: venueDetails.details,
          createdAt: new Date(),
        });
        setVenues([
          ...venues,
          { id: venueRef.id, ...venueDetails }
        ]);
        setAddVenueModalOpen(false);
        setVenueDetails({ name: "", location: "", capacity: "", roomNo: "", details: "" });
      } catch (err) {
        setError("Error creating venue: " + err.message);
      }
    }
  };

  const handleAddVenueClick = () => {
    // Reset form for adding a new venue (clear the details)
    setIsEditMode(false);
    setVenueDetails({
      name: "",
      location: "",
      capacity: "",
      roomNo: "",
      details: "",
    });
    setAddVenueModalOpen(true);
  };
  

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Venues</h1>
      <Button onClick={handleAddVenueClick} className="mb-4">
        Add Venue
      </Button>

      {loading && <p>Loading venues...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <table className="w-full border-collapse border border-gray-300 mt-4">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 p-2">Name</th>
            <th className="border border-gray-300 p-2">Location</th>
            <th className="border border-gray-300 p-2">Capacity</th>
            <th className="border border-gray-300 p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {venues.map((venue) => (
            <tr key={venue.id} className="hover:bg-gray-50">
              <td className="border border-gray-300 p-2">{venue.name}</td>
              <td className="border border-gray-300 p-2">{venue.location}</td>
              <td className="border border-gray-300 p-2">{venue.capacity}</td>
              <td className="border border-gray-300 p-2">
                <Button
                  onClick={() => handleEdit(venue)}
                  className="bg-blue-600 hover:bg-blue-700 mr-2"
                >
                  Edit
                </Button>
                <Button
                  onClick={() => handleDelete(venue.id)}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Delete
                </Button>
                <Button
                  onClick={() => handleView(venue)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  View
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Floating Modal for Add/Edit Venue */}
      <Dialog open={addVenueModalOpen} onClose={() => setAddVenueModalOpen(false)} aria-labelledby="add-venue-dialog">
        <DialogTitle>{isEditMode ? "Edit Venue" : "Add Venue"}</DialogTitle>
        <DialogContent>
          <TextField
            label="Venue Name"
            name="name"
            value={venueDetails.name}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Location"
            name="location"
            value={venueDetails.location}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Capacity"
            name="capacity"
            value={venueDetails.capacity}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Room No"
            name="roomNo"
            value={venueDetails.roomNo}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Details"
            name="details"
            value={venueDetails.details}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddVenueModalOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Floating Modal for View Venue */}
      <Dialog open={viewVenueModalOpen} onClose={() => setViewVenueModalOpen(false)} aria-labelledby="view-venue-dialog">
        <DialogTitle>View Venue</DialogTitle>
        <DialogContent>
          <Typography variant="h6">{venueDetails.name}</Typography>
          <Divider sx={{ my: 2 }} />
          <Typography><strong>Location:</strong> {venueDetails.location}</Typography>
          <Typography><strong>Capacity:</strong> {venueDetails.capacity}</Typography>
          <Typography><strong>Room No:</strong> {venueDetails.roomNo}</Typography>
          <Typography><strong>Details:</strong> {venueDetails.details}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewVenueModalOpen(false)} color="secondary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default VenuePage;
