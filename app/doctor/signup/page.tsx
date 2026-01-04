"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { UserPlus, Stethoscope, Lock, IdCard, ArrowLeft, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";

export default function DoctorSignUp() {
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
                alert("Doctor registered successfully!");
                setDoctor({ name: "", designation: "", password: "" });
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
        <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                <Card className="shadow-lg border-l-4 border-l-blue-500">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-2xl font-bold text-blue-950">Join Staff</CardTitle>
                                <CardDescription>Register as a new doctor</CardDescription>
                            </div>
                            <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                                <UserPlus className="h-5 w-5" />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name" className="flex items-center gap-2">
                                    <Stethoscope className="h-4 w-4 text-muted-foreground" />
                                    Doctor Name
                                </Label>
                                <Input
                                    id="name"
                                    name="name"
                                    value={doctor.name}
                                    onChange={handleChange}
                                    placeholder="Dr. Name"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="designation" className="flex items-center gap-2">
                                    <IdCard className="h-4 w-4 text-muted-foreground" />
                                    Designation / Specialty
                                </Label>
                                <Input
                                    id="designation"
                                    name="designation"
                                    value={doctor.designation}
                                    onChange={handleChange}
                                    placeholder="e.g. Cardiologist"
                                    required
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
                                    value={doctor.password}
                                    onChange={handleChange}
                                    placeholder="Set a strong password"
                                    required
                                />
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-blue-600 hover:bg-blue-700"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Registering...
                                    </>
                                ) : (
                                    "Register Doctor"
                                )}
                            </Button>
                        </form>
                    </CardContent>
                    <CardFooter>
                        <Link href="/doctor/login">
                            <Button variant="link" className="pl-0 text-blue-600">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Login
                            </Button>
                        </Link>
                    </CardFooter>
                </Card>
            </motion.div>
        </div>
    );
}
