# EventBooker - Event Ticket Booking System

A modern event ticket booking website built with React, Tailwind CSS, and Supabase. Features separate admin and user roles with comprehensive event management and booking capabilities.

## Features

### Admin Features
- Secure admin authentication (separate login/signup)
- Create, Read, Update, and Delete (CRUD) operations for events
- View dashboard with statistics (total events, bookings, users)
- Manage event details (name, description, date, time, location, seats, price)

### User Features
- Secure user authentication (separate login/signup)
- Browse upcoming events
- Book tickets for events
- View and manage bookings
- Cancel bookings
- Download tickets

### Design Features
- Professional and attractive UI with Tailwind CSS
- Hover effects on navbar links (color change and underline)
- Smooth animations for booking process (2-3 seconds)
- Animated ticket download with loading state
- Responsive design for all screen sizes
- Modern gradient backgrounds and card designs

## Tech Stack

- **Frontend Framework:** React 18
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **Routing:** React Router DOM
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth
- **Language:** JavaScript (No TypeScript)

## Project Structure

```
src/
├── components/
│   ├── common/
│   │   └── Navbar.jsx
│   ├── admin/
│   └── user/
│       ├── BookingModal.jsx
│       └── BookingSuccessModal.jsx
├── pages/
│   ├── admin/
│   │   ├── AdminLogin.jsx
│   │   ├── AdminSignup.jsx
│   │   ├── AdminDashboard.jsx
│   │   └── ManageEvents.jsx
│   ├── user/
│   │   ├── UserLogin.jsx
│   │   ├── UserSignup.jsx
│   │   ├── Events.jsx
│   │   └── MyBookings.jsx
│   └── Home.jsx
├── context/
│   └── AuthContext.jsx
├── utils/
│   └── supabaseClient.js
├── App.jsx
└── main.jsx
```

## Installation

1. Clone the repository
```bash
git clone <repository-url>
cd event-booking-system
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
   - Copy `.env.example` to `.env`
   - Add your Supabase credentials:
   ```
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Set up the database
   - Follow the instructions in `DATABASE_SETUP.md`
   - Run all SQL commands in your Supabase SQL Editor

5. Start the development server
```bash
npm run dev
```

## Database Setup

Please refer to `DATABASE_SETUP.md` for detailed instructions on setting up the Supabase database schema.

The database consists of three main tables:
- **users:** Stores user information and roles (admin/user)
- **events:** Stores event details
- **bookings:** Stores booking information

## Authentication

The application uses Supabase authentication with separate flows for admin and user roles:

- **Admin Routes:** `/admin/login`, `/admin/signup`
- **User Routes:** `/user/login`, `/user/signup`

Both login forms require:
- Email address
- Password

Both signup forms require:
- Username
- Email address
- Password
- Confirm Password

## Routes

### Public Routes
- `/` - Home page
- `/user/events` - Browse events (accessible without login)
- `/user/login` - User login
- `/user/signup` - User signup
- `/admin/login` - Admin login
- `/admin/signup` - Admin signup

### Protected Admin Routes
- `/admin/dashboard` - Admin dashboard with statistics
- `/admin/events` - Manage events (CRUD operations)

### Protected User Routes
- `/user/bookings` - View and manage bookings

## Key Features

### Navbar with Hover Effects
The navigation bar features smooth hover effects with color changes and underlines for better user experience.

### Booking Animations
- Modal animations when opening/closing booking form
- Smooth transitions during booking process
- Animated success confirmation with bounce effect
- Download button with loading animation (2-3 seconds)

### Ticket Download
After successful booking, users can download their tickets as text files containing:
- Booking ID
- Event details
- Seats booked
- Total price
- Booking date

### Booking Cancellation
Users can cancel their bookings, which:
- Removes the booking from the database
- Returns seats to the event's available seats
- Updates the event availability in real-time

## Building for Production

```bash
npm run build
```

The build output will be in the `dist` directory.

## Important Notes

- No payment system is implemented (as requested)
- All code is written in JavaScript (no TypeScript)
- Database must be set up manually using the provided SQL scripts
- Separate authentication systems for admin and user roles
- Row Level Security (RLS) is enabled for all database tables

## License

MIT
