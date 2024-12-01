import { pgTable, timestamp, uuid } from "drizzle-orm/pg-core";

import usersTable from "./users";

const sessionTable = pgTable("session", {
    id: uuid().defaultRandom().primaryKey(),
    userId: uuid()
        .notNull()
        .references(() => usersTable.id),
    expiresAt: timestamp({
        withTimezone: true,
        mode: "date",
    }).notNull(),
});

export default sessionTable;
