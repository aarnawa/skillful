import { db } from "@/db";
import { userProgress, skills } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function getProgress() {
    return await db
        .select({
            id: userProgress.id,
            skillId: userProgress.skillId,
            skillName: skills.name,
            currentLevel: userProgress.currentLevel,
            xp: userProgress.xp,
            updatedAt: userProgress.updatedAt,
        })
        .from(userProgress)
        .innerJoin(skills, eq(userProgress.skillId, skills.id))
        .where(eq(userProgress.userId, 1));
}

export async function addProgress(skillId: number, xpGain: number = 25) {
    // Get current progress
    const [current] = await db
        .select()
        .from(userProgress)
        .where(
            and(eq(userProgress.userId, 1), eq(userProgress.skillId, skillId))
        );

    if (!current) {
        // Create new progress entry
        const [created] = await db
            .insert(userProgress)
            .values({
                userId: 1,
                skillId,
                currentLevel: 0,
                xp: xpGain,
            })
            .returning();
        return created;
    }

    // Calculate new XP and level
    let newXp = current.xp + xpGain;
    let newLevel = current.currentLevel;

    // Level up: every 100 XP = 1 level
    while (newXp >= 100 && newLevel < 100) {
        newXp -= 100;
        newLevel += 1;
    }

    // Cap at max
    if (newLevel >= 100) {
        newLevel = 100;
        newXp = 0;
    }

    const [updated] = await db
        .update(userProgress)
        .set({
            xp: newXp,
            currentLevel: newLevel,
            updatedAt: new Date().toISOString(),
        })
        .where(eq(userProgress.id, current.id))
        .returning();

    return updated;
}

export async function resetProgress(skillId: number, newLevel: number) {
    if (newLevel < 0) {
        throw new Error("newLevel cannot be negative");
    }

    // Get current progress
    const [current] = await db
        .select()
        .from(userProgress)
        .where(
            and(eq(userProgress.userId, 1), eq(userProgress.skillId, skillId))
        );

    if (!current) {
        throw new Error("No progress found for this skill");
    }

    if (newLevel >= current.currentLevel) {
        throw new Error("newLevel must be less than current level");
    }

    const [updated] = await db
        .update(userProgress)
        .set({
            currentLevel: newLevel,
            xp: 0,
            updatedAt: new Date().toISOString(),
        })
        .where(eq(userProgress.id, current.id))
        .returning();

    return updated;
}
