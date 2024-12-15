import { createUser } from "./db-insert";
import { getUserFromProviderNameAndId } from "./db-queries";
import { User } from "./schema";
import { InsertUser } from "./schema/users";

/**
 * @throws this function does requests and can throw
 */
export async function getOrCreateNewUserAndReturn(
    userData: InsertUser
): Promise<User> {
    const dbUser = await getUserFromProviderNameAndId(
        userData.providerUserId,
        userData.providerName
    );
    if (dbUser !== null) {
        return dbUser;
    }
    // TODO: Update the avatar_url if it differ

    // create a new user
    return await createUser(userData, true);
}
