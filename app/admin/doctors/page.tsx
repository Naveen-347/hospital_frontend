"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Trash2, Search, Stethoscope, IdCard, MoreVertical, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://hospital-backend-7.onrender.com";
const DOCTORS_API = `${API_BASE}/api/doctors`;
const DELETE_DOCTOR_API = `${API_BASE}/admin/doctor`;

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
            const response = await fetch(`${DELETE_DOCTOR_API}/${docId}`, {
                method: "DELETE",
            });
            if (response.ok) {
                alert("Doctor deleted successfully");
                fetchDoctors();
            } else {
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
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Medical Staff</h1>
                    <p className="text-slate-500">Manage hospital doctors and specialists.</p>
                </div>
                <Link href="/admin/doctors/create">
                    <Button className="bg-teal-600 hover:bg-teal-700 shadow-md shadow-teal-500/20">
                        <Plus className="mr-2 h-4 w-4" /> Add New Doctor
                    </Button>
                </Link>
            </div>

            <Card className="border-0 shadow-xl shadow-slate-200/50 ring-1 ring-slate-100">
                <CardHeader className="bg-white border-b border-slate-100 pb-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="relative w-full max-w-sm">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                            <Input
                                type="search"
                                placeholder="Search doctors or specialty..."
                                className="pl-9 bg-slate-50 border-slate-200 focus-visible:ring-teal-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                            <span className="font-medium text-slate-900">{filteredDoctors.length}</span> doctors active
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs font-semibold uppercase bg-slate-50/80 text-slate-500 border-b border-slate-100">
                                <tr>
                                    <th className="px-6 py-4">ID & Name</th>
                                    <th className="px-6 py-4">Specialization</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 bg-white">
                                {filteredDoctors.map((doc) => (
                                    <tr key={doc.docid} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 font-bold text-sm ring-2 ring-white shadow-sm">
                                                    {doc.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-slate-900">{doc.name}</div>
                                                    <div className="text-xs text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 w-fit mt-0.5">
                                                        ID: #{doc.docid}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="h-8 w-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                                                    <Stethoscope className="h-4 w-4" />
                                                </div>
                                                <span className="font-medium text-slate-700">{doc.designation}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200 shadow-none font-normal">
                                                Active
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-900">
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                    <DropdownMenuItem className="text-slate-600 cursor-pointer">
                                                        <Edit2 className="mr-2 h-4 w-4" /> Edit Profile
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem className="text-red-600 focus:text-red-700 focus:bg-red-50 cursor-pointer" onClick={() => handleDelete(doc.docid)}>
                                                        <Trash2 className="mr-2 h-4 w-4" /> Delete Doctor
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </td>
                                    </tr>
                                ))}
                                {filteredDoctors.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-12 text-center">
                                            <div className="flex flex-col items-center justify-center text-slate-400 gap-3">
                                                <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center">
                                                    <Stethoscope className="h-6 w-6 text-slate-300" />
                                                </div>
                                                <p>{isLoading ? "Loading staff directory..." : "No doctors found."}</p>
                                            </div>
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
