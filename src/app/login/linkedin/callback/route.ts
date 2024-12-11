import { cookies } from "next/headers";

import { OAuth2Tokens, decodeIdToken } from "arctic";

import { linkedin } from "@/auth/oauth/linkedin";
import {
    createSession,
    generateSessionToken,
    setSessionTokenCookie,
} from "@/auth/session";
import { createUser } from "@/db/db-insert";
import { getUserFromProviderNameAndId } from "@/db/db-queries";
import { User } from "@/db/schema";
import { linkedinData } from "@/lib/zod/oauth-providers";

export async function GET(request: Request) {
    const url = new URL(request.url);
    const state = url.searchParams.get("state");
    const code = url.searchParams.get("code");
    const cookieStore = await cookies();
    const storedState = cookieStore.get("linkedin_oauth_state")?.value ?? null;

    if (state === null || code === null || cookieStore === null) {
        // todo redirect to a error page
        return new Response(null, { status: 400 });
    }

    if (storedState != state) {
        // todo error regarding state diff
        return new Response(null, { status: 400 });
    }

    let tokens: OAuth2Tokens;
    try {
        tokens = await linkedin.validateAuthorizationCode(code);
    } catch (e) {
        console.error(e);
        return new Response(null, { status: 400 });
    }
    const claims = decodeIdToken(tokens.idToken());
    console.log(claims);
    const stop = true;
    if (stop) {
        throw new Error("stopped here");
    }

    // todo here
    const {
        name: linkedinUsername,
        sub: linkedinUserId,
        picture: linkedinUserAvatar,
    } = linkedinData.parse(claims);

    let user: User;
    try {
        const dbUser = await getUserFromProviderNameAndId(
            linkedinUserId,
            "linkedin"
        );
        if (dbUser === null) {
            // create a new user
            const newUser = await createUser(
                {
                    providerName: "linkedin",
                    providerUserId: linkedinUserId,
                    username: linkedinUsername,
                    avatarUrl: linkedinUserAvatar,
                },
                true
            );
            user = newUser;
        } else {
            user = dbUser;
        }
    } catch (e) {
        console.error(e);
        return new Response("error fetching database", { status: 400 });
    }

    // create a session for this user
    const sessionToken = generateSessionToken();
    try {
        const session = await createSession(sessionToken, user.id);
        await setSessionTokenCookie(sessionToken, session.expiresAt);
        return new Response(null, {
            status: 302,
            headers: {
                Location: "/",
            },
        });
    } catch (e) {
        console.error(e);
        return new Response(null, { status: 400 });
    }
}
