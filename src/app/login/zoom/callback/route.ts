import { cookies } from "next/headers";

import { OAuth2Tokens } from "arctic";

import { zoom } from "@/auth/arctic-providers";
import { createSession, generateSessionToken, setSessionTokenCookie } from "@/auth/session";
import { zoomData } from "@/auth/zod-oauth-providers";
import { getOrCreateNewUserAndReturn } from "@/db/db-utils";

export async function GET(request: Request) {
    const url = new URL(request.url);
    const state = url.searchParams.get("state");
    const code = url.searchParams.get("code");
    const cookieStore = await cookies();
    const storedState = cookieStore.get("zoom_oauth_state")?.value ?? null;
    const codeVerifier = cookieStore.get("zoom_code_verifier")?.value ?? null;

    if (code === null || cookieStore === null || codeVerifier === null || state === null) {
        // todo redirect to a error page
        return new Response(null, { status: 400 });
    }

    if (storedState != state) {
        // todo error regarding state diff
        return new Response(null, { status: 400 });
    }

    let tokens: OAuth2Tokens;
    try {
        tokens = await zoom.validateAuthorizationCode(code, codeVerifier);
    } catch (e) {
        console.error(e);
        return new Response(null, { status: 400 });
    }
    try {
        const response = await fetch("https://api.zoom.us/v2/users/me", {
            headers: { Authorization: `Bearer ${tokens.accessToken()}` },
        });
        const zoomJson = await response.json();
        const {
            id: providerUserId,
            display_name: username,
            pic_url: avatarUrl,
        } = zoomData.parse(zoomJson);

        const user = await getOrCreateNewUserAndReturn({
            providerName: "zoom",
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
