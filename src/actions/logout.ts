"use server";

import { redirect } from "next/navigation";

import {
    deleteSessionTokenCookie,
    getCurrentSession,
    invalidateSession,
} from "@/auth/session";

type LogoutResult = { error: string | null };
export async function logout(): Promise<LogoutResult> {
    try {
        const { session } = await getCurrentSession();
        if (session === null) {
            return { error: "Unauthorized" };
        }
        await invalidateSession(session.id);
        await deleteSessionTokenCookie();
    } catch (e) {
        console.error(e);
        if (e instanceof Error) {
            return { error: e.message };
        }
        return { error: "Error while invalidating session" };
    }
    return redirect("/login");
}
