import { Link } from "react-router-dom";
import { CalendarDays, Clock, MapPin, Plus, Users, Building, MessageSquare, UserCheck, FileText } from "lucide-react"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { doc, getDoc, collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { useAuth } from "../contexts/AuthContext";
import { db } from "../lib/firebase";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {

  const { eventId } = useParams();
  const [users, setUsers] = useState([]);
  const [event, setEvent] = useState(null);
  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [feedbacks, setFeedbacks] = useState([]);
  const [rating, setRating] = useState(0);
  const [attended, setAttended] = useState(false);
  const [registrations, setRegistrations] = useState([]);

  // const [hostRequests, setHostRequests] = useState([]);
  const [timeRemaining, setTimeRemaining] = useState("");
  const navigate = useNavigate();
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);
  const [venues, setVenues] = useState([]);
  const [eventRequests, setEventRequests] = useState([]);
  const [hostRequests, setHostRequests] = useState([]);
  const [feedbackItems, setFeedbackItems] = useState([]);

  useEffect(() => {

    const fetchEventName = async (eventId) => {
      if (!eventId) return "Unknown Event";
      const eventRef = doc(db, "events", eventId);
      const eventSnap = await getDoc(eventRef);
      return eventSnap.exists() ? eventSnap.data().eventName : "Unknown Event";
    };

    const fetchDisplayName = async (userId) => {
      if (!userId) return "Unknown User";
      const userRef = doc(db, "users", userId);
      const userSnap = await getDoc(userRef);
      return userSnap.exists() ? userSnap.data().displayName : "Unknown User";
    };

    const fetchVenueName = async (venueId) => {
      if (!venueId) return "Unknown Venue";
      const venueRef = doc(db, "venues", venueId);
      const venueSnap = await getDoc(venueRef);
      return venueSnap.exists() ? venueSnap.data().name : "Unknown Venue";
    };

    const fetchData = async () => {
      try {
        // Fetch events
        const eventsSnapshot = await getDocs(collection(db, "events"));
        const now = new Date();
        const upcoming = [];
        const past = [];

        for (const docSnap of eventsSnapshot.docs) {
          const data = docSnap.data();
          const eventDate = new Date(data.date);
          const venueName = await fetchVenueName(data.venueId);
        
          // Get registration count
          const registrationsQuery = query(
            collection(db, "eventRegistrations"),
            where("eventId", "==", docSnap.id)
          );
          const registrationsSnapshot = await getDocs(registrationsQuery);
          const registeredCount = registrationsSnapshot.size;
        
          const event = {
            id: docSnap.id,
            ...data,
            venueName,
            registered: registeredCount, // Add this
          };
        
          if (eventDate >= now) {
            upcoming.push(event);
          } else {
            past.push(event);
          }
        }

        setUpcomingEvents(upcoming);
        setPastEvents(past);

        // Fetch venues
        const venuesSnapshot = await getDocs(collection(db, "venues"));
        const venuesList = venuesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setVenues(venuesList);

        // Fetch event requests
        const eventRequestsSnapshot = await getDocs(collection(db, "eventRequests"));
        const eventRequestsList = eventRequestsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setEventRequests(eventRequestsList);

        // Fetch host requests
        const hostRequestsSnapshot = await getDocs(collection(db, "hostRequests"));
        const hostRequestsList = hostRequestsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setHostRequests(hostRequestsList);

        // Fetch feedback
        const feedbackSnapshot = await getDocs(collection(db, "eventFeedback"));
        const feedbackList = await Promise.all(
          feedbackSnapshot.docs.map(async docSnap => {
            const data = docSnap.data();
            const displayName = await fetchDisplayName(data.userId);
            const eventName = await fetchEventName(data.eventId);
            return { id: docSnap.id, ...data, displayName, eventName };
          })
        );
        setFeedbackItems(feedbackList);




      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchData();
  }, []);


  return (
    <main className="container mx-auto py-6 px-4 md:px-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
        <div>
          {/* <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1> */}
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>

          <p className="text-muted-foreground">Manage events, venues, requests, and feedback</p>
        </div>
        <Button asChild>
          <Link to="/admindash/view-events">
            <Plus className="mr-2 h-4 w-4" />
            Create Event
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingEvents.length + pastEvents.length}</div>
            <p className="text-xs text-muted-foreground">
              {upcomingEvents.length} upcoming, {pastEvents.length} past
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Venues</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{venues.length}</div>
            <p className="text-xs text-muted-foreground">
              {venues.filter((v) => v.availability === "Available").length} available
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {eventRequests.filter((r) => r.status === "Pending").length +
                hostRequests.filter((r) => r.status === "Pending").length}
            </div>
            <p className="text-xs text-muted-foreground">Awaiting your approval</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Feedback Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(feedbackItems.reduce((acc, item) => acc + item.rating, 0) / feedbackItems.length).toFixed(1)}
            </div>
            <p className="text-xs text-muted-foreground">Average rating (out of 5)</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="events" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="events">
            <CalendarDays className="h-4 w-4 mr-2" />
            Events
          </TabsTrigger>
          <TabsTrigger value="venues">
            <Building className="h-4 w-4 mr-2" />
            Venues
          </TabsTrigger>
          <TabsTrigger value="requests">
            <FileText className="h-4 w-4 mr-2" />
            Requests
          </TabsTrigger>
          <TabsTrigger value="feedback">
            <MessageSquare className="h-4 w-4 mr-2" />
            Feedback
          </TabsTrigger>
        </TabsList>

        {/* Events Tab */}
        <TabsContent value="events">
          <div className="flex justify-between mb-4">
            <h2 className="text-xl font-semibold">Upcoming Events</h2>
            {/* <Button variant="outline" size="sm">
              <CalendarDays className="h-4 w-4 mr-2" />
              View Calendar
            </Button> */}
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
            {upcomingEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>

          <h2 className="text-xl font-semibold mb-4">Past Events</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {pastEvents.map((event) => (
              <EventCard key={event.id} event={event} isPast />
            ))}
          </div>
        </TabsContent>

        {/* Venues Tab */}
        <TabsContent value="venues">
          <div className="flex justify-between mb-4">
            <h2 className="text-xl font-semibold">Venue Management</h2>
            <Link to="/admindash/view-venue">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add New Venue
              </Button>
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {venues.map((venue) => (
              <Card key={venue.id}>
                <CardHeader>
                  <CardTitle>{venue.name}</CardTitle>
                  <CardDescription>
                    <div className="flex items-center gap-1 mt-1">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{venue.location}</span>
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>Capacity: {venue.capacity}</span>
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {/* <div className="flex items-center gap-2 mb-2">
                    <span
                      className={`h-2 w-2 rounded-full ${venue.availability === "Available" ? "bg-green-500" : "bg-yellow-500"}`}
                    ></span>
                    <span>{venue.availability}</span>
                  </div> */}
                  <div className="mt-2">
                    <p className="text-sm font-medium mb-1">Amenities:</p>
                    {/* <div className="flex flex-wrap gap-1">
                      {venue.amenities.map((amenity, index) => (
                        <span key={index} className="text-xs bg-secondary px-2 py-1 rounded-full">
                          {amenity}
                        </span>
                      ))}
                    </div> */}
                    <div className="flex flex-wrap gap-1">
                      {/* Static amenities values */}
                      <span className="text-xs bg-secondary px-2 py-1 rounded-full">Wi-Fi</span>
                      <span className="text-xs bg-secondary px-2 py-1 rounded-full">Projector</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Requests Tab */}
        <TabsContent value="requests">
          <Tabs defaultValue="host-requests">
            {/* <TabsList className="mb-4">
              <TabsTrigger value="host-requests">Host Requests</TabsTrigger>
            </TabsList> */}

            {/* Host Requests Tab */}
            <TabsContent value="host-requests">
              <div className="flex justify-between mb-4">
                <h2 className="text-xl font-semibold">Host Requests</h2>
                <Link to="/admindash/view-requests">
                  <Button variant="outline" size="sm">
                    View details
                  </Button>
                </Link>
              </div>
              <div className="space-y-4">
                {hostRequests.map((request) => (
                  <Card key={request.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between">
                        <CardTitle>{request.displayName}</CardTitle>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${request.status === "Pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : request.status === "Approved"
                              ? "bg-green-100 text-green-800"
                              : "bg-blue-100 text-blue-800"
                            }`}
                        >
                          {request.status}
                        </span>
                      </div>
                      <CardDescription>{request.email}</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      {/* <div className="flex items-center gap-1">
                        <UserCheck className="h-4 w-4 text-muted-foreground" />
                        <span>Wants to host: {request.eventType}</span>
                      </div> */}
                      <div className="flex items-center gap-1 mt-1">
                        <CalendarDays className="h-4 w-4 text-muted-foreground" />
                        <span>
                          Requested on{" "}
                          {request.createdAt?.toDate().toLocaleString("en-US", {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })}
                        </span>
                      </div>
                    </CardContent>
                    {/* <CardFooter className="flex justify-end gap-2">
                      {request.status === "Pending" && (
                        <>
                          <Button variant="destructive" size="sm">
                            Decline
                          </Button>
                          <Button size="sm">Approve</Button>
                        </>
                      )}
                      {request.status === "Under Review" && (
                        <>
                          <Button variant="outline" size="sm">
                            Request Info
                          </Button>
                          <Button variant="destructive" size="sm">
                            Decline
                          </Button>
                          <Button size="sm">Approve</Button>
                        </>
                      )}
                      {request.status === "Approved" && (
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      )}
                    </CardFooter> */}
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </TabsContent>

        {/* Feedback Tab */}
        <TabsContent value="feedback">
          <div className="flex justify-between mb-4">
            <h2 className="text-xl font-semibold">Event Feedback</h2>
            {/* <Button variant="outline" size="sm">
              Generate Report
            </Button> */}
          </div>
          <div className="space-y-4">
            {feedbackItems.map((feedback) => (
              <Card key={feedback.id}>
                <CardHeader>
                  <div className="flex justify-between">
                    <CardTitle>{feedback.eventName || "Unnamed Event"}</CardTitle>
                    <div className="flex items-center">
                      <span className="font-bold mr-1">{feedback.rating}</span>
                      <span className="text-yellow-500">★</span>
                    </div>
                  </div>
                  <CardDescription>
                    <span>
                      Submitted by {feedback.displayName || "Anonymous"} on{" "}
                      {feedback.submittedAt?.toDate
                        ? feedback.submittedAt.toDate().toLocaleString("en-US", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })
                        : "Unknown Date"}
                    </span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {feedback.feedback && <p className="text-sm">{feedback.feedback}</p>}
                </CardContent>
                <CardFooter className="flex justify-end">
                  {/* <Button variant="outline" size="sm">
        Respond
      </Button> */}
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </main>
  )
}

function EventCard({ event, isPast = false }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{event.eventName}</CardTitle>
        <CardDescription>
          <div className="flex items-center gap-1 mt-1">
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
            <span>{event.date}</span>
          </div>
          <div className="flex items-center gap-1 mt-1">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>{event.startTime}</span>
          </div>
          <div className="flex items-center gap-1 mt-1">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span>{event.venueName}</span>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-1">
          <Users className="h-4 w-4 text-muted-foreground" />
          <span>
            {event.registered} / {event.attendees} registered
          </span>
        </div>
        <div className="w-full bg-secondary h-2 rounded-full mt-2">
          <div
            className="bg-primary h-2 rounded-full"
            // style={{ width: `${((event.registered / (event.attendees || 1)) * 100).toFixed(1)}%` }}
            ></div>
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild variant={isPast ? "outline" : "default"} className="w-full">
          {/* <Link href={`/events/${event.id}`}>{isPast ? "View Summary" : "Manage Event"}</Link> */}
        </Button>
      </CardFooter>
    </Card>
  )
}

