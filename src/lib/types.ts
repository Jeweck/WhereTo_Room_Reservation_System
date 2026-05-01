
export type Role = 'admin' | 'user';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface Facility {
  id: string;
  name: string;
  capacity: number;
  equipment: string[];
  description: string;
  imageUrl: string;
  purpose: string;
}

export interface Booking {
  id: string;
  facilityId: string;
  userId: string;
  userName: string;
  facilityName: string;
  date: string;
  startTime: string;
  endTime: string;
  purpose: string;
  status: 'confirmed' | 'pending' | 'cancelled';
}

export interface AppState {
  currentUser: User | null;
  facilities: Facility[];
  bookings: Booking[];
}
