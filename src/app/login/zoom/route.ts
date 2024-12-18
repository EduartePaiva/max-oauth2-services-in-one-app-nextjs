import { cookies } from "next/headers";

import { generateCodeVerifier, generateState } from "arctic";

import { zoom } from "@/auth/arctic-providers";
import { env } from "@/env/server";

export async function GET(): Promise<Response> {
    const state = generateState();
    const codeVerifier = generateCodeVerifier();
    // zoom now uses a thing called granular scopes that are defined in the creation of the app
    const url = zoom.createAuthorizationURL(state, codeVerifier, [""]);
    const cookieStore = await cookies();
    cookieStore.set("zoom_oauth_state", state, {
        path: "/",
        secure: env.NODE_ENV === "production",
        httpOnly: true,
        maxAge: 60 * 10,
        sameSite: "lax",
    });
    cookieStore.set("zoom_code_verifier", state, {
        path: "/",
        secure: env.NODE_ENV === "production",
        httpOnly: true,
        maxAge: 60 * 10,
        sameSite: "lax",
    });
    console.log(`redirecting to: ${url.toString()}`);

    return new Response(null, {
        status: 302,
        headers: {
            Location: url.toString(),
        },
    });
}
