import { NextResponse } from "next/server";
import { getSkillTree } from "@/backend/services/skills";

// Re-export type if frontend still imports it from here
export type { SkillTreeNode } from "@/backend/services/skills";

/**
 * GET /api/skills
 * Returns the full skill tree as nested JSON.
 */
export async function GET() {
    try {
        const roots = await getSkillTree();
        return NextResponse.json(roots);
    } catch (error) {
        console.error("Failed to fetch skills:", error);
        return NextResponse.json(
            { error: "Failed to fetch skills" },
            { status: 500 }
        );
    }
}

