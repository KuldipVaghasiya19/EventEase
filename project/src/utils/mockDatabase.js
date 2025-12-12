import { v4 as uuidv4 } from 'uuid';

// --- MOCK DATA STORE (In-Memory) ---
// Note: This data will reset upon page refresh as it's not truly persisted.

export let mockEvents = [
  {
    id: 'e1',
    name: 'Tech Innovation Summit',
    description: 'A summit focused on the future of AI and software development. Join industry leaders and innovators.',
    date: '2026-01-15',
    time: '10:00 AM',
    location: 'Convention Center Hall A',
    total_seats: 500,
    available_seats: 450,
  },
  {
    id: 'e2',
    name: 'Local Music Festival',
    description: 'An outdoor festival featuring local bands and food trucks. Enjoy a day of great music!',
    date: '2026-02-20',
    time: '06:00 PM',
    location: 'City Park Amphitheater',
    total_seats: 1000,
    available_seats: 0, // Sold Out for testing
  },
  {
    id: 'e3',
    name: 'Art Exhibition Opening',
    description: 'The grand opening of the "Modern Visions" art exhibition. A blend of contemporary and abstract art.',
    date: '2026-03-10',
    time: '07:00 PM',
    location: 'Downtown Art Gallery',
    total_seats: 150,
    available_seats: 120,
  },
];

export const mockUsers = [
  { id: 'u_admin', email: 'admin@mock.com', username: 'AdminMock', role: 'admin', password: 'password' },
  { id: 'u_user', email: 'user@mock.com', username: 'UserMock', role: 'user', password: 'password' },
];

export let mockBookings = [
    {
        id: uuidv4(),
        user_id: 'u_user', // Matches the mock user
        event_id: 'e1',
        seats_booked: 2,
        booking_date: new Date('2025-12-10').toISOString(),
        events: { // Denormalized data for easy display in MyBookings
            id: 'e1',
            name: 'Tech Innovation Summit',
            date: '2026-01-15',
            time: '10:00 AM',
            location: 'Convention Center Hall A',
        }
    }
];

export { uuidv4 };