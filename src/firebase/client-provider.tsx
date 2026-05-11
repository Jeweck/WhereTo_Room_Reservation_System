
'use client';

import React, { useMemo } from 'react';
import { initializeFirebase } from './setup';
import { FirebaseProvider } from './provider';

/**
 * FirebaseClientProvider handles the initialization of Firebase on the client side.
 * This prevents non-serializable Firebase objects from being passed across the 
 * server-client boundary, which causes Next.js hydration errors.
 */
export function FirebaseClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // Initialize Firebase once on the client
  const { firebaseApp, firestore, auth } = useMemo(() => initializeFirebase(), []);

  return (
    <FirebaseProvider firebaseApp={firebaseApp} firestore={firestore} auth={auth}>
      {children}
    </FirebaseProvider>
  );
}
