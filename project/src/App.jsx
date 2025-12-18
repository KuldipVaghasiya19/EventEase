import React from 'react';
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";
import Home from "./pages/HomePage";
import EventsPage from "./pages/user/EventsPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserDashboard from "./pages/user/UserDashboard";
import AdminLogin from "./pages/admin/AdminLogin";
import UserLogin from "./pages/user/UserLogin";
import ManageEvents from "./pages/admin/ManageEvents";
import EventDetails from './pages/user/EventDetails';
import LoginSelection from "./pages/LoginSelection"; // New Page
import SignupSelection from './pages/SignupSelection';
import AdminSignup from './pages/admin/AdminSignup';
import UserSignup from './pages/user/UserSignup';

// Placeholder components
const Placeholder = ({ title }) => (
  <div className="pt-32 pb-20 text-center min-h-screen bg-slate-50">
    <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tight">{title}</h1>
    <p className="text-slate-500 mt-4 font-medium uppercase text-xs tracking-widest">Available Soon</p>
  </div>
);

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/login-selection" element={<LoginSelection />} />
          
          {/* Footer & Other Routes */}
          <Route path="/about" element={<Placeholder title="About Us" />} />
          <Route path="/contact" element={<Placeholder title="Contact Us" />} />
          <Route path="/help" element={<Placeholder title="Help Center" />} />
          <Route path="/terms" element={<Placeholder title="Terms" />} />
          <Route path="/privacy" element={<Placeholder title="Privacy" />} />
          
          {/* Authentication */}
          <Route path="/login/user" element={<UserLogin />} />
          <Route path="/login/admin" element={<AdminLogin />} />
      
          <Route path="/signup-selection" element={<SignupSelection />} />
          <Route path="/signup/admin" element={<AdminSignup />} />
          <Route path="/signup/user" element={<UserSignup />} />

          {/* Dashboards */}
          <Route path="/user/dashboard" element={<UserDashboard />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
         <Route path="/admin/manage-events/:id?" element={<ManageEvents />} />

          <Route path="/events/:id" element={<EventDetails />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;