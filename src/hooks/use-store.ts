
"use client"

import { useState, useEffect } from 'react';
import { User, Facility, Booking, Role } from '@/lib/types';
import { INITIAL_FACILITIES, INITIAL_BOOKINGS } from '@/lib/mock-data';

export function useStore() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [facilities, setFacilities] = useState<Facility[]>(INITIAL_FACILITIES);
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);

  useEffect(() => {
    const savedUser = localStorage.getItem('whereto_user');
    if (savedUser) setCurrentUser(JSON.parse(savedUser));
    
    const savedFacilities = localStorage.getItem('whereto_facilities');
    if (savedFacilities) setFacilities(JSON.parse(savedFacilities));

    const savedBookings = localStorage.getItem('whereto_bookings');
    if (savedBookings) setBookings(JSON.parse(savedBookings));
  }, []);

  const loginWithEmail = (email: string, displayName?: string | null) => {
    // Role logic: Check for "ADMIN" in the email prefix
    const emailPrefix = email.split('@')[0].toUpperCase();
    const isAdmin = emailPrefix.includes('ADMIN');
    const role: Role = isAdmin ? 'admin' : 'student';
    
    let name = displayName || '';
    
    if (!name) {
      // If the email is just a student ID (numbers only)
      if (/^\d+$/.test(emailPrefix.replace('ADMIN', ''))) {
        name = isAdmin ? 'Administrator' : 'Gordon College Student';
      } else {
        // Clean up email prefix for names like "john.doe"
        name = emailPrefix
          .replace(/\d+/g, '') // Remove numbers
          .replace('ADMIN', '') // Remove admin tag
          .split(/[._-]/)      // Split by common separators
          .filter(Boolean)
          .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
          .join(' ') || (isAdmin ? 'Admin User' : 'Gordon College User');
      }
    }

    const user: User = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      email,
      role
    };
    setCurrentUser(user);
    localStorage.setItem('whereto_user', JSON.stringify(user));
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('whereto_user');
  };

  const addBooking = (booking: Booking) => {
    const newBookings = [...bookings, booking];
    setBookings(newBookings);
    localStorage.setItem('whereto_bookings', JSON.stringify(newBookings));
  };

  const cancelBooking = (id: string) => {
    const newBookings = bookings.map(b => b.id === id ? { ...b, status: 'cancelled' as const } : b);
    setBookings(newBookings);
    localStorage.setItem('whereto_bookings', JSON.stringify(newBookings));
  };

  const approveBooking = (id: string) => {
    const newBookings = bookings.map(b => b.id === id ? { ...b, status: 'confirmed' as const } : b);
    setBookings(newBookings);
    localStorage.setItem('whereto_bookings', JSON.stringify(newBookings));
  };

  const upsertFacility = (facility: Facility) => {
    const exists = facilities.find(f => f.id === facility.id);
    let newFacilities;
    if (exists) {
      newFacilities = facilities.map(f => f.id === facility.id ? facility : f);
    } else {
      newFacilities = [...facilities, facility];
    }
    setFacilities(newFacilities);
    localStorage.setItem('whereto_facilities', JSON.stringify(newFacilities));
  };

  const deleteFacility = (id: string) => {
    const newFacilities = facilities.filter(f => f.id !== id);
    setFacilities(newFacilities);
    localStorage.setItem('whereto_facilities', JSON.stringify(newFacilities));
  };

  return {
    currentUser,
    facilities,
    bookings,
    loginWithEmail,
    logout,
    addBooking,
    cancelBooking,
    approveBooking,
    upsertFacility,
    deleteFacility
  };
}
