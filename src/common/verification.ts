import {decodeHex, encodeHex} from "encoding";

const text = new TextEncoder();

async function getCryptoKey(): Promise<CryptoKey> {
    const secret = Deno.env.get("VERIFICATION_KEY");
    if (!secret) throw new Error("VERIFICATION_KEY is not set.");
    return await crypto.subtle.importKey(
        "raw",
        text.encode(secret),
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign", "verify"]
    );
}

export async function generateToken(discordId: string): Promise<string> {
    const salt = encodeHex(crypto.getRandomValues(new Uint8Array(16)));
    const key = await getCryptoKey();
    const hmac = await crypto.subtle.sign(
        "HMAC",
        key,
        text.encode(discordId + salt),
    );

    return encodeHex(hmac) + salt;
}

export async function verifyToken(token: string, discordId: string): Promise<boolean> {
    token = token.trim();

    if (token.length !== 96) {
        console.warn("Verification failed: Token has incorrect length.");
        return false;
    }

    try {
        const salt = token.substring(64);
        const key = await getCryptoKey();
        const expected = decodeHex(token.substring(0, 64));

        return await crypto.subtle.verify("HMAC", key, expected, text.encode(discordId + salt));
    } catch (error) {
        console.error("Token verification failed:", error.message);
        return false;
    }
}

// --- Example Usage ---

/*
const user1 = "12345";

// User 1 starts verification for their first account
const token1 = await generateToken(user1);
console.log(`Token 1: ${token1}`);

// User 1 starts verification for a *second* account
const token2 = await generateToken(user1);
console.log(`Token 2: ${token2}`); // This is a different token!

// --- Verification Checks ---

// User 1 verifies their first account
const check1 = await verifyToken(token1, user1);
console.log(`Check 1 (correct): ${check1}`); // true

// User 1 verifies their second account
const check2 = await verifyToken(token2, user1);
console.log(`Check 2 (correct): ${check2}`); // true

// User 2 ("67890") tries to use User 1's token
const check3 = await verifyToken(token1, "67890");
console.log(`Check 3 (wrong user): ${check3}`); // false
*/