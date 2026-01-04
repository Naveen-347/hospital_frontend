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
    Weight,
    Stethoscope,
    LayoutDashboard,
    Users,
    ClipboardList,
    Settings
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
                // If we don't have doctorId, we can't fetch. 
                // But normally we set it on login.
                if (!doctorId) return;

                const response = await fetch(`${DOCTOR_API_BASE}/${doctorId}`);
                if (!response.ok) throw new Error("Failed to fetch doctor details");
                const data = await response.json();
                setUserDetails(data);
            } catch (error) {
                console.error("Error fetching doctor details:", error);
            }
        };

        fetchDoctorDetails();
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

    // Prepare nav items
    const navItems = [
        { label: "Overview", icon: LayoutDashboard, active: true },
        { label: "My Patients", icon: Users },
        { label: "Appointments", icon: Calendar },
        { label: "Reports", icon: ClipboardList },
        { label: "Settings", icon: Settings },
    ];

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans text-slate-900">
            {/* Mobile Header */}
            <div className="md:hidden flex items-center justify-between p-4 bg-white/80 backdrop-blur-md border-b sticky top-0 z-50">
                <div className="flex items-center gap-2">
                    <div className="h-8 w-8 bg-teal-100 rounded-lg flex items-center justify-center text-teal-700">
                        <Stethoscope className="h-5 w-5" />
                    </div>
                    <span className="font-bold text-lg text-slate-800">HospitalCare</span>
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
                            "fixed md:static inset-y-0 left-0 z-40 w-72 bg-slate-900 text-white flex flex-col shadow-2xl md:shadow-none transition-transform",
                            sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
                        )}
                    >
                        <div className="p-6 hidden md:flex items-center gap-3">
                            <div className="h-10 w-10 bg-teal-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-teal-500/30">
                                <Stethoscope className="h-6 w-6" />
                            </div>
                            <span className="font-bold text-xl tracking-tight">HospitalCare</span>
                        </div>

                        {/* User Profile Card in Sidebar */}
                        <div className="px-4 mb-6">
                            <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700 backdrop-blur-sm">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-teal-400 to-blue-500 flex items-center justify-center text-white font-bold text-lg shadow-md">
                                        {userDetails.name ? userDetails.name.charAt(0).toUpperCase() : "D"}
                                    </div>
                                    <div className="overflow-hidden">
                                        <h3 className="font-medium text-sm truncate text-slate-100">Dr. {userDetails.name || "Doctor"}</h3>
                                        <p className="text-xs text-slate-400 truncate">{userDetails.designation || "Specialist"}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <nav className="flex-1 px-4 space-y-1">
                            {navItems.map((item, i) => (
                                <button
                                    key={i}
                                    className={cn(
                                        "w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group",
                                        item.active
                                            ? "bg-teal-600 text-white shadow-lg shadow-teal-900/20"
                                            : "text-slate-400 hover:bg-slate-800 hover:text-teal-400"
                                    )}
                                >
                                    <item.icon className={cn("h-5 w-5", item.active ? "text-white" : "text-slate-500 group-hover:text-teal-400")} />
                                    {item.label}
                                    {item.active && <ChevronRight className="ml-auto h-4 w-4 opacity-50" />}
                                </button>
                            ))}
                        </nav>

                        <div className="p-4 mt-auto border-t border-slate-800">
                            <Button
                                variant="ghost"
                                className="w-full justify-start text-slate-400 hover:text-red-400 hover:bg-red-950/30 gap-2"
                                onClick={handleLogout}
                            >
                                <LogOut className="h-4 w-4" />
                                Logout
                            </Button>
                        </div>
                    </motion.aside>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <main className="flex-1 p-4 md:p-8 overflow-y-auto h-screen bg-slate-50">
                <div className="max-w-6xl mx-auto space-y-8">

                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard Overview</h1>
                            <p className="text-slate-500 mt-1">Welcome back, Dr. {userDetails.name}. You have <span className="font-bold text-teal-600">{appointments.length}</span> appointments scheduled.</p>
                        </div>

                        <div className="flex items-center gap-3 bg-white p-1.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="px-3 py-1.5 bg-slate-100 rounded-lg">
                                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Date Filter</span>
                            </div>
                            <Input
                                type="date"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                className="border-0 focus-visible:ring-0 w-auto h-auto p-0 text-sm font-medium text-slate-700 bg-transparent"
                            />
                        </div>
                    </div>

                    {/* Stats or Banner could go here */}

                    {/* Appointments Table */}
                    <Card className="border-0 shadow-xl shadow-slate-200/50 overflow-hidden ring-1 ring-slate-100">
                        <CardHeader className="bg-white border-b border-slate-100 pb-4">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                    <Calendar className="h-5 w-5 text-teal-500" />
                                    Scheduled Appointments
                                </CardTitle>
                                <Badge variant="outline" className="px-2 py-1 text-slate-500 bg-slate-50">
                                    {selectedDate ? selectedDate : "Select Date"}
                                </Badge>
                            </div>
                        </CardHeader>
                        <div className="overflow-x-auto bg-white">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs font-semibold uppercase bg-slate-50 text-slate-500 border-b border-slate-100">
                                    <tr>
                                        <th className="px-6 py-4">Status & ID</th>
                                        <th className="px-6 py-4">Patient Profile</th>
                                        <th className="px-6 py-4">Contact Info</th>
                                        <th className="px-6 py-4">Vitals</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {appointments.map((appt) => (
                                        <tr key={appt.id} className="hover:bg-slate-50/80 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col gap-1">
                                                    <Badge className="w-fit bg-green-100 text-green-700 hover:bg-green-100 border-green-200 shadow-none text-[10px] px-2">
                                                        Confirmed
                                                    </Badge>
                                                    <span className="font-mono text-xs text-slate-400">#{appt.appointmentNo}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-9 w-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold ring-2 ring-white shadow-sm">
                                                        {appt.user?.name?.charAt(0) || "P"}
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold text-slate-900">{appt.user?.name}</div>
                                                        <div className="text-xs text-slate-500 flex items-center gap-1">
                                                            <span>Age: {appt.user?.age}</span>
                                                            <span className="w-1 h-1 rounded-full bg-slate-300" />
                                                            <span>{appt.user?.gender || "N/A"}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2 text-slate-600 text-xs">
                                                        <Mail className="h-3 w-3 text-slate-400" />
                                                        {appt.user?.email || "No email"}
                                                    </div>
                                                    <div className="flex items-center gap-2 text-slate-600 text-xs">
                                                        <MapPin className="h-3 w-3 text-slate-400" />
                                                        {appt.user?.address || "No address"}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2 text-slate-700 text-xs font-medium">
                                                    <Weight className="h-4 w-4 text-slate-400" />
                                                    {appt.user?.weight ? `${appt.user.weight} kg` : "N/A"}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <Button
                                                    size="sm"
                                                    className="bg-teal-600 hover:bg-teal-700 text-white shadow-md shadow-teal-500/20"
                                                    onClick={() => setSelectedAppointment(appt)}
                                                >
                                                    <FileText className="mr-1.5 h-3.5 w-3.5" />
                                                    Prescribe
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                    {appointments.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-16 text-center">
                                                <div className="flex flex-col items-center justify-center text-slate-400 gap-3">
                                                    <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center">
                                                        <Calendar className="h-6 w-6 text-slate-300" />
                                                    </div>
                                                    <p>{selectedDate ? "No appointments scheduled for this date." : "Please select a date from the filter above."}</p>
                                                </div>
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
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden ring-1 ring-slate-900/5"
                        >
                            <div className="p-6 border-b bg-slate-50/50 flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900">Write Prescription</h3>
                                    <p className="text-xs text-slate-500">For Patient: {selectedAppointment.user?.name}</p>
                                </div>
                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={() => setSelectedAppointment(null)}>
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>

                            <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-xs font-semibold text-slate-500 uppercase">Medication Name</Label>
                                        <Input
                                            name="medication"
                                            value={prescriptionData.medication}
                                            onChange={handleInputChange}
                                            placeholder="e.g. Paracetamol"
                                            className="bg-slate-50 border-slate-200"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-semibold text-slate-500 uppercase">Dosage</Label>
                                        <Input
                                            name="dosage"
                                            value={prescriptionData.dosage}
                                            onChange={handleInputChange}
                                            placeholder="e.g. 500mg"
                                            className="bg-slate-50 border-slate-200"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-semibold text-slate-500 uppercase">Medicines List</Label>
                                    <Input
                                        name="medicines"
                                        value={prescriptionData.medicines}
                                        onChange={handleInputChange}
                                        placeholder="List all medicines (comma separated)..."
                                        className="bg-slate-50 border-slate-200"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-semibold text-slate-500 uppercase">Instructions</Label>
                                    <Input
                                        name="instructions"
                                        value={prescriptionData.instructions}
                                        onChange={handleInputChange}
                                        placeholder="e.g. Take after food twice daily"
                                        className="bg-slate-50 border-slate-200"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-semibold text-slate-500 uppercase">Additional Clinical Notes</Label>
                                    <Input
                                        name="details"
                                        value={prescriptionData.details}
                                        onChange={handleInputChange}
                                        placeholder="Patient history or observations..."
                                        className="bg-slate-50 border-slate-200"
                                    />
                                </div>
                            </div>

                            <div className="p-6 border-t bg-slate-50 flex justify-end gap-3">
                                <Button variant="outline" onClick={() => setSelectedAppointment(null)} className="border-slate-200 text-slate-600 hover:bg-slate-100">Cancel</Button>
                                <Button
                                    onClick={handleSubmitPrescription}
                                    disabled={isSubmitting}
                                    className="bg-teal-600 hover:bg-teal-700 text-white shadow-md shadow-teal-500/20"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Clock className="mr-2 h-4 w-4 animate-spin" /> Submitting...
                                        </>
                                    ) : (
                                        <>
                                            Submit Prescription <ChevronRight className="ml-1 h-4 w-4" />
                                        </>
                                    )}
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
