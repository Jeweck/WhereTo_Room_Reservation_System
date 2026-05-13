
"use client"

import { useState, useEffect } from 'react';
import { User, Facility, Booking, Role } from '@/lib/types';
import { INITIAL_FACILITIES } from '@/lib/mock-data';
import { 
  useFirestore, 
  useAuth, 
  useCollection 
} from '@/firebase';
import { 
  doc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  collection, 
  writeBatch
} from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export function useStore() {
  const db = useFirestore();
  const auth = useAuth();
  
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const facilitiesQuery = db ? collection(db, 'facilities') : null;
  const { data: facilitiesData } = useCollection<Facility>(facilitiesQuery);
  const facilities = facilitiesData || INITIAL_FACILITIES;

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
    
    if (db && user.id) {
      const userRef = doc(db, 'users', user.id);
      setDoc(userRef, user, { merge: true })
        .catch(async () => {
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
    setDoc(bookingRef, booking)
      .catch(async () => {
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
    updateDoc(bookingRef, { status: 'cancelled' })
      .catch(async () => {
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
    updateDoc(bookingRef, { status: 'confirmed' })
      .catch(async () => {
        errorEmitter.emit('permission-error', new FirestorePermissionError({
          path: bookingRef.path,
          operation: 'update',
          requestResourceData: { status: 'confirmed' }
        }));
      });
  };

  const clearAllBookings = async () => {
    if (!db || !bookings.length) return;
    const batch = writeBatch(db);
    bookings.forEach((b) => {
      batch.delete(doc(db, 'bookings', b.id));
    });
    batch.commit()
      .catch(async () => {
        errorEmitter.emit('permission-error', new FirestorePermissionError({
          path: '/bookings',
          operation: 'delete'
        }));
      });
  };

  const upsertFacility = (facility: Facility) => {
    if (!db) return;
    const facilityRef = doc(db, 'facilities', facility.id);
    setDoc(facilityRef, facility, { merge: true })
      .catch(async () => {
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
    deleteDoc(facilityRef)
      .catch(async () => {
        errorEmitter.emit('permission-error', new FirestorePermissionError({
          path: facilityRef.path,
          operation: 'delete'
        }));
      });
  };

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
