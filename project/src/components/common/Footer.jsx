import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Brand Column */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-3">
              <div className="bg-indigo-600 p-2 rounded-xl shadow-lg shadow-indigo-500/20">
                <Calendar className="text-white h-6 w-6" />
              </div>
              <span className="text-2xl font-black tracking-tight text-white">
                Event<span className="text-indigo-500">Ease</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-slate-400">
              The premier platform for technical and cultural event management. 
              Connecting organizers and participants through seamless experiences.
            </p>
            <div className="flex gap-4">
              <a href="#" className="p-2 bg-slate-800 rounded-lg hover:bg-indigo-600 hover:text-white transition-all">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="#" className="p-2 bg-slate-800 rounded-lg hover:bg-indigo-600 hover:text-white transition-all">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="#" className="p-2 bg-slate-800 rounded-lg hover:bg-indigo-600 hover:text-white transition-all">
                <Linkedin className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">Explore</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li><Link to="/events" className="hover:text-indigo-400 transition-colors">Browse Events</Link></li>
              <li><Link to="/about" className="hover:text-indigo-400 transition-colors">About Us</Link></li>
              <li><Link to="/user/signup" className="hover:text-indigo-400 transition-colors">Join as Participant</Link></li>
              <li><Link to="/admin/signup" className="hover:text-indigo-400 transition-colors">Host an Event</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">Support</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li><Link to="/help" className="hover:text-indigo-400 transition-colors">Help Center</Link></li>
              <li><Link to="/terms" className="hover:text-indigo-400 transition-colors">Terms of Service</Link></li>
              <li><Link to="/privacy" className="hover:text-indigo-400 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/contact" className="hover:text-indigo-400 transition-colors">Contact Support</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">Contact Us</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-indigo-500 shrink-0" />
                <span>123 Tech Square, Innovation Way, CA 94043</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-indigo-500 shrink-0" />
                <span>support@eventease.com</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-indigo-500 shrink-0" />
                <span>+1 (555) 000-1234</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-bold text-slate-500 uppercase tracking-tighter">
          <p>© {currentYear} EventEase Management System. All rights reserved.</p>
          <div className="flex gap-8">
            <span className="cursor-pointer hover:text-slate-300">Cookie Settings</span>
            <span className="cursor-pointer hover:text-slate-300">Accessibility</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;