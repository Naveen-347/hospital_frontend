"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Trash2, Search, Mail, MapPin, Weight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const USERS_API = "http://localhost:8080/admin/users";

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
                    <h1 className="text-3xl font-bold tracking-tight">Users</h1>
                    <p className="text-muted-foreground">Manage registered patients</p>
                </div>
                <Link href="/admin/users/create">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" /> Add User
                    </Button>
                </Link>
            </div>

            <Card>
                <CardHeader>
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search users..."
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
                                    <th className="px-6 py-4">Name / Age</th>
                                    <th className="px-6 py-4">Contact</th>
                                    <th className="px-6 py-4">Details</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {filteredUsers.map((user) => (
                                    <tr key={user.userid} className="hover:bg-muted/30 transition-colors">
                                        <td className="px-6 py-4 font-medium">#{user.userid}</td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium">{user.name}</div>
                                            <div className="text-xs text-muted-foreground">{user.age} years old</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                                                <Mail className="h-3 w-3" /> {user.email}
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                <MapPin className="h-3 w-3" /> {user.address}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center gap-1 text-xs bg-secondary px-2 py-1 rounded-full">
                                                <Weight className="h-3 w-3" /> {user.weight} kg
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => handleDelete(user.userid)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                                {filteredUsers.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                                            {isLoading ? "Loading users..." : "No users found."}
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
