
"use client"

import { useState, useEffect } from 'react';
import { User, Facility, Booking } from '@/lib/types';
import { INITIAL_FACILITIES, INITIAL_BOOKINGS, MOCK_USERS } from '@/lib/mock-data';

export function useStore() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [facilities, setFacilities] = useState<Facility[]>(INITIAL_FACILITIES);
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);

  useEffect(() => {
    const savedUser = localStorage.getItem('academia_user');
    if (savedUser) setCurrentUser(JSON.parse(savedUser));
    
    const savedFacilities = localStorage.getItem('academia_facilities');
    if (savedFacilities) setFacilities(JSON.parse(savedFacilities));

    const savedBookings = localStorage.getItem('academia_bookings');
    if (savedBookings) setBookings(JSON.parse(savedBookings));
  }, []);

  const login = (role: 'admin' | 'user') => {
    const user = MOCK_USERS.find(u => u.role === role) || MOCK_USERS[0];
    setCurrentUser(user);
    localStorage.setItem('academia_user', JSON.stringify(user));
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('academia_user');
  };

  const addBooking = (booking: Booking) => {
    const newBookings = [...bookings, booking];
    setBookings(newBookings);
    localStorage.setItem('academia_bookings', JSON.stringify(newBookings));
  };

  const cancelBooking = (id: string) => {
    const newBookings = bookings.map(b => b.id === id ? { ...b, status: 'cancelled' as const } : b);
    setBookings(newBookings);
    localStorage.setItem('academia_bookings', JSON.stringify(newBookings));
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
    localStorage.setItem('academia_facilities', JSON.stringify(newFacilities));
  };

  const deleteFacility = (id: string) => {
    const newFacilities = facilities.filter(f => f.id !== id);
    setFacilities(newFacilities);
    localStorage.setItem('academia_facilities', JSON.stringify(newFacilities));
  };

  return {
    currentUser,
    facilities,
    bookings,
    login,
    logout,
    addBooking,
    cancelBooking,
    upsertFacility,
    deleteFacility
  };
}
