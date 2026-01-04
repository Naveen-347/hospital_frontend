"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  User,
  Calendar,
  MapPin,
  Weight,
  Mail,
  Lock,
  ArrowRight,
  Loader2,
  CheckCircle2,
  ShieldCheck
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const API_URL = (process.env.NEXT_PUBLIC_API_URL || "https://hospital-backend-7.onrender.com") + "/api/users/register";

export default function RegistrationPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    address: "",
    weight: "",
    email: "",
    password: ""
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  }

  function validate(data: typeof formData) {
    const e: Record<string, string> = {};
    if (!data.name.trim()) e.name = "Name is required";
    if (!data.age || Number(data.age) <= 0) e.age = "Valid age required";
    if (!data.address.trim()) e.address = "Address is required";
    if (!data.weight || Number(data.weight) <= 0) e.weight = "Valid weight required";
    if (!data.email.trim() || !/^\S+@\S+\.\S+$/.test(data.email)) e.email = "Valid email required";
    if (!data.password || data.password.length < 6) e.password = "Min 6 characters";
    return e;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate(formData);
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const data = await res.json();
        const userId = data.id || data.userid; // Backup for inconsistent API naming

        console.log("✅ Registered userId:", userId);

        // Persist User Info for Dashboard Sidebar (Fix for "No Info" bug)
        localStorage.setItem("userId", userId);
        localStorage.setItem("userName", formData.name);
        localStorage.setItem("userEmail", formData.email);
        localStorage.setItem("userAddress", formData.address);

        router.push("/login-user");
      } else {
        alert("Registration failed. Please try a different email.");
      }
    } catch (error) {
      console.error("Server error:", error);
      alert("Server connection failed. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }

  const fields = [
    { name: "name", label: "Full Name", type: "text", icon: User, placeholder: "John Doe", full: true },
    { name: "age", label: "Age", type: "number", icon: Calendar, placeholder: "25", full: false },
    { name: "weight", label: "Weight (kg)", type: "number", icon: Weight, placeholder: "70", full: false },
    { name: "email", label: "Email Address", type: "email", icon: Mail, placeholder: "john@example.com", full: true },
    { name: "address", label: "Address", type: "text", icon: MapPin, placeholder: "City, Country", full: true },
    { name: "password", label: "Password", type: "password", icon: Lock, placeholder: "••••••", full: true },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Left Side - Visual & Info */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-slate-900 text-white p-12 flex-col justify-between">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-900 opacity-90" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1538108149393-fbbd81895907?q=80&w=2800&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay" />

        <div className="relative z-10 pt-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-100 text-sm mb-6 backdrop-blur-md">
            <ShieldCheck className="w-4 h-4" />
            <span>Secure Patient Portal</span>
          </div>
          <h1 className="text-5xl font-bold leading-tight mb-6">
            Your Health Journey <br /> Starts Here
          </h1>
          <p className="text-lg text-blue-100 max-w-md leading-relaxed">
            Join thousands of patients who trust HospitalCare for their medical needs.
            Book appointments, track prescriptions, and manage your health records in one place.
          </p>
        </div>

        <div className="relative z-10 space-y-6">
          <div className="space-y-4">
            {[
              "Instant Appointment Booking",
              "24/7 Access to Medical Records",
              "Secure Prescription Management"
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="h-5 w-5 text-blue-300" />
                </div>
                <span className="font-medium text-lg text-blue-50">{feature}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-blue-300/60 pt-6 border-t border-blue-500/30">
            © 2026 HospitalCare System. All rights reserved.
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 relative">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center lg:text-left space-y-2">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">Create an Account</h2>
            <p className="text-slate-500">
              Already have an account?{" "}
              <Link href="/login-user" className="font-semibold text-primary hover:text-blue-700 transition-colors">
                Sign in
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-5">
              {fields.map((field) => (
                <div
                  key={field.name}
                  className={cn("space-y-2", field.full ? "col-span-2" : "col-span-1")}
                >
                  <Label htmlFor={field.name} className="text-sm font-medium text-slate-700">
                    {field.label}
                  </Label>
                  <div className="relative group">
                    <div className="absolute left-3 top-3 text-slate-400 transition-colors group-focus-within:text-primary">
                      <field.icon className="h-5 w-5" />
                    </div>
                    <Input
                      id={field.name}
                      name={field.name}
                      type={field.type}
                      placeholder={field.placeholder}
                      value={formData[field.name as keyof typeof formData]}
                      onChange={handleChange}
                      className={cn(
                        "pl-10 h-11 bg-white border-slate-200 focus:border-primary focus:ring-primary/20 transition-all",
                        errors[field.name] ? "border-destructive focus-ring-destructive/20" : ""
                      )}
                    />
                  </div>
                  {errors[field.name] && (
                    <p className="text-xs text-destructive font-medium animate-in slide-in-from-top-1">{errors[field.name]}</p>
                  )}
                </div>
              ))}
            </div>

            <Button
              className="w-full h-11 text-base shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all"
              size="lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Creating Account...
                </>
              ) : (
                <>
                  Create Account
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>
          </form>

          <p className="text-center text-xs text-slate-400 px-6">
            By clicking "Create Account", you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}
