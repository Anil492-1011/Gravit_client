import React from 'react';
import { Button } from '@/components/ui/button';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Footer = () => {
    const navigate = useNavigate();

    return (
        <footer className="bg-white border-t border-slate-200 mt-auto">
            {/* Top CTA Section */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 text-center border-b border-slate-200">
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">
                    Ready to explore?
                </h2>
                <p className="text-slate-600 mb-8 text-base sm:text-lg max-w-2xl mx-auto">
                    Join thousands discovering and booking amazing events every day
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button 
                        size="lg" 
                        onClick={() => navigate('/register')} 
                        className="rounded-full bg-indigo-600 hover:bg-indigo-700 text-white px-8"
                    >
                        Get started
                    </Button>
                    <Button 
                        size="lg" 
                        variant="outline" 
                        onClick={() => navigate('/login')} 
                        className="rounded-full border-slate-300 text-slate-700 hover:bg-slate-50 px-8"
                    >
                        Sign in
                    </Button>
                </div>
            </div>

            {/* Main Footer Section */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
                    {/* Column 1: Brand */}
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold text-indigo-600">Event Booking</h3>
                        <p className="text-slate-600 leading-relaxed max-w-sm">
                            Your one-stop destination for discovering and booking the best events in town. Real-time seat selection and instant bookings.
                        </p>
                    </div>

                    {/* Column 2: Quick Links */}
                    <div>
                        <h4 className="font-semibold text-slate-900 mb-4 uppercase tracking-wider text-sm">Quick Links</h4>
                        <ul className="space-y-2">
                            <li>
                                <button onClick={() => navigate('/events')} className="text-slate-600 hover:text-indigo-600 transition-colors">
                                    Browse Events
                                </button>
                            </li>
                            <li>
                                <button onClick={() => navigate('/dashboard')} className="text-slate-600 hover:text-indigo-600 transition-colors">
                                    Dashboard
                                </button>
                            </li>
                            <li>
                                <button onClick={() => navigate('/bookings')} className="text-slate-600 hover:text-indigo-600 transition-colors">
                                    My Bookings
                                </button>
                            </li>
                            <li>
                                <button onClick={() => navigate('/profile')} className="text-slate-600 hover:text-indigo-600 transition-colors">
                                    Profile
                                </button>
                            </li>
                        </ul>
                    </div>

                    {/* Column 3: Contact Us */}
                    <div>
                        <h4 className="font-semibold text-slate-900 mb-4 uppercase tracking-wider text-sm">Contact Us</h4>
                        <ul className="space-y-3">
                            <li className="flex items-start text-slate-600">
                                <MapPin className="h-5 w-5 mr-3 text-indigo-500 flex-shrink-0" />
                                <span>123 Event Street, Tech City, TC 90210</span>
                            </li>
                            <li className="flex items-center text-slate-600">
                                <Mail className="h-5 w-5 mr-3 text-indigo-500 flex-shrink-0" />
                                <a href="mailto:support@eventbooking.com" className="hover:text-indigo-600 transition-colors">
                                    support@eventbooking.com
                                </a>
                            </li>
                            <li className="flex items-center text-slate-600">
                                <Phone className="h-5 w-5 mr-3 text-indigo-500 flex-shrink-0" />
                                <a href="tel:+1234567890" className="hover:text-indigo-600 transition-colors">
                                    +1 (234) 567-890
                                </a>
                            </li>
                            <li className="flex items-center text-slate-600">
                                <Clock className="h-5 w-5 mr-3 text-indigo-500 flex-shrink-0" />
                                <span>Mon - Fri: 9:00 AM - 6:00 PM</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom Footer Bar */}
            <div className="border-t border-slate-200 bg-slate-50">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <p className="text-slate-500 text-sm text-center sm:text-left">
                        &copy; 2025 Event Booking System. All Rights Reserved.
                    </p>
                    
                    <div className="flex space-x-4">
                        <a href="#" className="text-slate-400 hover:text-indigo-600 transition-colors">
                            <Facebook className="h-5 w-5" />
                        </a>
                        <a href="#" className="text-slate-400 hover:text-indigo-600 transition-colors">
                            <Twitter className="h-5 w-5" />
                        </a>
                        <a href="#" className="text-slate-400 hover:text-indigo-600 transition-colors">
                            <Instagram className="h-5 w-5" />
                        </a>
                        <a href="#" className="text-slate-400 hover:text-indigo-600 transition-colors">
                            <Linkedin className="h-5 w-5" />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
