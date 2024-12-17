import { cookies } from "next/headers";

import { OAuth2Tokens } from "arctic";

import { yahoo } from "@/auth/arctic-providers";
import { createSession, generateSessionToken, setSessionTokenCookie } from "@/auth/session";
import { yahooData } from "@/auth/zod-oauth-providers";
import { getOrCreateNewUserAndReturn } from "@/db/db-utils";

export async function GET(request: Request) {
    const url = new URL(request.url);
    const state = url.searchParams.get("state");
    const code = url.searchParams.get("code");
    const cookieStore = await cookies();
    const storedState = cookieStore.get("yahoo_oauth_state")?.value ?? null;

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
        tokens = await yahoo.validateAuthorizationCode(code);
    } catch (e) {
        console.error(e);
        return new Response(null, { status: 400 });
    }
    try {
        const response = await fetch("https://api.login.yahoo.com/openid/v1/userinfo", {
            headers: { Authorization: `Bearer ${tokens.accessToken()}` },
        });
        const yahooJson = await response.json();
        const {
            sub: providerUserId,
            name: username,
            picture: avatarUrl,
        } = yahooData.parse(yahooJson);

        const user = await getOrCreateNewUserAndReturn({
            providerName: "yahoo",
            providerUserId,
            username,
            avatarUrl,
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
