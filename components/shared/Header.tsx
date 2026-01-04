"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useScroll, useMotionValueEvent, motion, AnimatePresence } from "framer-motion";
import { HeartPulse, Menu, X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Header() {
    const pathname = usePathname();
    const [isScrolled, setIsScrolled] = React.useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
    const { scrollY } = useScroll();

    useMotionValueEvent(scrollY, "change", (latest) => {
        setIsScrolled(latest > 20);
    });

    const links = [
        { label: "Home", href: "/" },
        { label: "About Us", href: "/about" },
        { label: "Patient Login", href: "/login-user" },
    ];

    return (
        <motion.header
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-transparent",
                isScrolled ? "bg-white/80 backdrop-blur-md shadow-sm border-gray-100 py-2" : "bg-transparent py-4"
            )}
        >
            <div className="container mx-auto px-4 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2.5 group">
                    <div className="h-10 w-10 bg-gradient-to-br from-primary to-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20 transition-transform group-hover:scale-105">
                        <HeartPulse className="h-6 w-6" />
                    </div>
                    <span className="font-bold text-2xl tracking-tight text-slate-800">
                        Hospital<span className="text-primary">Care</span>
                    </span>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-8">
                    {links.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "text-sm font-semibold transition-colors relative",
                                pathname === link.href ? "text-primary" : "text-slate-600 hover:text-primary"
                            )}
                        >
                            {link.label}
                            {pathname === link.href && (
                                <motion.div
                                    layoutId="underline"
                                    className="absolute left-0 right-0 -bottom-1 h-0.5 bg-primary rounded-full"
                                />
                            )}
                        </Link>
                    ))}
                    <div className="h-6 w-px bg-slate-200 mx-2" />
                    <div className="flex items-center gap-3">
                        <Link href="/doctor/login">
                            <Button variant="ghost" className="font-semibold text-slate-700 hover:text-primary hover:bg-primary/5">
                                Doctor Portal
                            </Button>
                        </Link>
                        <Link href="/admin">
                            <Button className="rounded-full px-6 shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 transition-all">
                                Admin Access
                            </Button>
                        </Link>
                    </div>
                </nav>

                {/* Mobile Toggle */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden text-slate-700"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </Button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white border-b border-gray-100 overflow-hidden"
                    >
                        <div className="p-4 space-y-4">
                            {links.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={cn(
                                        "block text-base font-medium p-3 rounded-lg transition-colors",
                                        pathname === link.href ? "bg-primary/10 text-primary" : "text-slate-600 hover:bg-slate-50"
                                    )}
                                >
                                    {link.label}
                                </Link>
                            ))}
                            <div className="h-px bg-slate-100 my-2" />
                            <div className="grid gap-3">
                                <Link href="/doctor/login" onClick={() => setMobileMenuOpen(false)}>
                                    <Button variant="outline" className="w-full justify-between">
                                        Doctor Portal
                                        <ArrowRight className="h-4 w-4" />
                                    </Button>
                                </Link>
                                <Link href="/admin" onClick={() => setMobileMenuOpen(false)}>
                                    <Button className="w-full justify-between">
                                        Admin Portal
                                        <ArrowRight className="h-4 w-4" />
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.header>
    );
}
