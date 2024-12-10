import db from ".";
import { users } from "./schema";
import { InsertUser, User } from "./schema/users";

export async function createUser(newUserData: InsertUser): Promise<null>;
export async function createUser<B extends boolean | undefined>(
    newUserData: InsertUser,
    returning: B
): Promise<B extends true ? User : null>;
/**
 *
 * @param newUserData
 * @param returning
 * @returns null or User if returning is true
 */
export async function createUser(
    newUserData: InsertUser,
    returning?: boolean
): Promise<null | User> {
    if (returning) {
        const newUser = await db.insert(users).values(newUserData).returning();
        return newUser[0];
    } else {
        await db.insert(users).values(newUserData);
        return null;
    }
}
