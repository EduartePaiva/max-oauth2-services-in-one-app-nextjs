import { InferSelectModel } from "drizzle-orm";
import { pgTable, uuid, varchar } from "drizzle-orm/pg-core";

const usersTable = pgTable("users", {
    id: uuid().defaultRandom().primaryKey().notNull(),
    username: varchar({ length: 255 }).notNull(),
    githubId: varchar({ length: 255 }).notNull(),
    avatarUrl: varchar({ length: 560 }),
});
export type User = InferSelectModel<typeof usersTable>;

export default usersTable;
