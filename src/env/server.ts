import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
    server: {
        NODE_ENV: z.enum(["development", "production"]),
        DATABASE_URL: z.string().url(),
    },
    // If you're using Next.js < 13.4.4, you'll need to specify the runtimeEnv manually
    // runtimeEnv: {
    //   DATABASE_URL: process.env.DATABASE_URL,
    //   OPEN_AI_API_KEY: process.env.OPEN_AI_API_KEY,
    // },
    // For Next.js >= 13.4.4, you can just reference process.env:
    emptyStringAsUndefined: true,
    experimental__runtimeEnv: process.env,
});
