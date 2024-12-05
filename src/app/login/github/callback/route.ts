import { cookies } from "next/headers";

import { OAuth2Tokens } from "arctic";
import { eq } from "drizzle-orm";

import { github } from "@/auth/oauth/github";
import {
    createSession,
    generateSessionToken,
    setSessionTokenCookie,
} from "@/auth/session";
import db from "@/db";
import { User, users } from "@/db/schema";

export async function GET(request: Request) {
    const url = new URL(request.url);
    const state = url.searchParams.get("state");
    const code = url.searchParams.get("code");
    const cookieStore = await cookies();
    const storedState = cookieStore.get("github_oauth_state")?.value ?? null;

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
        tokens = await github.validateAuthorizationCode(code);
    } catch (e) {
        console.error(e);
        return new Response(null, { status: 400 });
    }

    let user: User;
    try {
        const githubUserResponse = await fetch("https://api.github.com/user", {
            headers: {
                Authorization: `Bearer ${tokens.accessToken()}`,
            },
        });
        const githubUser = await githubUserResponse.json();
        const githubUserId = githubUser.id as number;
        const githubUserAvatar = githubUser.avatar_url as string;
        const githubUsername = githubUser.name as string;
        const userLst = await db
            .select()
            .from(users)
            .where(eq(users.githubId, githubUserId.toString()));

        if (userLst.length === 0) {
            // create a new user
            const newUser = await db
                .insert(users)
                .values({
                    githubId: githubUserId.toString(),
                    username: githubUsername,
                    avatarUrl: githubUserAvatar,
                })
                .returning();
            user = newUser[0];
        } else {
            user = userLst[0];
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
