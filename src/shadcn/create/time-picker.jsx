"use client"

import * as React from "react"
import { Clock } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export function TimePickerDemo() {
  const [hours, setHours] = React.useState("12")
  const [minutes, setMinutes] = React.useState("00")
  const [ampm, setAmPm] = React.useState("AM")

  const handleHoursChange = (e) => {
    const value = e.target.value
    if (value === "" || (Number.parseInt(value) >= 1 && Number.parseInt(value) <= 12 && value.length <= 2)) {
      setHours(value)
    }
  }

  const handleMinutesChange = (e) => {
    const value = e.target.value
    if (value === "" || (Number.parseInt(value) >= 0 && Number.parseInt(value) <= 59 && value.length <= 2)) {
      setMinutes(value)
    }
  }

  const handleAmPmChange = () => {
    setAmPm(ampm === "AM" ? "PM" : "AM")
  }

  return (
    <div className="flex items-end gap-2">
      <div className="grid gap-1 text-center">
        <Label htmlFor="hours" className="text-xs">
          Hours
        </Label>
        <Input id="hours" className="w-12 text-center" value={hours} onChange={handleHoursChange} />
      </div>
      <div className="text-center text-xl mb-2">:</div>
      <div className="grid gap-1 text-center">
        <Label htmlFor="minutes" className="text-xs">
          Minutes
        </Label>
        <Input id="minutes" className="w-12 text-center" value={minutes} onChange={handleMinutesChange} />
      </div>
      <div className="grid gap-1 text-center">
        <Label htmlFor="ampm" className="text-xs">
          AM/PM
        </Label>
        <button
          id="ampm"
          className={cn(
            "flex h-10 w-12 items-center justify-center rounded-md border border-input bg-background text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          )}
          onClick={handleAmPmChange}
        >
          {ampm}
        </button>
      </div>
      <div className="flex items-center mb-2">
        <Clock className="ml-2 h-4 w-4 text-muted-foreground" />
      </div>
    </div>
  )
}

