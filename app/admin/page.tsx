"use client";

import React from "react";
import Link from "next/link";
import { Users, Stethoscope, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function AdminDashboard() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground">Admin overview and quick actions</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Link href="/admin/users">
                    <Card className="hover:bg-muted/50 transition-colors cursor-pointer h-full">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Manage Users</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">View & Edit</div>
                            <p className="text-xs text-muted-foreground">Manage patient accounts</p>
                        </CardContent>
                    </Card>
                </Link>
                <Link href="/admin/doctors">
                    <Card className="hover:bg-muted/50 transition-colors cursor-pointer h-full">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Manage Doctors</CardTitle>
                            <Stethoscope className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">View & Edit</div>
                            <p className="text-xs text-muted-foreground">Manage medical staff</p>
                        </CardContent>
                    </Card>
                </Link>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <Link href="/admin/users/create" className="flex items-center justify-between p-3 rounded-md border hover:bg-muted transition-colors">
                            <span className="font-medium flex items-center gap-2"><div className="h-2 w-2 rounded-full bg-green-500" /> Add New User</span>
                            <ArrowRight className="h-4 w-4 text-muted-foreground" />
                        </Link>
                        <Link href="/admin/doctors/create" className="flex items-center justify-between p-3 rounded-md border hover:bg-muted transition-colors">
                            <span className="font-medium flex items-center gap-2"><div className="h-2 w-2 rounded-full bg-blue-500" /> Add New Doctor</span>
                            <ArrowRight className="h-4 w-4 text-muted-foreground" />
                        </Link>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
