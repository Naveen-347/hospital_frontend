"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { HeartPulse, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

export default function Footer() {
    const pathname = usePathname();

    return (
        <footer className="bg-slate-50 text-slate-600 py-12 border-t border-slate-200">
            <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-slate-900">
                        <div className="h-8 w-8 bg-blue-600 text-white rounded-lg flex items-center justify-center">
                            <HeartPulse className="h-5 w-5" />
                        </div>
                        <span className="font-bold text-xl tracking-tight">HospitalCare</span>
                    </div>
                    <p className="text-sm leading-relaxed text-slate-500">
                        Compassionate Care, Advanced Medicine, Close to Home. We are committed to providing high-quality medical services with excellence.
                    </p>
                </div>

                <div>
                    <h3 className="text-slate-900 font-semibold mb-4">Quick Links</h3>
                    <ul className="space-y-2 text-sm">
                        <li><a href="/" className="hover:text-blue-600 transition-colors">Home</a></li>
                        <li><a href="/about" className="hover:text-blue-600 transition-colors">About Us</a></li>
                        <li><a href="/login-user" className="hover:text-blue-600 transition-colors">Patient Portal</a></li>
                        <li><a href="/doctor/login" className="hover:text-blue-600 transition-colors">Doctor Portal</a></li>
                    </ul>
                </div>

                <div>
                    <h3 className="text-slate-900 font-semibold mb-4">Services</h3>
                    <ul className="space-y-2 text-sm">
                        <li>Emergency Care</li>
                        <li>Outpatient Services</li>
                        <li>Diagnostic Lab</li>
                        <li>Pharmacy</li>
                        <li>Surgery</li>
                    </ul>
                </div>

                <div>
                    <h3 className="text-slate-900 font-semibold mb-4">Contact Us</h3>
                    <ul className="space-y-3 text-sm">
                        <li className="flex items-start gap-3">
                            <MapPin className="h-5 w-5 text-blue-600 shrink-0" />
                            <span>123 Health Street, Chennai,<br />Tamil Nadu, India</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <Phone className="h-5 w-5 text-blue-600 shrink-0" />
                            <span>+91 98765 13210</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <Mail className="h-5 w-5 text-blue-600 shrink-0" />
                            <span>contact@hospitalcare.in</span>
                        </li>
                    </ul>
                    <div className="flex gap-4 mt-6">
                        <Facebook className="h-5 w-5 text-slate-400 hover:text-blue-600 cursor-pointer transition-colors" />
                        <Twitter className="h-5 w-5 text-slate-400 hover:text-blue-600 cursor-pointer transition-colors" />
                        <Instagram className="h-5 w-5 text-slate-400 hover:text-blue-600 cursor-pointer transition-colors" />
                        <Linkedin className="h-5 w-5 text-slate-400 hover:text-blue-600 cursor-pointer transition-colors" />
                    </div>
                </div>
            </div>
            <div className="container mx-auto px-4 mt-12 pt-8 border-t border-slate-200 text-center text-xs text-slate-500">
                © {new Date().getFullYear()} HospitalCare. All rights reserved.
            </div>
        </footer>
    );
}
