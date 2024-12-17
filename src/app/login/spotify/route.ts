import { cookies } from "next/headers";

import { generateState } from "arctic";

import { spotify } from "@/auth/arctic-providers";
import { env } from "@/env/server";

export async function GET(): Promise<Response> {
    const state = generateState();
    const url = spotify.createAuthorizationURL(state, ["user-read-private"]);
    const cookieStore = await cookies();
    cookieStore.set("spotify_oauth_state", state, {
        path: "/",
        secure: env.NODE_ENV === "production",
        httpOnly: true,
        maxAge: 60 * 10,
        sameSite: "lax",
    });

    return new Response(null, {
        status: 302,
        headers: {
            Location: url.toString(),
        },
    });
}