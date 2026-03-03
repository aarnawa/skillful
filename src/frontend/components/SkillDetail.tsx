"use client";

import React, { useState } from "react";
import ProgressBar from "./ProgressBar";
import SkillIcon from "@/frontend/lib/icons";
import { X, Sparkles, Trophy, RotateCcw, ChevronDown, AlertTriangle } from "lucide-react";

type Props = {
    skill: {
        id: number;
        name: string;
        description: string;
        icon: string;
        color: string;
    };
    progress: {
        currentLevel: number;
        xp: number;
    } | null;
    onPractice: (skillId: number) => void;
    onReset: (skillId: number, newLevel: number) => void;
    onClose: () => void;
    isPracticing: boolean;
};

/**
 * SkillDetail — Slide-in panel showing skill info, progress, practice, and reset controls.
 */
export default function SkillDetail({
    skill,
    progress,
    onPractice,
    onReset,
    onClose,
    isPracticing,
}: Props) {
    const level = progress?.currentLevel ?? 0;
    const xp = progress?.xp ?? 0;

    // Reset flow state
    const [showResetPanel, setShowResetPanel] = useState(false);
    const [resetTarget, setResetTarget] = useState(0);

    // Level title based on level ranges
    const getLevelTitle = (lvl: number) => {
        if (lvl === 0) return "Beginner";
        if (lvl < 10) return "Novice";
        if (lvl < 25) return "Apprentice";
        if (lvl < 50) return "Intermediate";
        if (lvl < 75) return "Advanced";
        if (lvl < 100) return "Expert";
        return "Master";
    };

    const handleConfirmReset = () => {
        onReset(skill.id, resetTarget);
        setShowResetPanel(false);
        setResetTarget(0);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Panel */}
            <div className="relative w-full max-w-md animate-slide-up rounded-2xl border border-border bg-bg-secondary p-6 shadow-2xl">
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-bg-hover text-text-muted transition-colors hover:bg-bg-card hover:text-text-primary"
                >
                    <X size={16} />
                </button>

                {/* Header */}
                <div className="mb-6 flex items-center gap-4">
                    <div
                        className="hex-clip flex h-16 w-16 items-center justify-center"
                        style={{
                            background: `linear-gradient(135deg, ${skill.color}33, ${skill.color}11)`,
                        }}
                    >
                        <SkillIcon iconKey={skill.icon} size={28} color={skill.color} strokeWidth={1.5} />
                    </div>
                    <div>
                        <h2
                            className="text-xl font-bold"
                            style={{ fontFamily: "var(--font-heading)" }}
                        >
                            {skill.name}
                        </h2>
                        <span
                            className="text-sm font-medium"
                            style={{ color: skill.color }}
                        >
                            {getLevelTitle(level)}
                        </span>
                    </div>
                </div>

                {/* Description */}
                <p className="mb-6 text-sm leading-relaxed text-text-secondary">
                    {skill.description}
                </p>

                {/* Stats */}
                <div className="mb-6 grid grid-cols-2 gap-3">
                    <div className="rounded-xl border border-border bg-bg-card p-3">
                        <div className="text-xs text-text-muted">Level</div>
                        <div
                            className="text-2xl font-bold"
                            style={{ color: skill.color, fontFamily: "var(--font-heading)" }}
                        >
                            {level}
                        </div>
                    </div>
                    <div className="rounded-xl border border-border bg-bg-card p-3">
                        <div className="text-xs text-text-muted">XP to Next</div>
                        <div
                            className="text-2xl font-bold"
                            style={{ color: skill.color, fontFamily: "var(--font-heading)" }}
                        >
                            {100 - xp}
                        </div>
                    </div>
                </div>

                {/* Progress bar */}
                <div className="mb-6">
                    <ProgressBar
                        value={xp}
                        max={100}
                        color={skill.color}
                        label="XP Progress"
                    />
                </div>

                {/* Practice button */}
                <button
                    onClick={() => onPractice(skill.id)}
                    disabled={isPracticing || level >= 100}
                    className="group relative w-full overflow-hidden rounded-xl px-6 py-3.5 font-bold text-black transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50"
                    style={{
                        background: `linear-gradient(135deg, ${skill.color}, ${skill.color}CC)`,
                        fontFamily: "var(--font-heading)",
                    }}
                >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                        {isPracticing ? (
                            "Practicing..."
                        ) : level >= 100 ? (
                            <>
                                <Sparkles size={16} />
                                Mastered!
                            </>
                        ) : (
                            "Practice (+25 XP)"
                        )}
                    </span>
                    {/* Shine effect */}
                    <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                </button>

                {level >= 100 && (
                    <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-xs text-gold">
                        <Trophy size={14} />
                        You&apos;ve mastered this skill! Keep practicing to maintain it.
                    </p>
                )}

                {/* ─── Reset / Reduce Section ─────────────────── */}
                {level > 0 && !showResetPanel && (
                    <button
                        onClick={() => setShowResetPanel(true)}
                        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-bg-card px-4 py-2.5 text-sm font-medium text-text-muted transition-colors hover:border-accent-red/30 hover:text-accent-red"
                    >
                        <RotateCcw size={14} />
                        Reset / Reduce Level
                    </button>
                )}

                {showResetPanel && (
                    <div className="mt-4 animate-fade-in rounded-xl border border-accent-red/20 bg-accent-red/5 p-4">
                        <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-accent-red">
                            <AlertTriangle size={16} />
                            Confirm Level Change
                        </div>
                        <p className="mb-4 text-xs text-text-secondary">
                            This will reduce your skill level. XP will be reset to 0. This action cannot be undone.
                        </p>

                        {/* Level selector */}
                        <div className="mb-4">
                            <label className="mb-1.5 block text-xs font-medium text-text-secondary">
                                Set level to:
                            </label>
                            <div className="relative">
                                <select
                                    value={resetTarget}
                                    onChange={(e) => setResetTarget(Number(e.target.value))}
                                    className="w-full appearance-none rounded-lg border border-border bg-bg-card px-3 py-2 text-sm text-text-primary focus:border-accent-red/50 focus:outline-none"
                                >
                                    {Array.from({ length: level }, (_, i) => (
                                        <option key={i} value={i}>
                                            Level {i}{i === 0 ? " (Full Reset)" : ""}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown
                                    size={14}
                                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-muted"
                                />
                            </div>
                        </div>

                        {/* Confirm / Cancel buttons */}
                        <div className="flex gap-2">
                            <button
                                onClick={() => {
                                    setShowResetPanel(false);
                                    setResetTarget(0);
                                }}
                                className="flex-1 rounded-lg border border-border bg-bg-card px-3 py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-bg-hover"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmReset}
                                className="flex-1 rounded-lg bg-accent-red px-3 py-2 text-sm font-bold text-white transition-colors hover:bg-accent-red-light"
                            >
                                Confirm Reset
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
