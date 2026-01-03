"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, Calendar, User, Stethoscope, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";

export default function AppointmentConfirmation() {
    const router = useRouter();
    const [appointment, setAppointment] = useState<any>(null);

    useEffect(() => {
        const data = localStorage.getItem("lastAppointment");
        if (data) {
            setAppointment(JSON.parse(data));
        }
    }, []);

    if (!appointment) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Card>
                    <CardHeader>
                        <CardTitle>No Appointment Found</CardTitle>
                        <CardDescription>We couldn't find any recent appointment booking.</CardDescription>
                    </CardHeader>
                    <CardFooter>
                        <Button onClick={() => router.push("/")}>Go Home</Button>
                    </CardFooter>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 relative overflow-hidden">
            {/* Decorative background circle */}
            <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-green-200/20 rounded-full blur-3xl pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, type: "spring" }}
                className="w-full max-w-md z-10"
            >
                <Card className="border-t-4 border-t-green-500 shadow-xl">
                    <CardHeader className="text-center pb-2">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: "spring" }}
                            className="mx-auto h-16 w-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4"
                        >
                            <CheckCircle className="h-8 w-8" />
                        </motion.div>
                        <CardTitle className="text-2xl text-green-700">Appointment Confirmed!</CardTitle>
                        <CardDescription>Your appointment has been successfully booked.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-4">
                        <div className="bg-muted/50 p-4 rounded-lg space-y-3">
                            <div className="flex items-center gap-3">
                                <User className="h-5 w-5 text-muted-foreground" />
                                <div>
                                    <p className="text-xs text-muted-foreground">Patient Name</p>
                                    <p className="font-medium">{appointment.user?.name}</p>
                                </div>
                            </div>
                            <div className="h-px bg-border/50" />
                            <div className="flex items-center gap-3">
                                <Stethoscope className="h-5 w-5 text-muted-foreground" />
                                <div>
                                    <p className="text-xs text-muted-foreground">Doctor</p>
                                    <p className="font-medium">Dr. {appointment.doctor?.name}</p>
                                    <p className="text-xs text-muted-foreground">{appointment.doctor?.designation}</p>
                                </div>
                            </div>
                            <div className="h-px bg-border/50" />
                            <div className="flex items-center gap-3">
                                <Calendar className="h-5 w-5 text-muted-foreground" />
                                <div>
                                    <p className="text-xs text-muted-foreground">Date & Token</p>
                                    <p className="font-medium">{appointment.appointmentDate}</p>
                                    <p className="text-xs text-green-600 font-medium">Token #{appointment.appointmentNo}</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-2">
                        <Button className="w-full" onClick={() => router.push(`/doctors/${appointment.user?.id}`)}>
                            Book Another
                        </Button>
                        <Button variant="ghost" className="w-full" onClick={() => router.push("/")}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Home
                        </Button>
                    </CardFooter>
                </Card>
            </motion.div>
        </div>
    );
}
