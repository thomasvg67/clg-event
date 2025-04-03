import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { VenueProvider } from "./contexts/AuthVenue"; // Import VenueProvider

import ForgotPassword from "./pages/ForgotPassword";
import EditProfile from "./pages/EditProfile";
import PrivateRoute from "./components/PrivateRoute";
import Login from "./pages/LogIn";
import Signup from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import EventPage from "./pages/EventPage";
import CreateEvent from "./pages/CreateEvent";
import ManageProfile from "./pages/ManageProfile";
import Bookings from "./pages/Bookings";

// Admin Pages
import AdminDashboard from "./adminpages/AdminDashboard";
import ViewUsers from "./adminpages/ViewUsers";
import ViewEvents from "./adminpages/ViewEvents";
import ViewAttendance from "./adminpages/ViewAttendance";
import ViewFeedback from "./adminpages/ViewFeedback";
import VenuePage from "./adminpages/VenuePage";
import ViewRegistrations from "./adminpages/ViewRegistrations";

// Host Pages
import HostDashboard from "./hostpages/HostDashboard";
import HostEvents from "./hostpages/HostEvents";
import HostViewRegistrations from "./hostpages/HostViewRegistrations";
import HostAttendance from "./hostpages/HostAttendance";
import HostFeedback from "./hostpages/HostFeedback";
import ViewRequests from "./adminpages/ViewRequests";


function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <VenueProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/home" element={<Home />} />
            <Route path="/event/:eventId" element={<EventPage />} />
            <Route path="/create-event" element={<CreateEvent />} />
            <Route path="/manage-profile" element={<ManageProfile />} />
            <Route path="/bookings" element={<Bookings />} />

            {/* Private User Routes */}
            <Route path="/dashboard" element={<PrivateRoute Component={Dashboard} />} />
            <Route path="/edit-profile" element={<PrivateRoute Component={EditProfile} />} />

            {/* Admin Routes */}
            <Route path="/admindash" element={<AdminDashboard />}>
              <Route path="view-users" element={<ViewUsers />} />
              <Route path="view-events" element={<ViewEvents />} />
              <Route path="view-registrations" element={<ViewRegistrations />} />
              <Route path="view-attendance" element={<ViewAttendance />} />
              <Route path="view-requests" element={<ViewRequests />} />
              <Route path="view-feedback" element={<ViewFeedback />} />
              <Route path="view-venue" element={<VenuePage />} />
            </Route>

            {/* Host Routes (Moved Outside) */}
            <Route path="/hostdash" element={<HostDashboard />}>
              <Route path="my-events" element={<HostEvents />} />
              <Route path="view-attendance" element={<HostAttendance />} />
              <Route path="view-feedback" element={<HostFeedback />} />
              <Route path="view-registrations" element={<HostViewRegistrations />} />
            </Route>
          </Routes>
        </VenueProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
