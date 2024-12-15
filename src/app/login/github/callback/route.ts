import { cookies } from "next/headers";

import { OAuth2Tokens } from "arctic";

import { github } from "@/auth/arctic-providers";
import {
    createSession,
    generateSessionToken,
    setSessionTokenCookie,
} from "@/auth/session";
import { getOrCreateNewUserAndReturn } from "@/db/db-utils";

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

        const user = await getOrCreateNewUserAndReturn({
            providerName: "github",
            providerUserId: githubUserId.toString(),
            username: githubUsername,
            avatarUrl: githubUserAvatar,
        });

        const sessionToken = generateSessionToken();
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
        return new Response("error authenticating user", { status: 400 });
    }
}
