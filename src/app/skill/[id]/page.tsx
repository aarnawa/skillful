"use client";

import React, { useEffect, useState, useCallback } from "react";
import SkillTree from "@/frontend/components/SkillTree";
import SkillDetail from "@/frontend/components/SkillDetail";
import SkillIcon from "@/frontend/lib/icons";
import { ChevronLeft } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import type { SkillTreeNode } from "@/app/api/skills/route";

type ProgressEntry = {
    skillId: number;
    currentLevel: number;
    xp: number;
};

type ProgressMap = Record<number, { currentLevel: number; xp: number }>;

/**
 * SkillTreePage — Displays the skill tree for a specific root skill.
 * Replaces the previous page.tsx logic, now scoped to a skill by [id].
 */
export default function SkillTreePage() {
    const params = useParams();
    const router = useRouter();
    const skillId = Number(params.id);

    const [tree, setTree] = useState<SkillTreeNode[]>([]);
    const [progress, setProgress] = useState<ProgressMap>({});
    const [selectedSkill, setSelectedSkill] = useState<SkillTreeNode | null>(null);
    const [isPracticing, setIsPracticing] = useState(false);
    const [loading, setLoading] = useState(true);

    // ─── Load data ──────────────────────────────────
    const fetchData = useCallback(async () => {
        try {
            const [skillsRes, progressRes] = await Promise.all([
                fetch("/api/skills"),
                fetch("/api/progress"),
            ]);

            const skillsData: SkillTreeNode[] = await skillsRes.json();
            const progressData: ProgressEntry[] = await progressRes.json();

            // Find the root skill matching this ID
            const root = skillsData.find((s) => s.id === skillId);
            if (root) {
                setTree([root]);
            }

            // Convert array to map for fast lookup
            const pMap: ProgressMap = {};
            if (Array.isArray(progressData)) {
                for (const p of progressData) {
                    pMap[p.skillId] = {
                        currentLevel: p.currentLevel,
                        xp: p.xp,
                    };
                }
            }
            setProgress(pMap);
        } catch (err) {
            console.error("Failed to fetch data:", err);
        } finally {
            setLoading(false);
        }
    }, [skillId]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // ─── Practice a skill (add XP) ─────────────────
    const handlePractice = async (id: number) => {
        setIsPracticing(true);
        try {
            const res = await fetch("/api/progress", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ skillId: id, xpGain: 25 }),
            });
            const updated = await res.json();

            setProgress((prev) => ({
                ...prev,
                [id]: {
                    currentLevel: updated.currentLevel,
                    xp: updated.xp,
                },
            }));
        } catch (err) {
            console.error("Practice failed:", err);
        } finally {
            setIsPracticing(false);
        }
    };

    // ─── Reset / Reduce skill level ─────────────────
    const handleReset = async (id: number, newLevel: number) => {
        try {
            const res = await fetch("/api/progress", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ skillId: id, newLevel }),
            });
            const updated = await res.json();

            setProgress((prev) => ({
                ...prev,
                [id]: {
                    currentLevel: updated.currentLevel,
                    xp: updated.xp,
                },
            }));
        } catch (err) {
            console.error("Reset failed:", err);
        }
    };

    // ─── Loading state ─────────────────────────────
    if (loading) {
        return (
            <div className="flex min-h-[80vh] flex-col items-center justify-center gap-4">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-border border-t-gold" />
                <p className="text-text-secondary">Loading skill tree...</p>
            </div>
        );
    }

    if (!tree.length) {
        return (
            <div className="flex min-h-[80vh] flex-col items-center justify-center gap-4">
                <p className="text-text-secondary">Skill not found.</p>
                <button
                    onClick={() => router.push("/")}
                    className="flex items-center gap-2 text-gold transition-colors hover:text-gold-light"
                >
                    <ChevronLeft size={16} />
                    Back to Home
                </button>
            </div>
        );
    }

    const root = tree[0];

    // ─── Compute overall stats ─────────────────────
    const getAllLeafIds = (node: SkillTreeNode): number[] => {
        if (!node.children.length) return [node.id];
        return node.children.flatMap(getAllLeafIds);
    };
    const leafIds = getAllLeafIds(root);
    const totalSkills = leafIds.length;
    const practicedSkills = leafIds.filter((id) => (progress[id]?.currentLevel ?? 0) > 0).length;
    const avgLevel =
        totalSkills > 0
            ? Math.round(
                leafIds.reduce((sum, id) => sum + (progress[id]?.currentLevel ?? 0), 0) / totalSkills
            )
            : 0;
    const masteredCount = leafIds.filter((id) => (progress[id]?.currentLevel ?? 0) >= 100).length;

    return (
        <div className="min-h-screen pb-20">
            {/* Hero section */}
            <div className="relative overflow-hidden border-b border-border bg-gradient-to-b from-bg-secondary to-bg-primary">
                {/* Background pattern */}
                <div
                    className="absolute inset-0 opacity-5"
                    style={{
                        backgroundImage: `radial-gradient(circle at 2px 2px, ${root.color} 1px, transparent 0)`,
                        backgroundSize: "40px 40px",
                    }}
                />

                <div className="relative mx-auto max-w-7xl px-6 py-12">
                    {/* Back link */}
                    <button
                        onClick={() => router.push("/")}
                        className="mb-4 flex items-center gap-1.5 text-sm text-text-muted transition-colors hover:text-text-primary"
                    >
                        <ChevronLeft size={14} />
                        All Skills
                    </button>

                    <div className="mb-2 flex items-center gap-2">
                        <SkillIcon iconKey={root.icon} size={20} color={root.color} strokeWidth={1.5} />
                        <span
                            className="text-sm font-medium uppercase tracking-widest"
                            style={{ color: root.color, fontFamily: "var(--font-heading)" }}
                        >
                            {root.name} Training
                        </span>
                    </div>
                    <h1
                        className="mb-3 text-4xl font-bold sm:text-5xl"
                        style={{ fontFamily: "var(--font-heading)" }}
                    >
                        Your Skill Tree
                    </h1>
                    <p className="max-w-lg text-text-secondary">
                        Click a category to expand its sub-skills, then click any sub-skill
                        to practice and level up.
                    </p>

                    {/* Stats row */}
                    <div className="mt-8 flex flex-wrap gap-4">
                        <div className="rounded-xl border border-border bg-bg-card/50 px-5 py-3 backdrop-blur-sm">
                            <div className="text-xs text-text-muted">Skills Tracked</div>
                            <div
                                className="text-2xl font-bold"
                                style={{ color: root.color, fontFamily: "var(--font-heading)" }}
                            >
                                {totalSkills}
                            </div>
                        </div>
                        <div className="rounded-xl border border-border bg-bg-card/50 px-5 py-3 backdrop-blur-sm">
                            <div className="text-xs text-text-muted">Avg. Level</div>
                            <div
                                className="text-2xl font-bold"
                                style={{ color: root.color, fontFamily: "var(--font-heading)" }}
                            >
                                {avgLevel}
                            </div>
                        </div>
                        <div className="rounded-xl border border-border bg-bg-card/50 px-5 py-3 backdrop-blur-sm">
                            <div className="text-xs text-text-muted">Practiced</div>
                            <div
                                className="text-2xl font-bold"
                                style={{ color: root.color, fontFamily: "var(--font-heading)" }}
                            >
                                {practicedSkills}
                            </div>
                        </div>
                        <div className="rounded-xl border border-border bg-bg-card/50 px-5 py-3 backdrop-blur-sm">
                            <div className="text-xs text-text-muted">Mastered</div>
                            <div
                                className="text-2xl font-bold"
                                style={{ color: root.color, fontFamily: "var(--font-heading)" }}
                            >
                                {masteredCount}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Skill tree */}
            <div className="mx-auto max-w-7xl px-6 py-12">
                <SkillTree
                    tree={tree}
                    progress={progress}
                    onSkillClick={setSelectedSkill}
                />
            </div>

            {/* Skill detail modal */}
            {selectedSkill && (
                <SkillDetail
                    skill={selectedSkill}
                    progress={progress[selectedSkill.id] ?? null}
                    onPractice={handlePractice}
                    onReset={handleReset}
                    isPracticing={isPracticing}
                    onClose={() => setSelectedSkill(null)}
                />
            )}
        </div>
    );
}
