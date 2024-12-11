import { LinkedIn } from "arctic";

import { env } from "@/env/server";

export const linkedin = new LinkedIn(
    env.LINKEDIN_CLIENT_ID,
    env.LINKEDIN_CLIENT_SECRET,
    env.LINKEDIN_REDIRECT_URI
);
