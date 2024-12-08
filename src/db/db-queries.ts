import "server-only";

import { eq } from "drizzle-orm";

import db from ".";
import { type User, users } from "./schema";

/**
 * @throws In case of a database error
 */
export async function getUserFromGoogleId(
    googleUserId: string
): Promise<User | null> {
    const userLst = await db
        .select()
        .from(users)
        .where(eq(users.googleId, googleUserId));

    if (userLst.length > 0) {
        return userLst[0];
    }
    return null;
}
