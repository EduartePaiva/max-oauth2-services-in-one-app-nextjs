import "server-only";

import { Google } from "arctic";

import { env } from "@/env/server";

export const google = new Google(
    env.GOOGLE_CLIENT_ID,
    env.GOOGLE_CLIENT_SECRET,
    env.GOOGLE_REDIRECT_URI
);
