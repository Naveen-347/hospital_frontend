"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Trash2, Search, Mail, MapPin, Weight, User, MoreVertical, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const USERS_API = (process.env.NEXT_PUBLIC_API_URL || "https://hospital-backend-7.onrender.com") + "/admin/users";

export default function UsersPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(USERS_API);
            if (response.ok) {
                const data = await response.json();
                setUsers(data);
            } else {
                console.error("Failed to fetch users");
            }
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleDelete = async (userId: number) => {
        if (!confirm("Are you sure you want to delete this user?")) return;

        try {
            const response = await fetch(`${USERS_API}/${userId}`, {
                method: "DELETE",
            });
            if (response.ok) {
                alert("User deleted successfully");
                fetchUsers();
            } else {
                alert("Failed to delete user");
            }
        } catch (error) {
            console.error("Error deleting user:", error);
            alert("Error deleting user");
        }
    };

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">User Management</h1>
                    <p className="text-slate-500">Manage registered patients and system accounts.</p>
                </div>
                <Link href="/admin/users/create">
                    <Button className="bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20">
                        <Plus className="mr-2 h-4 w-4" /> Add New User
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
                                placeholder="Search by name or email..."
                                className="pl-9 bg-slate-50 border-slate-200 focus-visible:ring-blue-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                            <span className="font-medium text-slate-900">{filteredUsers.length}</span> users found
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs font-semibold uppercase bg-slate-50/80 text-slate-500 border-b border-slate-100">
                                <tr>
                                    <th className="px-6 py-4">User ID & Name</th>
                                    <th className="px-6 py-4">Contact Details</th>
                                    <th className="px-6 py-4">Health Profile</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 bg-white">
                                {filteredUsers.map((user) => (
                                    <tr key={user.userid} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold ring-2 ring-white shadow-sm">
                                                    {user.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-slate-900">{user.name}</div>
                                                    <div className="text-xs text-slate-500 flex items-center gap-1">
                                                        <span className="px-1.5 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-[10px] font-medium">
                                                            #{user.userid}
                                                        </span>
                                                        <span>• {user.age} yrs</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2 text-slate-600">
                                                    <Mail className="h-3.5 w-3.5 text-slate-400" />
                                                    {user.email}
                                                </div>
                                                <div className="flex items-center gap-2 text-slate-600">
                                                    <MapPin className="h-3.5 w-3.5 text-slate-400" />
                                                    {user.address}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-wrap gap-2">
                                                <Badge variant="outline" className="bg-slate-50 text-slate-600 border-slate-200 font-normal gap-1">
                                                    <Weight className="h-3 w-3" /> {user.weight} kg
                                                </Badge>
                                                {/* Add more badges if data available like Blood Group */}
                                            </div>
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
                                                        <Edit2 className="mr-2 h-4 w-4" /> Edit Details
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem className="text-red-600 focus:text-red-700 focus:bg-red-50 cursor-pointer" onClick={() => handleDelete(user.userid)}>
                                                        <Trash2 className="mr-2 h-4 w-4" /> Delete User
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </td>
                                    </tr>
                                ))}
                                {filteredUsers.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-12 text-center">
                                            <div className="flex flex-col items-center justify-center text-slate-400 gap-3">
                                                <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center">
                                                    <User className="h-6 w-6 text-slate-300" />
                                                </div>
                                                <p>{isLoading ? "Loading users directory..." : "No users found matching your search."}</p>
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
