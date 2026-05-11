
"use client"

import { useState, useEffect } from 'react';
import { User, Facility, Booking } from '@/lib/types';
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
    const isAdmin = email.includes('admin');
    let name = '';
    
    if (displayName) {
      name = displayName;
    } else {
      const emailName = email.split('@')[0].replace(/\d+/g, '').replace('admin', '') || 'GC User';
      name = isAdmin ? 'Admin User' : (emailName.charAt(0).toUpperCase() + emailName.slice(1) || 'Student');
    }

    const user: User = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      email,
      role: isAdmin ? 'admin' : 'user'
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
