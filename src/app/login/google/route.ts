import { cookies } from "next/headers";

import { generateCodeVerifier, generateState } from "arctic";

import { google } from "@/auth/arctic-providers";
import { env } from "@/env/server";

export async function GET(): Promise<Response> {
    const state = generateState();
    const codeVerifier = generateCodeVerifier();
    const url = google.createAuthorizationURL(state, codeVerifier, [
        "openid",
        "profile",
    ]);
    const cookieStore = await cookies();
    cookieStore.set("google_oauth_state", state, {
        path: "/",
        secure: env.NODE_ENV === "production",
        httpOnly: true,
        maxAge: 60 * 10,
        sameSite: "lax",
    });
    cookieStore.set("google_code_verifier", codeVerifier, {
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
