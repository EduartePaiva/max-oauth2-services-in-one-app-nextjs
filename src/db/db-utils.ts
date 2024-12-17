import { eq } from "drizzle-orm";

import db from ".";
import { createUser } from "./db-insert";
import { getUserFromProviderNameAndId } from "./db-queries";
import { User, users } from "./schema";
import { InsertUser } from "./schema/users";

/**
 * @throws this function does requests and can throw
 */
export async function getOrCreateNewUserAndReturn(userData: InsertUser): Promise<User> {
    const dbUser = await getUserFromProviderNameAndId(
        userData.providerUserId,
        userData.providerName
    );
    if (dbUser !== null) {
        if (dbUser.avatarUrl !== userData.avatarUrl) {
            // update the user avatar url with the new avatar url
            await db
                .update(users)
                .set({ avatarUrl: userData.avatarUrl })
                .where(eq(users.id, dbUser.id));
        }

        return dbUser;
    }
    // TODO: Update the avatar_url if it differ

    // create a new user
    return await createUser(userData, true);
}
