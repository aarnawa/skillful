"use client";

import React from "react";
import SkillIcon from "@/frontend/lib/icons";

type Props = {
    icon: string;
    name: string;
    color: string;
    level: number;
    xp: number;
    isCategory?: boolean;
    isActive?: boolean;
    onClick?: () => void;
};

/**
 * HexagonNode — A hexagonal skill card.
 * Shows the skill icon (Lucide), name, level, and an XP ring.
 * Color-coded by category.
 */
export default function HexagonNode({
    icon,
    name,
    color,
    level,
    xp,
    isCategory = false,
    isActive = false,
    onClick,
}: Props) {
    const size = isCategory ? 130 : 110;
    const xpPercent = Math.min(xp / 100, 1);

    return (
        <button
            onClick={onClick}
            className="group relative flex flex-col items-center gap-2 transition-transform duration-300 hover:scale-105 focus:outline-none"
            style={{ width: size + 20 }}
        >
            {/* Hexagon shell */}
            <div
                className="relative flex items-center justify-center"
                style={{ width: size, height: size * 1.1547 }}
            >
                {/* Glow effect */}
                <div
                    className="hex-clip absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    style={{
                        background: `radial-gradient(circle, ${color}33 0%, transparent 70%)`,
                        transform: "scale(1.3)",
                    }}
                />

                {/* Outer hex border */}
                <div
                    className="hex-clip absolute inset-0 transition-all duration-300"
                    style={{
                        background: isActive
                            ? `linear-gradient(135deg, ${color}, ${color}CC)`
                            : `linear-gradient(135deg, ${color}66, ${color}33)`,
                    }}
                />

                {/* Inner hex */}
                <div
                    className="hex-clip absolute flex flex-col items-center justify-center transition-all duration-300"
                    style={{
                        inset: "2px",
                        background: isActive
                            ? `linear-gradient(135deg, ${color}22, var(--theme-bg-hover))`
                            : "linear-gradient(135deg, var(--theme-bg-card), var(--theme-bg-secondary))",
                    }}
                >
                    {/* Icon */}
                    <div className="transition-transform duration-300 group-hover:scale-110">
                        <SkillIcon
                            iconKey={icon}
                            size={isCategory ? 32 : 24}
                            color={color}
                            strokeWidth={1.5}
                        />
                    </div>

                    {/* Level badge */}
                    {level > 0 && (
                        <div
                            className="mt-1 rounded-full px-2 py-0.5 text-xs font-bold"
                            style={{
                                background: `${color}33`,
                                color: color,
                            }}
                        >
                            Lv.{level}
                        </div>
                    )}
                </div>

                {/* XP ring indicator (bottom arc) */}
                {xp > 0 && !isCategory && (
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2">
                        <div
                            className="h-1 rounded-full"
                            style={{
                                width: `${size * 0.6}px`,
                                background: "var(--theme-border)",
                            }}
                        >
                            <div
                                className="progress-fill h-full rounded-full"
                                style={{
                                    width: `${xpPercent * 100}%`,
                                    background: `linear-gradient(90deg, ${color}, ${color}CC)`,
                                }}
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Name label */}
            <span
                className="text-center text-xs font-medium leading-tight transition-colors duration-200 group-hover:text-text-primary"
                style={{
                    color: isActive ? color : "var(--theme-text-secondary)",
                    fontFamily: "var(--font-heading)",
                    maxWidth: size + 10,
                }}
            >
                {name}
            </span>
        </button>
    );
}
