
'use client';

import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { User, Facility, Booking, Role } from '@/lib/types';
import { INITIAL_FACILITIES } from '@/lib/mock-data';
import { useFirestore, useAuth, useCollection } from '@/firebase';
import { doc, setDoc, updateDoc, deleteDoc, collection, writeBatch, query } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

interface StoreContextType {
  currentUser: User | null;
  facilities: Facility[];
  bookings: Booking[];
  loading: boolean;
  loginWithEmail: (email: string, displayName?: string | null) => void;
  logout: () => void;
  addBooking: (booking: Booking) => void;
  cancelBooking: (id: string) => void;
  approveBooking: (id: string) => void;
  clearAllBookings: () => void;
  upsertFacility: (facility: Facility) => void;
  deleteFacility: (id: string) => void;
}

const StoreContext = createContext<StoreContextType | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const db = useFirestore();
  const auth = useAuth();
  
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Queries are memoized and kept at the top level to prevent re-subscriptions
  const facilitiesQuery = useMemo(() => (db ? query(collection(db, 'facilities')) : null), [db]);
  const bookingsQuery = useMemo(() => (db ? query(collection(db, 'bookings')) : null), [db]);

  const { data: facilitiesData, loading: fLoading } = useCollection<Facility>(facilitiesQuery);
  const { data: bookingsData, loading: bLoading } = useCollection<Booking>(bookingsQuery);

  const facilities = facilitiesData && facilitiesData.length > 0 ? facilitiesData : INITIAL_FACILITIES;
  const bookings = bookingsData || [];

  useEffect(() => {
    const savedUser = localStorage.getItem('whereto_user');
    if (savedUser) setCurrentUser(JSON.parse(savedUser));
  }, []);

  // Seeding initial facilities
  useEffect(() => {
    if (db && facilitiesData?.length === 0) {
      INITIAL_FACILITIES.forEach(f => {
        const facilityRef = doc(db, 'facilities', f.id);
        setDoc(facilityRef, f).catch(() => {});
      });
    }
  }, [db, facilitiesData]);

  const loginWithEmail = (email: string, displayName?: string | null) => {
    const emailPrefix = email.split('@')[0].toUpperCase();
    const isAdmin = emailPrefix.includes('ADMIN');
    const role: Role = isAdmin ? 'admin' : 'student';
    
    const user: User = {
      id: auth?.currentUser?.uid || `user_${Math.random().toString(36).substr(2, 9)}`,
      name: displayName || email.split('@')[0],
      email,
      role
    };

    setCurrentUser(user);
    localStorage.setItem('whereto_user', JSON.stringify(user));
    
    if (db) {
      const userRef = doc(db, 'users', user.id);
      setDoc(userRef, user, { merge: true }).catch(() => {
        errorEmitter.emit('permission-error', new FirestorePermissionError({
          path: userRef.path,
          operation: 'write',
          requestResourceData: user
        }));
      });
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('whereto_user');
    auth?.signOut();
  };

  const addBooking = (booking: Booking) => {
    if (!db) return;
    const bookingRef = doc(db, 'bookings', booking.id);
    setDoc(bookingRef, booking).catch(() => {
      errorEmitter.emit('permission-error', new FirestorePermissionError({
        path: bookingRef.path,
        operation: 'create',
        requestResourceData: booking
      }));
    });
  };

  const cancelBooking = (id: string) => {
    if (!db) return;
    const bookingRef = doc(db, 'bookings', id);
    updateDoc(bookingRef, { status: 'cancelled' }).catch(() => {
      errorEmitter.emit('permission-error', new FirestorePermissionError({
        path: bookingRef.path,
        operation: 'update',
        requestResourceData: { status: 'cancelled' }
      }));
    });
  };

  const approveBooking = (id: string) => {
    if (!db) return;
    const bookingRef = doc(db, 'bookings', id);
    updateDoc(bookingRef, { status: 'confirmed' }).catch(() => {
      errorEmitter.emit('permission-error', new FirestorePermissionError({
        path: bookingRef.path,
        operation: 'update',
        requestResourceData: { status: 'confirmed' }
      }));
    });
  };

  const clearAllBookings = () => {
    if (!db || !bookings.length) return;
    const batch = writeBatch(db);
    bookings.forEach((b) => {
      batch.delete(doc(db, 'bookings', b.id));
    });
    batch.commit().catch(() => {
      errorEmitter.emit('permission-error', new FirestorePermissionError({
        path: '/bookings',
        operation: 'delete'
      }));
    });
  };

  const upsertFacility = (facility: Facility) => {
    if (!db) return;
    const facilityRef = doc(db, 'facilities', facility.id);
    setDoc(facilityRef, facility, { merge: true }).catch(() => {
      errorEmitter.emit('permission-error', new FirestorePermissionError({
        path: facilityRef.path,
        operation: 'write',
        requestResourceData: facility
      }));
    });
  };

  const deleteFacility = (id: string) => {
    if (!db) return;
    const facilityRef = doc(db, 'facilities', id);
    deleteDoc(facilityRef).catch(() => {
      errorEmitter.emit('permission-error', new FirestorePermissionError({
        path: facilityRef.path,
        operation: 'delete'
      }));
    });
  };

  return (
    <StoreContext.Provider value={{
      currentUser, facilities, bookings, loading: fLoading || bLoading,
      loginWithEmail, logout, addBooking, cancelBooking, approveBooking,
      clearAllBookings, upsertFacility, deleteFacility
    }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStoreContext() {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStoreContext must be used within StoreProvider');
  return context;
}
