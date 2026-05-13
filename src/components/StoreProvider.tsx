'use client';

import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import { User, Facility, Booking, Role } from '@/lib/types';
import { INITIAL_FACILITIES } from '@/lib/mock-data';
import { useFirestore, useAuth, useCollection } from '@/firebase';
import { doc, setDoc, updateDoc, deleteDoc, collection, writeBatch, serverTimestamp } from 'firebase/firestore';
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

  // Stabilize query references using useMemo
  const facilitiesRef = useMemo(() => (db ? collection(db, 'facilities') : null), [db]);
  const bookingsRef = useMemo(() => (db ? collection(db, 'bookings') : null), [db]);

  const { data: facilitiesData, loading: fLoading } = useCollection<Facility>(facilitiesRef);
  const { data: bookingsData, loading: bLoading } = useCollection<Booking>(bookingsRef);

  // Hydrate facilities with mock data if Firestore is empty
  const facilities = useMemo(() => {
    if (!fLoading && facilitiesData && facilitiesData.length > 0) return facilitiesData;
    return INITIAL_FACILITIES;
  }, [facilitiesData, fLoading]);

  const bookings = useMemo(() => bookingsData || [], [bookingsData]);

  // Load user from local storage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('whereto_user');
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('whereto_user');
      }
    }
  }, []);

  // Seed initial data once
  useEffect(() => {
    if (db && !fLoading && facilitiesData?.length === 0) {
      INITIAL_FACILITIES.forEach(f => {
        const facilityRef = doc(db, 'facilities', f.id);
        setDoc(facilityRef, f).catch(() => {});
      });
    }
  }, [db, facilitiesData, fLoading]);

  const loginWithEmail = useCallback((email: string, displayName?: string | null) => {
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
      setDoc(userRef, user, { merge: true }).catch(async () => {
        errorEmitter.emit('permission-error', new FirestorePermissionError({
          path: userRef.path,
          operation: 'write',
          requestResourceData: user
        }));
      });
    }
  }, [db, auth]);

  const logout = useCallback(() => {
    setCurrentUser(null);
    localStorage.removeItem('whereto_user');
    auth?.signOut().catch(() => {});
  }, [auth]);

  const addBooking = useCallback((booking: Booking) => {
    if (!db) return;
    const bookingRef = doc(db, 'bookings', booking.id);
    setDoc(bookingRef, {
      ...booking,
      createdAt: serverTimestamp() // Add server side timestamp for sorting
    }).catch(async () => {
      errorEmitter.emit('permission-error', new FirestorePermissionError({
        path: bookingRef.path,
        operation: 'create',
        requestResourceData: booking
      }));
    });
  }, [db]);

  const cancelBooking = useCallback((id: string) => {
    if (!db) return;
    const bookingRef = doc(db, 'bookings', id);
    updateDoc(bookingRef, { status: 'cancelled' }).catch(async () => {
      errorEmitter.emit('permission-error', new FirestorePermissionError({
        path: bookingRef.path,
        operation: 'update',
        requestResourceData: { status: 'cancelled' }
      }));
    });
  }, [db]);

  const approveBooking = useCallback((id: string) => {
    if (!db) return;
    const bookingRef = doc(db, 'bookings', id);
    updateDoc(bookingRef, { status: 'confirmed' }).catch(async () => {
      errorEmitter.emit('permission-error', new FirestorePermissionError({
        path: bookingRef.path,
        operation: 'update',
        requestResourceData: { status: 'confirmed' }
      }));
    });
  }, [db]);

  const clearAllBookings = useCallback(() => {
    if (!db || !bookings.length) return;
    const batch = writeBatch(db);
    bookings.forEach((b) => {
      batch.delete(doc(db, 'bookings', b.id));
    });
    batch.commit().catch(async () => {
      errorEmitter.emit('permission-error', new FirestorePermissionError({
        path: '/bookings',
        operation: 'delete'
      }));
    });
  }, [db, bookings]);

  const upsertFacility = useCallback((facility: Facility) => {
    if (!db) return;
    const facilityRef = doc(db, 'facilities', facility.id);
    setDoc(facilityRef, facility, { merge: true }).catch(async () => {
      errorEmitter.emit('permission-error', new FirestorePermissionError({
        path: facilityRef.path,
        operation: 'write',
        requestResourceData: facility
      }));
    });
  }, [db]);

  const deleteFacility = useCallback((id: string) => {
    if (!db) return;
    const facilityRef = doc(db, 'facilities', id);
    deleteDoc(facilityRef).catch(async () => {
      errorEmitter.emit('permission-error', new FirestorePermissionError({
        path: facilityRef.path,
        operation: 'delete'
      }));
    });
  }, [db]);

  const value = useMemo(() => ({
    currentUser, 
    facilities, 
    bookings, 
    loading: fLoading || bLoading,
    loginWithEmail, 
    logout, 
    addBooking, 
    cancelBooking, 
    approveBooking,
    clearAllBookings, 
    upsertFacility, 
    deleteFacility
  }), [currentUser, facilities, bookings, fLoading, bLoading, loginWithEmail, logout, addBooking, cancelBooking, approveBooking, clearAllBookings, upsertFacility, deleteFacility]);

  return (
    <StoreContext.Provider value={value}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStoreContext() {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStoreContext must be used within StoreProvider');
  return context;
}