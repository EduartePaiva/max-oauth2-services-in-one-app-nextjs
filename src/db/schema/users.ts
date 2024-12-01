import { pgTable, uuid, varchar } from "drizzle-orm/pg-core";

const usersTable = pgTable("users", {
    id: uuid().defaultRandom().primaryKey().notNull(),
    username: varchar({ length: 255 }).notNull(),
    githubId: varchar({ length: 255 }).notNull(),
});

export default usersTable;
