
import { Facility, Booking, User } from './types';

export const MOCK_USERS: User[] = [
  { id: 'u1', name: 'John Doe', email: 'john@academia.edu', role: 'student' },
  { id: 'a1', name: 'Admin Jane', email: 'jane@admin.edu', role: 'admin' },
];

export const INITIAL_FACILITIES: Facility[] = [
  {
    id: 'F001',
    name: 'Main Theater',
    capacity: 500,
    equipment: ['Professional Sound System', 'Stage Lighting', '4K Projector', 'Retractable Screen'],
    description: 'The premier venue for performances, major seminars, and campus-wide events.',
    imageUrl: 'https://picsum.photos/seed/theater1/800/600',
    purpose: 'Theater'
  },
  {
    id: 'F002',
    name: 'Advanced Computing Lab',
    capacity: 35,
    equipment: ['RTX 4090 Workstations', 'Dual Monitors', 'Fiber Internet'],
    description: 'Specialized lab for AI development, graphic design, and cybersecurity research.',
    imageUrl: 'https://picsum.photos/seed/complab/800/600',
    purpose: 'Computer Lab'
  },
  {
    id: 'F003',
    name: 'Standard Classroom 201',
    capacity: 45,
    equipment: ['Whiteboard', 'Smart TV', 'Wi-Fi'],
    description: 'Standard medium-sized classroom suitable for daily lectures and group discussions.',
    imageUrl: 'https://picsum.photos/seed/class201/800/600',
    purpose: 'Classroom'
  },
  {
    id: 'F004',
    name: 'Multipurpose PE Hall',
    capacity: 300,
    equipment: ['Basketball Hoops', 'Volleyball Nets', 'Public Address System'],
    description: 'Large open hall for sports activities, physical education classes, and physical events.',
    imageUrl: 'https://picsum.photos/seed/pehall/800/600',
    purpose: 'PE Hall'
  },
  {
    id: 'F005',
    name: 'Cybersecurity Lab',
    capacity: 40,
    equipment: ['Linux Servers', 'Hardware Firewalls', 'Networking Gear'],
    description: 'Dedicated space for hands-on networking and security training.',
    imageUrl: 'https://picsum.photos/seed/cyberlab/800/600',
    purpose: 'Computer Lab'
  },
  {
    id: 'F006',
    name: 'Mini Theater 102',
    capacity: 80,
    equipment: ['Surround Sound', 'Comfortable Seating', 'HD Projector'],
    description: 'Intimate theater space for smaller presentations and film screenings.',
    imageUrl: 'https://picsum.photos/seed/minitheater/800/600',
    purpose: 'Theater'
  },
  {
    id: 'F007',
    name: 'Science Lecture Hall',
    capacity: 120,
    equipment: ['Lab Table', 'Document Camera', 'Tiered Seating'],
    description: 'Large lecture hall equipped for science demonstrations and major courses.',
    imageUrl: 'https://picsum.photos/seed/scilecture/800/600',
    purpose: 'Classroom'
  }
];

export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'b1',
    facilityId: 'F001',
    userId: 'u1',
    userName: 'John Doe',
    userRole: 'student',
    facilityName: 'Main Theater',
    date: '2024-05-20',
    startTime: '10:00',
    endTime: '12:00',
    purpose: 'Student Club Orientation',
    status: 'confirmed'
  }
];
