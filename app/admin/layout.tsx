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
    Plus,
    ChevronRight,
    Settings
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
        // Admin logout logic
        router.push("/");
    };

    const menuItems = [
        { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
        { label: "Manage Users", href: "/admin/users", icon: Users },
        // { label: "Add User", href: "/admin/users/create", icon: Plus }, // Moved to action page
        { label: "Manage Doctors", href: "/admin/doctors", icon: Stethoscope },
        // { label: "Add Doctor", href: "/admin/doctors/create", icon: Plus }, // Moved to action page
    ];

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans text-slate-900">
            {/* Mobile Header */}
            <div className="md:hidden flex items-center justify-between p-4 bg-white/80 backdrop-blur-md border-b sticky top-0 z-50">
                <div className="flex items-center gap-2">
                    <div className="h-8 w-8 bg-red-100 rounded-lg flex items-center justify-center text-red-700">
                        <ShieldAlert className="h-5 w-5" />
                    </div>
                    <span className="font-bold text-lg text-slate-800">Admin Panel</span>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)}>
                    <Menu className="h-6 w-6" />
                </Button>
            </div>

            {/* Sidebar */}
            <AnimatePresence>
                {(sidebarOpen || (typeof window !== 'undefined' && window.innerWidth >= 768)) && (
                    <motion.aside
                        initial={{ x: -280 }}
                        animate={{ x: 0 }}
                        exit={{ x: -280 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className={cn(
                            "fixed md:static inset-y-0 left-0 z-40 w-72 bg-slate-950 text-white flex flex-col shadow-2xl md:shadow-none transition-transform",
                            sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
                        )}
                    >
                        <div className="p-6 hidden md:flex items-center gap-3 border-b border-white/5">
                            <div className="h-10 w-10 bg-red-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-red-600/30">
                                <ShieldAlert className="h-6 w-6" />
                            </div>
                            <div>
                                <h1 className="font-bold text-xl tracking-tight leading-none">Admin Panel</h1>
                                <p className="text-xs text-slate-400 mt-1">System Management</p>
                            </div>
                        </div>

                        <div className="px-4 py-6">
                            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 px-2">Main Menu</h3>
                            <nav className="space-y-1">
                                {menuItems.map((item) => {
                                    const isActive = pathname === item.href;
                                    return (
                                        <Link key={item.href} href={item.href} onClick={() => setSidebarOpen(false)}>
                                            <div
                                                className={cn(
                                                    "w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group relative overflow-hidden",
                                                    isActive
                                                        ? "bg-red-600 text-white shadow-md shadow-red-900/20"
                                                        : "text-slate-400 hover:bg-slate-900 hover:text-white"
                                                )}
                                            >
                                                <item.icon className={cn("h-5 w-5", isActive ? "text-white" : "text-slate-500 group-hover:text-white")} />
                                                <span className="relative z-10">{item.label}</span>
                                                {isActive && <ChevronRight className="ml-auto h-4 w-4 opacity-50" />}
                                            </div>
                                        </Link>
                                    );
                                })}
                            </nav>
                        </div>

                        <div className="p-4 mt-auto border-t border-white/5 bg-slate-900/50">
                            <div className="flex items-center gap-3 mb-4 px-2">
                                <div className="h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-300">
                                    AD
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-white">Administrator</p>
                                    <p className="text-xs text-slate-500">admin@hospital.com</p>
                                </div>
                            </div>
                            <Button
                                variant="destructive"
                                className="w-full justify-start bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white border border-red-600/20 hover:border-red-600 transition-all"
                                onClick={handleLogout}
                            >
                                <LogOut className="mr-2 h-4 w-4" />
                                Logout
                            </Button>
                        </div>
                    </motion.aside>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <main className="flex-1 p-4 md:p-8 overflow-y-auto h-screen bg-slate-50/50">
                <div className="max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
