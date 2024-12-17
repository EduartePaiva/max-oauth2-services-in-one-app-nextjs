import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { pgTable, uniqueIndex, uuid, varchar } from "drizzle-orm/pg-core";

const usersTable = pgTable(
    "users",
    {
        id: uuid().defaultRandom().primaryKey().notNull(),
        username: varchar({ length: 255 }).notNull(),
        avatarUrl: varchar({ length: 560 }),
        providerUserId: varchar({ length: 255 }).notNull(),
        providerName: varchar({
            length: 255,
            enum: [
                "google",
                "github",
                "discord",
                "myanimelist",
                "reddit",
                "roblox",
                "spotify",
                "twitch",
                "yahoo",
            ],
        }).notNull(),
    },
    (table) => [uniqueIndex("provider_index").on(table.providerName, table.providerUserId)]
);

export type User = InferSelectModel<typeof usersTable>;
export type InsertUser = InferInsertModel<typeof usersTable>;

export default usersTable;
