"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    Calendar,
    User,
    LogOut,
    Menu,
    X,
    Clock,
    FileText,
    Plus,
    ChevronRight,
    Search,
    Mail,
    MapPin,
    Weight
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://hospital-backend-7.onrender.com";
const DOCTOR_API_BASE = `${API_BASE}/api/doctors`;
const APPOINTMENT_API_BASE = `${API_BASE}/appointments/doctor`;
const PRESCRIPTION_API = `${API_BASE}/prescriptions/write`;

export default function DoctorDashboard() {
    const router = useRouter();
    const [appointments, setAppointments] = useState<any[]>([]);
    const [selectedDate, setSelectedDate] = useState("");
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [userDetails, setUserDetails] = useState<any>({});
    const [selectedAppointment, setSelectedAppointment] = useState<any>(null);

    // Prescription Form State
    const [prescriptionData, setPrescriptionData] = useState({
        dosage: "",
        instructions: "",
        medication: "",
        medicines: "",
        details: ""
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Auth & Init
    const doctorId = typeof window !== 'undefined' ? localStorage.getItem("doctorId") : null;
    const isLoggedIn = typeof window !== 'undefined' ? localStorage.getItem("isLoggedIn") === "true" : false;
    const role = typeof window !== 'undefined' ? localStorage.getItem("role") : null;

    useEffect(() => {
        if (!isLoggedIn || role !== "doctor") {
            router.push("/doctor/login");
            return;
        }

        const fetchDoctorDetails = async () => {
            try {
                const response = await fetch(`${DOCTOR_API_BASE}/${doctorId}`);
                if (!response.ok) throw new Error("Failed to fetch doctor details");
                const data = await response.json();
                setUserDetails(data);
            } catch (error) {
                console.error("Error fetching doctor details:", error);
            }
        };

        if (doctorId) {
            fetchDoctorDetails();
        }
    }, [doctorId, isLoggedIn, role, router]);

    useEffect(() => {
        if (doctorId && selectedDate) {
            const fetchAppointments = async () => {
                try {
                    const response = await fetch(
                        `${APPOINTMENT_API_BASE}/${doctorId}/${selectedDate}`
                    );
                    if (!response.ok) throw new Error("Failed to fetch appointments");
                    const data = await response.json();
                    setAppointments(data);
                } catch (error) {
                    console.error("Error fetching appointments:", error);
                }
            };

            fetchAppointments();
        }
    }, [doctorId, selectedDate]);

    const handleLogout = () => {
        localStorage.clear();
        router.push("/doctor/login");
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPrescriptionData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmitPrescription = async () => {
        if (!selectedAppointment) return;
        setIsSubmitting(true);

        const payload = {
            ...prescriptionData,
            appointmentId: selectedAppointment.id,
            userId: selectedAppointment.user.userid,
            docId: selectedAppointment.doctor.docid
        };

        try {
            const response = await fetch(PRESCRIPTION_API, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (!response.ok) throw new Error("Failed to submit prescription");
            alert("Prescription submitted successfully!");
            setSelectedAppointment(null); // Close modal
            setPrescriptionData({
                dosage: "",
                instructions: "",
                medication: "",
                medicines: "",
                details: ""
            });
        } catch (error) {
            console.error("Error submitting prescription:", error);
            alert("Error submitting prescription");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
            {/* Mobile Header */}
            <div className="md:hidden flex items-center justify-between p-4 bg-white border-b">
                <h1 className="font-bold text-lg">Doctor Dashboard</h1>
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
                            "fixed md:static inset-y-0 left-0 z-40 w-64 bg-white border-r p-6 flex flex-col shadow-lg md:shadow-none transition-all md:translate-x-0",
                            sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
                        )}
                    >
                        <div className="flex items-center justify-between mb-8 md:hidden">
                            <span className="font-bold text-xl">Menu</span>
                            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)}>
                                <X className="h-5 w-5" />
                            </Button>
                        </div>

                        <div className="mb-8 p-4 bg-blue-50 rounded-lg text-center">
                            <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 text-blue-600">
                                <User className="h-8 w-8" />
                            </div>
                            <h2 className="font-bold text-lg text-blue-900">Dr. {userDetails.name}</h2>
                            <p className="text-sm text-blue-700">{userDetails.designation}</p>
                            <p className="text-xs text-blue-600/70 mt-1">ID: #{userDetails.docid}</p>
                        </div>

                        <nav className="flex-1 space-y-2">
                            {/* Could add navigation items here if there were more pages */}
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
                <div className="max-w-6xl mx-auto space-y-8">

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">Appointments</h1>
                            <p className="text-muted-foreground">Manage your schedule and patient prescriptions</p>
                        </div>

                        <div className="flex items-center gap-2">
                            <Label className="whitespace-nowrap">Filter by Date:</Label>
                            <Input
                                type="date"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                className="w-auto"
                            />
                        </div>
                    </div>

                    <Card>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs uppercase bg-muted/50 border-b">
                                    <tr>
                                        <th className="px-6 py-4">Appt ID</th>
                                        <th className="px-6 py-4">Time/Date</th>
                                        <th className="px-6 py-4">Patient Details</th>
                                        <th className="px-6 py-4">Health Info</th>
                                        <th className="px-6 py-4 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {appointments.map((appt) => (
                                        <tr key={appt.id} className="hover:bg-muted/30 transition-colors">
                                            <td className="px-6 py-4 font-medium">#{appt.appointmentNo}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                                    {appt.appointmentDate}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="space-y-1">
                                                    <div className="font-medium flex items-center gap-2">
                                                        {appt.user?.name}
                                                        <span className="text-xs font-normal text-muted-foreground">({appt.user?.age} yrs)</span>
                                                    </div>
                                                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                                                        <Mail className="h-3 w-3" /> {appt.user?.email}
                                                    </div>
                                                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                                                        <MapPin className="h-3 w-3" /> {appt.user?.address}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-1">
                                                    <Weight className="h-3 w-3 text-muted-foreground" /> {appt.user?.weight} kg
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <Button size="sm" onClick={() => setSelectedAppointment(appt)}>
                                                    <Plus className="mr-2 h-3 w-3" /> Prescription
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                    {appointments.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                                                {selectedDate ? "No appointments found for this date." : "Please select a date to view appointments."}
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </Card>

                </div>
            </main>

            {/* Prescription Modal */}
            <AnimatePresence>
                {selectedAppointment && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="w-full max-w-lg bg-white rounded-lg shadow-xl overflow-hidden"
                        >
                            <div className="p-6 border-b flex items-center justify-between">
                                <h3 className="text-lg font-semibold">Write Prescription</h3>
                                <Button variant="ghost" size="icon" onClick={() => setSelectedAppointment(null)}>
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Medication Name</Label>
                                        <Input name="medication" value={prescriptionData.medication} onChange={handleInputChange} placeholder="e.g. Paracetamol" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Dosage</Label>
                                        <Input name="dosage" value={prescriptionData.dosage} onChange={handleInputChange} placeholder="e.g. 500mg" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Medicines List</Label>
                                    <Input name="medicines" value={prescriptionData.medicines} onChange={handleInputChange} placeholder="List all medicines..." />
                                </div>
                                <div className="space-y-2">
                                    <Label>Instructions</Label>
                                    <Input name="instructions" value={prescriptionData.instructions} onChange={handleInputChange} placeholder="e.g. Take after food" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Additional Details</Label>
                                    <Input name="details" value={prescriptionData.details} onChange={handleInputChange} placeholder="Any other notes..." />
                                </div>
                            </div>
                            <div className="p-6 border-t bg-muted/20 flex justify-end gap-2">
                                <Button variant="outline" onClick={() => setSelectedAppointment(null)}>Cancel</Button>
                                <Button onClick={handleSubmitPrescription} disabled={isSubmitting}>
                                    {isSubmitting ? "Submitting..." : "Submit Prescription"}
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
