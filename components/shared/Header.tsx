"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useScroll, useMotionValueEvent, motion } from "framer-motion";
import { HeartPulse, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Header() {
    const pathname = usePathname();
    const [isScrolled, setIsScrolled] = React.useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
    const { scrollY } = useScroll();

    useMotionValueEvent(scrollY, "change", (latest) => {
        setIsScrolled(latest > 50);
    });

    // Header visible on all pages as requested

    const navItems = [
        { label: "Home", href: "/" },
        { label: "About Us", href: "/about" },
        { label: "Doctor Login", href: "/doctor/login" },
        { label: "Admin", href: "/ad" }, // keeping /ad redirect or link, wait, I mapped /admin
        // The prompt/old app had /ad -> AdminDashboard.
        // I should probably redirect /ad to /admin or just link to /admin.
        // I made /admin. I'll link to /admin.
    ];
    // Wait, if I link to /admin, header disappears. That's fine.

    // Updating "Admin" link to /admin
    const links = [
        { label: "Home", href: "/" },
        { label: "About Us", href: "/about" },
        { label: "Patient Login", href: "/login-user" },
    ];

    return (
        <motion.header
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
                isScrolled ? "bg-white/80 backdrop-blur-md shadow-sm border-b" : "bg-transparent"
            )}
        >
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2">
                    <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground">
                        <HeartPulse className="h-5 w-5" />
                    </div>
                    <span className="font-bold text-xl tracking-tight">HospitalCare</span>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-6">
                    {links.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "text-sm font-medium transition-colors hover:text-primary",
                                pathname === link.href ? "text-primary" : "text-muted-foreground"
                            )}
                        >
                            {link.label}
                        </Link>
                    ))}
                    <div className="h-4 w-px bg-border mx-2" />
                    <Link href="/doctor/login">
                        <Button variant="ghost" size="sm">Doctor Portal</Button>
                    </Link>
                    <Link href="/admin">
                        <Button size="sm">Admin</Button>
                    </Link>
                </nav>

                {/* Mobile Toggle */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </Button>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="md:hidden absolute top-16 left-0 right-0 bg-white border-b shadow-lg p-4 flex flex-col gap-4"
                >
                    {links.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className="text-sm font-medium p-2 hover:bg-muted rounded-md"
                        >
                            {link.label}
                        </Link>
                    ))}
                    <div className="h-px bg-border my-2" />
                    <Link href="/doctor/login" onClick={() => setMobileMenuOpen(false)}>
                        <Button variant="outline" className="w-full justify-start">Doctor Portal</Button>
                    </Link>
                    <Link href="/admin" onClick={() => setMobileMenuOpen(false)}>
                        <Button className="w-full justify-start">Admin Portal</Button>
                    </Link>
                </motion.div>
            )}
        </motion.header>
    );
}
