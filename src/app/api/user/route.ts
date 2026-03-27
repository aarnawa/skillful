import { getUserNamebyId } from "@/backend/services/users";
import { NextResponse, NextRequest } from "next/server";

/**
 * Get /api/user
 * Returns the username
 */
export async function GET(request: NextRequest) {
    const idString = request.nextUrl.searchParams.get("id");
    // const email = request.nextUrl.searchParams.get("email"); // when email function is added
    if (idString) {
        const userId = parseInt(idString, 10);
        const userName = await getUserNamebyId(userId)
        return NextResponse.json({ name: userName });
    } else {
        return NextResponse.json({ error: "No userID/Email provided" }, { status: 400 });
    }
}
