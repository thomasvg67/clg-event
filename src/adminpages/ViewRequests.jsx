import { useState, useEffect } from "react";
import { db } from "../lib/firebase";
import {
  collection,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
  setDoc,
} from "firebase/firestore";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tabs,
  Tab,
} from "@mui/material";

const ViewRequests = () => {
  const [hostRequests, setHostRequests] = useState([]);
  const [eventRequests, setEventRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tabIndex, setTabIndex] = useState(0);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const hostReqSnap = await getDocs(collection(db, "hostRequests"));
        const eventReqSnap = await getDocs(collection(db, "eventRequests"));

        setHostRequests(hostReqSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        setEventRequests(eventReqSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      } catch (err) {
        console.error("Error fetching requests:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const handleApproveHost = async (request) => {
    try {
      const userRef = doc(db, "users", request.userId);
      await updateDoc(userRef, { role: "host" });

      await updateDoc(doc(db, "hostRequests", request.id), { status: "Approved" });

      setHostRequests(hostRequests.map((req) => 
        req.id === request.id ? { ...req, status: "Approved" } : req
      ));
    } catch (err) {
      console.error("Error approving host request:", err);
    }
  };

  const handleApproveEvent = async (request) => {
    try {
      await updateDoc(doc(db, "eventRequests", request.id), { status: "Approved" });

      setEventRequests(eventRequests.map((req) =>
        req.id === request.id ? { ...req, status: "Approved" } : req
      ));
    } catch (err) {
      console.error("Error approving event request:", err);
    }
  };

  const handleDeleteRequest = async (requestId, type) => {
    try {
      await deleteDoc(doc(db, type === "host" ? "hostRequests" : "eventRequests", requestId));

      if (type === "host") {
        setHostRequests(hostRequests.filter((req) => req.id !== requestId));
      } else {
        setEventRequests(eventRequests.filter((req) => req.id !== requestId));
      }
    } catch (err) {
      console.error("Error deleting request:", err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Requests Management</h1>
      <Tabs value={tabIndex} onChange={(e, newIndex) => setTabIndex(newIndex)}>
        <Tab label="Host Requests" />
        <Tab label="Event Requests" />
      </Tabs>

      {loading ? (
        <p>Loading requests...</p>
      ) : (
        <TableContainer component={Paper} className="mt-4">
          <Table>
            <TableHead className="bg-gray-100">
              <TableRow>
                <TableCell className="font-semibold">Name</TableCell>
                <TableCell className="font-semibold">Email</TableCell>
                <TableCell className="font-semibold">Status</TableCell>
                <TableCell className="font-semibold">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(tabIndex === 0 ? hostRequests : eventRequests).map((request) => (
                <TableRow key={request.id} className="hover:bg-gray-50">
                  <TableCell>{request.displayName}</TableCell>
                  <TableCell>{request.email}</TableCell>
                  <TableCell>{request.status}</TableCell>
                  <TableCell>
                    {request.status === "Pending" && (
                      <Button
                        onClick={() =>
                          tabIndex === 0 ? handleApproveHost(request) : handleApproveEvent(request)
                        }
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        Approve
                      </Button>
                    )}
                    <Button
                      onClick={() => handleDeleteRequest(request.id, tabIndex === 0 ? "host" : "event")}
                      color="secondary"
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
};

export default ViewRequests;
