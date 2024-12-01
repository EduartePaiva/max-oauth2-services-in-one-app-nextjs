import { createEnv } from "@t3-oss/env-nextjs";
import { ZodError } from "zod";

export const env = createEnv({
    client: {},
    runtimeEnv: {},
    onValidationError: (error: ZodError) => {
        console.error(
            "❌ Invalid environment variables:",
            error.flatten().fieldErrors
        );
        process.exit(1);
    },
});
