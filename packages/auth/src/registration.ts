import { createHash, randomBytes, randomUUID } from "node:crypto";
import type { Db } from "@crm/db";

const INVITE = {
	prefix: "traceback-registration:",
	lifetimeMs: 7 * 24 * 60 * 60 * 1000,
	bytes: 32,
} as const;

function identifier(token: string): string {
	return INVITE.prefix + createHash("sha256").update(token).digest("hex");
}

export async function createRegistrationInvite(db: Db, email: string | null) {
	if (email === null && (await db.user.count()) !== 0) {
		throw new Error("The owner account already exists.");
	}
	const token = randomBytes(INVITE.bytes).toString("base64url");
	const expiresAt = new Date(Date.now() + INVITE.lifetimeMs);
	await db.verification.create({
		data: {
			id: randomUUID(),
			identifier: identifier(token),
			value: email?.trim().toLowerCase() ?? "*",
			expiresAt,
		},
	});
	return { token, expiresAt: expiresAt.toISOString() };
}

export async function consumeRegistrationInvite(
	db: Db,
	email: string,
	token: string | null | undefined,
): Promise<boolean> {
	if (!token || !/^[A-Za-z0-9_-]{43}$/.test(token)) return false;
	const values = [email.trim().toLowerCase()];
	if ((await db.user.count()) === 0) values.push("*");
	const result = await db.verification.deleteMany({
		where: {
			identifier: identifier(token),
			value: { in: values },
			expiresAt: { gt: new Date() },
		},
	});
	return result.count === 1;
}
