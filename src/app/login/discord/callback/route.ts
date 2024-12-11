import { cookies } from "next/headers";

import { OAuth2Tokens } from "arctic";

import { discord } from "@/auth/arctic-providers";
import {
    createSession,
    generateSessionToken,
    setSessionTokenCookie,
} from "@/auth/session";
import { createUser } from "@/db/db-insert";
import { getUserFromProviderNameAndId } from "@/db/db-queries";
import { User } from "@/db/schema";
import { discordData } from "@/lib/zod/oauth-providers";

export async function GET(request: Request) {
    const url = new URL(request.url);
    const state = url.searchParams.get("state");
    const code = url.searchParams.get("code");
    const cookieStore = await cookies();
    const storedState = cookieStore.get("discord_oauth_state")?.value ?? null;

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
        tokens = await discord.validateAuthorizationCode(code);
    } catch (e) {
        console.error(e);
        return new Response(null, { status: 400 });
    }

    let user: User;
    try {
        const discordUserResponse = await fetch(
            "https://discord.com/api/users/@me",
            {
                headers: {
                    Authorization: `Bearer ${tokens.accessToken()}`,
                },
            }
        );
        const discordUserData = await discordUserResponse.json();
        console.log(discordUserData);
        const {
            id: discordUserId,
            username: discordUsername,
            avatar,
        } = discordData.parse(discordUserData);
        const discordUserAvatar = `https://cdn.discordapp.com/avatars/${discordUserId}/${avatar}.jpeg`;
        const dbUser = await getUserFromProviderNameAndId(
            discordUserId,
            "discord"
        );
        if (dbUser === null) {
            // create a new user
            const newUser = await createUser(
                {
                    providerName: "discord",
                    providerUserId: discordUserId,
                    username: discordUsername,
                    avatarUrl: discordUserAvatar,
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
