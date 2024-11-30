import db from "@/db";
import { sql } from "drizzle-orm";

export default async function Home() {
    const data = await db.execute(sql`SELECT * FROM pg_catalog.pg_tables`);
    return <pre className="container">{JSON.stringify(data, null, 2)}</pre>;
}
