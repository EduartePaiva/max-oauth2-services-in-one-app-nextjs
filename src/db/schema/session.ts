import { InferSelectModel } from "drizzle-orm";
import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

import usersTable from "./users";

const sessionTable = pgTable("session", {
    id: text().primaryKey().notNull(),
    userId: uuid()
        .notNull()
        .references(() => usersTable.id),
    expiresAt: timestamp({
        withTimezone: true,
        mode: "date",
    }).notNull(),
});
export type Session = InferSelectModel<typeof sessionTable>;

export default sessionTable;
