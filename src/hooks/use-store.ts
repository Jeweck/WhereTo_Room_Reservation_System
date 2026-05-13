
'use client';

import { useStoreContext } from '@/components/StoreProvider';

/**
 * useStore Hook refactored to consume centralized StoreContext.
 * This prevents multiple redundant Firestore listeners and assertion errors.
 */
export function useStore() {
  return useStoreContext();
}
