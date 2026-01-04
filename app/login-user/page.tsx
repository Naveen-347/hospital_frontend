"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, Lock, LogIn, ArrowRight, Loader2, HeartPulse, CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const USER_LOGIN_API = (process.env.NEXT_PUBLIC_API_URL || "https://hospital-backend-7.onrender.com") + "/api/users/login";

export default function UserLogin() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();

        if (!email || !password) {
            alert("Please enter both email and password");
            return;
        }

        setIsLoading(true);

        try {
            const res = await fetch(USER_LOGIN_API, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            if (res.ok) {
                const data = await res.json();
                console.log("Login response:", data);

                if (!data.userid) {
                    alert("Login response missing user ID");
                    return;
                }

                localStorage.setItem("isLoggedIn", "true");
                localStorage.setItem("role", "user");
                localStorage.setItem("userId", data.userid);
                // Note: API might not return name/address on login. 
                // We'll rely on Dashboard to fetch/handle missing info or show defaults.

                router.push(`/doctors/${data.userid}`);
            } else {
                alert("Invalid email or password");
            }
        } catch (error) {
            console.error(error);
            alert("Connection error. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Left Side - Visual */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-slate-900 text-white p-12 flex-col justify-between">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-900 to-slate-900 opacity-90" />
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1516574187841-693083f69917?q=80&w=2800&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay" />

                <div className="relative z-10 pt-16">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="h-12 w-12 bg-blue-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                            <HeartPulse className="h-7 w-7" />
                        </div>
                        <span className="font-bold text-3xl tracking-tight">HospitalCare</span>
                    </div>
                    <h1 className="text-5xl font-bold leading-tight mb-6">
                        Welcome Back
                    </h1>
                    <p className="text-lg text-blue-100 max-w-md leading-relaxed">
                        Sign in to manage your appointments, view test results, and consult with top doctors.
                    </p>
                </div>

                <div className="relative z-10">
                    <div className="flex items-center gap-4 p-4 bg-white/10 rounded-2xl backdrop-blur-md border border-white/10">
                        <div className="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0">
                            <CheckCircle2 className="h-6 w-6 text-blue-300" />
                        </div>
                        <div>
                            <p className="font-medium">Secure Access</p>
                            <p className="text-sm text-blue-200/80">Your health data is encrypted and safe.</p>
                        </div>
                    </div>
                    <p className="text-xs text-blue-300/60 mt-8">
                        © 2026 HospitalCare System.
                    </p>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 relative">
                <div className="max-w-sm w-full space-y-8">
                    <div className="text-center lg:text-left space-y-2">
                        <h2 className="text-3xl font-bold tracking-tight text-slate-900">Sign In</h2>
                        <p className="text-slate-500">
                            Don't have an account?{" "}
                            <Link href="/" className="font-semibold text-primary hover:text-blue-700 transition-colors">
                                Create one here
                            </Link>
                        </p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-5">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm font-medium text-slate-700">Email Address</Label>
                            <div className="relative group">
                                <div className="absolute left-3 top-3 text-slate-400 transition-colors group-focus-within:text-primary">
                                    <Mail className="h-5 w-5" />
                                </div>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="pl-10 h-11 bg-white border-slate-200 focus:border-primary focus:ring-primary/20 transition-all"
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
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="pl-10 h-11 bg-white border-slate-200 focus:border-primary focus:ring-primary/20 transition-all"
                                />
                            </div>
                        </div>

                        <Button
                            className="w-full h-11 text-base shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all"
                            onClick={handleLogin}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    Logging in...
                                </>
                            ) : (
                                <>
                                    <LogIn className="mr-2 h-5 w-5" />
                                    Login to Dashboard
                                </>
                            )}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}
