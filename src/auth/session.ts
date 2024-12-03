import "server-only";

import { sha256 } from "@oslojs/crypto/sha2";
import {
    encodeBase32LowerCaseNoPadding,
    encodeHexLowerCase,
} from "@oslojs/encoding";
import { eq } from "drizzle-orm";

import db from "@/db";
import { type Session, type User, sessionTable } from "@/db/schema";
import usersTable from "@/db/schema/users";

export function generateSessionToken(): string {
    const bytes = new Uint8Array(20);
    crypto.getRandomValues(bytes);
    const token = encodeBase32LowerCaseNoPadding(bytes);
    return token;
}

export async function createSession(
    token: string,
    userId: string
): Promise<Session> {
    const sessionId = encodeHexLowerCase(
        sha256(new TextEncoder().encode(token))
    );
    const session = {
        id: sessionId,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
        userId,
    } satisfies Session;
    await db.insert(sessionTable).values(session);
    return session;
}

export async function validateSessionToken(
    token: string
): Promise<SessionValidationResult> {
    const sessionId = encodeHexLowerCase(
        sha256(new TextEncoder().encode(token))
    );
    const result = await db
        .select({ user: usersTable, session: sessionTable })
        .from(sessionTable)
        .where(eq(sessionTable.id, sessionId))
        .innerJoin(usersTable, eq(usersTable.id, sessionTable.userId));
    if (result.length < 1) {
        return { session: null, user: null };
    }
    const { session, user } = result[0];
    if (Date.now() >= session.expiresAt.getTime()) {
        return { session: null, user: null };
    }
    if (Date.now() >= session.expiresAt.getTime() - 1000 * 60 * 60 * 24 * 15) {
        // update expireAt
        session.expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
        await db
            .update(sessionTable)
            .set({
                expiresAt: session.expiresAt,
            })
            .where(eq(sessionTable.id, session.id));
        return { session, user };
    }
    return { session, user };
}

export async function invalidateSession(sessionId: string): Promise<void> {
    await db.delete(sessionTable).where(eq(sessionTable.id, sessionId));
}

export type SessionValidationResult =
    | { session: Session; user: User }
    | { session: null; user: null };
