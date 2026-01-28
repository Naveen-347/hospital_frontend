"use client";

import React, { useState } from "react";
import { Bot, Send, Sparkles, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AiFeaturePage() {
    const [prompt, setPrompt] = useState("");
    const [response, setResponse] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleGenerate = async () => {
        if (!prompt.trim()) return;

        setLoading(true);
        setError("");
        setResponse("");

        try {
            // Using relative path to call the local Next.js API route
            // This avoids issues with hardcoded remote URLs causing 404s
            const res = await fetch("/api/ai", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ text: prompt }),
            });

            if (!res.ok) {
                if (res.status === 404) {
                    throw new Error("AI Endpoint not found (404). Please ensure the API route exists at app/api/ai/route.ts");
                }
                const errData = await res.json().catch(() => ({}));
                throw new Error(errData.error || `Request failed with status ${res.status}`);
            }

            const data = await res.json();
            setResponse(data.output || "No response received.");
        } catch (err: any) {
            console.error("AI Generation Error:", err);
            setError(err.message || "Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 p-4 md:p-8">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
                    <Sparkles className="h-8 w-8 text-indigo-500" />
                    Medical AI Assistant
                </h1>
                <p className="text-slate-500 text-lg">
                    Generate insights, summaries, and medical information using advanced AI.
                </p>
            </div>

            <div className="grid gap-8 md:grid-cols-1">
                <Card className="border-indigo-100 shadow-md">
                    <CardHeader className="bg-indigo-50/50 border-b border-indigo-100 rounded-t-xl">
                        <CardTitle className="flex items-center gap-2 text-indigo-900">
                            <Bot className="h-5 w-5 text-indigo-600" />
                            New Query
                        </CardTitle>
                        <CardDescription>
                            Ask a question or provide details for analysis.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-6">
                        <div className="space-y-2">
                            <Label htmlFor="prompt">Your Prompt</Label>
                            <textarea
                                id="prompt"
                                className="flex min-h-[120px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-y"
                                placeholder="E.g., Summarize the symptoms of type 2 diabetes or explain the side effects of Aspirin..."
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-end pt-2 pb-6 px-6">
                        <Button
                            onClick={handleGenerate}
                            disabled={loading || !prompt.trim()}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white min-w-[120px]"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Thinking...
                                </>
                            ) : (
                                <>
                                    <Send className="mr-2 h-4 w-4" />
                                    Generate
                                </>
                            )}
                        </Button>
                    </CardFooter>
                </Card>

                {error && (
                    <div className="rounded-lg bg-red-50 p-4 border border-red-200 flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                        <div className="text-sm text-red-800">
                            <p className="font-semibold">Generation Failed</p>
                            <p>{error}</p>
                        </div>
                    </div>
                )}

                {response && (
                    <Card className="border-slate-200 shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <CardHeader className="border-b border-slate-100">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Sparkles className="h-5 w-5 text-teal-500" />
                                AI Response
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="prose prose-slate max-w-none text-slate-800 whitespace-pre-wrap leading-relaxed">
                                {response}
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
