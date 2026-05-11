
import { Facility, Booking, User } from './types';

export const MOCK_USERS: User[] = [
  { id: 'u1', name: 'John Doe', email: 'john@academia.edu', role: 'student' },
  { id: 'a1', name: 'Admin Jane', email: 'jane@admin.edu', role: 'admin' },
];

export const INITIAL_FACILITIES: Facility[] = [
  {
    id: 'F001',
    name: 'Grand Auditorium',
    capacity: 250,
    equipment: ['Projector', 'Surround Sound', 'Stage Lighting', 'Microphones'],
    description: 'Our largest venue for prestigious events and massive lectures.',
    imageUrl: 'https://picsum.photos/seed/aud/800/600',
    purpose: 'Events'
  },
  {
    id: 'F002',
    name: 'Executive Boardroom',
    capacity: 20,
    equipment: ['4K Monitor', 'Video Conferencing', 'Whiteboard'],
    description: 'Quiet, professional environment for important decisions.',
    imageUrl: 'https://picsum.photos/seed/conf/800/600',
    purpose: 'Meetings'
  },
  {
    id: 'F003',
    name: 'Cybersecurity Lab',
    capacity: 45,
    equipment: ['High-end PCs', 'Server Access', 'Fiber Internet'],
    description: 'Cutting-edge technology lab for engineering and CS students.',
    imageUrl: 'https://picsum.photos/seed/lab/800/600',
    purpose: 'Laboratory'
  },
  {
    id: 'F004',
    name: 'Zen Study Suite',
    capacity: 8,
    equipment: ['Whiteboard', 'Coffee Machine'],
    description: 'Perfect for deep-focus group sessions.',
    imageUrl: 'https://picsum.photos/seed/study/800/600',
    purpose: 'Study'
  },
  {
    id: 'F005',
    name: 'General Lecture Hall 101',
    capacity: 100,
    equipment: ['Projector', 'Sound System'],
    description: 'Standard large-format classroom for undergraduate courses.',
    imageUrl: 'https://picsum.photos/seed/class/800/600',
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
    facilityName: 'Grand Auditorium',
    date: '2024-05-20',
    startTime: '10:00',
    endTime: '12:00',
    purpose: 'Student Club Orientation',
    status: 'confirmed'
  },
  {
    id: 'b2',
    facilityId: 'F002',
    userId: 'a1',
    userName: 'Admin Jane',
    userRole: 'admin',
    facilityName: 'Executive Boardroom',
    date: '2024-05-21',
    startTime: '14:00',
    endTime: '16:00',
    purpose: 'Faculty Budget Meeting',
    status: 'confirmed'
  }
];
