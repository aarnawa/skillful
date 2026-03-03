import { NextResponse } from "next/server";
import { seed } from "@/db/seed";

/**
 * POST /api/seed
 * Seeds the database with the basketball skill tree.
 * Safe to call multiple times — will skip if already seeded.
 */
export async function POST() {
    try {
        const result = await seed();
        return NextResponse.json(result);
    } catch (error) {
        console.error("Failed to seed database:", error);
        return NextResponse.json(
            { error: "Failed to seed database" },
            { status: 500 }
        );
    }
}
