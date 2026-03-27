import { db } from "@/db";
import { userProgress, skills } from "@/db/schema";
import { eq, and } from "drizzle-orm";

/**
 * Fetches the current progress for all skills associated with the active user.
 * Joins with the 'skills' table to provide the skill names alongside progress data.
 * 
 * @returns A promise resolving to an array of progress records with skill details.
 */
export async function getProgress() {
    // Note: userId is currently hardcoded to 1 for the prototype
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

/**
 * Adds XP to a specific skill for the active user. 
 * Automatically handles leveling up when XP reaches the threshold (100 XP per level).
 * 
 * @param skillId - The ID of the skill to update.
 * @param xpGain - The amount of XP to add (defaults to 25).
 * @returns The created or updated progress record.
 */
export async function addProgress(skillId: number, xpGain: number = 25) {
    // 1. Check if a progress entry already exists for this skill/user
    const [current] = await db
        .select()
        .from(userProgress)
        .where(
            and(eq(userProgress.userId, 1), eq(userProgress.skillId, skillId))
        );

    if (!current) {
        // Create new progress entry if none exists
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

    // 2. Calculate new XP and handle leveling logic
    let newXp = current.xp + xpGain;
    let newLevel = current.currentLevel;

    // Simple leveling formula: every 100 XP = 1 level
    while (newXp >= 100 && newLevel < 100) {
        newXp -= 100;
        newLevel += 1;
    }

    // 3. Prevent exceeding maximum level (Capped at 100)
    if (newLevel >= 100) {
        newLevel = 100;
        newXp = 0;
    }

    // 4. Persist the updated progress to the database
    const [updated] = await db
        .update(userProgress)
        .set({
            xp: newXp,
            currentLevel: newLevel,
            updatedAt: new Date(),
        })
        .where(eq(userProgress.id, current.id))
        .returning();

    return updated;
}

/**
 * Resets or reduces a user's progress level for a specific skill.
 * Used for administrative actions or specific game mechanics (like skill reset).
 * 
 * @param skillId - The ID of the skill to reset.
 * @param newLevel - The new level to set (must be lower than current level).
 * @returns The updated progress record.
 * @throws Error if the newLevel is invalid or no progress is found.
 */
export async function resetProgress(skillId: number, newLevel: number) {
    if (newLevel < 0) {
        throw new Error("newLevel cannot be negative");
    }

    // Fetch existing progress
    const [current] = await db
        .select()
        .from(userProgress)
        .where(
            and(eq(userProgress.userId, 1), eq(userProgress.skillId, skillId))
        );

    if (!current) {
        throw new Error("No progress found for this skill");
    }

    // Validation: resetProgress can only be used to decrease level
    if (newLevel >= current.currentLevel) {
        throw new Error("newLevel must be less than current level");
    }

    const [updated] = await db
        .update(userProgress)
        .set({
            currentLevel: newLevel,
            xp: 0,
            updatedAt: new Date(),
        })
        .where(eq(userProgress.id, current.id))
        .returning();

    return updated;
}
