import { cookies } from "next/headers";

import { ArcticFetchError, OAuth2RequestError, OAuth2Tokens } from "arctic";

import { roblox } from "@/auth/arctic-providers";
import {
    createSession,
    generateSessionToken,
    setSessionTokenCookie,
} from "@/auth/session";
import { robloxData } from "@/auth/zod-oauth-providers";
import { getOrCreateNewUserAndReturn } from "@/db/db-utils";

export async function GET(request: Request) {
    const url = new URL(request.url);
    const state = url.searchParams.get("state");
    const code = url.searchParams.get("code");
    const cookieStore = await cookies();
    const storedState = cookieStore.get("roblox_oauth_state")?.value ?? null;
    const codeVerifier = cookieStore.get("roblox_code_verifier")?.value ?? null;

    if (
        state === null ||
        code === null ||
        cookieStore === null ||
        codeVerifier === null
    ) {
        // todo redirect to a error page
        console.log("something is null");
        return new Response(null, { status: 400 });
    }

    if (storedState !== state) {
        // todo error regarding state diff
        console.log("state differ");
        return new Response(null, { status: 400 });
    }

    let tokens: OAuth2Tokens;
    try {
        tokens = await roblox.validateAuthorizationCode(code, codeVerifier);
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
        // fetch userId from roblox
        const response = await fetch(
            "https://apis.roblox.com/oauth/v1/userinfo",
            {
                headers: {
                    Authorization: `Bearer ${tokens.accessToken()}`,
                },
            }
        );
        const userJsonData = await response.json();
        console.log(userJsonData);
        const {
            sub: providerUserId,
            name: username,
            picture: avatarUrl,
        } = robloxData.parse(userJsonData);

        const user = await getOrCreateNewUserAndReturn({
            providerName: "roblox",
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
