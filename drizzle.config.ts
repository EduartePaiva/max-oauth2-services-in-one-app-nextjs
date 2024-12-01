import { defineConfig } from "drizzle-kit";

import { env } from "@/env/server";

export default defineConfig({
    schema: "./src/db/schema",
    dialect: "postgresql",
    out: "./src/db/migrations",
    dbCredentials: {
        url: env.DATABASE_URL,
    },
    casing: "snake_case",
});
