import React, { useState } from "react";

export default function CreateEvent() {
  const [formData, setFormData] = useState({
    eventName: "",
    startDate: "",
    endDate: "",
    timeZone: "GMT+5:30 Chennai, Kolkata, Mumbai, New Delhi",
    eventType: "Paid",
    eventMode: "",
    currency: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Event Created:", formData);
    alert("Event Created Successfully!");
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="max-w-3xl w-full bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-center text-gray-900">Create Event</h2>
        <p className="text-gray-600 text-center mt-2">
          Provide basic event details to get started.
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          {/* Event Name */}
          <div>
            <label className="block font-semibold text-gray-700">Event Name *</label>
            <input
              type="text"
              name="eventName"
              value={formData.eventName}
              onChange={handleChange}
              className="w-full p-2 border rounded mt-1"
              placeholder="Event Name"
              required
            />
          </div>

          {/* Start and End Date */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-gray-700">Starts On *</label>
              <input
                type="datetime-local"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="w-full p-2 border rounded mt-1"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700">Ends On *</label>
              <input
                type="datetime-local"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="w-full p-2 border rounded mt-1"
                required
              />
            </div>
          </div>

          {/* Time Zone */}
          <div>
            <label className="block font-semibold text-gray-700">Time Zone *</label>
            <select
              name="timeZone"
              value={formData.timeZone}
              onChange={handleChange}
              className="w-full p-2 border rounded mt-1"
            >
              <option value="GMT+5:30 Chennai, Kolkata, Mumbai, New Delhi">
                (GMT+5:30) Chennai, Kolkata, Mumbai, New Delhi
              </option>
              <option value="GMT+1:00 London"> (GMT+1:00) London</option>
              <option value="GMT-5:00 New York"> (GMT-5:00) New York</option>
            </select>
          </div>

          {/* Event Type */}
          <div>
            <label className="block font-semibold text-gray-700">Event Type *</label>
            <div className="flex gap-4 mt-1">
              <button
                type="button"
                className={`px-4 py-2 border rounded ${
                  formData.eventType === "Free" ? "bg-gray-700 text-white" : "bg-white"
                }`}
                onClick={() => setFormData({ ...formData, eventType: "Free" })}
              >
                Free
              </button>
              <button
                type="button"
                className={`px-4 py-2 border rounded ${
                  formData.eventType === "Paid" ? "bg-gray-700 text-white" : "bg-white"
                }`}
                onClick={() => setFormData({ ...formData, eventType: "Paid" })}
              >
                Paid
              </button>
            </div>
          </div>

          {/* Event Mode */}
          <div>
            <label className="block font-semibold text-gray-700">Event Mode *</label>
            <select
              name="eventMode"
              value={formData.eventMode}
              onChange={handleChange}
              className="w-full p-2 border rounded mt-1"
              required
            >
              <option value="">Select...</option>
              <option value="In-Person">In-Person</option>
              <option value="Online">Online</option>
            </select>
          </div>

          {/* Currency */}
          <div>
            <label className="block font-semibold text-gray-700">Currency *</label>
            <input
              type="text"
              name="currency"
              value={formData.currency}
              onChange={handleChange}
              className="w-full p-2 border rounded mt-1"
              placeholder="Enter Currency (e.g., INR, USD)"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-purple-800 text-white py-2 rounded-lg hover:bg-purple-900 transition"
          >
            Create Event
          </button>
        </form>
      </div>
    </div>
  );
}
