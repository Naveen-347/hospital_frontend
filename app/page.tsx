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
  Loader2
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const API_URL = "http://localhost:8080/api/users/register";

export default function RegistrationForm() {
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
    // Clear error when user types
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
    if (!data.age || Number(data.age) <= 0) e.age = "Enter a valid age";
    if (!data.address.trim()) e.address = "Address is required";
    if (!data.weight || Number(data.weight) <= 0) e.weight = "Enter a valid weight";
    if (!data.email.trim() || !/^\S+@\S+\.\S+$/.test(data.email)) e.email = "Enter a valid email";
    if (!data.password || data.password.length < 6) e.password = "Password must be at least 6 characters";
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
        const userId = data.id;

        console.log("✅ Registered userId:", userId);

        localStorage.setItem("userId", userId);
        router.push("/login-user");

      } else {
        alert("Registration failed");
      }
    } catch (error) {
      console.error("Server error:", error);
      alert("Server error");
    } finally {
      setIsLoading(false);
    }
  }

  const fields = [
    { name: "name", label: "Full Name", type: "text", icon: User, placeholder: "John Doe" },
    { name: "age", label: "Age", type: "number", icon: Calendar, placeholder: "25" },
    { name: "address", label: "Address", type: "text", icon: MapPin, placeholder: "123 Main St" },
    { name: "weight", label: "Weight (kg)", type: "number", icon: Weight, placeholder: "70" },
    { name: "email", label: "Email Address", type: "email", icon: Mail, placeholder: "john@example.com" },
    { name: "password", label: "Password", type: "password", icon: Lock, placeholder: "******" },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-muted/30">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="w-full shadow-lg border-t-4 border-t-primary">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-3xl font-bold tracking-tight">Create Account</CardTitle>
            <CardDescription>
              Enter your details to register for the Hospital System
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {fields.map((field, index) => {
                  // Span 2 columns for name, address, email, password if needed, or keeping simple stack
                  // Let's make address, email, password full width, others half
                  const isFullWidth = ["address", "email", "password", "name"].includes(field.name);

                  return (
                    <div
                      key={field.name}
                      className={cn("space-y-2", isFullWidth ? "sm:col-span-2" : "")}
                    >
                      <Label htmlFor={field.name} className="flex items-center gap-2">
                        <field.icon className="h-4 w-4 text-muted-foreground" />
                        {field.label}
                      </Label>
                      <Input
                        id={field.name}
                        name={field.name}
                        type={field.type}
                        placeholder={field.placeholder}
                        value={formData[field.name as keyof typeof formData]}
                        onChange={handleChange}
                        className={errors[field.name] ? "border-destructive focus-visible:ring-destructive" : ""}
                      />
                      {errors[field.name] && (
                        <p className="text-xs text-destructive">{errors[field.name]}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button
              className="w-full group"
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Registering...
                </>
              ) : (
                <>
                  Register Now
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </Button>
            <div className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login-user" className="underline underline-offset-4 hover:text-primary">
                Login here
              </Link>
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
