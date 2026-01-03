"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, Save, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const ADMIN_DOCTOR_API = "http://localhost:8080/admin/doctor";

export default function CreateDoctorPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: "",
        designation: "",
        password: ""
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch(ADMIN_DOCTOR_API, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                alert("Doctor created successfully!");
                router.push("/admin/doctors");
            } else {
                alert("Failed to create doctor");
            }
        } catch (error) {
            console.error("Error creating doctor:", error);
            alert("Error creating doctor");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/admin/doctors">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Add New Doctor</h1>
                    <p className="text-muted-foreground">Register a new medical specialist</p>
                </div>
            </div>

            <Card className="border-t-4 border-t-blue-500">
                <CardHeader>
                    <div className="flex items-center gap-4">
                        <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                            <Stethoscope className="h-6 w-6" />
                        </div>
                        <div>
                            <CardTitle>Doctor Profile</CardTitle>
                            <CardDescription>Enter professional details.</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label>Doctor Name</Label>
                            <Input name="name" value={formData.name} onChange={handleChange} required placeholder="Dr. Jane Smith" />
                        </div>
                        <div className="space-y-2">
                            <Label>Specialty / Designation</Label>
                            <Input name="designation" value={formData.designation} onChange={handleChange} required placeholder="e.g. Neurologist" />
                        </div>
                        <div className="space-y-2">
                            <Label>Password</Label>
                            <Input name="password" type="password" value={formData.password} onChange={handleChange} required placeholder="Set access password" />
                        </div>

                        <div className="flex justify-end pt-4">
                            <Button type="submit" disabled={isLoading} className="bg-blue-600 hover:bg-blue-700">
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Creating...
                                    </>
                                ) : (
                                    <>
                                        <Save className="mr-2 h-4 w-4" />
                                        Create Doctor
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
