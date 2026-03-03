"use client";

import React from "react";

type Props = {
    value: number;      // 0–100
    max?: number;
    color: string;
    label?: string;
    showText?: boolean;
    height?: number;
};

/**
 * ProgressBar — Animated XP/level bar with gold fill on dark bg.
 */
export default function ProgressBar({
    value,
    max = 100,
    color,
    label,
    showText = true,
    height = 8,
}: Props) {
    const percent = Math.min((value / max) * 100, 100);

    return (
        <div className="w-full">
            {(label || showText) && (
                <div className="mb-1.5 flex items-center justify-between">
                    {label && (
                        <span className="text-xs font-medium text-text-secondary">
                            {label}
                        </span>
                    )}
                    {showText && (
                        <span className="text-xs font-bold" style={{ color }}>
                            {value}/{max}
                        </span>
                    )}
                </div>
            )}
            <div
                className="w-full overflow-hidden rounded-full bg-bg-hover"
                style={{ height }}
            >
                <div
                    className="progress-fill h-full rounded-full"
                    style={{
                        width: `${percent}%`,
                        background: `linear-gradient(90deg, ${color}CC, ${color})`,
                        boxShadow: `0 0 12px ${color}44`,
                    }}
                />
            </div>
        </div>
    );
}
