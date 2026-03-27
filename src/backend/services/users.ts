import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm"

/**
 * Fetches the name of a specific user from the database by their ID.
 * 
 * @param userId - The unique numeric ID of the user.
 * @returns A promise that resolves to the user's name or "Unknown User" if not found.
 */
export async function getUserNamebyId(userId: number): Promise<string> {
    // Query the 'users' table using the Relational API
    const user = await db.query.users.findFirst({
        where: eq(users.id, userId),
    });

    return user?.name || "Unknown User";
}