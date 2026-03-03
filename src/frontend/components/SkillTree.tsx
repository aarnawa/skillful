"use client";

import React, { useState } from "react";
import HexagonNode from "./HexagonNode";
import type { SkillTreeNode } from "@/app/api/skills/route";

type ProgressMap = Record<
    number,
    { currentLevel: number; xp: number }
>;

type Props = {
    tree: SkillTreeNode[];
    progress: ProgressMap;
    onSkillClick: (skill: SkillTreeNode) => void;
};

/**
 * SkillTree — Renders the full basketball skill tree.
 * Root node at top, categories below, sub-skills below each category.
 */
export default function SkillTree({ tree, progress, onSkillClick }: Props) {
    const [expandedCategory, setExpandedCategory] = useState<number | null>(null);

    if (!tree.length) return null;

    const root = tree[0];
    const categories = root.children;

    const handleCategoryClick = (catId: number) => {
        setExpandedCategory(expandedCategory === catId ? null : catId);
    };

    // Calculate category-level progress (average of children)
    const getCategoryProgress = (cat: SkillTreeNode) => {
        if (!cat.children.length) return { currentLevel: 0, xp: 0 };
        const totalLevel = cat.children.reduce(
            (sum, child) => sum + (progress[child.id]?.currentLevel ?? 0),
            0
        );
        return {
            currentLevel: Math.floor(totalLevel / cat.children.length),
            xp: 0,
        };
    };

    return (
        <div className="flex flex-col items-center gap-10">
            {/* Root node */}
            <div className="animate-fade-in">
                <HexagonNode
                    icon={root.icon}
                    name={root.name}
                    color={root.color}
                    level={0}
                    xp={0}
                    isCategory
                />
            </div>

            {/* Connection line from root */}
            <div className="h-8 w-px bg-gradient-to-b from-gold to-transparent" />

            {/* Category row */}
            <div className="flex flex-wrap items-start justify-center gap-6 stagger-children">
                {categories.map((cat) => {
                    const catProgress = getCategoryProgress(cat);
                    const isExpanded = expandedCategory === cat.id;

                    return (
                        <div
                            key={cat.id}
                            className="flex flex-col items-center gap-4"
                        >
                            <HexagonNode
                                icon={cat.icon}
                                name={cat.name}
                                color={cat.color}
                                level={catProgress.currentLevel}
                                xp={catProgress.xp}
                                isCategory
                                isActive={isExpanded}
                                onClick={() => handleCategoryClick(cat.id)}
                            />

                            {/* Sub-skills (expanded) */}
                            {isExpanded && (
                                <div className="flex flex-col items-center gap-3">
                                    {/* Vertical connector */}
                                    <div
                                        className="h-6 w-px"
                                        style={{
                                            background: `linear-gradient(to bottom, ${cat.color}, transparent)`,
                                        }}
                                    />

                                    {/* Sub-skill grid */}
                                    <div className="flex flex-wrap items-start justify-center gap-4 animate-fade-in">
                                        {cat.children.map((subSkill) => {
                                            const sp = progress[subSkill.id];
                                            return (
                                                <HexagonNode
                                                    key={subSkill.id}
                                                    icon={subSkill.icon}
                                                    name={subSkill.name}
                                                    color={subSkill.color}
                                                    level={sp?.currentLevel ?? 0}
                                                    xp={sp?.xp ?? 0}
                                                    onClick={() => onSkillClick(subSkill)}
                                                />
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
