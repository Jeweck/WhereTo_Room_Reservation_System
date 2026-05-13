
"use client"

import { useState, useEffect } from 'react';
import { User, Facility, Booking, Role } from '@/lib/types';
import { INITIAL_FACILITIES } from '@/lib/mock-data';
import { 
  useFirestore, 
  useAuth, 
  useCollection, 
  useDoc 
} from '@/firebase';
import { 
  doc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  collection, 
  query, 
  where,
  writeBatch
} from 'firebase/firestore';

export function useStore() {
  const db = useFirestore();
  const auth = useAuth();
  
  // Local state for the current logged-in user
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Sync Facilities from Firestore
  const facilitiesQuery = db ? collection(db, 'facilities') : null;
  const { data: facilitiesData } = useCollection<Facility>(facilitiesQuery);
  const facilities = facilitiesData || INITIAL_FACILITIES;

  // Sync Bookings from Firestore
  const bookingsQuery = db ? collection(db, 'bookings') : null;
  const { data: bookingsData } = useCollection<Booking>(bookingsQuery);
  const bookings = bookingsData || [];

  useEffect(() => {
    const savedUser = localStorage.getItem('whereto_user');
    if (savedUser) setCurrentUser(JSON.parse(savedUser));
  }, []);

  const loginWithEmail = (email: string, displayName?: string | null) => {
    const emailPrefix = email.split('@')[0].toUpperCase();
    const isAdmin = emailPrefix.includes('ADMIN');
    const role: Role = isAdmin ? 'admin' : 'student';
    
    let name = displayName || '';
    
    if (!name) {
      if (/^\d+$/.test(emailPrefix.replace('ADMIN', ''))) {
        name = isAdmin ? 'Administrator' : 'Gordon College Student';
      } else {
        name = emailPrefix
          .replace(/\d+/g, '')
          .replace('ADMIN', '')
          .split(/[._-]/)
          .filter(Boolean)
          .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
          .join(' ') || (isAdmin ? 'Admin User' : 'Gordon College User');
      }
    }

    const user: User = {
      id: auth?.currentUser?.uid || Math.random().toString(36).substr(2, 9),
      name,
      email,
      role
    };

    setCurrentUser(user);
    localStorage.setItem('whereto_user', JSON.stringify(user));
    
    // Also save user profile to Firestore
    if (db && user.id) {
      setDoc(doc(db, 'users', user.id), user, { merge: true });
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('whereto_user');
    auth?.signOut();
  };

  const addBooking = (booking: Booking) => {
    if (!db) return;
    setDoc(doc(db, 'bookings', booking.id), booking);
  };

  const cancelBooking = (id: string) => {
    if (!db) return;
    updateDoc(doc(db, 'bookings', id), { status: 'cancelled' });
  };

  const approveBooking = (id: string) => {
    if (!db) return;
    updateDoc(doc(db, 'bookings', id), { status: 'confirmed' });
  };

  const clearAllBookings = async () => {
    if (!db || !bookings.length) return;
    const batch = writeBatch(db);
    bookings.forEach((b) => {
      batch.delete(doc(db, 'bookings', b.id));
    });
    await batch.commit();
  };

  const upsertFacility = (facility: Facility) => {
    if (!db) return;
    setDoc(doc(db, 'facilities', facility.id), facility, { merge: true });
  };

  const deleteFacility = (id: string) => {
    if (!db) return;
    deleteDoc(doc(db, 'facilities', id));
  };

  // One-time initialization to seed facilities if collection is empty
  useEffect(() => {
    if (db && facilitiesData?.length === 0) {
      INITIAL_FACILITIES.forEach(f => {
        setDoc(doc(db, 'facilities', f.id), f);
      });
    }
  }, [db, facilitiesData]);

  return {
    currentUser,
    facilities,
    bookings,
    loginWithEmail,
    logout,
    addBooking,
    cancelBooking,
    approveBooking,
    clearAllBookings,
    upsertFacility,
    deleteFacility
  };
}
