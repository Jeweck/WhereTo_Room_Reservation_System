
'use client';

import React, { createContext, useContext } from 'react';
import { FirebaseApp } from 'firebase/app';
import { Firestore } from 'firebase/firestore';
import { Auth } from 'firebase/auth';

interface FirebaseContextType {
  firebaseApp: FirebaseApp | null;
  firestore: Firestore | null;
  auth: Auth | null;
}

const FirebaseContext = createContext<FirebaseContextType>({
  firebaseApp: null,
  firestore: null,
  auth: null,
});

export function FirebaseProvider({
  children,
  firebaseApp,
  firestore,
  auth,
}: {
  children: React.ReactNode;
  firebaseApp: FirebaseApp;
  firestore: Firestore;
  auth: Auth;
}) {
  return (
    <FirebaseContext.Provider value={{ firebaseApp, firestore, auth }}>
      {children}
    </FirebaseContext.Provider>
  );
}

export const useFirebaseApp = () => {
  const context = useContext(FirebaseContext);
  if (!context.firebaseApp) throw new Error('FirebaseApp not initialized');
  return context.firebaseApp;
};

export const useFirestore = () => {
  const context = useContext(FirebaseContext);
  if (!context.firestore) throw new Error('Firestore not initialized');
  return context.firestore;
};

export const useAuth = () => {
  const context = useContext(FirebaseContext);
  // This hook returns the Auth instance, not the current user.
  // We use useAuth().currentUser for simple checks if needed, 
  // or a dedicated useUser hook for reactive user state.
  return context.auth;
};
