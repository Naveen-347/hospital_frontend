"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Stethoscope, Lock, LogIn, Loader2, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";

export default function DoctorLogin() {
    const router = useRouter();
    const [credentials, setCredentials] = useState({ name: "", password: "" });
    const [loginStatus, setLoginStatus] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCredentials({ ...credentials, [name]: value });
        // Reset status on change
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
                // alert("Login successful!");
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
        <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
            {/* Background decorative element */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-[20%] -left-[10%] w-[600px] h-[600px] bg-blue-100/40 rounded-full blur-3xl opacity-50" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-sm z-10"
            >
                <Card className="shadow-xl border-t-4 border-t-blue-600">
                    <CardHeader className="text-center space-y-1">
                        <div className="mx-auto h-12 w-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-2">
                            <Stethoscope className="h-6 w-6" />
                        </div>
                        <CardTitle className="text-2xl font-bold">Doctor Portal</CardTitle>
                        <CardDescription>Secure login for medical staff</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleLogin} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name" className="flex items-center gap-2">
                                    <Stethoscope className="h-4 w-4 text-muted-foreground" />
                                    Doctor Name
                                </Label>
                                <Input
                                    id="name"
                                    name="name"
                                    type="text"
                                    placeholder="Dr. Name"
                                    value={credentials.name}
                                    onChange={handleChange}
                                    className={loginStatus === "fail" ? "border-destructive text-destructive" : ""}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password" className="flex items-center gap-2">
                                    <Lock className="h-4 w-4 text-muted-foreground" />
                                    Password
                                </Label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={credentials.password}
                                    onChange={handleChange}
                                    className={loginStatus === "fail" ? "border-destructive text-destructive" : ""}
                                />
                            </div>

                            {loginStatus === "fail" && (
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-sm text-destructive text-center font-medium"
                                >
                                    Invalid credentials. Please try again.
                                </motion.p>
                            )}
                            {errorMessage && (
                                <p className="text-sm text-destructive text-center">{errorMessage}</p>
                            )}

                            <Button
                                className="w-full bg-blue-600 hover:bg-blue-700"
                                onClick={handleLogin}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Accessing...
                                    </>
                                ) : (
                                    <>
                                        <LogIn className="mr-2 h-4 w-4" />
                                        Login to Dashboard
                                    </>
                                )}
                            </Button>
                        </form>
                    </CardContent>
                    <CardFooter className="flex justify-center border-t bg-muted/20 py-4">
                        <Link href="/doctor/signup" className="text-sm text-muted-foreground hover:text-blue-600 flex items-center transition-colors">
                            New Doctor? Register here <ArrowRight className="ml-1 h-3 w-3" />
                        </Link>
                    </CardFooter>
                </Card>
            </motion.div>
        </div>
    );
}
