import { cookies } from "next/headers";

import { ArcticFetchError, OAuth2RequestError, OAuth2Tokens } from "arctic";

import { spotify } from "@/auth/arctic-providers";
import { createSession, generateSessionToken, setSessionTokenCookie } from "@/auth/session";
import { spotifyData } from "@/auth/zod-oauth-providers";
import { getOrCreateNewUserAndReturn } from "@/db/db-utils";

export async function GET(request: Request) {
    const url = new URL(request.url);
    const state = url.searchParams.get("state");
    const code = url.searchParams.get("code");
    const cookieStore = await cookies();
    const storedState = cookieStore.get("spotify_oauth_state")?.value ?? null;

    if (state === null || code === null || cookieStore === null) {
        // todo redirect to a error page
        return new Response(null, { status: 400 });
    }

    if (storedState !== state) {
        // todo error regarding state diff
        return new Response(null, { status: 400 });
    }

    let tokens: OAuth2Tokens;
    try {
        tokens = await spotify.validateAuthorizationCode(code);
    } catch (e) {
        let errorMsg = "";
        if (e instanceof OAuth2RequestError) {
            // Invalid authorization code, credentials, or redirect URI
            errorMsg = e.message;
        }
        if (e instanceof ArcticFetchError) {
            // Failed to call `fetch()`
            errorMsg = e.message;
        }
        // Parse error
        console.error(errorMsg.length > 0 ? errorMsg : e);
        return new Response(null, { status: 400 });
    }

    try {
        // fetch userId from spotify
        const response = await fetch("https://api.spotify.com/v1/me", {
            headers: {
                Authorization: `Bearer ${tokens.accessToken()}`,
            },
        });
        const userJsonData = await response.json();
        const parsedData = spotifyData.parse(userJsonData);

        const user = await getOrCreateNewUserAndReturn({
            providerName: "spotify",
            providerUserId: parsedData.id,
            username: parsedData.display_name ?? "Spotify User",
            avatarUrl: parsedData.images.length > 0 ? parsedData.images[0].url : null,
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
