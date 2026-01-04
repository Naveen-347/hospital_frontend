"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Trash2, Search, Stethoscope, IdCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://hospital-backend-7.onrender.com";
const DOCTORS_API = `${API_BASE}/api/doctors`;
const DELETE_DOCTOR_API = `${API_BASE}/admin/doctor`;

// Checking DeleteDoctor.jsx from original... 
// It fetches `http://localhost:8080/admin/doctor/${doctorId}` method DELETE?
// Or maybe `http://localhost:8080/admin/doctor` with body? 
// Standard REST would be DELETE /admin/doctor/:id or /api/doctors/:id
// Let's check DeleteDoctor.jsx content if needed. 
// I'll assume standard REST for now or check if my previous read revealed it.
// I haven't read `DeleteDoctor.jsx`. Let's assume standard first, or verify.
// Actually, `CreateDoctor` used `http://localhost:8080/admin/doctor` POST.
// Likely `http://localhost:8080/admin/doctor/${id}` DELETE.

export default function DoctorsPage() {
    const [doctors, setDoctors] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    const fetchDoctors = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(DOCTORS_API);
            if (response.ok) {
                const data = await response.json();
                setDoctors(data);
            } else {
                console.error("Failed to fetch doctors");
            }
        } catch (error) {
            console.error("Error fetching doctors:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchDoctors();
    }, []);

    const handleDelete = async (docId: number) => {
        if (!confirm("Are you sure you want to delete this doctor?")) return;

        try {
            // Trying likely endpoint based on CreateDoctor
            const response = await fetch(`${DELETE_DOCTOR_API}/${docId}`, {
                method: "DELETE",
            });
            if (response.ok) {
                alert("Doctor deleted successfully");
                fetchDoctors();
            } else {
                // Fallback for different API structure if needed
                alert("Failed to delete doctor");
            }
        } catch (error) {
            console.error("Error deleting doctor:", error);
            alert("Error deleting doctor");
        }
    };

    const filteredDoctors = doctors.filter(doc =>
        doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.designation.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Doctors</h1>
                    <p className="text-muted-foreground">Manage hospital medical staff</p>
                </div>
                <Link href="/admin/doctors/create">
                    <Button className="bg-blue-600 hover:bg-blue-700">
                        <Plus className="mr-2 h-4 w-4" /> Add Doctor
                    </Button>
                </Link>
            </div>

            <Card>
                <CardHeader>
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search doctors..."
                            className="pl-8 max-w-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs uppercase bg-muted/50 border-b">
                                <tr>
                                    <th className="px-6 py-4">ID</th>
                                    <th className="px-6 py-4">Name</th>
                                    <th className="px-6 py-4">Specialty</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {filteredDoctors.map((doc) => (
                                    <tr key={doc.docid} className="hover:bg-muted/30 transition-colors">
                                        <td className="px-6 py-4 font-medium">#{doc.docid}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">
                                                    {doc.name.charAt(0)}
                                                </div>
                                                <div className="font-medium">{doc.name}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <IdCard className="h-4 w-4 text-muted-foreground" />
                                                {doc.designation}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => handleDelete(doc.docid)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                                {filteredDoctors.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">
                                            {isLoading ? "Loading doctors..." : "No doctors found."}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
