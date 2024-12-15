"use server";

import { encodeBase64 } from "@oslojs/encoding";

export async function testAction() {
    const username = "teste";
    const password = "teste2";
    const bytes = new TextEncoder().encode(`${username}:${password}`);
    const oslo = encodeBase64(bytes);
    const my = Buffer.from(`${username}:${password}`, "utf-8").toString(
        "base64"
    );
    console.log(`oslo encoding: ${oslo}`);
    console.log(`My encoding: ${my}`);
    console.log(`are equal? ${oslo === my}`);

    return null;
}
