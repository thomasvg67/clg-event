// src/contexts/AuthEvent.jsx

import React, { createContext, useContext, useState } from 'react';
import { db } from '../lib/firebase'; // Firebase DB reference
import { collection, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';

// Create context
const EventContext = createContext();

// Custom hook to access the context
export const useEvent = () => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error('useEvent must be used within an EventProvider');
  }
  return context;
};

// EventProvider to wrap your app's components that need event data
export const EventProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Function to create an event
  const createEvent = async (eventDetails) => {
    setLoading(true);
    try {
      const eventRef = await addDoc(collection(db, 'events'), {
        eventName: eventDetails.eventName,
        date: eventDetails.date,
        startTime: eventDetails.startTime,
        endTime: eventDetails.endTime,
        eventType: eventDetails.eventType,
        status: eventDetails.status,
        poster: eventDetails.poster, // URL of the uploaded image
        venueId: eventDetails.venueId,
        description: eventDetails.description,
        createdAt: new Date(),
      });
      console.log('Event created with ID:', eventRef.id);
      setLoading(false);
    } catch (err) {
      console.error('Error creating event:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  // Function to update an event
  const updateEvent = async (eventId, updatedDetails) => {
    setLoading(true);
    try {
      const eventRef = doc(db, 'events', eventId);
      await updateDoc(eventRef, updatedDetails);
      console.log('Event updated successfully');
      setLoading(false);
    } catch (err) {
      console.error('Error updating event:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  // Function to delete an event
  const deleteEvent = async (eventId) => {
    setLoading(true);
    try {
      const eventRef = doc(db, 'events', eventId);
      await deleteDoc(eventRef);
      console.log('Event deleted successfully');
      setLoading(false);
    } catch (err) {
      console.error('Error deleting event:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <EventContext.Provider value={{ createEvent, updateEvent, deleteEvent, loading, error }}>
      {children}
    </EventContext.Provider>
  );
};
