"use client";

import React, { useEffect, useState, useCallback } from "react";
import SkillCard from "@/frontend/components/SkillCard";
import SkillIcon from "@/frontend/lib/icons";
import { Rocket } from "lucide-react";
import { useRouter } from "next/navigation";
import type { SkillTreeNode } from "@/app/api/skills/route";

type ProgressEntry = {
  skillId: number;
  currentLevel: number;
  xp: number;
};

type ProgressMap = Record<number, { currentLevel: number; xp: number }>;

/**
 * HomePage — Lists all root skills the user is working on.
 * Currently just Basketball, but designed for easy expansion.
 */
export default function HomePage() {
  console.log("loading data")

  const router = useRouter();
  const [roots, setRoots] = useState<SkillTreeNode[]>([]);
  const [progress, setProgress] = useState<ProgressMap>({});
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);

  // ─── Load data ──────────────────────────────────
  const fetchData = useCallback(async () => {
    try {
      const [skillsRes, progressRes] = await Promise.all([
        fetch("/api/skills"),
        fetch("/api/progress"),
      ]);

      const skillsData: SkillTreeNode[] = await skillsRes.json();
      const progressData: ProgressEntry[] = await progressRes.json();

      setRoots(skillsData);

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
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ─── Seed database ─────────────────────────────
  const handleSeed = async () => {
    setSeeding(true);
    try {
      await fetch("/api/seed", { method: "POST" });
      await fetchData();
    } catch (err) {
      console.error("Seed failed:", err);
    } finally {
      setSeeding(false);
    }
  };

  // ─── Helpers ────────────────────────────────────
  const getAllLeafIds = (node: SkillTreeNode): number[] => {
    if (!node.children.length) return [node.id];
    return node.children.flatMap(getAllLeafIds);
  };

  // ─── Loading state ─────────────────────────────
  if (loading) {
    return (
      <div className="flex min-h-[80vh] flex-col items-center justify-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-border border-t-gold" />
        <p className="text-text-secondary">Loading your skills...</p>
      </div>
    );
  }

  // ─── Empty state (needs seeding) ───────────────
  if (!roots.length) {
    return (
      <div className="flex min-h-[80vh] flex-col items-center justify-center gap-6 px-6">
        <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-gold/10">
          <SkillIcon iconKey="basketball" size={48} color="#D4AF37" strokeWidth={1.5} />
        </div>
        <div className="text-center">
          <h2
            className="mb-2 text-3xl font-bold"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Welcome to <span className="text-gold">Skillful</span>
          </h2>
          <p className="mb-6 max-w-md text-text-secondary">
            Get started by loading the basketball skill tree. This will set up
            your personalized training path from fundamentals to advanced moves.
          </p>
        </div>
        <button
          onClick={handleSeed}
          disabled={seeding}
          className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-gold to-gold-light px-8 py-4 text-lg font-bold text-black transition-all duration-300 hover:shadow-lg hover:shadow-gold/20 disabled:opacity-50"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          <span className="relative z-10 flex items-center gap-2">
            {seeding ? "Setting up..." : (
              <>
                Start Your Journey
                <Rocket size={18} />
              </>
            )}
          </span>
          <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      {/* Hero section */}
      <div className="relative overflow-hidden border-b border-border bg-gradient-to-b from-bg-secondary to-bg-primary">
        {/* Background pattern */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, #D4AF37 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />

        <div className="relative mx-auto max-w-7xl px-6 py-12">
          <h1
            className="mb-3 text-4xl font-bold sm:text-5xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Your <span className="text-gold">Skills</span>
          </h1>
          <p className="max-w-lg text-text-secondary">
            Choose a skill to explore its training path and
            track your progress.
          </p>
        </div>
      </div>

      {/* Skill cards grid */}
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {roots.map((root) => {
            const leafIds = getAllLeafIds(root);
            const totalSkills = leafIds.length;
            const practicedSkills = leafIds.filter(
              (id) => (progress[id]?.currentLevel ?? 0) > 0
            ).length;
            const avgLevel =
              totalSkills > 0
                ? Math.round(
                  leafIds.reduce(
                    (sum, id) => sum + (progress[id]?.currentLevel ?? 0),
                    0
                  ) / totalSkills
                )
                : 0;

            return (
              <SkillCard
                key={root.id}
                name={root.name}
                icon={root.icon}
                color={root.color}
                totalSkills={totalSkills}
                practicedSkills={practicedSkills}
                avgLevel={avgLevel}
                onClick={() => router.push(`/skill/${root.id}`)}
              />
            );
          })}
        </div>

        {/* Future expansion hint */}
        <div className="mt-8 rounded-xl border border-dashed border-border p-6 text-center">
          <p className="text-sm text-text-muted">
            More skills coming soon — cooking, music, communication, and more.
          </p>
        </div>
      </div>
    </div>
  );
}
