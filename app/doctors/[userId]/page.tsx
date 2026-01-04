"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    User,
    Calendar,
    FileText,
    Stethoscope,
    Menu,
    X,
    LogOut,
    ChevronRight,
    MapPin,
    Mail,
    Search,
    Star,
    Clock,
    Activity,
    Shield
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://hospital-backend-7.onrender.com";
const DOCTOR_API = `${API_BASE}/api/doctors`;
const APPOINTMENT_API = `${API_BASE}/appointments/book`;
const USER_APPOINTMENT_API = `${API_BASE}/appointments/user`;
const PRESCRIPTION_API = `${API_BASE}/prescriptions/user`;

type Doctor = {
    docid: number;
    name: string;
    designation: string;
};

type Appointment = {
    appointmentDate: string;
    appointmentNo: number;
    doctor: Doctor;
    user: any;
};

type Prescription = {
    appointment: {
        user: { name: string };
        doctor: { name: string };
        prescriptionId: number;
    };
    medicines: string;
    dosage: string;
    instructions: string;
    details: string;
};

export default function PatientDashboard() {
    const params = useParams();
    const router = useRouter();
    const userId = params.userId as string;

    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
    const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [view, setView] = useState<"doctor" | "prescription" | "appointment">("doctor");
    const [loading, setLoading] = useState(true);

    // User Profile State (Persisted)
    const [userProfile, setUserProfile] = useState({
        name: "Guest User",
        email: "guest@example.com",
        address: "Not Provided",
        initial: "G"
    });

    useEffect(() => {
        if (!userId) return;

        // 1. Load User Info from LocalStorage (Fastest)
        const storedName = localStorage.getItem("userName");
        const storedEmail = localStorage.getItem("userEmail");
        const storedAddress = localStorage.getItem("userAddress");

        if (storedName) {
            setUserProfile({
                name: storedName,
                email: storedEmail || "No email",
                address: storedAddress || "No address",
                initial: storedName.charAt(0).toUpperCase()
            });
        }

        // 2. Fetch API Data
        const fetchData = async () => {
            setLoading(true);
            try {
                const [docsRes, apptsRes, prescRes] = await Promise.all([
                    fetch(DOCTOR_API).then(res => res.json()),
                    fetch(`${USER_APPOINTMENT_API}/${userId}`).then(res => res.json()),
                    fetch(`${PRESCRIPTION_API}/${userId}`).then(res => res.json())
                ]);

                setDoctors(docsRes);
                setAppointments(apptsRes);
                setPrescriptions(Array.isArray(prescRes) ? prescRes : [prescRes].filter(Boolean));

                // Fallback: If localStorage was empty but we have appointments, update profile
                if (!storedName && apptsRes.length > 0 && apptsRes[0].user) {
                    const u = apptsRes[0].user;
                    setUserProfile({
                        name: u.name,
                        email: u.email,
                        address: u.address,
                        initial: u.name.charAt(0).toUpperCase()
                    });
                    // Persist for next time
                    localStorage.setItem("userName", u.name);
                    localStorage.setItem("userEmail", u.email);
                }

            } catch (err) {
                console.error("Failed to load data", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [userId]);

    async function bookAppointment() {
        if (!selectedDoctor?.docid || !userId) {
            alert("Missing information");
            return;
        }

        try {
            const res = await fetch(
                `${APPOINTMENT_API}?userid=${userId}&docid=${selectedDoctor.docid}`,
                { method: "POST", headers: { "Content-Type": "application/json" } }
            );

            if (res.ok) {
                const data = await res.json();
                localStorage.setItem("lastAppointment", JSON.stringify(data));
                router.push("/confirmation");
            } else {
                alert("Booking failed: " + await res.text());
            }
        } catch {
            alert("Network error.");
        }
    }

    const handleLogout = () => {
        localStorage.clear();
        router.push("/");
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-outfit">
            {/* Mobile Header */}
            <div className="md:hidden flex items-center justify-between p-4 bg-white border-b sticky top-0 z-40 shadow-sm">
                <div className="flex items-center gap-2">
                    <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center text-white">
                        <Activity className="h-5 w-5" />
                    </div>
                    <span className="font-bold text-lg">HospitalCare</span>
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
                            "fixed md:static inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200 flex flex-col shadow-2xl md:shadow-none",
                            sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
                        )}
                    >
                        {/* Mobile Close */}
                        <div className="md:hidden p-4 flex justify-end">
                            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)}>
                                <X className="h-5 w-5" />
                            </Button>
                        </div>

                        {/* User Profile Card - FIXED SIDEBAR ISSUE */}
                        <div className="p-6 pb-2">
                            <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-6 border border-slate-100 shadow-sm text-center">
                                <div className="h-20 w-20 bg-gradient-to-br from-primary to-blue-600 rounded-full flex items-center justify-center text-3xl font-bold text-white mx-auto mb-4 shadow-lg shadow-primary/20 ring-4 ring-white">
                                    {userProfile.initial}
                                </div>
                                <h2 className="font-bold text-lg text-slate-800 truncate">{userProfile.name}</h2>
                                <div className="flex flex-col gap-2 mt-3 text-sm text-slate-500">
                                    <div className="flex items-center justify-center gap-2 bg-white px-3 py-1.5 rounded-full shadow-sm border border-slate-100">
                                        <Mail className="h-3.5 w-3.5 text-primary" />
                                        <span className="truncate max-w-[140px]">{userProfile.email}</span>
                                    </div>
                                    <div className="flex items-center justify-center gap-2 bg-white px-3 py-1.5 rounded-full shadow-sm border border-slate-100">
                                        <MapPin className="h-3.5 w-3.5 text-primary" />
                                        <span className="truncate max-w-[140px]">{userProfile.address}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Navigation */}
                        <nav className="flex-1 px-4 py-4 space-y-2">
                            <p className="px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Menu</p>
                            <Button
                                variant={view === "doctor" ? "secondary" : "ghost"}
                                className={cn("w-full justify-start h-11 text-base", view === "doctor" ? "bg-primary/10 text-primary font-semibold" : "text-slate-600")}
                                onClick={() => { setView("doctor"); setSidebarOpen(false); }}
                            >
                                <Stethoscope className="mr-3 h-5 w-5" />
                                Find Doctor
                            </Button>
                            <Button
                                variant={view === "appointment" ? "secondary" : "ghost"}
                                className={cn("w-full justify-start h-11 text-base", view === "appointment" ? "bg-primary/10 text-primary font-semibold" : "text-slate-600")}
                                onClick={() => { setView("appointment"); setSidebarOpen(false); }}
                            >
                                <Calendar className="mr-3 h-5 w-5" />
                                My Appointments
                            </Button>
                            <Button
                                variant={view === "prescription" ? "secondary" : "ghost"}
                                className={cn("w-full justify-start h-11 text-base", view === "prescription" ? "bg-primary/10 text-primary font-semibold" : "text-slate-600")}
                                onClick={() => { setView("prescription"); setSidebarOpen(false); }}
                            >
                                <FileText className="mr-3 h-5 w-5" />
                                Prescriptions
                            </Button>
                        </nav>

                        <div className="p-6 border-t border-slate-100">
                            <Button
                                variant="outline"
                                className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-300 transition-colors"
                                onClick={handleLogout}
                            >
                                <LogOut className="mr-2 h-4 w-4" />
                                Sign Out
                            </Button>
                        </div>
                    </motion.aside>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <main className="flex-1 p-4 md:p-8 overflow-y-auto h-screen bg-slate-50/50">
                <div className="max-w-6xl mx-auto space-y-8">
                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-slate-200">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                                {view === "doctor" && "Find a Specialist"}
                                {view === "appointment" && "Your Appointments"}
                                {view === "prescription" && "Medical Records"}
                            </h1>
                            <p className="text-slate-500 mt-1">
                                {view === "doctor" && "Book consultations with top medical experts"}
                                {view === "appointment" && "Manage your upcoming and past visits"}
                                {view === "prescription" && "View and download your prescriptions"}
                            </p>
                        </div>
                        <div className="text-right hidden md:block">
                            <div className="flex items-center gap-2 text-sm text-slate-500 bg-white px-3 py-1 rounded-full border shadow-sm">
                                <Shield className="h-4 w-4 text-green-500" />
                                <span>Verified Patient</span>
                            </div>
                        </div>
                    </div>

                    {/* View: Doctors */}
                    {view === "doctor" && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {doctors.map((doc) => (
                                <motion.div
                                    key={doc.docid}
                                    whileHover={{ y: -5 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <div
                                        className={cn(
                                            "group cursor-pointer bg-white rounded-2xl border p-6 shadow-sm transition-all hover:shadow-xl hover:border-primary/50 relative overflow-hidden",
                                            selectedDoctor?.docid === doc.docid ? "ring-2 ring-primary border-primary" : "border-slate-200"
                                        )}
                                        onClick={() => setSelectedDoctor(doc)}
                                    >
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="h-14 w-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 text-xl font-bold group-hover:bg-primary group-hover:text-white transition-colors">
                                                {doc.name.charAt(0)}
                                            </div>
                                            <Badge variant="secondary" className="bg-slate-100 text-slate-600">Available</Badge>
                                        </div>
                                        <h3 className="font-bold text-xl text-slate-900 mb-1">{doc.name}</h3>
                                        <p className="text-primary font-medium text-sm mb-4">{doc.designation}</p>

                                        <div className="flex items-center gap-4 text-xs text-slate-500 pt-4 border-t border-slate-100">
                                            <div className="flex items-center gap-1">
                                                <Star className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400" />
                                                <span>4.8</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Clock className="h-3.5 w-3.5" />
                                                <span>15 min</span>
                                            </div>
                                            <div className="ml-auto font-bold text-slate-900">$50</div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}

                    {/* Confirmation Dialog */}
                    <AnimatePresence>
                        {selectedDoctor && view === "doctor" && (
                            <motion.div
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 50 }}
                                className="fixed bottom-0 left-0 right-0 z-50 p-6 md:p-0 md:static"
                            >
                                <div className="fixed inset-0 bg-black/20 backdrop-blur-sm md:hidden" onClick={() => setSelectedDoctor(null)} />
                                <div className="fixed bottom-6 right-6 z-50">
                                    <Card className="w-full max-w-sm shadow-2xl border-2 border-primary/20 animate-in slide-in-from-bottom-5">
                                        <CardHeader>
                                            <CardTitle className="flex justify-between items-center">
                                                <span>Confirm Booking</span>
                                                <Button variant="ghost" size="sm" onClick={() => setSelectedDoctor(null)}><X className="h-4 w-4" /></Button>
                                            </CardTitle>
                                            <CardDescription>
                                                Appointment with <span className="text-primary font-semibold">{selectedDoctor.name}</span>
                                            </CardDescription>
                                        </CardHeader>
                                        <CardFooter>
                                            <Button onClick={bookAppointment} className="w-full shadow-lg shadow-primary/20">
                                                Confirm Booking
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* View: Appointments */}
                    {view === "appointment" && (
                        <Card className="border-none shadow-md overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="text-xs uppercase bg-slate-100 text-slate-600">
                                        <tr>
                                            <th className="px-6 py-4 rounded-tl-lg">Doctor</th>
                                            <th className="px-6 py-4">Date & Time</th>
                                            <th className="px-6 py-4">Token</th>
                                            <th className="px-6 py-4 rounded-tr-lg">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {appointments.map((appt, idx) => (
                                            <tr key={idx} className="bg-white hover:bg-slate-50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="font-semibold text-slate-900">{appt.doctor.name}</div>
                                                    <div className="text-xs text-slate-500">{appt.doctor.designation}</div>
                                                </td>
                                                <td className="px-6 py-4 font-medium text-slate-700">{appt.appointmentDate}</td>
                                                <td className="px-6 py-4">
                                                    <span className="inline-flex items-center justify-center h-8 w-8 rounded-lg bg-blue-100 text-blue-700 font-bold text-xs">
                                                        {appt.appointmentNo}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200">Confirmed</Badge>
                                                </td>
                                            </tr>
                                        ))}
                                        {appointments.length === 0 && (
                                            <tr>
                                                <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                                                    <div className="flex flex-col items-center gap-2">
                                                        <Calendar className="h-10 w-10 text-slate-300" />
                                                        <p>No upcoming appointments found.</p>
                                                        <Button variant="link" onClick={() => setView("doctor")}>Book one now</Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </Card>
                    )}

                    {/* View: Prescriptions */}
                    {view === "prescription" && (
                        <div className="grid gap-6">
                            {prescriptions.map((presc, idx) => (
                                <Card key={idx} className="hover:shadow-md transition-shadow">
                                    <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
                                        <div className="flex justify-between items-start">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 bg-white rounded-full border flex items-center justify-center shadow-sm">
                                                    <FileText className="h-5 w-5 text-primary" />
                                                </div>
                                                <div>
                                                    <CardTitle className="text-lg">Prescription #{presc.appointment.prescriptionId}</CardTitle>
                                                    <CardDescription className="font-medium text-slate-600">Dr. {presc.appointment.doctor.name}</CardDescription>
                                                </div>
                                            </div>
                                            <Button variant="outline" size="sm" className="gap-2 hidden sm:flex">
                                                <Search className="h-4 w-4" /> View Details
                                            </Button>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="grid gap-6 md:grid-cols-2 pt-6">
                                        <div className="space-y-1.5">
                                            <Label className="text-xs uppercase text-slate-400 font-bold tracking-wider">Medicines</Label>
                                            <p className="text-sm font-medium text-slate-800 bg-slate-50 p-3 rounded-lg border border-slate-100">{presc.medicines}</p>
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label className="text-xs uppercase text-slate-400 font-bold tracking-wider">Dosage</Label>
                                            <p className="text-sm font-medium text-slate-800 bg-slate-50 p-3 rounded-lg border border-slate-100">{presc.dosage}</p>
                                        </div>
                                        <div className="md:col-span-2 space-y-1.5">
                                            <Label className="text-xs uppercase text-slate-400 font-bold tracking-wider">Instructions</Label>
                                            <p className="text-sm text-slate-600 leading-relaxed bg-blue-50/50 p-3 rounded-lg border border-blue-100 text-blue-900">{presc.instructions}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                            {prescriptions.length === 0 && (
                                <Card className="p-12 text-center text-slate-500 flex flex-col items-center justify-center border-dashed">
                                    <FileText className="h-12 w-12 text-slate-300 mb-4" />
                                    <p className="font-medium">No prescriptions available.</p>
                                    <p className="text-sm text-slate-400">Prescriptions from your consultations will appear here.</p>
                                </Card>
                            )}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
