import { pgTable, timestamp, uuid } from "drizzle-orm/pg-core";
import { usersTable } from "./users";

export const sessionTable = pgTable("session", {
    ID: uuid().defaultRandom().primaryKey(),
    userId: uuid()
        .notNull()
        .references(() => usersTable.id),
    expiresAt: timestamp({
        withTimezone: true,
        mode: "date",
    }).notNull(),
});
