// Make sure to install the 'postgres' package
import { env } from "@/env/server";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

export const client = postgres(env.DATABASE_URL, { max: env.DB_MIGRATING ? 1 : undefined });
const db = drizzle({ client: client });
export default db;
