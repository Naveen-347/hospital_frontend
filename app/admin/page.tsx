"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Users, Stethoscope, ArrowRight, Calendar, Activity, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://hospital-backend-7.onrender.com";
const USERS_API = `${API_BASE}/admin/users`;
const DOCTORS_API = `${API_BASE}/api/doctors`;

export default function AdminDashboard() {
    const [counts, setCounts] = useState({ users: 0, doctors: 0, appointments: 0 });

    useEffect(() => {
        // Fetch counts for dashboard stats
        const fetchData = async () => {
            try {
                const [usersRes, doctorsRes] = await Promise.all([
                    fetch(USERS_API),
                    fetch(DOCTORS_API)
                ]);

                const users = usersRes.ok ? await usersRes.json() : [];
                const doctors = doctorsRes.ok ? await doctorsRes.json() : [];

                setCounts({
                    users: Array.isArray(users) ? users.length : 0,
                    doctors: Array.isArray(doctors) ? doctors.length : 0,
                    appointments: 12 // Placeholder or fetch if available
                });
            } catch (error) {
                console.error("Error fetching admin stats:", error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="space-y-8">
            <div className="flex items-end justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard</h1>
                    <p className="text-slate-500 mt-1">System overview and management KPIs</p>
                </div>
                <div className="text-sm text-slate-500 bg-white px-3 py-1 rounded-full border shadow-sm">
                    Last updated: {new Date().toLocaleDateString()}
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card className="hover:shadow-lg transition-all border-l-4 border-l-blue-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">Total Patients</CardTitle>
                        <Users className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900">{counts.users}</div>
                        <p className="text-xs text-slate-500 mt-1">Registered users in the system</p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-all border-l-4 border-l-teal-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">Medical Staff</CardTitle>
                        <Stethoscope className="h-4 w-4 text-teal-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900">{counts.doctors}</div>
                        <p className="text-xs text-slate-500 mt-1">Active doctors & specialists</p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-all border-l-4 border-l-indigo-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">Todays Appointments</CardTitle>
                        <Calendar className="h-4 w-4 text-indigo-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900">{counts.appointments}</div>
                        <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                            <TrendingUp className="h-3 w-3 text-green-500" /> +12% from yesterday
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions & Navigation */}
            <div className="grid gap-6 md:grid-cols-2">
                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Activity className="h-5 w-5 text-red-500" />
                            Management Quick Actions
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-3">
                        <Link href="/admin/users/create" className="group flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50 hover:bg-white hover:border-blue-200 hover:shadow-sm transition-all">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                    <Users className="h-5 w-5" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-semibold text-slate-900">Add New Patient</span>
                                    <span className="text-xs text-slate-500">Register a user manually</span>
                                </div>
                            </div>
                            <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                        </Link>

                        <Link href="/admin/doctors/create" className="group flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50 hover:bg-white hover:border-teal-200 hover:shadow-sm transition-all">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center group-hover:bg-teal-600 group-hover:text-white transition-colors">
                                    <Stethoscope className="h-5 w-5" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-semibold text-slate-900">Add New Doctor</span>
                                    <span className="text-xs text-slate-500">Onboard medical staff</span>
                                </div>
                            </div>
                            <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-teal-500 group-hover:translate-x-1 transition-all" />
                        </Link>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Users className="h-5 w-5 text-slate-500" />
                            Directory Shortcuts
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Link href="/admin/users" className="block">
                            <div className="p-4 rounded-xl border bg-gradient-to-br from-white to-slate-50 hover:to-slate-100 transition-colors">
                                <h3 className="font-semibold text-slate-900 mb-1">Patient Directory</h3>
                                <p className="text-sm text-slate-500">View detailed list of all registered patients, edit their details or remove accounts.</p>
                            </div>
                        </Link>
                        <Link href="/admin/doctors" className="block">
                            <div className="p-4 rounded-xl border bg-gradient-to-br from-white to-slate-50 hover:to-slate-100 transition-colors">
                                <h3 className="font-semibold text-slate-900 mb-1">Doctor Registry</h3>
                                <p className="text-sm text-slate-500">Manage doctor profiles, specializations, and access credentials.</p>
                            </div>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
