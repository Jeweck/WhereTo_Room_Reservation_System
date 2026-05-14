
'use client';

import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import { User, Facility, Booking, Role } from '@/lib/types';
import { INITIAL_FACILITIES } from '@/lib/mock-data';
import { useFirestore, useAuth, useCollection } from '@/firebase';
import { doc, setDoc, updateDoc, deleteDoc, collection, writeBatch, serverTimestamp, getDoc } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

interface StoreContextType {
  currentUser: User | null;
  facilities: Facility[];
  bookings: Booking[];
  loading: boolean;
  loginWithEmail: (email: string, displayName?: string | null) => Promise<void>;
  logout: () => void;
  addBooking: (booking: Booking) => void;
  cancelBooking: (id: string) => void;
  approveBooking: (id: string) => void;
  clearAllBookings: () => void;
  upsertFacility: (facility: Facility) => void;
  deleteFacility: (id: string) => void;
  updateProfile: (name: string) => void;
}

const StoreContext = createContext<StoreContextType | null>(null);

const isTimeOverlap = (s1: string, e1: string, s2: string, e2: string) => {
  return s1 < e2 && e1 > s2;
};

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const db = useFirestore();
  const auth = useAuth();
  
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const facilitiesRef = useMemo(() => (db ? collection(db, 'facilities') : null), [db]);
  const bookingsRef = useMemo(() => (db ? collection(db, 'bookings') : null), [db]);

  const { data: facilitiesData, loading: fLoading } = useCollection<Facility>(facilitiesRef);
  const { data: bookingsData, loading: bLoading } = useCollection<Booking>(bookingsRef);

  const facilities = useMemo(() => {
    if (!fLoading && facilitiesData && facilitiesData.length > 0) return facilitiesData;
    return INITIAL_FACILITIES;
  }, [facilitiesData, fLoading]);

  const bookings = useMemo(() => bookingsData || [], [bookingsData]);

  // Restore session from local storage
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

  // Initialize facilities if empty
  useEffect(() => {
    if (db && !fLoading && facilitiesData?.length === 0) {
      INITIAL_FACILITIES.forEach(f => {
        const facilityRef = doc(db, 'facilities', f.id);
        setDoc(facilityRef, f).catch(() => {});
      });
    }
  }, [db, facilitiesData, fLoading]);

  const loginWithEmail = useCallback(async (email: string, displayName?: string | null) => {
    if (!db) return;
    
    const emailPrefix = email.split('@')[0].toUpperCase();
    const isAdmin = emailPrefix.includes('ADMIN');
    const role: Role = isAdmin ? 'admin' : 'student';
    const userId = auth?.currentUser?.uid || `user_${Math.random().toString(36).substr(2, 9)}`;
    
    // FETCH EXISTING PROFILE to ensure the name is persistent
    const userRef = doc(db, 'users', userId);
    const docSnap = await getDoc(userRef);
    
    let finalName = displayName || email.split('@')[0];
    if (docSnap.exists()) {
      finalName = docSnap.data().name || finalName;
    }

    const user: User = {
      id: userId,
      name: finalName,
      email,
      role
    };

    setCurrentUser(user);
    localStorage.setItem('whereto_user', JSON.stringify(user));
    
    // Ensure Firestore is updated with basic info if it's a new user
    setDoc(userRef, user, { merge: true }).catch(async () => {
      errorEmitter.emit('permission-error', new FirestorePermissionError({
        path: userRef.path,
        operation: 'write',
        requestResourceData: user
      }));
    });
  }, [db, auth]);

  const logout = useCallback(() => {
    setCurrentUser(null);
    localStorage.removeItem('whereto_user');
    auth?.signOut().catch(() => {});
  }, [auth]);

  const updateProfile = useCallback((name: string) => {
    if (!currentUser || !db) return;
    
    const updatedUser = { ...currentUser, name };
    setCurrentUser(updatedUser);
    localStorage.setItem('whereto_user', JSON.stringify(updatedUser));
    
    const userRef = doc(db, 'users', currentUser.id);
    updateDoc(userRef, { name }).catch(async () => {
      errorEmitter.emit('permission-error', new FirestorePermissionError({
        path: userRef.path,
        operation: 'update',
        requestResourceData: { name }
      }));
    });
  }, [currentUser, db]);

  const addBooking = useCallback((booking: Booking) => {
    if (!db) return;
    const bookingRef = doc(db, 'bookings', booking.id);
    setDoc(bookingRef, {
      ...booking,
      createdAt: serverTimestamp()
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
    
    const bookingToApprove = bookings.find(b => b.id === id);
    if (!bookingToApprove) return;

    const batch = writeBatch(db);

    const approvedRef = doc(db, 'bookings', id);
    batch.update(approvedRef, { status: 'confirmed' });

    // Conflict Resolution: Reject overlapping pending requests
    const conflicts = bookings.filter(b => 
      b.id !== id && 
      b.status === 'pending' && 
      b.facilityId === bookingToApprove.facilityId && 
      b.date === bookingToApprove.date && 
      isTimeOverlap(bookingToApprove.startTime, bookingToApprove.endTime, b.startTime, b.endTime)
    );

    conflicts.forEach(conflict => {
      const conflictRef = doc(db, 'bookings', conflict.id);
      batch.update(conflictRef, { status: 'cancelled' });
    });

    batch.commit().catch(async () => {
      errorEmitter.emit('permission-error', new FirestorePermissionError({
        path: '/bookings',
        operation: 'write',
        requestResourceData: { status: 'confirmed/cancelled_batch' }
      }));
    });
  }, [db, bookings]);

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
    deleteFacility,
    updateProfile
  }), [currentUser, facilities, bookings, fLoading, bLoading, loginWithEmail, logout, addBooking, cancelBooking, approveBooking, clearAllBookings, upsertFacility, deleteFacility, updateProfile]);

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
