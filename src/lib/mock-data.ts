
import { Facility, Booking } from './types';

export const INITIAL_FACILITIES: Facility[] = [
  // Classrooms
  {
    id: 'R101',
    name: 'Room 101',
    capacity: 40,
    equipment: ['Whiteboard', 'Smart TV', 'Wi-Fi'],
    description: 'Standard classroom with TV and whiteboard.',
    imageUrl: '',
    purpose: 'Classroom'
  },
  {
    id: 'R102',
    name: 'Room 102',
    capacity: 35,
    equipment: ['Whiteboard', 'Projector', 'Wi-Fi'],
    description: 'Medium classroom with projector.',
    imageUrl: '',
    purpose: 'Classroom'
  },
  {
    id: 'R201',
    name: 'Room 201',
    capacity: 60,
    equipment: ['Large Whiteboard', 'Smart TV', 'Wi-Fi'],
    description: 'Large lecture room with high-capacity seating.',
    imageUrl: '',
    purpose: 'Classroom'
  },
  // Theaters
  {
    id: 'TH-01',
    name: 'Theater 1',
    capacity: 500,
    equipment: ['Sound System', 'Stage Lighting', 'Large Screen'],
    description: 'Main auditorium for grand events.',
    imageUrl: '',
    purpose: 'Theater'
  },
  {
    id: 'TH-02',
    name: 'Theater 2',
    capacity: 150,
    equipment: ['Surround Sound', 'Smart TV', 'Tiered Seating'],
    description: 'Small theater for presentations.',
    imageUrl: '',
    purpose: 'Theater'
  },
  // PE Halls
  {
    id: 'PE-01',
    name: 'PE Hall 1',
    capacity: 300,
    equipment: ['Basketball Hoops', 'Scoreboard'],
    description: 'General sports facility.',
    imageUrl: '',
    purpose: 'PE Hall'
  },
  // Computer Labs
  {
    id: 'CL-301',
    name: 'Lab 301',
    capacity: 35,
    equipment: ['35 PCs', 'High-speed Internet', 'Smart TV'],
    description: 'Primary programming lab.',
    imageUrl: '',
    purpose: 'Computer Lab'
  },
  {
    id: 'CL-302',
    name: 'Lab 302',
    capacity: 40,
    equipment: ['40 PCs', 'Projector', 'Wi-Fi'],
    description: 'Hardware and networking lab.',
    imageUrl: '',
    purpose: 'Computer Lab'
  }
];

export const INITIAL_BOOKINGS: Booking[] = [];
