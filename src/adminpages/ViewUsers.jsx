import { useState, useEffect } from "react";
import { db } from "../lib/firebase";
import { collection, getDocs, deleteDoc, doc, query, where } from "firebase/firestore";
import { Button, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Select, FormControl, InputLabel } from "@mui/material";

const ViewUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const q = query(collection(db, "users"), where("role", "in", ["user", "host"]));
        const querySnapshot = await getDocs(q);
        const userList = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setUsers(userList);
      } catch (err) {
        setError("Error fetching users: " + err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "users", id));
      setUsers(users.filter((user) => user.id !== id));
    } catch (err) {
      setError("Error deleting user: " + err.message);
    }
  };

  const handleView = (user) => {
    setSelectedUser(user);
    setViewDialogOpen(true);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleFilterChange = (event) => {
    setFilterRole(event.target.value);
  };

  const filteredUsers = users.filter((user) =>
    ((user.name && user.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (user.email && user.email.toLowerCase().includes(searchQuery.toLowerCase()))) &&
    (filterRole === "" || user.role === filterRole)
  );

  return (
    <div className="p-6 overflow-x-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Users List</h1>
        <div className="flex space-x-4">
          <TextField
            label="Search Users"
            variant="outlined"
            size="small"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
      </div>
      {loading && <CircularProgress />}
      {error && <p className="text-red-500">{error}</p>}
      <table className="w-full border-collapse border border-gray-300 mt-4 text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 p-2 w-1/6 truncate">ID</th>
            <th className="border border-gray-300 p-2 w-1/6 truncate">Name</th>
            <th className="border border-gray-300 p-2 w-1/4 truncate">Email</th>
            <th className="border border-gray-300 p-2 w-1/6 truncate">Phone</th>
            <th className="border border-gray-300 p-2 w-1/6 truncate">Role</th>
            <th className="border border-gray-300 p-2 w-1/6 truncate">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user.id} className="hover:bg-gray-50">
              <td className="border border-gray-300 p-2 truncate max-w-xs">{user.id}</td>
              <td className="border border-gray-300 p-2 truncate max-w-xs">{user.displayName}</td>
              <td className="border border-gray-300 p-2 truncate max-w-xs">{user.email}</td>
              <td className="border border-gray-300 p-2 truncate max-w-xs">{user.phone}</td>
              <td className="border border-gray-300 p-2 truncate max-w-xs">{user.role}</td>
              <td className="border border-gray-300 p-2 truncate max-w-xs">
                <Button onClick={() => handleView(user)} className="bg-blue-600 hover:bg-blue-700 mr-2">
                  View
                </Button>
                <Button onClick={() => handleDelete(user.id)} className="bg-red-600 hover:bg-red-700">
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {/* View User Dialog */}
      <Dialog open={viewDialogOpen} onClose={() => setViewDialogOpen(false)}>
        <DialogTitle>User Details</DialogTitle>
        <DialogContent>
          {selectedUser && (
            <div>
              <p><strong>ID:</strong> {selectedUser.id}</p>
              <p><strong>Name:</strong> {selectedUser.displayName}</p>
              <p><strong>Email:</strong> {selectedUser.email}</p>
              <p><strong>Phone:</strong> {selectedUser.phone}</p>
              <p><strong>Role:</strong> {selectedUser.role}</p>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialogOpen(false)} color="primary">Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ViewUsers;