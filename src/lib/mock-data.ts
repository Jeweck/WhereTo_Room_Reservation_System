
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
    description: 'Standard classroom for lectures and seminars.',
    imageUrl: 'https://picsum.photos/seed/class101/800/600',
    purpose: 'Classroom'
  },
  {
    id: 'CR102',
    name: 'Room 102',
    capacity: 40,
    equipment: ['Whiteboard', 'Projector', 'Wi-Fi'],
    description: 'Standard classroom for lectures and seminars.',
    imageUrl: 'https://picsum.photos/seed/class102/800/600',
    purpose: 'Classroom'
  },
  {
    id: 'CR201',
    name: 'Room 201',
    capacity: 60,
    equipment: ['Large Whiteboard', 'Dual Projectors', 'Sound System'],
    description: 'Large lecture room for major classes.',
    imageUrl: 'https://picsum.photos/seed/class201/800/600',
    purpose: 'Classroom'
  },
  {
    id: 'CR202',
    name: 'Room 202',
    capacity: 60,
    equipment: ['Large Whiteboard', 'Dual Projectors', 'Sound System'],
    description: 'Large lecture room for major classes.',
    imageUrl: 'https://picsum.photos/seed/class202/800/600',
    purpose: 'Classroom'
  },
  // Theaters
  {
    id: 'TH-A',
    name: 'Theater A',
    capacity: 500,
    equipment: ['Professional Sound System', 'Stage Lighting', '4K Projector'],
    description: 'Main auditorium for performances and grand events.',
    imageUrl: 'https://picsum.photos/seed/theaterA/800/600',
    purpose: 'Theater'
  },
  {
    id: 'TH-B',
    name: 'Theater B',
    capacity: 150,
    equipment: ['Surround Sound', 'HD Projector', 'Tiered Seating'],
    description: 'Mini-theater for film screenings and small presentations.',
    imageUrl: 'https://picsum.photos/seed/theaterB/800/600',
    purpose: 'Theater'
  },
  // PE Halls
  {
    id: 'PE-H1',
    name: 'PE Hall 1',
    capacity: 300,
    equipment: ['Basketball Hoops', 'Volleyball Nets', 'PA System'],
    description: 'Primary sports and physical education facility.',
    imageUrl: 'https://picsum.photos/seed/gym1/800/600',
    purpose: 'PE Hall'
  },
  // Computer Labs
  {
    id: 'CL301',
    name: 'Lab 301',
    capacity: 35,
    equipment: ['35 Workstations', 'High-speed Internet', 'Projector'],
    description: 'Computer laboratory for programming and IT classes.',
    imageUrl: 'https://picsum.photos/seed/lab301/800/600',
    purpose: 'Computer Lab'
  },
  {
    id: 'CL302',
    name: 'Lab 302',
    capacity: 35,
    equipment: ['35 Workstations', 'High-speed Internet', 'Projector'],
    description: 'Specialized laboratory for networking and hardware training.',
    imageUrl: 'https://picsum.photos/seed/lab302/800/600',
    purpose: 'Computer Lab'
  }
];

export const INITIAL_BOOKINGS: Booking[] = [];
