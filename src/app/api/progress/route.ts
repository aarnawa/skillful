import { NextRequest, NextResponse } from "next/server";
import { getProgress, addProgress, resetProgress } from "@/backend/services/progress";

/**
 * GET /api/progress
 * Returns all progress entries for user 1 (default user).
 */
export async function GET() {
    try {
        const progress = await getProgress();
        return NextResponse.json(progress);
    } catch (error) {
        console.error("Failed to fetch progress:", error);
        return NextResponse.json(
            { error: "Failed to fetch progress" },
            { status: 500 }
        );
    }
}

/**
 * POST /api/progress
 * Body: { skillId: number, xpGain?: number }
 * Adds XP to a skill and levels up if threshold is reached.
 * XP per level: 100. Max level: 100.
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { skillId, xpGain = 25 } = body;

        if (!skillId) {
            return NextResponse.json(
                { error: "skillId is required" },
                { status: 400 }
            );
        }

        const updated = await addProgress(skillId, xpGain);
        return NextResponse.json(updated);
    } catch (error) {
        console.error("Failed to update progress:", error);
        return NextResponse.json(
            { error: "Failed to update progress" },
            { status: 500 }
        );
    }
}

/**
 * PATCH /api/progress
 * Body: { skillId: number, newLevel: number }
 * Reduces a skill's level to the specified value and resets XP to 0.
 * newLevel must be less than the current level.
 */
export async function PATCH(request: NextRequest) {
    try {
        const body = await request.json();
        const { skillId, newLevel } = body;

        if (skillId === undefined || newLevel === undefined) {
            return NextResponse.json(
                { error: "skillId and newLevel are required" },
                { status: 400 }
            );
        }

        try {
            const updated = await resetProgress(skillId, newLevel);
            return NextResponse.json(updated);
        } catch (err: any) {
            return NextResponse.json(
                { error: err.message },
                { status: err.message.includes("found") ? 404 : 400 }
            );
        }
    } catch (error) {
        console.error("Failed to reset progress:", error);
        return NextResponse.json(
            { error: "Failed to reset progress" },
            { status: 500 }
        );
    }
}

