import { Link } from "react-router-dom";
import { CalendarDays, ChevronLeft, Clock, Download, Edit, MapPin, Share, Trash, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AttendeesTable } from "./attendees-table"
import { FeedbackSection } from "./feedback-section"

export default function EventDetailsPage({ params }) {
  // In a real app, you would fetch this data from your database
  const event = {
    id: Number.parseInt(params.id),
    title: "Annual Tech Conference",
    date: "May 15, 2025",
    time: "9:00 AM - 5:00 PM",
    location: "Convention Center",
    description:
      "Join us for our annual technology conference featuring keynote speakers, workshops, and networking opportunities. This year's theme focuses on AI and machine learning advancements.",
    capacity: 120,
    registered: 85,
    type: "Conference",
    host: "Tech Innovation Group",
    venue: {
      name: "Convention Center",
      address: "123 Main St, Downtown",
      amenities: ["Wi-Fi", "Projector", "Catering", "Parking"],
    },
  }

  return (
    <main className="container mx-auto py-6 px-4 md:px-6">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="sm" asChild className="mr-2">
          <Link href="/">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Dashboard
          </Link>
        </Button>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{event.title}</h1>
          <div className="flex flex-wrap gap-4 mt-2">
            <div className="flex items-center gap-1">
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
              <span>{event.date}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>{event.time}</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{event.location}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" size="sm">
            <Share className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button variant="destructive" size="sm">
            <Trash className="h-4 w-4 mr-2" />
            Cancel Event
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Registration Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {event.registered} / {event.capacity}
            </div>
            <Progress value={(event.registered / event.capacity) * 100} className="h-2 mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              {Math.round((event.registered / event.capacity) * 100)}% of capacity filled
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Host</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{event.host}</div>
            <p className="text-xs text-muted-foreground mt-2">Event organizer</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Available Spots</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{event.capacity - event.registered}</div>
            <p className="text-xs text-muted-foreground mt-2">Remaining capacity</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="details" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="details">Event Details</TabsTrigger>
          <TabsTrigger value="attendees">Attendees</TabsTrigger>
          <TabsTrigger value="venue">Venue</TabsTrigger>
          <TabsTrigger value="feedback">Feedback</TabsTrigger>
        </TabsList>
        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle>About This Event</CardTitle>
              <CardDescription>Complete event information and description</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-line">{event.description}</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="attendees">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Registered Attendees</CardTitle>
                <CardDescription>{event.registered} people registered for this event</CardDescription>
              </div>
              <Button>
                <Users className="h-4 w-4 mr-2" />
                Add Attendee
              </Button>
            </CardHeader>
            <CardContent>
              <AttendeesTable />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="venue">
          <Card>
            <CardHeader>
              <CardTitle>{event.venue.name}</CardTitle>
              <CardDescription>{event.venue.address}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-muted rounded-md mb-4 flex items-center justify-center">
                <MapPin className="h-8 w-8 text-muted-foreground" />
                <span className="ml-2 text-muted-foreground">Venue Map</span>
              </div>

              <h3 className="font-medium mb-2">Amenities</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {event.venue.amenities.map((amenity, index) => (
                  <span key={index} className="px-2 py-1 bg-secondary rounded-full text-xs">
                    {amenity}
                  </span>
                ))}
              </div>

              <h3 className="font-medium mb-2">Venue Notes</h3>
              <p className="text-sm text-muted-foreground">
                This venue has a maximum capacity of 150 people. Setup time begins at 7:00 AM on the day of the event.
                Parking is available in the adjacent garage.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="feedback">
          <FeedbackSection eventId={params.id} />
        </TabsContent>
      </Tabs>
    </main>
  )
}

