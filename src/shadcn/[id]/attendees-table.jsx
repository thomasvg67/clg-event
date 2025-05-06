"use client"

import { useState } from "react"
import { MoreHorizontal, ArrowUpDown, ChevronDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// Sample data - in a real app, this would come from a database
const attendees = [
  {
    id: "ATT-001",
    name: "John Smith",
    email: "john.smith@example.com",
    registrationDate: "2025-04-01",
    status: "Confirmed",
  },
  {
    id: "ATT-002",
    name: "Emily Johnson",
    email: "emily.j@example.com",
    registrationDate: "2025-04-02",
    status: "Confirmed",
  },
  {
    id: "ATT-003",
    name: "Michael Brown",
    email: "michael.b@example.com",
    registrationDate: "2025-04-02",
    status: "Pending",
  },
  {
    id: "ATT-004",
    name: "Sarah Williams",
    email: "sarah.w@example.com",
    registrationDate: "2025-04-03",
    status: "Confirmed",
  },
  {
    id: "ATT-005",
    name: "David Miller",
    email: "david.m@example.com",
    registrationDate: "2025-04-03",
    status: "Cancelled",
  },
]

export function AttendeesTable() {
  const [selectedAttendees, setSelectedAttendees] = useState([])
  const [searchQuery, setSearchQuery] = useState("")

  const filteredAttendees = attendees.filter(
    (attendee) =>
      attendee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      attendee.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      attendee.id.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const toggleAttendee = (attendeeId) => {
    setSelectedAttendees((current) => {
      if (current.includes(attendeeId)) {
        return current.filter((id) => id !== attendeeId)
      } else {
        return [...current, attendeeId]
      }
    })
  }

  const toggleAll = () => {
    if (selectedAttendees.length === filteredAttendees.length) {
      setSelectedAttendees([])
    } else {
      setSelectedAttendees(filteredAttendees.map((attendee) => attendee.id))
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between py-4">
        <Input
          placeholder="Search attendees..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem checked>ID</DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem checked>Name</DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem checked>Email</DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem checked>Registration Date</DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem checked>Status</DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox
                  checked={filteredAttendees.length > 0 && selectedAttendees.length === filteredAttendees.length}
                  onCheckedChange={toggleAll}
                  aria-label="Select all"
                />
              </TableHead>
              <TableHead className="w-[100px]">
                <div className="flex items-center space-x-1">
                  <span>ID</span>
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center space-x-1">
                  <span>Name</span>
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>Email</TableHead>
              <TableHead>
                <div className="flex items-center space-x-1">
                  <span>Registration Date</span>
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center space-x-1">
                  <span>Status</span>
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAttendees.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No attendees found.
                </TableCell>
              </TableRow>
            ) : (
              filteredAttendees.map((attendee) => (
                <TableRow key={attendee.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedAttendees.includes(attendee.id)}
                      onCheckedChange={() => toggleAttendee(attendee.id)}
                      aria-label={`Select ${attendee.name}`}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{attendee.id}</TableCell>
                  <TableCell>{attendee.name}</TableCell>
                  <TableCell>{attendee.email}</TableCell>
                  <TableCell>{new Date(attendee.registrationDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <span
                        className={`h-2 w-2 rounded-full mr-2 ${
                          attendee.status === "Confirmed"
                            ? "bg-green-500"
                            : attendee.status === "Pending"
                              ? "bg-yellow-500"
                              : "bg-red-500"
                        }`}
                      />
                      {attendee.status}
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>View details</DropdownMenuItem>
                        <DropdownMenuItem>Send email</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Change status</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">Remove attendee</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="text-sm text-muted-foreground">
          {selectedAttendees.length} of {filteredAttendees.length} attendee(s) selected
        </div>
        <div className="space-x-2">
          <Button variant="outline" size="sm" disabled={selectedAttendees.length === 0}>
            Email Selected
          </Button>
          <Button variant="outline" size="sm" disabled={selectedAttendees.length === 0}>
            Export Selected
          </Button>
        </div>
      </div>
    </div>
  )
}

