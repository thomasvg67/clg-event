import { Link } from "react-router-dom";
import { CalendarDays, Clock, MapPin, Plus, Users, Building, MessageSquare, UserCheck, FileText } from "lucide-react"

import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"

export default function Dashboard() {
  // Sample data - in a real app, this would come from a database
  const upcomingEvents = [
    {
      id: 1,
      title: "Annual Tech Conference",
      date: "May 15, 2025",
      time: "9:00 AM - 5:00 PM",
      location: "Convention Center",
      attendees: 120,
      registered: 85,
    },
    {
      id: 2,
      title: "Product Launch",
      date: "June 2, 2025",
      time: "2:00 PM - 4:00 PM",
      location: "Main Auditorium",
      attendees: 75,
      registered: 62,
    },
    {
      id: 3,
      title: "Team Building Workshop",
      date: "June 10, 2025",
      time: "10:00 AM - 3:00 PM",
      location: "Recreation Center",
      attendees: 30,
      registered: 28,
    },
  ]

  const pastEvents = [
    {
      id: 4,
      title: "Quarterly Review",
      date: "March 30, 2025",
      time: "1:00 PM - 3:00 PM",
      location: "Conference Room A",
      attendees: 25,
      registered: 25,
    },
    {
      id: 5,
      title: "Networking Mixer",
      date: "February 15, 2025",
      time: "6:00 PM - 8:00 PM",
      location: "Downtown Lounge",
      attendees: 50,
      registered: 43,
    },
  ]

  // Sample data for venues
  const venues = [
    {
      id: 1,
      name: "Convention Center",
      capacity: 500,
      address: "123 Main St, Downtown",
      availability: "Available",
      amenities: ["Wi-Fi", "Projector", "Catering", "Parking"],
    },
    {
      id: 2,
      name: "Main Auditorium",
      capacity: 200,
      address: "456 University Ave",
      availability: "Booked until June 5",
      amenities: ["Wi-Fi", "Sound System", "Stage", "Seating"],
    },
    {
      id: 3,
      name: "Conference Room A",
      capacity: 50,
      address: "789 Business Park",
      availability: "Available",
      amenities: ["Wi-Fi", "Whiteboard", "Video Conferencing"],
    },
  ]

  // Sample data for event requests
  const eventRequests = [
    {
      id: 1,
      title: "Startup Pitch Competition",
      requestedBy: "Tech Incubator Group",
      date: "July 10, 2025",
      status: "Pending",
      requestedOn: "April 1, 2025",
    },
    {
      id: 2,
      title: "Alumni Reunion",
      requestedBy: "Alumni Association",
      date: "August 15, 2025",
      status: "Under Review",
      requestedOn: "March 28, 2025",
    },
    {
      id: 3,
      title: "Career Fair",
      requestedBy: "Career Services",
      date: "September 5, 2025",
      status: "Approved",
      requestedOn: "March 15, 2025",
    },
  ]

  // Sample data for host requests
  const hostRequests = [
    {
      id: 1,
      name: "Dr. Jane Smith",
      organization: "Tech Innovations Inc.",
      eventType: "Workshop",
      status: "Pending",
      requestedOn: "April 2, 2025",
    },
    {
      id: 2,
      name: "Prof. Michael Johnson",
      organization: "University Research Dept.",
      eventType: "Conference",
      status: "Approved",
      requestedOn: "March 25, 2025",
    },
    {
      id: 3,
      name: "Sarah Williams",
      organization: "Community Outreach",
      eventType: "Seminar",
      status: "Under Review",
      requestedOn: "March 30, 2025",
    },
  ]

  // Sample data for feedback
  const feedbackItems = [
    {
      id: 1,
      eventTitle: "Quarterly Review",
      submittedBy: "John Doe",
      rating: 4.5,
      comment: "Well organized event with great speakers.",
      submittedOn: "April 1, 2025",
    },
    {
      id: 2,
      eventTitle: "Networking Mixer",
      submittedBy: "Emily Johnson",
      rating: 3.8,
      comment: "Good networking opportunities, but venue was too small.",
      submittedOn: "February 16, 2025",
    },
    {
      id: 3,
      eventTitle: "Product Launch",
      submittedBy: "Michael Brown",
      rating: 5.0,
      comment: "Excellent presentation and well managed event.",
      submittedOn: "March 15, 2025",
    },
  ]

  return (
    <main className="container mx-auto py-6 px-4 md:px-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
        <div>
          {/* <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1> */}
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>

          <p className="text-muted-foreground">Manage events, venues, requests, and feedback</p>
        </div>
        <Button asChild>
          <Link href="/events/create">
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
            <Button variant="outline" size="sm">
              <CalendarDays className="h-4 w-4 mr-2" />
              View Calendar
            </Button>
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
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add New Venue
            </Button>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {venues.map((venue) => (
              <Card key={venue.id}>
                <CardHeader>
                  <CardTitle>{venue.name}</CardTitle>
                  <CardDescription>
                    <div className="flex items-center gap-1 mt-1">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{venue.address}</span>
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>Capacity: {venue.capacity}</span>
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={`h-2 w-2 rounded-full ${venue.availability === "Available" ? "bg-green-500" : "bg-yellow-500"}`}
                    ></span>
                    <span>{venue.availability}</span>
                  </div>
                  <div className="mt-2">
                    <p className="text-sm font-medium mb-1">Amenities:</p>
                    <div className="flex flex-wrap gap-1">
                      {venue.amenities.map((amenity, index) => (
                        <span key={index} className="text-xs bg-secondary px-2 py-1 rounded-full">
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href={`/venues/${venue.id}`}>Manage Venue</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Requests Tab */}
        <TabsContent value="requests">
          <Tabs defaultValue="event-requests">
            <TabsList className="mb-4">
              <TabsTrigger value="event-requests">Event Requests</TabsTrigger>
              <TabsTrigger value="host-requests">Host Requests</TabsTrigger>
            </TabsList>

            {/* Event Requests Tab */}
            <TabsContent value="event-requests">
              <div className="flex justify-between mb-4">
                <h2 className="text-xl font-semibold">Event Requests</h2>
                <Button variant="outline" size="sm">
                  Export List
                </Button>
              </div>
              <div className="space-y-4">
                {eventRequests.map((request) => (
                  <Card key={request.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between">
                        <CardTitle>{request.title}</CardTitle>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            request.status === "Pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : request.status === "Approved"
                                ? "bg-green-100 text-green-800"
                                : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {request.status}
                        </span>
                      </div>
                      <CardDescription>
                        Requested by {request.requestedBy} on {request.requestedOn}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="flex items-center gap-1">
                        <CalendarDays className="h-4 w-4 text-muted-foreground" />
                        <span>Requested for {request.date}</span>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-2">
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
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Host Requests Tab */}
            <TabsContent value="host-requests">
              <div className="flex justify-between mb-4">
                <h2 className="text-xl font-semibold">Host Requests</h2>
                <Button variant="outline" size="sm">
                  Export List
                </Button>
              </div>
              <div className="space-y-4">
                {hostRequests.map((request) => (
                  <Card key={request.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between">
                        <CardTitle>{request.name}</CardTitle>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            request.status === "Pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : request.status === "Approved"
                                ? "bg-green-100 text-green-800"
                                : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {request.status}
                        </span>
                      </div>
                      <CardDescription>{request.organization}</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="flex items-center gap-1">
                        <UserCheck className="h-4 w-4 text-muted-foreground" />
                        <span>Wants to host: {request.eventType}</span>
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        <CalendarDays className="h-4 w-4 text-muted-foreground" />
                        <span>Requested on {request.requestedOn}</span>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-2">
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
                    </CardFooter>
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
            <Button variant="outline" size="sm">
              Generate Report
            </Button>
          </div>
          <div className="space-y-4">
            {feedbackItems.map((feedback) => (
              <Card key={feedback.id}>
                <CardHeader>
                  <div className="flex justify-between">
                    <CardTitle>{feedback.eventTitle}</CardTitle>
                    <div className="flex items-center">
                      <span className="font-bold mr-1">{feedback.rating}</span>
                      <span className="text-yellow-500">★</span>
                    </div>
                  </div>
                  <CardDescription>
                    Submitted by {feedback.submittedBy} on {feedback.submittedOn}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{feedback.comment}</p>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button variant="outline" size="sm">
                    Respond
                  </Button>
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
        <CardTitle>{event.title}</CardTitle>
        <CardDescription>
          <div className="flex items-center gap-1 mt-1">
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
            <span>{event.date}</span>
          </div>
          <div className="flex items-center gap-1 mt-1">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>{event.time}</span>
          </div>
          <div className="flex items-center gap-1 mt-1">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span>{event.location}</span>
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
            style={{ width: `${(event.registered / event.attendees) * 100}%` }}
          ></div>
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild variant={isPast ? "outline" : "default"} className="w-full">
          <Link href={`/events/${event.id}`}>{isPast ? "View Summary" : "Manage Event"}</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

