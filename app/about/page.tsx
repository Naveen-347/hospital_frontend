"use client";

import React from "react";
import { motion } from "framer-motion";
import { Ambulance, Stethoscope, Microscope, Pill, Activity, CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function AboutPage() {
    const services = [
        { title: "Emergency Care", icon: Ambulance, description: "24/7 emergency services with expert trauma care." },
        { title: "Outpatient Services", icon: Stethoscope, description: "Consultations with specialists across departments." },
        { title: "Diagnostics", icon: Microscope, description: "Advanced lab and imaging services." },
        { title: "Surgery", icon: Activity, description: "State-of-the-art surgical facilities." },
        { title: "Pharmacy", icon: Pill, description: "In-house pharmacy with all essential medications." },
    ];

    return (
        <div className="min-h-screen bg-gray-50 pt-16">
            {/* Hero Section */}
            <section className="relative bg-primary text-primary-foreground py-20 px-4">
                <div className="container mx-auto text-center space-y-4">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-bold tracking-tight"
                    >
                        Welcome to HospitalCare
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-xl md:text-2xl opacity-90 font-light"
                    >
                        Compassionate Care, Advanced Medicine, Close to Home.
                    </motion.p>
                </div>

                {/* Decorative Circles */}
                <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-2xl pointer-events-none" />
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl pointer-events-none" />
            </section>

            <section className="py-16 px-4 container mx-auto">
                <div className="max-w-3xl mx-auto text-center space-y-6">
                    <h2 className="text-3xl font-bold text-primary">About Us</h2>
                    <p className="text-muted-foreground text-lg leading-relaxed">
                        HospitalCare is a multi-specialty healthcare institution committed to providing high-quality medical services with compassion and excellence.
                        We combine cutting-edge technology with a patient-centered approach to ensure the best outcomes for our community.
                    </p>
                </div>
            </section>

            <section className="py-16 px-4 bg-secondary/20">
                <div className="container mx-auto">
                    <h2 className="text-3xl font-bold text-center mb-12">Our Services</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {services.map((service, index) => (
                            <motion.div
                                key={service.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                viewport={{ once: true }}
                            >
                                <Card className="h-full hover:shadow-lg transition-shadow border-t-4 border-t-primary">
                                    <CardContent className="p-6 text-center space-y-4">
                                        <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary">
                                            <service.icon className="h-8 w-8" />
                                        </div>
                                        <h3 className="text-xl font-bold">{service.title}</h3>
                                        <p className="text-muted-foreground">{service.description}</p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-16 px-4 container mx-auto">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us?</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                        {[
                            "Experienced Doctors",
                            "Modern Equipment",
                            "Patient-Centered Care",
                            "Affordable Pricing"
                        ].map((item, i) => (
                            <Card key={i} className="bg-primary text-primary-foreground border-none">
                                <CardContent className="p-6 flex flex-col items-center justify-center text-center h-full min-h-[140px] gap-3">
                                    <CheckCircle className="h-8 w-8 opacity-80" />
                                    <span className="font-semibold text-lg">{item}</span>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-20 px-4 bg-primary text-primary-foreground text-center">
                <div className="container mx-auto space-y-6">
                    <h2 className="text-3xl font-bold">Ready to Visit?</h2>
                    <p className="text-primary-foreground/80 max-w-xl mx-auto">
                        Schedule an appointment today or visit us directly for any medical assistance.
                    </p>
                    {/* Add a button maybe? */}
                </div>
            </section>
        </div>
    );
}
