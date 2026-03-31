"use client";

import React, { useState } from "react";
import { Mail, Lock, ArrowRight, Github, Chrome } from "lucide-react";
import { useRouter } from "next/navigation";

/**
 * LoginPage — A premium, visually stunning login screen.
 * Follows the project's black, gold, and white aesthetic.
 */
export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate a brief delay for the animation/UX
        setTimeout(() => {
            setIsSubmitting(false);
            try {
                fetch(`api/user?email=${email}`)
                    .then(res => res.json())
                    .then(data => console.log("User found:", data.name))
            } catch (error) {
                console.error("Fetch error:", error);
            }
            router.push("/");
        }, 1500);
    };

    return (
        <div className="flex min-h-[calc(100vh-64px)] items-center justify-center px-6 py-12">
            {/* Background Decorative Elements */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute top-1/4 -left-24 h-96 w-96 rounded-full bg-gold/5 blur-3xl" />
                <div className="absolute bottom-1/4 -right-24 h-96 w-96 rounded-full bg-gold/5 blur-3xl" />
            </div>

            <div className="relative w-full max-w-md animate-slide-up">
                {/* Card Container */}
                <div className="overflow-hidden rounded-3xl border border-border bg-bg-card shadow-2xl shadow-black/20">
                    {/* Header */}
                    <div className="bg-gradient-to-b from-bg-secondary/50 to-transparent px-8 pt-10 pb-6 text-center">
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gold/10">
                            <svg
                                width="32"
                                height="32"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="#D4AF37"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2" />
                                <line x1="12" y1="22" x2="12" y2="15.5" />
                                <polyline points="22 8.5 12 15.5 2 8.5" />
                            </svg>
                        </div>
                        <h1
                            className="text-3xl font-bold tracking-tight text-text-primary"
                            style={{ fontFamily: "var(--font-heading)" }}
                        >
                            Welcome back
                        </h1>
                        <p className="mt-2 text-text-secondary">
                            Sign in to continue your journey to mastery.
                        </p>
                    </div>

                    {/* Form */}
                    <div className="px-8 pb-10">
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <label
                                        htmlFor="email"
                                        className="text-sm font-medium text-text-secondary"
                                    >
                                        Email Address
                                    </label>
                                </div>
                                <div className="group relative">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 text-text-muted group-focus-within:text-gold transition-colors">
                                        <Mail size={18} />
                                    </div>
                                    <input
                                        id="email"
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="name@example.com"
                                        className="w-full rounded-xl border border-border bg-bg-primary py-3 pl-11 pr-4 text-text-primary outline-none transition-all placeholder:text-text-muted hover:border-border-light focus:border-gold focus:ring-4 focus:ring-gold/10"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <label
                                        htmlFor="password"
                                        className="text-sm font-medium text-text-secondary"
                                    >
                                        Password
                                    </label>
                                    <a
                                        href="#"
                                        className="text-xs font-medium text-gold hover:text-gold-light transition-colors"
                                    >
                                        Forgot password?
                                    </a>
                                </div>
                                <div className="group relative">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 text-text-muted group-focus-within:text-gold transition-colors">
                                        <Lock size={18} />
                                    </div>
                                    <input
                                        id="password"
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full rounded-xl border border-border bg-bg-primary py-3 pl-11 pr-4 text-text-primary outline-none transition-all placeholder:text-text-muted hover:border-border-light focus:border-gold focus:ring-4 focus:ring-gold/10"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="group relative w-full overflow-hidden rounded-xl bg-gold px-4 py-3.5 font-bold text-black transition-all hover:shadow-lg hover:shadow-gold/20 active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100"
                                style={{ fontFamily: "var(--font-heading)" }}
                            >
                                <div className="relative z-10 flex items-center justify-center gap-2">
                                    {isSubmitting ? (
                                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-black/30 border-t-black" />
                                    ) : (
                                        <>
                                            Sign In
                                            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                                        </>
                                    )}
                                </div>
                                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                            </button>
                        </form>

                        {/* Divider */}
                        <div className="relative my-8">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-border" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-bg-card px-3 text-text-muted">Or continue with</span>
                            </div>
                        </div>

                        {/* Social Logins */}
                        <div className="grid grid-cols-2 gap-4">
                            <button className="flex items-center justify-center gap-2 rounded-xl border border-border bg-bg-primary py-2.5 text-sm font-medium text-text-primary transition-colors hover:bg-bg-hover">
                                <Github size={18} />
                                Github
                            </button>
                            <button className="flex items-center justify-center gap-2 rounded-xl border border-border bg-bg-primary py-2.5 text-sm font-medium text-text-primary transition-colors hover:bg-bg-hover">
                                <Chrome size={18} />
                                Google
                            </button>
                        </div>
                    </div>

                    {/* Footer Link */}
                    <div className="border-t border-border bg-bg-secondary/30 py-6 text-center">
                        <p className="text-sm text-text-secondary">
                            Don&apos;t have an account?{" "}
                            <a href="#" className="font-semibold text-gold hover:text-gold-light transition-colors">
                                Create one for free
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
