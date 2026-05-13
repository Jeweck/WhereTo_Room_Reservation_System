
import { Facility, Booking, User } from './types';

export const MOCK_USERS: User[] = [
  { id: 'u1', name: 'John Doe', email: 'john@academia.edu', role: 'student' },
  { id: 'a1', name: 'Admin Jane', email: 'jane@admin.edu', role: 'admin' },
];

export const INITIAL_FACILITIES: Facility[] = [
  // Classrooms
  {
    id: 'CR101',
    name: 'Room 101',
    capacity: 40,
    equipment: ['Whiteboard', 'Smart TV', 'Wi-Fi'],
    description: 'Standard classroom with TV and whiteboard.',
    imageUrl: 'https://picsum.photos/seed/class101/800/600',
    purpose: 'Classroom'
  },
  {
    id: 'CR102',
    name: 'Room 102',
    capacity: 35,
    equipment: ['Whiteboard', 'Projector', 'Wi-Fi'],
    description: 'Medium classroom with projector.',
    imageUrl: 'https://picsum.photos/seed/class102/800/600',
    purpose: 'Classroom'
  },
  {
    id: 'CR201',
    name: 'Room 201',
    capacity: 60,
    equipment: ['Large Whiteboard', 'Smart TV', 'Wi-Fi'],
    description: 'Large lecture room with high-capacity seating.',
    imageUrl: 'https://picsum.photos/seed/class201/800/600',
    purpose: 'Classroom'
  },
  // Theaters
  {
    id: 'TH-A',
    name: 'Theater A',
    capacity: 500,
    equipment: ['Sound System', 'Stage Lighting', 'Large Screen'],
    description: 'Main auditorium for grand events.',
    imageUrl: 'https://picsum.photos/seed/theaterA/800/600',
    purpose: 'Theater'
  },
  {
    id: 'TH-B',
    name: 'Theater B',
    capacity: 150,
    equipment: ['Surround Sound', 'Smart TV', 'Tiered Seating'],
    description: 'Small theater for presentations.',
    imageUrl: 'https://picsum.photos/seed/theaterB/800/600',
    purpose: 'Theater'
  },
  // PE Halls
  {
    id: 'PE-H1',
    name: 'PE Hall 1',
    capacity: 300,
    equipment: ['Basketball Hoops', 'Scoreboard'],
    description: 'General sports facility.',
    imageUrl: 'https://picsum.photos/seed/gym1/800/600',
    purpose: 'PE Hall'
  },
  // Computer Labs
  {
    id: 'CL301',
    name: 'Lab 301',
    capacity: 35,
    equipment: ['35 PCs', 'High-speed Internet', 'Smart TV'],
    description: 'Primary programming lab.',
    imageUrl: 'https://picsum.photos/seed/lab301/800/600',
    purpose: 'Computer Lab'
  },
  {
    id: 'CL302',
    name: 'Lab 302',
    capacity: 40,
    equipment: ['40 PCs', 'Projector', 'Wi-Fi'],
    description: 'Hardware and networking lab.',
    imageUrl: 'https://picsum.photos/seed/lab302/800/600',
    purpose: 'Computer Lab'
  }
];

export const INITIAL_BOOKINGS: Booking[] = [];
