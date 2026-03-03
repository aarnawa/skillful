"use client";

import React from "react";
import SkillIcon from "@/frontend/lib/icons";
import { TrendingUp, ChevronRight } from "lucide-react";

type Props = {
    name: string;
    icon: string;
    color: string;
    totalSkills: number;
    practicedSkills: number;
    avgLevel: number;
    onClick: () => void;
};

/**
 * SkillCard — A card on the Home tab representing one root skill.
 * Shows icon, name, progress summary, and invites the user to open the tree.
 */
export default function SkillCard({
    name,
    icon,
    color,
    totalSkills,
    practicedSkills,
    avgLevel,
    onClick,
}: Props) {
    const progressPercent = totalSkills > 0 ? Math.round((practicedSkills / totalSkills) * 100) : 0;

    return (
        <button
            onClick={onClick}
            className="group relative w-full overflow-hidden rounded-2xl border border-border bg-bg-card p-6 text-left transition-all duration-300 hover:border-border-light hover:shadow-lg"
            style={{
                boxShadow: `0 0 0 0 ${color}00`,
            }}
            onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = `0 4px 30px ${color}15`;
            }}
            onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = `0 0 0 0 ${color}00`;
            }}
        >
            {/* Gradient accent line at top */}
            <div
                className="absolute left-0 right-0 top-0 h-[2px]"
                style={{
                    background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
                }}
            />

            {/* Content */}
            <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                    {/* Icon hex */}
                    <div
                        className="hex-clip flex h-14 w-14 flex-shrink-0 items-center justify-center transition-transform duration-300 group-hover:scale-110"
                        style={{
                            background: `linear-gradient(135deg, ${color}33, ${color}11)`,
                        }}
                    >
                        <SkillIcon iconKey={icon} size={24} color={color} strokeWidth={1.5} />
                    </div>

                    <div>
                        <h3
                            className="text-lg font-bold text-text-primary"
                            style={{ fontFamily: "var(--font-heading)" }}
                        >
                            {name}
                        </h3>
                        <p className="mt-0.5 text-sm text-text-muted">
                            {practicedSkills} / {totalSkills} skills practiced
                        </p>
                    </div>
                </div>

                <ChevronRight
                    size={20}
                    className="mt-1 text-text-muted transition-all duration-300 group-hover:translate-x-1 group-hover:text-text-primary"
                />
            </div>

            {/* Stats row */}
            <div className="mt-5 flex items-center gap-4">
                {/* Progress bar */}
                <div className="flex-1">
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-bg-hover">
                        <div
                            className="progress-fill h-full rounded-full"
                            style={{
                                width: `${progressPercent}%`,
                                background: `linear-gradient(90deg, ${color}CC, ${color})`,
                            }}
                        />
                    </div>
                </div>

                {/* Average level */}
                <div className="flex items-center gap-1 text-xs font-medium text-text-secondary">
                    <TrendingUp size={12} style={{ color }} />
                    <span>Avg Lv. {avgLevel}</span>
                </div>
            </div>
        </button>
    );
}
