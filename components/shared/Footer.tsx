"use client";

import React from "react";
import { HeartPulse, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, ArrowRight } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-slate-900 text-slate-300 py-16 border-t border-slate-800">
            <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                <div className="space-y-6">
                    <div className="flex items-center gap-2.5 text-white">
                        <div className="h-10 w-10 bg-gradient-to-br from-primary to-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
                            <HeartPulse className="h-6 w-6" />
                        </div>
                        <span className="font-bold text-2xl tracking-tight">Hospital<span className="text-primary">Care</span></span>
                    </div>
                    <p className="text-sm leading-relaxed text-slate-400">
                        Compassionate Care, Advanced Medicine, Close to Home. We are committed to providing high-quality medical services with excellence and integrity.
                    </p>
                    <div className="flex gap-4">
                        {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                            <a key={i} href="#" className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-300">
                                <Icon className="h-5 w-5" />
                            </a>
                        ))}
                    </div>
                </div>

                <div>
                    <h3 className="text-white font-bold text-lg mb-6">Quick Links</h3>
                    <ul className="space-y-3">
                        {[
                            { label: "Home", href: "/" },
                            { label: "About Us", href: "/about" },
                            { label: "Patient Portal", href: "/login-user" },
                            { label: "Doctor Portal", href: "/doctor/login" }
                        ].map((link) => (
                            <li key={link.label}>
                                <a href={link.href} className="group flex items-center gap-2 hover:text-primary transition-colors">
                                    <ArrowRight className="h-3 w-3 text-primary opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                                    {link.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>

                <div>
                    <h3 className="text-white font-bold text-lg mb-6">Our Services</h3>
                    <ul className="space-y-3">
                        {["Emergency Care", "Outpatient Services", "Diagnostic Lab", "Pharmacy", "Surgery"].map((item) => (
                            <li key={item} className="hover:text-primary transition-colors cursor-pointer">
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>

                <div>
                    <h3 className="text-white font-bold text-lg mb-6">Contact Info</h3>
                    <ul className="space-y-4">
                        <li className="flex items-start gap-4">
                            <div className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center shrink-0 text-primary">
                                <MapPin className="h-5 w-5" />
                            </div>
                            <span className="text-sm leading-relaxed">123 Health Street, Chennai,<br />Tamil Nadu, India</span>
                        </li>
                        <li className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center shrink-0 text-primary">
                                <Phone className="h-5 w-5" />
                            </div>
                            <span>+91 98765 13210</span>
                        </li>
                        <li className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center shrink-0 text-primary">
                                <Mail className="h-5 w-5" />
                            </div>
                            <span>contact@hospitalcare.in</span>
                        </li>
                    </ul>
                </div>
            </div>
            <div className="container mx-auto px-4 mt-16 pt-8 border-t border-slate-800 text-center text-sm text-slate-500">
                © {new Date().getFullYear()} HospitalCare. All rights reserved. Designed for Excellence.
            </div>
        </footer>
    );
}
