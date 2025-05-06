"use client"

import { useState } from "react"
import { MessageSquare, Star, ThumbsUp } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"

// Sample feedback data
const feedbackData = [
  {
    id: 1,
    name: "John Doe",
    date: "April 2, 2025",
    rating: 5,
    comment:
      "This was an excellent event! The speakers were knowledgeable and the networking opportunities were great.",
    isAdmin: false,
  },
  {
    id: 2,
    name: "Admin Response",
    date: "April 3, 2025",
    comment: "Thank you for your feedback! We're glad you enjoyed the event.",
    isAdmin: true,
  },
  {
    id: 3,
    name: "Sarah Williams",
    date: "April 1, 2025",
    rating: 4,
    comment: "Good event overall. The venue was a bit small for the number of attendees.",
    isAdmin: false,
  },
]

export function FeedbackSection({ eventId }) {
  const [feedbacks, setFeedbacks] = useState(feedbackData)
  const [newComment, setNewComment] = useState("")
  const [rating, setRating] = useState(5)

  const handleSubmitResponse = () => {
    if (newComment.trim() === "") return

    const newFeedback = {
      id: feedbacks.length + 1,
      name: "Admin Response",
      date: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
      comment: newComment,
      isAdmin: true,
    }

    setFeedbacks([...feedbacks, newFeedback])
    setNewComment("")
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Event Feedback</CardTitle>
          <CardDescription>View and respond to attendee feedback</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {feedbacks.map((feedback) => (
              <div key={feedback.id} className={`p-4 rounded-lg ${feedback.isAdmin ? "bg-secondary ml-8" : "border"}`}>
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${
                        feedback.isAdmin ? "bg-primary text-primary-foreground" : "bg-muted"
                      }`}
                    >
                      {feedback.isAdmin ? (
                        <MessageSquare className="h-4 w-4" />
                      ) : (
                        <span>{feedback.name.charAt(0)}</span>
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{feedback.name}</p>
                      <p className="text-xs text-muted-foreground">{feedback.date}</p>
                    </div>
                  </div>
                  {!feedback.isAdmin && feedback.rating && (
                    <div className="flex items-center">
                      <span className="font-bold mr-1">{feedback.rating}</span>
                      <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                    </div>
                  )}
                </div>
                <p className="text-sm mt-2">{feedback.comment}</p>
                {!feedback.isAdmin && (
                  <div className="flex justify-end mt-2">
                    <Button variant="ghost" size="sm">
                      <ThumbsUp className="h-4 w-4 mr-1" />
                      Helpful
                    </Button>
                    <Button variant="ghost" size="sm">
                      Reply
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex-col items-start">
          <h3 className="font-medium mb-2">Add Admin Response</h3>
          <Textarea
            placeholder="Type your response here..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="mb-4"
          />
          <Button onClick={handleSubmitResponse}>Post Response</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Feedback Summary</CardTitle>
          <CardDescription>Overall event ratings and statistics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-6">
            <div className="text-center">
              <div className="text-4xl font-bold">4.5</div>
              <div className="flex justify-center mt-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-5 w-5 ${star <= 4 ? "fill-yellow-500 text-yellow-500" : "text-muted-foreground"}`}
                  />
                ))}
              </div>
              <p className="text-sm text-muted-foreground mt-1">Average Rating</p>
            </div>

            <div className="text-center">
              <div className="text-4xl font-bold">12</div>
              <p className="text-sm text-muted-foreground mt-1">Total Feedback</p>
            </div>

            <div className="text-center">
              <div className="text-4xl font-bold">92%</div>
              <p className="text-sm text-muted-foreground mt-1">Satisfaction Rate</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <span className="w-4 text-sm font-medium">5</span>
                <Star className="h-4 w-4 fill-yellow-500 text-yellow-500 ml-1 mr-2" />
                <div className="w-full bg-secondary h-2 rounded-full">
                  <div className="bg-yellow-500 h-2 rounded-full" style={{ width: "70%" }}></div>
                </div>
              </div>
              <span className="text-sm ml-2">70%</span>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <span className="w-4 text-sm font-medium">4</span>
                <Star className="h-4 w-4 fill-yellow-500 text-yellow-500 ml-1 mr-2" />
                <div className="w-full bg-secondary h-2 rounded-full">
                  <div className="bg-yellow-500 h-2 rounded-full" style={{ width: "20%" }}></div>
                </div>
              </div>
              <span className="text-sm ml-2">20%</span>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <span className="w-4 text-sm font-medium">3</span>
                <Star className="h-4 w-4 fill-yellow-500 text-yellow-500 ml-1 mr-2" />
                <div className="w-full bg-secondary h-2 rounded-full">
                  <div className="bg-yellow-500 h-2 rounded-full" style={{ width: "5%" }}></div>
                </div>
              </div>
              <span className="text-sm ml-2">5%</span>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <span className="w-4 text-sm font-medium">2</span>
                <Star className="h-4 w-4 fill-yellow-500 text-yellow-500 ml-1 mr-2" />
                <div className="w-full bg-secondary h-2 rounded-full">
                  <div className="bg-yellow-500 h-2 rounded-full" style={{ width: "3%" }}></div>
                </div>
              </div>
              <span className="text-sm ml-2">3%</span>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <span className="w-4 text-sm font-medium">1</span>
                <Star className="h-4 w-4 fill-yellow-500 text-yellow-500 ml-1 mr-2" />
                <div className="w-full bg-secondary h-2 rounded-full">
                  <div className="bg-yellow-500 h-2 rounded-full" style={{ width: "2%" }}></div>
                </div>
              </div>
              <span className="text-sm ml-2">2%</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

