import React, { useState, useEffect } from "react";
import { db } from "../lib/firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, doc, updateDoc, query, where, serverTimestamp } from "firebase/firestore";
import { Scanner } from "@yudiel/react-qr-scanner";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, } from "@mui/material";
import * as XLSX from "xlsx";

const HostAttendance = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [scannerOpen, setScannerOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [registeredUsers, setRegisteredUsers] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (loggedUser) => {
      if (loggedUser) {
        setUser(loggedUser);
        fetchHostEvents(loggedUser.uid);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchHostEvents = async (hostId) => {
    try {
      const eventQuery = query(collection(db, "events"), where("hostId", "==", hostId));
      const eventSnapshot = await getDocs(eventQuery);
      const eventList = eventSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

      const eventPromises = eventList.map(async (event) => {
        const registrationsQuery = query(
          collection(db, "eventRegistrations"),
          where("eventId", "==", event.id),
          where("status", "==", "present")
        );
        const registrationsSnap = await getDocs(registrationsQuery);
        return { ...event, attendanceCount: registrationsSnap.docs.length };
      });

      setEvents(await Promise.all(eventPromises));
    } catch (err) {
      console.error("Error fetching events:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewAttendance = async (event) => {
    setSelectedEvent(event);
    setDialogOpen(true);
    try {
      const q = query(
        collection(db, "eventRegistrations"),
        where("eventId", "==", event.id),
        where("status", "==", "present")
      );
      const querySnapshot = await getDocs(q);
      setRegisteredUsers(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    } catch (err) {
      console.error("Error fetching attendance:", err);
    }
  };

  const handleScan = async (data) => {
    if (!data || !selectedEvent) return;
    try {
      const [userId, scannedEventId] = data.split("|");

      if (scannedEventId !== selectedEvent.id) {
        alert("This QR code is not for the selected event.");
        return;
      }

      const q = query(
        collection(db, "eventRegistrations"),
        where("userId", "==", userId),
        where("eventId", "==", selectedEvent.id)
      );
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        alert("No registration found for this user.");
        return;
      }

      const registrationDoc = querySnapshot.docs[0];
      const registrationData = registrationDoc.data();
  
      if (registrationData.status === "present") {
        alert("Sorry, attendance already marked.");
        return;
      }
  
      await updateDoc(doc(db, "eventRegistrations", registrationDoc.id), {
        status: "present",
        statusAt: serverTimestamp(),
      });

      alert("Attendance marked successfully.");
      await handleViewAttendance(selectedEvent);
    } catch (error) {
      console.error("Error scanning QR code:", error);
      alert("Error marking attendance. Try again.");
    }
  };

  const handleDownload = () => {
    if (registeredUsers.length === 0) return;

    const data = registeredUsers.map((user) => ({
      Name: user.name || "Unknown",
      Email: user.email || "N/A",
      College: user.college || "N/A",
      Department: user.department || "N/A",
      Phone: user.phone || "N/A",
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance");
    XLSX.writeFile(workbook, `Attendance_${selectedEvent?.eventName}.xlsx`);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">My Event Attendance</h1>
      {loading ? (
        <p>Loading events...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-300 text-left text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border border-gray-300 p-3">Event Name</th>
                <th className="border border-gray-300 p-3">Date</th>
                <th className="border border-gray-300 p-3">Attendance</th>
                <th className="border border-gray-300 p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr key={event.id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 p-3">{event.eventName}</td>
                  <td className="border border-gray-300 p-3">{event.date}</td>
                  <td className="border border-gray-300 p-3">{event.attendanceCount}</td>
                  <td className="border border-gray-300 p-3">
                    <Button onClick={() => handleViewAttendance(event)} color="primary">
                      View Attendance
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {/* <div className="relative h-64 w-64">
        <div className="mt-6 text-center">
          <h2 className="text-lg font-bold mb-2">Scan QR Code</h2>
          <div className="flex justify-center">
            <Scanner onScan={(result) => handleScan(result[0].rawValue)} />
          </div>
        </div>
      </div> */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="lg" fullWidth>
        <DialogTitle>
          Attendance for {selectedEvent?.eventName}
          <div style={{ float: "right" }}>
            <Button
              onClick={() => setScannerOpen(!scannerOpen)}
              color="primary"
              variant="contained"
              style={{ marginRight: 8 }}
            >
              {scannerOpen ? "Hide Scanner" : "Mark Attendance"}
            </Button>
            <Button onClick={handleDownload} color="secondary" variant="outlined">
              Download
            </Button>
          </div>
        </DialogTitle>
        <DialogContent>
          {registeredUsers.length > 0 ? (
            <TableContainer component={Paper} className="max-h-96 overflow-y-auto">
              <Table>
                <TableHead className="bg-gray-100">
                  <TableRow>
                    <TableCell className="font-semibold">Name</TableCell>
                    <TableCell className="font-semibold">Email</TableCell>
                    <TableCell className="font-semibold">College</TableCell>
                    <TableCell className="font-semibold">Department</TableCell>
                    <TableCell className="font-semibold">Phone</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {registeredUsers.map((user) => (
                    <TableRow key={user.id} className="hover:bg-gray-50">
                      <TableCell>{user.name || "Unknown"}</TableCell>
                      <TableCell>{user.email || "N/A"}</TableCell>
                      <TableCell>{user.college || "N/A"}</TableCell>
                      <TableCell>{user.department || "N/A"}</TableCell>
                      <TableCell>{user.phone || "N/A"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <p>No users marked present for this event.</p>
          )}
          {scannerOpen && (
            <div className="mt-6 text-center">
              <h2 className="text-lg font-bold mb-2">Scan QR Code</h2>
              <div className="flex justify-center">
                <div className="w-64 h-64 border rounded overflow-hidden">
                  <Scanner
                    onScan={(result) => {
                      if (result && result.length > 0) {
                        handleScan(result[0].rawValue);
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          )}

        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default HostAttendance;