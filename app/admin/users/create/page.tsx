"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const ADMIN_USER_API = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080") + "/admin/users";

export default function CreateUserPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: "",
        age: "",
        address: "",
        weight: "",
        email: "",
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

        const payload = {
            ...formData,
            age: parseInt(formData.age),
            weight: parseFloat(formData.weight)
        };

        try {
            const response = await fetch(ADMIN_USER_API, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                alert("User created successfully!");
                router.push("/admin/users");
            } else {
                alert("Failed to create user");
            }
        } catch (error) {
            console.error("Error creating user:", error);
            alert("Error creating user");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/admin/users">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Add New User</h1>
                    <p className="text-muted-foreground">Register a new patient account</p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>User Details</CardTitle>
                    <CardDescription>Enter the patient's personal information.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Full Name</Label>
                                <Input name="name" value={formData.name} onChange={handleChange} required placeholder="John Doe" />
                            </div>
                            <div className="space-y-2">
                                <Label>Age</Label>
                                <Input name="age" type="number" value={formData.age} onChange={handleChange} required placeholder="25" />
                            </div>
                            <div className="space-y-2">
                                <Label>Weight (kg)</Label>
                                <Input name="weight" type="number" step="0.1" value={formData.weight} onChange={handleChange} required placeholder="70.5" />
                            </div>
                            <div className="space-y-2">
                                <Label>Email</Label>
                                <Input name="email" type="email" value={formData.email} onChange={handleChange} required placeholder="john@example.com" />
                            </div>
                            <div className="space-y-2 sm:col-span-2">
                                <Label>Address</Label>
                                <Input name="address" value={formData.address} onChange={handleChange} required placeholder="123 Main St, City" />
                            </div>
                            <div className="space-y-2 sm:col-span-2">
                                <Label>Password</Label>
                                <Input name="password" type="password" value={formData.password} onChange={handleChange} required placeholder="Set a password" />
                            </div>
                        </div>

                        <div className="flex justify-end pt-4">
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Creating...
                                    </>
                                ) : (
                                    <>
                                        <Save className="mr-2 h-4 w-4" />
                                        Create User
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
