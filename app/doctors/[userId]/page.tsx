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
    Mail
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { cn } from "@/lib/utils";

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

export default function DoctorSelection() {
    const params = useParams();
    const router = useRouter();
    const userId = params.userId as string;

    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
    const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [view, setView] = useState<"doctor" | "prescription" | "appointment">("doctor");
    const [userDetails, setUserDetails] = useState<any>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!userId) return;

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

                if (apptsRes.length > 0) {
                    setUserDetails(apptsRes[0].user);
                } else {
                    // Fallback: If no appointments, we might not have user details from this API.
                    // But usually we assume user has logged in.
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
            alert("Missing doctor or user ID");
            return;
        }

        try {
            const res = await fetch(
                `${APPOINTMENT_API}?userid=${userId}&docid=${selectedDoctor.docid}`,
                { method: "POST", headers: { "Content-Type": "application/json" } }
            );

            if (res.ok) {
                const data = await res.json();
                router.push(`/confirmation?data=${encodeURIComponent(JSON.stringify(data))}`);
                // Alternatively use context or simple query param passing. 
                // Since the prompt uses navigate with state, query param is safer for persistence or localStorage.
                // I'll stick to a simple strategy: passing minimal ID or saving to localStorage if needed.
                // Actually, the previous code passed state. Next.js router.push doesn't support state object same way.
                // I'll use localStorage for temporary confirmation data or URL params.
                localStorage.setItem("lastAppointment", JSON.stringify(data));
                router.push("/confirmation");
            } else {
                alert("Booking failed: " + await res.text());
            }
        } catch {
            alert("Network error during booking.");
        }
    }

    const handleLogout = () => {
        localStorage.clear();
        router.push("/");
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
            {/* Mobile Header */}
            <div className="md:hidden flex items-center justify-between p-4 bg-white border-b">
                <h1 className="font-bold text-lg">Hospital System</h1>
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
                            "fixed md:static inset-y-0 left-0 z-50 w-64 bg-white border-r p-6 flex flex-col shadow-lg md:shadow-none transition-transform md:translate-x-0",
                            sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
                        )}
                    >
                        <div className="flex items-center justify-between mb-8 md:hidden">
                            <span className="font-bold text-xl">Menu</span>
                            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)}>
                                <X className="h-5 w-5" />
                            </Button>
                        </div>

                        <div className="mb-8 text-center md:text-left">
                            <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto md:mx-0 mb-4 text-primary">
                                <User className="h-8 w-8" />
                            </div>
                            <h2 className="font-bold text-lg">{userDetails.name || "User"}</h2>
                            <div className="text-sm text-muted-foreground flex items-center justify-center md:justify-start gap-1 mt-1">
                                <Mail className="h-3 w-3" /> {userDetails.email || "No email"}
                            </div>
                            <div className="text-sm text-muted-foreground flex items-center justify-center md:justify-start gap-1 mt-1">
                                <MapPin className="h-3 w-3" /> {userDetails.address || "No address"}
                            </div>
                        </div>

                        <nav className="flex-1 space-y-2">
                            <Button
                                variant={view === "doctor" ? "default" : "ghost"}
                                className="w-full justify-start"
                                onClick={() => { setView("doctor"); setSidebarOpen(false); }}
                            >
                                <Stethoscope className="mr-2 h-4 w-4" />
                                Find Doctor
                            </Button>
                            <Button
                                variant={view === "appointment" ? "default" : "ghost"}
                                className="w-full justify-start"
                                onClick={() => { setView("appointment"); setSidebarOpen(false); }}
                            >
                                <Calendar className="mr-2 h-4 w-4" />
                                Appointments
                            </Button>
                            <Button
                                variant={view === "prescription" ? "default" : "ghost"}
                                className="w-full justify-start"
                                onClick={() => { setView("prescription"); setSidebarOpen(false); }}
                            >
                                <FileText className="mr-2 h-4 w-4" />
                                Prescriptions
                            </Button>
                        </nav>

                        <div className="pt-6 border-t mt-auto">
                            <Button variant="destructive" className="w-full" onClick={handleLogout}>
                                <LogOut className="mr-2 h-4 w-4" />
                                Logout
                            </Button>
                        </div>
                    </motion.aside>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <main className="flex-1 p-6 md:p-8 overflow-y-auto h-screen">
                <div className="max-w-5xl mx-auto">
                    {view === "doctor" && (
                        <div className="space-y-6">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div>
                                    <h1 className="text-3xl font-bold tracking-tight">Select a Doctor</h1>
                                    <p className="text-muted-foreground">Choose a specialist for your consultation</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {doctors.map((doc) => (
                                    <Card
                                        key={doc.docid}
                                        className={cn(
                                            "cursor-pointer transition-all hover:shadow-md border-2",
                                            selectedDoctor?.docid === doc.docid ? "border-primary" : "border-transparent hover:border-gray-200"
                                        )}
                                        onClick={() => setSelectedDoctor(doc)}
                                    >
                                        <CardHeader className="pb-2">
                                            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mb-2">
                                                <span className="font-bold text-lg">{doc.name.charAt(0)}</span>
                                            </div>
                                            <CardTitle className="text-lg">{doc.name}</CardTitle>
                                            <CardDescription>{doc.designation}</CardDescription>
                                        </CardHeader>
                                    </Card>
                                ))}
                            </div>

                            {selectedDoctor && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="fixed bottom-6 right-6 md:static"
                                >
                                    <Card className="bg-primary text-primary-foreground shadow-xl md:w-full md:max-w-md md:mx-auto md:bg-white md:text-foreground md:border-2 md:border-primary/20">
                                        <CardHeader>
                                            <CardTitle>Confirm Booking</CardTitle>
                                            <CardDescription className="text-primary-foreground/80 md:text-muted-foreground">
                                                Book appointment with {selectedDoctor.name}?
                                            </CardDescription>
                                        </CardHeader>
                                        <CardFooter>
                                            <Button onClick={bookAppointment} className="w-full md:bg-primary md:text-primary-foreground bg-white text-primary hover:bg-white/90">
                                                Confirm & Book
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                </motion.div>
                            )}
                        </div>
                    )}

                    {view === "appointment" && (
                        <div className="space-y-6">
                            <h1 className="text-3xl font-bold tracking-tight">Your Appointments</h1>
                            <Card>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm text-left">
                                        <thead className="text-xs uppercase bg-muted/50">
                                            <tr>
                                                <th className="px-6 py-3">Doctor</th>
                                                <th className="px-6 py-3">Date</th>
                                                <th className="px-6 py-3">Token No</th>
                                                <th className="px-6 py-3">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {appointments.map((appt, idx) => (
                                                <tr key={idx} className="border-b hover:bg-muted/50 transition-colors">
                                                    <td className="px-6 py-4 font-medium">{appt.doctor.name}</td>
                                                    <td className="px-6 py-4">{appt.appointmentDate}</td>
                                                    <td className="px-6 py-4">#{appt.appointmentNo}</td>
                                                    <td className="px-6 py-4">
                                                        <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-green-500/15 text-green-700">
                                                            Confirmed
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                            {appointments.length === 0 && (
                                                <tr>
                                                    <td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">
                                                        No appointments found.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </Card>
                        </div>
                    )}

                    {view === "prescription" && (
                        <div className="space-y-6">
                            <h1 className="text-3xl font-bold tracking-tight">Prescriptions</h1>
                            <div className="grid gap-6">
                                {prescriptions.map((presc, idx) => (
                                    <Card key={idx}>
                                        <CardHeader>
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <CardTitle>Prescription #{presc.appointment.prescriptionId}</CardTitle>
                                                    <CardDescription>Dr. {presc.appointment.doctor.name}</CardDescription>
                                                </div>
                                                <Button variant="outline" size="sm">Download</Button>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="grid gap-4 md:grid-cols-2">
                                            <div className="space-y-1">
                                                <h4 className="text-sm font-medium leading-none">Medicines</h4>
                                                <p className="text-sm text-muted-foreground">{presc.medicines}</p>
                                            </div>
                                            <div className="space-y-1">
                                                <h4 className="text-sm font-medium leading-none">Dosage</h4>
                                                <p className="text-sm text-muted-foreground">{presc.dosage}</p>
                                            </div>
                                            <div className="col-span-2 space-y-1">
                                                <h4 className="text-sm font-medium leading-none">Instructions</h4>
                                                <p className="text-sm text-muted-foreground">{presc.instructions}</p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                                {prescriptions.length === 0 && (
                                    <Card className="p-8 text-center text-muted-foreground">
                                        No prescriptions found.
                                    </Card>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
