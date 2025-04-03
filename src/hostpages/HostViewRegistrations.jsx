import { useState, useEffect } from "react";
import { db } from "../lib/firebase";
import { collection, getDocs, query, where, doc, deleteDoc } from "firebase/firestore";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import { useAuth } from "../contexts/AuthContext"; // Ensure you have an Auth context
import * as XLSX from "xlsx";

const HostViewRegistrations = () => {
  const { currentUser } = useAuth(); // Get logged-in user
  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
    const [selectedEventName, setSelectedEventName] = useState("");
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (!currentUser) return; // Ensure user is logged in

    const fetchEvents = async () => {
      setLoading(true);
      try {
        // Query only events created by the current host
        const eventQuery = query(collection(db, "events"), where("hostId", "==", currentUser.uid));
        const eventSnapshot = await getDocs(eventQuery);
        const eventList = eventSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        for (const event of eventList) {
          const registrationsQuery = query(
            collection(db, "eventRegistrations"),
            where("eventId", "==", event.id)
          );
          const registrationsSnap = await getDocs(registrationsQuery);
          event.registrationCount = registrationsSnap.docs.length;
        }

        setEvents(eventList);
      } catch (err) {
        console.error("Error fetching events:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [currentUser]);

  const handleViewRegistrations = async (eventId, eventName) => {
    try {
      const registrationsQuery = query(
        collection(db, "eventRegistrations"),
        where("eventId", "==", eventId)
      );
      const registrationsSnap = await getDocs(registrationsQuery);

      const registrationList = registrationsSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setRegistrations(registrationList);
      setSelectedEvent(eventId);
      setSelectedEventName(eventName);
      setModalOpen(true);
    } catch (err) {
      console.error("Error fetching registrations:", err);
    }
  };

  const handleDeleteRegistration = async (registrationId) => {
    try {
      await deleteDoc(doc(db, "eventRegistrations", registrationId));
      setRegistrations(registrations.filter((reg) => reg.id !== registrationId));
    } catch (err) {
      console.error("Error deleting registration:", err);
    }
  };

  const handleDownload = () => {
      const worksheet = XLSX.utils.json_to_sheet(
        registrations.map(({ name, email, college, department, phone }) => ({
          Name: name,
          Email: email,
          College: college,
          Department: department,
          Phone: phone,
        }))
      );
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Registrations");
      XLSX.writeFile(workbook, `${selectedEventName}-registrations.xlsx`);
    };
  

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Event Registrations</h1>

      {loading ? (
        <p>Loading events...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-300 text-left text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border border-gray-300 p-3 w-1/4">Event Name</th>
                <th className="border border-gray-300 p-3 w-1/5">Date</th>
                <th className="border border-gray-300 p-3 w-1/6">Registrations</th>
                <th className="border border-gray-300 p-3 w-1/6">Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr key={event.id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 p-3">{event.eventName}</td>
                  <td className="border border-gray-300 p-3">{event.date}</td>
                  <td className="border border-gray-300 p-3">{event.registrationCount}</td>
                  <td className="border border-gray-300 p-3">
                    <Button
                      onClick={() => handleViewRegistrations(event.id, event.eventName)}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      View Registrations
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal for viewing registrations */}
      <Dialog open={modalOpen} onClose={() => setModalOpen(false)} maxWidth="lg" fullWidth>
        <DialogTitle>Registrations for {selectedEventName}
        <Button onClick={handleDownload} color="primary" style={{ float: "right" }}>
            Download
          </Button>
        </DialogTitle>
        <DialogContent>
          {registrations.length > 0 ? (
            <TableContainer component={Paper} className="max-h-96 overflow-y-auto">
              <Table>
                <TableHead className="bg-gray-100">
                  <TableRow>
                    <TableCell className="font-semibold w-1/5">Name</TableCell>
                    <TableCell className="font-semibold w-1/5">Email</TableCell>
                    <TableCell className="font-semibold w-1/5">College</TableCell>
                    <TableCell className="font-semibold w-1/5">Department</TableCell>
                    <TableCell className="font-semibold w-1/5">Phone</TableCell>
                    <TableCell className="font-semibold w-1/6">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {registrations.map((attendee) => (
                    <TableRow key={attendee.id} className="hover:bg-gray-50">
                      <TableCell className="p-3">{attendee.name}</TableCell>
                      <TableCell className="p-3">{attendee.email}</TableCell>
                      <TableCell className="p-3">{attendee.college}</TableCell>
                      <TableCell className="p-3">{attendee.department}</TableCell>
                      <TableCell className="p-3">{attendee.phone}</TableCell>
                      <TableCell className="p-3">
                        <Button onClick={() => handleDeleteRegistration(attendee.id)} color="secondary">
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <p>No registrations found</p>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModalOpen(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default HostViewRegistrations;
