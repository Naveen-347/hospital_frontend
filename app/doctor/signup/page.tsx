"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { UserPlus, Stethoscope, Lock, IdCard, ArrowRight, Loader2, Hospital, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export default function DoctorSignUp() {
    const router = useRouter();
    const [doctor, setDoctor] = useState({
        name: "",
        designation: "",
        password: ""
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setDoctor({ ...doctor, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await fetch((process.env.NEXT_PUBLIC_API_URL || "https://hospital-backend-7.onrender.com") + "/api/doctors", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(doctor)
            });

            if (response.ok) {
                // Ideally login directly or just redirect to login
                alert("Doctor registered successfully! Please login.");
                router.push("/doctor/login");
            } else {
                const errorText = await response.text();
                alert(`Error: ${response.status} - ${errorText}`);
            }
        } catch (error: any) {
            alert(`Network error: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Left Side - Visual */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-slate-900 text-white p-12 flex-col justify-between">
                <div className="absolute inset-0 bg-gradient-to-br from-teal-900 to-slate-900 opacity-90" />
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=2800&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay" />

                <div className="relative z-10 pt-16">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-400/30 text-teal-100 text-sm mb-6 backdrop-blur-md">
                        <Hospital className="w-4 h-4" />
                        <span>Medical Staff Portal</span>
                    </div>
                    <h1 className="text-5xl font-bold leading-tight mb-6">
                        Join Our Medical <br /> Excellence Team
                    </h1>
                    <p className="text-lg text-teal-100 max-w-md leading-relaxed">
                        Manage your appointments, track patient history, and provide world-class care using our advanced hospital management system.
                    </p>
                </div>

                <div className="relative z-10 space-y-6">
                    <div className="space-y-4">
                        {[
                            "Streamlined Patient Management",
                            "Real-time Appointment Updates",
                            "Digital Prescription handling"
                        ].map((feature, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-full bg-teal-500/20 flex items-center justify-center shrink-0">
                                    <ShieldCheck className="h-5 w-5 text-teal-300" />
                                </div>
                                <span className="font-medium text-lg text-teal-50">{feature}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 relative">
                <div className="max-w-md w-full space-y-8">
                    <div className="text-center lg:text-left space-y-2">
                        <h2 className="text-3xl font-bold tracking-tight text-slate-900">Doctor Registration</h2>
                        <p className="text-slate-500">
                            Already a member?{" "}
                            <Link href="/doctor/login" className="font-semibold text-primary hover:text-blue-700 transition-colors">
                                Sign in here
                            </Link>
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-sm font-medium text-slate-700">Full Name</Label>
                                <div className="relative group">
                                    <div className="absolute left-3 top-3 text-slate-400 transition-colors group-focus-within:text-primary">
                                        <UserPlus className="h-5 w-5" />
                                    </div>
                                    <Input
                                        id="name"
                                        name="name"
                                        placeholder="Dr. John Doe"
                                        value={doctor.name}
                                        onChange={handleChange}
                                        className="pl-10 h-11 bg-white border-slate-200 focus:border-primary focus:ring-primary/20 transition-all"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="designation" className="text-sm font-medium text-slate-700">Specialization / Designation</Label>
                                <div className="relative group">
                                    <div className="absolute left-3 top-3 text-slate-400 transition-colors group-focus-within:text-primary">
                                        <Stethoscope className="h-5 w-5" />
                                    </div>
                                    <Input
                                        id="designation"
                                        name="designation"
                                        placeholder="e.g. Cardiologist, Neurologist"
                                        value={doctor.designation}
                                        onChange={handleChange}
                                        className="pl-10 h-11 bg-white border-slate-200 focus:border-primary focus:ring-primary/20 transition-all"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-sm font-medium text-slate-700">Password</Label>
                                <div className="relative group">
                                    <div className="absolute left-3 top-3 text-slate-400 transition-colors group-focus-within:text-primary">
                                        <Lock className="h-5 w-5" />
                                    </div>
                                    <Input
                                        id="password"
                                        name="password"
                                        type="password"
                                        placeholder="Create a strong password"
                                        value={doctor.password}
                                        onChange={handleChange}
                                        className="pl-10 h-11 bg-white border-slate-200 focus:border-primary focus:ring-primary/20 transition-all"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <Button
                            className="w-full h-11 text-base shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    Creating Profile...
                                </>
                            ) : (
                                <>
                                    Register as Doctor
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </>
                            )}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}
