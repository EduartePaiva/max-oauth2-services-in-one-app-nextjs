import { cookies } from "next/headers";

import { generateState } from "arctic";

import { discord } from "@/auth/arctic-providers";
import { env } from "@/env/server";

export async function GET(): Promise<Response> {
    const state = generateState();
    const url = discord.createAuthorizationURL(state, ["identify"]);
    const cookieStore = await cookies();
    cookieStore.set("discord_oauth_state", state, {
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
