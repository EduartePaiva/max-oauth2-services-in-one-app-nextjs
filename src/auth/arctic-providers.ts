import { Discord, Facebook, GitHub, Google, LinkedIn } from "arctic";

import { env } from "@/env/server";

export const facebook = new Facebook(
    env.FACEBOOK_CLIENT_ID,
    env.FACEBOOK_CLIENT_SECRET,
    env.FACEBOOK_REDIRECT_URI
);

export const linkedin = new LinkedIn(
    env.LINKEDIN_CLIENT_ID,
    env.LINKEDIN_CLIENT_SECRET,
    env.LINKEDIN_REDIRECT_URI
);

export const google = new Google(
    env.GOOGLE_CLIENT_ID,
    env.GOOGLE_CLIENT_SECRET,
    env.GOOGLE_REDIRECT_URI
);

export const github = new GitHub(
    env.GITHUB_CLIENT_ID,
    env.GITHUB_CLIENT_SECRET,
    null
);

export const discord = new Discord(
    env.DISCORD_CLIENT_ID,
    env.DISCORD_CLIENT_SECRET,
    env.DISCORD_REDIRECT_URI
);
