import { cookies } from "next/headers";

import { ArcticFetchError, OAuth2RequestError, OAuth2Tokens, decodeIdToken } from "arctic";

import { twitch } from "@/auth/arctic-providers";
import { createSession, generateSessionToken, setSessionTokenCookie } from "@/auth/session";
import { twitchData, twitchTokenData } from "@/auth/zod-oauth-providers";
import { getOrCreateNewUserAndReturn } from "@/db/db-utils";

export async function GET(request: Request) {
    const url = new URL(request.url);
    const state = url.searchParams.get("state");
    const code = url.searchParams.get("code");
    const cookieStore = await cookies();
    const storedState = cookieStore.get("twitch_oauth_state")?.value ?? null;

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
        tokens = await twitch.validateAuthorizationCode(code);
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
        // get the sub value from the idToken
        const idToken = tokens.idToken();
        const claims = twitchTokenData.parse(decodeIdToken(idToken));
        // fetch info from twitch
        const response = await fetch("https://api.twitch.tv/helix/users", {
            headers: {
                Authorization: `Bearer ${tokens.accessToken()}`,
                "Client-Id": claims.aud,
            },
        });
        const userJsonData = await response.json();
        console.log(userJsonData);
        const parsedData = twitchData.parse(userJsonData);

        const user = await getOrCreateNewUserAndReturn({
            providerName: "twitch",
            providerUserId: claims.sub,
            username: parsedData.data[0].display_name,
            avatarUrl: parsedData.data[0].profile_image_url,
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
