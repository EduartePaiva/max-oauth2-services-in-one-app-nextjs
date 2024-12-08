import { cookies } from "next/headers";

import { OAuth2Tokens, decodeIdToken } from "arctic";

import { google } from "@/auth/oauth/google";
import {
    createSession,
    generateSessionToken,
    setSessionTokenCookie,
} from "@/auth/session";
import db from "@/db";
import { getUserFromGoogleId } from "@/db/db-queries";
import { User, users } from "@/db/schema";
import { googleData } from "@/lib/zod/oauth-providers";

export async function GET(request: Request) {
    const url = new URL(request.url);
    const state = url.searchParams.get("state");
    const code = url.searchParams.get("code");
    const cookieStore = await cookies();
    const storedState = cookieStore.get("google_oauth_state")?.value ?? null;
    const codeVerifier = cookieStore.get("google_code_verifier")?.value ?? null;

    if (
        state === null ||
        code === null ||
        cookieStore === null ||
        codeVerifier === null
    ) {
        // todo redirect to a error page
        return new Response(null, { status: 400 });
    }

    if (storedState != state) {
        // todo error regarding state diff
        return new Response(null, { status: 400 });
    }

    let tokens: OAuth2Tokens;
    try {
        tokens = await google.validateAuthorizationCode(code, codeVerifier);
    } catch (e) {
        console.error(e);
        return new Response(null, { status: 400 });
    }
    const claims = decodeIdToken(tokens.idToken());
    const {
        name: googleUsername,
        sub: googleUserId,
        picture: googleUserAvatar,
    } = googleData.parse(claims);

    let user: User;
    try {
        const queriedUser = await getUserFromGoogleId(googleUserId);
        if (queriedUser === null) {
            // create a new user
            const newUser = await db
                .insert(users)
                .values({
                    googleId: googleUserId,
                    username: googleUsername,
                    avatarUrl: googleUserAvatar,
                })
                .returning();
            user = newUser[0];
        } else {
            user = queriedUser;
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
