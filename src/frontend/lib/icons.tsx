"use client";

import React from "react";
import {
    // Root / generic
    Star,
    Rocket,
    Trophy,
    Sparkles,
    X,

    // Basketball root
    CircleDot,

    // Ball Handling
    Hand,
    ArrowLeftRight,
    Footprints,
    RotateCcw,
    Wind,

    // Shooting
    Target,
    Flag,
    Scaling,
    Ruler,
    Hash,
    Cloud,

    // Passing
    Handshake,
    ArrowRight,
    ArrowDown,
    ArrowUp,
    Eye,

    // Defense
    Shield,
    MoveHorizontal,
    Zap,
    Box,
    GripHorizontal,

    // Footwork
    Anvil,
    Swords,
    RefreshCw,
    StepForward,
    Globe2,
    CornerDownRight,

    // Basketball IQ
    Brain,
    ScanEye,
    Maximize2,
    Layers,
    BoltIcon,
    PersonStanding,

    // Navigation / UI
    Home,
    TreePine,
    ChevronLeft,
    RotateCw,
    Minus,
} from "lucide-react";
import type { LucideProps } from "lucide-react";

/**
 * Mapping of icon key strings to Lucide React components.
 * Used throughout the app to render skill icons consistently.
 */
const ICON_MAP: Record<string, React.ComponentType<LucideProps>> = {
    // ── Root / UI ───────────────────────────────
    star: Star,
    rocket: Rocket,
    trophy: Trophy,
    sparkles: Sparkles,
    x: X,
    home: Home,
    tree: TreePine,
    "chevron-left": ChevronLeft,
    "rotate-cw": RotateCw,
    minus: Minus,

    // ── Basketball ──────────────────────────────
    basketball: CircleDot,

    // ── Ball Handling ───────────────────────────
    hand: Hand,
    crossover: ArrowLeftRight,
    "between-legs": Footprints,
    "behind-back": RotateCcw,
    speed: Wind,

    // ── Shooting ────────────────────────────────
    target: Target,
    flag: Flag,
    layup: Scaling,
    "mid-range": Ruler,
    "three-point": Hash,
    floater: Cloud,

    // ── Passing ─────────────────────────────────
    handshake: Handshake,
    "arrow-right": ArrowRight,
    "arrow-down": ArrowDown,
    "arrow-up": ArrowUp,
    eye: Eye,

    // ── Defense ─────────────────────────────────
    shield: Shield,
    "lateral-slide": MoveHorizontal,
    closeout: Zap,
    rebound: Box,
    steal: GripHorizontal,

    // ── Footwork ────────────────────────────────
    shoe: Anvil,
    trident: Swords,
    pivot: RefreshCw,
    "jab-step": StepForward,
    "euro-step": Globe2,
    "drop-step": CornerDownRight,

    // ── Basketball IQ ───────────────────────────
    brain: Brain,
    "court-vision": ScanEye,
    spacing: Maximize2,
    "pick-and-roll": Layers,
    "fast-break": BoltIcon,
    "off-ball": PersonStanding,
};

// ─── Public component ─────────────────────────────────────

type SkillIconProps = LucideProps & {
    /** Icon key string from the database */
    iconKey: string;
};

/**
 * SkillIcon — Renders a Lucide icon based on a key string.
 * Falls back to a Star icon if the key is not found.
 *
 * @example
 * <SkillIcon iconKey="basketball" size={24} color="#D4AF37" />
 */
export default function SkillIcon({ iconKey, ...props }: SkillIconProps) {
    const Icon = ICON_MAP[iconKey] ?? Star;
    return <Icon {...props} />;
}
