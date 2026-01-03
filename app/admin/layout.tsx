"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    Users,
    Stethoscope,
    LayoutDashboard,
    LogOut,
    Menu,
    X,
    ShieldAlert,
    Plus
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = () => {
        // Admin logout logic if any, or just redirect
        router.push("/");
    };

    const menuItems = [
        { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
        { label: "Manage Users", href: "/admin/users", icon: Users },
        { label: "Add User", href: "/admin/users/create", icon: Plus },
        { label: "Manage Doctors", href: "/admin/doctors", icon: Stethoscope },
        { label: "Add Doctor", href: "/admin/doctors/create", icon: Plus },
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
            {/* Mobile Header */}
            <div className="md:hidden flex items-center justify-between p-4 bg-white border-b">
                <h1 className="font-bold text-lg flex items-center gap-2">
                    <ShieldAlert className="h-5 w-5 text-red-600" />
                    Admin Panel
                </h1>
                <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)}>
                    <Menu className="h-6 w-6" />
                </Button>
            </div>

            {/* Sidebar */}
            <AnimatePresence>
                {(sidebarOpen || (typeof window !== 'undefined' && window.innerWidth >= 768)) && (
                    <motion.aside
                        initial={{ x: -250 }}
                        animate={{ x: 0 }}
                        exit={{ x: -250 }}
                        className={cn(
                            "fixed md:static inset-y-0 left-0 z-40 w-64 bg-zinc-900 text-zinc-50 border-r border-zinc-800 p-6 flex flex-col shadow-lg md:shadow-none transition-all md:translate-x-0"
                        )}
                    >
                        <div className="flex items-center justify-between mb-8 md:hidden">
                            <span className="font-bold text-xl">Menu</span>
                            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)} className="text-zinc-400 hover:text-white">
                                <X className="h-5 w-5" />
                            </Button>
                        </div>

                        <div className="mb-8 flex items-center gap-3 px-2">
                            <div className="h-10 w-10 bg-red-600 rounded-lg flex items-center justify-center text-white font-bold">
                                AD
                            </div>
                            <div>
                                <h2 className="font-bold text-lg">Hospital</h2>
                                <p className="text-xs text-zinc-400">Admin Control</p>
                            </div>
                        </div>

                        <nav className="flex-1 space-y-1">
                            {menuItems.map((item) => (
                                <Link key={item.href} href={item.href} onClick={() => setSidebarOpen(false)}>
                                    <Button
                                        variant="ghost"
                                        className={cn(
                                            "w-full justify-start text-zinc-400 hover:text-white hover:bg-zinc-800",
                                            pathname === item.href && "bg-zinc-800 text-white font-medium"
                                        )}
                                    >
                                        <item.icon className="mr-3 h-4 w-4" />
                                        {item.label}
                                    </Button>
                                </Link>
                            ))}
                        </nav>

                        <div className="pt-6 border-t border-zinc-800 mt-auto">
                            <Button variant="destructive" className="w-full" onClick={handleLogout}>
                                <LogOut className="mr-2 h-4 w-4" />
                                Exit Panel
                            </Button>
                        </div>
                    </motion.aside>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <main className="flex-1 p-6 md:p-8 overflow-y-auto h-screen">
                {children}
            </main>
        </div>
    );
}
