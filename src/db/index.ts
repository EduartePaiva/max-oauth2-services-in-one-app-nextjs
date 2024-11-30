// Make sure to install the 'postgres' package
import { env } from "@/env/server";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const queryClient = postgres(env.DATABASE_URL);
const db = drizzle({ client: queryClient });
export default db;
