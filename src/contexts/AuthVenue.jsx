// src/contexts/AuthVenue.jsx

import React, { createContext, useContext, useState } from 'react';
import { db } from '../lib/firebase'; // Make sure your Firebase DB reference is set correctly
import { collection, addDoc } from 'firebase/firestore';

// Create context
const VenueContext = createContext();

// Custom hook to access the context
export const useVenue = () => {
  const context = useContext(VenueContext);
  if (!context) {
    throw new Error('useVenue must be used within a VenueProvider');
  }
  return context;
};

// VenueProvider to wrap your app's components that need the venue data
export const VenueProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createVenue = async (venueDetails) => {
    setLoading(true); // Start loading when making the request
    try {
      // Save the venue data to Firestore
      const venueRef = await addDoc(collection(db, 'venues'), {
        name: venueDetails.name,
        location: venueDetails.location,
        capacity: venueDetails.capacity,
        roomNo: venueDetails.roomNo,
        details: venueDetails.details,
        createdAt: new Date(), // Capture the creation date
      });

      console.log('Venue created with ID:', venueRef.id); // Log venue ID on successful creation

      setLoading(false); // Stop loading once the data is saved
    } catch (err) {
      console.error("Error creating venue:", err);
      setError(err.message); // Set error state in case of failure
      setLoading(false); // Stop loading in case of failure
    }
  };

  return (
    <VenueContext.Provider value={{ createVenue, loading, error }}>
      {children}
    </VenueContext.Provider>
  );
};
