import { pgTable, uuid } from "drizzle-orm/pg-core";

const usersTable = pgTable("users", {
    id: uuid().defaultRandom().primaryKey(),
});

export default usersTable;
