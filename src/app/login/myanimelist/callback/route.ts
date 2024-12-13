import { cookies } from "next/headers";

import { ArcticFetchError, OAuth2RequestError, OAuth2Tokens } from "arctic";

import { myAnimeList } from "@/auth/arctic-providers";
import {
    createSession,
    generateSessionToken,
    setSessionTokenCookie,
} from "@/auth/session";
import { myAnimeListData } from "@/auth/zod-oauth-providers";
import { createUser } from "@/db/db-insert";
import { getUserFromProviderNameAndId } from "@/db/db-queries";
import { User } from "@/db/schema";

export async function GET(request: Request) {
    const url = new URL(request.url);
    const state = url.searchParams.get("state");
    const code = url.searchParams.get("code");
    const cookieStore = await cookies();
    const storedState =
        cookieStore.get("myanimelist_oauth_state")?.value ?? null;
    const codeVerifier =
        cookieStore.get("myanimelist_code_verifier")?.value ?? null;

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
        tokens = await myAnimeList.validateAuthorizationCode(
            code,
            codeVerifier
        );
    } catch (e) {
        let errorMsg = "";
        if (e instanceof OAuth2RequestError) {
            // Invalid authorization code, credentials, or redirect URI
            errorMsg = e.message;
            // ...
        }
        if (e instanceof ArcticFetchError) {
            // Failed to call `fetch()`
            errorMsg = e.message;
            // ...
        }
        // Parse error
        console.error(errorMsg.length > 0 ? errorMsg : e);
        return new Response(null, { status: 400 });
    }

    let user: User;
    try {
        // fetch userId from myanimelist
        const response = await fetch(
            "https://api.myanimelist.net/v2/users/@me",
            {
                headers: {
                    Authorization: `Bearer ${tokens.accessToken()}`,
                },
            }
        );
        const userJsonData = await response.json();
        const {
            id: providerUserId,
            name: username,
            picture: avatarUrl,
        } = myAnimeListData.parse(userJsonData);

        const dbUser = await getUserFromProviderNameAndId(
            providerUserId.toString(),
            "myanimelist"
        );
        if (dbUser === null) {
            // create a new user
            const newUser = await createUser(
                {
                    providerName: "myanimelist",
                    providerUserId: providerUserId.toString(),
                    username,
                    avatarUrl,
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
