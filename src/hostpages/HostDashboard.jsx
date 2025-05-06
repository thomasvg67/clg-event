import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Typography, CircularProgress } from "@mui/material";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import DashboardIcon from "@mui/icons-material/Dashboard";
import EventIcon from "@mui/icons-material/Event";
import AssignmentIcon from "@mui/icons-material/Assignment";
import FeedbackIcon from "@mui/icons-material/Feedback";
import HomeIcon from "@mui/icons-material/Home";
import PeopleIcon from "@mui/icons-material/People";

const HostDashboard = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser?.role) {
      if (currentUser.role !== "host") {
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
    { text: "Dashboard", icon: <DashboardIcon />, link: "/hostdash/page" },
    { text: "My Events", icon: <EventIcon />, link: "/hostdash/my-events" },
    { text: "Attendance", icon: <AssignmentIcon />, link: "/hostdash/view-attendance" },
    { text: "Feedback", icon: <FeedbackIcon />, link: "/hostdash/view-feedback" },
    { text: "Registrations", icon: <PeopleIcon />, link: "/hostdash/view-registrations" },
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
          Host Panel
        </Typography>
        <List>
          {menuItems.map((item, index) => (
            <ListItem
              key={index}
              component={Link} // ✅ Set `component` to `Link`
              to={item.link}
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
          ))}
          {/* Go to Home Button */}
          <ListItem
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
        {/* <Typography variant="h4">Host Dashboard</Typography> */}
        <Outlet />
      </div>
    </div>
  );
};

export default HostDashboard;
