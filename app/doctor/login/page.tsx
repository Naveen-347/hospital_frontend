"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Stethoscope, Lock, LogIn, Loader2, HeartPulse, ShieldCheck, ArrowRight, UserPlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export default function DoctorLogin() {
    const router = useRouter();
    const [credentials, setCredentials] = useState({ name: "", password: "" });
    const [loginStatus, setLoginStatus] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCredentials({ ...credentials, [name]: value });
        if (loginStatus || errorMessage) {
            setLoginStatus("");
            setErrorMessage("");
        }
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMessage("");
        setLoginStatus("");

        try {
            const response = await fetch((process.env.NEXT_PUBLIC_API_URL || "https://hospital-backend-7.onrender.com") + "/api/doctors");
            if (!response.ok) throw new Error("Failed to fetch doctors");

            const doctors = await response.json();
            const found = doctors.find(
                (doc: any) =>
                    doc.name === credentials.name &&
                    doc.password === credentials.password
            );

            if (found) {
                localStorage.setItem("doctorId", found.docid);
                localStorage.setItem("role", "doctor");
                localStorage.setItem("isLoggedIn", "true");
                setLoginStatus("success");
                router.push("/doctor/home");
            } else {
                setLoginStatus("fail");
            }
        } catch (error: any) {
            setErrorMessage(`Login failed: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Left Side - Visual */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-slate-900 text-white p-12 flex-col justify-between">
                <div className="absolute inset-0 bg-gradient-to-tr from-teal-900 to-slate-900 opacity-90" />
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1551076805-e1869033e561?q=80&w=2800&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay" />

                <div className="relative z-10 pt-16">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="h-12 w-12 bg-white/10 rounded-xl flex items-center justify-center text-teal-300 backdrop-blur-md border border-white/10">
                            <Stethoscope className="h-7 w-7" />
                        </div>
                        <span className="font-bold text-3xl tracking-tight text-white">HospitalCare</span>
                    </div>
                    <h1 className="text-5xl font-bold leading-tight mb-6">
                        Welcome Back, <br /> Doctor
                    </h1>
                    <p className="text-lg text-teal-100 max-w-md leading-relaxed">
                        Securely access your dashboard to view patient records, upcoming appointments, and daily schedules.
                    </p>
                </div>

                <div className="relative z-10">
                    <div className="flex items-center gap-4 p-4 bg-white/10 rounded-2xl backdrop-blur-md border border-white/10">
                        <div className="h-10 w-10 rounded-full bg-teal-500/20 flex items-center justify-center shrink-0">
                            <ShieldCheck className="h-6 w-6 text-teal-300" />
                        </div>
                        <div>
                            <p className="font-medium">HIPAA Compliant</p>
                            <p className="text-sm text-teal-200/80">Secure encrypted access for medical professionals.</p>
                        </div>
                    </div>
                    <p className="text-xs text-teal-300/60 mt-8">
                        © 2026 HospitalCare System. Authorized personnel only.
                    </p>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 relative">
                <div className="max-w-sm w-full space-y-8">
                    <div className="text-center lg:text-left space-y-2">
                        <h2 className="text-3xl font-bold tracking-tight text-slate-900">Staff Portal Login</h2>
                        <p className="text-slate-500">
                            New staff member?{" "}
                            <Link href="/doctor/signup" className="font-semibold text-primary hover:text-blue-700 transition-colors">
                                Register account
                            </Link>
                        </p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-5">
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-sm font-medium text-slate-700">Doctor Name</Label>
                            <div className="relative group">
                                <div className="absolute left-3 top-3 text-slate-400 transition-colors group-focus-within:text-primary">
                                    <Stethoscope className="h-5 w-5" />
                                </div>
                                <Input
                                    id="name"
                                    name="name"
                                    type="text"
                                    placeholder="Dr. Name"
                                    value={credentials.name}
                                    onChange={handleChange}
                                    className={cn(
                                        "pl-10 h-11 bg-white border-slate-200 focus:border-primary focus:ring-primary/20 transition-all",
                                        loginStatus === "fail" ? "border-destructive focus:ring-destructive/20" : ""
                                    )}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password" className="text-sm font-medium text-slate-700">Password</Label>
                                <Link href="#" className="text-xs font-medium text-primary hover:underline">Forgot password?</Link>
                            </div>
                            <div className="relative group">
                                <div className="absolute left-3 top-3 text-slate-400 transition-colors group-focus-within:text-primary">
                                    <Lock className="h-5 w-5" />
                                </div>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={credentials.password}
                                    onChange={handleChange}
                                    className={cn(
                                        "pl-10 h-11 bg-white border-slate-200 focus:border-primary focus:ring-primary/20 transition-all",
                                        loginStatus === "fail" ? "border-destructive focus:ring-destructive/20" : ""
                                    )}
                                />
                            </div>
                        </div>

                        {loginStatus === "fail" && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm font-medium text-center"
                            >
                                Invalid credentials. Please try again.
                            </motion.div>
                        )}
                        {errorMessage && (
                            <p className="text-sm text-destructive text-center">{errorMessage}</p>
                        )}

                        <Button
                            className="w-full h-11 text-base shadow-lg shadow-teal-500/20 hover:shadow-teal-500/30 transition-all bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700"
                            onClick={handleLogin}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    Accessing Portal...
                                </>
                            ) : (
                                <>
                                    <LogIn className="mr-2 h-5 w-5" />
                                    Access Dashboard
                                </>
                            )}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}
