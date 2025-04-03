import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Typography, CircularProgress } from "@mui/material";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import EventIcon from "@mui/icons-material/Event";
import AssignmentIcon from "@mui/icons-material/Assignment";
import FeedbackIcon from "@mui/icons-material/Feedback";
import RoomIcon from "@mui/icons-material/Room";
import HomeIcon from "@mui/icons-material/Home";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import RequestPageIcon from '@mui/icons-material/RequestPage';


const AdminDashboard = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser && currentUser.role) {
      if (currentUser.role !== "admin") {
        navigate("/home");
      } else {
        setLoading(false);
      }
    }
  }, [currentUser, navigate]);

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <Typography variant="h4">Loading...</Typography>
        <CircularProgress style={{ marginLeft: "10px" }} />
      </div>
    );
  }

  const menuItems = [
    { text: "Dashboard", icon: <DashboardIcon />, link: "/admindash" },
    { text: "Users", icon: <PeopleIcon />, link: "/admindash/view-users" },
    { text: "Events", icon: <EventIcon />, link: "/admindash/view-events" },
    { text: "Registrations", icon: <HowToRegIcon />, link: "/admindash/view-registrations" },  // <-- Added Here
    { text: "Attendance", icon: <AssignmentIcon />, link: "/admindash/view-attendance" },
    { text: "Feedback", icon: <FeedbackIcon />, link: "/admindash/view-feedback" },
    { text: "Venue", icon: <RoomIcon />, link: "/admindash/view-venue" },
    { text: "Requests", icon: <RequestPageIcon />, link: "/admindash/view-requests" },
  ];

  return (
    <div style={{ display: "flex" }}>
      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: 250,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: 250,
            backgroundColor: "#121212",
            color: "#fff",
            padding: "10px",
          },
        }}
      >
        <Typography variant="h6" align="center" sx={{ padding: "20px", fontWeight: "bold" }}>
          Admin Panel
        </Typography>
        <List>
          {menuItems.map((item, index) => (
            <Link key={index} to={item.link} style={{ textDecoration: "none", color: "inherit" }}>
              <ListItem
                button
                sx={{
                  "&:hover": {
                    backgroundColor: "#333",
                    transform: "scale(1.05)",
                    transition: "all 0.3s ease-in-out",
                  },
                }}
              >
                <ListItemIcon sx={{ color: "#fff" }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            </Link>
          ))}
          {/* Go to Home Button */}
          <ListItem
            button
            onClick={() => navigate("/home")}
            sx={{
              backgroundColor: "#1976d2",
              color: "#fff",
              marginTop: "20px",
              "&:hover": {
                backgroundColor: "#1565c0",
                transform: "scale(1.05)",
                transition: "all 0.3s ease-in-out",
              },
            }}
          >
            <ListItemIcon sx={{ color: "#fff" }}>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary="Go to Home" />
          </ListItem>
        </List>
      </Drawer>

      {/* Main Content */}
      <div style={{ flexGrow: 1, padding: "20px" }}>
        <Typography variant="h4">Admin Dashboard</Typography>
        <Outlet /> {/* This will load view-users, view-events, etc. */}
      </div>
    </div>
  );
};

export default AdminDashboard;
