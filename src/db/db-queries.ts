import "server-only";

import { and, eq } from "drizzle-orm";

import db from ".";
import { type User, users } from "./schema";

/**
 * @throws In case of a database error
 */
export async function getUserFromProviderNameAndId(
    providerUserId: string,
    providerName: User["providerName"]
): Promise<User | null> {
    const user = await db
        .select()
        .from(users)
        .where(
            and(
                eq(users.providerUserId, providerUserId),
                eq(users.providerName, providerName)
            )
        );

    if (user.length > 0) {
        return user[0];
    }
    return null;
}
